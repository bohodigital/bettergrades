import assert from "node:assert/strict";
import test from "node:test";

import {
  epsilonDeltaMetrics,
  secantMetrics,
  sceneValueSummary,
  unitCircleMetrics,
} from "../lib/visualization/renderers/bg-interactive-2d/metrics.ts";

test("secant metrics converge toward the authored tangent slope", () => {
  const ordinary = secantMetrics(0.2);
  assert.equal(Number(ordinary.slope.toFixed(8)), 28.8);
  assert.deepEqual(ordinary.pointP, [1, 48]);
  assert.deepEqual(ordinary.pointQ, [1.2, 53.76]);
  assert.ok(Math.abs(secantMetrics(0.001).slope - 32) < 0.02);
  assert.throws(() => secantMetrics(0), /nonzero/);
});

test("epsilon-delta metrics use the restrictive nonlinear boundary", () => {
  const metrics = epsilonDeltaMetrics(0.75);
  assert.equal(metrics.lowerOutput, 2.25);
  assert.equal(metrics.upperOutput, 3.75);
  assert.equal(Number(metrics.delta.toFixed(6)), 0.345208);
  assert.equal(Number(metrics.leftInput.toFixed(6)), 1.654792);
  assert.equal(Number(metrics.rightInput.toFixed(6)), 2.345208);
  const leftOutput = (metrics.leftInput ** 2) / 2 + 1;
  const rightOutput = (metrics.rightInput ** 2) / 2 + 1;
  assert.ok(leftOutput > metrics.lowerOutput);
  assert.ok(Math.abs(rightOutput - metrics.upperOutput) < 1e-12);
});

test("unit-circle areas retain the squeeze ordering", () => {
  const metrics = unitCircleMetrics(0.6);
  assert.ok(metrics.innerTriangleArea < metrics.sectorArea);
  assert.ok(metrics.sectorArea < metrics.outerTriangleArea);
  assert.throws(() => unitCircleMetrics(Math.PI / 2), /below/);
});

test("scene summaries expose the changed mathematical values", () => {
  assert.match(sceneValueSummary("secant-tangent", { h: 0.2 }), /28\.8/);
  assert.match(sceneValueSummary("epsilon-delta-window", { varepsilon: 0.75 }), /0\.345208/);
  assert.match(sceneValueSummary("squeeze-bounds", { "bounds-toggle": false }), /hidden/);
});

