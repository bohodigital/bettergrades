import { z } from "zod";

import {
  RendererIdSchema,
  VisualCapabilitySchema,
  VisualKindSchema,
  type RendererId,
  type VisualCapability,
  type VisualKind,
  type VisualSpec,
} from "../schema/index.ts";

export const RendererDefinitionSchema = z
  .object({
    id: RendererIdSchema,
    displayName: z.string().trim().min(1),
    status: z.enum(["installed", "reserved"]),
    runtimeClass: z.enum(["build-only", "static", "browser-core", "browser-lazy"]),
    supportedKinds: z.array(VisualKindSchema).min(1),
    capabilities: z.array(VisualCapabilitySchema).min(1),
    unsupportedCapabilities: z.array(VisualCapabilitySchema),
    interactionModel: z.string().trim().min(1),
    printBehavior: z.string().trim().min(1),
    preferredUseCases: z.array(z.string().trim().min(1)).min(1),
    prohibitedUseCases: z.array(z.string().trim().min(1)).min(1),
    expectedCost: z
      .object({
        globalGzipBytes: z.number().int().nonnegative(),
        lazyGzipBudget: z.number().int().nonnegative().optional(),
        typicalPayloadBytes: z.number().int().nonnegative(),
      })
      .strict(),
    activation: z.enum(["build", "automatic-progressive", "explicit-user-action"]),
    accessibilityContract: z.array(z.string().trim().min(1)).min(1),
    fallbackRenderer: RendererIdSchema.optional(),
    dynamicImportPath: z.string().trim().min(1).optional(),
    learnerActivationRequired: z.boolean(),
    maintenanceModule: z.string().trim().min(1),
    selectionRank: z.number().int().nonnegative(),
  })
  .strict();

export type RendererDefinition = z.infer<typeof RendererDefinitionSchema>;

const ALL_KINDS = VisualKindSchema.options;
const STATIC_CAPABILITIES: VisualCapability[] = [
  "static-fallback",
  "cartesian-axes",
  "function-paths",
  "piecewise-paths",
  "parametric-curves",
  "polar-curves",
  "number-line",
  "complex-plane",
  "geometry-primitives",
  "matrix-transform",
  "data-series",
  "vector-fields",
  "direction-fields",
  "phase-lines",
  "diagram-primitives",
  "annotations",
  "regions",
  "open-closed-points",
  "asymptotes",
  "multi-panel",
  "error-bands",
];
const CORE_INTERACTIVE_CAPABILITIES: VisualCapability[] = [
  ...STATIC_CAPABILITIES,
  "parameter-controls",
  "draggable-points",
  "linked-views",
  "animation",
  "coordinate-readout",
  "linked-cursors",
  "zoom-pan",
];
const JSXGRAPH_CAPABILITIES: VisualCapability[] = [
  ...CORE_INTERACTIVE_CAPABILITIES,
  "advanced-constraints",
  "implicit-curves",
  "dynamic-loci",
  "ode-solution-family",
];
const UPLOT_CAPABILITIES: VisualCapability[] = [
  "static-fallback",
  "data-series",
  "dense-series",
  "linked-cursors",
  "zoom-pan",
  "error-bands",
];

