const ALGEBRA_ENDPOINT = "/api/algebra";
const MAX_EXPRESSION_LENGTH = 240;
const MAX_ASSIGNMENTS_LENGTH = 80;
const MAX_REQUEST_BYTES = 2_048;
const MAX_RESPONSE_BYTES = 16_384;
const REQUEST_TIMEOUT_MS = 12_000;
const RESULT_STATUSES = new Set(["correct", "incorrect", "simplified", "evaluated", "uncertain", "error"]);

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

function unavailableResult() {
  return error("The calculator did not start", "Your expression is still in this form. Check your connection and try the bounded Better Grades calculator request again.");
}

function validateExpression(value) {
  const normalized = normalizeCalculatorInput(value);
  if (!normalized) return { result: error("Nothing to check yet", "Type an expression first.") };
  if (normalized.length > MAX_EXPRESSION_LENGTH) {
    return { result: error("Keep this one smaller", `This release accepts expressions up to ${MAX_EXPRESSION_LENGTH} characters.`) };
  }
  return { normalized };
}

function isCalculatorResult(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  if (!RESULT_STATUSES.has(value.status) || typeof value.title !== "string" || typeof value.message !== "string") return false;
  if (value.title.length > 240 || value.message.length > 1_000) return false;
  for (const key of ["latex", "secondaryLatex", "normalizedLatex"]) {
    if (value[key] !== undefined && (typeof value[key] !== "string" || value[key].length > 5_000)) return false;
  }
  return true;
}

async function requestAlgebraResult(payload) {
  const body = JSON.stringify(payload);
  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) return unavailableResult();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(ALGEBRA_ENDPOINT, {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body,
      signal: controller.signal,
    });
    if (!response.ok) return unavailableResult();
    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) return unavailableResult();
    const raw = await response.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_RESPONSE_BYTES) return unavailableResult();
    const result = JSON.parse(raw);
    return isCalculatorResult(result) ? result : unavailableResult();
  } catch {
    return unavailableResult();
  } finally {
    clearTimeout(timeout);
  }
}

export async function simplifyAlgebraExpression(value) {
  const checked = validateExpression(value);
  if (checked.result) return checked.result;
  return requestAlgebraResult({ action: "simplify", expression: checked.normalized });
}

export async function compareAlgebraExpressions(leftValue, rightValue) {
  const left = validateExpression(leftValue);
  if (left.result) return left.result;
  const right = validateExpression(rightValue);
  if (right.result) return error("Nothing to compare yet", "Enter the second expression before checking equivalence.");
  return requestAlgebraResult({ action: "compare", expression: left.normalized, comparison: right.normalized });
}

function parseNumericValue(value) {
  const normalized = value.trim().replace(/[−–—]/g, "-");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function parseVariableAssignments(value) {
  const source = String(value ?? "").trim();
  if (source.length > MAX_ASSIGNMENTS_LENGTH) {
    return { error: `Use no more than ${MAX_ASSIGNMENTS_LENGTH} characters for variable values.` };
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
  const checked = validateExpression(value);
  if (checked.result) return checked.result;
  const assignments = String(assignmentSource ?? "");
  const parsedAssignments = parseVariableAssignments(assignments);
  if (parsedAssignments.error) return error("Check the variable values", parsedAssignments.error);
  return requestAlgebraResult({ action: "evaluate", expression: checked.normalized, assignments });
}
