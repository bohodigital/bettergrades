import assert from "node:assert/strict";
import test from "node:test";

import {
  SamplingError,
  clipSegmentsToViewport,
  sampleAdaptiveFunction,
  sampleAdaptiveParametric,
  sampleAdaptivePolar,
} from "../lib/visualization/sampling/index.ts";

const viewport = { xMin: -2, xMax: 2, yMin: -4, yMax: 4 };

function crossesX(segment, x) {
  return segment.some((point, index) => index > 0 && ((segment[index - 1].x < x && point.x > x) || (segment[index - 1].x > x && point.x < x)));
}

test("smooth adaptive sampling is deterministic", () => {
  const options = { xMin: -2, xMax: 2, viewport, initialIntervals: 8, tolerance: 0.001, maxSamples: 2_000 };
  const first = sampleAdaptiveFunction((x) => x * x, options);
  const second = sampleAdaptiveFunction((x) => x * x, options);
  assert.deepEqual(first, second);
  assert.equal(first.truncated, false);
  assert.ok(first.segments.length >= 1);
  assert.ok(first.sampleCount <= 2_000);
});

test("holes and undefined domain boundaries split curves", () => {
  const hole = sampleAdaptiveFunction((x) => x === 0 ? Number.NaN : x + 1, {
    xMin: -1,
    xMax: 1,
    viewport,
    explicitBreaks: [0],
    maxDepth: 8,
  });
  assert.ok(hole.segments.length >= 2);
  assert.equal(hole.segments.some((segment) => crossesX(segment, 0)), false);

  const boundary = sampleAdaptiveFunction((x) => x < 0 ? Number.NaN : Math.sqrt(x), {
    xMin: -1,
    xMax: 1,
    viewport,
    maxDepth: 10,
  });
  assert.equal(boundary.segments.flat().some((point) => point.x < 0), false);
});

test("jump discontinuities are not connected by false diagonal segments", () => {
  const result = sampleAdaptiveFunction((x) => x < 0 ? -2 : 2, {
    xMin: -1,
    xMax: 1,
    viewport,
    explicitBreaks: [0],
    maxDepth: 10,
  });
  assert.ok(result.segments.length >= 2);
  assert.equal(result.segments.some((segment) => crossesX(segment, 0)), false);
});

test("vertical asymptotes never receive a bridging segment", () => {
  const result = sampleAdaptiveFunction((x) => 1 / x, {
    xMin: -1,
    xMax: 1,
    viewport,
    explicitBreaks: [0],
    maxDepth: 12,
    maxSamples: 4_000,
  });
  assert.ok(result.segments.length >= 2);
  assert.equal(result.segments.some((segment) => crossesX(segment, 0)), false);
  for (const segment of result.segments) {
    const signs = new Set(segment.map((point) => Math.sign(point.x)));
    assert.equal(signs.has(-1) && signs.has(1), false);
  }
});

test("rapid oscillation refines within the sample ceiling", () => {
  const result = sampleAdaptiveFunction((x) => Math.sin(40 * x), {
    xMin: -1,
    xMax: 1,
    viewport,
    initialIntervals: 32,
    tolerance: 0.001,
    maxSamples: 10_000,
  });
  assert.ok(result.sampleCount > 100);
  assert.ok(result.sampleCount <= 10_000);
});

test("parametric loops and polar discontinuities use the same bounded sampler", () => {
  const loop = sampleAdaptiveParametric((t) => ({ x: Math.cos(t), y: Math.sin(t) }), {
    parameterMin: 0,
    parameterMax: Math.PI * 2,
    viewport,
    tolerance: 0.001,
  });
  assert.ok(loop.segments.length >= 1);
  const first = loop.segments[0][0];
  const lastSegment = loop.segments[loop.segments.length - 1];
  const last = lastSegment[lastSegment.length - 1];
  assert.ok(Math.hypot(first.x - last.x, first.y - last.y) < 1e-9);

  const polar = sampleAdaptivePolar((angle) => 1 / Math.cos(angle), {
    parameterMin: 0,
    parameterMax: Math.PI,
    viewport,
    explicitBreaks: [Math.PI / 2],
    maxSamples: 4_000,
  });
  assert.ok(polar.segments.length >= 2);
});

test("viewport clipping bounds every retained point", () => {
  const raw = sampleAdaptiveFunction((x) => 4 * x, {
    xMin: -2,
    xMax: 2,
    viewport,
  });
  const clipped = clipSegmentsToViewport(raw.segments, viewport);
  assert.ok(clipped.length > 0);
  for (const point of clipped.flat()) {
    assert.ok(point.x >= viewport.xMin - 1e-12 && point.x <= viewport.xMax + 1e-12);
    assert.ok(point.y >= viewport.yMin - 1e-12 && point.y <= viewport.yMax + 1e-12);
  }
});

test("sample ceilings and cancellation fail closed", () => {
  assert.throws(
    () => sampleAdaptiveFunction((x) => Math.sin(1 / x), { xMin: -1, xMax: 1, viewport, maxSamples: 16, tolerance: 1e-9 }),
    (error) => error instanceof SamplingError && error.code === "sample-budget",
  );
  const controller = new AbortController();
  controller.abort();
  assert.throws(
    () => sampleAdaptiveFunction((x) => x, { xMin: -1, xMax: 1, viewport, signal: controller.signal }),
    (error) => error instanceof SamplingError && error.code === "aborted",
  );
});
