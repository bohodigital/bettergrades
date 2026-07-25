import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { pagesPackageHash } from "../../lib/seo/build-hash.mjs";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.split("=");
  return [key, value.join("=")];
}));
const beforeDir = resolve(args.get("--before") ?? "");
const afterDir = resolve(args.get("--after") ?? "");
const output = resolve(args.get("--output") ?? "artifacts/ia/build-reproducibility.json");
const acceptedBaselineRawHash = args.get("--accepted-baseline-raw-hash") ?? null;
const root = resolve(import.meta.dirname, "../..");

if (!args.has("--before") || !args.has("--after")) {
  throw new Error("Usage: node tools/ia-audit/build-reproducibility.mjs --before=<pages-dir> --after=<pages-dir> [--output=<json>] [--accepted-baseline-raw-hash=<sha256>]");
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries
    .filter((entry) => entry.name !== ".DS_Store")
    .map((entry) => entry.isDirectory() ? filesBelow(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

function normalizeBuildSpecificBytes(path, bytes) {
  if (!/\.(?:html|js|json)$/.test(path)) return bytes;
  return Buffer.from(bytes.toString()
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<BUILD_UUID>")
    .replace(/("prerenderSecret"\s*:\s*")[0-9a-f]{64}(")/gi, "$1<PRERENDER_SECRET>$2"));
}

async function normalizedPackageHash(directory) {
  const digest = createHash("sha256");
  for (const path of (await filesBelow(directory)).sort()) {
    digest.update(relative(directory, path));
    digest.update("\0");
    digest.update(normalizeBuildSpecificBytes(path, await readFile(path)));
    digest.update("\0");
  }
  return digest.digest("hex");
}

const beforePaths = (await filesBelow(beforeDir)).map((path) => relative(beforeDir, path)).sort();
const afterPaths = (await filesBelow(afterDir)).map((path) => relative(afterDir, path)).sort();
const allPaths = [...new Set([...beforePaths, ...afterPaths])].sort();
const rawDifferences = [];
const normalizedDifferences = [];

for (const path of allPaths) {
  const before = await readFile(join(beforeDir, path)).catch(() => null);
  const after = await readFile(join(afterDir, path)).catch(() => null);
  if (!before || !after || !before.equals(after)) rawDifferences.push(path);
  if (!before || !after || !normalizeBuildSpecificBytes(path, before).equals(normalizeBuildSpecificBytes(path, after))) {
    normalizedDifferences.push(path);
  }
}

const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();
const result = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceCommit,
  sourceTree,
  routeCount: 509,
  toolVersion: "1.0.0",
  failureCount: normalizedDifferences.length,
  acceptedBaselineRawHash,
  beforeRawHash: await pagesPackageHash(beforeDir),
  afterRawHash: await pagesPackageHash(afterDir),
  beforeNormalizedHash: await normalizedPackageHash(beforeDir),
  afterNormalizedHash: await normalizedPackageHash(afterDir),
  fileCountBefore: beforePaths.length,
  fileCountAfter: afterPaths.length,
  rawDifferenceCount: rawDifferences.length,
  normalizedDifferenceCount: normalizedDifferences.length,
  normalizedFields: ["VINEXT build/deployment/draft UUIDs", "VINEXT prerenderSecret"],
  conclusion: normalizedDifferences.length === 0
    ? "Public source output is equivalent after removing per-build VINEXT identifiers."
    : "Normalized public output differs and requires investigation.",
  rawDifferences,
  normalizedDifferences,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
