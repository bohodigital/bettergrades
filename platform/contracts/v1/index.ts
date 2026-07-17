import { z } from "zod";

export const CONTRACT_VERSION = "1.0.0" as const;

const ContractVersionSchema = z.literal(CONTRACT_VERSION);
const StableIdSchema = z.string().regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/);
const RouteSchema = z.string().regex(/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/);
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const IsoDateTimeSchema = z.iso.datetime({ offset: true });
const NonEmptyTextSchema = z.string().trim().min(1);

export const ReleaseVisibilitySchema = z.enum(["draft", "preview", "public"]);

export const ProvenanceSchema = z.strictObject({
  sourceId: StableIdSchema,
  sourceKind: z.enum(["authored", "imported", "generated", "reviewed"]),
  sourcePath: NonEmptyTextSchema,
  sourceRevision: NonEmptyTextSchema,
  sourceLocator: NonEmptyTextSchema,
  contentSha256: Sha256Schema,
  attribution: z.string().optional(),
  license: z.string().optional(),
  reviewedAt: IsoDateTimeSchema.optional(),
});

export const CourseSequenceEntrySchema = z.strictObject({
  pageId: StableIdSchema,
  route: RouteSchema,
  ordinal: z.number().int().nonnegative(),
  role: z.enum(["core", "support"]),
  prerequisites: z.array(StableIdSchema),
});

export const CourseSequenceSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  entries: z.array(CourseSequenceEntrySchema).min(1),
});

const RecordMetadataSchema = z.strictObject({
  title: NonEmptyTextSchema,
  description: NonEmptyTextSchema,
  canonicalRoute: RouteSchema,
  robots: z.enum(["index-follow", "noindex-follow", "noindex-nofollow"]),
  searchIntent: StableIdSchema,
});

export const PageSchema = z.strictObject({
  id: StableIdSchema,
  sectionId: StableIdSchema,
  slug: StableIdSchema,
  route: RouteSchema,
  title: NonEmptyTextSchema,
  summary: NonEmptyTextSchema,
  pageKind: z.enum(["lesson", "guide", "reference", "practice", "exam", "answer-key", "review"]),
  visibility: ReleaseVisibilitySchema,
  sequenceRole: z.enum(["core", "support"]),
  metadata: RecordMetadataSchema,
  bodyRef: NonEmptyTextSchema,
  assessmentBankRef: z.string().optional(),
  provenance: ProvenanceSchema,
}).superRefine((page, context) => {
  if (page.metadata.canonicalRoute !== page.route) {
    context.addIssue({ code: "custom", path: ["metadata", "canonicalRoute"], message: "canonicalRoute must equal route" });
  }
});

export const SectionSchema = z.strictObject({
  id: StableIdSchema,
  unitId: StableIdSchema,
  slug: StableIdSchema,
  title: NonEmptyTextSchema,
  description: NonEmptyTextSchema,
  visibility: ReleaseVisibilitySchema,
  pages: z.array(PageSchema).min(1),
});

export const UnitSchema = z.strictObject({
  id: StableIdSchema,
  courseId: StableIdSchema,
  slug: StableIdSchema,
  title: NonEmptyTextSchema,
  description: NonEmptyTextSchema,
  visibility: ReleaseVisibilitySchema,
  sections: z.array(SectionSchema).min(1),
  sequence: CourseSequenceSchema,
});

