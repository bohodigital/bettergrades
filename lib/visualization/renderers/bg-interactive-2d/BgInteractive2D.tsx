"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from "react";

import type { NumericAst } from "../../ast/schema.ts";
import type { PublicCompiledScene } from "../../schema/index.ts";
import {
  CONTROL_KEYS,
  controlAnnouncement,
  controlValue,
  formatControlValue,
  initialControlState,
  normalizeRangeValue,
  sliderValueForKey,
  stepIndexForKey,
  type InteractiveControlState,
} from "./controls.ts";
import { sceneValueSummary } from "./metrics.ts";
import {
  evaluateSceneValue,
  makePlotTransform,
  mediaPrefersReducedMotion,
  observeElementSize,
  panViewport,
  sampleExpressionPath,
  zoomViewport,
  type PlotTransform,
  type RuntimeViewport,
} from "./runtime.ts";

export type BgInteractive2DProps = Readonly<{
  scene: PublicCompiledScene;
  className?: string;
  onReady?: (sceneId: string) => void;
  onError?: (error: Error) => void;
}>;

type RuntimeValue = number | NumericAst;
type RuntimePointValue = { x: RuntimeValue; y: RuntimeValue };
type RuntimePresentation = PublicCompiledScene["layers"][number]["presentation"];
type RuntimeLayer = {
  id: string;
  kind: string;
  visible: boolean;
  zIndex: number;
  presentation: RuntimePresentation;
  geometry: unknown;
  label?: PublicCompiledScene["title"];
};
type FunctionGeometry = { expression: NumericAst; variable: string; domain: { min: number; max: number; includeMin: boolean; includeMax: boolean } };
type LineGeometry = { start: RuntimePointValue; end: RuntimePointValue };
type RayGeometry = { start: RuntimePointValue; through: RuntimePointValue };
type TangentGeometry = { point: RuntimePointValue; slope: RuntimeValue };
type SecantGeometry = { firstPoint: RuntimePointValue; secondPoint: RuntimePointValue };
type PositionGeometry = { position: RuntimePointValue };
type CircleGeometry = { center: RuntimePointValue; radius: RuntimeValue };
type SampledSeriesGeometry = { xValues: number[]; yValues: number[]; connect: boolean };
type PolygonGeometry = { points: RuntimePointValue[] };
type RegionGeometry = { boundaryLayerIds: string[] };
type TextGeometry = { position?: RuntimePointValue; anchor?: RuntimePointValue; content: PublicCompiledScene["title"] };
type SceneControl = PublicCompiledScene["controls"][number];
type MutableState = Record<string, number | boolean>;

const FRAME_WIDTH = 720;
const TOUCH_STYLE: CSSProperties = { minWidth: 44, minHeight: 44 };

function richText(value: { segments: Array<{ kind: "text"; text: string } | { kind: "math"; spokenText: string }> }): string {
  return value.segments.map((segment) => segment.kind === "text" ? segment.text : segment.spokenText).join(" ");
}

type RuntimeLabelBox = { x: number; y: number; width: number; height: number };

function runtimeTextLines(text: string, maxCharacters = 30, maxLines = 2): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const current = lines.at(-1);
    if (!current || current.length + word.length + 1 > maxCharacters) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
  }
  if (lines.length <= maxLines) return lines.length ? lines : [""];
  const visible = lines.slice(0, maxLines);
  visible[maxLines - 1] = `${visible[maxLines - 1].replace(/[.,;:]?$/, "")}…`;
  return visible;
}

function runtimeBoxesOverlap(left: RuntimeLabelBox, right: RuntimeLabelBox, padding = 4): boolean {
  return left.x < right.x + right.width + padding
    && left.x + left.width + padding > right.x
    && left.y < right.y + right.height + padding
    && left.y + left.height + padding > right.y;
}

