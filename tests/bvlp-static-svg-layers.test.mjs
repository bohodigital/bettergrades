import assert from "node:assert/strict";
import test from "node:test";

import { compileVisualSpec } from "../lib/visualization/compiler/index.ts";
import { StaticSvgRenderError, renderStaticSvg } from "../lib/visualization/renderers/static-svg/index.ts";
import { cloneFixture, makeVisualSpec, richText } from "../lib/visualization/testkit/index.ts";

const number = (value) => ({ type: "number", value });
const variable = (name) => ({ type: "variable", name });
const binary = (type, left, right) => ({ type, left, right });
const presentation = (overrides = {}) => ({
  strokeToken: "visual-primary",
  fillToken: "visual-primary",
  lineStyle: "solid",
  markerShape: "circle",
  pattern: "diagonal",
  colorIndependentCue: "A solid labeled shape distinguished without relying on color.",
  ...overrides,
});
const common = (id, kind, geometry, overrides = {}) => ({
  id,
  kind,
  visible: true,
  zIndex: 0,
  presentation: presentation(),
  references: [],
  geometry,
  ...overrides,
});

function makeLimitsPrimitiveSpec() {
  const spec = cloneFixture(makeVisualSpec());
  spec.id = "limits-static-primitives";
  spec.provenance.authoringId = "limits-static-primitives";
  spec.accessibility.ariaLabel = "Static rendering fixture covering the Limits visual primitives";
  spec.layers = [
    common("curve-left", "piecewise-branch", { expression: { format: "ast", ast: binary("divide", number(1), variable("x")) }, variable: "x", domain: { min: -4, max: 0, includeMin: true, includeMax: false } }, { zIndex: 2 }),
    common("curve-right", "piecewise-branch", { expression: { format: "ast", ast: binary("divide", number(1), variable("x")) }, variable: "x", domain: { min: 0, max: 4, includeMin: false, includeMax: true } }, { zIndex: 2, presentation: presentation({ lineStyle: "double" }) }),
    common("regular-function", "function", { expression: { format: "ast", ast: binary("add", variable("x"), number(1)) }, variable: "x", domain: { min: -4, max: 4, includeMin: true, includeMax: true } }, { zIndex: 2 }),
    common("guide-horizontal-low", "line", { start: { x: -4, y: -1 }, end: { x: 4, y: -1 } }, { presentation: presentation({ lineStyle: "dashed" }) }),
    common("guide-horizontal-high", "line", { start: { x: -4, y: 1 }, end: { x: 4, y: 1 } }, { presentation: presentation({ lineStyle: "dashed" }) }),
    common("band", "region", { boundaryLayerIds: ["guide-horizontal-low", "guide-horizontal-high"] }, { references: ["guide-horizontal-low", "guide-horizontal-high"], zIndex: -2, presentation: presentation({ pattern: "crosshatch" }) }),
    common("hole", "open-point", { position: { x: 0, y: 1 } }, { label: richText("open value"), zIndex: 4, presentation: presentation({ colorIndependentCue: "An open circle labeled open value." }) }),
    common("value", "closed-point", { position: { x: 0, y: 3 } }, { label: richText("filled value"), zIndex: 4, presentation: presentation({ markerShape: "diamond", colorIndependentCue: "A filled diamond labeled filled value." }) }),
    common("ordinary-point", "point", { position: { x: -2, y: 2 } }, { zIndex: 4 }),
    common("segment", "segment", { start: { x: -3, y: 5 }, end: { x: -1, y: 6 } }),
    common("polygon", "polygon", { points: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 1.5, y: 3 }], closed: true }, { presentation: presentation({ pattern: "dots" }) }),
    common("circle", "circle", { center: { x: 2.5, y: 5 }, radius: 0.75 }),
    common("tangent", "tangent-line", { point: { x: 1, y: 2 }, slope: 1.5 }, { presentation: presentation({ lineStyle: "dotted" }) }),
    common("vertical-asymptote", "vertical-asymptote", { x: 0 }, { presentation: presentation({ lineStyle: "dashed" }) }),
    common("horizontal-asymptote", "horizontal-asymptote", { y: 0 }, { presentation: presentation({ lineStyle: "dotted" }) }),
    common("note", "annotation", { anchor: { x: 1.5, y: 6.5 }, content: richText("Limits use approach behavior, not only point values."), targetLayerId: "hole" }, { references: ["hole"], zIndex: 5 }),
  ];
  spec.requiredCapabilities = ["static-fallback", "cartesian-axes", "function-paths", "piecewise-paths", "open-closed-points", "asymptotes", "regions", "annotations"];
  spec.accessibility.readingOrder = spec.layers.map(({ id }) => id);
  return spec;
}

