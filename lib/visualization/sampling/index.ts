export type SamplePoint = Readonly<{
  parameter: number;
  x: number;
  y: number;
}>;

export type SampleSegment = readonly SamplePoint[];

export type SampleResult = Readonly<{
  segments: readonly SampleSegment[];
  sampleCount: number;
  maxDepthReached: number;
  truncated: boolean;
}>;

export type SamplingViewport = Readonly<{
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}>;

export type AdaptiveSamplingOptions = Readonly<{
  parameterMin: number;
  parameterMax: number;
  viewport: SamplingViewport;
  initialIntervals?: number;
  tolerance?: number;
  discontinuityThreshold?: number;
  maxDepth?: number;
  maxSamples?: number;
  minParameterStep?: number;
  explicitBreaks?: readonly number[];
  onBudget?: "throw" | "truncate";
  signal?: AbortSignal;
}>;

export class SamplingError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "SamplingError";
    this.code = code;
  }
}

type Edge = { a: SamplePoint; b: SamplePoint; connect: boolean };

function finitePoint(point: SamplePoint): boolean {
  return Number.isFinite(point.parameter) && Number.isFinite(point.x) && Number.isFinite(point.y);
}

function validateOptions(options: AdaptiveSamplingOptions) {
  const values = [
    options.parameterMin,
    options.parameterMax,
    options.viewport.xMin,
    options.viewport.xMax,
    options.viewport.yMin,
    options.viewport.yMax,
  ];
  if (!values.every(Number.isFinite)) {
    throw new SamplingError("invalid-range", "Sampling ranges and viewport bounds must be finite.");
  }
  if (options.parameterMin >= options.parameterMax) {
    throw new SamplingError("invalid-range", "parameterMin must be less than parameterMax.");
  }
  if (options.viewport.xMin >= options.viewport.xMax || options.viewport.yMin >= options.viewport.yMax) {
    throw new SamplingError("invalid-viewport", "Viewport minima must be less than maxima.");
  }
}

function normalizedDistance(a: SamplePoint, b: SamplePoint, viewport: SamplingViewport): number {
  const dx = (a.x - b.x) / (viewport.xMax - viewport.xMin);
  const dy = (a.y - b.y) / (viewport.yMax - viewport.yMin);
  return Math.hypot(dx, dy);
}

function chordDeviation(
  point: SamplePoint,
  a: SamplePoint,
  b: SamplePoint,
  fraction: number,
  viewport: SamplingViewport,
): number {
  const expected: SamplePoint = {
    parameter: point.parameter,
    x: a.x + (b.x - a.x) * fraction,
    y: a.y + (b.y - a.y) * fraction,
  };
  return normalizedDistance(point, expected, viewport);
}

function samePoint(a: SamplePoint, b: SamplePoint): boolean {
  return a.parameter === b.parameter && a.x === b.x && a.y === b.y;
}

function assembleSegments(edges: readonly Edge[]): SampleSegment[] {
  const segments: SamplePoint[][] = [];
  let current: SamplePoint[] = [];
  const flush = () => {
    if (current.length >= 2) segments.push(current);
    current = [];
  };
  for (const edge of edges) {
    if (!edge.connect || !finitePoint(edge.a) || !finitePoint(edge.b)) {
      flush();
      continue;
    }
    if (!current.length) current.push(edge.a);
    else if (!samePoint(current[current.length - 1], edge.a)) {
      flush();
      current.push(edge.a);
    }
    if (!samePoint(current[current.length - 1], edge.b)) current.push(edge.b);
  }
  flush();
  return segments;
}

