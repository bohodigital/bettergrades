import type { PublicCompiledScene } from "../../schema/index.ts";

export const INTERACTIVE_SOURCE_GZIP_BUDGET_BYTES = 30 * 1_024;

export type InteractiveControlState = Readonly<Record<string, number | boolean>>;

type SceneControl = PublicCompiledScene["controls"][number];

function decimalPlaces(value: number): number {
  const source = String(value).toLowerCase();
  if (source.includes("e-")) {
    const [coefficient, exponent] = source.split("e-");
    return Number(exponent) + (coefficient.split(".")[1]?.length ?? 0);
  }
  return source.split(".")[1]?.length ?? 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeRangeValue(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  if (![value, min, max, step].every(Number.isFinite) || min >= max || step <= 0) {
    throw new RangeError("Interactive range bounds must be finite and ordered with a positive step.");
  }
  const snapped = min + Math.round((clamp(value, min, max) - min) / step) * step;
  const precision = Math.min(12, Math.max(decimalPlaces(min), decimalPlaces(max), decimalPlaces(step)));
  return clamp(Number(snapped.toFixed(precision)), min, max);
}

export function sliderValueForKey(
  current: number,
  key: string,
  range: { min: number; max: number; step: number },
): number {
  const pageStep = range.step * 10;
  if (key === "Home") return range.min;
  if (key === "End") return range.max;
  if (key === "ArrowLeft" || key === "ArrowDown") {
    return normalizeRangeValue(current - range.step, range.min, range.max, range.step);
  }
  if (key === "ArrowRight" || key === "ArrowUp") {
    return normalizeRangeValue(current + range.step, range.min, range.max, range.step);
  }
  if (key === "PageDown") {
    return normalizeRangeValue(current - pageStep, range.min, range.max, range.step);
  }
  if (key === "PageUp") {
    return normalizeRangeValue(current + pageStep, range.min, range.max, range.step);
  }
  return current;
}

export function stepIndexForKey(current: number, key: string, lastIndex: number): number {
  if (!Number.isInteger(current) || !Number.isInteger(lastIndex) || lastIndex < 0) {
    throw new RangeError("Step-control indexes must be nonnegative integers.");
  }
  if (key === "Home") return 0;
  if (key === "End") return lastIndex;
  if (key === "ArrowLeft" || key === "ArrowDown" || key === "PageDown") {
    return Math.max(0, current - 1);
  }
  if (key === "ArrowRight" || key === "ArrowUp" || key === "PageUp") {
    return Math.min(lastIndex, current + 1);
  }
  return current;
}

export function initialControlState(scene: Pick<PublicCompiledScene, "controls">): InteractiveControlState {
  const state: Record<string, number | boolean> = {};
  for (const control of scene.controls) {
    if (control.kind === "slider" || control.kind === "parameter-input") {
      state[control.parameter] = normalizeRangeValue(
        control.initial,
        control.min,
        control.max,
        control.step,
      );
    } else if (control.kind === "step-control") {
      state[control.parameter] = control.values[control.initialIndex] ?? control.values[0];
    } else if (control.kind === "play-pause") {
      state[control.parameter] = control.from;
    } else if (control.kind === "toggle") {
      state[control.id] = control.initial;
    }
  }
  return Object.freeze(state);
}

export function controlValue(control: SceneControl, state: InteractiveControlState): number | boolean | undefined {
  if ("parameter" in control) return state[control.parameter];
  return state[control.id];
}

export function formatControlValue(value: number | boolean | undefined): string {
  if (typeof value === "boolean") return value ? "on" : "off";
  if (typeof value !== "number" || !Number.isFinite(value)) return "unavailable";
  return Number(value.toPrecision(7)).toString();
}

export function controlAnnouncement(
  control: SceneControl,
  value: number | boolean | undefined,
): string {
  const formatted = formatControlValue(value);
  return control.announcementTemplate.includes("{value}")
    ? control.announcementTemplate.replaceAll("{value}", formatted)
    : `${control.announcementTemplate} ${formatted}`;
}

export const CONTROL_KEYS = Object.freeze(new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]));
