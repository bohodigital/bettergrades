import { evaluateNumericAst } from "../../ast/evaluate.ts";
import type { NumericAst } from "../../ast/schema.ts";
import type { PublicCompiledScene } from "../../schema/index.ts";

export type RuntimeViewport = Readonly<{
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}>;

export type Point = Readonly<{ x: number; y: number }>;

export type PlotTransform = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
  x: (value: number) => number;
  y: (value: number) => number;
  inverseX: (value: number) => number;
  inverseY: (value: number) => number;
}>;

export type SizeObserver = Readonly<{
  observe: (element: Element) => void;
  disconnect: () => void;
}>;

export type SizeObserverFactory = (
  callback: (entries: readonly ResizeObserverEntry[]) => void,
) => SizeObserver;

export function observeElementSize(
  element: Element,
  onWidth: (width: number) => void,
  factory: SizeObserverFactory = (callback) => new ResizeObserver(callback),
): () => void {
  const observer = factory((entries) => {
    const width = entries[0]?.contentRect.width;
    if (typeof width === "number" && Number.isFinite(width) && width > 0) onWidth(width);
  });
  observer.observe(element);
  return () => observer.disconnect();
}

export function mediaPrefersReducedMotion(media: Pick<MediaQueryList, "matches">): boolean {
  return media.matches;
}

export function makePlotTransform(
  viewport: RuntimeViewport,
  width: number,
  height: number,
): PlotTransform {
  const left = 52;
  const top = 18;
  const right = 18;
  const bottom = 42;
  const innerWidth = Math.max(1, width - left - right);
  const innerHeight = Math.max(1, height - top - bottom);
  const xSpan = viewport.xMax - viewport.xMin;
  const ySpan = viewport.yMax - viewport.yMin;
  if (!(xSpan > 0) || !(ySpan > 0)) throw new RangeError("Viewport spans must be positive.");
  return Object.freeze({
    left,
    top,
    width: innerWidth,
    height: innerHeight,
    x: (value) => left + ((value - viewport.xMin) / xSpan) * innerWidth,
    y: (value) => top + ((viewport.yMax - value) / ySpan) * innerHeight,
    inverseX: (value) => viewport.xMin + ((value - left) / innerWidth) * xSpan,
    inverseY: (value) => viewport.yMax - ((value - top) / innerHeight) * ySpan,
  });
}

export function zoomViewport(
  current: RuntimeViewport,
  factor: number,
  center: Point,
  original: RuntimeViewport,
): RuntimeViewport {
  if (!Number.isFinite(factor) || factor <= 0) throw new RangeError("Zoom factor must be positive.");
  const currentX = current.xMax - current.xMin;
  const currentY = current.yMax - current.yMin;
  const originalX = original.xMax - original.xMin;
  const originalY = original.yMax - original.yMin;
  const nextX = Math.min(originalX * 4, Math.max(originalX / 8, currentX * factor));
  const nextY = Math.min(originalY * 4, Math.max(originalY / 8, currentY * factor));
  const xRatio = (center.x - current.xMin) / currentX;
  const yRatio = (center.y - current.yMin) / currentY;
  return Object.freeze({
    xMin: center.x - nextX * xRatio,
    xMax: center.x + nextX * (1 - xRatio),
    yMin: center.y - nextY * yRatio,
    yMax: center.y + nextY * (1 - yRatio),
  });
}

export function panViewport(
  current: RuntimeViewport,
  deltaPixels: Point,
  plot: Pick<PlotTransform, "width" | "height">,
): RuntimeViewport {
  const xShift = -(deltaPixels.x / plot.width) * (current.xMax - current.xMin);
  const yShift = (deltaPixels.y / plot.height) * (current.yMax - current.yMin);
  return Object.freeze({
    xMin: current.xMin + xShift,
    xMax: current.xMax + xShift,
    yMin: current.yMin + yShift,
    yMax: current.yMax + yShift,
  });
}

function astLimits(scene: PublicCompiledScene) {
  return {
    maxDepth: scene.performance.maxAstDepth,
    maxNodes: scene.performance.maxAstNodes,
    maxOperations: scene.performance.maxOperationsPerEvaluation,
  };
}

export function evaluateSceneValue(
  value: number | NumericAst,
  variables: Readonly<Record<string, number>>,
  scene: PublicCompiledScene,
): number {
  if (typeof value === "number") return value;
  const result = evaluateNumericAst(value, variables, astLimits(scene));
  if (!Number.isFinite(result)) throw new RangeError(`Scene ${scene.id} produced a non-finite coordinate.`);
  return result;
}

export function sampleExpressionPath(
  expression: NumericAst,
  variable: string,
  domain: { min: number; max: number; includeMin: boolean; includeMax: boolean },
  parameters: Readonly<Record<string, number>>,
  scene: PublicCompiledScene,
  plot: PlotTransform,
): string {
  const sampleLimit = Math.max(32, Math.min(384, scene.performance.maxSamples));
  const epsilon = (domain.max - domain.min) / (sampleLimit * 10);
  const from = domain.includeMin ? domain.min : domain.min + epsilon;
  const to = domain.includeMax ? domain.max : domain.max - epsilon;
  const commands: string[] = [];
  let drawing = false;
  let previousY = 0;
  for (let index = 0; index <= sampleLimit; index += 1) {
    const input = from + ((to - from) * index) / sampleLimit;
    const output = evaluateNumericAst(
      expression,
      { ...parameters, [variable]: input },
      astLimits(scene),
    );
    if (!Number.isFinite(output)) {
      drawing = false;
      continue;
    }
    const px = plot.x(input);
    const py = plot.y(output);
    const discontinuity = drawing && Math.abs(py - previousY) > plot.height * 0.75;
    if (!drawing || discontinuity) commands.push(`M${px.toFixed(2)},${py.toFixed(2)}`);
    else commands.push(`L${px.toFixed(2)},${py.toFixed(2)}`);
    drawing = true;
    previousY = py;
  }
  return commands.join(" ");
}