function layoutRuntimeLabel(
  point: { x: number; y: number },
  text: string,
  plot: PlotTransform,
  occupied: RuntimeLabelBox[],
  options: { size?: number; maxCharacters?: number; maxLines?: number } = {},
) {
  const size = options.size ?? 12;
  const lines = runtimeTextLines(text, options.maxCharacters, options.maxLines);
  const width = Math.min(plot.width - 18, Math.max(28, Math.max(...lines.map((line) => line.length)) * size * 0.58 + 6));
  const height = Math.max(size * 1.22, lines.length * size * 1.22);
  const left = plot.left + 9;
  const top = plot.top + 9;
  const right = plot.left + plot.width - 9;
  const bottom = plot.top + plot.height - 9;
  const clamp = (x: number, y: number): RuntimeLabelBox => ({ x: Math.max(left, Math.min(right - width, x)), y: Math.max(top, Math.min(bottom - height, y)), width, height });
  const candidates = [
    clamp(point.x + 10, point.y - height - 9),
    clamp(point.x + 10, point.y + 10),
    clamp(point.x - width - 10, point.y - height - 9),
    clamp(point.x - width - 10, point.y + 10),
    clamp(point.x - width / 2, point.y - height - 13),
    clamp(point.x - width / 2, point.y + 13),
  ];
  let box = candidates.find((candidate) => occupied.every((other) => !runtimeBoxesOverlap(candidate, other)));
  if (!box) {
    for (let y = top; y <= bottom - height && !box; y += Math.max(10, height / 2)) {
      for (let x = left; x <= right - width; x += 12) {
        const candidate = { x, y, width, height };
        if (occupied.every((other) => !runtimeBoxesOverlap(candidate, other))) { box = candidate; break; }
      }
    }
  }
  box ??= candidates[0];
  occupied.push(box);
  return { box, lines, x: box.x, y: box.y + size };
}

function renderRuntimeTextLabel(
  point: { x: number; y: number },
  text: string,
  color: string,
  plot: PlotTransform,
  occupied: RuntimeLabelBox[],
  options: { size?: number; maxCharacters?: number; maxLines?: number } = {},
) {
  const size = options.size ?? 12;
  const placement = layoutRuntimeLabel(point, text, plot, occupied, options);
  return <text
    x={placement.x}
    y={placement.y}
    fill={color}
    fontSize={size}
    fontWeight="650"
    data-bvlp-runtime-label-box={`${placement.box.x.toFixed(2)},${placement.box.y.toFixed(2)},${placement.box.width.toFixed(2)},${placement.box.height.toFixed(2)}`}
    style={{ paintOrder: "stroke", stroke: "var(--surface, #fffcf6)", strokeWidth: 4, strokeLinejoin: "round" }}
  >{placement.lines.map((line, index) => <tspan x={placement.x} dy={index === 0 ? 0 : "1.22em"} key={`${line}-${index}`}>{line}</tspan>)}</text>;
}

function numericParameters(state: InteractiveControlState): Record<string, number> {
  return Object.fromEntries(
    Object.entries(state).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
  );
}

function tokenColor(token: string | undefined, fill = false): string {
  const map: Record<string, string> = {
    "visual-primary": "var(--brand, #125d50)",
    "visual-secondary": "var(--muted, #68716a)",
    "visual-emphasis": "var(--warm, #d8582f)",
    "visual-success": "var(--good, #1b7258)",
    "visual-bound": "var(--warm, #d8582f)",
    "visual-warning": "var(--bad, #b94738)",
    "visual-ink": "var(--ink, #17231e)",
    "visual-neutral": "var(--muted, #68716a)",
    "visual-emphasis-soft": "var(--warm-soft, #f8dccd)",
    "visual-success-soft": "var(--brand-soft, #dcebe4)",
    "visual-neutral-soft": "var(--surface, #fffcf6)",
  };
  return map[token ?? ""] ?? (fill ? "var(--brand-soft, #dcebe4)" : "var(--brand, #125d50)");
}

function dashArray(layer: RuntimeLayer): string | undefined {
  if (layer.presentation.lineStyle === "dashed") return "8 6";
  if (layer.presentation.lineStyle === "dotted") return "2 6";
  if (layer.presentation.lineStyle === "double") return "12 3 2 3";
  return undefined;
}

