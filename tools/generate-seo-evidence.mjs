import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { readableMath } from "../lib/math-readable.mjs";

const root = resolve(import.meta.dirname, "..");
const artifacts = resolve(root, "artifacts", "seo");
const inventory = JSON.parse(await readFile(resolve(artifacts, "final-route-inventory.json"), "utf8"));
const redirectAudit = JSON.parse(await readFile(resolve(artifacts, "final-redirect-audit.json"), "utf8"));
const sitemap = await readFile(resolve(root, "dist", "pages", "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapPaths = sitemapUrls.map((url) => new URL(url).pathname);
const sitemapPathSet = new Set(sitemapPaths);

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const migrationColumns = [
  "source_url",
  "target_url",
  "decision",
  "http_status",
  "chain_depth",
  "target_status",
  "target_in_sitemap",
  "evidence",
  "status",
];
const migrationRows = redirectAudit.redirects.map((redirect) => ({
  source_url: redirect.from,
  target_url: redirect.to,
  decision: "REDIRECT",
  http_status: redirect.status,
  chain_depth: redirect.oneHop ? 1 : "",
  target_status: redirect.targetStatus,
  target_in_sitemap: sitemapPathSet.has(redirect.to),
  evidence: "canonical registry redirect; local one-hop verification",
  status: redirect.oneHop ? "VERIFIED_LOCAL" : "FAILED",
}));
const migrationCsv = [
  migrationColumns.join(","),
  ...migrationRows.map((row) => migrationColumns.map((column) => csvCell(row[column])).join(",")),
].join("\n");

const sitemapVerification = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sitemapUrlCount: sitemapUrls.length,
  uniqueUrlCount: new Set(sitemapUrls).size,
  inventoryRouteCount: inventory.routeCount,
  duplicateUrlCount: sitemapUrls.length - new Set(sitemapUrls).size,
  redirectedSourceUrlCount: redirectAudit.redirects.filter((redirect) => sitemapPathSet.has(redirect.from)).length,
  missingInventoryPathCount: inventory.routes.filter((route) => !sitemapPathSet.has(route.path)).length,
  unexpectedStatusCount: inventory.unexpectedStatusCount,
  canonicalMismatchCount: inventory.canonicalMismatchCount,
  pass: sitemapUrls.length === inventory.routeCount
    && new Set(sitemapUrls).size === sitemapUrls.length
    && redirectAudit.redirects.every((redirect) => !sitemapPathSet.has(redirect.from))
    && inventory.unexpectedStatusCount === 0
    && inventory.canonicalMismatchCount === 0,
};

const redirectVerification = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  redirectCount: redirectAudit.redirects.length,
  oneHopCount: redirectAudit.redirects.filter((redirect) => redirect.oneHop).length,
  failureCount: redirectAudit.redirects.filter((redirect) => !redirect.oneHop).length,
  loopCount: redirectAudit.redirects.filter((redirect) => redirect.from === redirect.to).length,
  redirectedSourceInSitemapCount: redirectAudit.redirects.filter((redirect) => sitemapPathSet.has(redirect.from)).length,
  pass: redirectAudit.redirects.every((redirect) => redirect.oneHop)
    && redirectAudit.redirects.every((redirect) => redirect.from !== redirect.to)
    && redirectAudit.redirects.every((redirect) => !sitemapPathSet.has(redirect.from)),
  redirects: redirectAudit.redirects,
};

const mathFixtures = [
  "\\frac{1}{3}",
  "\\frac{1}{\\frac{2}{3}}",
  "x^2+x_1",
  "\\sum_{n=1}^{\\infty} ar^{n-1}",
  "\\lim_{x\\to0}\\frac{\\sin x}{x}",
  "\\int_0^1 x^2\\,dx",
  "\\begin{cases}x^2&x<0\\\\x&x\\ge0\\end{cases}",
  "\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}",
  "\\text{distance}=|x-2|",
  "a_1+a_2+\\cdots+a_n",
];
const mathematicalVerification = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  serializer: "KaTeX AST",
  fixtureCount: mathFixtures.length,
  malformedPublicRouteCount: inventory.malformedMathRouteCount,
  fixtures: mathFixtures.map((latex) => ({ latex, readable: readableMath(latex) })),
  pass: inventory.malformedMathRouteCount === 0,
};

const baselineLoad = await readFile(resolve(artifacts, "crawl-load-before.json"), "utf8");
await Promise.all([
  writeFile(resolve(root, "data", "seo", "url-migration-map.csv"), `${migrationCsv}\n`),
  writeFile(resolve(artifacts, "sitemap-verification.json"), `${JSON.stringify(sitemapVerification, null, 2)}\n`),
  writeFile(resolve(artifacts, "redirect-verification.json"), `${JSON.stringify(redirectVerification, null, 2)}\n`),
  writeFile(resolve(artifacts, "mathematical-verification.json"), `${JSON.stringify(mathematicalVerification, null, 2)}\n`),
  writeFile(resolve(artifacts, "baseline-crawl-load-audit.json"), baselineLoad),
]);

console.log(`Generated ${migrationRows.length} migration decisions and Release A verification artifacts.`);
