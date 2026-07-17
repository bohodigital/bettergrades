import { compareAlgebraExpressions } from "../algebra-calculator.server.mjs";
import {
  isSufficientEpsilonDelta,
  normalizeLimitChoice,
  normalizeLimitExpression,
  numericLimitValue,
} from "./limits-unit-core.mjs";

// Canonical answers and symbolic comparison belong to the server-only grading
// path. The public unit parser and route index do not import this module.
export async function compareLimitAnswer(check, answer) {
  const attempted = String(answer ?? "").trim();
  if (!attempted) return { status: "empty", feedback: "Enter an answer before checking.", revealAllowed: false };
  let correct = false;
  if (check.answerType === "integer" || check.answerType === "rational") {
    const actual = numericLimitValue(attempted);
    const expected = numericLimitValue(check.canonicalAnswer);
    correct = actual !== null && expected !== null && Math.abs(actual - expected) <= 1e-12;
  } else if (check.answerType === "choice") {
    correct = normalizeLimitChoice(attempted) === normalizeLimitChoice(check.canonicalAnswer);
  } else if (check.answerType === "expression") {
    const actual = normalizeLimitExpression(attempted);
    const expected = normalizeLimitExpression(check.canonicalAnswer);
    if (actual === expected || isSufficientEpsilonDelta(check, attempted)) correct = true;
    else correct = (await compareAlgebraExpressions(expected, actual)).status === "correct";
  }
  return {
    status: correct ? "correct" : "incorrect",
    feedback: correct ? "Correct. Your answer is mathematically equivalent." : "Not yet. Use the hint, check the method, and try again.",
    revealAllowed: true,
  };
}