function pointValue(
  point: { x: number | NumericAst; y: number | NumericAst },
  variables: Readonly<Record<string, number>>,
  scene: PublicCompiledScene,
) {
  return {
    x: evaluateSceneValue(point.x, variables, scene),
    y: evaluateSceneValue(point.y, variables, scene),
  };
}

function hiddenLayerIds(scene: PublicCompiledScene, state: InteractiveControlState): ReadonlySet<string> {
  const hidden = new Set<string>();
  for (const control of scene.controls) {
    if (control.kind === "toggle" && state[control.id] === false) {
      for (const id of control.targetLayerIds) hidden.add(id);
    }
  }
  return hidden;
}

function runtimeLayerLabelAnchor(
  layer: RuntimeLayer,
  scene: PublicCompiledScene,
  variables: Readonly<Record<string, number>>,
  plot: PlotTransform,
): { x: number; y: number } | undefined {
  let point: { x: number; y: number } | undefined;
  if (["point", "open-point", "closed-point", "data-marker"].includes(layer.kind)) {
    point = pointValue((layer.geometry as PositionGeometry).position, variables, scene);
  } else if (layer.kind === "vertical-asymptote") {
    point = { x: evaluateSceneValue((layer.geometry as { x: RuntimeValue }).x, variables, scene), y: scene.viewport.yMax - (scene.viewport.yMax - scene.viewport.yMin) * 0.14 };
  } else if (layer.kind === "horizontal-asymptote") {
    point = { x: scene.viewport.xMin + (scene.viewport.xMax - scene.viewport.xMin) * 0.72, y: evaluateSceneValue((layer.geometry as { y: RuntimeValue }).y, variables, scene) };
  } else if (layer.kind === "tangent-line") {
    point = pointValue((layer.geometry as TangentGeometry).point, variables, scene);
  } else if (layer.kind === "secant-line") {
    point = pointValue((layer.geometry as SecantGeometry).secondPoint, variables, scene);
  } else if (layer.kind === "line" || layer.kind === "segment") {
    point = pointValue((layer.geometry as LineGeometry).end, variables, scene);
  } else if (layer.kind === "function" || layer.kind === "piecewise-branch") {
    const geometry = layer.geometry as FunctionGeometry;
    const x = geometry.domain.min + (geometry.domain.max - geometry.domain.min) * 0.08;
    point = { x, y: evaluateSceneValue(geometry.expression, { ...variables, [geometry.variable]: x }, scene) };
  }
  return point ? { x: plot.x(point.x), y: plot.y(point.y) } : undefined;
}

function renderRuntimeLayerLabel(
  layer: RuntimeLayer,
  scene: PublicCompiledScene,
  variables: Readonly<Record<string, number>>,
  plot: PlotTransform,
  occupied: RuntimeLabelBox[],
) {
  if (!layer.label || layer.kind === "label" || layer.kind === "annotation") return null;
  const anchor = runtimeLayerLabelAnchor(layer, scene, variables, plot);
  if (!anchor) return null;
  return renderRuntimeTextLabel(anchor, richText(layer.label), tokenColor(layer.presentation.strokeToken), plot, occupied, { size: 12, maxCharacters: 28, maxLines: 2 });
}

