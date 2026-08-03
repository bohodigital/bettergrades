import { evaluatePrecalculusAssessmentAnswer, getPrecalculusAssessmentRecord } from "../../../lib/precalculus/precalculus-course.server.mjs";

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
  const evaluation = await evaluatePrecalculusAssessmentAnswer(record, answer);
  if (evaluation.status === "correct") {
    return Response.json({ status: "correct", revealAllowed: true, feedback: "Correct. You can now compare your work with the response guide." });
  }
  if (evaluation.status === "manual_review") {
    return Response.json({ status: "manual_review", revealAllowed: true, feedback: "This explanation is not labeled correct by automation. Your substantive attempt is ready for rubric-guided comparison." });
  }
  const feedback = evaluation.status === "insufficient"
    ? "Add a substantive method, explanation, or mathematical setup before opening the model response."
    : evaluation.status === "uncertain"
      ? "The bounded checker could not prove or disprove equivalence. Recheck the requested form and try a clearer equivalent form."
      : "That attempt does not match the protected answer. Recheck the requested form, restrictions, units, and reasoning.";
  return Response.json({ status: evaluation.status, revealAllowed: false, feedback }, { status: 422 });
}
