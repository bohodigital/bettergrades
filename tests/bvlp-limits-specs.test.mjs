import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { VisualSpecSchema } from "../lib/visualization/schema/index.ts";

const SPEC_PATH = "content/visualizations/limits-continuity/visual-specs.v1.json";
const collection = JSON.parse(readFileSync(SPEC_PATH, "utf8"));

const expectedRoutes = new Map([
  ["secant-tangent", "/subjects/math/calculus/limits-continuity/unit/limits/why-limits-matter/"],
  ["removable-hole", "/subjects/math/calculus/limits-continuity/unit/limits/limit-at-a-hole/"],
  ["limit-versus-value", "/subjects/math/calculus/limits-continuity/unit/limits/function-value-vs-limit/"],
  ["jump-discontinuity", "/subjects/math/calculus/limits-continuity/unit/limits/one-sided-limits/"],
  ["rapid-oscillation", "/subjects/math/calculus/limits-continuity/unit/limits/when-a-limit-does-not-exist/"],
  ["squeeze-bounds", "/subjects/math/calculus/limits-continuity/unit/limits/squeeze-theorem/"],
  ["unit-circle-squeeze", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["sine-over-x", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["vertical-asymptotes", "/subjects/math/calculus/limits-continuity/unit/limits/infinite-limits/"],
  ["horizontal-asymptote", "/subjects/math/calculus/limits-continuity/unit/limits/limits-at-infinity/"],
  ["discontinuity-gallery", "/subjects/math/calculus/limits-continuity/unit/continuity/types-of-discontinuity/"],
  ["ivt-root", "/subjects/math/calculus/limits-continuity/unit/continuity/intermediate-value-theorem/"],
  ["epsilon-delta-window", "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/"],
]);

function textOf(richText) {
  return richText.segments.map((segment) => segment.kind === "text" ? segment.text : segment.spokenText).join(" ");
}

function expressionSources(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) expressionSources(item, result);
    return result;
  }
  if (!value || typeof value !== "object") return result;
  if (value.format === "latex" || value.format === "ast") result.push(value);
  for (const nested of Object.values(value)) expressionSources(nested, result);
  return result;
}

test("all 13 authored entries parse directly as strict canonical VisualSpec v1", () => {
  assert.equal(collection.collectionSchemaVersion, 1);
  assert.equal(collection.visuals.length, 13);
  assert.equal(new Set(collection.visuals.map((visual) => visual.id)).size, 13);
  assert.deepEqual(new Set(collection.visuals.map((visual) => visual.id)), new Set(expectedRoutes.keys()));

  for (const visual of collection.visuals) {
    const result = VisualSpecSchema.safeParse(visual);
    assert.equal(result.success, true, `${visual.id}: ${result.success ? "" : result.error.message}`);
    assert.equal(visual.provenance.route, expectedRoutes.get(visual.id), visual.id);
  }
});

test("authored mathematical expressions are LaTeX sources with explicit function domains", () => {
  for (const visual of collection.visuals) {
    const sources = expressionSources(visual.layers);
    assert.ok(sources.length > 0, visual.id);
    for (const source of sources) {
      assert.equal(source.format, "latex", visual.id);
      assert.equal(typeof source.expressionLatex, "string", visual.id);
      assert.ok(source.expressionLatex.length > 0, visual.id);
    }

    for (const layer of visual.layers.filter(({ kind }) => kind === "function" || kind === "piecewise-branch")) {
      assert.equal(layer.geometry.expression.format, "latex", `${visual.id}/${layer.id}`);
      assert.equal(typeof layer.geometry.variable, "string", `${visual.id}/${layer.id}`);
      assert.equal(Number.isFinite(layer.geometry.domain.min), true, `${visual.id}/${layer.id}`);
      assert.equal(Number.isFinite(layer.geometry.domain.max), true, `${visual.id}/${layer.id}`);
      assert.ok(layer.geometry.domain.min < layer.geometry.domain.max, `${visual.id}/${layer.id}`);
      assert.equal(typeof layer.geometry.domain.includeMin, "boolean", `${visual.id}/${layer.id}`);
      assert.equal(typeof layer.geometry.domain.includeMax, "boolean", `${visual.id}/${layer.id}`);
    }
  }
});

