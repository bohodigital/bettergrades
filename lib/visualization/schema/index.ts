import { z } from "zod";

import { NumericAstSchema } from "../ast/schema.ts";

const IdentifierSchema = z
  .string()
  .min(1)
  .max(96)
  .regex(/^[a-z][a-z0-9]*(?:[-_.:][a-z0-9]+)*$/);
const NonEmptyTextSchema = z.string().trim().min(1).max(8_000);
const FiniteSchema = z.number().finite();

export const VisualSpecVersionSchema = z.literal(1);
export const CompiledSceneVersionSchema = z.literal(1);

export const VisualKindSchema = z.enum([
  "cartesian-2d",
  "piecewise-cartesian-2d",
  "parametric-2d",
  "polar-2d",
  "number-line",
  "complex-plane",
  "geometry-2d",
  "matrix-transform-2d",
  "data-series",
  "vector-field-2d",
  "direction-field",
  "phase-line",
  "free-body-diagram",
  "circuit-diagram",
  "reaction-coordinate",
  "energy-level-diagram",
]);

export const ReservedVisualKindSchema = z.enum([
  "surface-3d",
  "vector-field-3d",
  "molecular-3d",
]);

export const VisualLayerKindSchema = z.enum([
  "function",
  "parametric-curve",
  "polar-curve",
  "sampled-series",
  "piecewise-branch",
  "point",
  "open-point",
  "closed-point",
  "line",
  "ray",
  "segment",
  "vector",
  "polygon",
  "circle",
  "ellipse",
  "region",
  "inequality-region",
  "vertical-asymptote",
  "horizontal-asymptote",
  "tangent-line",
  "secant-line",
  "grid",
  "basis-grid",
  "label",
  "annotation",
  "direction-arrow",
  "error-band",
  "data-marker",
  "trace",
  "linked-object",
]);

export const ControlKindSchema = z.enum([
  "slider",
  "draggable-point",
  "toggle",
  "reset-view",
  "play-pause",
  "step-control",
  "parameter-input",
  "linked-cursor",
]);

export const VisualCapabilitySchema = z.enum([
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
  "parameter-controls",
  "draggable-points",
  "linked-views",
  "animation",
  "coordinate-readout",
  "advanced-constraints",
  "implicit-curves",
  "dynamic-loci",
  "ode-solution-family",
  "dense-series",
  "linked-cursors",
  "zoom-pan",
  "error-bands",
  "surface-3d",
  "vector-field-3d",
  "molecular-3d",
  "camera-3d",
  "mesh-3d",
]);

const RichTextSegmentSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text: NonEmptyTextSchema }).strict(),
  z
    .object({
      kind: z.literal("math"),
      latex: z.string().trim().min(1).max(1_024),
      spokenText: NonEmptyTextSchema,
    })
    .strict(),
]);

export const RichTextSchema = z
  .object({ segments: z.array(RichTextSegmentSchema).min(1).max(64) })
  .strict();

export const UnitSchema = z
  .object({
    symbol: z.string().trim().min(1).max(24),
    name: z.string().trim().min(1).max(80),
    quantity: z.string().trim().min(1).max(80),
  })
  .strict();

export const CoordinateSpaceSchema = z
  .object({
    type: z.enum([
      "cartesian-2d",
      "polar-2d",
      "number-line",
      "complex-plane",
      "diagram-2d",
      "data-2d",
    ]),
    variables: z.array(z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/)).min(1).max(16),
    unitsRequired: z.boolean(),
  })
  .strict()
  .refine((space) => new Set(space.variables).size === space.variables.length, {
    message: "Coordinate variables must be unique.",
  });

export const ViewportSchema = z
  .object({
    xMin: FiniteSchema,
    xMax: FiniteSchema,
    yMin: FiniteSchema,
    yMax: FiniteSchema,
    aspectRatio: z.number().positive().max(10).default(1.6),
    padding: z.number().min(0).max(0.25).default(0.04),
  })
  .strict()
  .superRefine((viewport, context) => {
    if (viewport.xMin >= viewport.xMax) {
      context.addIssue({ code: "custom", message: "xMin must be less than xMax." });
    }
    if (viewport.yMin >= viewport.yMax) {
      context.addIssue({ code: "custom", message: "yMin must be less than yMax." });
    }
  });

