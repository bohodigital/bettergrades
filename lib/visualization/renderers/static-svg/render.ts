import { scaleLinear } from "d3-scale";
import { line as createLine } from "d3-shape";

import { evaluateAst, evaluateNumericAst } from "../../ast/evaluate.ts";
import type { NumericAst } from "../../ast/schema.ts";
import {
  clipSegmentsToViewport,
  sampleAdaptiveFunction,
  sampleAdaptiveParametric,
  sampleAdaptivePolar,
  SamplingError,
  type SamplePoint,
  type SampleSegment,
} from "../../sampling/index.ts";
import { CompiledSceneSchema, type CompiledScene } from "../../schema/index.ts";
import { measureStaticSvg, type StaticSvgAssetMetadata } from "./asset.ts";
import { StaticSvgRenderError } from "./errors.ts";
import { escapeXml, formatNumber, formatTick, richTextToPlainText, splitText } from "./format.ts";
import {
  attrs,
  element,
  fillColor,
  patternFill,
  PRINT_SAFE_STYLE,
  rootDefinitions,
  strokeColor,
  strokeShape,
  type Presentation,
} from "./style.ts";
import {
  createSceneLayout,
  panelForLayer,
  projectX,
  projectY,
  type PanelLayout,
  type SceneLayout,
} from "./layout.ts";

type Value = number | NumericAst;
type PointValue = Readonly<{ x: Value; y: Value }>;
type NumericPoint = Readonly<{ x: number; y: number }>;
type Variables = Readonly<Record<string, number>>;

// Browser, Windows, and Linux runtimes may differ by a few low-order bits for
// transcendental functions.  Those bits are far below visual resolution, but
// can otherwise move an adaptive sample across a refinement threshold and
// change a content-addressed asset.  Normalize only sampled values at this
// renderer boundary; authored coordinates and the safe AST remain unchanged.
function stableSampleNumber(value: number): number {
  if (!Number.isFinite(value)) return value;
  const normalized = Number(value.toPrecision(12));
  return Object.is(normalized, -0) ? 0 : normalized;
}

// Zod's generic layer factory intentionally accepts multiple expression
// schemas, so its inferred CompiledScene type retains `unknown` at expression
// and expression-backed coordinate leaves. The scene is validated immediately
// before this renderer boundary; this recursive view narrows only those leaves
// to the canonical compiled numeric AST type.
type AstGeometryKey = "expression" | "xExpression" | "yExpression" | "radiusExpression" | "condition";
type ReplaceUnknownLeaves<T, Field extends PropertyKey = never> = unknown extends T
  ? [keyof T] extends [never]
    ? Field extends AstGeometryKey ? NumericAst : Value
    : T extends (infer Item)[]
      ? ReplaceUnknownLeaves<Item>[]
      : T extends readonly (infer Item)[]
        ? readonly ReplaceUnknownLeaves<Item>[]
      : T extends object
        ? { [Key in keyof T]: ReplaceUnknownLeaves<T[Key], Key> }
        : T
  : T extends (infer Item)[]
    ? ReplaceUnknownLeaves<Item>[]
    : T extends readonly (infer Item)[]
      ? readonly ReplaceUnknownLeaves<Item>[]
    : T extends object
      ? { [Key in keyof T]: ReplaceUnknownLeaves<T[Key], Key> }
      : T;

type Layer = ReplaceUnknownLeaves<CompiledScene["layers"][number]>;
type Scene = Omit<CompiledScene, "layers"> & { layers: Layer[] };

export type StaticSvgRenderOptions = Readonly<{
  assetPrefix?: string;
  maxOutputBytes?: number;
}>;

export type StaticSvgRenderResult = StaticSvgAssetMetadata & Readonly<{
  svg: string;
  width: number;
  height: number;
}>;

function idFragment(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, "-");
}

function initialVariables(scene: Scene): Record<string, number> {
  const variables: Record<string, number> = {};
  for (const control of scene.controls) {
    if (control.kind === "slider" || control.kind === "parameter-input") {
      variables[control.parameter] = control.initial;
    } else if (control.kind === "step-control") {
      variables[control.parameter] = control.values[control.initialIndex];
    } else if (control.kind === "play-pause") {
      variables[control.parameter] = control.from;
    }
  }
  return variables;
}

function astVariables(ast: NumericAst): Set<string> {
  const found = new Set<string>();
  const stack: NumericAst[] = [ast];
  while (stack.length) {
    const node = stack.pop();
    if (!node) break;
    if (node.type === "variable") found.add(node.name);
    else if (node.type === "piecewise") {
      for (const branch of node.branches) stack.push(branch.when, branch.then);
      if (node.otherwise) stack.push(node.otherwise);
    } else if ("operand" in node) stack.push(node.operand);
    else if (node.type !== "number") stack.push(node.left, node.right);
  }
  return found;
}

function assertVariablesAvailable(
  ast: NumericAst,
  variables: Variables,
  scene: Scene,
  layer: Layer,
): void {
  const missing = [...astVariables(ast)].filter((name) => variables[name] === undefined);
  if (missing.length) {
    throw new StaticSvgRenderError(
      "missing-static-parameter",
      `Static rendering of ${scene.id}/${layer.id} has no initial value for: ${missing.join(", ")}.`,
      scene.id,
      layer.id,
    );
  }
}

function resolveValue(
  value: Value,
  variables: Variables,
  scene: Scene,
  layer: Layer,
): number {
  let result: number;
  try {
    if (typeof value === "number") result = value;
    else {
      assertVariablesAvailable(value, variables, scene, layer);
      result = evaluateNumericAst(value, variables, {
        maxDepth: scene.performance.maxAstDepth,
        maxNodes: scene.performance.maxAstNodes,
        maxOperations: scene.performance.maxOperationsPerEvaluation,
      });
    }
  } catch (error) {
    if (error instanceof StaticSvgRenderError) throw error;
    throw new StaticSvgRenderError(
      "geometry-evaluation",
      `Static geometry evaluation failed for ${scene.id}/${layer.id}: ${error instanceof Error ? error.message : String(error)}`,
      scene.id,
      layer.id,
    );
  }
  if (!Number.isFinite(result)) {
    throw new StaticSvgRenderError(
      "non-finite-geometry",
      `Static geometry for ${scene.id}/${layer.id} evaluated to a non-finite value.`,
      scene.id,
      layer.id,
    );
  }
  return result;
}

