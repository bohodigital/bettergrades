import {
  DEFAULT_AST_LIMITS,
  validateNumericAst,
  type AstValidationOptions,
  type NumericAst,
} from "./schema.ts";

export type ExpressionSourceContext = {
  route: string;
  sourceFile: string;
  visualId: string;
  layerId: string;
  expressionLatex: string;
};

export type ComputeEngineBoundary = {
  parseLatexToMathJson(expressionLatex: string): unknown;
};

export class ExpressionCompileError extends Error {
  readonly code: string;
  readonly context: ExpressionSourceContext;

  constructor(code: string, message: string, context: ExpressionSourceContext) {
    super(
      `${message} [route=${context.route}; source=${context.sourceFile}; visual=${context.visualId}; layer=${context.layerId}; expression=${JSON.stringify(context.expressionLatex)}]`,
    );
    this.name = "ExpressionCompileError";
    this.code = code;
    this.context = context;
  }
}

type NormalizeContext = {
  allowedVariables: ReadonlySet<string>;
  source: ExpressionSourceContext;
};

const UNARY_HEADS: Readonly<Record<string, NumericAst["type"]>> = Object.freeze({
  Negate: "negate",
  Abs: "abs",
  Sqrt: "sqrt",
  Exp: "exp",
  Ln: "ln",
  Log: "log10",
  Sin: "sin",
  Cos: "cos",
  Tan: "tan",
  Arcsin: "asin",
  Arccos: "acos",
  Arctan: "atan",
});

const BINARY_HEADS = Object.freeze({
  Subtract: "subtract",
  Divide: "divide",
  Power: "power",
  Min: "min",
  Max: "max",
  Less: "lt",
  LessEqual: "lte",
  Greater: "gt",
  GreaterEqual: "gte",
  Equal: "eq",
  NotEqual: "neq",
  And: "and",
  Or: "or",
} as const);

function fold(
  type: "add" | "multiply",
  values: readonly unknown[],
  context: NormalizeContext,
): NumericAst {
  if (values.length < 2) {
    throw new ExpressionCompileError(
      "invalid-arity",
      `${type} requires at least two operands.`,
      context.source,
    );
  }
  const normalized = values.map((value) => normalizeMathJson(value, context));
  return normalized.slice(1).reduce<NumericAst>(
    (left, right) => ({ type, left, right }),
    normalized[0],
  );
}

function normalizeMathJson(value: unknown, context: NormalizeContext): NumericAst {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { type: "number", value };
  }
  if (typeof value === "string") {
    if (!context.allowedVariables.has(value)) {
      throw new ExpressionCompileError(
        "unknown-symbol",
        `Symbol ${value} is not in the expression variable allowlist.`,
        context.source,
      );
    }
    return { type: "variable", name: value };
  }
  if (!Array.isArray(value) || typeof value[0] !== "string") {
    throw new ExpressionCompileError(
      "unsupported-mathjson",
      "MathJSON must be a finite number, an allowlisted symbol, or an allowlisted function array.",
      context.source,
    );
  }

  const [head, ...args] = value;
  if (head === "Add" || head === "Multiply") {
    return fold(head === "Add" ? "add" : "multiply", args, context);
  }
  const unary = UNARY_HEADS[head];
  if (unary) {
    if (args.length !== 1) {
      throw new ExpressionCompileError(
        "invalid-arity",
        `${head} requires exactly one operand.`,
        context.source,
      );
    }
    return {
      type: unary as Exclude<NumericAst["type"], "number" | "variable" | "piecewise">,
      operand: normalizeMathJson(args[0], context),
    } as NumericAst;
  }
  const binary = BINARY_HEADS[head as keyof typeof BINARY_HEADS];
  if (binary) {
    if (args.length !== 2) {
      throw new ExpressionCompileError(
        "invalid-arity",
        `${head} requires exactly two operands.`,
        context.source,
      );
    }
    return {
      type: binary,
      left: normalizeMathJson(args[0], context),
      right: normalizeMathJson(args[1], context),
    };
  }
  if (head === "Piecewise") {
    if (args.length < 1 || args.length > 33) {
      throw new ExpressionCompileError(
        "invalid-arity",
        "Piecewise requires one to 32 branches and an optional otherwise value.",
        context.source,
      );
    }
    const branchValues = args[0];
    if (!Array.isArray(branchValues)) {
      throw new ExpressionCompileError(
        "invalid-piecewise",
        "Piecewise branches must be an array of [value, condition] pairs.",
        context.source,
      );
    }
    const branches = branchValues.map((branch) => {
      if (!Array.isArray(branch) || branch.length !== 2) {
        throw new ExpressionCompileError(
          "invalid-piecewise",
          "Each piecewise branch must be [value, condition].",
          context.source,
        );
      }
      return {
        when: normalizeMathJson(branch[1], context),
        then: normalizeMathJson(branch[0], context),
      };
    });
    return {
      type: "piecewise",
      branches,
      ...(args.length > 1
        ? { otherwise: normalizeMathJson(args[1], context) }
        : {}),
    };
  }

  throw new ExpressionCompileError(
    "unknown-operator",
    `MathJSON operator ${head} is not allowlisted.`,
    context.source,
  );
}

export function createBuildOnlyLatexCompiler(
  boundary: ComputeEngineBoundary,
  options: AstValidationOptions = {},
): (context: ExpressionSourceContext) => NumericAst {
  return (context) => {
    const maxLength = options.maxExpressionLength ?? DEFAULT_AST_LIMITS.maxExpressionLength;
    if (!context.expressionLatex.trim() || context.expressionLatex.length > maxLength) {
      throw new ExpressionCompileError(
        "expression-length",
        `Expression must contain 1 to ${maxLength} characters.`,
        context,
      );
    }
    try {
      const mathJson = boundary.parseLatexToMathJson(context.expressionLatex);
      const ast = normalizeMathJson(mathJson, {
        allowedVariables: new Set(options.allowedVariables ?? ["x"]),
        source: context,
      });
      return validateNumericAst(ast, options);
    } catch (error) {
      if (error instanceof ExpressionCompileError) throw error;
      throw new ExpressionCompileError(
        "compute-engine-parse",
        `CortexJS/MathJSON normalization failed: ${String(error)}`,
        context,
      );
    }
  };
}

/**
 * Loads CortexJS only from this explicit build/server boundary. Runtime
 * renderer entrypoints do not export or import this module.
 */
export async function createCortexJsLatexCompiler(
  options: AstValidationOptions = {},
): Promise<(context: ExpressionSourceContext) => NumericAst> {
  const { ComputeEngine } = await import("@cortex-js/compute-engine");
  const computeEngine = new ComputeEngine();
  return createBuildOnlyLatexCompiler(
    {
      parseLatexToMathJson(expressionLatex) {
        return computeEngine.parse(expressionLatex, { canonical: true }).json;
      },
    },
    options,
  );
}

export async function compileLatexExpressionBuildOnly(
  context: ExpressionSourceContext,
  options: AstValidationOptions = {},
): Promise<NumericAst> {
  const compiler = await createCortexJsLatexCompiler(options);
  return compiler(context);
}
