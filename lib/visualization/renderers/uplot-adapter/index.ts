import type { CompiledScene } from "../../schema/index.ts";
import type UPlot from "uplot";

export const UPLOT_MIN_DENSE_POINTS = 256;
export const UPLOT_MAX_POINTS = 20_000;
export const UPLOT_MAX_SERIES = 8;
export const UPLOT_MAX_NUMERIC_VALUES = 60_000;
export const UPLOT_MAX_SUMMARY_CHARACTERS = 4_000;

export type UPlotNumericSeries = Readonly<{
  id: string;
  label: string;
  values: readonly number[];
}>;

export type UPlotAdapterRequest = Readonly<{
  scene: CompiledScene;
  xValues: readonly number[];
  series: readonly UPlotNumericSeries[];
  dataSummary: string;
  staticFallback: Readonly<{
    available: true;
    elementId: string;
    describedById: string;
    preserveDuringEnhancement: true;
  }>;
}>;

export class UPlotAdapterError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "UPlotAdapterError";
    this.code = code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasSymbolicExpression(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasSymbolicExpression);
  if (!isRecord(value)) return false;
  if (
    "expression" in value ||
    "expressionLatex" in value ||
    "xExpression" in value ||
    "yExpression" in value ||
    "radiusExpression" in value ||
    ("format" in value && (value.format === "ast" || value.format === "latex"))
  ) return true;
  return Object.values(value).some(hasSymbolicExpression);
}

function assertFiniteArray(value: unknown, label: string): asserts value is readonly number[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "number" || !Number.isFinite(entry))) {
    throw new UPlotAdapterError("numeric-arrays-only", `${label} must be an array containing finite numbers only.`);
  }
}

function assertIdentifier(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !/^[A-Za-z][A-Za-z0-9_.:-]{0,127}$/.test(value)) {
    throw new UPlotAdapterError("invalid-identifier", `${label} must be a stable non-empty identifier.`);
  }
}

