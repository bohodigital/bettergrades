import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { RENDERER_REGISTRY } from "../lib/visualization/capabilities/index.ts";
import {
  ControlKindSchema,
  ReservedVisualKindSchema,
  VisualCapabilitySchema,
  VisualKindSchema,
  VisualLayerKindSchema,
} from "../lib/visualization/schema/index.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const requiredDocuments = [
  "README.md",
  "ARCHITECTURE.md",
  "VISUALSPEC_REFERENCE.md",
  "AUTHORING_GUIDE.md",
  "RENDERER_SELECTION.md",
  "RENDERER_CAPABILITIES.md",
  "STATIC_SVG_RENDERER.md",
  "BETTERGRADES_INTERACTIVE_2D.md",
  "JSXGRAPH_ADAPTER.md",
  "UPLOT_ADAPTER.md",
  "ADDING_A_RENDERER.md",
  "EXPRESSION_PIPELINE.md",
  "SAMPLING_AND_DISCONTINUITIES.md",
  "ACCESSIBILITY.md",
  "PERFORMANCE_BUDGETS.md",
  "CLOUDFLARE_DELIVERY.md",
  "PRINT_AND_EXPORT.md",
  "TESTING.md",
  "TROUBLESHOOTING.md",
  "LIMITS_MIGRATION.md",
  "CROSS_SUBJECT_FIXTURES.md",
  "DEPENDENCIES.md",
  "RELEASE_AND_ROLLBACK.md",
  "CHANGELOG.md",
];

test("BVLP documentation vocabulary stays synchronized with code and migration evidence", () => {
  for (const name of requiredDocuments) {
    const path = `docs/visual-platform/${name}`;
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), true, `${path} must exist`);
    assert.ok(read(path).trim().length > 0, `${path} must not be empty`);
  }

  const visualSpecReference = read("docs/visual-platform/VISUALSPEC_REFERENCE.md");
  for (const value of [
    ...VisualKindSchema.options,
    ...ReservedVisualKindSchema.options,
    ...VisualLayerKindSchema.options,
    ...ControlKindSchema.options,
  ]) {
    assert.ok(visualSpecReference.includes(`\`${value}\``), `${value} must be documented`);
  }

  const capabilityReference = read("docs/visual-platform/RENDERER_CAPABILITIES.md");
  for (const capability of VisualCapabilitySchema.options) {
    assert.ok(capabilityReference.includes(`\`${capability}\``), `${capability} must be documented`);
  }
  for (const renderer of RENDERER_REGISTRY.values()) {
    assert.ok(capabilityReference.includes(`\`${renderer.id}\``), `${renderer.id} must be in the policy matrix`);
    assert.ok(renderer.preferredUseCases.length > 0, `${renderer.id} must declare use guidance`);
    assert.ok(renderer.prohibitedUseCases.length > 0, `${renderer.id} must declare anti-use guidance`);
    if (renderer.runtimeClass === "browser-lazy" && renderer.status === "installed") {
      assert.ok(renderer.fallbackRenderer, `${renderer.id} must declare a fallback`);
    }
  }

  const dependencyReference = read("docs/visual-platform/DEPENDENCIES.md");
  const packageJson = JSON.parse(read("package.json"));
  for (const name of [
    "zod",
    "@cortex-js/compute-engine",
    "d3-scale",
    "d3-shape",
    "jsxgraph",
    "uplot",
  ]) {
    assert.ok(packageJson.dependencies[name], `${name} must be pinned in package.json`);
    assert.ok(dependencyReference.includes(`\`${name}\``), `${name} must be documented`);
  }

  const migrationReference = read("docs/visual-platform/LIMITS_MIGRATION.md");
  const manifest = JSON.parse(read("content/visualizations/limits-continuity/migration-manifest.v1.json"));
  assert.equal(manifest.mappings.length, 13);
  for (const mapping of manifest.mappings) {
    assert.ok(migrationReference.includes(`\`${mapping.stableId}\``), `${mapping.stableId} must be documented`);
    assert.ok(mapping.printFigure, `${mapping.stableId} must have a print mapping`);
  }

  const architecture = read("docs/visual-platform/ARCHITECTURE.md");
  for (const adr of [
    "0001-renderer-neutral-visualspec.md",
    "0002-static-svg-default.md",
    "0003-interactive-renderer-hierarchy.md",
    "0004-expression-compilation-boundary.md",
    "0005-cloudflare-delivery-model.md",
    "0006-adapter-isolation.md",
  ]) {
    assert.match(architecture, new RegExp(adr.replaceAll(".", "\\.")), `${adr} must be referenced by architecture docs`);
    assert.equal(existsSync(new URL(`../docs/visual-platform/adr/${adr}`, import.meta.url)), true);
  }
});