function regionShape(
  layer: RuntimeLayer,
  scene: PublicCompiledScene,
  variables: Readonly<Record<string, number>>,
  plot: PlotTransform,
) {
  const geometry = layer.geometry as RegionGeometry;
  const sceneLayers = scene.layers as unknown as RuntimeLayer[];
  const boundaries = geometry.boundaryLayerIds
    .map((id) => sceneLayers.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is RuntimeLayer => Boolean(candidate));
  const lines = boundaries.filter((candidate) => candidate.kind === "line");
  if (lines.length === 2) {
    const values = lines.map((line) => {
      const lineGeometry = line.geometry as LineGeometry;
      return {
        start: pointValue(lineGeometry.start, variables, scene),
        end: pointValue(lineGeometry.end, variables, scene),
      };
    });
    const horizontal = values.every(({ start, end }) => Math.abs(start.y - end.y) < 1e-9);
    const vertical = values.every(({ start, end }) => Math.abs(start.x - end.x) < 1e-9);
    if (horizontal) {
      const yValues = values.map(({ start }) => plot.y(start.y));
      return <rect x={plot.left} y={Math.min(...yValues)} width={plot.width} height={Math.abs(yValues[1] - yValues[0])} />;
    }
    if (vertical) {
      const xValues = values.map(({ start }) => plot.x(start.x));
      return <rect x={Math.min(...xValues)} y={plot.top} width={Math.abs(xValues[1] - xValues[0])} height={plot.height} />;
    }
  }
  if (scene.id === "unit-circle-squeeze" && typeof variables.theta === "number") {
    const theta = variables.theta;
    const origin = `${plot.x(0).toFixed(2)},${plot.y(0).toFixed(2)}`;
    const start = `${plot.x(1).toFixed(2)},${plot.y(0).toFixed(2)}`;
    const end = `${plot.x(Math.cos(theta)).toFixed(2)},${plot.y(Math.sin(theta)).toFixed(2)}`;
    const radiusX = Math.abs(plot.x(1) - plot.x(0));
    const radiusY = Math.abs(plot.y(1) - plot.y(0));
    return <path d={`M${origin} L${start} A${radiusX.toFixed(2)},${radiusY.toFixed(2)} 0 0 0 ${end} Z`} />;
  }
  return null;
}

