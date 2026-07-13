export type AlgebraResultStatus = "correct" | "incorrect" | "uncertain" | "simplified" | "evaluated" | "error";

export type AlgebraResult = {
  status: AlgebraResultStatus;
  title: string;
  message: string;
  latex?: string;
  secondaryLatex?: string;
  normalizedLatex?: string;
};

export function normalizeCalculatorInput(value: string): string;
export function simplifyAlgebraExpression(value: string): Promise<AlgebraResult>;
export function compareAlgebraExpressions(leftValue: string, rightValue: string): Promise<AlgebraResult>;
export function parseVariableAssignments(value: string): { assignments?: Record<string, number>; error?: string };
export function evaluateAlgebraExpression(value: string, assignmentSource: string): Promise<AlgebraResult>;