export const AxisSchema = z
  .object({
    id: IdentifierSchema,
    orientation: z.enum(["x", "y", "radial", "angular"]),
    label: RichTextSchema,
    unit: UnitSchema.optional(),
    scale: z.enum(["linear", "log"]).default("linear"),
    tickMode: z.enum(["automatic", "fixed-step", "explicit"]),
    tickStep: z.number().positive().optional(),
    tickValues: z.array(FiniteSchema).max(128).optional(),
    showGrid: z.boolean().default(false),
  })
  .strict()
  .superRefine((axis, context) => {
    if (axis.tickMode === "fixed-step" && axis.tickStep === undefined) {
      context.addIssue({ code: "custom", message: "fixed-step axes require tickStep." });
    }
    if (axis.tickMode === "explicit" && !axis.tickValues?.length) {
      context.addIssue({ code: "custom", message: "explicit axes require tickValues." });
    }
  });

export const AxesConfigurationSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("none"), reason: NonEmptyTextSchema }).strict(),
  z.object({ mode: z.literal("explicit"), axes: z.array(AxisSchema).min(1).max(8) }).strict(),
]);

export const PanelSpecSchema = z
  .object({
    id: IdentifierSchema,
    title: RichTextSchema,
    description: NonEmptyTextSchema,
    row: z.number().int().nonnegative().max(31),
    column: z.number().int().nonnegative().max(31),
    rowSpan: z.number().int().positive().max(32).default(1),
    columnSpan: z.number().int().positive().max(32).default(1),
    order: z.number().int().nonnegative().max(255),
    viewport: ViewportSchema.optional(),
    axes: AxesConfigurationSchema.optional(),
  })
  .strict();

export const ExpressionSourceSchema = z.discriminatedUnion("format", [
  z.object({ format: z.literal("ast"), ast: NumericAstSchema }).strict(),
  z
    .object({
      format: z.literal("latex"),
      expressionLatex: z.string().trim().min(1).max(2_048),
    })
    .strict(),
]);

const PresentationSchema = z
  .object({
    strokeToken: z.string().trim().min(1).max(64).optional(),
    fillToken: z.string().trim().min(1).max(64).optional(),
    lineStyle: z.enum(["solid", "dashed", "dotted", "double"]).default("solid"),
    markerShape: z.enum(["none", "circle", "square", "diamond", "triangle", "cross"]).default("none"),
    pattern: z.enum(["none", "diagonal", "crosshatch", "dots"]).default("none"),
    colorIndependentCue: NonEmptyTextSchema,
  })
  .strict();

const DomainSchema = z
  .object({
    min: FiniteSchema,
    max: FiniteSchema,
    includeMin: z.boolean().default(true),
    includeMax: z.boolean().default(true),
  })
  .strict()
  .refine((domain) => domain.min < domain.max, { message: "Domain min must be less than max." });

