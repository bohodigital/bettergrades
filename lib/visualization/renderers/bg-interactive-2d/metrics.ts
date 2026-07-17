export type SecantMetrics = Readonly<{
  h: number;
  slope: number;
  pointP: readonly [number, number];
  pointQ: readonly [number, number];
}>;

export type EpsilonDeltaMetrics = Readonly<{
  epsilon: number;
  delta: number;
  lowerOutput: number;
  upperOutput: number;
  leftInput: number;
  rightInput: number;
}>;

export type UnitCircleMetrics = Readonly<{
  theta: number;
  sine: number;
  cosine: number;
  tangent: number;
  innerTriangleArea: number;
  sectorArea: number;
  outerTriangleArea: number;
}>;

function finitePositive(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a finite positive number.`);
  }
  return value;
}

function positionAt(time: number): number {
  return 64 * time - 16 * time * time;
}

export function secantMetrics(h: number): SecantMetrics {
  if (!Number.isFinite(h) || h === 0) {
    throw new RangeError("h must be finite and nonzero for a secant line.");
  }
  const p = positionAt(1);
  const qTime = 1 + h;
  const q = positionAt(qTime);
  return Object.freeze({
    h,
    slope: (q - p) / h,
    pointP: Object.freeze([1, p]) as readonly [number, number],
    pointQ: Object.freeze([qTime, q]) as readonly [number, number],
  });
}

export function epsilonDeltaMetrics(epsilon: number): EpsilonDeltaMetrics {
  finitePositive(epsilon, "epsilon");
  const rightInput = Math.sqrt(4 + 2 * epsilon);
  const delta = rightInput - 2;
  return Object.freeze({
    epsilon,
    delta,
    lowerOutput: 3 - epsilon,
    upperOutput: 3 + epsilon,
    leftInput: 2 - delta,
    rightInput,
  });
}

export function unitCircleMetrics(theta: number): UnitCircleMetrics {
  finitePositive(theta, "theta");
  if (theta >= Math.PI / 2) {
    throw new RangeError("theta must remain below pi over two for the squeeze diagram.");
  }
  const sine = Math.sin(theta);
  const cosine = Math.cos(theta);
  const tangent = Math.tan(theta);
  return Object.freeze({
    theta,
    sine,
    cosine,
    tangent,
    innerTriangleArea: (sine * cosine) / 2,
    sectorArea: theta / 2,
    outerTriangleArea: tangent / 2,
  });
}

export function sceneValueSummary(
  sceneId: string,
  state: Readonly<Record<string, number | boolean>>,
): string {
  if (sceneId === "secant-tangent" && typeof state.h === "number") {
    const metrics = secantMetrics(state.h);
    return `h = ${metrics.h}; secant slope = ${Number(metrics.slope.toFixed(6))}; Q = (${Number(metrics.pointQ[0].toFixed(6))}, ${Number(metrics.pointQ[1].toFixed(6))}).`;
  }
  if (sceneId === "epsilon-delta-window" && typeof state.varepsilon === "number") {
    const metrics = epsilonDeltaMetrics(state.varepsilon);
    return `epsilon = ${metrics.epsilon}; delta = ${Number(metrics.delta.toFixed(6))}; input window = (${Number(metrics.leftInput.toFixed(6))}, ${Number(metrics.rightInput.toFixed(6))}).`;
  }
  if (sceneId === "unit-circle-squeeze" && typeof state.theta === "number") {
    const metrics = unitCircleMetrics(state.theta);
    return `theta = ${Number(metrics.theta.toFixed(6))} radians; sine = ${Number(metrics.sine.toFixed(6))}; tangent = ${Number(metrics.tangent.toFixed(6))}.`;
  }
  if (sceneId === "squeeze-bounds" && typeof state["bounds-toggle"] === "boolean") {
    return `Bounding functions are ${state["bounds-toggle"] ? "shown" : "hidden"}.`;
  }
  return "Interactive values are ready.";
}

