import { getPrecalculusAssessmentAnswer } from "../../../lib/precalculus/precalculus-course.server.mjs";

const MAX_ID_LENGTH = 160;
const MAX_ANSWER_LENGTH = 8_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ error: "Send an assessment ID and answer." }, { status: 400 });
  const { id, answer } = body as { id?: unknown; answer?: unknown };
  if (typeof id !== "string" || !id || id.length > MAX_ID_LENGTH || !getPrecalculusAssessmentAnswer(id)) {
    return Response.json({ error: "That Precalculus practice item is not available." }, { status: 404 });
  }
  if (typeof answer !== "string" || answer.length > MAX_ANSWER_LENGTH) {
    return Response.json({ error: "The answer must be text no longer than 8,000 characters." }, { status: 400 });
  }
  if (!answer.trim()) {
    return Response.json({ status: "empty", feedback: "Write a method, partial setup, or explanation before requesting feedback." });
  }
  return Response.json({
    status: "uncertain",
    feedback: "Equivalent mathematical forms can look different. Open the response guide and compare your result, restrictions, units, and reasoning with the exact source answer.",
  });
}
