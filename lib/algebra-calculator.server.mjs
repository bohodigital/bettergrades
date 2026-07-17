import { ComputeEngine } from "@cortex-js/compute-engine";

import { hasNumericCounterexample } from "./algebra-equivalence.mjs";

// This module is a server-only trust boundary. Client components must call the
// bounded same-origin API instead of importing this module or Compute Engine.
export const MAX_ALGEBRA_EXPRESSION_LENGTH = 240;
export const MAX_ALGEBRA_ASSIGNMENTS_LENGTH = 80;

let engine;

function getEngine() {
  if (engine) return engine;
  const next = new ComputeEngine();
  next.precision = "machine";
  engine = next;
  return next;
}

export function normalizeCalculatorInput(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\s*(?:simplify|expand|factor|evaluate)\s*:?\s+/i, "")
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/");
}

function error(title, message) {
  return { status: "error", title, message };
}

function validateSource(value) {
  const normalized = normalizeCalculatorInput(value);
  if (!normalized) return { result: error("Nothing to check yet", "Type an expression first.") };
  if (normalized.length > MAX_ALGEBRA_EXPRESSION_LENGTH) {
    return { result: error("Keep this one smaller", `This release accepts expressions up to ${MAX_ALGEBRA_EXPRESSION_LENGTH} characters.`) };
  }
  return { normalized };
}

function parseWithChecks(ce, source) {
  const expression = ce.parse(source);
  if (expression.errors.length) {
    return { result: error("We could not read that", "Check the parentheses, fraction bars, operators, and exponents, then try again.") };
  }
  if (expression.unknowns.length > 3) {
    return { result: error("Too many variables for this pass", "Use no more than three variables while the checker is in its algebra-only release.") };
  }
  if (JSON.stringify(expression.json).length > 5_000) {
    return { result: error("That expression is too complex for this pass", "Break it into a smaller algebra step and check that first.") };
  }
  return { expression };
}

function prepareExpression(value) {
  const sourceCheck = validateSource(value);
  if (sourceCheck.result) return sourceCheck;
  const ce = getEngine();
  const parsed = parseWithChecks(ce, sourceCheck.normalized);
  return { ce, normalized: sourceCheck.normalized, ...parsed };
}

function engineLimitResult() {
  return error("The calculator did not start", "Your expression was not stored. Please try the bounded Better Grades calculator request again.");
}

export async function simplifyAlgebraExpression(value) {
  try {
    const prepared = prepareExpression(value);
    if (prepared.result) return prepared.result;
    const simplified = prepared.expression.simplify();
    return {
      status: "simplified",
      title: "Here is the simplified form",
      message: "The symbolic work ran in the bounded Better Grades calculator service. Check domain restrictions separately when denominators or even roots are involved.",
      latex: simplified.latex,
      normalizedLatex: prepared.expression.latex,
    };
  } catch {
    return engineLimitResult();
  }
}

export async function compareAlgebraExpressions(leftValue, rightValue) {
  try {
    const left = prepareExpression(leftValue);
    if (left.result) return left.result;
    const rightCheck = validateSource(rightValue);
    if (rightCheck.result) return error("Nothing to compare yet", "Enter the second expression before checking equivalence.");
    const right = parseWithChecks(left.ce, rightCheck.normalized);
    if (right.result) return { ...right.result, title: "We could not read the second expression" };

    const equality = left.expression.isEqual(right.expression);
    if (equality === true) {
      return {
        status: "correct",
        title: "These are equivalent",
        message: "The expressions have the same mathematical value, even though their forms may look different.",
        latex: right.expression.latex,
        normalizedLatex: left.expression.latex,
      };
    }
    if (equality === false || hasNumericCounterexample(left.expression, right.expression)) {
      return {
        status: "incorrect",
        title: "These are clearly different",
        message: "The checker found a mathematical difference, not merely a formatting difference.",
        normalizedLatex: left.expression.latex,
      };
    }
    return {
      status: "uncertain",
      title: "We could not prove this one",
      message: "The forms may still be equivalent. The checker refuses to call them different when it cannot establish a counterexample.",
      latex: right.expression.latex,
      normalizedLatex: left.expression.latex,
    };
  } catch {
    return engineLimitResult();
  }
}

function parseNumericValue(value) {
  const normalized = value.trim().replace(/[−–—]/g, "-");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function parseVariableAssignments(value) {
  const source = String(value ?? "").trim();
  if (source.length > MAX_ALGEBRA_ASSIGNMENTS_LENGTH) {
    return { error: `Use no more than ${MAX_ALGEBRA_ASSIGNMENTS_LENGTH} characters for variable values.` };
  }
  if (!source) return { assignments: {} };
  const assignments = {};
  for (const part of source.split(",")) {
    const match = part.match(/^\s*([a-z])\s*=\s*(.+?)\s*$/i);
    if (!match) return { error: "Use assignments like x=2 or x=2, y=-3.5." };
    const variable = match[1];
    if (Object.hasOwn(assignments, variable)) return { error: `Assign ${variable} only once.` };
    const number = parseNumericValue(match[2]);
    if (number === null) return { error: `Use a finite decimal or integer for ${variable}.` };
    assignments[variable] = number;
  }
  return { assignments };
}

export async function evaluateAlgebraExpression(value, assignmentSource) {
  try {
    const prepared = prepareExpression(value);
    if (prepared.result) return prepared.result;
    const parsedAssignments = parseVariableAssignments(assignmentSource);
    if (parsedAssignments.error) return error("Check the variable values", parsedAssignments.error);
    const missing = prepared.expression.unknowns.filter((symbol) => !Object.hasOwn(parsedAssignments.assignments, symbol));
    if (missing.length) {
      return error("Add the missing values", `Assign ${missing.join(", ")} before evaluating this expression.`);
    }

    const exact = prepared.expression.subs(parsedAssignments.assignments).simplify();
    const approximate = exact.N();
    if (exact.errors.length || approximate.errors.length || approximate.unknowns.length) {
      return error("That value is undefined here", "Try different variable values and check for zero denominators or invalid roots.");
    }
    return {
      status: "evaluated",
      title: "Value calculated",
      message: "The substitution and arithmetic ran in the bounded Better Grades calculator service.",
      latex: exact.latex,
      secondaryLatex: approximate.latex !== exact.latex ? approximate.latex : undefined,
      normalizedLatex: prepared.expression.latex,
    };
  } catch {
    return engineLimitResult();
  }
}
