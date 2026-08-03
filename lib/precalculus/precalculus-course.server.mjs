import { compareAlgebraExpressions } from "../algebra-calculator.server.mjs";

const MAX_ID_LENGTH = 160;

export function normalizePrecalculusAnswer(value) {
  return value
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[\u2212\u2012-\u2015]/g, "-")
    .replace(/[\s.,;:!?]+/g, "")
    .replace(/\*|\u00b7/g, "")
    .replace(/\^\{([^{}]+)\}/g, "^$1")
    .replace(/\\left|\\right/g, "");
}

function numericValue(value) {
  const normalized = String(value).trim().replace(/[−–—]/g, "-").replace(/\.$/, "");
  const percent = normalized.endsWith("%");
  const source = percent ? normalized.slice(0, -1).trim() : normalized;
  const fraction = source.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);
  let result;
  if (fraction) result = Number(fraction[1]) / Number(fraction[2]);
  else if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(source)) result = Number(source);
  else return undefined;
  if (!Number.isFinite(result)) return undefined;
  return percent ? result / 100 : result;
}

function substantiveManualAttempt(value, minimumLength) {
  const source = String(value).normalize("NFKC").trim();
  if (source.length < minimumLength) return false;
  if (/^(?:.)\1+$/.test(source.replace(/\s/g, ""))) return false;
  const tokens = source.match(/[A-Za-z0-9]+|[=<>^+*/−-]/g) ?? [];
  return new Set(tokens.map((token) => token.toLowerCase())).size >= 3;
}

async function evaluatePolicy(policy, expected, attempted) {
  if (policy.type === "numeric") {
    const actualValue = numericValue(attempted);
    const expectedValue = numericValue(expected);
    return actualValue !== undefined && expectedValue !== undefined
      && Math.abs(actualValue - expectedValue) <= (Number.isFinite(policy.tolerance) ? policy.tolerance : 1e-9)
      ? "correct" : "incorrect";
  }
  if (policy.type === "symbolic") {
    if (normalizePrecalculusAnswer(expected) === normalizePrecalculusAnswer(attempted)) return "correct";
    try {
      const comparison = await compareAlgebraExpressions(expected.replace(/\.$/, ""), attempted);
      return comparison.status === "correct" ? "correct" : comparison.status === "incorrect" ? "incorrect" : "uncertain";
    } catch {
      return "uncertain";
    }
  }
  if (policy.type === "multipart") {
    const expectedParts = expected.split(policy.separator).map((value) => value.trim()).filter(Boolean);
    const attemptedParts = attempted.split(policy.separator).map((value) => value.trim()).filter(Boolean);
    if (expectedParts.length !== policy.components.length || attemptedParts.length !== expectedParts.length) return "incorrect";
    const results = await Promise.all(policy.components.map((component, index) => evaluatePolicy(component, expectedParts[index], attemptedParts[index])));
    if (results.every((status) => status === "correct")) return "correct";
    return results.some((status) => status === "incorrect") ? "incorrect" : "uncertain";
  }
  if (policy.type === "manual_rubric") {
    return substantiveManualAttempt(attempted, policy.minimumAttemptLength ?? 24) ? "manual_review" : "insufficient";
  }
  return normalizePrecalculusAnswer(attempted) === normalizePrecalculusAnswer(expected) ? "correct" : "incorrect";
}

export async function evaluatePrecalculusAssessmentAnswer(record, attempt) {
  if (!record || typeof record.answer !== "string" || typeof attempt !== "string" || !record.validation) return { status: "invalid", revealAllowed: false };
  const status = await evaluatePolicy(record.validation, record.answer, attempt);
  return {
    status,
    revealAllowed: status === "correct" || (status === "manual_review" && record.validation.revealPolicy === "attempt_then_model"),
    policy: record.validation.type,
  };
}

export async function validatePrecalculusAssessmentAnswer(record, attempt) {
  return (await evaluatePrecalculusAssessmentAnswer(record, attempt)).status === "correct";
}

export async function getPrecalculusAssessmentRecord(storage, id) {
  if (!storage || typeof storage.get !== "function" || typeof id !== "string" || !id || id.length > MAX_ID_LENGTH) return undefined;
  const stored = await storage.get(id, "json");
  if (!stored || typeof stored !== "object" || stored.id !== id || typeof stored.answer !== "string" || !stored.validation || typeof stored.validation.type !== "string") return undefined;
  return stored;
}
