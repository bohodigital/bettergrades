import unit2aPublic from "../../content/calculus/units/unit-2a/assessments.public.json" with { type: "json" };
import unit2aServer from "../../content/calculus/units/unit-2a/assessments.server.json" with { type: "json" };
import unit2aSetPublic from "../../content/calculus/units/unit-2a/assessment-sets.public.json" with { type: "json" };
import unit2aSetServer from "../../content/calculus/units/unit-2a/assessment-sets.server.json" with { type: "json" };

import { compareAlgebraExpressions } from "../algebra-calculator.server.mjs";

const unitPayloads = new Map([
  [unit2aPublic.unit_id, { public: unit2aPublic, server: unit2aServer, setPublic: unit2aSetPublic, setServer: unit2aSetServer }],
]);

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[−–—]/g, "-")
    .replace(/\\(?:left|right)/g, "")
    .replace(/\\(?:mathrm|text)\{([^{}]*)\}/g, "$1")
    .replace(/[{}\s.,;:]+/g, " ")
    .trim()
    .replace(/^(?:a|an|the)\s+/, "");
}

function numericValue(value) {
  const normalized = String(value).trim().replace(/[−–—]/g, "-");
  const fraction = normalized.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    return denominator === 0 ? null : Number(fraction[1]) / denominator;
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
  const result = Number(normalized);
  return Number.isFinite(result) ? result : null;
}

function records(unitId, id) {
  const payload = unitPayloads.get(unitId);
  if (!payload) return undefined;
  const publicProblem = payload.public.problems.find((problem) => problem.problem_id === id);
  const serverProblem = payload.server.problems.find((problem) => problem.problem_id === id);
  if (publicProblem && serverProblem) return { kind: "problem", publicProblem, serverProblem };
  for (const assessment of payload.setPublic.assessments) {
    const publicItem = assessment.items.find((item) => item.item_id === id);
    if (!publicItem) continue;
    const serverAssessment = payload.setServer.assessments.find((candidate) => candidate.assessment_id === assessment.assessment_id);
    const serverItem = serverAssessment?.items.find((item) => item.item_id === id);
    if (serverItem) return { kind: "assessment-set", publicProblem: publicItem, serverProblem: serverItem };
  }
  return undefined;
}

export function getCalculusAssessmentRecord(unitId, id) {
  return records(unitId, id);
}

export async function evaluateCalculusAnswer(unitId, id, answer) {
  const record = records(unitId, id);
  if (!record) return undefined;
  const attempted = String(answer ?? "").trim();
  if (!attempted) return { status: "empty", feedback: "Enter an answer before checking.", revealAllowed: false };
  if (record.kind === "assessment-set") {
    return { status: "uncertain", feedback: "This written response uses an attempt-and-reveal rubric. Compare your reasoning with the model after committing to an answer.", revealAllowed: true };
  }
  const problem = record.publicProblem;
  const secret = record.serverProblem;
  let status = "incorrect";
  if (["integer", "numeric", "rational", "decimal"].includes(problem.answer_type)) {
    const actual = numericValue(attempted);
    const expected = numericValue(secret.canonical_answer);
    const tolerance = Number.isFinite(secret.tolerance) ? secret.tolerance : 1e-12;
    status = actual !== null && expected !== null && Math.abs(actual - expected) <= tolerance ? "correct" : "incorrect";
  } else if (["multiple_choice", "multiple_select", "choice"].includes(problem.answer_type)) {
    const normalized = normalizeText(attempted);
    const accepted = [secret.canonical_answer, ...(secret.accepted_answers ?? [])].map(normalizeText);
    status = accepted.includes(normalized) ? "correct" : "incorrect";
  } else if (["text_rubric", "manual_rubric", "worked_response"].includes(problem.answer_type)) {
    const normalized = normalizeText(attempted);
    const required = secret.rubric?.required_concepts?.map(normalizeText) ?? [];
    status = required.length && required.every((concept) => normalized.includes(concept)) ? "correct" : "uncertain";
  } else if (["symbolic_expression", "derivative_equivalence", "required_form"].includes(problem.answer_type)) {
    const accepted = [secret.canonical_answer, ...(secret.accepted_answers ?? [])].filter(Boolean);
    const exact = normalizeText(attempted);
    if (accepted.some((candidate) => normalizeText(candidate) === exact)) status = "correct";
    else {
      let proved = false;
      let disproved = false;
      for (const candidate of accepted) {
        try {
          const result = await compareAlgebraExpressions(candidate, attempted);
          if (result.status === "correct") { proved = true; break; }
          if (result.status === "incorrect") disproved = true;
        } catch {
          // A failed symbolic proof is not evidence that the learner is wrong.
        }
      }
      status = proved ? "correct" : disproved ? "incorrect" : "uncertain";
    }
  } else status = "uncertain";
  const feedback = status === "correct"
    ? secret.feedback.correct
    : status === "incorrect"
      ? secret.feedback.incorrect
      : secret.feedback.uncertain;
  return { status, feedback, revealAllowed: true };
}

export function revealCalculusAnswer(unitId, id, attempted) {
  if (!String(attempted ?? "").trim()) return { error: "Submit an attempt before revealing the solution.", status: 400 };
  const record = records(unitId, id);
  if (!record) return undefined;
  return {
    status: "revealed",
    revealAllowed: true,
    solutionLatex: record.kind === "assessment-set" ? record.serverProblem.model_response : record.serverProblem.worked_solution_latex,
  };
}
