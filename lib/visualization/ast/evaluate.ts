import {
  AstValidationError,
  DEFAULT_AST_LIMITS,
  validateNumericAst,
  type AstLimits,
  type NumericAst,
} from "./schema.ts";

export type EvaluationOptions = AstLimits & {
  signal?: AbortSignal;
};

export class AstEvaluationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AstEvaluationError";
    this.code = code;
  }
}

function asBoolean(value: number | boolean): boolean {
  return typeof value === "boolean" ? value : value !== 0 && !Number.isNaN(value);
}

function asNumber(value: number | boolean): number {
  return typeof value === "boolean" ? (value ? 1 : 0) : value;
}

export function evaluateAst(
  ast: NumericAst,
  variables: Readonly<Record<string, number>>,
  options: EvaluationOptions = {},
): number | boolean {
  const limits = { ...DEFAULT_AST_LIMITS, ...options };
  validateNumericAst(ast, {
    ...limits,
    allowedVariables: Object.keys(variables),
  });
  let operations = 0;

  const visit = (node: NumericAst, depth: number): number | boolean => {
    if (options.signal?.aborted) {
      throw new AstEvaluationError("aborted", "Expression evaluation was aborted.");
    }
    operations += 1;
    if (operations > limits.maxOperations) {
      throw new AstEvaluationError(
        "operation-budget",
        `Evaluation exceeded ${limits.maxOperations} operations.`,
      );
    }
    if (depth > limits.maxDepth) {
      throw new AstEvaluationError("depth-budget", "Evaluation depth limit exceeded.");
    }

    if (node.type === "number") return node.value;
    if (node.type === "variable") {
      const value = variables[node.name];
      if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new AstEvaluationError(
          "missing-variable",
          `Variable ${node.name} does not have a finite numeric value.`,
        );
      }
      return value;
    }
    if (node.type === "piecewise") {
      for (const branch of node.branches) {
        if (asBoolean(visit(branch.when, depth + 1))) {
          return visit(branch.then, depth + 1);
        }
      }
      if (node.otherwise) return visit(node.otherwise, depth + 1);
      return Number.NaN;
    }
    if ("operand" in node) {
      const value = asNumber(visit(node.operand, depth + 1));
      switch (node.type) {
        case "negate":
          return -value;
        case "abs":
          return Math.abs(value);
        case "sqrt":
          return value < 0 ? Number.NaN : Math.sqrt(value);
        case "exp":
          return Math.exp(value);
        case "ln":
          return value <= 0 ? Number.NaN : Math.log(value);
        case "log10":
          return value <= 0 ? Number.NaN : Math.log10(value);
        case "sin":
          return Math.sin(value);
        case "cos":
          return Math.cos(value);
        case "tan":
          return Math.tan(value);
        case "asin":
          return value < -1 || value > 1 ? Number.NaN : Math.asin(value);
        case "acos":
          return value < -1 || value > 1 ? Number.NaN : Math.acos(value);
        case "atan":
          return Math.atan(value);
      }
    }

    const left = visit(node.left, depth + 1);
    const right = visit(node.right, depth + 1);
    const a = asNumber(left);
    const b = asNumber(right);
    switch (node.type) {
      case "add":
        return a + b;
      case "subtract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        return b === 0 ? Number.NaN : a / b;
      case "power": {
        const result = Math.pow(a, b);
        return Number.isFinite(result) ? result : Number.NaN;
      }
      case "min":
        return Math.min(a, b);
      case "max":
        return Math.max(a, b);
      case "lt":
        return a < b;
      case "lte":
        return a <= b;
      case "gt":
        return a > b;
      case "gte":
        return a >= b;
      case "eq":
        return Object.is(a, b);
      case "neq":
        return !Object.is(a, b);
      case "and":
        return asBoolean(left) && asBoolean(right);
      case "or":
        return asBoolean(left) || asBoolean(right);
    }
  };

  try {
    return visit(ast, 1);
  } catch (error) {
    if (error instanceof AstValidationError || error instanceof AstEvaluationError) {
      throw error;
    }
    throw new AstEvaluationError("evaluation-failed", String(error));
  }
}

export function evaluateNumericAst(
  ast: NumericAst,
  variables: Readonly<Record<string, number>>,
  options: EvaluationOptions = {},
): number {
  const value = evaluateAst(ast, variables, options);
  return asNumber(value);
}