export const CourseSchema = z.strictObject({
  id: StableIdSchema,
  slug: StableIdSchema,
  title: NonEmptyTextSchema,
  description: NonEmptyTextSchema,
  subject: StableIdSchema,
  visibility: ReleaseVisibilitySchema,
  units: z.array(UnitSchema).min(1),
  provenance: ProvenanceSchema,
}).superRefine((course, context) => {
  const visibilityRank = { draft: 0, preview: 1, public: 2 };
  const unitIds = new Set<string>();
  const sectionIds = new Set<string>();
  const pageIds = new Set<string>();
  const pageRoutes = new Set<string>();
  for (const [unitIndex, unit] of course.units.entries()) {
    if (unitIds.has(unit.id)) context.addIssue({ code: "custom", path: ["units", unitIndex, "id"], message: "duplicate unit id" });
    unitIds.add(unit.id);
    if (unit.courseId !== course.id) context.addIssue({ code: "custom", path: ["units", unitIndex, "courseId"], message: "courseId must resolve to parent course" });
    if (visibilityRank[unit.visibility] > visibilityRank[course.visibility]) context.addIssue({ code: "custom", path: ["units", unitIndex, "visibility"], message: "child visibility cannot exceed parent visibility" });
    const unitPages = new Map<string, { route: string; path: (string | number)[]; visibility: keyof typeof visibilityRank }>();
    for (const [sectionIndex, section] of unit.sections.entries()) {
      if (sectionIds.has(section.id)) context.addIssue({ code: "custom", path: ["units", unitIndex, "sections", sectionIndex, "id"], message: "duplicate section id" });
      sectionIds.add(section.id);
      if (section.unitId !== unit.id) context.addIssue({ code: "custom", path: ["units", unitIndex, "sections", sectionIndex, "unitId"], message: "unitId must resolve to parent unit" });
      if (visibilityRank[section.visibility] > visibilityRank[unit.visibility]) context.addIssue({ code: "custom", path: ["units", unitIndex, "sections", sectionIndex, "visibility"], message: "child visibility cannot exceed parent visibility" });
      for (const [pageIndex, page] of section.pages.entries()) {
        const pagePath = ["units", unitIndex, "sections", sectionIndex, "pages", pageIndex];
        if (pageIds.has(page.id)) context.addIssue({ code: "custom", path: [...pagePath, "id"], message: "duplicate page id" });
        if (pageRoutes.has(page.route)) context.addIssue({ code: "custom", path: [...pagePath, "route"], message: "duplicate page route" });
        pageIds.add(page.id);
        pageRoutes.add(page.route);
        unitPages.set(page.id, { route: page.route, path: pagePath, visibility: page.visibility });
        if (page.sectionId !== section.id) context.addIssue({ code: "custom", path: [...pagePath, "sectionId"], message: "sectionId must resolve to parent section" });
        if (visibilityRank[page.visibility] > visibilityRank[section.visibility]) context.addIssue({ code: "custom", path: [...pagePath, "visibility"], message: "child visibility cannot exceed parent visibility" });
      }
    }
    const sequencePages = new Set<string>();
    const ordinals = new Set<number>();
    for (const [entryIndex, entry] of unit.sequence.entries.entries()) {
      const entryPath = ["units", unitIndex, "sequence", "entries", entryIndex];
      const page = unitPages.get(entry.pageId);
      if (!page) context.addIssue({ code: "custom", path: [...entryPath, "pageId"], message: "sequence pageId must resolve inside unit" });
      if (page && page.route !== entry.route) context.addIssue({ code: "custom", path: [...entryPath, "route"], message: "sequence route must equal page route" });
      if (page && unit.sections.flatMap((section) => section.pages).find((candidate) => candidate.id === entry.pageId)?.sequenceRole !== entry.role) context.addIssue({ code: "custom", path: [...entryPath, "role"], message: "sequence role must equal page sequenceRole" });
      if (sequencePages.has(entry.pageId)) context.addIssue({ code: "custom", path: [...entryPath, "pageId"], message: "duplicate sequence page" });
      if (ordinals.has(entry.ordinal)) context.addIssue({ code: "custom", path: [...entryPath, "ordinal"], message: "duplicate sequence ordinal" });
      sequencePages.add(entry.pageId);
      ordinals.add(entry.ordinal);
      for (const prerequisite of entry.prerequisites) {
        if (!unitPages.has(prerequisite)) context.addIssue({ code: "custom", path: [...entryPath, "prerequisites"], message: "prerequisite must resolve inside unit" });
      }
    }
    for (const [pageId, page] of unitPages) {
      if (!sequencePages.has(pageId)) context.addIssue({ code: "custom", path: page.path, message: "every page must occur exactly once in unit sequence" });
    }
  }
});

const SemanticBaseSchema = z.strictObject({ id: StableIdSchema, provenance: ProvenanceSchema });
const TextNodeSchema = SemanticBaseSchema.extend({ type: z.literal("text"), text: NonEmptyTextSchema }).strict();
const MathJsonOperatorSchema = z.enum([
  "Add", "Subtract", "Multiply", "Divide", "Negate", "Power", "Root", "Sqrt", "Rational",
  "Abs", "Exp", "Ln", "Log", "Sin", "Cos", "Tan", "Arcsin", "Arccos", "Arctan",
  "Equal", "NotEqual", "Less", "LessEqual", "Greater", "GreaterEqual", "And", "Or", "Not",
  "Tuple", "List", "Interval", "Set", "Derivative",
]);
const MathJsonSymbolSchema = z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/);
export type MathJson = number | string | MathJson[];
const MathJsonInternalSchema: z.ZodType<MathJson> = z.lazy(() => z.union([
  z.number().finite(),
  MathJsonSymbolSchema,
  z.array(MathJsonInternalSchema).min(2).max(64).superRefine((expression, context) => {
    const operatorResult = MathJsonOperatorSchema.safeParse(expression[0]);
    if (!operatorResult.success) {
      context.addIssue({ code: "custom", path: [0], message: "MathJSON operator is not allowlisted" });
      return;
    }
    const operator = operatorResult.data;
    const exactTwoOperands = new Set(["Subtract", "Divide", "Power", "Root", "Equal", "NotEqual", "Less", "LessEqual", "Greater", "GreaterEqual", "Interval"]);
    const exactOneOperand = new Set(["Negate", "Sqrt", "Abs", "Exp", "Ln", "Log", "Sin", "Cos", "Tan", "Arcsin", "Arccos", "Arctan", "Not"]);
    if (exactTwoOperands.has(operator) && expression.length !== 3) context.addIssue({ code: "custom", message: operator + " requires exactly two operands" });
    if (exactOneOperand.has(operator) && expression.length !== 2) context.addIssue({ code: "custom", message: operator + " requires exactly one operand" });
    if (["Add", "Multiply", "And", "Or"].includes(operator) && expression.length < 3) context.addIssue({ code: "custom", message: operator + " requires at least two operands" });
    if (["Tuple", "List", "Set"].includes(operator) && expression.length < 2) context.addIssue({ code: "custom", message: operator + " requires at least one item" });
    if (operator === "Derivative" && ![2, 3].includes(expression.length)) context.addIssue({ code: "custom", message: "Derivative requires an expression and optional variable" });
    if (operator === "Rational") {
      if (expression.length !== 3 || !Number.isInteger(expression[1]) || !Number.isInteger(expression[2]) || expression[2] === 0) {
        context.addIssue({ code: "custom", message: "Rational requires integer numerator and nonzero integer denominator" });
      }
    }
  }),
]));
export const MathJsonSchema = MathJsonInternalSchema.superRefine((expression, context) => {
  let nodes = 0;
  const visit = (node: MathJson, depth: number) => {
    nodes += 1;
    if (depth > 32) context.addIssue({ code: "custom", message: "MathJSON exceeds maximum depth 32" });
    if (nodes > 2048) context.addIssue({ code: "custom", message: "MathJSON exceeds maximum node count 2048" });
    if (Array.isArray(node)) node.forEach((child) => visit(child, depth + 1));
  };
  visit(expression, 0);
});
const MathNodeSchema = SemanticBaseSchema.extend({
  type: z.enum(["inline-math", "display-math"]),
  latex: NonEmptyTextSchema,
  mathJson: MathJsonSchema.optional(),
}).strict();
const HeadingNodeSchema = SemanticBaseSchema.extend({
  type: z.literal("heading"),
  level: z.number().int().min(2).max(4),
  text: NonEmptyTextSchema,
}).strict();
const VisualNodeSchema = SemanticBaseSchema.extend({
  type: z.literal("visual"),
  visualId: StableIdSchema,
}).strict();

