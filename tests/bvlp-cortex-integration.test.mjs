import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createCortexJsLatexCompiler } from "../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpecs } from "../lib/visualization/compiler/index.ts";

const collection = JSON.parse(
  await readFile(new URL("../content/visualizations/limits-continuity/visual-specs.v1.json", import.meta.url), "utf8"),
);

test("the real build-only CortexJS boundary compiles every migrated Limits expression", async () => {
  const allowedVariables = new Set();
  for (const spec of collection.visuals) {
    for (const variable of spec.coordinateSpace.variables) allowedVariables.add(variable);
    for (const control of spec.controls ?? []) {
      if (typeof control.parameter === "string") allowedVariables.add(control.parameter);
    }
  }

  const compileLatex = await createCortexJsLatexCompiler({
    allowedVariables: [...allowedVariables],
    maxDepth: 32,
    maxNodes: 512,
  });
  const scenes = compileVisualSpecs(collection.visuals, { compileLatex });

  assert.equal(scenes.length, 13);
  assert.deepEqual(scenes.map((scene) => scene.id), collection.visuals.map((spec) => spec.id));
  assert.equal(/expressionLatex|\\\\frac|\\\\sin|\\\\varepsilon/.test(JSON.stringify(scenes)), false);
});