function buildLayerSchema(expressionSchema: z.ZodTypeAny) {
  const value = z.union([FiniteSchema, expressionSchema]);
  const point = z.object({ x: value, y: value }).strict();
  const common = {
    id: IdentifierSchema,
    panelId: IdentifierSchema.optional(),
    visible: z.boolean().default(true),
    zIndex: z.number().int().min(-100).max(100).default(0),
    label: RichTextSchema.optional(),
    presentation: PresentationSchema,
    references: z.array(IdentifierSchema).max(64).default([]),
  };
  const layer = <K extends string, T extends z.ZodRawShape>(kind: K, geometry: z.ZodObject<T>) =>
    z.object({ ...common, kind: z.literal(kind), geometry }).strict();

  return z.discriminatedUnion("kind", [
    layer("function", z.object({ expression: expressionSchema, variable: z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/), domain: DomainSchema }).strict()),
    layer("parametric-curve", z.object({ xExpression: expressionSchema, yExpression: expressionSchema, parameter: z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/), domain: DomainSchema }).strict()),
    layer("polar-curve", z.object({ radiusExpression: expressionSchema, angleVariable: z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/), domain: DomainSchema }).strict()),
    layer("sampled-series", z.object({ xValues: z.array(FiniteSchema).min(2).max(20_000), yValues: z.array(FiniteSchema).min(2).max(20_000), connect: z.boolean().default(true) }).strict().refine((series) => series.xValues.length === series.yValues.length, { message: "xValues and yValues must have equal lengths." })),
    layer("piecewise-branch", z.object({ expression: expressionSchema, variable: z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/), domain: DomainSchema }).strict()),
    layer("point", z.object({ position: point }).strict()),
    layer("open-point", z.object({ position: point }).strict()),
    layer("closed-point", z.object({ position: point }).strict()),
    layer("line", z.object({ start: point, end: point }).strict()),
    layer("ray", z.object({ start: point, through: point }).strict()),
    layer("segment", z.object({ start: point, end: point }).strict()),
    layer("vector", z.object({ start: point, end: point, componentLabels: z.boolean().default(false) }).strict()),
    layer("polygon", z.object({ points: z.array(point).min(3).max(256), closed: z.literal(true) }).strict()),
    layer("circle", z.object({ center: point, radius: value }).strict()),
    layer("ellipse", z.object({ center: point, radiusX: value, radiusY: value, rotationRadians: value }).strict()),
    layer("region", z.object({ boundaryLayerIds: z.array(IdentifierSchema).min(1).max(32) }).strict()),
    layer("inequality-region", z.object({ condition: expressionSchema, variables: z.array(z.string().regex(/^[A-Za-z][A-Za-z0-9_]{0,31}$/)).min(1).max(4) }).strict()),
    layer("vertical-asymptote", z.object({ x: value }).strict()),
    layer("horizontal-asymptote", z.object({ y: value }).strict()),
    layer("tangent-line", z.object({ point: point, slope: value }).strict()),
    layer("secant-line", z.object({ firstPoint: point, secondPoint: point }).strict()),
    layer("grid", z.object({ xStep: z.number().positive(), yStep: z.number().positive(), majorEvery: z.number().int().positive().max(20).default(5) }).strict()),
    layer("basis-grid", z.object({ origin: point, firstBasis: point, secondBasis: point }).strict()),
    layer("label", z.object({ position: point, content: RichTextSchema }).strict()),
    layer("annotation", z.object({ anchor: point, content: RichTextSchema, targetLayerId: IdentifierSchema.optional() }).strict()),
    layer("direction-arrow", z.object({ start: point, end: point }).strict()),
    layer("error-band", z.object({ xValues: z.array(FiniteSchema).min(2).max(20_000), lowerValues: z.array(FiniteSchema).min(2).max(20_000), upperValues: z.array(FiniteSchema).min(2).max(20_000) }).strict().superRefine((band, context) => { if (band.xValues.length !== band.lowerValues.length || band.xValues.length !== band.upperValues.length) context.addIssue({ code: "custom", message: "Error-band arrays must have equal lengths." }); })),
    layer("data-marker", z.object({ position: point, seriesLayerId: IdentifierSchema.optional() }).strict()),
    layer("trace", z.object({ points: z.array(point).min(2).max(20_000), connect: z.boolean().default(true) }).strict()),
    layer("linked-object", z.object({ objectIds: z.array(IdentifierSchema).min(2).max(32), relation: z.enum(["shared-parameter", "shared-cursor", "transformation", "constraint"]) }).strict()),
  ]);
}

export const VisualLayerSchema = buildLayerSchema(ExpressionSourceSchema);
export const CompiledLayerSchema = buildLayerSchema(NumericAstSchema);

const ControlBase = {
  id: IdentifierSchema,
  label: RichTextSchema,
  announcementTemplate: NonEmptyTextSchema,
};

export const ControlSpecSchema = z.discriminatedUnion("kind", [
  z.object({ ...ControlBase, kind: z.literal("slider"), parameter: IdentifierSchema, min: FiniteSchema, max: FiniteSchema, step: z.number().positive(), initial: FiniteSchema }).strict(),
  z.object({ ...ControlBase, kind: z.literal("draggable-point"), targetLayerId: IdentifierSchema, constraintLayerId: IdentifierSchema.optional(), keyboardStep: z.number().positive() }).strict(),
  z.object({ ...ControlBase, kind: z.literal("toggle"), targetLayerIds: z.array(IdentifierSchema).min(1).max(32), initial: z.boolean() }).strict(),
  z.object({ ...ControlBase, kind: z.literal("reset-view") }).strict(),
  z.object({ ...ControlBase, kind: z.literal("play-pause"), parameter: IdentifierSchema, from: FiniteSchema, to: FiniteSchema, step: z.number().positive(), framesPerSecond: z.number().positive().max(60) }).strict(),
  z.object({ ...ControlBase, kind: z.literal("step-control"), parameter: IdentifierSchema, values: z.array(FiniteSchema).min(2).max(256), initialIndex: z.number().int().nonnegative() }).strict(),
  z.object({ ...ControlBase, kind: z.literal("parameter-input"), parameter: IdentifierSchema, min: FiniteSchema, max: FiniteSchema, step: z.number().positive(), initial: FiniteSchema }).strict(),
  z.object({ ...ControlBase, kind: z.literal("linked-cursor"), targetLayerIds: z.array(IdentifierSchema).min(2).max(32), keyboardStep: z.number().positive() }).strict(),
]);