type SemanticProvenance = z.infer<typeof ProvenanceSchema>;
type SemanticContainerType =
  | "paragraph" | "derivation" | "cases" | "array" | "definition" | "theorem" | "concept" | "method"
  | "worked-example" | "guided-walkthrough" | "exercise" | "problem" | "application" | "hint" | "solution"
  | "quick-check" | "common-mistake" | "exam-note" | "summary" | "advanced-note" | "navigation-marker";

export type SemanticNode =
  | { id: string; provenance: SemanticProvenance; type: "text"; text: string }
  | { id: string; provenance: SemanticProvenance; type: "inline-math" | "display-math"; latex: string; mathJson?: unknown }
  | { id: string; provenance: SemanticProvenance; type: "heading"; level: number; text: string }
  | { id: string; provenance: SemanticProvenance; type: "visual"; visualId: string }
  | { id: string; provenance: SemanticProvenance; type: SemanticContainerType; title?: string; children: SemanticNode[] }
  | { id: string; provenance: SemanticProvenance; type: "table"; caption: string; columns: string[]; rows: string[][] };

const SemanticNodeInternalSchema = z.lazy(() => z.union([
  TextNodeSchema,
  MathNodeSchema,
  HeadingNodeSchema,
  VisualNodeSchema,
  SemanticBaseSchema.extend({
    type: z.enum([
      "paragraph", "derivation", "cases", "array", "definition", "theorem", "concept", "method",
      "worked-example", "guided-walkthrough", "exercise", "problem", "application", "hint", "solution",
      "quick-check", "common-mistake", "exam-note", "summary", "advanced-note", "navigation-marker",
    ]),
    title: z.string().optional(),
    children: z.array(SemanticNodeInternalSchema).min(1),
  }).strict(),
  SemanticBaseSchema.extend({
    type: z.literal("table"),
    caption: NonEmptyTextSchema,
    columns: z.array(NonEmptyTextSchema).min(1),
    rows: z.array(z.array(NonEmptyTextSchema).min(1)).min(1),
  }).strict(),
])) as z.ZodType<SemanticNode>;

export const SemanticNodeSchema = SemanticNodeInternalSchema;

const AssessmentBaseSchema = z.strictObject({
  id: StableIdSchema,
  prompt: z.array(SemanticNodeSchema).min(1),
  visibility: ReleaseVisibilitySchema,
  provenance: ProvenanceSchema,
});

const RequiredFormSchema = z.enum([
  "any-equivalent", "exact", "decimal", "factored", "expanded", "simplified", "interval-notation", "set-builder",
]);

export const AnswerSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("numeric"), value: z.number(), absoluteTolerance: z.number().nonnegative(), requiredForm: RequiredFormSchema }),
  z.strictObject({ kind: z.literal("rational"), numerator: z.number().int(), denominator: z.number().int().refine((value) => value !== 0), requiredForm: RequiredFormSchema }),
  z.strictObject({ kind: z.literal("multiple-choice"), optionId: StableIdSchema }),
  z.strictObject({ kind: z.literal("multiple-select"), optionIds: z.array(StableIdSchema).min(1) }),
  z.strictObject({ kind: z.literal("symbolic"), mathJson: MathJsonSchema, variables: z.array(StableIdSchema).max(16), requiredForm: RequiredFormSchema }),
  z.strictObject({ kind: z.literal("derivative-equivalence"), mathJson: MathJsonSchema, variable: StableIdSchema, domain: z.string().optional(), requiredForm: RequiredFormSchema }),
  z.strictObject({ kind: z.literal("interval"), intervals: z.array(z.strictObject({ lower: z.union([z.number(), z.literal("-infinity")]), upper: z.union([z.number(), z.literal("infinity")]), lowerClosed: z.boolean(), upperClosed: z.boolean() })).min(1) }),
  z.strictObject({ kind: z.literal("set"), values: z.array(z.union([z.number(), NonEmptyTextSchema])) }),
  z.strictObject({ kind: z.literal("quantity"), value: z.number(), unit: NonEmptyTextSchema, absoluteTolerance: z.number().nonnegative() }),
  z.strictObject({ kind: z.literal("ordered-list"), values: z.array(NonEmptyTextSchema).min(1) }),
  z.strictObject({ kind: z.literal("manual"), rubric: NonEmptyTextSchema }),
  z.strictObject({ kind: z.literal("reveal-only"), acknowledgement: NonEmptyTextSchema }),
]);