function renderLayer({
  layer,
  scene,
  variables,
  plot,
  occupiedLabels,
}: {
  layer: RuntimeLayer;
  scene: PublicCompiledScene;
  variables: Readonly<Record<string, number>>;
  plot: PlotTransform;
  occupiedLabels: RuntimeLabelBox[];
}) {
  const stroke = tokenColor(layer.presentation.strokeToken);
  const fill = tokenColor(layer.presentation.fillToken, true);
  const common = {
    stroke,
    strokeWidth: layer.presentation.lineStyle === "double" ? 3.5 : 2.5,
    strokeDasharray: dashArray(layer),
    vectorEffect: "non-scaling-stroke" as const,
  };
  if (layer.kind === "sampled-series") {
    const geometry = layer.geometry as SampledSeriesGeometry;
    const points = geometry.xValues.map((x, index) => ({ x: plot.x(x), y: plot.y(geometry.yValues[index]) }));
    if (geometry.connect) {
      return <polyline
        points={points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")}
        fill="none"
        {...common}
      />;
    }
    return <g>{points.map((point, index) => <circle key={`${layer.id}-${index}`} cx={point.x} cy={point.y} r={3} fill={fill} {...common} />)}</g>;
  }
  if (layer.kind === "function" || layer.kind === "piecewise-branch") {
    const geometry = layer.geometry as FunctionGeometry;
    const d = sampleExpressionPath(
      geometry.expression,
      geometry.variable,
      geometry.domain,
      variables,
      scene,
      plot,
    );
    return <path d={d} fill="none" {...common} />;
  }
  if (layer.kind === "line" || layer.kind === "segment") {
    const geometry = layer.geometry as LineGeometry;
    const start = pointValue(geometry.start, variables, scene);
    const end = pointValue(geometry.end, variables, scene);
    return <line x1={plot.x(start.x)} y1={plot.y(start.y)} x2={plot.x(end.x)} y2={plot.y(end.y)} {...common} />;
  }
  if (layer.kind === "ray") {
    const geometry = layer.geometry as RayGeometry;
    const start = pointValue(geometry.start, variables, scene);
    const end = pointValue(geometry.through, variables, scene);
    return <line x1={plot.x(start.x)} y1={plot.y(start.y)} x2={plot.x(end.x)} y2={plot.y(end.y)} {...common} />;
  }
  if (layer.kind === "tangent-line") {
    const geometry = layer.geometry as TangentGeometry;
    const point = pointValue(geometry.point, variables, scene);
    const slope = evaluateSceneValue(geometry.slope, variables, scene);
    const leftY = point.y + slope * (scene.viewport.xMin - point.x);
    const rightY = point.y + slope * (scene.viewport.xMax - point.x);
    return <line x1={plot.x(scene.viewport.xMin)} y1={plot.y(leftY)} x2={plot.x(scene.viewport.xMax)} y2={plot.y(rightY)} {...common} />;
  }
  if (layer.kind === "secant-line") {
    const geometry = layer.geometry as SecantGeometry;
    const start = pointValue(geometry.firstPoint, variables, scene);
    const end = pointValue(geometry.secondPoint, variables, scene);
    return <line x1={plot.x(start.x)} y1={plot.y(start.y)} x2={plot.x(end.x)} y2={plot.y(end.y)} {...common} />;
  }
  if (layer.kind === "point" || layer.kind === "open-point" || layer.kind === "closed-point" || layer.kind === "data-marker") {
    const geometry = layer.geometry as PositionGeometry;
    const position = pointValue(geometry.position, variables, scene);
    const open = layer.kind === "open-point";
    return <circle cx={plot.x(position.x)} cy={plot.y(position.y)} r={open ? 6 : 5} fill={open ? "var(--surface, #fffcf6)" : fill} {...common} />;
  }
  if (layer.kind === "vertical-asymptote") {
    const x = plot.x(evaluateSceneValue((layer.geometry as { x: RuntimeValue }).x, variables, scene));
    return <line x1={x} y1={plot.top} x2={x} y2={plot.top + plot.height} {...common} />;
  }
  if (layer.kind === "horizontal-asymptote") {
    const y = plot.y(evaluateSceneValue((layer.geometry as { y: RuntimeValue }).y, variables, scene));
    return <line x1={plot.left} y1={y} x2={plot.left + plot.width} y2={y} {...common} />;
  }
  if (layer.kind === "circle") {
    const geometry = layer.geometry as CircleGeometry;
    const center = pointValue(geometry.center, variables, scene);
    const radius = evaluateSceneValue(geometry.radius, variables, scene);
    return <ellipse cx={plot.x(center.x)} cy={plot.y(center.y)} rx={Math.abs(plot.x(center.x + radius) - plot.x(center.x))} ry={Math.abs(plot.y(center.y + radius) - plot.y(center.y))} fill="none" {...common} />;
  }
  if (layer.kind === "polygon") {
    const points = (layer.geometry as PolygonGeometry).points.map((point) => {
      const value = pointValue(point, variables, scene);
      return `${plot.x(value.x).toFixed(2)},${plot.y(value.y).toFixed(2)}`;
    }).join(" ");
    return <polygon points={points} fill={fill} fillOpacity={0.28} {...common} />;
  }
  if (layer.kind === "region") {
    const shape = regionShape(layer, scene, variables, plot);
    return shape ? <g fill={fill} fillOpacity={0.26} stroke="none">{shape}</g> : null;
  }
  if (layer.kind === "label" || layer.kind === "annotation") {
    const geometry = layer.geometry as TextGeometry;
    const point = layer.kind === "label" ? geometry.position : geometry.anchor;
    if (!point) return null;
    const anchor = pointValue(point, variables, scene);
    const content = richText(geometry.content);
    return renderRuntimeTextLabel({ x: plot.x(anchor.x), y: plot.y(anchor.y) }, content, stroke, plot, occupiedLabels, { size: 12, maxCharacters: 34, maxLines: 3 });
  }
  return null;
}

function gridLines(plot: PlotTransform) {
  return Array.from({ length: 6 }, (_, index) => {
    const x = plot.left + (plot.width * index) / 5;
    const y = plot.top + (plot.height * index) / 5;
    return <g key={index}><line x1={x} y1={plot.top} x2={x} y2={plot.top + plot.height} /><line x1={plot.left} y1={y} x2={plot.left + plot.width} y2={y} /></g>;
  });
}

function axisTickValues(min: number, max: number, count = 5): number[] {
  return Array.from({ length: count }, (_, index) => min + ((max - min) * index) / (count - 1));
}

function formatAxisValue(value: number): string {
  const rounded = Math.abs(value) < 1e-10 ? 0 : Number(value.toPrecision(4));
  return String(rounded);
}

function renderInteractiveAxes(scene: PublicCompiledScene, viewport: RuntimeViewport, plot: PlotTransform) {
  if (scene.axes.mode === "none") return null;
  const xAxis = scene.axes.axes.find((axis) => axis.orientation === "x" || axis.orientation === "angular");
  const yAxis = scene.axes.axes.find((axis) => axis.orientation === "y" || axis.orientation === "radial");
  const xTicks = axisTickValues(viewport.xMin, viewport.xMax);
  const yTicks = axisTickValues(viewport.yMin, viewport.yMax);
  const xAxisY = viewport.yMin <= 0 && viewport.yMax >= 0 ? plot.y(0) : plot.top + plot.height;
  const yAxisX = viewport.xMin <= 0 && viewport.xMax >= 0 ? plot.x(0) : plot.left;
  const halo = { paintOrder: "stroke" as const, stroke: "var(--surface, #fffcf6)", strokeWidth: 3, strokeLinejoin: "round" as const };
  return <g className="bvlp-interactive__axes" aria-hidden="true" fill="var(--muted, #68716a)" fontSize="10">
    {xAxis && <>
      <line x1={plot.left} x2={plot.left + plot.width} y1={xAxisY} y2={xAxisY} stroke="var(--ink, #17231e)" strokeWidth="1.4" />
      {xTicks.map((value) => <g key={`x-${value}`}><line x1={plot.x(value)} x2={plot.x(value)} y1={xAxisY - 4} y2={xAxisY + 4} stroke="var(--ink, #17231e)" /><text x={plot.x(value)} y={plot.top + plot.height + 20} textAnchor="middle" style={halo}>{formatAxisValue(value)}</text></g>)}
      <text x={plot.left + plot.width} y={plot.top + plot.height + 38} textAnchor="end" fontSize="12" fontWeight="700" style={halo}>{richText(xAxis.label)}</text>
    </>}
    {yAxis && <>
      <line x1={yAxisX} x2={yAxisX} y1={plot.top} y2={plot.top + plot.height} stroke="var(--ink, #17231e)" strokeWidth="1.4" />
      {yTicks.map((value) => <g key={`y-${value}`}><line x1={yAxisX - 4} x2={yAxisX + 4} y1={plot.y(value)} y2={plot.y(value)} stroke="var(--ink, #17231e)" /><text x={plot.left - 9} y={plot.y(value) + 4} textAnchor="end" style={halo}>{formatAxisValue(value)}</text></g>)}
      <text x={plot.left - 8} y={plot.top - 8} textAnchor="end" fontSize="12" fontWeight="700" style={halo}>{richText(yAxis.label)}</text>
    </>}
  </g>;
}

function InteractiveControl({
  control,
  state,
  setValue,
}: {
  control: SceneControl;
  state: InteractiveControlState;
  setValue: (key: string, value: number | boolean, announcement: string) => void;
}) {
  const label = richText(control.label);
  const value = controlValue(control, state);
  if (control.kind === "toggle") {
    const checked = value === true;
    return <div className="bvlp-interactive__control"><span>{label}</span><button type="button" aria-pressed={checked} style={TOUCH_STYLE} onClick={() => setValue(control.id, !checked, controlAnnouncement(control, !checked))}>{checked ? "Shown" : "Hidden"}</button></div>;
  }
  if (control.kind === "slider" || control.kind === "parameter-input") {
    const current = typeof value === "number" ? value : control.initial;
    const update = (next: number) => {
      const normalized = normalizeRangeValue(next, control.min, control.max, control.step);
      setValue(control.parameter, normalized, controlAnnouncement(control, normalized));
    };
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      update(sliderValueForKey(current, event.key, control));
    };
    return <label className="bvlp-interactive__control"><span>{label}</span><input type="range" min={control.min} max={control.max} step={control.step} value={current} aria-valuetext={formatControlValue(current)} style={{ minHeight: 44, touchAction: "manipulation" }} onChange={(event) => update(Number(event.currentTarget.value))} onKeyDown={onKeyDown} /><output tabIndex={0} aria-label={`${label} current value`}>{formatControlValue(current)}</output></label>;
  }
  if (control.kind === "step-control") {
    const index = Math.max(0, control.values.findIndex((candidate) => Object.is(candidate, value)));
    const update = (nextIndex: number) => {
      const bounded = Math.max(0, Math.min(control.values.length - 1, nextIndex));
      const next = control.values[bounded];
      setValue(control.parameter, next, controlAnnouncement(control, next));
    };
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (!CONTROL_KEYS.has(event.key)) return;
      event.preventDefault();
      update(stepIndexForKey(index, event.key, control.values.length - 1));
    };
    return <label className="bvlp-interactive__control"><span>{label}</span><input type="range" min={0} max={control.values.length - 1} step={1} value={index} aria-valuetext={formatControlValue(control.values[index])} style={{ minHeight: 44, touchAction: "manipulation" }} onChange={(event) => update(Number(event.currentTarget.value))} onKeyDown={onKeyDown} /><output tabIndex={0} aria-label={`${label} current value`}>{formatControlValue(control.values[index])}</output></label>;
  }
  return null;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mediaPrefersReducedMotion(media));
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function validateRuntimeScene(scene: PublicCompiledScene): string | null {
  if (scene.compiledSceneVersion !== 1 || scene.sourceSpecVersion !== 1) return "Unsupported visual scene version.";
  if (!scene.staticFallback?.required || scene.staticFallback.rendererId !== "static-svg") return "A required static fallback was not declared.";
  if (scene.selectedRenderer !== "bg-interactive-2d") return `Scene selected ${scene.selectedRenderer}, not BetterGrades Interactive 2D.`;
  if (!scene.controls.length) return "The scene has no interactive controls.";
  return null;
}