export function sampleAdaptiveCurve(
  evaluate: (parameter: number) => Readonly<{ x: number; y: number }>,
  options: AdaptiveSamplingOptions,
): SampleResult {
  validateOptions(options);
  const initialIntervals = Math.min(256, Math.max(1, options.initialIntervals ?? 16));
  const tolerance = Math.min(0.25, Math.max(1e-7, options.tolerance ?? 0.0025));
  const discontinuityThreshold = Math.min(4, Math.max(0.05, options.discontinuityThreshold ?? 0.35));
  const maxDepth = Math.min(24, Math.max(1, options.maxDepth ?? 12));
  const maxSamples = Math.min(20_000, Math.max(16, options.maxSamples ?? 2_048));
  const fullSpan = options.parameterMax - options.parameterMin;
  const minParameterStep = Math.max(Number.EPSILON, options.minParameterStep ?? fullSpan * 1e-10);
  const onBudget = options.onBudget ?? "throw";
  const cache = new Map<string, SamplePoint>();
  const edges: Edge[] = [];
  let sampleCount = 0;
  let maxDepthReached = 0;
  let truncated = false;

  const sample = (parameter: number): SamplePoint => {
    if (options.signal?.aborted) throw new SamplingError("aborted", "Adaptive sampling was aborted.");
    const key = parameter.toPrecision(17);
    const cached = cache.get(key);
    if (cached) return cached;
    if (sampleCount >= maxSamples) {
      if (onBudget === "throw") {
        throw new SamplingError("sample-budget", `Adaptive sampling exceeded ${maxSamples} points.`);
      }
      truncated = true;
      return { parameter, x: Number.NaN, y: Number.NaN };
    }
    let value: Readonly<{ x: number; y: number }>;
    try {
      value = evaluate(parameter);
    } catch {
      value = { x: Number.NaN, y: Number.NaN };
    }
    const point = { parameter, x: value.x, y: value.y };
    cache.set(key, point);
    sampleCount += 1;
    return point;
  };

  const walk = (leftParameter: number, rightParameter: number, depth: number) => {
    maxDepthReached = Math.max(maxDepthReached, depth);
    const quarter = leftParameter + (rightParameter - leftParameter) * 0.25;
    const middle = leftParameter + (rightParameter - leftParameter) * 0.5;
    const threeQuarter = leftParameter + (rightParameter - leftParameter) * 0.75;
    const points = [
      sample(leftParameter),
      sample(quarter),
      sample(middle),
      sample(threeQuarter),
      sample(rightParameter),
    ];
    if (truncated) {
      edges.push({ a: points[0], b: points[4], connect: false });
      return;
    }
    if (points.every((point) => !finitePoint(point))) {
      edges.push({ a: points[0], b: points[4], connect: false });
      return;
    }
    const allFinite = points.every(finitePoint);
    const span = rightParameter - leftParameter;
    const deviations = allFinite
      ? [
          chordDeviation(points[1], points[0], points[4], 0.25, options.viewport),
          chordDeviation(points[2], points[0], points[4], 0.5, options.viewport),
          chordDeviation(points[3], points[0], points[4], 0.75, options.viewport),
        ]
      : [Number.POSITIVE_INFINITY];
    const error = Math.max(...deviations);
    const chord = allFinite ? normalizedDistance(points[0], points[4], options.viewport) : Number.POSITIVE_INFINITY;
    const adjacentJump = allFinite
      ? Math.max(
          normalizedDistance(points[0], points[1], options.viewport),
          normalizedDistance(points[1], points[2], options.viewport),
          normalizedDistance(points[2], points[3], options.viewport),
          normalizedDistance(points[3], points[4], options.viewport),
        )
      : Number.POSITIVE_INFINITY;
    const needsRefinement = !allFinite || error > tolerance || (adjacentJump > discontinuityThreshold && error > tolerance * 0.25);
    const canRefine = depth < maxDepth && span > minParameterStep * 2;

    if (needsRefinement && canRefine) {
      walk(leftParameter, middle, depth + 1);
      walk(middle, rightParameter, depth + 1);
      return;
    }
    const discontinuous =
      !allFinite ||
      error > discontinuityThreshold ||
      (adjacentJump > discontinuityThreshold && error > tolerance);
    if (discontinuous) {
      for (let index = 0; index < points.length - 1; index += 1) {
        edges.push({ a: points[index], b: points[index + 1], connect: false });
      }
      return;
    }
    edges.push({ a: points[0], b: points[4], connect: true });
  };

  const breaks = [...new Set(options.explicitBreaks ?? [])]
    .filter((value) => Number.isFinite(value) && value > options.parameterMin && value < options.parameterMax)
    .sort((a, b) => a - b);
  const boundaries = [options.parameterMin, ...breaks, options.parameterMax];
  const breakGap = Math.max(minParameterStep * 2, fullSpan * 1e-8);

  for (let partition = 0; partition < boundaries.length - 1; partition += 1) {
    const rawLeft = boundaries[partition];
    const rawRight = boundaries[partition + 1];
    const left = partition === 0 ? rawLeft : Math.min(rawRight, rawLeft + breakGap);
    const right = partition === boundaries.length - 2 ? rawRight : Math.max(left, rawRight - breakGap);
    if (right <= left) continue;
    for (let index = 0; index < initialIntervals; index += 1) {
      const a = left + ((right - left) * index) / initialIntervals;
      const b = left + ((right - left) * (index + 1)) / initialIntervals;
      walk(a, b, 0);
      if (truncated) break;
    }
    if (partition < boundaries.length - 2) {
      const marker = sample(Math.max(left, right));
      edges.push({ a: marker, b: marker, connect: false });
    }
    if (truncated) break;
  }

  return Object.freeze({
    segments: Object.freeze(assembleSegments(edges).map((segment) => Object.freeze(segment))),
    sampleCount,
    maxDepthReached,
    truncated,
  });
}

