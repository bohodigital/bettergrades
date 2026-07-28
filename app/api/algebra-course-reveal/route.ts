import { getAlgebraAssessmentRubric } from "../../../lib/algebra/algebra-course.server.mjs";

const MAX_ID_LENGTH = 160;
const MAX_ATTEMPT_LENGTH = 8_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ error: "Send an assessment ID and attempt." }, { status: 400 });
  const { id, attempt } = body as { id?: unknown; attempt?: unknown };
  if (typeof id !== "string" || !id || id.length > MAX_ID_LENGTH) {
    return Response.json({ error: "The assessment ID is invalid." }, { status: 400 });
  }
  if (typeof attempt !== "string" || !attempt.trim() || attempt.length > MAX_ATTEMPT_LENGTH) {
    return Response.json({ error: "Write a real attempt before opening the response guide." }, { status: 400 });
  }
  const rubric = getAlgebraAssessmentRubric(id);
  if (!rubric) return Response.json({ error: "That Algebra response guide is not available." }, { status: 404 });
  return Response.json({ rubric });
}
