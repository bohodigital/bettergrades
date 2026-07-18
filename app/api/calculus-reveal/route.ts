import { getCalculusUnitReveal } from "../../../lib/calculus/calculus-unit.mjs";

const MAX_BODY_BYTES = 12 * 1024;
type Input = { unitId?: unknown; routeId?: unknown; revealId?: unknown; attempt?: unknown };

function errorResponse(error: string, status: number) { return Response.json({ error }, { status }); }

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) return errorResponse("Request body is too large.", 413);
  let raw: string;
  try { raw = await request.text(); } catch { return errorResponse("Request body could not be read.", 400); }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return errorResponse("Request body is too large.", 413);
  let input: Input;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return errorResponse("Request body must be a JSON object.", 400);
    input = parsed as Input;
  } catch { return errorResponse("Request body must be valid JSON.", 400); }
  const unitId = typeof input.unitId === "string" ? input.unitId.trim() : "";
  const routeId = typeof input.routeId === "string" ? input.routeId.trim() : "";
  const revealId = typeof input.revealId === "string" ? input.revealId.trim() : "";
  const attempt = typeof input.attempt === "string" ? input.attempt.trim() : "";
  if (!unitId || !routeId || !revealId) return errorResponse("Unit, route, and reveal IDs are required.", 400);
  if (!attempt) return errorResponse("Write an attempt before revealing the answer.", 400);
  if ([unitId, routeId, revealId].some((value) => value.length > 200)) return errorResponse("Identifier is too long.", 400);
  if (attempt.length > 4_000) return errorResponse("Attempt is too long.", 413);
  const nodes = getCalculusUnitReveal(unitId, routeId, revealId);
  return nodes ? Response.json({ status: "revealed", nodes }) : errorResponse("Unknown answer reveal.", 404);
}