export type FunctionSamplingOptions = Omit<AdaptiveSamplingOptions, "parameterMin" | "parameterMax"> & {
  xMin: number;
  xMax: number;
};

export function sampleAdaptiveFunction(
  evaluateY: (x: number) => number,
  options: FunctionSamplingOptions,
): SampleResult {
  const { xMin, xMax, ...rest } = options;
  return sampleAdaptiveCurve((x) => ({ x, y: evaluateY(x) }), {
    ...rest,
    parameterMin: xMin,
    parameterMax: xMax,
  });
}

export function sampleAdaptiveParametric(
  evaluate: (parameter: number) => Readonly<{ x: number; y: number }>,
  options: AdaptiveSamplingOptions,
): SampleResult {
  return sampleAdaptiveCurve(evaluate, options);
}

export function sampleAdaptivePolar(
  evaluateRadius: (angle: number) => number,
  options: AdaptiveSamplingOptions,
): SampleResult {
  return sampleAdaptiveCurve((angle) => {
    const radius = evaluateRadius(angle);
    return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
  }, options);
}

function clipEdge(a: SamplePoint, b: SamplePoint, viewport: SamplingViewport): [SamplePoint, SamplePoint] | undefined {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const p = [-dx, dx, -dy, dy];
  const q = [a.x - viewport.xMin, viewport.xMax - a.x, a.y - viewport.yMin, viewport.yMax - a.y];
  let lower = 0;
  let upper = 1;
  for (let index = 0; index < 4; index += 1) {
    if (p[index] === 0) {
      if (q[index] < 0) return undefined;
      continue;
    }
    const ratio = q[index] / p[index];
    if (p[index] < 0) lower = Math.max(lower, ratio);
    else upper = Math.min(upper, ratio);
    if (lower > upper) return undefined;
  }
  const project = (fraction: number): SamplePoint => ({
    parameter: a.parameter + (b.parameter - a.parameter) * fraction,
    x: a.x + dx * fraction,
    y: a.y + dy * fraction,
  });
  return [project(lower), project(upper)];
}

export function clipSegmentsToViewport(
  segments: readonly SampleSegment[],
  viewport: SamplingViewport,
): SampleSegment[] {
  const edges: Edge[] = [];
  for (const segment of segments) {
    for (let index = 0; index < segment.length - 1; index += 1) {
      const clipped = clipEdge(segment[index], segment[index + 1], viewport);
      if (clipped) edges.push({ a: clipped[0], b: clipped[1], connect: true });
      else edges.push({ a: segment[index], b: segment[index + 1], connect: false });
    }
    if (segment.length) edges.push({ a: segment[segment.length - 1], b: segment[segment.length - 1], connect: false });
  }
  return assembleSegments(edges);
}