export const AssessmentResultSchema = z.discriminatedUnion("status", [
  z.strictObject({ status: z.literal("correct"), message: NonEmptyTextSchema }),
  z.strictObject({ status: z.literal("incorrect"), message: NonEmptyTextSchema, retryable: z.boolean() }),
  z.strictObject({ status: z.literal("uncertain"), message: NonEmptyTextSchema, reason: NonEmptyTextSchema }),
  z.strictObject({ status: z.literal("hint"), message: NonEmptyTextSchema }),
  z.strictObject({ status: z.literal("revealed"), message: NonEmptyTextSchema }),
]);

const ResponseKindSchema = z.enum([
  "numeric", "rational", "multiple-choice", "multiple-select", "symbolic", "derivative-equivalence",
  "interval", "set", "quantity", "ordered-list", "manual", "reveal-only",
]);
const AssessmentOptionSchema = z.strictObject({ id: StableIdSchema, label: NonEmptyTextSchema });

export const PublicAssessmentSchema = AssessmentBaseSchema.extend({
  responseKind: ResponseKindSchema,
  options: z.array(AssessmentOptionSchema).optional(),
}).strict();

export const ServerAssessmentSchema = AssessmentBaseSchema.extend({
  responseKind: ResponseKindSchema,
  options: z.array(AssessmentOptionSchema).optional(),
  answer: AnswerSchema,
  acceptedVariants: z.array(AnswerSchema),
  hints: z.array(z.array(SemanticNodeSchema)),
  workedFeedback: z.array(SemanticNodeSchema),
}).strict().superRefine((assessment, context) => {
  if (assessment.responseKind !== assessment.answer.kind) {
    context.addIssue({ code: "custom", path: ["answer", "kind"], message: "answer kind must match responseKind" });
  }
  assessment.acceptedVariants.forEach((variant, index) => {
    if (variant.kind !== assessment.responseKind) {
      context.addIssue({ code: "custom", path: ["acceptedVariants", index, "kind"], message: "accepted variant kind must match responseKind" });
    }
  });
  const optionIds = new Set(assessment.options?.map((option) => option.id) ?? []);
  if (assessment.options && optionIds.size !== assessment.options.length) {
    context.addIssue({ code: "custom", path: ["options"], message: "option ids must be unique" });
  }
  if (assessment.answer.kind === "multiple-choice" && !optionIds.has(assessment.answer.optionId)) {
    context.addIssue({ code: "custom", path: ["answer", "optionId"], message: "answer optionId must resolve" });
  }
  if (assessment.answer.kind === "multiple-select" && assessment.answer.optionIds.some((optionId) => !optionIds.has(optionId))) {
    context.addIssue({ code: "custom", path: ["answer", "optionIds"], message: "every answer optionId must resolve" });
  }
});

const PointSchema = z.strictObject({ x: z.number(), y: z.number() });
const VisualExpressionSchema = z.strictObject({
  id: StableIdSchema,
  mathJson: MathJsonSchema,
  variables: z.array(StableIdSchema).max(16),
});
const VisualDatasetSchema = z.strictObject({
  id: StableIdSchema,
  columns: z.record(StableIdSchema, z.array(z.number().finite()).max(10000)),
}).superRefine((dataset, context) => {
  const lengths = Object.values(dataset.columns).map((column) => column.length);
  if (lengths.length === 0) context.addIssue({ code: "custom", path: ["columns"], message: "dataset needs at least one column" });
  if (new Set(lengths).size > 1) context.addIssue({ code: "custom", path: ["columns"], message: "dataset columns must have equal lengths" });
});
const VisualLayerSchema = z.discriminatedUnion("kind", [
  z.strictObject({ id: StableIdSchema, kind: z.literal("axes"), xLabel: z.string(), yLabel: z.string() }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("curve"), expressionRef: StableIdSchema, domain: z.tuple([z.number(), z.number()]), samples: z.number().int().min(2).max(10000) }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("polyline"), points: z.array(PointSchema).min(2) }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("points"), points: z.array(PointSchema).min(1) }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("region"), boundaryRefs: z.array(StableIdSchema).min(1) }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("annotation"), text: NonEmptyTextSchema, anchor: PointSchema }),
  z.strictObject({ id: StableIdSchema, kind: z.literal("dataset"), dataRef: StableIdSchema, xField: StableIdSchema, yField: StableIdSchema }),
]);

