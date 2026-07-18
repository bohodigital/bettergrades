import { evaluateCalculusAnswer, getCalculusAssessmentRecord, revealCalculusAnswer } from "../../../lib/calculus/calculus-assessment.server.mjs";

const MAX_BODY_BYTES = 16 * 1024;
const MAX_ID_LENGTH = 180;
const MAX_ANSWER_LENGTH = 4_000;

type Input = { unitId?: unknown; id?: unknown; answer?: unknown; action?: unknown };

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

async function readInput(request: Request): Promise<{ body: Input } | { error: string; status: number }> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return { error: "Request body is too large.", status: 413 };
  let raw: string;
  try { raw = await request.text(); } catch { return { error: "Request body could not be read.", status: 400 }; }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return { error: "Request body is too large.", status: 413 };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { error: "Request body must be a JSON object.", status: 400 };
    return { body: parsed as Input };
  } catch { return { error: "Request body must be valid JSON.", status: 400 }; }
}

export async function POST(request: Request) {
  const input = await readInput(request);
  if ("error" in input) return errorResponse(input.error, input.status);
  const unitId = typeof input.body.unitId === "string" ? input.body.unitId.trim() : "";
  const id = typeof input.body.id === "string" ? input.body.id.trim() : "";
  const answer = typeof input.body.answer === "string" ? input.body.answer : "";
  if (!unitId || !id) return errorResponse("Unit ID and problem ID are required.", 400);
  if (unitId.length > MAX_ID_LENGTH || id.length > MAX_ID_LENGTH) return errorResponse("Identifier is too long.", 400);
  if (answer.length > MAX_ANSWER_LENGTH) return errorResponse("Answer is too long.", 413);
  if (!getCalculusAssessmentRecord(unitId, id)) return errorResponse("Unknown calculus check.", 404);
  if (input.body.action === "reveal") {
    const result = revealCalculusAnswer(unitId, id, answer);
    if (!result) return errorResponse("Unknown calculus check.", 404);
    if ("error" in result) return errorResponse(result.error ?? "The answer could not be revealed.", typeof result.status === "number" ? result.status : 400);
    return Response.json(result);
  }
  try {
    const result = await evaluateCalculusAnswer(unitId, id, answer);
    return result ? Response.json(result) : errorResponse("Unknown calculus check.", 404);
  } catch {
    return Response.json({ status: "uncertain", feedback: "The checker could not prove equivalence. Compare structure or reveal the worked solution.", revealAllowed: Boolean(answer.trim()) });
  }
}