function resolvePoint(
  point: PointValue,
  variables: Variables,
  scene: Scene,
  layer: Layer,
): NumericPoint {
  return {
    x: resolveValue(point.x, variables, scene, layer),
    y: resolveValue(point.y, variables, scene, layer),
  };
}

function projected(point: NumericPoint, panel: PanelLayout): NumericPoint {
  return { x: projectX(point.x, panel), y: projectY(point.y, panel) };
}

function textBlock(
  x: number,
  y: number,
  text: string,
  options: Readonly<{ className?: string; anchor?: "start" | "middle" | "end"; size?: number; weight?: number; maxCharacters?: number; maxLines?: number; labelBox?: TextLabelBox }> = {},
): string {
  const lines = splitText(text, options.maxCharacters ?? 34, options.maxLines ?? 3);
  const children = lines.map((line, index) => element("tspan", {
    x,
    dy: index === 0 ? 0 : "1.18em",
  }, escapeXml(line))).join("");
  return element("text", {
    x,
    y,
    class: options.className,
    fill: "#111827",
    "font-size": options.size ?? 14,
    "font-weight": options.weight,
    "text-anchor": options.anchor ?? "start",
    "data-bvlp-label-box": options.labelBox ? [options.labelBox.x, options.labelBox.y, options.labelBox.width, options.labelBox.height].map(formatNumber).join(",") : undefined,
  }, children);
}

type TextLabelBox = Readonly<{ x: number; y: number; width: number; height: number }>;
type TextLabelPlacement = Readonly<{ x: number; y: number; anchor: "start" | "middle" | "end"; box: TextLabelBox }>;

function boxesOverlap(left: TextLabelBox, right: TextLabelBox, padding = 3): boolean {
  return left.x < right.x + right.width + padding
    && left.x + left.width + padding > right.x
    && left.y < right.y + right.height + padding
    && left.y + left.height + padding > right.y;
}

function layoutTextLabel(
  point: NumericPoint,
  text: string,
  panel: PanelLayout,
  occupied: TextLabelBox[],
  options: Readonly<{ size?: number; maxCharacters?: number; maxLines?: number }> = {},
): TextLabelPlacement {
  const size = options.size ?? 13;
  const lines = splitText(text, options.maxCharacters ?? 28, options.maxLines ?? 2);
  const width = Math.min(panel.plot.width - 16, Math.max(24, Math.max(...lines.map((line) => line.length)) * size * 0.59 + 3));
  const height = Math.max(size * 1.18, lines.length * size * 1.18);
  const leftBound = panel.plot.x + 8;
  const topBound = panel.plot.y + 8;
  const rightBound = panel.plot.x + panel.plot.width - 8;
  const bottomBound = panel.plot.y + panel.plot.height - 8;
  const clampBox = (x: number, y: number): TextLabelBox => ({
    x: Math.max(leftBound, Math.min(rightBound - width, x)),
    y: Math.max(topBound, Math.min(bottomBound - height, y)),
    width,
    height,
  });
  const candidates = [
    clampBox(point.x + 11, point.y - height - 9),
    clampBox(point.x + 11, point.y + 10),
    clampBox(point.x - width - 11, point.y - height - 9),
    clampBox(point.x - width - 11, point.y + 10),
    clampBox(point.x - width / 2, point.y - height - 13),
    clampBox(point.x - width / 2, point.y + 13),
  ];
  let box = candidates.find((candidate) => occupied.every((other) => !boxesOverlap(candidate, other)));
  if (!box) {
    for (let y = topBound; y <= bottomBound - height && !box; y += Math.max(10, height / 2)) {
      for (let x = leftBound; x <= rightBound - width; x += 12) {
        const candidate = { x, y, width, height };
        if (occupied.every((other) => !boxesOverlap(candidate, other))) {
          box = candidate;
          break;
        }
      }
    }
  }
  box ??= candidates[0];
  occupied.push(box);
  return { x: box.x, y: box.y + size, anchor: "start", box };
}

function ticksForAxis(
  axis: Extract<PanelLayout["axes"], { mode: "explicit" }>["axes"][number],
  min: number,
  max: number,
  pixelSpan: number,
): number[] {
  if (axis.scale !== "linear") {
    throw new StaticSvgRenderError("unsupported-axis-scale", `Static SVG v1 does not support ${axis.scale} axes.`);
  }
  let ticks: number[];
  if (axis.tickMode === "explicit") {
    ticks = [...(axis.tickValues ?? [])];
  } else if (axis.tickMode === "fixed-step") {
    const step = axis.tickStep ?? 1;
    const first = Math.ceil(min / step) * step;
    ticks = [];
    for (let value = first; value <= max + step * 1e-10 && ticks.length < 128; value += step) ticks.push(value);
    if (ticks.length === 128 && ticks[ticks.length - 1] + step <= max) {
      throw new StaticSvgRenderError("axis-tick-budget", `Fixed-step axis ${axis.id} exceeds 128 ticks.`);
    }
  } else {
    ticks = scaleLinear().domain([min, max]).ticks(Math.max(3, Math.min(10, Math.round(pixelSpan / 90))));
  }
  return [...new Set(ticks.filter((value) => Number.isFinite(value) && value >= min && value <= max))].sort((a, b) => a - b);
}