export const AccessibilitySpecSchema = z
  .object({
    ariaLabel: NonEmptyTextSchema,
    summary: NonEmptyTextSchema,
    readingOrder: z.array(IdentifierSchema).min(1).max(256),
    colorIndependentDescription: NonEmptyTextSchema,
    keyboardInstructions: NonEmptyTextSchema.optional(),
    controlInstructions: z.array(NonEmptyTextSchema).max(32).default([]),
    reducedMotion: z.enum(["not-applicable", "manual-only", "disable-animation"]),
    staticFallbackEquivalent: z.literal(true),
    dataTableAlternative: z.array(z.array(z.string().max(512)).max(32)).max(512).optional(),
  })
  .strict();

export const PrintSpecSchema = z.discriminatedUnion("representation", [
  z
    .object({
      representation: z.literal("generated-svg"),
      caption: RichTextSchema,
      grayscaleSafe: z.literal(true),
      pageBreak: z.enum(["avoid", "allow"]),
      widthInches: z.number().positive().max(10),
    })
    .strict(),
  z
    .object({
      representation: z.literal("verified-asset"),
      assetPath: z.string().regex(/^\/[A-Za-z0-9_./-]+$/),
      assetHash: z.string().regex(/^[a-f0-9]{64}$/),
      caption: RichTextSchema,
      grayscaleSafe: z.literal(true),
      pageBreak: z.enum(["avoid", "allow"]),
      widthInches: z.number().positive().max(10),
    })
    .strict(),
]);

export const PerformanceHintsSchema = z
  .object({
    maxSamples: z.number().int().min(16).max(20_000),
    maxAdaptiveDepth: z.number().int().min(1).max(24),
    maxAstNodes: z.number().int().min(1).max(512),
    maxAstDepth: z.number().int().min(1).max(32),
    maxOperationsPerEvaluation: z.number().int().min(8).max(8_192),
    maxPayloadBytes: z.number().int().min(256).max(512_000),
    maxAnimationFps: z.number().int().min(1).max(60),
    activation: z.enum(["none", "near-viewport", "explicit-user-action"]),
  })
  .strict();

export const ProvenanceSpecSchema = z
  .object({
    route: z.string().startsWith("/").max(512),
    sourceFile: z.string().min(1).max(512),
    authoringId: IdentifierSchema,
    visibility: z.enum(["public", "fixture"]),
    sourceRevision: z.string().regex(/^[a-f0-9]{7,64}$/).optional(),
  })
  .strict();

const RendererPreferenceSchema = z.enum([
  "lowest-cost",
  "prefer-static",
  "prefer-interactive",
]);

const visualSpecBase = z
  .object({
    schemaVersion: VisualSpecVersionSchema,
    id: IdentifierSchema,
    kind: VisualKindSchema,
    title: RichTextSchema,
    caption: RichTextSchema,
    learningPurpose: NonEmptyTextSchema,
    longDescription: NonEmptyTextSchema,
    coordinateSpace: CoordinateSpaceSchema,
    viewport: ViewportSchema,
    axes: AxesConfigurationSchema,
    panels: z.array(PanelSpecSchema).max(32).default([]),
    layers: z.array(VisualLayerSchema).min(1).max(256),
    controls: z.array(ControlSpecSchema).max(64).default([]),
    accessibility: AccessibilitySpecSchema,
    print: PrintSpecSchema,
    performance: PerformanceHintsSchema.optional(),
    requiredCapabilities: z.array(VisualCapabilitySchema).min(1).max(64),
    preferredRenderer: RendererPreferenceSchema.default("lowest-cost"),
    provenance: ProvenanceSpecSchema,
  })
  .strict();