const definitions: RendererDefinition[] = [
  {
    id: "static-svg",
    displayName: "BetterGrades Static SVG",
    status: "installed",
    runtimeClass: "static",
    supportedKinds: [...ALL_KINDS],
    capabilities: STATIC_CAPABILITIES,
    unsupportedCapabilities: ["parameter-controls", "draggable-points", "linked-views", "animation", "coordinate-readout", "advanced-constraints", "implicit-curves", "dynamic-loci", "ode-solution-family", "dense-series", "linked-cursors", "zoom-pan", "surface-3d", "vector-field-3d", "molecular-3d", "camera-3d", "mesh-3d"],
    interactionModel: "No interaction; complete instructional meaning is present in the generated SVG.",
    printBehavior: "The generated SVG is the default print representation.",
    preferredUseCases: ["Static, print-first, and no-JavaScript instructional figures."],
    prohibitedUseCases: ["Required learner manipulation, dense interactive data, or advanced constrained geometry."],
    expectedCost: { globalGzipBytes: 0, typicalPayloadBytes: 8_000 },
    activation: "build",
    accessibilityContract: ["Emit stable title and description relationships and preserve reading order."],
    learnerActivationRequired: false,
    maintenanceModule: "lib/visualization/renderers/static-svg",
    selectionRank: 0,
  },
  {
    id: "bg-interactive-2d",
    displayName: "BetterGrades Interactive 2D",
    status: "installed",
    runtimeClass: "browser-core",
    supportedKinds: [...ALL_KINDS],
    capabilities: CORE_INTERACTIVE_CAPABILITIES,
    unsupportedCapabilities: ["advanced-constraints", "implicit-curves", "dynamic-loci", "ode-solution-family", "dense-series", "surface-3d", "vector-field-3d", "molecular-3d", "camera-3d", "mesh-3d"],
    interactionModel: "Small built-in controls progressively enhance the static SVG.",
    printBehavior: "Print always uses the static-svg fallback.",
    preferredUseCases: ["Simple 2D sliders, draggable points, linked views, and coordinate readout."],
    prohibitedUseCases: ["Sophisticated dependency graphs, implicit curves, advanced ODE geometry, or dense data."],
    expectedCost: { globalGzipBytes: 0, lazyGzipBudget: 30_000, typicalPayloadBytes: 12_000 },
    activation: "automatic-progressive",
    accessibilityContract: ["Controls are keyboard operable and values are announced; the static figure remains equivalent."],
    fallbackRenderer: "static-svg",
    dynamicImportPath: "lib/visualization/renderers/bg-interactive-2d",
    learnerActivationRequired: false,
    maintenanceModule: "lib/visualization/renderers/bg-interactive-2d",
    selectionRank: 1,
  },
  {
    id: "jsxgraph",
    displayName: "JSXGraph Adapter",
    status: "installed",
    runtimeClass: "browser-lazy",
    supportedKinds: ["cartesian-2d", "piecewise-cartesian-2d", "parametric-2d", "polar-2d", "geometry-2d", "matrix-transform-2d", "vector-field-2d", "direction-field", "phase-line"],
    capabilities: JSXGRAPH_CAPABILITIES,
    unsupportedCapabilities: ["dense-series", "surface-3d", "vector-field-3d", "molecular-3d", "camera-3d", "mesh-3d"],
    interactionModel: "Explicitly activated advanced geometry adapter with dependency propagation.",
    printBehavior: "Print always uses the static-svg fallback.",
    preferredUseCases: ["Implicit curves, constrained construction, loci, and advanced ODE geometry."],
    prohibitedUseCases: ["Ordinary static functions, one draggable point, dense series, or decorative interaction."],
    expectedCost: { globalGzipBytes: 0, lazyGzipBudget: 180_000, typicalPayloadBytes: 20_000 },
    activation: "explicit-user-action",
    accessibilityContract: ["The adapter retains the described fallback and provides keyboard-accessible wrapper controls."],
    fallbackRenderer: "static-svg",
    dynamicImportPath: "lib/visualization/renderers/jsxgraph-adapter",
    learnerActivationRequired: true,
    maintenanceModule: "lib/visualization/renderers/jsxgraph-adapter",
    selectionRank: 2,
  },
  {
    id: "uplot",
    displayName: "uPlot Adapter",
    status: "installed",
    runtimeClass: "browser-lazy",
    supportedKinds: ["data-series"],
    capabilities: UPLOT_CAPABILITIES,
    unsupportedCapabilities: ["function-paths", "piecewise-paths", "parametric-curves", "polar-curves", "geometry-primitives", "matrix-transform", "vector-fields", "direction-fields", "phase-lines", "diagram-primitives", "open-closed-points", "asymptotes", "parameter-controls", "draggable-points", "advanced-constraints", "implicit-curves", "dynamic-loci", "ode-solution-family", "surface-3d", "vector-field-3d", "molecular-3d", "camera-3d", "mesh-3d"],
    interactionModel: "Lazy cursor and zoom behavior over precomputed numeric arrays only.",
    printBehavior: "Print uses a generated static summary or static-svg fallback.",
    preferredUseCases: ["Dense precomputed scientific or time-series data."],
    prohibitedUseCases: ["Symbolic expressions, geometry, tangent/secant figures, and small static plots."],
    expectedCost: { globalGzipBytes: 0, lazyGzipBudget: 55_000, typicalPayloadBytes: 80_000 },
    activation: "automatic-progressive",
    accessibilityContract: ["Expose a data summary or table and retain the static fallback before enhancement."],
    fallbackRenderer: "static-svg",
    dynamicImportPath: "lib/visualization/renderers/uplot-adapter",
    learnerActivationRequired: false,
    maintenanceModule: "lib/visualization/renderers/uplot-adapter",
    selectionRank: 3,
  },
  {
    id: "future-specialist",
    displayName: "Reserved Future Specialist Adapter",
    status: "reserved",
    runtimeClass: "browser-lazy",
    supportedKinds: [...ALL_KINDS],
    capabilities: ["surface-3d", "vector-field-3d", "molecular-3d", "camera-3d", "mesh-3d"],
    unsupportedCapabilities: STATIC_CAPABILITIES,
    interactionModel: "Contract placeholder only; no production implementation is installed.",
    printBehavior: "A future adapter must define an explicit static projection before installation.",
    preferredUseCases: ["A separately approved future 3D or specialist implementation."],
    prohibitedUseCases: ["All production version 1 visuals."],
    expectedCost: { globalGzipBytes: 0, typicalPayloadBytes: 0 },
    activation: "explicit-user-action",
    accessibilityContract: ["A future implementation must provide a 3D summary and a complete static fallback."],
    learnerActivationRequired: true,
    maintenanceModule: "lib/visualization/renderers/future-adapter-contract",
    selectionRank: 99,
  },
];