function renderAxes(panel: PanelLayout): string {
  const { plot, viewport, axes } = panel;
  const background = element("rect", {
    class: "bvlp-panel-bg",
    x: plot.x,
    y: plot.y,
    width: plot.width,
    height: plot.height,
    fill: "#ffffff",
    stroke: "#cbd5e1",
    "stroke-width": 1,
  });
  if (axes.mode === "none") return background;
  const xAxis = axes.axes.find((axis) => axis.orientation === "x" || axis.orientation === "angular");
  const yAxis = axes.axes.find((axis) => axis.orientation === "y" || axis.orientation === "radial");
  const xTicks = xAxis ? ticksForAxis(xAxis, viewport.xMin, viewport.xMax, plot.width) : [];
  const yTicks = yAxis ? ticksForAxis(yAxis, viewport.yMin, viewport.yMax, plot.height) : [];
  const grid: string[] = [];
  if (xAxis?.showGrid) {
    for (const value of xTicks) {
      const x = projectX(value, panel);
      grid.push(element("line", { x1: x, x2: x, y1: plot.y, y2: plot.y + plot.height, stroke: "#e2e8f0", "stroke-width": 1 }));
    }
  }
  if (yAxis?.showGrid) {
    for (const value of yTicks) {
      const y = projectY(value, panel);
      grid.push(element("line", { x1: plot.x, x2: plot.x + plot.width, y1: y, y2: y, stroke: "#e2e8f0", "stroke-width": 1 }));
    }
  }
  const output = [background, ...grid];
  if (xAxis) {
    const y = viewport.yMin <= 0 && viewport.yMax >= 0 ? projectY(0, panel) : plot.y + plot.height;
    output.push(element("line", { x1: plot.x, x2: plot.x + plot.width, y1: y, y2: y, stroke: "#334155", "stroke-width": 1.5 }));
    for (const value of xTicks) {
      const x = projectX(value, panel);
      output.push(element("line", { x1: x, x2: x, y1: y - 4, y2: y + 4, stroke: "#334155", "stroke-width": 1 }));
      output.push(textBlock(x, plot.y + plot.height + 20, formatTick(value), { anchor: "middle", size: 11, maxLines: 1 }));
    }
    output.push(textBlock(plot.x + plot.width, plot.y + plot.height + 39, richTextToPlainText(xAxis.label), { className: "bvlp-axis-label", anchor: "end", size: 13, maxLines: 1 }));
  }
  if (yAxis) {
    const x = viewport.xMin <= 0 && viewport.xMax >= 0 ? projectX(0, panel) : plot.x;
    output.push(element("line", { x1: x, x2: x, y1: plot.y, y2: plot.y + plot.height, stroke: "#334155", "stroke-width": 1.5 }));
    for (const value of yTicks) {
      const y = projectY(value, panel);
      output.push(element("line", { x1: x - 4, x2: x + 4, y1: y, y2: y, stroke: "#334155", "stroke-width": 1 }));
      output.push(textBlock(plot.x - 8, y + 4, formatTick(value), { anchor: "end", size: 11, maxLines: 1 }));
    }
    output.push(textBlock(plot.x - 7, plot.y - 7, richTextToPlainText(yAxis.label), { className: "bvlp-axis-label", anchor: "end", size: 13, maxLines: 1 }));
  }
  return output.join("");
}

function domainBounds(domain: Readonly<{ min: number; max: number; includeMin: boolean; includeMax: boolean }>): [number, number] {
  const epsilon = (domain.max - domain.min) * 1e-8;
  return [domain.includeMin ? domain.min : domain.min + epsilon, domain.includeMax ? domain.max : domain.max - epsilon];
}

function pathForSegment(segment: SampleSegment, panel: PanelLayout): string {
  const generator = createLine<SamplePoint>()
    .x((point) => projectX(point.x, panel))
    .y((point) => projectY(point.y, panel));
  return generator(segment) ?? "";
}

function renderSegments(
  segments: readonly SampleSegment[],
  panel: PanelLayout,
  layer: Layer,
  width = 3,
): string {
  return segments.map((segment, index) => {
    const d = pathForSegment(segment, panel);
    return d ? strokeShape("path", { d, "data-segment-index": index }, layer.presentation, { width }) : "";
  }).join("");
}

function sampleLayer(
  scene: Scene,
  layer: Extract<Layer, { kind: "function" | "piecewise-branch" | "parametric-curve" | "polar-curve" }>,
  panel: PanelLayout,
  variables: Variables,
): readonly SampleSegment[] {
  const common = {
    viewport: panel.viewport,
    initialIntervals: 20,
    tolerance: 0.0018,
    discontinuityThreshold: 0.32,
    maxDepth: scene.performance.maxAdaptiveDepth,
    maxSamples: scene.performance.maxSamples,
    onBudget: "throw" as const,
  };
  try {
    if (layer.kind === "function" || layer.kind === "piecewise-branch") {
      const expression = layer.geometry.expression;
      const [xMin, xMax] = domainBounds(layer.geometry.domain);
      const available = { ...variables, [layer.geometry.variable]: 0 };
      assertVariablesAvailable(expression, available, scene, layer);
      const result = sampleAdaptiveFunction((x) => stableSampleNumber(evaluateNumericAst(expression, {
        ...variables,
        [layer.geometry.variable]: x,
      }, {
        maxDepth: scene.performance.maxAstDepth,
        maxNodes: scene.performance.maxAstNodes,
        maxOperations: scene.performance.maxOperationsPerEvaluation,
      })), {
        ...common,
        xMin,
        xMax,
        // Refinement below half a rendered pixel cannot add reliable visible
        // information. Stopping there keeps infinite oscillation bounded; the
        // sampler emits breaks rather than inventing connecting diagonals.
        minParameterStep: (xMax - xMin) / (Math.max(320, panel.plot.width) * 2),
      });
      return clipSegmentsToViewport(result.segments, panel.viewport);
    }
    if (layer.kind === "parametric-curve") {
      const [parameterMin, parameterMax] = domainBounds(layer.geometry.domain);
      const available = { ...variables, [layer.geometry.parameter]: 0 };
      const xExpression = layer.geometry.xExpression;
      const yExpression = layer.geometry.yExpression;
      assertVariablesAvailable(xExpression, available, scene, layer);
      assertVariablesAvailable(yExpression, available, scene, layer);
      const result = sampleAdaptiveParametric((parameter) => ({
        x: stableSampleNumber(evaluateNumericAst(xExpression, { ...variables, [layer.geometry.parameter]: parameter })),
        y: stableSampleNumber(evaluateNumericAst(yExpression, { ...variables, [layer.geometry.parameter]: parameter })),
      }), {
        ...common,
        parameterMin,
        parameterMax,
        minParameterStep: (parameterMax - parameterMin) / (Math.max(320, panel.plot.width) * 2),
      });
      return clipSegmentsToViewport(result.segments, panel.viewport);
    }
    const [parameterMin, parameterMax] = domainBounds(layer.geometry.domain);
    const available = { ...variables, [layer.geometry.angleVariable]: 0 };
    const radiusExpression = layer.geometry.radiusExpression;
    assertVariablesAvailable(radiusExpression, available, scene, layer);
    const result = sampleAdaptivePolar((angle) => stableSampleNumber(evaluateNumericAst(radiusExpression, {
      ...variables,
      [layer.geometry.angleVariable]: angle,
    })), {
      ...common,
      parameterMin,
      parameterMax,
      minParameterStep: (parameterMax - parameterMin) / (Math.max(320, panel.plot.width) * 2),
    });
    return clipSegmentsToViewport(result.segments, panel.viewport);
  } catch (error) {
    if (error instanceof StaticSvgRenderError) throw error;
    const code = error instanceof SamplingError ? `sampling-${error.code}` : "sampling-failed";
    throw new StaticSvgRenderError(
      code,
      `Static sampling failed for ${scene.id}/${layer.id}: ${error instanceof Error ? error.message : String(error)}`,
      scene.id,
      layer.id,
    );
  }
}

