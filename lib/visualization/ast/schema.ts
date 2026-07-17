import { z } from "zod";

export const DEFAULT_AST_LIMITS = Object.freeze({
  maxDepth: 24,
  maxNodes: 256,
  maxOperations: 2_048,
  maxExpressionLength: 2_048,
});

const SAFE_SYMBOL = /^[A-Za-z][A-Za-z0-9_]{0,31}$/;

const NumberNodeSchema = z
  .object({ type: z.literal("number"), value: z.number().finite() })
  .strict();
const VariableNodeSchema = z
  .object({ type: z.literal("variable"), name: z.string().regex(SAFE_SYMBOL) })
  .strict();

export const UnaryOperatorSchema = z.enum([
  "negate",
  "abs",
  "sqrt",
  "exp",
  "ln",
  "log10",
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
]);

export const BinaryOperatorSchema = z.enum([
  "add",
  "subtract",
  "multiply",
  "divide",
  "power",
  "min",
  "max",
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
  "and",
  "or",
]);

export type NumericAst =
  | z.infer<typeof NumberNodeSchema>
  | z.infer<typeof VariableNodeSchema>
  | {
      type: z.infer<typeof UnaryOperatorSchema>;
      operand: NumericAst;
    }
  | {
      type: z.infer<typeof BinaryOperatorSchema>;
      left: NumericAst;
      right: NumericAst;
    }
  | {
      type: "piecewise";
      branches: Array<{ when: NumericAst; then: NumericAst }>;
      otherwise?: NumericAst;
    };

const AstSchema: z.ZodType<NumericAst> = z.lazy(() =>
  z.union([
    NumberNodeSchema,
    VariableNodeSchema,
    z
      .object({ type: UnaryOperatorSchema, operand: AstSchema })
      .strict(),
    z
      .object({
        type: BinaryOperatorSchema,
        left: AstSchema,
        right: AstSchema,
      })
      .strict(),
    z
      .object({
        type: z.literal("piecewise"),
        branches: z
          .array(z.object({ when: AstSchema, then: AstSchema }).strict())
          .min(1)
          .max(32),
        otherwise: AstSchema.optional(),
      })
      .strict(),
  ]),
);

export const NumericAstSchema = AstSchema;

export type AstLimits = {
  maxDepth?: number;
  maxNodes?: number;
  maxOperations?: number;
  maxExpressionLength?: number;
};

export type AstValidationOptions = AstLimits & {
  allowedVariables?: ReadonlySet<string> | readonly string[];
};

export class AstValidationError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AstValidationError";
    this.code = code;
  }
}

function children(node: NumericAst): readonly NumericAst[] {
  if (node.type === "number" || node.type === "variable") return [];
  if (node.type === "piecewise") {
    return [
      ...node.branches.flatMap((branch) => [branch.when, branch.then]),
      ...(node.otherwise ? [node.otherwise] : []),
    ];
  }
  if ("operand" in node) return [node.operand];
  return [node.left, node.right];
}

export function validateNumericAst(
  input: unknown,
  options: AstValidationOptions = {},
): NumericAst {
  const parsed = NumericAstSchema.safeParse(input);
  if (!parsed.success) {
    throw new AstValidationError("invalid-node", parsed.error.message);
  }

  const limits = { ...DEFAULT_AST_LIMITS, ...options };
  const allowedVariables = options.allowedVariables
    ? new Set(options.allowedVariables)
    : undefined;
  let nodeCount = 0;
  const stack: Array<{ node: NumericAst; depth: number }> = [
    { node: parsed.data, depth: 1 },
  ];

  while (stack.length) {
    const current = stack.pop();
    if (!current) break;
    nodeCount += 1;
    if (nodeCount > limits.maxNodes) {
      throw new AstValidationError(
        "node-budget",
        `Expression contains more than ${limits.maxNodes} AST nodes.`,
      );
    }
    if (current.depth > limits.maxDepth) {
      throw new AstValidationError(
        "depth-budget",
        `Expression exceeds the maximum AST depth of ${limits.maxDepth}.`,
      );
    }
    if (
      current.node.type === "variable" &&
      allowedVariables &&
      !allowedVariables.has(current.node.name)
    ) {
      throw new AstValidationError(
        "unknown-variable",
        `Variable ${current.node.name} is not allowlisted for this scene.`,
      );
    }
    for (const child of children(current.node)) {
      stack.push({ node: child, depth: current.depth + 1 });
    }
  }

  return parsed.data;
}

export function countAstNodes(ast: NumericAst): number {
  let total = 0;
  const stack = [ast];
  while (stack.length) {
    const node = stack.pop();
    if (!node) break;
    total += 1;
    stack.push(...children(node));
  }
  return total;
}
