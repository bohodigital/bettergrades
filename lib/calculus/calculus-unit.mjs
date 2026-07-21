import unit2aPages from "../../content/calculus/units/unit-2a/pages.compiled.server.json" with { type: "json" };
import unit2aProblems from "../../content/calculus/units/unit-2a/assessments.public.json" with { type: "json" };
import unit2aAssessmentSets from "../../content/calculus/units/unit-2a/assessment-sets.public.json" with { type: "json" };
import unit2bPages from "../../content/calculus/units/unit-2b/pages.compiled.server.json" with { type: "json" };
import unit2bProblems from "../../content/calculus/units/unit-2b/assessments.public.json" with { type: "json" };
import unit2bAssessmentSets from "../../content/calculus/units/unit-2b/assessment-sets.public.json" with { type: "json" };
import unit3aPages from "../../content/calculus/units/unit-3a/pages.compiled.server.json" with { type: "json" };
import unit3aProblems from "../../content/calculus/units/unit-3a/assessments.public.json" with { type: "json" };
import unit3aAssessmentSets from "../../content/calculus/units/unit-3a/assessment-sets.public.json" with { type: "json" };
import unit3bPages from "../../content/calculus/units/unit-3b/pages.compiled.server.json" with { type: "json" };
import unit3bProblems from "../../content/calculus/units/unit-3b/assessments.public.json" with { type: "json" };
import unit3bAssessmentSets from "../../content/calculus/units/unit-3b/assessment-sets.public.json" with { type: "json" };
import unit4aPages from "../../content/calculus/units/unit-4a/pages.compiled.server.json" with { type: "json" };
import unit4aProblems from "../../content/calculus/units/unit-4a/assessments.public.json" with { type: "json" };
import unit4aAssessmentSets from "../../content/calculus/units/unit-4a/assessment-sets.public.json" with { type: "json" };
import unit4bPages from "../../content/calculus/units/unit-4b/pages.compiled.server.json" with { type: "json" };
import unit4bProblems from "../../content/calculus/units/unit-4b/assessments.public.json" with { type: "json" };
import unit4bAssessmentSets from "../../content/calculus/units/unit-4b/assessment-sets.public.json" with { type: "json" };

import { getCalculusUnitCollection, getCalculusUnitRoute } from "./calculus-units-index.mjs";
import { getCalculusUnitPublicVisual } from "../visualization/calculus-units-public.server.mjs";

const unitPayloads = new Map([
  ["calc-1-unit-2a-derivative-foundations-techniques", {
    pages: unit2aPages,
    problems: unit2aProblems,
    assessmentSets: unit2aAssessmentSets,
  }],
  ["calc-1-unit-2b-derivative-applications", {
    pages: unit2bPages,
    problems: unit2bProblems,
    assessmentSets: unit2bAssessmentSets,
  }],
  ["calc-1-unit-3a-integral-foundations-techniques", {
    pages: unit3aPages,
    problems: unit3aProblems,
    assessmentSets: unit3aAssessmentSets,
  }],
  ["calc-1-unit-3b-integration-applications", {
    pages: unit3bPages,
    problems: unit3bProblems,
    assessmentSets: unit3bAssessmentSets,
  }],
  ["calc-2-unit-4a-sequences-infinite-series", {
    pages: unit4aPages,
    problems: unit4aProblems,
    assessmentSets: unit4aAssessmentSets,
  }],
  ["calc-2-unit-4b-power-taylor-series", {
    pages: unit4bPages,
    problems: unit4bProblems,
    assessmentSets: unit4bAssessmentSets,
  }],
]);

function publicProblem(problem) {
  return {
    id: problem.problem_id,
    unitId: problem.unit_id,
    pageSlug: problem.page_slug,
    promptLatex: problem.prompt_latex,
    answerType: problem.answer_type,
    choices: problem.choices ?? [],
    hints: problem.hints ?? [],
    difficulty: problem.difficulty,
    topics: problem.topics,
    skills: problem.skills,
    attemptRequiredBeforeReveal: true,
  };
}

