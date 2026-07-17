import unitPayload from "../../../content/limits-continuity/unit.json" with { type: "json" };
import { compareLimitAnswer } from "../../../lib/calculus/limits-unit-checker.server.mjs";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_ID_LENGTH = 128;
const MAX_ANSWER_LENGTH = 2_000;
const checksById = new Map(unitPayload.checks.map((check) => [check.id, check]));

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

async function readInput(request: Request) {
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
    return { body: parsed as { id?: unknown; answer?: unknown; action?: unknown } } as const;
  } catch {
    return { error: "Request body must be valid JSON.", status: 400 } as const;
  }
}

export async function POST(request: Request) {
  const input = await readInput(request);
  if ("error" in input) return errorResponse(input.error, input.status);
  const id = typeof input.body.id === "string" ? input.body.id.trim() : "";
  const answer = typeof input.body.answer === "string" ? input.body.answer : "";
  if (id.length > MAX_ID_LENGTH) return errorResponse("Check ID is too long.", 400);
  if (answer.length > MAX_ANSWER_LENGTH) return errorResponse("Answer is too long.", 413);
  const action = input.body.action === "reveal" ? "reveal" : "grade";
  const check = checksById.get(id);
  if (!check) return errorResponse("Unknown check.", 404);
  if (action === "reveal" && !answer.trim()) return errorResponse("Submit an attempt before revealing the solution.", 400);
  let result;
  try {
    result = await compareLimitAnswer(check, answer);
  } catch {
    return errorResponse("Answer could not be evaluated.", 400);
  }
  if (action === "reveal") return Response.json({ status: result.status, revealAllowed: true, solutionLatex: check.workedFeedbackLatex });
  return Response.json({ status: result.status, feedback: result.feedback, revealAllowed: result.revealAllowed });
}
