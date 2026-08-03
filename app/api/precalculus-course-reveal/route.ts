import { getPrecalculusAssessmentRecord, validatePrecalculusAssessmentAnswer } from "../../../lib/precalculus/precalculus-course.server.mjs";

const MAX_ID_LENGTH = 160;
const MAX_ATTEMPT_LENGTH = 8_000;

type PrecalculusEnvironment = {
  PRECALCULUS_SOLUTIONS?: { get(key: string, type: "json"): Promise<unknown> };
};

export async function POST(request: Request, environment: PrecalculusEnvironment = {}) {
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
  if (!environment.PRECALCULUS_SOLUTIONS) return Response.json({ error: "Protected answer validation is temporarily unavailable." }, { status: 503 });
  const record = await getPrecalculusAssessmentRecord(environment.PRECALCULUS_SOLUTIONS, id);
  if (!record) return Response.json({ error: "That Precalculus response guide is not available." }, { status: 404 });
  if (!validatePrecalculusAssessmentAnswer(record, attempt)) {
    return Response.json({ error: "The response guide remains locked because the submitted answer is not correct." }, { status: 403 });
  }
  return Response.json({ answer: `Answer: ${record.answer}` });
}
