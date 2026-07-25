import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { build } from "esbuild";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const bundle = resolve(tmpdir(), `bettergrades-search-test-${process.pid}.mjs`);
let searchSite;

before(async () => {
  await build({ entryPoints: [resolve(root, "lib/site-search.ts")], outfile: bundle, bundle: true, platform: "node", format: "esm", logLevel: "silent" });
  ({ searchSite } = await import(`${pathToFileURL(bundle).href}?v=${Date.now()}`));
});
after(async () => rm(bundle, { force: true }));

const exactCases = [
  ["Mathematics variable and notation conventions", "/glossary/math/conventions/"],
  ["Mathematics practice", "/practice/math/"],
  ["Calculus practice", "/practice/math/calculus/"],
  ["Washer method or shell method?", "/subjects/math/calculus/integration-applications/washer-vs-shell/"],
  ["Why does the harmonic series diverge?", "/subjects/math/calculus/sequences-series/harmonic-series-diverges/"],
];

test("audited exact titles rank their canonical route first", () => {
  for (const [query, route] of exactCases) assert.equal(searchSite(query)[0]?.path, route, query);
});

test("audited aliases, skills, slugs, and path fragments resolve", () => {
  const cases = [
    ["conventions", "/glossary/math/conventions/"],
    ["assessment math", "/practice/math/"],
    ["assessment calculus", "/practice/math/calculus/"],
    ["lhopital zero over zero", "/subjects/math/calculus/derivative-applications/lhopital-zero-over-zero/"],
    ["washer vs shell", "/subjects/math/calculus/integration-applications/washer-vs-shell/"],
  ];
  for (const [query, route] of cases) assert.ok(searchSite(query).some((record) => record.path === route), query);
});

test("body matches never outrank an exact title", () => {
  for (const [query, route] of exactCases) assert.equal(searchSite(query)[0]?.path, route);
});
