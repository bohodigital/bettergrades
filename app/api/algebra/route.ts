import {
  compareAlgebraExpressions,
  evaluateAlgebraExpression,
  MAX_ALGEBRA_ASSIGNMENTS_LENGTH,
  MAX_ALGEBRA_EXPRESSION_LENGTH,
  simplifyAlgebraExpression,
} from "../../../lib/algebra-calculator.server.mjs";

const MAX_BODY_BYTES = 2_048;
const RESPONSE_HEADERS = {
  "cache-control": "no-store, max-age=0",
  "x-content-type-options": "nosniff",
};
const ALLOWED_FIELDS = {
  simplify: new Set(["action", "expression"]),
  compare: new Set(["action", "expression", "comparison"]),
  evaluate: new Set(["action", "expression", "assignments"]),
} as const;

type AlgebraAction = keyof typeof ALLOWED_FIELDS;
type InputBody = Record<string, unknown>;
type InputResult = { body: InputBody } | { error: string; status: number };
type BoundedStringResult = { value: string } | { error: string; status: number };

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  for (const [name, value] of Object.entries(RESPONSE_HEADERS)) headers.set(name, value);
  return Response.json(body, { ...init, headers });
}

function errorResponse(error: string, status: number) {
  return jsonResponse({ error }, { status });
}

async function readInput(request: Request): Promise<InputResult> {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") return { error: "Content-Type must be application/json.", status: 415 } as const;

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { error: "Request body is too large.", status: 413 } as const;

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return { error: "Request body could not be read.", status: 400 } as const;
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return { error: "Request body is too large.", status: 413 } as const;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { error: "Request body must be a JSON object.", status: 400 } as const;
    return { body: parsed as InputBody } as const;
  } catch {
    return { error: "Request body must be valid JSON.", status: 400 } as const;
  }
}

function readBoundedString(body: InputBody, field: string, maximum: number): BoundedStringResult {
  const value = body[field];
  if (typeof value !== "string") return { error: `${field} must be a string.`, status: 400 } as const;
  if (value.length > maximum) return { error: `${field} is too long.`, status: 413 } as const;
  return { value } as const;
}

export async function POST(request: Request) {
  const input = await readInput(request);
  if ("error" in input) return errorResponse(input.error, input.status);

  const action = input.body.action;
  if (typeof action !== "string" || !Object.hasOwn(ALLOWED_FIELDS, action)) return errorResponse("Unknown algebra action.", 400);
  const allowedFields = ALLOWED_FIELDS[action as AlgebraAction];
  if (Object.keys(input.body).some((field) => !allowedFields.has(field))) return errorResponse("Request contains an unknown field.", 400);

  const expression = readBoundedString(input.body, "expression", MAX_ALGEBRA_EXPRESSION_LENGTH);
  if ("error" in expression) return errorResponse(expression.error, expression.status);

  if (action === "simplify") return jsonResponse(await simplifyAlgebraExpression(expression.value));

  if (action === "compare") {
    const comparison = readBoundedString(input.body, "comparison", MAX_ALGEBRA_EXPRESSION_LENGTH);
    if ("error" in comparison) return errorResponse(comparison.error, comparison.status);
    return jsonResponse(await compareAlgebraExpressions(expression.value, comparison.value));
  }

  const assignments = readBoundedString(input.body, "assignments", MAX_ALGEBRA_ASSIGNMENTS_LENGTH);
  if ("error" in assignments) return errorResponse(assignments.error, assignments.status);
  return jsonResponse(await evaluateAlgebraExpression(expression.value, assignments.value));
}
