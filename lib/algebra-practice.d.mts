export type AlgebraPracticeProblem = Readonly<{
  id: string;
  topic: string;
  prompt: string;
  promptLatex: string;
  answerLatex: string;
  hint: string;
  explanation: string;
}>;

export const algebraPracticeProblems: readonly AlgebraPracticeProblem[];
export function looksLikeAlgebraExpression(query: string): boolean;
export function algebraCheckerHref(expression: string): string;
