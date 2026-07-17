import { validateNumericAst, type NumericAst } from "../ast/schema.ts";
import {
  inferRequiredCapabilities,
  resolveRenderer,
  type RendererRegistry,
} from "../capabilities/index.ts";
import {
  CompiledSceneSchema,
  DEFAULT_PERFORMANCE_HINTS,
  VisualSpecSchema,
  type CompiledScene,
  type VisualSpec,
} from "../schema/index.ts";
import type { ExpressionSourceContext } from "../ast/mathjson-boundary.server.ts";

export type BuildExpressionCompiler = (context: ExpressionSourceContext) => NumericAst;

export type CompileVisualOptions = {
  compileLatex?: BuildExpressionCompiler;
  rendererRegistry?: RendererRegistry;
};

export class VisualCompileError extends Error {
  readonly code: string;
  readonly visualId?: string;
  readonly layerId?: string;

  constructor(code: string, message: string, visualId?: string, layerId?: string) {
    super(message);
    this.name = "VisualCompileError";
    this.code = code;
    this.visualId = visualId;
    this.layerId = layerId;
  }
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`)
    .join(",")}}`;
}

function fingerprint(value: unknown): string {
  const source = stableJson(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `bvlp1-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  }
  return value;
}

function compileLayerExpressions(
  value: unknown,
  context: Omit<ExpressionSourceContext, "expressionLatex">,
  spec: VisualSpec,
  options: CompileVisualOptions,
): unknown {
  if (Array.isArray(value)) {
    return value.map((child) => compileLayerExpressions(child, context, spec, options));
  }
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  if (record.format === "ast" && record.ast !== undefined) {
    return validateNumericAst(record.ast, {
      maxDepth: spec.performance?.maxAstDepth ?? DEFAULT_PERFORMANCE_HINTS.maxAstDepth,
      maxNodes: spec.performance?.maxAstNodes ?? DEFAULT_PERFORMANCE_HINTS.maxAstNodes,
      maxOperations: spec.performance?.maxOperationsPerEvaluation ?? DEFAULT_PERFORMANCE_HINTS.maxOperationsPerEvaluation,
      allowedVariables: [
        ...spec.coordinateSpace.variables,
        ...spec.controls.flatMap((control) =>
          "parameter" in control ? [control.parameter] : [],
        ),
      ],
    });
  }
  if (record.format === "latex" && typeof record.expressionLatex === "string") {
    if (!options.compileLatex) {
      throw new VisualCompileError(
        "missing-build-expression-compiler",
        `Visual ${spec.id}, layer ${context.layerId}, route ${context.route}, source ${context.sourceFile} contains authored LaTeX but no build-only CortexJS/MathJSON compiler was supplied.`,
        spec.id,
        context.layerId,
      );
    }
    return options.compileLatex({ ...context, expressionLatex: record.expressionLatex });
  }
  return Object.fromEntries(
    Object.entries(record).map(([key, child]) => [
      key,
      compileLayerExpressions(child, context, spec, options),
    ]),
  );
}

function parseSpec(input: unknown): VisualSpec {
  const result = VisualSpecSchema.safeParse(input);
  if (!result.success) {
    const id = input && typeof input === "object" && "id" in input
      ? String((input as { id?: unknown }).id)
      : undefined;
    throw new VisualCompileError(
      "invalid-visual-spec",
      `VisualSpec${id ? ` ${id}` : ""} failed validation: ${result.error.message}`,
      id,
    );
  }
  return result.data;
}

export function compileVisualSpec(
  input: unknown,
  options: CompileVisualOptions = {},
): CompiledScene {
  const spec = parseSpec(input);
  const inferred = inferRequiredCapabilities(spec);
  const declared = new Set(spec.requiredCapabilities);
  const missing = inferred.filter((capability) => !declared.has(capability));
  if (missing.length) {
    throw new VisualCompileError(
      "undeclared-capabilities",
      `Visual ${spec.id} must explicitly declare inferred capabilities: ${missing.join(", ")}.`,
      spec.id,
    );
  }

  const renderer = resolveRenderer(
    {
      visualId: spec.id,
      kind: spec.kind,
      requiredCapabilities: spec.requiredCapabilities,
      source: { route: spec.provenance.route, sourceFile: spec.provenance.sourceFile },
    },
    options.rendererRegistry,
  );
  const defaultPerformance = { ...DEFAULT_PERFORMANCE_HINTS };
  const hydration = renderer.id === "static-svg"
    ? "none"
    : renderer.activation === "explicit-user-action"
      ? "explicit-user-action"
      : spec.performance?.activation === "explicit-user-action"
        ? "explicit-user-action"
        : "near-viewport";
  const performance = {
    ...defaultPerformance,
    ...spec.performance,
    activation: hydration,
  };
  const layers = spec.layers.map((layer) => ({
    ...layer,
    geometry: compileLayerExpressions(
      layer.geometry,
      {
        route: spec.provenance.route,
        sourceFile: spec.provenance.sourceFile,
        visualId: spec.id,
        layerId: layer.id,
      },
      spec,
      options,
    ),
  }));

  const candidate = {
    compiledSceneVersion: 1,
    sourceSpecVersion: spec.schemaVersion,
    id: spec.id,
    kind: spec.kind,
    title: spec.title,
    caption: spec.caption,
    learningPurpose: spec.learningPurpose,
    longDescription: spec.longDescription,
    coordinateSpace: spec.coordinateSpace,
    viewport: spec.viewport,
    axes: spec.axes,
    panels: spec.panels,
    layers,
    controls: spec.controls,
    accessibility: spec.accessibility,
    print: spec.print,
    performance,
    requiredCapabilities: [...spec.requiredCapabilities].sort(),
    selectedRenderer: renderer.id,
    staticFallback: { required: true, rendererId: "static-svg" },
    delivery: { hydration, publicFieldsOnly: true },
    provenance: {
      route: spec.provenance.route,
      sourceFile: spec.provenance.sourceFile,
      sourceVisualId: spec.id,
      sourceFingerprint: fingerprint(spec),
      compilerVersion: "bvlp-compiler-v1",
      visibility: spec.provenance.visibility,
    },
  };
  const compiled = CompiledSceneSchema.safeParse(candidate);
  if (!compiled.success) {
    throw new VisualCompileError(
      "invalid-compiled-scene",
      `Compiler produced an invalid CompiledScene for ${spec.id}: ${compiled.error.message}`,
      spec.id,
    );
  }
  return deepFreeze(compiled.data);
}

export function compileVisualSpecs(
  inputs: readonly unknown[],
  options: CompileVisualOptions = {},
): readonly CompiledScene[] {
  const seen = new Set<string>();
  const scenes: CompiledScene[] = [];
  for (const input of inputs) {
    const scene = compileVisualSpec(input, options);
    if (seen.has(scene.id)) {
      throw new VisualCompileError(
        "duplicate-visual-id",
        `Visual ID ${scene.id} is duplicated in the compilation unit.`,
        scene.id,
      );
    }
    seen.add(scene.id);
    scenes.push(scene);
  }
  return Object.freeze(scenes);
}
