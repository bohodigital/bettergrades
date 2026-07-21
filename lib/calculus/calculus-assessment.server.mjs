import unit2aPublic from "../../content/calculus/units/unit-2a/assessments.public.json" with { type: "json" };
import unit2aServer from "../../content/calculus/units/unit-2a/assessments.server.json" with { type: "json" };
import unit2aSetPublic from "../../content/calculus/units/unit-2a/assessment-sets.public.json" with { type: "json" };
import unit2aSetServer from "../../content/calculus/units/unit-2a/assessment-sets.server.json" with { type: "json" };
import unit2bPublic from "../../content/calculus/units/unit-2b/assessments.public.json" with { type: "json" };
import unit2bServer from "../../content/calculus/units/unit-2b/assessments.server.json" with { type: "json" };
import unit2bSetPublic from "../../content/calculus/units/unit-2b/assessment-sets.public.json" with { type: "json" };
import unit2bSetServer from "../../content/calculus/units/unit-2b/assessment-sets.server.json" with { type: "json" };
import unit3aPublic from "../../content/calculus/units/unit-3a/assessments.public.json" with { type: "json" };
import unit3aServer from "../../content/calculus/units/unit-3a/assessments.server.json" with { type: "json" };
import unit3aSetPublic from "../../content/calculus/units/unit-3a/assessment-sets.public.json" with { type: "json" };
import unit3aSetServer from "../../content/calculus/units/unit-3a/assessment-sets.server.json" with { type: "json" };
import unit3bPublic from "../../content/calculus/units/unit-3b/assessments.public.json" with { type: "json" };
import unit3bServer from "../../content/calculus/units/unit-3b/assessments.server.json" with { type: "json" };
import unit3bSetPublic from "../../content/calculus/units/unit-3b/assessment-sets.public.json" with { type: "json" };
import unit3bSetServer from "../../content/calculus/units/unit-3b/assessment-sets.server.json" with { type: "json" };
import unit4aPublic from "../../content/calculus/units/unit-4a/assessments.public.json" with { type: "json" };
import unit4aServer from "../../content/calculus/units/unit-4a/assessments.server.json" with { type: "json" };
import unit4aSetPublic from "../../content/calculus/units/unit-4a/assessment-sets.public.json" with { type: "json" };
import unit4aSetServer from "../../content/calculus/units/unit-4a/assessment-sets.server.json" with { type: "json" };

import { compareAlgebraExpressions } from "../algebra-calculator.server.mjs";

