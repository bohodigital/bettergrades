export type AlgebraResult = {
  status: "correct" | "incorrect" | "simplified" | "evaluated" | "uncertain" | "error";
  title: string;
  message: string;
  latex?: string;
  secondaryLatex?: string;
  normalizedLatex?: string;
};

export function normalizeCalculatorInput(value: unknown): string;
export function parseVariableAssignments(value: unknown): { assignments: Record<string, number>; error?: never } | { error: string; assignments?: never };
export function simplifyAlgebraExpression(value: unknown): Promise<AlgebraResult>;
export function compareAlgebraExpressions(leftValue: unknown, rightValue: unknown): Promise<AlgebraResult>;
export function evaluateAlgebraExpression(value: unknown, assignmentSource: unknown): Promise<AlgebraResult>;
