import type { CompiledScene } from "../../schema/index.ts";
import { escapeXml, formatNumber } from "./format.ts";

type Layer = CompiledScene["layers"][number];
export type Presentation = Layer["presentation"];

const STROKES: Readonly<Record<string, string>> = Object.freeze({
  "visual-primary": "#155e75",
  "visual-secondary": "#7c3aed",
  "visual-emphasis": "#b45309",
  "visual-success": "#15803d",
  "visual-warning": "#b91c1c",
  "visual-bound": "#0f766e",
  "visual-guide": "#64748b",
  "visual-ink": "#111827",
});

const FILLS: Readonly<Record<string, string>> = Object.freeze({
  "visual-primary": "#67e8f9",
  "visual-secondary": "#c4b5fd",
  "visual-emphasis": "#fcd34d",
  "visual-emphasis-soft": "#fef3c7",
  "visual-success": "#86efac",
  "visual-success-soft": "#dcfce7",
  "visual-warning": "#fca5a5",
  "visual-neutral-soft": "#e2e8f0",
  "visual-ink": "#cbd5e1",
});

export function strokeColor(presentation: Presentation): string {
  return STROKES[presentation.strokeToken ?? "visual-ink"] ?? "#111827";
}

export function fillColor(presentation: Presentation): string {
  return FILLS[presentation.fillToken ?? "visual-neutral-soft"] ?? "#e2e8f0";
}

export function dashArray(presentation: Presentation): string | undefined {
  if (presentation.lineStyle === "dashed") return "10 7";
  if (presentation.lineStyle === "dotted") return "2 6";
  return undefined;
}

export function patternFill(presentation: Presentation, idPrefix: string): string {
  if (presentation.pattern === "diagonal") return `url(#${idPrefix}-pattern-diagonal)`;
  if (presentation.pattern === "crosshatch") return `url(#${idPrefix}-pattern-crosshatch)`;
  if (presentation.pattern === "dots") return `url(#${idPrefix}-pattern-dots)`;
  return fillColor(presentation);
}

export function attrs(input: Readonly<Record<string, string | number | boolean | undefined>>): string {
  return Object.entries(input)
    .filter((entry): entry is [string, string | number | boolean] => entry[1] !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => ` ${name}="${escapeXml(typeof value === "number" ? formatNumber(value) : String(value))}"`)
    .join("");
}

export function element(
  name: string,
  attributes: Readonly<Record<string, string | number | boolean | undefined>>,
  children?: string,
): string {
  const opening = `<${name}${attrs(attributes)}`;
  return children === undefined ? `${opening}/>` : `${opening}>${children}</${name}>`;
}

export function strokeShape(
  name: string,
  attributes: Readonly<Record<string, string | number | boolean | undefined>>,
  presentation: Presentation,
  options: Readonly<{ width?: number; markerEnd?: string; fill?: string }> = {},
): string {
  const width = options.width ?? 3;
  const common = {
    ...attributes,
    fill: options.fill ?? "none",
    "marker-end": options.markerEnd,
    stroke: strokeColor(presentation),
    "stroke-dasharray": dashArray(presentation),
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": presentation.lineStyle === "double" ? Math.max(4, width + 2) : width,
    "vector-effect": "non-scaling-stroke",
  };
  const outer = element(name, common);
  if (presentation.lineStyle !== "double") return outer;
  return `${outer}${element(name, {
    ...attributes,
    fill: "none",
    stroke: "#ffffff",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": Math.max(1.25, width - 0.5),
    "vector-effect": "non-scaling-stroke",
  })}`;
}

export function rootDefinitions(idPrefix: string): string {
  return `<defs>${element("pattern", {
    id: `${idPrefix}-pattern-diagonal`, patternUnits: "userSpaceOnUse", width: 10, height: 10,
  }, `${element("rect", { width: 10, height: 10, fill: "#f8fafc" })}${element("path", { d: "M-2 10L10-2M3 15L15 3", fill: "none", stroke: "#64748b", "stroke-width": 1.25 })}`)}${element("pattern", {
    id: `${idPrefix}-pattern-crosshatch`, patternUnits: "userSpaceOnUse", width: 10, height: 10,
  }, `${element("rect", { width: 10, height: 10, fill: "#f8fafc" })}${element("path", { d: "M-2 10L10-2M3 15L15 3M-2 0L10 12M3-5L15 7", fill: "none", stroke: "#64748b", "stroke-width": 1 })}`)}${element("pattern", {
    id: `${idPrefix}-pattern-dots`, patternUnits: "userSpaceOnUse", width: 9, height: 9,
  }, `${element("rect", { width: 9, height: 9, fill: "#f8fafc" })}${element("circle", { cx: 4.5, cy: 4.5, r: 1.35, fill: "#64748b" })}`)}${element("marker", {
    id: `${idPrefix}-arrow`, viewBox: "0 0 10 10", refX: 8.5, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse", markerUnits: "strokeWidth",
  }, element("path", { d: "M0 0L10 5L0 10Z", fill: "#111827" }))}</defs>`;
}

export const PRINT_SAFE_STYLE = `<style>.bvlp-svg text{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}.bvlp-svg .bvlp-axis-label,.bvlp-svg .bvlp-panel-title{font-weight:700}.bvlp-svg .bvlp-annotation{paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round}.bvlp-svg path,.bvlp-svg line,.bvlp-svg polyline,.bvlp-svg polygon,.bvlp-svg circle,.bvlp-svg ellipse{shape-rendering:geometricPrecision}@media print{.bvlp-svg{color-adjust:exact;print-color-adjust:exact}.bvlp-svg .bvlp-panel-bg{fill:#fff}.bvlp-svg text{fill:#000!important}}</style>`;