export const VisualSpecSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  id: StableIdSchema,
  sceneKind: z.enum(["cartesian-2d", "number-line", "unit-circle", "statistical-series", "surface-3d", "molecular-3d"]),
  rendererCapability: StableIdSchema,
  renderingMode: z.enum(["static", "interactive"]),
  title: NonEmptyTextSchema,
  caption: NonEmptyTextSchema,
  longDescription: NonEmptyTextSchema,
  expressions: z.array(VisualExpressionSchema),
  datasets: z.array(VisualDatasetSchema),
  layers: z.array(VisualLayerSchema).min(1),
  interactions: z.array(z.enum(["none", "keyboard-pan", "keyboard-zoom", "drag-point", "scrub-parameter", "toggle-series"])).min(1),
  reducedMotion: z.enum(["static-equivalent", "motion-disabled"]),
  printFallback: z.strictObject({ kind: z.literal("static-svg"), assetRef: NonEmptyTextSchema, altText: NonEmptyTextSchema }),
  provenance: ProvenanceSchema,
}).superRefine((visual, context) => {
  const expressionIds = new Set<string>();
  const datasetIds = new Set<string>();
  const layerIds = new Set<string>();
  visual.expressions.forEach((expression, index) => {
    if (expressionIds.has(expression.id)) context.addIssue({ code: "custom", path: ["expressions", index, "id"], message: "duplicate expression id" });
    expressionIds.add(expression.id);
  });
  visual.datasets.forEach((dataset, index) => {
    if (datasetIds.has(dataset.id)) context.addIssue({ code: "custom", path: ["datasets", index, "id"], message: "duplicate dataset id" });
    datasetIds.add(dataset.id);
  });
  visual.layers.forEach((layer, index) => {
    if (layerIds.has(layer.id)) context.addIssue({ code: "custom", path: ["layers", index, "id"], message: "duplicate layer id" });
    layerIds.add(layer.id);
  });
  visual.layers.forEach((layer, index) => {
    if (layer.kind === "curve" && !expressionIds.has(layer.expressionRef)) context.addIssue({ code: "custom", path: ["layers", index, "expressionRef"], message: "expressionRef must resolve" });
    if (layer.kind === "region" && layer.boundaryRefs.some((reference) => !layerIds.has(reference) || reference === layer.id)) context.addIssue({ code: "custom", path: ["layers", index, "boundaryRefs"], message: "every region boundary must resolve to another layer" });
    if (layer.kind === "dataset") {
      const dataset = visual.datasets.find((candidate) => candidate.id === layer.dataRef);
      if (!datasetIds.has(layer.dataRef) || !dataset) context.addIssue({ code: "custom", path: ["layers", index, "dataRef"], message: "dataRef must resolve" });
      else if (!(layer.xField in dataset.columns) || !(layer.yField in dataset.columns)) context.addIssue({ code: "custom", path: ["layers", index], message: "xField and yField must resolve to dataset columns" });
    }
  });
  if (visual.interactions.includes("none") && visual.interactions.length !== 1) {
    context.addIssue({ code: "custom", path: ["interactions"], message: "none cannot be combined with active interactions" });
  }
});

export const AuthoredPageBodySchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  pageId: StableIdSchema,
  body: z.array(SemanticNodeSchema).min(1),
  visualIds: z.array(StableIdSchema),
  assessmentIds: z.array(StableIdSchema),
  provenance: ProvenanceSchema,
});

export const AuthoredCoursePackageSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  course: CourseSchema,
  pages: z.array(AuthoredPageBodySchema).min(1),
  visuals: z.array(VisualSpecSchema),
  assessments: z.array(ServerAssessmentSchema),
}).superRefine((authored, context) => {
  const manifestPages = authored.course.units.flatMap((unit) => unit.sections.flatMap((section) => section.pages));
  const manifestPageIds = new Set(manifestPages.map((page) => page.id));
  const bodyIds = new Set<string>();
  const visualIds = new Set<string>();
  const assessmentIds = new Set<string>();
  const referencedVisualIds = new Set<string>();
  const referencedAssessmentIds = new Set<string>();
  authored.visuals.forEach((visual, index) => {
    if (visualIds.has(visual.id)) context.addIssue({ code: "custom", path: ["visuals", index, "id"], message: "duplicate visual id" });
    visualIds.add(visual.id);
  });
  authored.assessments.forEach((assessment, index) => {
    if (assessmentIds.has(assessment.id)) context.addIssue({ code: "custom", path: ["assessments", index, "id"], message: "duplicate assessment id" });
    assessmentIds.add(assessment.id);
  });
  authored.pages.forEach((page, index) => {
    if (!manifestPageIds.has(page.pageId)) context.addIssue({ code: "custom", path: ["pages", index, "pageId"], message: "page body must resolve to manifest page" });
    if (bodyIds.has(page.pageId)) context.addIssue({ code: "custom", path: ["pages", index, "pageId"], message: "duplicate page body" });
    bodyIds.add(page.pageId);
    const manifestPage = manifestPages.find((candidate) => candidate.id === page.pageId);
    if (manifestPage && manifestPage.bodyRef !== "server:pages/" + page.pageId) context.addIssue({ code: "custom", path: ["pages", index, "pageId"], message: "manifest bodyRef must resolve to this server page body" });
    if (manifestPage && page.assessmentIds.length > 0 && manifestPage.assessmentBankRef !== "server:assessments/" + page.pageId) context.addIssue({ code: "custom", path: ["pages", index, "assessmentIds"], message: "assessmentBankRef must resolve for assessed page" });
    if (manifestPage && page.assessmentIds.length === 0 && manifestPage.assessmentBankRef !== undefined) context.addIssue({ code: "custom", path: ["pages", index, "assessmentIds"], message: "assessmentBankRef must be absent for an unassessed page" });
    page.visualIds.forEach((id) => {
      if (!visualIds.has(id)) context.addIssue({ code: "custom", path: ["pages", index, "visualIds"], message: "visual reference must resolve" });
      referencedVisualIds.add(id);
    });
    page.assessmentIds.forEach((id) => {
      if (!assessmentIds.has(id)) context.addIssue({ code: "custom", path: ["pages", index, "assessmentIds"], message: "assessment reference must resolve" });
      referencedAssessmentIds.add(id);
    });
    const semanticVisualIds = new Set<string>();
    const visitNodes = (nodes: SemanticNode[]) => nodes.forEach((node) => {
      if (node.type === "visual") semanticVisualIds.add(node.visualId);
      if ("children" in node) visitNodes(node.children);
    });
    visitNodes(page.body);
    semanticVisualIds.forEach((id) => {
      if (!page.visualIds.includes(id)) context.addIssue({ code: "custom", path: ["pages", index, "body"], message: "semantic visual must be declared by page" });
    });
    page.visualIds.forEach((id) => {
      if (!semanticVisualIds.has(id)) context.addIssue({ code: "custom", path: ["pages", index, "visualIds"], message: "declared page visual must be used by a semantic visual node" });
    });
  });
  manifestPageIds.forEach((pageId) => {
    if (!bodyIds.has(pageId)) context.addIssue({ code: "custom", path: ["pages"], message: "every manifest page must have one server page body" });
  });
  visualIds.forEach((id) => {
    if (!referencedVisualIds.has(id)) context.addIssue({ code: "custom", path: ["visuals"], message: "orphan visual: " + id });
  });
  assessmentIds.forEach((id) => {
    if (!referencedAssessmentIds.has(id)) context.addIssue({ code: "custom", path: ["assessments"], message: "orphan assessment: " + id });
  });
});

