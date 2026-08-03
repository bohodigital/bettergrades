import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const countArgument = process.argv.find((argument) => argument.startsWith("--shard-count="));
const shardCount = Number(countArgument?.split("=")[1]);
if (!Number.isInteger(shardCount) || shardCount < 2) throw new Error("Pass --shard-count with an integer of at least 2.");

const reports = await Promise.all(Array.from({ length: shardCount }, async (_, index) => {
  const name = `final-rendered-dom-audit.shard-${String(index).padStart(3, "0")}-of-${String(shardCount).padStart(3, "0")}.json`;
  return JSON.parse(await readFile(resolve(root, "artifacts", "seo", name), "utf8"));
}));
const reference = reports[0];
for (const [index, report] of reports.entries()) {
  if (report.shard?.index !== index || report.shard?.count !== shardCount) throw new Error(`Shard ${index} has invalid coordinates.`);
  for (const field of ["sourceCommit", "sourceTree", "buildHash", "totalSiteRouteCount"]) {
    if (report[field] !== reference[field]) throw new Error(`Shard ${index} disagrees on ${field}.`);
  }
}

const routes = reports.flatMap((report) => report.routes);
if (routes.length !== reference.totalSiteRouteCount || new Set(routes.map((route) => route.path)).size !== routes.length) {
  throw new Error(`Combined rendered-DOM coverage is incomplete: ${routes.length}/${reference.totalSiteRouteCount} unique routes.`);
}
routes.sort((left, right) => left.path.localeCompare(right.path));
const failures = routes.filter((entry) => entry.error
  || entry.status !== 200
  || entry.h1Count !== 1
  || entry.mainCount !== 1
  || entry.noscriptCount !== 0
  || entry.overflowPixels > 1
  || entry.visibleTextLength < 80
  || entry.softError
  || entry.malformedMath
  || entry.editorialLeak
  || entry.consoleErrors?.length
  || entry.failedRequests?.length);
const combined = {
  ...reference,
  label: "final-local-combined",
  generatedAt: new Date().toISOString(),
  routeCount: routes.length,
  shard: { count: shardCount, combined: true, partition: "sitemap-order-index-modulo" },
  resumedPassingRoutes: reports.reduce((sum, report) => sum + (report.resumedPassingRoutes ?? 0), 0),
  failureCount: failures.length,
  failures,
  routes,
  pass: failures.length === 0,
};
await writeFile(resolve(root, "artifacts", "seo", "final-rendered-dom-audit.json"), `${JSON.stringify(combined, null, 2)}\n`);
console.log(JSON.stringify({ routeCount: combined.routeCount, failureCount: combined.failureCount, pass: combined.pass }, null, 2));
if (!combined.pass) process.exitCode = 1;