/** Validate the complete data-only handoff before the uPlot chunk is fetched. */
export function assertUPlotAdapterRequest(input: unknown): asserts input is UPlotAdapterRequest {
  if (!isRecord(input)) {
    throw new UPlotAdapterError("invalid-request", "uPlot activation requires a bounded data request.");
  }
  if (hasSymbolicExpression(input)) {
    throw new UPlotAdapterError(
      "symbolic-input-forbidden",
      "uPlot accepts precomputed numeric arrays only; symbolic expressions must be compiled and sampled before this boundary.",
    );
  }
  const scene = input.scene as CompiledScene | undefined;
  if (
    !scene ||
    scene.selectedRenderer !== "uplot" ||
    scene.kind !== "data-series" ||
    !scene.requiredCapabilities.includes("dense-series")
  ) {
    throw new UPlotAdapterError(
      "renderer-mismatch",
      "uPlot can only enhance a data-series scene selected for the dense-series capability.",
    );
  }
  if (scene.staticFallback.required !== true || scene.staticFallback.rendererId !== "static-svg") {
    throw new UPlotAdapterError("missing-static-fallback", "The compiled scene must require the static SVG fallback.");
  }

  assertFiniteArray(input.xValues, "xValues");
  if (input.xValues.length < UPLOT_MIN_DENSE_POINTS || input.xValues.length > UPLOT_MAX_POINTS) {
    throw new UPlotAdapterError(
      "point-bound-exceeded",
      `uPlot dense arrays must contain ${UPLOT_MIN_DENSE_POINTS} to ${UPLOT_MAX_POINTS} points.`,
    );
  }
  for (let index = 1; index < input.xValues.length; index += 1) {
    if (input.xValues[index] <= input.xValues[index - 1]) {
      throw new UPlotAdapterError("unordered-x-values", "uPlot xValues must be strictly increasing.");
    }
  }

  if (!Array.isArray(input.series) || input.series.length < 1 || input.series.length > UPLOT_MAX_SERIES) {
    throw new UPlotAdapterError("series-bound-exceeded", `uPlot accepts between 1 and ${UPLOT_MAX_SERIES} numeric series.`);
  }
  let numericValueCount = input.xValues.length;
  const seriesIds = new Set<string>();
  for (const [index, rawSeries] of input.series.entries()) {
    if (!isRecord(rawSeries)) {
      throw new UPlotAdapterError("invalid-series", `Series ${index} must be a data object.`);
    }
    assertIdentifier(rawSeries.id, `Series ${index} id`);
    if (seriesIds.has(rawSeries.id)) {
      throw new UPlotAdapterError("duplicate-series", `Series id ${rawSeries.id} is duplicated.`);
    }
    seriesIds.add(rawSeries.id);
    if (typeof rawSeries.label !== "string" || rawSeries.label.trim().length < 1 || rawSeries.label.length > 160) {
      throw new UPlotAdapterError("invalid-series-label", `Series ${rawSeries.id} requires a short data label.`);
    }
    assertFiniteArray(rawSeries.values, `Series ${rawSeries.id} values`);
    if (rawSeries.values.length !== input.xValues.length) {
      throw new UPlotAdapterError("series-length-mismatch", `Series ${rawSeries.id} must align one-to-one with xValues.`);
    }
    numericValueCount += rawSeries.values.length;
  }
  if (numericValueCount > UPLOT_MAX_NUMERIC_VALUES) {
    throw new UPlotAdapterError(
      "numeric-payload-exceeded",
      `uPlot accepts at most ${UPLOT_MAX_NUMERIC_VALUES} numeric values in one activation payload.`,
    );
  }

  if (
    typeof input.dataSummary !== "string" ||
    input.dataSummary.trim().length < 1 ||
    input.dataSummary.length > UPLOT_MAX_SUMMARY_CHARACTERS
  ) {
    throw new UPlotAdapterError(
      "missing-data-summary",
      `uPlot requires a non-empty data summary no longer than ${UPLOT_MAX_SUMMARY_CHARACTERS} characters.`,
    );
  }
  const fallback = input.staticFallback;
  if (
    !isRecord(fallback) ||
    fallback.available !== true ||
    fallback.preserveDuringEnhancement !== true
  ) {
    throw new UPlotAdapterError("missing-static-fallback", "uPlot requires a retained equivalent static SVG fallback.");
  }
  assertIdentifier(fallback.elementId, "Static fallback elementId");
  assertIdentifier(fallback.describedById, "Static fallback describedById");
}

export type LoadedUPlotAdapter = Readonly<{
  sceneId: string;
  numericValueCount: number;
  vendor: typeof UPlot;
}>;

/** This is the only uPlot package boundary; importing this module does not load uPlot. */
export async function loadUPlotAdapter(input: unknown): Promise<LoadedUPlotAdapter> {
  assertUPlotAdapterRequest(input);
  if (typeof window === "undefined") {
    throw new UPlotAdapterError("browser-only", "uPlot may only load in a browser enhancement boundary.");
  }
  const vendorModule = await import("uplot");
  const vendor: typeof UPlot = (vendorModule as unknown as { default: typeof UPlot }).default;
  return Object.freeze({
    sceneId: input.scene.id,
    numericValueCount: input.xValues.length * (input.series.length + 1),
    vendor,
  });
}

export const UPLOT_ADAPTER_CONTRACT = Object.freeze({
  input: "bounded-precomputed-numeric-arrays" as const,
  minDensePoints: UPLOT_MIN_DENSE_POINTS,
  maxPoints: UPLOT_MAX_POINTS,
  maxSeries: UPLOT_MAX_SERIES,
  maxNumericValues: UPLOT_MAX_NUMERIC_VALUES,
  requiresDataSummary: true,
  fallbackRenderer: "static-svg" as const,
  acceptsSymbolicExpressions: false,
});