test("all Limits-required static layer families render with color-independent cues and no non-finite path data", () => {
  const { svg } = renderStaticSvg(compileVisualSpec(makeLimitsPrimitiveSpec()));
  for (const kind of ["piecewise-branch", "function", "line", "region", "open-point", "closed-point", "point", "segment", "polygon", "circle", "tangent-line", "vertical-asymptote", "horizontal-asymptote", "annotation"]) {
    assert.match(svg, new RegExp(`data-layer-kind="${kind}"`), kind);
  }
  assert.match(svg, /open value/);
  assert.match(svg, /filled value/);
  assert.match(svg, /stroke-dasharray="10 7"/);
  assert.match(svg, /stroke-dasharray="2 6"/);
  assert.match(svg, /pattern-crosshatch/);
  assert.doesNotMatch(svg, /(?:NaN|Infinity|undefined)/);
});

test("split piecewise domains produce separate clipped paths and never bridge the vertical break", () => {
  const { svg } = renderStaticSvg(compileVisualSpec(makeLimitsPrimitiveSpec()));
  const left = svg.match(/<g[^>]*data-layer-id="curve-left"[\s\S]*?<\/g>/)?.[0];
  const right = svg.match(/<g[^>]*data-layer-id="curve-right"[\s\S]*?<\/g>/)?.[0];
  assert.ok(left);
  assert.ok(right);
  assert.match(left, /data-segment-index="0"/);
  assert.match(right, /data-segment-index="0"/);
  assert.doesNotMatch(left, /data-layer-id="curve-right"/);
});

test("bounded sampling fails closed instead of silently truncating an oscillatory curve", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.id = "sampling-budget-fixture";
  spec.provenance.authoringId = "sampling-budget-fixture";
  spec.layers[0].geometry.expression.ast = {
    type: "sin",
    operand: binary("divide", number(1), variable("x")),
  };
  spec.layers[0].geometry.domain = { min: -1, max: 1, includeMin: true, includeMax: true };
  spec.performance = {
    maxSamples: 16,
    maxAdaptiveDepth: 12,
    maxAstNodes: 256,
    maxAstDepth: 24,
    maxOperationsPerEvaluation: 2048,
    maxPayloadBytes: 64000,
    maxAnimationFps: 30,
    activation: "none",
  };
  assert.throws(
    () => renderStaticSvg(compileVisualSpec(spec)),
    (error) => error instanceof StaticSvgRenderError && error.code === "sampling-sample-budget",
  );
});

test("initial control parameters are the only values used to lower static fallback geometry", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.id = "static-control-value";
  spec.provenance.authoringId = "static-control-value";
  spec.controls = [{
    id: "epsilon-control",
    kind: "slider",
    label: richText("Epsilon"),
    announcementTemplate: "Epsilon is {value}.",
    parameter: "epsilon",
    min: 0.25,
    max: 2,
    step: 0.25,
    initial: 1,
  }];
  spec.layers.push(common("epsilon-line", "line", {
    start: { x: -4, y: { format: "ast", ast: variable("epsilon") } },
    end: { x: 4, y: { format: "ast", ast: variable("epsilon") } },
  }));
  spec.requiredCapabilities.push("parameter-controls");
  spec.accessibility.readingOrder.push("epsilon-control", "epsilon-line");
  const result = renderStaticSvg(compileVisualSpec(spec));
  assert.match(result.svg, /data-layer-id="epsilon-line"/);
  assert.doesNotMatch(result.svg, /"type":"variable"|"name":"epsilon"|expressionAst|\bAST\b/);
});