function publicNode(node, context) {
  if (node.type === "graph-specification" && /accompanies the complete printable source/i.test(node.text ?? "")) return undefined;
  if (node.type === "solution" && context.route.pageType !== "answer-key") {
    const revealId = `reveal-${++context.revealIndex}`;
    return { type: "solution-reveal", revealId, title: node.title ?? "Worked solution" };
  }
  if (node.type === "visual-reference") {
    return {
      type: "visual-reference",
      title: node.title,
      text: node.text,
      visualId: node.visualId,
      visual: getCalculusUnitPublicVisual(context.route.unitId, node.visualId),
    };
  }
  return {
    ...node,
    ...(node.children ? { children: node.children.map((child) => publicNode(child, context)).filter(Boolean) } : {}),
  };
}

function relatedRoutes(route, collection) {
  const paths = new Set(route.relatedPaths);
  if (route.pageType === "exam") {
    const exam = route.path.match(/practice-exam-([ab])\/$/)?.[1];
    const key = exam ? collection.routes.find((candidate) => candidate.pageType === "answer-key" && candidate.path.includes(`practice-exam-${exam}-answer-key`)) : undefined;
    if (key) paths.add(key.path);
  }
  if (route.pageType === "answer-key") {
    const exam = route.path.match(/practice-exam-([ab])-answer-key\/$/)?.[1];
    const assessment = exam ? collection.routes.find((candidate) => candidate.pageType === "exam" && candidate.path.endsWith(`practice-exam-${exam}/`)) : undefined;
    if (assessment) paths.add(assessment.path);
  }
  return [...paths].map((path) => getCalculusUnitRoute(path)).filter(Boolean);
}

export function getPublicCalculusUnitPage(path) {
  const route = getCalculusUnitRoute(path);
  if (!route) return undefined;
  const collection = getCalculusUnitCollection(route.unitId);
  const payload = unitPayloads.get(route.unitId);
  if (!collection || !payload) throw new Error(`No server content is registered for ${route.unitId}.`);
  const page = payload.pages.pages.find((candidate) => candidate.routeId === route.id);
  if (!page) throw new Error(`Missing compiled page ${route.id}.`);
  const context = { route, revealIndex: 0 };
  const checks = payload.problems.problems.filter((problem) => problem.page_slug === route.slug).map(publicProblem);
  const assessmentSet = route.pageType === "exam" ? undefined : payload.assessmentSets.assessments.find((assessment) => assessment.route === route.slug);
  return {
    unit: collection.unit,
    route,
    page: {
      nodes: page.nodes.map((node) => publicNode(node, context)).filter(Boolean),
      sectionId: page.sectionId,
      sectionTitle: page.sectionTitle,
      compositionStatus: page.compositionStatus,
    },
    checks,
    assessmentSet: assessmentSet ? {
      id: assessmentSet.assessment_id,
      kind: assessmentSet.kind,
      title: assessmentSet.title,
      gradingMode: assessmentSet.grading_mode,
      items: assessmentSet.items.map((item) => ({ id: item.item_id, promptLatex: item.prompt_latex, answerType: item.answer_type })),
    } : undefined,
    previous: route.previousPath ? getCalculusUnitRoute(route.previousPath) : undefined,
    next: route.nextPath ? getCalculusUnitRoute(route.nextPath) : undefined,
    previousCore: route.previousCorePath ? getCalculusUnitRoute(route.previousCorePath) : undefined,
    nextCore: route.nextCorePath ? getCalculusUnitRoute(route.nextCorePath) : undefined,
    related: relatedRoutes(route, collection),
  };
}

function findReveal(nodes, wanted, counter) {
  for (const node of nodes) {
    if (node.type === "solution") {
      const id = `reveal-${++counter.value}`;
      if (id === wanted) return node.children ?? [];
    }
    const nested = node.children ? findReveal(node.children, wanted, counter) : undefined;
    if (nested) return nested;
  }
  return undefined;
}

export function getCalculusUnitReveal(unitId, routeId, revealId) {
  const payload = unitPayloads.get(unitId);
  if (!payload || !/^reveal-\d{1,4}$/.test(String(revealId))) return undefined;
  const page = payload.pages.pages.find((candidate) => candidate.routeId === routeId);
  if (!page) return undefined;
  const route = getCalculusUnitRoute(getCalculusUnitCollection(unitId)?.routes.find((candidate) => candidate.id === routeId)?.path ?? "");
  if (!route || route.pageType === "answer-key") return undefined;
  const nodes = findReveal(page.nodes, revealId, { value: 0 });
  if (!nodes) return undefined;
  const context = { route, revealIndex: 0 };
  return nodes.map((node) => publicNode(node, context)).filter(Boolean);
}