const unitPayloads = new Map([
  [unit2aPublic.unit_id, { public: unit2aPublic, server: unit2aServer, setPublic: unit2aSetPublic, setServer: unit2aSetServer }],
  [unit2bPublic.unit_id, { public: unit2bPublic, server: unit2bServer, setPublic: unit2bSetPublic, setServer: unit2bSetServer }],
  [unit3aPublic.unit_id, { public: unit3aPublic, server: unit3aServer, setPublic: unit3aSetPublic, setServer: unit3aSetServer }],
  [unit3bPublic.unit_id, { public: unit3bPublic, server: unit3bServer, setPublic: unit3bSetPublic, setServer: unit3bSetServer }],
  [unit4aPublic.unit_id, { public: unit4aPublic, server: unit4aServer, setPublic: unit4aSetPublic, setServer: unit4aSetServer }],
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

function normalizeIntegrationConstant(value) {
  let source = String(value)
    .replace(/\\(?:mathrm|text)\{([A-Za-z])\}/g, "$1")
    .replace(/\b(?:arbitrary\s+)?(?:constant|const)\b/gi, "C");
  let includesArbitraryConstant = false;
  const trailing = source.match(/(^|[+-])\s*(?:\d+(?:\.\d+)?\s*\*?\s*)?([A-Za-z])\s*$/);
  if (trailing && trailing[2].toLowerCase() !== "x") {
    source = `${source.slice(0, trailing.index)}${trailing[1]}C`;
    includesArbitraryConstant = true;
  } else {
    const leading = source.match(/^\s*(?:\d+(?:\.\d+)?\s*\*?\s*)?([A-Za-z])\s*([+-])/);
    if (leading && leading[1].toLowerCase() !== "x") {
      source = source.replace(leading[0], `C${leading[2]}`);
      includesArbitraryConstant = true;
    }
  }
  return { source, includesArbitraryConstant };
}

function normalizeIntegralSetup(value) {
  return String(value)
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/\\\[|\\\]|\$\$/g, "")
    .replace(/\\(?:left|right|,|!|;|quad|qquad)/g, "")
    .replace(/\\cdot|×|·/g, "*")
    .replace(/\\int_\{?([^{}^\s]+)\}?\^\{?([^{}(\s]+)\}?/g, "integral_$1^$2::")
    .replace(/\\int/g, "integral")
    .replace(/integral_([^\^:]+)\^([^:(]+)\(/g, "integral_$1^$2::(")
    .replace(/\\(?:mathrm|text)\{([^{}]*)\}/g, "$1")
    .replace(/\s+/g, "")
    .replace(/\*?integral/g, "*integral")
    .replace(/^\*/, "");
}

function parseIntegralSetup(value) {
  const normalized = normalizeIntegralSetup(value);
  const match = normalized.match(/^(.*?)\*?integral_([^\^:]+)\^([^:]+)::(.+)d([A-Za-z])$/i);
  if (!match) return undefined;
  const explicitProducts = (expression) => String(expression)
    .replace(/(\d|\))\(/g, "$1*(")
    .replace(/\)([A-Za-z0-9])/g, ")*$1");
  return {
    coefficient: explicitProducts(match[1] || "1"),
    lower: match[2],
    upper: match[3],
    integrand: explicitProducts(match[4].replace(/^\((.*)\)$/, "$1")),
    variable: match[5].toLowerCase(),
  };
}

async function compareIntegralSetups(expectedValue, attemptedValue) {
  const expected = parseIntegralSetup(expectedValue);
  const attempted = parseIntegralSetup(attemptedValue);
  if (!expected || !attempted || expected.variable !== attempted.variable) return "uncertain";
  const comparisons = await Promise.all([
    compareAlgebraExpressions(expected.lower, attempted.lower),
    compareAlgebraExpressions(expected.upper, attempted.upper),
    compareAlgebraExpressions(`(${expected.coefficient})*(${expected.integrand})`, `(${attempted.coefficient})*(${attempted.integrand})`),
  ]);
  if (comparisons.every((result) => result.status === "correct")) return "correct";
  if (comparisons.some((result) => result.status === "incorrect")) return "incorrect";
  return "uncertain";
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
  } else if (problem.answer_type === "integral_setup") {
    const accepted = [secret.canonical_answer, ...(secret.accepted_answers ?? [])].filter(Boolean);
    let disproved = false;
    for (const candidate of accepted) {
      const result = await compareIntegralSetups(candidate, attempted);
      if (result === "correct") { status = "correct"; break; }
      if (result === "incorrect") disproved = true;
    }
    if (status !== "correct") status = disproved ? "incorrect" : "uncertain";
  } else if (["symbolic_expression", "derivative_equivalence", "required_form"].includes(problem.answer_type)) {
    const accepted = [secret.canonical_answer, ...(secret.accepted_answers ?? [])].filter(Boolean);
    const antiderivativePolicy = secret.equivalence_policy === "antiderivative-up-to-additive-constant";
    const normalizedAttempt = antiderivativePolicy ? normalizeIntegrationConstant(attempted) : { source: attempted, includesArbitraryConstant: true };
    const exact = normalizeText(normalizedAttempt.source);
    if (antiderivativePolicy && !normalizedAttempt.includesArbitraryConstant) status = "incorrect";
    else if (accepted.some((candidate) => normalizeText(antiderivativePolicy ? normalizeIntegrationConstant(candidate).source : candidate) === exact)) status = "correct";
    else {
      let proved = false;
      let disproved = false;
      for (const candidate of accepted) {
        try {
          const expected = antiderivativePolicy ? normalizeIntegrationConstant(candidate).source : candidate;
          const result = await compareAlgebraExpressions(expected, normalizedAttempt.source);
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
