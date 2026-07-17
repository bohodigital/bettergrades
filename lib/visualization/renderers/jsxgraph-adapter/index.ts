import type { CompiledScene, VisualCapability } from "../../schema/index.ts";

const JSXGRAPH_ADVANCED_CAPABILITIES = new Set<VisualCapability>([
  "advanced-constraints",
  "implicit-curves",
  "dynamic-loci",
  "ode-solution-family",
]);

export type RetainedStaticFallback = {
  available: true;
  elementId: string;
  describedById: string;
  preserveDuringEnhancement: true;
};

export type JsxGraphAdapterRequest = {
  scene: CompiledScene;
  learnerActivated: true;
  staticFallback: RetainedStaticFallback;
};

export class JsxGraphAdapterError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "JsxGraphAdapterError";
    this.code = code;
  }
}

function isNonEmptyId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z][A-Za-z0-9_.:-]{0,127}$/.test(value);
}

/**
 * Guards the heavyweight adapter boundary before its vendor module is fetched.
 * The caller owns the DOM mount; this module deliberately never replaces or
 * removes the equivalent static figure.
 */
export function assertJsxGraphAdapterRequest(
  input: unknown,
): asserts input is JsxGraphAdapterRequest {
  if (!input || typeof input !== "object") {
    throw new JsxGraphAdapterError("invalid-request", "JSXGraph activation requires a bounded adapter request.");
  }
  const request = input as Partial<JsxGraphAdapterRequest>;
  const scene = request.scene;
  if (!scene || scene.selectedRenderer !== "jsxgraph") {
    throw new JsxGraphAdapterError(
      "renderer-mismatch",
      "JSXGraph can only enhance a scene selected for the JSXGraph adapter by the capability resolver.",
    );
  }
  if (!scene.requiredCapabilities.some((capability) => JSXGRAPH_ADVANCED_CAPABILITIES.has(capability))) {
    throw new JsxGraphAdapterError(
      "advanced-capability-required",
      "JSXGraph is reserved for advanced constraints, implicit curves, dynamic loci, or ODE solution families.",
    );
  }
  if (scene.delivery.hydration !== "explicit-user-action" || request.learnerActivated !== true) {
    throw new JsxGraphAdapterError(
      "activation-required",
      "The learner must explicitly activate the advanced interactive figure before JSXGraph is loaded.",
    );
  }
  if (
    scene.staticFallback.required !== true ||
    scene.staticFallback.rendererId !== "static-svg" ||
    request.staticFallback?.available !== true ||
    request.staticFallback.preserveDuringEnhancement !== true ||
    !isNonEmptyId(request.staticFallback.elementId) ||
    !isNonEmptyId(request.staticFallback.describedById)
  ) {
    throw new JsxGraphAdapterError(
      "missing-static-fallback",
      "JSXGraph activation requires a retained, described BetterGrades static SVG fallback.",
    );
  }
}

export type LoadedJsxGraphAdapter = Readonly<{
  sceneId: string;
  fallback: RetainedStaticFallback;
  vendor: unknown;
}>;

/**
 * This is the only JSXGraph package boundary. Calling it is an explicit,
 * learner-triggered enhancement; importing this adapter module alone is cheap.
 */
export async function loadJsxGraphAdapter(
  input: unknown,
): Promise<LoadedJsxGraphAdapter> {
  assertJsxGraphAdapterRequest(input);
  if (typeof window === "undefined") {
    throw new JsxGraphAdapterError("browser-only", "JSXGraph may only load in a browser after learner activation.");
  }
  const vendorModule = await import("jsxgraph");
  const vendor = (vendorModule as unknown as { default?: unknown }).default ?? vendorModule;
  return Object.freeze({
    sceneId: input.scene.id,
    fallback: Object.freeze({ ...input.staticFallback }),
    vendor,
  });
}

export const JSXGRAPH_ADAPTER_CONTRACT = Object.freeze({
  activation: "explicit-user-action" as const,
  advancedCapabilities: Object.freeze([...JSXGRAPH_ADVANCED_CAPABILITIES].sort()),
  fallbackRenderer: "static-svg" as const,
  removesFallback: false,
});