function BgInteractive2DInstance({ scene, className, onReady, onError }: BgInteractive2DProps) {
  const initialError = validateRuntimeScene(scene);
  const originalViewport = useMemo<RuntimeViewport>(() => ({
    xMin: scene.viewport.xMin,
    xMax: scene.viewport.xMax,
    yMin: scene.viewport.yMin,
    yMax: scene.viewport.yMax,
  }), [scene]);
  const [viewport, setViewport] = useState<RuntimeViewport>(originalViewport);
  const [state, setState] = useState<InteractiveControlState>(() => initialControlState(scene));
  const [announcement, setAnnouncement] = useState("Interactive controls loaded. The static visual remains available.");
  const [readout, setReadout] = useState("Coordinates appear here while exploring.");
  const [pixelWidth, setPixelWidth] = useState(FRAME_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const height = Math.max(300, Math.min(520, FRAME_WIDTH / scene.viewport.aspectRatio));
  const plot = useMemo(() => makePlotTransform(viewport, FRAME_WIDTH, height), [height, viewport]);
  const parameters = useMemo(() => numericParameters(state), [state]);
  const hidden = useMemo(() => hiddenLayerIds(scene, state), [scene, state]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    return observeElementSize(element, setPixelWidth);
  }, []);

  const setValue = (key: string, value: number | boolean, message: string) => {
    setState((current) => Object.freeze({ ...current, [key]: value }) as MutableState);
    setAnnouncement(`${message} ${sceneValueSummary(scene.id, { ...state, [key]: value })}`);
  };

  const zoom = (factor: number, center = { x: (viewport.xMin + viewport.xMax) / 2, y: (viewport.yMin + viewport.yMax) / 2 }) => {
    setViewport((current) => zoomViewport(current, factor, center, originalViewport));
    setAnnouncement(factor < 1 ? "Plot zoomed in." : "Plot zoomed out.");
  };

  const pointerCoordinates = (event: Pick<PointerEvent<SVGSVGElement> | WheelEvent<SVGSVGElement>, "clientX" | "clientY" | "currentTarget">) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const svgX = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * FRAME_WIDTH;
    const svgY = ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * height;
    return { svgX, svgY, x: plot.inverseX(svgX), y: plot.inverseY(svgY) };
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };
  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const coordinates = pointerCoordinates(event);
    setReadout(`x ${Number(coordinates.x.toFixed(4))}, y ${Number(coordinates.y.toFixed(4))}`);
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const scale = FRAME_WIDTH / Math.max(1, pixelWidth);
    setViewport((current) => panViewport(current, { x: (event.clientX - drag.x) * scale, y: (event.clientY - drag.y) * scale }, plot));
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY };
  };
  const endPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const coordinates = pointerCoordinates(event);
    zoom(event.deltaY < 0 ? 0.86 : 1.16, coordinates);
  };
  const onPlotKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(0.8); }
    if (event.key === "-" || event.key === "_") { event.preventDefault(); zoom(1.25); }
    if (event.key === "0" || event.key === "Home") {
      event.preventDefault();
      setViewport(originalViewport);
      setAnnouncement("Plot view reset.");
    }
  };

  let plotContent: ReactNode;
  let renderError: string | null = initialError;
  try {
    const occupiedLabels: RuntimeLabelBox[] = [];
    plotContent = (scene.layers as unknown as RuntimeLayer[])
      .filter((layer) => layer.visible && !hidden.has(layer.id))
      .sort((left, right) => left.zIndex - right.zIndex || left.id.localeCompare(right.id))
      .map((layer) => <g key={layer.id}>
        {renderLayer({ layer, scene, variables: parameters, plot, occupiedLabels })}
        {renderRuntimeLayerLabel(layer, scene, parameters, plot, occupiedLabels)}
      </g>);
  } catch (error) {
    renderError = error instanceof Error ? error.message : String(error);
  }

  useEffect(() => {
    if (renderError) onError?.(new Error(renderError));
    else onReady?.(scene.id);
  }, [onError, onReady, renderError, scene.id]);

  if (renderError) {
    return <div className={className} role="alert" data-bvlp-interactive-error>{`Interactive controls are unavailable: ${renderError} The static visual remains available.`}</div>;
  }

  const clipId = `bvlp-clip-${scene.id}`;
  return <section ref={containerRef} className={className} data-bvlp-interactive="v1" data-reduced-motion={reducedMotion ? "true" : "false"} aria-label={`Interactive enhancement: ${scene.accessibility.ariaLabel}`}>
    <div className="bvlp-interactive__toolbar" role="group" aria-label="Plot view controls">
      <button type="button" style={TOUCH_STYLE} onClick={() => zoom(0.8)} aria-label="Zoom plot in">Zoom in +</button>
      <button type="button" style={TOUCH_STYLE} onClick={() => zoom(1.25)} aria-label="Zoom plot out">Zoom out −</button>
      <button type="button" style={TOUCH_STYLE} onClick={() => { setViewport(originalViewport); setAnnouncement("Plot view reset."); }}>Reset view</button>
      <output tabIndex={0} aria-label="Plot coordinate readout">{readout}</output>
    </div>
    <svg viewBox={`0 0 ${FRAME_WIDTH} ${height}`} role="img" tabIndex={0} aria-label={`${scene.accessibility.ariaLabel} Interactive plot. Drag to pan; use plus and minus to zoom; press zero to reset.`} style={{ width: "100%", height: "auto", touchAction: "none", cursor: "grab" }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endPointer} onPointerCancel={endPointer} onWheel={onWheel} onKeyDown={onPlotKeyDown}>
      <defs><clipPath id={clipId}><rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} /></clipPath></defs>
      <rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} fill="var(--surface, #fffcf6)" stroke="var(--line, #cfcabe)" />
      <g stroke="var(--line, #cfcabe)" strokeWidth="1" opacity="0.55">{gridLines(plot)}</g>
      {renderInteractiveAxes(scene, viewport, plot)}
      <g clipPath={`url(#${clipId})`}>{plotContent}</g>
    </svg>
    <div className="bvlp-interactive__controls" role="group" aria-label="Interactive visual controls">
      {scene.controls.map((control) => <InteractiveControl key={control.id} control={control} state={state} setValue={setValue} />)}
    </div>
    <p className="bvlp-interactive__summary" tabIndex={0}>{sceneValueSummary(scene.id, state)}</p>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}

export function BgInteractive2D(props: BgInteractive2DProps) {
  const instanceKey = `${props.scene.id}:${props.scene.provenance.sourceFingerprint}`;
  return <BgInteractive2DInstance key={instanceKey} {...props} />;
}

export default BgInteractive2D;
