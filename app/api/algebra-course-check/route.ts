import { NextResponse } from "next/server";
import { getAlgebraAssessmentRubric } from "../../../lib/algebra/algebra-course.server.mjs";

const MAX_ID_LENGTH = 160;
const MAX_ANSWER_LENGTH = 8_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a JSON request body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Send an assessment ID and answer." }, { status: 400 });
  const { id, answer } = body as { id?: unknown; answer?: unknown };
  if (typeof id !== "string" || !id || id.length > MAX_ID_LENGTH || !getAlgebraAssessmentRubric(id)) {
    return NextResponse.json({ error: "That Algebra assessment item is not available." }, { status: 404 });
  }
  if (typeof answer !== "string" || answer.length > MAX_ANSWER_LENGTH) {
    return NextResponse.json({ error: "The answer must be text no longer than 8,000 characters." }, { status: 400 });
  }
  if (!answer.trim()) {
    return NextResponse.json({ status: "empty", feedback: "Write a method, partial setup, or explanation before requesting feedback." });
  }
  return NextResponse.json({
    status: "uncertain",
    feedback: "This source prompt is open response, so BetterGrades will not pretend one wording is machine-provable. Your attempt is recorded locally; open the supplied rubric and compare the method, restrictions, units, and check.",
  });
}
