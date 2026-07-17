import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { compileVisualSpec } from "../lib/visualization/compiler/index.ts";
import { inferRequiredCapabilities } from "../lib/visualization/capabilities/index.ts";
import { VisualSpecSchema } from "../lib/visualization/schema/index.ts";

const FIXTURE_PATH = "content/visualizations/fixtures/cross-domain.visual-specs.v1.json";
const raw = readFileSync(FIXTURE_PATH, "utf8");
const fixtures = JSON.parse(raw);

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  }).filter((path) => /\.(?:ts|tsx|mjs|json)$/.test(path));
}

test("five cross-domain fixtures are strict VisualSpec v1 records and remain non-public", () => {
  assert.equal(fixtures.length, 5);
  assert.deepEqual(fixtures.map((fixture) => fixture.id), [
    "fixture-algebra-function",
    "fixture-linear-algebra-basis",
    "fixture-ode-direction-field",
    "fixture-physics-free-body",
    "fixture-chemistry-reaction-coordinate",
  ]);
  for (const fixture of fixtures) {
    const parsed = VisualSpecSchema.parse(fixture);
    assert.equal(parsed.schemaVersion, 1);
    assert.equal(parsed.provenance.visibility, "fixture");
    assert.match(parsed.provenance.route, /^\/__nonpublic__\/fixtures\//);
    assert.match(parsed.learningPurpose, /^Validate /);
    assert.doesNotMatch(parsed.provenance.route, /^\/subjects\//);
  }
  assert.doesNotMatch(raw, /unit\s*2a|chapter\s*2a|lesson\s*2a/i);
});

test("fixtures exercise cross-domain vocabulary and deterministic capability resolution", () => {
  const expected = new Map([
    ["fixture-algebra-function", { kind: "cartesian-2d", renderer: "static-svg", layers: ["function"] }],
    ["fixture-linear-algebra-basis", { kind: "matrix-transform-2d", renderer: "static-svg", layers: ["basis-grid", "vector"] }],
    ["fixture-ode-direction-field", { kind: "direction-field", renderer: "jsxgraph", layers: ["direction-arrow"] }],
    ["fixture-physics-free-body", { kind: "free-body-diagram", renderer: "static-svg", layers: ["closed-point", "vector"] }],
    ["fixture-chemistry-reaction-coordinate", { kind: "reaction-coordinate", renderer: "static-svg", layers: ["sampled-series", "data-marker"] }],
  ]);

  for (const fixture of fixtures) {
    const contract = expected.get(fixture.id);
    assert.ok(contract, fixture.id);
    assert.equal(fixture.kind, contract.kind);
    const kinds = new Set(fixture.layers.map((layer) => layer.kind));
    for (const kind of contract.layers) assert.ok(kinds.has(kind), `${fixture.id}: ${kind}`);
    const inferred = inferRequiredCapabilities(VisualSpecSchema.parse(fixture));
    for (const capability of inferred) {
      assert.ok(fixture.requiredCapabilities.includes(capability), `${fixture.id}: ${capability}`);
    }
    const scene = compileVisualSpec(fixture);
    assert.equal(scene.selectedRenderer, contract.renderer);
    assert.equal(scene.provenance.visibility, "fixture");
    assert.equal(scene.delivery.hydration, contract.renderer === "jsxgraph" ? "explicit-user-action" : "none");
    assert.equal(scene.staticFallback.required, true);
  }
});

test("fixture collection is not imported by routes, sitemap, search, or the public compiler", () => {
  const publicationSources = [
    ...sourceFiles("app"),
    ...sourceFiles("lib/registry"),
    "lib/site-search.ts",
    "tools/visualization/compile-visuals.mjs",
  ];
  const fixtureIds = fixtures.map((fixture) => fixture.id);
  for (const path of publicationSources) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /content\/visualizations\/fixtures|cross-domain\.visual-specs/i, path);
    for (const id of fixtureIds) assert.doesNotMatch(source, new RegExp(id), path);
  }
  const compilerSource = readFileSync("tools/visualization/compile-visuals.mjs", "utf8");
  assert.match(compilerSource, /content\/visualizations\/limits-continuity\/visual-specs\.v1\.json/);
});