export const GlobalCourseIndexSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  generatedAt: IsoDateTimeSchema,
  courses: z.array(z.strictObject({
    id: StableIdSchema,
    title: NonEmptyTextSchema,
    description: NonEmptyTextSchema,
    visibility: ReleaseVisibilitySchema,
    units: z.array(z.strictObject({
      id: StableIdSchema,
      title: NonEmptyTextSchema,
      visibility: ReleaseVisibilitySchema,
      pages: z.array(z.strictObject({
        id: StableIdSchema,
        route: RouteSchema,
        title: NonEmptyTextSchema,
        summary: NonEmptyTextSchema,
        visibility: ReleaseVisibilitySchema,
        sequenceRole: z.enum(["core", "support"]),
      })),
    })),
  })),
  assessments: z.array(z.strictObject({
    id: StableIdSchema,
    pageId: StableIdSchema,
    responseKind: ResponseKindSchema,
    visibility: ReleaseVisibilitySchema,
  })),
});

export const ServerPageBodySchema = AuthoredPageBodySchema;
export const ServerAssessmentBankSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  pageId: StableIdSchema,
  assessments: z.array(ServerAssessmentSchema),
});

export const PerformanceBudgetManifestSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  units: z.literal("gzip-bytes"),
  accounting: z.strictObject({
    routeJavaScript: z.literal("sum-unique-transitive-initial-js-chunks"),
    visualizationRuntime: z.literal("sum-visualization-js-first-request"),
    hydration: z.literal("utf8-bytes-initial-rsc-flight-payload"),
    compression: z.literal("gzip-level-9"),
    cacheModel: z.literal("cold-navigation-empty-cache"),
  }),
  categories: z.strictObject({
    nonVisual: z.strictObject({ routeJsMax: z.number().int().positive(), visualizationRuntimeMax: z.literal(0), hydrationMax: z.number().int().nonnegative() }),
    staticVisual: z.strictObject({ routeJsMax: z.number().int().positive(), initialVisualizationRuntimeMax: z.literal(0), hydrationMax: z.number().int().nonnegative() }),
    lightweightInteractive: z.strictObject({ routeJsMax: z.number().int().positive(), visualizationRuntimeMax: z.number().int().max(30720), hydrationMax: z.number().int().positive() }),
  }),
  perPageHydrationMax: z.number().int().positive(),
  heavyAdapters: z.array(z.strictObject({
    capabilityId: StableIdSchema,
    chunkMax: z.number().int().positive(),
    initialLoadAllowed: z.literal(false),
    activation: z.enum(["route-lazy", "explicit-exploration"]),
    isolatedChunk: z.literal(true),
  })),
});

export const RoutePerformanceMeasurementSchema = z.strictObject({
  route: RouteSchema,
  category: z.enum(["nonVisual", "staticVisual", "lightweightInteractive"]),
  routeJsGzipBytes: z.number().int().nonnegative(),
  visualizationRuntimeGzipBytes: z.number().int().nonnegative(),
  hydrationBytes: z.number().int().nonnegative(),
  heavyAdapters: z.array(z.strictObject({
    capabilityId: StableIdSchema,
    gzipBytes: z.number().int().nonnegative(),
    initialRequest: z.boolean(),
    isolatedChunk: z.boolean(),
  })),
});

export function assertRoutePerformanceWithinBudget(measurementInput: unknown, budgetInput: unknown) {
  const measurement = RoutePerformanceMeasurementSchema.parse(measurementInput);
  const budgets = PerformanceBudgetManifestSchema.parse(budgetInput);
  const category = measurement.category === "nonVisual"
    ? budgets.categories.nonVisual
    : measurement.category === "staticVisual"
      ? budgets.categories.staticVisual
      : budgets.categories.lightweightInteractive;
  const visualizationLimit = measurement.category === "staticVisual"
    ? budgets.categories.staticVisual.initialVisualizationRuntimeMax
    : measurement.category === "nonVisual"
      ? budgets.categories.nonVisual.visualizationRuntimeMax
      : budgets.categories.lightweightInteractive.visualizationRuntimeMax;
  if (measurement.routeJsGzipBytes > category.routeJsMax) throw new Error("route JavaScript budget exceeded");
  if (measurement.visualizationRuntimeGzipBytes > visualizationLimit) throw new Error("visualization runtime budget exceeded");
  if (measurement.hydrationBytes > category.hydrationMax || measurement.hydrationBytes > budgets.perPageHydrationMax) throw new Error("hydration budget exceeded");
  for (const adapter of measurement.heavyAdapters) {
    const budget = budgets.heavyAdapters.find((candidate) => candidate.capabilityId === adapter.capabilityId);
    if (!budget) throw new Error("unbudgeted heavy adapter: " + adapter.capabilityId);
    if (adapter.gzipBytes > budget.chunkMax || adapter.initialRequest || !adapter.isolatedChunk) throw new Error("heavy adapter isolation or size budget exceeded: " + adapter.capabilityId);
  }
  return measurement;
}