function validateReferences(spec: z.infer<typeof visualSpecBase>, context: z.RefinementCtx) {
  const layerIds = spec.layers.map((layer) => layer.id);
  const layerIdSet = new Set(layerIds);
  const panelIds = spec.panels.map((panel) => panel.id);
  const panelIdSet = new Set(panelIds);
  if (layerIdSet.size !== layerIds.length) {
    context.addIssue({ code: "custom", path: ["layers"], message: "Layer IDs must be unique within a visual." });
  }
  const controlIds = spec.controls.map((control) => control.id);
  if (new Set(controlIds).size !== controlIds.length) {
    context.addIssue({ code: "custom", path: ["controls"], message: "Control IDs must be unique within a visual." });
  }
  if (new Set(spec.requiredCapabilities).size !== spec.requiredCapabilities.length) {
    context.addIssue({ code: "custom", path: ["requiredCapabilities"], message: "Required capabilities must be unique." });
  }
  if (panelIdSet.size !== panelIds.length) {
    context.addIssue({ code: "custom", path: ["panels"], message: "Panel IDs must be unique within a visual." });
  }
  if (new Set(spec.panels.map((panel) => panel.order)).size !== spec.panels.length) {
    context.addIssue({ code: "custom", path: ["panels"], message: "Panel reading orders must be unique." });
  }
  for (let left = 0; left < spec.panels.length; left += 1) {
    const a = spec.panels[left];
    for (let right = left + 1; right < spec.panels.length; right += 1) {
      const b = spec.panels[right];
      const overlaps = a.row < b.row + b.rowSpan && a.row + a.rowSpan > b.row && a.column < b.column + b.columnSpan && a.column + a.columnSpan > b.column;
      if (overlaps) context.addIssue({ code: "custom", path: ["panels", right], message: `Panels ${a.id} and ${b.id} overlap in the layout grid.` });
    }
  }
  if (spec.panels.length > 1 && !spec.requiredCapabilities.includes("multi-panel")) {
    context.addIssue({ code: "custom", path: ["requiredCapabilities"], message: "Multi-panel visuals must declare the multi-panel capability." });
  }
  if (spec.coordinateSpace.unitsRequired && spec.axes.mode !== "explicit") {
    context.addIssue({ code: "custom", path: ["axes"], message: "A unit-bearing coordinate space requires explicit axes." });
  }
  if (spec.coordinateSpace.unitsRequired && spec.axes.mode === "explicit" && spec.axes.axes.some((axis) => !axis.unit)) {
    context.addIssue({ code: "custom", path: ["axes"], message: "Every explicit axis requires units when unitsRequired is true." });
  }
  const adjacency = new Map<string, string[]>();
  for (const layer of spec.layers) {
    if (spec.panels.length && !layer.panelId) {
      context.addIssue({ code: "custom", path: ["layers", layerIds.indexOf(layer.id), "panelId"], message: `Layer ${layer.id} must identify its panel.` });
    }
    if (layer.panelId && !panelIdSet.has(layer.panelId)) {
      context.addIssue({ code: "custom", path: ["layers", layerIds.indexOf(layer.id), "panelId"], message: `Layer ${layer.id} references missing panel ${layer.panelId}.` });
    }
    const geometryRefs: string[] = [];
    if (layer.kind === "region") geometryRefs.push(...layer.geometry.boundaryLayerIds);
    if (layer.kind === "linked-object") geometryRefs.push(...layer.geometry.objectIds);
    if (layer.kind === "annotation" && layer.geometry.targetLayerId) geometryRefs.push(layer.geometry.targetLayerId);
    if (layer.kind === "data-marker" && layer.geometry.seriesLayerId) geometryRefs.push(layer.geometry.seriesLayerId);
    const refs = [...layer.references, ...geometryRefs];
    adjacency.set(layer.id, refs);
    for (const reference of refs) {
      if (!layerIdSet.has(reference)) {
        context.addIssue({ code: "custom", path: ["layers", layerIds.indexOf(layer.id), "references"], message: `Layer ${layer.id} references missing layer ${reference}.` });
      }
    }
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const hasCycle = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const next of adjacency.get(id) ?? []) if (hasCycle(next)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };
  for (const id of layerIds) {
    if (hasCycle(id)) {
      context.addIssue({ code: "custom", path: ["layers"], message: "Layer references contain an unsupported cycle." });
      break;
    }
  }
  for (const [index, control] of spec.controls.entries()) {
    const targetIds = control.kind === "draggable-point"
      ? [control.targetLayerId, ...(control.constraintLayerId ? [control.constraintLayerId] : [])]
      : control.kind === "toggle" || control.kind === "linked-cursor"
        ? control.targetLayerIds
        : [];
    for (const id of targetIds) if (!layerIdSet.has(id)) context.addIssue({ code: "custom", path: ["controls", index], message: `Control ${control.id} references missing layer ${id}.` });
    if ((control.kind === "slider" || control.kind === "parameter-input") && (control.min >= control.max || control.initial < control.min || control.initial > control.max)) context.addIssue({ code: "custom", path: ["controls", index], message: `${control.kind} range and initial value are invalid.` });
    if (control.kind === "play-pause" && control.from >= control.to) context.addIssue({ code: "custom", path: ["controls", index], message: "play-pause from must be less than to." });
    if (control.kind === "step-control" && control.initialIndex >= control.values.length) context.addIssue({ code: "custom", path: ["controls", index], message: "step-control initialIndex is outside values." });
  }
  for (const readingId of spec.accessibility.readingOrder) if (!layerIdSet.has(readingId) && !controlIds.includes(readingId) && !panelIdSet.has(readingId)) context.addIssue({ code: "custom", path: ["accessibility", "readingOrder"], message: `Reading-order ID ${readingId} does not identify a panel, layer, or control.` });
}