export class RendererRegistryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RendererRegistryError";
    this.code = code;
  }
}

export type RendererRegistry = ReadonlyMap<RendererId, Readonly<RendererDefinition>>;

export function createRendererRegistry(input: readonly unknown[]): RendererRegistry {
  const registry = new Map<RendererId, Readonly<RendererDefinition>>();
  for (const raw of input) {
    const definition = RendererDefinitionSchema.parse(raw);
    if (registry.has(definition.id)) {
      throw new RendererRegistryError("duplicate-renderer", `Renderer ${definition.id} is registered more than once.`);
    }
    if (new Set(definition.capabilities).size !== definition.capabilities.length) {
      throw new RendererRegistryError("duplicate-capability", `Renderer ${definition.id} repeats a capability.`);
    }
    registry.set(definition.id, Object.freeze(definition));
  }
  for (const definition of registry.values()) {
    if (definition.runtimeClass === "browser-lazy" && definition.status === "installed" && !definition.fallbackRenderer) {
      throw new RendererRegistryError("missing-fallback", `Dynamic renderer ${definition.id} lacks a fallback.`);
    }
    if (definition.fallbackRenderer && !registry.has(definition.fallbackRenderer)) {
      throw new RendererRegistryError("unknown-fallback", `Renderer ${definition.id} names unknown fallback ${definition.fallbackRenderer}.`);
    }
    if (definition.runtimeClass === "browser-lazy" && definition.status === "installed" && !definition.dynamicImportPath) {
      throw new RendererRegistryError("missing-import", `Dynamic renderer ${definition.id} lacks a dynamic import path.`);
    }
  }
  return registry;
}

export const RENDERER_REGISTRY = createRendererRegistry(definitions);

function rendererCost(definition: RendererDefinition): number {
  return definition.expectedCost.globalGzipBytes +
    (definition.expectedCost.lazyGzipBudget ?? 0) +
    definition.expectedCost.typicalPayloadBytes;
}

export type ResolverRequest = {
  visualId: string;
  kind: VisualKind;
  requiredCapabilities: readonly VisualCapability[];
  source?: { route: string; sourceFile: string };
};