function layerGroup(layer: Layer, body: string): string {
  if (!body) return "";
  return element("g", {
    "aria-label": layer.presentation.colorIndependentCue,
    "data-layer-id": layer.id,
    "data-layer-kind": layer.kind,
    "data-line-style": layer.presentation.lineStyle,
    role: "group",
  }, body);
}

function renderPointMarker(
  point: NumericPoint,
  panel: PanelLayout,
  layer: Extract<Layer, { kind: "point" | "open-point" | "closed-point" | "data-marker" }>,
): string {
  const p = projected(point, panel);
  const open = layer.kind === "open-point";
  const shape = layer.presentation.markerShape === "none" ? "circle" : layer.presentation.markerShape;
  const fill = open ? "#ffffff" : fillColor(layer.presentation);
  const common = { fill, stroke: strokeColor(layer.presentation), "stroke-width": open ? 3 : 2.25, "vector-effect": "non-scaling-stroke" };
  if (shape === "square") return element("rect", { x: p.x - 6, y: p.y - 6, width: 12, height: 12, ...common });
  if (shape === "diamond") return element("polygon", { points: `${formatNumber(p.x)},${formatNumber(p.y - 7)} ${formatNumber(p.x + 7)},${formatNumber(p.y)} ${formatNumber(p.x)},${formatNumber(p.y + 7)} ${formatNumber(p.x - 7)},${formatNumber(p.y)}`, ...common });
  if (shape === "triangle") return element("polygon", { points: `${formatNumber(p.x)},${formatNumber(p.y - 7)} ${formatNumber(p.x + 7)},${formatNumber(p.y + 6)} ${formatNumber(p.x - 7)},${formatNumber(p.y + 6)}`, ...common });
  if (shape === "cross") {
    return `${strokeShape("line", { x1: p.x - 6, x2: p.x + 6, y1: p.y - 6, y2: p.y + 6 }, layer.presentation, { width: 2.5 })}${strokeShape("line", { x1: p.x - 6, x2: p.x + 6, y1: p.y + 6, y2: p.y - 6 }, layer.presentation, { width: 2.5 })}`;
  }
  return element("circle", { cx: p.x, cy: p.y, r: open ? 6.5 : 6, ...common });
}

function genericLayerLabel(
  layer: Layer,
  anchor: NumericPoint | undefined,
  panel: PanelLayout,
  occupied: TextLabelBox[],
): string {
  if (!layer.label || !anchor) return "";
  const point = projected(anchor, panel);
  const text = richTextToPlainText(layer.label);
  const placement = layoutTextLabel(point, text, panel, occupied, { size: 13, maxCharacters: 28, maxLines: 2 });
  return textBlock(placement.x, placement.y, text, {
    className: "bvlp-annotation",
    size: 13,
    maxCharacters: 28,
    maxLines: 2,
    anchor: placement.anchor,
    labelBox: placement.box,
  });
}

function lineToViewport(start: NumericPoint, through: NumericPoint, panel: PanelLayout, bothDirections: boolean): [NumericPoint, NumericPoint] {
  const dx = through.x - start.x;
  const dy = through.y - start.y;
  if (Math.abs(dx) < 1e-14 && Math.abs(dy) < 1e-14) {
    throw new StaticSvgRenderError("degenerate-line", "A line or ray requires two distinct points.");
  }
  const candidates: number[] = [];
  if (dx !== 0) candidates.push((panel.viewport.xMin - start.x) / dx, (panel.viewport.xMax - start.x) / dx);
  if (dy !== 0) candidates.push((panel.viewport.yMin - start.y) / dy, (panel.viewport.yMax - start.y) / dy);
  const inside = candidates.filter((t) => (bothDirections || t >= 0)).filter((t) => {
    const x = start.x + t * dx;
    const y = start.y + t * dy;
    return x >= panel.viewport.xMin - 1e-9 && x <= panel.viewport.xMax + 1e-9 && y >= panel.viewport.yMin - 1e-9 && y <= panel.viewport.yMax + 1e-9;
  }).sort((a, b) => a - b);
  if (!inside.length) return [start, through];
  const first = bothDirections ? inside[0] : 0;
  const last = inside[inside.length - 1];
  return [
    { x: start.x + first * dx, y: start.y + first * dy },
    { x: start.x + last * dx, y: start.y + last * dy },
  ];
}

function lineShape(
  start: NumericPoint,
  end: NumericPoint,
  panel: PanelLayout,
  presentation: Presentation,
  options: Readonly<{ markerEnd?: string; width?: number }> = {},
): string {
  const a = projected(start, panel);
  const b = projected(end, panel);
  return strokeShape("line", { x1: a.x, x2: b.x, y1: a.y, y2: b.y }, presentation, options);
}

