import type { Problem } from "./content";

/**
 * Conservative publication-time duplicate checks. These flag candidates for
 * editorial review; they never auto-merge or auto-publish mathematical pages.
 */
export function canonicalizeStatement(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[?!.,:;|]/g, " ")
    .replace(/\bwhat is\b|\bfind\b|\bcalculate\b|\bsolve\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function canonicalizeExpression(value: string) {
  const variables = new Map<string, string>();
  let index = 0;
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[a-z]/g, (variable) => {
      if (!variables.has(variable)) variables.set(variable, `v${index++}`);
      return variables.get(variable)!;
    });
}

export type DuplicateSignal = {
  candidateId: string;
  reason: "exact-text" | "canonical-intent" | "variable-renaming" | "same-answer";
};

export function findDuplicateSignals(candidate: Problem, existing: Problem[]): DuplicateSignal[] {
  const signals: DuplicateSignal[] = [];
  for (const problem of existing) {
    if (problem.problem_id === candidate.problem_id) continue;
    if (problem.canonical_statement === candidate.canonical_statement) {
      signals.push({ candidateId: problem.problem_id, reason: "exact-text" });
    } else if (canonicalizeStatement(problem.canonical_statement) === canonicalizeStatement(candidate.canonical_statement)) {
      signals.push({ candidateId: problem.problem_id, reason: "canonical-intent" });
    }
    if (canonicalizeExpression(problem.canonical_expression) === canonicalizeExpression(candidate.canonical_expression)) {
      signals.push({ candidateId: problem.problem_id, reason: "variable-renaming" });
    }
    if (problem.answer === candidate.answer && problem.topic === candidate.topic) {
      signals.push({ candidateId: problem.problem_id, reason: "same-answer" });
    }
  }
  return signals;
}
