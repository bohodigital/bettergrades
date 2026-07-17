import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createCortexJsLatexCompiler } from "../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpecs } from "../lib/visualization/compiler/index.ts";
import { assertStaticSvgSafety, renderStaticSvg } from "../lib/visualization/renderers/static-svg/index.ts";

const collection = JSON.parse(
  await readFile(new URL("../content/visualizations/limits-continuity/visual-specs.v1.json", import.meta.url), "utf8"),
);

const allowedVariables = new Set();
for (const visual of collection.visuals) {
  for (const variable of visual.coordinateSpace.variables) allowedVariables.add(variable);
  for (const control of visual.controls) if (typeof control.parameter === "string") allowedVariables.add(control.parameter);
}
const compileLatex = await createCortexJsLatexCompiler({
  allowedVariables: [...allowedVariables],
  maxDepth: 32,
  maxNodes: 512,
  maxExpressionLength: 2_048,
});

test("all 13 migrated Limits scenes compile and render deterministically below the static asset release budget", () => {
  const scenes = compileVisualSpecs(collection.visuals, { compileLatex });
  assert.equal(scenes.length, 13);
  for (const scene of scenes) {
    const first = renderStaticSvg(scene, { maxOutputBytes: 50_000 });
    const second = renderStaticSvg(scene, { maxOutputBytes: 50_000 });
    assert.deepEqual(first, second, scene.id);
    assert.ok(first.byteLength < 50_000, `${scene.id}: ${first.byteLength}`);
    assert.equal(first.meetsTarget, true, scene.id);
    assert.equal(first.requiresSizeJustification, false, scene.id);
    assert.match(first.svg, new RegExp(`data-bvlp-scene="${scene.id}"`), scene.id);
    assert.doesNotMatch(first.svg, /(?:NaN|expressionLatex|\\frac|\\sin|\\varepsilon|<script|<image|<foreignObject)/i, scene.id);
    assert.doesNotMatch(first.svg, /(?:d|x|y|cx|cy|x1|x2|y1|y2)="[^"]*Infinity/i, scene.id);
    assert.doesNotThrow(() => assertStaticSvgSafety(first.svg, scene.id), scene.id);
  }
});

test("the two migrated small-multiple scenes render explicit titled and clipped panels", () => {
  const scenes = compileVisualSpecs(collection.visuals, { compileLatex });
  for (const [sceneId, expectedPanels] of [["vertical-asymptotes", 2], ["discontinuity-gallery", 4]]) {
    const scene = scenes.find(({ id }) => id === sceneId);
    const { svg } = renderStaticSvg(scene);
    assert.equal(scene.panels.length, expectedPanels);
    for (const panel of scene.panels) {
      assert.match(svg, new RegExp(`panel-${panel.id}-title`), `${sceneId}/${panel.id}`);
      assert.match(svg, new RegExp(`panel-${panel.id}-desc`), `${sceneId}/${panel.id}`);
      assert.match(svg, new RegExp(`panel-${panel.id}-clip`), `${sceneId}/${panel.id}`);
    }
  }
});