function renderRegion(
  scene: Scene,
  layer: Extract<Layer, { kind: "region" }>,
  panel: PanelLayout,
  variables: Variables,
  idPrefix: string,
): string {
  const boundaries = layer.geometry.boundaryLayerIds.map((id) => scene.layers.find((candidate) => candidate.id === id));
  if (boundaries.some((boundary) => !boundary)) {
    throw new StaticSvgRenderError("missing-region-boundary", `Region ${scene.id}/${layer.id} has a missing boundary.`, scene.id, layer.id);
  }
  const boundaryLayers = boundaries as Layer[];
  if (boundaryLayers.length === 2 && boundaryLayers.every((boundary) => boundary.kind === "line")) {
    const lines = boundaryLayers as Array<Extract<Layer, { kind: "line" }>>;
    const points = lines.map((boundary) => [
      resolvePoint(boundary.geometry.start, variables, scene, boundary),
      resolvePoint(boundary.geometry.end, variables, scene, boundary),
    ] as const);
    const horizontal = points.every(([a, b]) => Math.abs(a.y - b.y) < 1e-9);
    const vertical = points.every(([a, b]) => Math.abs(a.x - b.x) < 1e-9);
    if (horizontal) {
      const ys = points.map(([a]) => projectY(a.y, panel)).sort((a, b) => a - b);
      return element("rect", { x: panel.plot.x, y: ys[0], width: panel.plot.width, height: ys[1] - ys[0], fill: patternFill(layer.presentation, idPrefix), "fill-opacity": 0.48, stroke: "none" });
    }
    if (vertical) {
      const xs = points.map(([a]) => projectX(a.x, panel)).sort((a, b) => a - b);
      return element("rect", { x: xs[0], y: panel.plot.y, width: xs[1] - xs[0], height: panel.plot.height, fill: patternFill(layer.presentation, idPrefix), "fill-opacity": 0.48, stroke: "none" });
    }
  }
  const circle = boundaryLayers.find((boundary): boundary is Extract<Layer, { kind: "circle" }> => boundary.kind === "circle");
  const segments = boundaryLayers.filter((boundary): boundary is Extract<Layer, { kind: "segment" }> => boundary.kind === "segment");
  if (circle && segments.length >= 2) {
    const center = resolvePoint(circle.geometry.center, variables, scene, circle);
    const radius = resolveValue(circle.geometry.radius, variables, scene, circle);
    const ends = segments.slice(0, 2).map((segment) => {
      const a = resolvePoint(segment.geometry.start, variables, scene, segment);
      const b = resolvePoint(segment.geometry.end, variables, scene, segment);
      return Math.hypot(a.x - center.x, a.y - center.y) > Math.hypot(b.x - center.x, b.y - center.y) ? a : b;
    });
    let startAngle = Math.atan2(ends[0].y - center.y, ends[0].x - center.x);
    let endAngle = Math.atan2(ends[1].y - center.y, ends[1].x - center.x);
    while (endAngle < startAngle) endAngle += Math.PI * 2;
    if (endAngle - startAngle > Math.PI) [startAngle, endAngle] = [endAngle, startAngle + Math.PI * 2];
    const arc: NumericPoint[] = [];
    for (let index = 0; index <= 24; index += 1) {
      const angle = startAngle + ((endAngle - startAngle) * index) / 24;
      arc.push({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    }
    const screen = [center, ...arc].map((point) => projected(point, panel));
    const d = `M${formatNumber(screen[0].x)} ${formatNumber(screen[0].y)}L${screen.slice(1).map((point) => `${formatNumber(point.x)} ${formatNumber(point.y)}`).join("L")}Z`;
    return element("path", { d, fill: patternFill(layer.presentation, idPrefix), "fill-opacity": 0.48, stroke: strokeColor(layer.presentation), "stroke-width": 1.25 });
  }
  throw new StaticSvgRenderError(
    "unsupported-region-boundary",
    `Region ${scene.id}/${layer.id} does not describe a supported two-line band or circle sector.`,
    scene.id,
    layer.id,
  );
}

function renderInequalityRegion(
  scene: Scene,
  layer: Extract<Layer, { kind: "inequality-region" }>,
  panel: PanelLayout,
  variables: Variables,
  idPrefix: string,
): string {
  const [xVariable, yVariable] = layer.geometry.variables;
  if (!xVariable || !yVariable) {
    throw new StaticSvgRenderError("inequality-dimensions", `Inequality region ${scene.id}/${layer.id} requires two variables.`, scene.id, layer.id);
  }
  const condition = layer.geometry.condition;
  assertVariablesAvailable(condition, { ...variables, [xVariable]: 0, [yVariable]: 0 }, scene, layer);
  const columns = 32;
  const rows = 24;
  const cells: string[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = panel.viewport.xMin + ((column + 0.5) / columns) * (panel.viewport.xMax - panel.viewport.xMin);
      const y = panel.viewport.yMax - ((row + 0.5) / rows) * (panel.viewport.yMax - panel.viewport.yMin);
      const value = evaluateAst(condition, { ...variables, [xVariable]: x, [yVariable]: y }, {
        maxDepth: scene.performance.maxAstDepth,
        maxNodes: scene.performance.maxAstNodes,
        maxOperations: scene.performance.maxOperationsPerEvaluation,
      });
      const included = typeof value === "boolean" ? value : Number.isFinite(value) && value !== 0;
      if (included) cells.push(element("rect", {
        x: panel.plot.x + (column / columns) * panel.plot.width,
        y: panel.plot.y + (row / rows) * panel.plot.height,
        width: panel.plot.width / columns + 0.25,
        height: panel.plot.height / rows + 0.25,
        fill: patternFill(layer.presentation, idPrefix),
        "fill-opacity": 0.38,
        stroke: "none",
      }));
    }
  }
  return cells.join("");
}

function renderGridLayer(
  scene: Scene,
  layer: Extract<Layer, { kind: "grid" }>,
  panel: PanelLayout,
): string {
  const lines: string[] = [];
  const xStart = Math.ceil(panel.viewport.xMin / layer.geometry.xStep) * layer.geometry.xStep;
  const yStart = Math.ceil(panel.viewport.yMin / layer.geometry.yStep) * layer.geometry.yStep;
  for (let value = xStart, index = 0; value <= panel.viewport.xMax + 1e-10; value += layer.geometry.xStep, index += 1) {
    if (index >= 256) throw new StaticSvgRenderError("grid-budget", `Grid ${scene.id}/${layer.id} exceeds 256 vertical lines.`, scene.id, layer.id);
    const x = projectX(value, panel);
    lines.push(element("line", { x1: x, x2: x, y1: panel.plot.y, y2: panel.plot.y + panel.plot.height, stroke: strokeColor(layer.presentation), "stroke-opacity": index % layer.geometry.majorEvery === 0 ? 0.34 : 0.16, "stroke-width": index % layer.geometry.majorEvery === 0 ? 1.25 : 0.75 }));
  }
  for (let value = yStart, index = 0; value <= panel.viewport.yMax + 1e-10; value += layer.geometry.yStep, index += 1) {
    if (index >= 256) throw new StaticSvgRenderError("grid-budget", `Grid ${scene.id}/${layer.id} exceeds 256 horizontal lines.`, scene.id, layer.id);
    const y = projectY(value, panel);
    lines.push(element("line", { x1: panel.plot.x, x2: panel.plot.x + panel.plot.width, y1: y, y2: y, stroke: strokeColor(layer.presentation), "stroke-opacity": index % layer.geometry.majorEvery === 0 ? 0.34 : 0.16, "stroke-width": index % layer.geometry.majorEvery === 0 ? 1.25 : 0.75 }));
  }
  return lines.join("");
}

function renderBasisGrid(
  scene: Scene,
  layer: Extract<Layer, { kind: "basis-grid" }>,
  panel: PanelLayout,
  variables: Variables,
): string {
  const origin = resolvePoint(layer.geometry.origin, variables, scene, layer);
  const first = resolvePoint(layer.geometry.firstBasis, variables, scene, layer);
  const second = resolvePoint(layer.geometry.secondBasis, variables, scene, layer);
  const u = { x: first.x - origin.x, y: first.y - origin.y };
  const v = { x: second.x - origin.x, y: second.y - origin.y };
  if (Math.abs(u.x * v.y - u.y * v.x) < 1e-12) {
    throw new StaticSvgRenderError("degenerate-basis", `Basis grid ${scene.id}/${layer.id} has collinear basis vectors.`, scene.id, layer.id);
  }
  const lines: string[] = [];
  for (let index = -8; index <= 8; index += 1) {
    const alongU = { x: origin.x + index * u.x, y: origin.y + index * u.y };
    const alongV = { x: origin.x + index * v.x, y: origin.y + index * v.y };
    lines.push(lineShape(
      { x: alongU.x - 10 * v.x, y: alongU.y - 10 * v.y },
      { x: alongU.x + 10 * v.x, y: alongU.y + 10 * v.y },
      panel,
      layer.presentation,
      { width: index === 0 ? 1.5 : 0.75 },
    ));
    lines.push(lineShape(
      { x: alongV.x - 10 * u.x, y: alongV.y - 10 * u.y },
      { x: alongV.x + 10 * u.x, y: alongV.y + 10 * u.y },
      panel,
      layer.presentation,
      { width: index === 0 ? 1.5 : 0.75 },
    ));
  }
  return lines.join("");
}

function renderErrorBand(
  layer: Extract<Layer, { kind: "error-band" }>,
  panel: PanelLayout,
  idPrefix: string,
): string {
  const upper = layer.geometry.xValues.map((x, index) => projected({ x, y: layer.geometry.upperValues[index] }, panel));
  const lower = layer.geometry.xValues.map((x, index) => projected({ x, y: layer.geometry.lowerValues[index] }, panel)).reverse();
  const points = [...upper, ...lower];
  if (!points.length) return "";
  const d = `M${points.map((point) => `${formatNumber(point.x)} ${formatNumber(point.y)}`).join("L")}Z`;
  return element("path", {
    d,
    fill: patternFill(layer.presentation, idPrefix),
    "fill-opacity": 0.45,
    stroke: strokeColor(layer.presentation),
    "stroke-width": 1.25,
    "vector-effect": "non-scaling-stroke",
  });
}

function renderTrace(
  scene: Scene,
  layer: Extract<Layer, { kind: "trace" }>,
  panel: PanelLayout,
  variables: Variables,
): string {
  const points = layer.geometry.points.map((point, index) => ({
    parameter: index,
    ...resolvePoint(point, variables, scene, layer),
  }));
  if (!layer.geometry.connect) {
    return points.map((point) => {
      const p = projected(point, panel);
      return element("circle", { cx: p.x, cy: p.y, r: 3, fill: strokeColor(layer.presentation) });
    }).join("");
  }
  return renderSegments(clipSegmentsToViewport([points], panel.viewport), panel, layer);
}

function renderSampledSeries(
  layer: Extract<Layer, { kind: "sampled-series" }>,
  panel: PanelLayout,
): string {
  const points = layer.geometry.xValues.map((x, index) => ({ parameter: index, x, y: layer.geometry.yValues[index] }));
  if (!layer.geometry.connect) {
    return points.map((point) => {
      const p = projected(point, panel);
      return element("circle", { cx: p.x, cy: p.y, r: 3, fill: strokeColor(layer.presentation) });
    }).join("");
  }
  return renderSegments(clipSegmentsToViewport([points], panel.viewport), panel, layer);
}

function renderLayer(
  scene: Scene,
  layer: Layer,
  panel: PanelLayout,
  variables: Variables,
  idPrefix: string,
  occupiedLabels: TextLabelBox[],
): string {
  if (!layer.visible) return "";
  let body = "";
  let labelAnchor: NumericPoint | undefined;

  switch (layer.kind) {
    case "function":
    case "piecewise-branch":
    case "parametric-curve":
    case "polar-curve": {
      const segments = sampleLayer(scene, layer, panel, variables);
      body = renderSegments(segments, panel, layer);
      const first = segments[0]?.[0];
      if (first) labelAnchor = { x: first.x, y: first.y };
      break;
    }
    case "sampled-series":
      body = renderSampledSeries(layer, panel);
      if (layer.geometry.xValues.length) labelAnchor = { x: layer.geometry.xValues[0], y: layer.geometry.yValues[0] };
      break;
    case "trace":
      body = renderTrace(scene, layer, panel, variables);
      if (layer.geometry.points.length) labelAnchor = resolvePoint(layer.geometry.points[0], variables, scene, layer);
      break;
    case "point":
    case "open-point":
    case "closed-point": {
      labelAnchor = resolvePoint(layer.geometry.position, variables, scene, layer);
      body = renderPointMarker(labelAnchor, panel, layer);
      break;
    }
    case "data-marker": {
      labelAnchor = resolvePoint(layer.geometry.position, variables, scene, layer);
      body = renderPointMarker(labelAnchor, panel, layer);
      break;
    }
    case "line":
    case "segment":
    case "direction-arrow":
    case "vector": {
      const geometry = layer.geometry;
      const start = resolvePoint(geometry.start, variables, scene, layer);
      const end = resolvePoint(geometry.end, variables, scene, layer);
      labelAnchor = end;
      const markerEnd = layer.kind === "vector" || layer.kind === "direction-arrow" ? `url(#${idPrefix}-arrow)` : undefined;
      body = lineShape(start, end, panel, layer.presentation, { markerEnd });
      if (layer.kind === "vector" && layer.geometry.componentLabels) {
        const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
        const screen = projected(middle, panel);
        body += textBlock(screen.x + 8, screen.y - 8, `(${formatTick(end.x - start.x)}, ${formatTick(end.y - start.y)})`, { className: "bvlp-annotation", size: 12, maxLines: 1 });
      }
      break;
    }
    case "ray": {
      const start = resolvePoint(layer.geometry.start, variables, scene, layer);
      const through = resolvePoint(layer.geometry.through, variables, scene, layer);
      const [a, b] = lineToViewport(start, through, panel, false);
      labelAnchor = through;
      body = lineShape(a, b, panel, layer.presentation, { markerEnd: `url(#${idPrefix}-arrow)` });
      break;
    }
    case "polygon": {
      const points = layer.geometry.points.map((point) => resolvePoint(point, variables, scene, layer));
      const screen = points.map((point) => projected(point, panel));
      labelAnchor = points[0];
      body = element("polygon", {
        points: screen.map((point) => `${formatNumber(point.x)},${formatNumber(point.y)}`).join(" "),
        fill: patternFill(layer.presentation, idPrefix),
        "fill-opacity": 0.38,
        stroke: strokeColor(layer.presentation),
        "stroke-dasharray": layer.presentation.lineStyle === "dashed" ? "10 7" : layer.presentation.lineStyle === "dotted" ? "2 6" : undefined,
        "stroke-width": 2,
        "vector-effect": "non-scaling-stroke",
      });
      break;
    }
    case "circle": {
      const center = resolvePoint(layer.geometry.center, variables, scene, layer);
      const radius = resolveValue(layer.geometry.radius, variables, scene, layer);
      if (radius <= 0) throw new StaticSvgRenderError("invalid-radius", `Circle ${scene.id}/${layer.id} requires a positive radius.`, scene.id, layer.id);
      labelAnchor = { x: center.x + radius, y: center.y };
      const screen = projected(center, panel);
      body = strokeShape("ellipse", {
        cx: screen.x,
        cy: screen.y,
        rx: Math.abs(projectX(center.x + radius, panel) - screen.x),
        ry: Math.abs(projectY(center.y + radius, panel) - screen.y),
      }, layer.presentation, { width: 2.5, fill: layer.presentation.fillToken ? patternFill(layer.presentation, idPrefix) : "none" });
      break;
    }
    case "ellipse": {
      const center = resolvePoint(layer.geometry.center, variables, scene, layer);
      const radiusX = resolveValue(layer.geometry.radiusX, variables, scene, layer);
      const radiusY = resolveValue(layer.geometry.radiusY, variables, scene, layer);
      const rotation = resolveValue(layer.geometry.rotationRadians, variables, scene, layer);
      if (radiusX <= 0 || radiusY <= 0) throw new StaticSvgRenderError("invalid-radius", `Ellipse ${scene.id}/${layer.id} requires positive radii.`, scene.id, layer.id);
      labelAnchor = { x: center.x + radiusX, y: center.y };
      const screen = projected(center, panel);
      body = strokeShape("ellipse", {
        cx: screen.x,
        cy: screen.y,
        rx: Math.abs(projectX(center.x + radiusX, panel) - screen.x),
        ry: Math.abs(projectY(center.y + radiusY, panel) - screen.y),
        transform: `rotate(${formatNumber(rotation * 180 / Math.PI)} ${formatNumber(screen.x)} ${formatNumber(screen.y)})`,
      }, layer.presentation, { width: 2.5, fill: layer.presentation.fillToken ? patternFill(layer.presentation, idPrefix) : "none" });
      break;
    }
    case "region":
      body = renderRegion(scene, layer, panel, variables, idPrefix);
      break;
    case "inequality-region":
      body = renderInequalityRegion(scene, layer, panel, variables, idPrefix);
      break;
    case "vertical-asymptote": {
      const x = resolveValue(layer.geometry.x, variables, scene, layer);
      labelAnchor = { x, y: panel.viewport.yMax };
      body = lineShape({ x, y: panel.viewport.yMin }, { x, y: panel.viewport.yMax }, panel, layer.presentation, { width: 2 });
      break;
    }
    case "horizontal-asymptote": {
      const y = resolveValue(layer.geometry.y, variables, scene, layer);
      labelAnchor = { x: panel.viewport.xMax, y };
      body = lineShape({ x: panel.viewport.xMin, y }, { x: panel.viewport.xMax, y }, panel, layer.presentation, { width: 2 });
      break;
    }
    case "tangent-line": {
      const point = resolvePoint(layer.geometry.point, variables, scene, layer);
      const slope = resolveValue(layer.geometry.slope, variables, scene, layer);
      const start = { x: panel.viewport.xMin, y: point.y + slope * (panel.viewport.xMin - point.x) };
      const end = { x: panel.viewport.xMax, y: point.y + slope * (panel.viewport.xMax - point.x) };
      labelAnchor = point;
      body = lineShape(start, end, panel, layer.presentation);
      break;
    }
    case "secant-line": {
      const first = resolvePoint(layer.geometry.firstPoint, variables, scene, layer);
      const second = resolvePoint(layer.geometry.secondPoint, variables, scene, layer);
      const [start, end] = lineToViewport(first, second, panel, true);
      labelAnchor = second;
      body = lineShape(start, end, panel, layer.presentation);
      break;
    }
    case "grid":
      body = renderGridLayer(scene, layer, panel);
      break;
    case "basis-grid":
      body = renderBasisGrid(scene, layer, panel, variables);
      break;
    case "label": {
      const point = projected(resolvePoint(layer.geometry.position, variables, scene, layer), panel);
      const text = richTextToPlainText(layer.geometry.content);
      const placement = layoutTextLabel(point, text, panel, occupiedLabels, { size: 14, maxCharacters: 38, maxLines: 3 });
      body = textBlock(placement.x, placement.y, text, { className: "bvlp-annotation", size: 14, weight: 650, maxCharacters: 38, maxLines: 3, anchor: placement.anchor, labelBox: placement.box });
      break;
    }
    case "annotation": {
      const anchor = resolvePoint(layer.geometry.anchor, variables, scene, layer);
      const point = projected(anchor, panel);
      const text = richTextToPlainText(layer.geometry.content);
      const placement = layoutTextLabel(point, text, panel, occupiedLabels, { size: 13, maxCharacters: 38, maxLines: 3 });
      const leaderX = Math.max(placement.box.x, Math.min(placement.box.x + placement.box.width, point.x));
      const leaderY = Math.max(placement.box.y, Math.min(placement.box.y + placement.box.height, point.y));
      body = `${element("line", { x1: point.x, y1: point.y, x2: leaderX, y2: leaderY, stroke: strokeColor(layer.presentation), "stroke-opacity": 0.55, "stroke-width": 1 })}${element("circle", { cx: point.x, cy: point.y, r: 2.5, fill: strokeColor(layer.presentation) })}${textBlock(placement.x, placement.y, text, { className: "bvlp-annotation", size: 13, maxCharacters: 38, maxLines: 3, anchor: placement.anchor, labelBox: placement.box })}`;
      break;
    }
    case "error-band":
      body = renderErrorBand(layer, panel, idPrefix);
      break;
    case "linked-object":
      body = element("desc", {}, escapeXml(`Linked objects: ${layer.geometry.objectIds.join(", ")}; relation: ${layer.geometry.relation}.`));
      break;
  }
  body += genericLayerLabel(layer, labelAnchor, panel, occupiedLabels);
  return layerGroup(layer, body);
}

function semanticDescription(scene: Scene): string {
  const layerMap = new Map(scene.layers.map((layer) => [layer.id, layer]));
  const panelMap = new Map(scene.panels.map((panel) => [panel.id, panel]));
  const controlMap = new Map(scene.controls.map((control) => [control.id, control]));
  const order = scene.accessibility.readingOrder.map((id) => {
    const layer = layerMap.get(id);
    if (layer) return `${id}: ${layer.presentation.colorIndependentCue}`;
    const panel = panelMap.get(id);
    if (panel) return `${id}: ${panel.description}`;
    const control = controlMap.get(id);
    if (control) return `${id}: ${richTextToPlainText(control.label)}`;
    return id;
  });
  return [
    scene.accessibility.summary,
    scene.longDescription,
    scene.accessibility.colorIndependentDescription,
    `Caption: ${richTextToPlainText(scene.caption)}`,
    `Reading order: ${order.join("; ")}.`,
  ].join(" ");
}

function renderPanel(
  scene: Scene,
  layout: SceneLayout,
  panel: PanelLayout,
  variables: Variables,
  idPrefix: string,
): string {
  const panelKey = idFragment(panel.id ?? "default");
  const groupId = `${idPrefix}-panel-${panelKey}`;
  const titleId = `${groupId}-title`;
  const descId = `${groupId}-desc`;
  const clipId = `${groupId}-clip`;
  const sortedLayers = scene.layers
    .filter((layer) => (!scene.panels.length || layer.panelId === panel.id))
    .filter((layer) => !scene.controls.some((control) => control.kind === "toggle" && control.initial === false && control.targetLayerIds.includes(layer.id)))
    .sort((left, right) => left.zIndex - right.zIndex || left.id.localeCompare(right.id));
  const title = panel.title ? richTextToPlainText(panel.title) : richTextToPlainText(scene.title);
  const description = panel.description ?? scene.accessibility.summary;
  const panelTitle = panel.title
    ? textBlock(panel.frame.x + panel.frame.width / 2, panel.frame.y + 20, title, { className: "bvlp-panel-title", anchor: "middle", size: 15, weight: 700, maxCharacters: 44, maxLines: 1 })
    : "";
  const occupiedLabels: TextLabelBox[] = [];
  const plottedLayers = element("g", { "clip-path": `url(#${clipId})` }, sortedLayers.map((layer) => renderLayer(scene, layer, panelForLayer(scene, layout, layer.panelId), variables, idPrefix, occupiedLabels)).join(""));
  return element("g", { id: groupId, role: "group", "aria-labelledby": `${titleId} ${descId}` }, `${element("title", { id: titleId }, escapeXml(title))}${element("desc", { id: descId }, escapeXml(description))}${panelTitle}${renderAxes(panel)}${plottedLayers}`);
}

function panelClipDefinitions(layout: SceneLayout, idPrefix: string): string {
  const clips = layout.panels.map((panel) => {
    const panelKey = idFragment(panel.id ?? "default");
    return element("clipPath", { id: `${idPrefix}-panel-${panelKey}-clip` }, element("rect", {
      x: panel.plot.x,
      y: panel.plot.y,
      width: panel.plot.width,
      height: panel.plot.height,
    }));
  }).join("");
  return `<defs>${clips}</defs>`;
}

export function renderStaticSvg(
  input: CompiledScene,
  options: StaticSvgRenderOptions = {},
): StaticSvgRenderResult {
  const parsed = CompiledSceneSchema.safeParse(input);
  if (!parsed.success) {
    const sceneId = input && typeof input === "object" && "id" in input ? String(input.id) : undefined;
    throw new StaticSvgRenderError(
      "invalid-compiled-scene",
      `Static SVG requires a valid CompiledScene v1${sceneId ? ` for ${sceneId}` : ""}: ${parsed.error.message}`,
      sceneId,
    );
  }
  const scene = parsed.data as Scene;
  if (scene.requiredCapabilities.some((capability) => capability.endsWith("-3d"))) {
    throw new StaticSvgRenderError("unsupported-3d", `Static SVG v1 cannot render 3D capability requirements for ${scene.id}.`, scene.id);
  }
  const layout = createSceneLayout(scene);
  const idPrefix = `bvlp-${idFragment(scene.id)}`;
  const titleId = `${idPrefix}-title`;
  const descriptionId = `${idPrefix}-description`;
  const variables = initialVariables(scene);
  const title = richTextToPlainText(scene.title);
  const description = semanticDescription(scene);
  const panels = layout.panels.map((panel) => renderPanel(scene, layout, panel, variables, idPrefix)).join("");
  const svg = `<svg${attrs({
    xmlns: "http://www.w3.org/2000/svg",
    class: "bvlp-svg",
    role: "img",
    "aria-labelledby": `${titleId} ${descriptionId}`,
    "data-bvlp-scene": scene.id,
    "data-grayscale-safe": scene.print.grayscaleSafe,
    focusable: "false",
    viewBox: `0 0 ${layout.width} ${layout.height}`,
    width: "100%",
    height: layout.height,
    preserveAspectRatio: "xMidYMid meet",
    style: "display:block;height:auto;max-width:100%;width:100%",
  })}>${element("title", { id: titleId }, escapeXml(title))}${element("desc", { id: descriptionId }, escapeXml(description))}${PRINT_SAFE_STYLE}${rootDefinitions(idPrefix)}${panelClipDefinitions(layout, idPrefix)}${panels}</svg>\n`;
  const metadata = measureStaticSvg(scene.id, svg, options);
  return Object.freeze({ svg, width: layout.width, height: layout.height, ...metadata });
}