export const VisualSpecSchema = visualSpecBase.superRefine(validateReferences);

export const DEFAULT_PERFORMANCE_HINTS = Object.freeze({
  maxSamples: 2_048,
  maxAdaptiveDepth: 12,
  maxAstNodes: 256,
  maxAstDepth: 24,
  maxOperationsPerEvaluation: 2_048,
  maxPayloadBytes: 64_000,
  maxAnimationFps: 30,
  activation: "none" as const,
});

export const RendererIdSchema = z.enum([
  "static-svg",
  "bg-interactive-2d",
  "jsxgraph",
  "uplot",
  "future-specialist",
]);

export const CompiledSceneSchema = z
  .object({
    compiledSceneVersion: CompiledSceneVersionSchema,
    sourceSpecVersion: VisualSpecVersionSchema,
    id: IdentifierSchema,
    kind: VisualKindSchema,
    title: RichTextSchema,
    caption: RichTextSchema,
    learningPurpose: NonEmptyTextSchema,
    longDescription: NonEmptyTextSchema,
    coordinateSpace: CoordinateSpaceSchema,
    viewport: ViewportSchema,
    axes: AxesConfigurationSchema,
    panels: z.array(PanelSpecSchema).max(32),
    layers: z.array(CompiledLayerSchema).min(1).max(256),
    controls: z.array(ControlSpecSchema).max(64),
    accessibility: AccessibilitySpecSchema,
    print: PrintSpecSchema,
    performance: PerformanceHintsSchema,
    requiredCapabilities: z.array(VisualCapabilitySchema).min(1).max(64),
    selectedRenderer: RendererIdSchema,
    staticFallback: z.object({ required: z.literal(true), rendererId: z.literal("static-svg") }).strict(),
    delivery: z.object({ hydration: z.enum(["none", "near-viewport", "explicit-user-action"]), publicFieldsOnly: z.literal(true) }).strict(),
    provenance: z.object({ route: z.string().startsWith("/"), sourceFile: z.string().min(1), sourceVisualId: IdentifierSchema, sourceFingerprint: z.string().regex(/^bvlp1-[a-f0-9]{8}$/), compilerVersion: z.literal("bvlp-compiler-v1"), visibility: z.enum(["public", "fixture"]) }).strict(),
  })
  .strict();

export type VisualKind = z.infer<typeof VisualKindSchema>;
export type VisualLayerKind = z.infer<typeof VisualLayerKindSchema>;
export type ControlKind = z.infer<typeof ControlKindSchema>;
export type VisualCapability = z.infer<typeof VisualCapabilitySchema>;
export type VisualSpec = z.infer<typeof VisualSpecSchema>;
export type CompiledScene = z.infer<typeof CompiledSceneSchema>;
export type RendererId = z.infer<typeof RendererIdSchema>;
export type ExpressionSource = z.infer<typeof ExpressionSourceSchema>;