const RendererCapabilitySchema = z.strictObject({
  id: StableIdSchema,
  implementationStatus: z.enum(["implemented", "planned", "reserved"]),
  sceneKinds: z.array(VisualSpecSchema.shape.sceneKind),
  modes: z.array(VisualSpecSchema.shape.renderingMode),
  loading: z.enum(["server-static", "route-lazy", "explicit-exploration", "unavailable"]),
  maximumGzipBytes: z.number().int().nonnegative(),
  supportsKeyboard: z.boolean(),
  supportsReducedMotion: z.boolean(),
  supportsPrintFallback: z.boolean(),
});

export const RendererCapabilityManifestSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  failurePolicy: z.literal("reject-ingestion"),
  fallbackPolicy: z.literal("no-silent-degradation"),
  capabilities: z.array(RendererCapabilitySchema).min(1),
});

export function assertVisualSpecSupported(input: unknown, manifestInput: unknown) {
  const spec = VisualSpecSchema.parse(input);
  const manifest = RendererCapabilityManifestSchema.parse(manifestInput);
  const capability = manifest.capabilities.find((candidate) => candidate.id === spec.rendererCapability);
  if (!capability || capability.implementationStatus !== "implemented") {
    throw new Error("Unsupported renderer capability: " + spec.rendererCapability);
  }
  if (!capability.sceneKinds.includes(spec.sceneKind) || !capability.modes.includes(spec.renderingMode)) {
    throw new Error("Renderer capability " + capability.id + " does not support " + spec.sceneKind + "/" + spec.renderingMode);
  }
  if (!capability.supportsPrintFallback || !capability.supportsReducedMotion) {
    throw new Error("Renderer capability " + capability.id + " lacks mandatory print or reduced-motion support");
  }
  if (spec.renderingMode === "interactive" && !capability.supportsKeyboard) {
    throw new Error("Interactive renderer capability " + capability.id + " lacks keyboard support");
  }
  return spec;
}

export const RouteCollisionPolicySchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  duplicateSlugPolicy: z.literal("reject"),
  autoSuffixAllowed: z.literal(false),
  duplicateSearchIntentPolicy: z.literal("editorial-decision-required"),
  existingIntentDecisions: z.array(z.strictObject({
    intent: StableIdSchema,
    existingRoutes: z.array(RouteSchema).min(1),
    decision: z.enum(["reuse-existing", "replace-after-redirect-plan", "differentiate-editorially", "blocked"]),
    notes: NonEmptyTextSchema,
  })),
});

export function assertNoRouteOrIntentCollisions(
  candidates: Array<{ route: string; intent: string }>,
  existingRoutes: string[],
  policyInput: unknown,
) {
  const policy = RouteCollisionPolicySchema.parse(policyInput);
  const seenRoutes = new Set<string>();
  const seenIntents = new Set<string>();
  const publicRoutes = new Set(existingRoutes);
  for (const candidate of candidates) {
    const route = RouteSchema.parse(candidate.route);
    const intent = StableIdSchema.parse(candidate.intent);
    if (seenRoutes.has(route) || publicRoutes.has(route)) throw new Error("Route collision: " + route);
    if (seenIntents.has(intent)) throw new Error("Search-intent collision: " + intent);
    const existingDecision = policy.existingIntentDecisions.find((decision) => decision.intent === intent);
    if (existingDecision && existingDecision.decision !== "differentiate-editorially") {
      throw new Error("Existing search intent requires an editorial decision: " + intent);
    }
    seenRoutes.add(route);
    seenIntents.add(intent);
  }
  return candidates;
}

export const VerificationPlanSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  command: z.literal("corepack pnpm verify:textbook"),
  gates: z.array(z.strictObject({
    id: StableIdSchema,
    required: z.literal(true),
    phase: StableIdSchema,
    status: z.enum(["runnable", "planned"]),
  })).min(1),
});

export const ImplementationStatusSchema = z.strictObject({
  contractVersion: ContractVersionSchema,
  gates: z.record(StableIdSchema, z.enum(["planned", "implemented"])),
});

const BaselineRouteSchema = z.strictObject({
  route: RouteSchema,
  status: z.number().int(),
  title: NonEmptyTextSchema,
  description: z.string(),
  canonical: z.string().url(),
  robots: NonEmptyTextSchema,
  analytics: z.boolean(),
  sitemap: z.boolean(),
  htmlSha256: Sha256Schema,
});

