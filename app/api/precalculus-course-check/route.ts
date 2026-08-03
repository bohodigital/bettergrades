import { getPrecalculusAssessmentRecord, validatePrecalculusAssessmentAnswer } from "../../../lib/precalculus/precalculus-course.server.mjs";

const MAX_ID_LENGTH = 160;
const MAX_ANSWER_LENGTH = 8_000;

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
  if (!body || typeof body !== "object") return Response.json({ error: "Send an assessment ID and answer." }, { status: 400 });
  const { id, answer } = body as { id?: unknown; answer?: unknown };
  if (typeof id !== "string" || !id || id.length > MAX_ID_LENGTH) return Response.json({ error: "That Precalculus practice item is not available." }, { status: 404 });
  if (typeof answer !== "string" || answer.length > MAX_ANSWER_LENGTH) {
    return Response.json({ error: "The answer must be text no longer than 8,000 characters." }, { status: 400 });
  }
  if (!answer.trim()) {
    return Response.json({ status: "empty", feedback: "Write a method, partial setup, or explanation before requesting feedback." });
  }
  if (!environment.PRECALCULUS_SOLUTIONS) return Response.json({ error: "Protected answer validation is temporarily unavailable." }, { status: 503 });
  const record = await getPrecalculusAssessmentRecord(environment.PRECALCULUS_SOLUTIONS, id);
  if (!record) return Response.json({ error: "That Precalculus practice item is not available." }, { status: 404 });
  const correct = validatePrecalculusAssessmentAnswer(record, answer);
  return Response.json(correct
    ? { status: "correct", feedback: "Correct. You can now compare your work with the response guide." }
    : { status: "incorrect", feedback: "That attempt does not match the protected answer. Recheck the requested form, restrictions, units, and reasoning." },
  { status: correct ? 200 : 422 });
}
