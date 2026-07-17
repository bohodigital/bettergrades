import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getPublicLimitsUnitPage } from "../lib/calculus/limits-unit.mjs";
import {
  assertManifestContract,
  assertPublicVisualSafety,
  verifyVisualArtifacts,
} from "../tools/visualization/verify-visuals.mjs";

const manifest = JSON.parse(
  await readFile(new URL("../content/visualizations/limits-continuity/compiled-scenes.v1.json", import.meta.url), "utf8"),
);

function cloneManifest() {
  return structuredClone(manifest);
}

function findVisual(nodes, id) {
  for (const node of nodes) {
    if (node.visual?.id === id) return node.visual;
    const nested = findVisual(node.children ?? [], id);
    if (nested) return nested;
  }
  return undefined;
}

test("strict visual verifier accepts the complete current artifact and public-delivery set", async () => {
  const result = await verifyVisualArtifacts();
  assert.deepEqual(result, { sceneCount: 13, interactiveCount: 4 });
});

test("manifest verifier fails closed on inventory, schema, interaction, path, and budget drift", async (t) => {
  await t.test("missing inventory entry", () => {
    const candidate = cloneManifest();
    candidate.scenes.pop();
    candidate.sceneCount -= 1;
    assert.throws(() => assertManifestContract(candidate), /sceneCount must be 13/);
  });

  await t.test("compiled schema version drift", () => {
    const candidate = cloneManifest();
    candidate.scenes[0].compiledScene.compiledSceneVersion = 2;
    assert.throws(() => assertManifestContract(candidate), /compiledSceneVersion must be 1/);
  });

  await t.test("interaction outside the four-item allowlist", () => {
    const candidate = cloneManifest();
    const scene = candidate.scenes.find((entry) => entry.id === "removable-hole");
    scene.hydration = "near-viewport";
    scene.selectedRenderer = "bg-interactive-2d";
    assert.throws(() => assertManifestContract(candidate), /hydration must be none/);
  });

  await t.test("content-addressed path drift", () => {
    const candidate = cloneManifest();
    candidate.scenes[0].staticAsset.path = "/visuals/v1/secant-tangent.stale.svg";
    assert.throws(() => assertManifestContract(candidate), /static asset path must be/);
  });

  await t.test("SVG budget regression", () => {
    const candidate = cloneManifest();
    candidate.scenes[0].staticAsset.bytes = 50_001;
    assert.throws(() => assertManifestContract(candidate), /bytes must be an integer from 1 through 50000/);
  });
});

test("public visual verifier rejects source provenance, raw LaTeX, and Cortex leakage", async (t) => {
  const page = getPublicLimitsUnitPage(
    "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/",
  );
  const visual = findVisual(page.page.nodes, "epsilon-delta-window");
  assert.ok(visual?.interactiveScene);

  await t.test("interactive sourceFile provenance", () => {
    const candidate = structuredClone(visual);
    candidate.interactiveScene.provenance.sourceFile = "internal/source.json";
    assert.throws(() => assertPublicVisualSafety(candidate, candidate.id), /prohibited field .*sourceFile/);
  });

  await t.test("raw LaTeX", () => {
    const candidate = structuredClone(visual);
    candidate.longDescription = String.raw`Raw \frac{1}{x} must not reach the visual payload.`;
    assert.throws(() => assertPublicVisualSafety(candidate, candidate.id), /exposes raw LaTeX/);
  });

  await t.test("Cortex runtime identifier", () => {
    const candidate = structuredClone(visual);
    candidate.learningPurpose = "Load @cortex-js/compute-engine";
    assert.throws(() => assertPublicVisualSafety(candidate, candidate.id), /exposes a Cortex runtime value/);
  });

  await t.test("canonical answer field", () => {
    const candidate = structuredClone(visual);
    candidate.interactiveScene.controls[0].canonicalAnswer = "secret";
    assert.throws(() => assertPublicVisualSafety(candidate, candidate.id), /exposes prohibited field/);
  });
});
