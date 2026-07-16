import unitPayload from "../../../content/limits-continuity/unit.json" with { type: "json" };
import { compareLimitAnswer } from "../../../lib/calculus/limits-unit-core.mjs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { id?: unknown; answer?: unknown; action?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const answer = typeof body?.answer === "string" ? body.answer : "";
  const action = body?.action === "reveal" ? "reveal" : "grade";
  const check = unitPayload.checks.find((candidate) => candidate.id === id);
  if (!check) return Response.json({ error: "Unknown check." }, { status: 404 });

  const result = await compareLimitAnswer(check, answer);
  if (action === "reveal") {
    if (!answer.trim()) return Response.json({ error: "Submit an attempt before revealing the solution." }, { status: 400 });
    return Response.json({ status: result.status, revealAllowed: true, solutionLatex: check.workedFeedbackLatex });
  }
  return Response.json({ status: result.status, feedback: result.feedback, revealAllowed: result.revealAllowed });
}