export function resolveRenderer(
  request: ResolverRequest,
  registry: RendererRegistry = RENDERER_REGISTRY,
): Readonly<RendererDefinition> {
  const required = [...new Set(request.requiredCapabilities)].sort();
  const unsupported3d = required.find((capability) => capability.endsWith("-3d"));
  if (unsupported3d) {
    const source = request.source ? ` route=${request.source.route} source=${request.source.sourceFile}` : "";
    throw new RendererRegistryError(
      "unsupported-3d",
      `Visual ${request.visualId} requires ${unsupported3d}; no production 3D adapter is installed.${source} Add and approve a renderer adapter before authoring this public visual.`,
    );
  }
  const candidates = [...registry.values()]
    .filter((definition) => definition.status === "installed")
    .filter((definition) => definition.supportedKinds.includes(request.kind))
    .filter((definition) => required.every((capability) => definition.capabilities.includes(capability)))
    .sort((a, b) => rendererCost(a) - rendererCost(b) || a.selectionRank - b.selectionRank || a.id.localeCompare(b.id));

  const selected = candidates[0];
  if (!selected) {
    throw new RendererRegistryError(
      "unsupported-capabilities",
      `Visual ${request.visualId} (${request.kind}) has no installed renderer supporting: ${required.join(", ")}.`,
    );
  }
  return selected;
}

const KIND_CAPABILITY: Partial<Record<VisualKind, VisualCapability>> = {
  "cartesian-2d": "cartesian-axes",
  "piecewise-cartesian-2d": "cartesian-axes",
  "parametric-2d": "parametric-curves",
  "polar-2d": "polar-curves",
  "number-line": "number-line",
  "complex-plane": "complex-plane",
  "geometry-2d": "geometry-primitives",
  "matrix-transform-2d": "matrix-transform",
  "data-series": "data-series",
  "vector-field-2d": "vector-fields",
  "direction-field": "direction-fields",
  "phase-line": "phase-lines",
  "free-body-diagram": "diagram-primitives",
  "circuit-diagram": "diagram-primitives",
  "reaction-coordinate": "diagram-primitives",
  "energy-level-diagram": "diagram-primitives",
};

export function inferRequiredCapabilities(spec: Pick<VisualSpec, "kind" | "layers" | "controls" | "panels">): VisualCapability[] {
  const capabilities = new Set<VisualCapability>(["static-fallback"]);
  const kindCapability = KIND_CAPABILITY[spec.kind];
  if (kindCapability) capabilities.add(kindCapability);
  if (spec.panels.length > 1) capabilities.add("multi-panel");
  for (const layer of spec.layers) {
    if (layer.kind === "function" || layer.kind === "tangent-line" || layer.kind === "secant-line") capabilities.add("function-paths");
    if (layer.kind === "piecewise-branch") capabilities.add("piecewise-paths");
    if (layer.kind === "parametric-curve") capabilities.add("parametric-curves");
    if (layer.kind === "polar-curve") capabilities.add("polar-curves");
    if (layer.kind === "sampled-series" || layer.kind === "trace" || layer.kind === "data-marker") capabilities.add("data-series");
    if (layer.kind === "open-point" || layer.kind === "closed-point") capabilities.add("open-closed-points");
    if (layer.kind === "vertical-asymptote" || layer.kind === "horizontal-asymptote") capabilities.add("asymptotes");
    if (layer.kind === "region" || layer.kind === "inequality-region") capabilities.add("regions");
    if (layer.kind === "annotation" || layer.kind === "label") capabilities.add("annotations");
    if (layer.kind === "error-band") capabilities.add("error-bands");
    if (layer.kind === "linked-object") capabilities.add("linked-views");
  }
  for (const control of spec.controls) {
    if (control.kind === "slider" || control.kind === "parameter-input" || control.kind === "step-control" || control.kind === "toggle" || control.kind === "reset-view") capabilities.add("parameter-controls");
    if (control.kind === "draggable-point") capabilities.add("draggable-points");
    if (control.kind === "play-pause") capabilities.add("animation");
    if (control.kind === "linked-cursor") {
      capabilities.add("linked-cursors");
      capabilities.add("linked-views");
      capabilities.add("coordinate-readout");
    }
  }
  return [...capabilities].sort();
}