test("canonical specs contain no renderer program, executable callback, or precompiled expression tree", () => {
  const source = readFileSync(SPEC_PATH, "utf8");
  assert.doesNotMatch(source, /\\\\begin\s*\{(?:tikzpicture|axis|groupplot)\}|\\\\(?:addplot|draw|node)\b|axis cs:/i);
  assert.doesNotMatch(source, /\b(?:JXG\.|new\s+uPlot|eval\s*\(|new\s+Function\s*\(|document\.createElement\s*\(\s*["']canvas)/i);
  assert.doesNotMatch(source, /"(?:mathJson|expressionAst|safeAst|jsExpression|callback|rendererConfig|vendorOptions)"\s*:/i);
});

test("every visual has complete exposition, accessibility, print, performance, and provenance", () => {
  for (const visual of collection.visuals) {
    assert.ok(textOf(visual.title).length >= 8, visual.id);
    assert.ok(textOf(visual.caption).length >= 40, visual.id);
    assert.ok(visual.learningPurpose.length >= 50, visual.id);
    assert.ok(visual.longDescription.length >= 140, visual.id);
    assert.ok(visual.coordinateSpace.type, visual.id);
    assert.equal(Number.isFinite(visual.viewport.xMin), true, visual.id);
    assert.equal(Number.isFinite(visual.viewport.xMax), true, visual.id);
    assert.ok(visual.axes.mode === "none" || visual.axes.axes.length > 0, visual.id);
    assert.ok(Array.isArray(visual.panels), visual.id);
    assert.ok(visual.layers.length > 0, visual.id);
    assert.ok(Array.isArray(visual.controls), visual.id);

    assert.ok(visual.accessibility.ariaLabel.length >= 30, visual.id);
    assert.ok(visual.accessibility.summary.length >= 50, visual.id);
    assert.ok(visual.accessibility.readingOrder.length > 0, visual.id);
    assert.ok(visual.accessibility.colorIndependentDescription.length >= 50, visual.id);
    assert.equal(visual.accessibility.staticFallbackEquivalent, true, visual.id);

    assert.equal(visual.print.representation, "generated-svg", visual.id);
    assert.equal(visual.print.grayscaleSafe, true, visual.id);
    assert.ok(textOf(visual.print.caption).length >= 40, visual.id);
    assert.ok(visual.performance.maxSamples >= 512, visual.id);
    assert.ok(visual.performance.maxPayloadBytes >= 32768, visual.id);
    assert.ok(visual.requiredCapabilities.includes("static-fallback"), visual.id);
    assert.match(visual.preferredRenderer, /^(?:lowest-cost|prefer-static|prefer-interactive)$/, visual.id);
    assert.equal(visual.provenance.sourceFile, SPEC_PATH, visual.id);
    assert.equal(visual.provenance.authoringId, visual.id, visual.id);
    assert.equal(visual.provenance.visibility, "public", visual.id);

    for (const point of visual.layers.filter(({ kind }) => kind === "open-point" || kind === "closed-point")) {
      assert.ok(point.label, `${visual.id}/${point.id}`);
      assert.match(point.presentation.colorIndependentCue, /(?:open|filled)/i, `${visual.id}/${point.id}`);
    }
  }
});

test("singular and oscillatory functions use explicit split domains that cannot bridge a break", () => {
  const expectedBreaks = new Map([
    ["rapid-oscillation", [["oscillation-left", 0, false], ["oscillation-right", 0, false]]],
    ["squeeze-bounds", [["middle-left", 0, false], ["middle-right", 0, false]]],
    ["sine-over-x", [["sinc-left", 0, false], ["sinc-right", 0, false]]],
    ["vertical-asymptotes", [["odd-left", 1, false], ["odd-right", 1, false], ["even-left", 1, false], ["even-right", 1, false]]],
    ["discontinuity-gallery", [["infinite-left", 0, false], ["infinite-right", 0, false], ["oscillatory-left", 0, false], ["oscillatory-right", 0, false]]],
  ]);

  for (const [visualId, layers] of expectedBreaks) {
    const visual = collection.visuals.find(({ id }) => id === visualId);
    for (const [layerId, breakpoint, inclusive] of layers) {
      const layer = visual.layers.find(({ id }) => id === layerId);
      const domain = layer.geometry.domain;
      const touchesFromLeft = domain.max === breakpoint && domain.includeMax === inclusive;
      const touchesFromRight = domain.min === breakpoint && domain.includeMin === inclusive;
      assert.ok(touchesFromLeft || touchesFromRight, `${visualId}/${layerId}`);
      assert.equal(domain.min < breakpoint && breakpoint < domain.max, false, `${visualId}/${layerId}`);
    }
  }
});

test("the two legacy small multiples have explicit nonoverlapping canonical panels", () => {
  const vertical = collection.visuals.find(({ id }) => id === "vertical-asymptotes");
  assert.deepEqual(vertical.panels.map(({ id }) => id), ["odd-power-panel", "even-power-panel"]);
  assert.ok(vertical.layers.every(({ panelId }) => vertical.panels.some(({ id }) => id === panelId)));

  const gallery = collection.visuals.find(({ id }) => id === "discontinuity-gallery");
  assert.deepEqual(gallery.panels.map(({ id }) => id), ["removable-panel", "jump-panel", "infinite-panel", "oscillatory-panel"]);
  assert.deepEqual(gallery.panels.map(({ row, column }) => [row, column]), [[0, 0], [0, 1], [1, 0], [1, 1]]);
  assert.ok(gallery.layers.every(({ panelId }) => gallery.panels.some(({ id }) => id === panelId)));
  assert.ok(vertical.requiredCapabilities.includes("multi-panel"));
  assert.ok(gallery.requiredCapabilities.includes("multi-panel"));
});

