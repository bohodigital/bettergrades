import assert from "node:assert/strict";
import test from "node:test";

import {
  makePlotTransform,
  mediaPrefersReducedMotion,
  observeElementSize,
  panViewport,
  sampleExpressionPath,
  zoomViewport,
} from "../lib/visualization/renderers/bg-interactive-2d/runtime.ts";

const original = { xMin: -1, xMax: 3, yMin: -2, yMax: 6 };

test("pan, zoom, and reset inputs are deterministic and bounded", () => {
  const plot = makePlotTransform(original, 720, 420);
  const zoomed = zoomViewport(original, 0.5, { x: 1, y: 2 }, original);
  assert.deepEqual(zoomed, { xMin: 0, xMax: 2, yMin: 0, yMax: 4 });
  const deeplyZoomed = Array.from({ length: 12 }).reduce((view) => zoomViewport(view, 0.1, { x: 1, y: 2 }, original), original);
  assert.equal(deeplyZoomed.xMax - deeplyZoomed.xMin, 0.5);
  assert.equal(deeplyZoomed.yMax - deeplyZoomed.yMin, 1);
  const panned = panViewport(original, { x: 100, y: -50 }, plot);
  assert.ok(panned.xMin < original.xMin);
  assert.ok(panned.yMin < original.yMin);
  assert.equal(Number(plot.inverseX(plot.x(1)).toFixed(10)), 1);
  assert.equal(Number(plot.inverseY(plot.y(2)).toFixed(10)), 2);
});

test("size observation returns cleanup that disconnects the observer", () => {
  const element = {};
  let observed = null;
  let disconnected = false;
  let callback;
  let width = 0;
  const cleanup = observeElementSize(element, (next) => { width = next; }, (nextCallback) => {
    callback = nextCallback;
    return {
      observe(nextElement) { observed = nextElement; },
      disconnect() { disconnected = true; },
    };
  });
  assert.equal(observed, element);
  callback([{ contentRect: { width: 480 } }]);
  assert.equal(width, 480);
  cleanup();
  assert.equal(disconnected, true);
});

test("reduced-motion preference is read without starting animation", () => {
  assert.equal(mediaPrefersReducedMotion({ matches: true }), true);
  assert.equal(mediaPrefersReducedMotion({ matches: false }), false);
});

test("compiled AST paths are deterministic and fail closed on undeclared variables", () => {
  const plot = makePlotTransform(original, 720, 420);
  const scene = {
    id: "interactive-fixture",
    performance: {
      maxSamples: 64,
      maxAstDepth: 12,
      maxAstNodes: 32,
      maxOperationsPerEvaluation: 128,
    },
  };
  const domain = { min: -1, max: 1, includeMin: true, includeMax: true };
  const square = {
    type: "power",
    left: { type: "variable", name: "x" },
    right: { type: "number", value: 2 },
  };
  const first = sampleExpressionPath(square, "x", domain, {}, scene, plot);
  const second = sampleExpressionPath(square, "x", domain, {}, scene, plot);
  assert.equal(first, second);
  assert.match(first, /^M/);
  assert.doesNotMatch(first, /NaN|Infinity/);
  assert.throws(
    () => sampleExpressionPath({ type: "variable", name: "undeclared" }, "x", domain, {}, scene, plot),
    /not allowlisted/,
  );
});