export const GoldenBaselineSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"),
  capturedAt: IsoDateTimeSchema,
  productionBaseUrl: z.string().url(),
  source: z.strictObject({
    commit: z.string().regex(/^[a-f0-9]{40}$/),
    tree: z.string().regex(/^[a-f0-9]{40}$/),
    branch: NonEmptyTextSchema,
    originMain: z.string().regex(/^[a-f0-9]{40}$/),
    clean: z.literal(true),
    canonicalRepository: NonEmptyTextSchema,
    sourceInputsMatchCommit: z.literal(true),
  }),
  routes: z.strictObject({
    public: z.array(BaselineRouteSchema).min(1),
    redirects: z.array(z.strictObject({
      source: RouteSchema,
      expectedDestination: RouteSchema,
      status: z.number().int(),
      observedLocation: NonEmptyTextSchema,
    })),
    notFound: z.strictObject({ route: RouteSchema, status: z.literal(404) }),
  }),
  limits: z.strictObject({
    routes: z.array(RouteSchema),
    importedRoutes: z.array(RouteSchema),
    coreSequence: z.array(RouteSchema),
    supportSequence: z.array(RouteSchema),
    checks: z.array(z.strictObject({
      id: StableIdSchema,
      route: RouteSchema,
      answerKind: NonEmptyTextSchema,
      promptSha256: Sha256Schema,
      hintSha256: Sha256Schema,
      answerSha256: Sha256Schema,
      feedbackSha256: Sha256Schema,
      publicContractSha256: Sha256Schema,
      serverContractSha256: Sha256Schema,
      attemptRequiredBeforeReveal: z.boolean(),
    })),
    graphIds: z.array(StableIdSchema),
    graphs: z.array(z.strictObject({ id: StableIdSchema, routes: z.array(RouteSchema).min(1) })),
    semanticNodes: z.array(z.strictObject({
      id: NonEmptyTextSchema,
      route: RouteSchema,
      sourceLocator: NonEmptyTextSchema,
      type: NonEmptyTextSchema,
      contentSha256: Sha256Schema,
    })),
    answerKeyRoutes: z.array(z.strictObject({
      route: RouteSchema,
      exam: z.enum(["A", "B"]),
      answerCount: z.number().int().positive(),
      answersSha256: Sha256Schema,
    })),
  }),
  discoverability: z.strictObject({
    registryCount: z.number().int(),
    searchRecordCount: z.number().int(),
    searchKindCounts: z.record(z.string(), z.number().int()),
    searchRecords: z.array(z.strictObject({
      id: NonEmptyTextSchema,
      kind: NonEmptyTextSchema,
      path: NonEmptyTextSchema,
      priority: z.number(),
      contentSha256: Sha256Schema,
    })),
    sitemap: z.strictObject({ url: z.string().url(), status: z.number().int(), count: z.number().int(), sha256: Sha256Schema }),
    robotsTxt: z.strictObject({ url: z.string().url(), status: z.number().int(), sha256: Sha256Schema, sitemapDeclared: z.boolean() }),
    analytics: z.strictObject({
      scriptUrl: z.string().url(),
      websiteId: NonEmptyTextSchema,
      domains: NonEmptyTextSchema,
      doNotTrack: z.literal(true),
      excludeSearch: z.literal(true),
    }),
  }),
  assets: z.strictObject({
    client: z.array(z.strictObject({
      path: NonEmptyTextSchema,
      bytes: z.number().int().nonnegative(),
      gzipBytes: z.number().int().nonnegative(),
      sha256: Sha256Schema,
    })),
    totals: z.strictObject({ bytes: z.number().int().nonnegative(), gzipBytes: z.number().int().nonnegative() }),
    answerLeakScan: z.strictObject({
      scannedFiles: z.number().int().nonnegative(),
      forbiddenMatches: z.literal(0),
      forbiddenTerms: z.array(NonEmptyTextSchema),
      secretValuesScanned: z.number().int().nonnegative(),
      shortValuesExcluded: z.number().int().nonnegative(),
      publicCollisionValuesExcluded: z.number().int().nonnegative(),
      genericCollisionValuesExcluded: z.number().int().nonnegative(),
      scannedTargets: z.array(NonEmptyTextSchema),
    }),
  }),
  print: z.strictObject({
    source: NonEmptyTextSchema,
    compiler: NonEmptyTextSchema,
    pages: z.number().int().positive(),
    pdfBytes: z.number().int().positive(),
    pdfSha256: Sha256Schema,
    logSha256: Sha256Schema,
    fatalErrors: z.literal(0),
    warnings: z.array(NonEmptyTextSchema),
  }),
  screenshots: z.array(z.strictObject({
    route: RouteSchema,
    viewport: z.enum(["desktop", "mobile"]),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    path: NonEmptyTextSchema,
    bytes: z.number().int().positive(),
    sha256: Sha256Schema,
  })),
  verification: z.strictObject({
    existingTestCount: z.number().int().nonnegative(),
    existingTestsPassed: z.literal(true),
    existingTestLogSha256: Sha256Schema,
    buildPagesPassed: z.literal(true),
    buildLogSha256: Sha256Schema,
    routeCount: z.number().int().positive(),
    limitsRouteCount: z.number().int().positive(),
    graphCount: z.number().int().positive(),
    screenshotCount: z.number().int().positive(),
  }),
});

export type Course = z.infer<typeof CourseSchema>;
export type Unit = z.infer<typeof UnitSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Page = z.infer<typeof PageSchema>;
export type VisualSpec = z.infer<typeof VisualSpecSchema>;
export type ServerAssessment = z.infer<typeof ServerAssessmentSchema>;
export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;
