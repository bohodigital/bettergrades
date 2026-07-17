import unitContent from "../../content/limits-continuity/unit-content.json" with { type: "json" };
import unitPublicChecks from "../../content/limits-continuity/unit-checks-public.json" with { type: "json" };
import exerciseAnswerArtifact from "../../content/limits-continuity/exercise-answers.json" with { type: "json" };
import { LIMITS_UNIT_PREFIX } from "./limits-unit-core.mjs";
import { adaptImportedLimitsRoute, limitsExamAnswerKeyPages, limitsExamAnswerKeyRoutes } from "./limits-exam-answer-keys.mjs";
import { getLimitsPublicVisual } from "../visualization/limits-public.server.mjs";

export { LIMITS_UNIT_PREFIX, unitContent as limitsUnitPayload };

export const limitsUnitRoutes = [
  ...unitContent.routes.map(adaptImportedLimitsRoute),
  ...limitsExamAnswerKeyRoutes,
];

const pagesBySourceSlug = new Map([...unitContent.pages, ...limitsExamAnswerKeyPages].map((page) => [page.sourceSlug, page]));
const checksById = new Map(unitPublicChecks.map((check) => [check.id, check]));
const routesByPath = new Map(limitsUnitRoutes.map((route) => [route.path, route]));
const routesBySlug = new Map(limitsUnitRoutes.map((route) => [route.sourceSlug, route]));
const exerciseAnswersBySlug = new Map(Object.entries(exerciseAnswerArtifact.routes));

const companionVisualDefinitions = new Map([
  ["calculus/limits/what-a-limit-means", [
    { id: "removable-hole", heading: "Separate the target point from nearby behavior", explanation: "Trace the curve toward the open circle from both directions before looking at whether the function is defined at the target. The gathering height determines the limit; the target point does not." },
  ]],
  ["calculus/limits/meaning-practice", [
    { id: "jump-discontinuity", heading: "Warm up by reading each side separately", explanation: "Use the graph as a rehearsal for every exercise in this set: cover the filled point, follow the left branch, follow the right branch, and combine the results only if their approached heights agree." },
  ]],
  ["calculus/limits/finite-limits-practice", [
    { id: "removable-hole", heading: "See what successful cancellation repairs", explanation: "Factoring and cancellation do not fill the missing point in the original function. They reveal a simpler nearby rule whose height exposes the finite limit at the removable hole." },
  ]],
  ["calculus/limits/trig-limits-practice", [
    { id: "sine-over-x", heading: "Anchor every rewrite to the fundamental shape", explanation: "The open point marks an undefined quotient at zero while the graph approaches one from both sides. In each exercise, rewrite until the same angle appears in the sine and its denominator." },
  ]],
  ["calculus/limits/infinite-behavior-practice", [
    { id: "vertical-asymptotes", heading: "Read local blow-up one side at a time", explanation: "Compare odd and even denominator powers before calculating. The parity determines whether the sign changes across the excluded input or remains the same on both sides." },
    { id: "horizontal-asymptote", heading: "Then switch from local behavior to end behavior", explanation: "At infinity, the graph is not approaching a finite input. Follow the long-run trend and use dominant terms to identify the horizontal level the outputs settle toward." },
  ]],
  ["calculus/continuity/continuity-at-a-point", [
    { id: "limit-versus-value", heading: "Test the three continuity conditions as separate claims", explanation: "The nearby parabola supplies the limit while the isolated filled point supplies the function value. Continuity requires both to exist and to land at the same height." },
  ]],
  ["calculus/continuity/bisection-method", [
    { id: "ivt-root", heading: "Keep the guaranteed crossing inside the current bracket", explanation: "The endpoint signs guarantee at least one crossing because the function is continuous. Each bisection step tests a midpoint and preserves the half-interval whose endpoint signs still differ." },
  ]],
  ["calculus/continuity/continuity-practice", [
    { id: "discontinuity-gallery", heading: "Classify the shape before choosing a repair", explanation: "A removable hole, jump, vertical blow-up, and oscillation fail continuity for different reasons. Only a removable mismatch can be repaired by changing one function value." },
    { id: "ivt-root", heading: "Use continuity to justify existence, not exactness", explanation: "Opposite endpoint signs and continuity guarantee a root in the interval. They do not locate it exactly or prove that it is the only root." },
  ]],
  ["calculus/limits/epsilon-delta-introduction", [
    { id: "epsilon-delta-window", heading: "Read the formal definition as a window guarantee", explanation: "The vertical epsilon band is the requested output accuracy. The horizontal delta window is chosen so every allowed nearby graph point is forced to remain inside that band." },
  ]],
  ["calculus/limits/epsilon-delta-practice", [
    { id: "epsilon-delta-window", heading: "Translate each proof into bands before manipulating symbols", explanation: "Begin with the requested vertical tolerance, work backward to a sufficient horizontal distance, and then verify forward that every input in the punctured delta window stays in the epsilon band." },
  ]],
  ["calculus/limits/cumulative-practice", [
    { id: "discontinuity-gallery", heading: "Start mixed practice by naming the behavior", explanation: "Use the gallery as a diagnostic key: decide whether the problem concerns a finite neighborhood, a discontinuity type, unbounded behavior, or a continuity theorem before selecting algebra." },
  ]],
]);

export function getLimitsUnitRoute(path) {
  return routesByPath.get(path);
}

export function getLimitsUnitRouteBySlug(sourceSlug) {
  return routesBySlug.get(sourceSlug);
}

export function getLimitsUnitPage(path) {
  const route = getLimitsUnitRoute(path);
  if (!route) return undefined;
  const page = pagesBySourceSlug.get(route.sourceSlug);
  if (!page) return undefined;
  return {
    route,
    page,
    checks: route.checkIds.map((id) => checksById.get(id)).filter(Boolean),
    previous: route.previousCoreSlug ? getLimitsUnitRouteBySlug(route.previousCoreSlug) : undefined,
    next: route.nextCoreSlug ? getLimitsUnitRouteBySlug(route.nextCoreSlug) : undefined,
    returnRoute: route.returnToSequenceSlug ? getLimitsUnitRouteBySlug(route.returnToSequenceSlug) : undefined,
    related: route.relatedResources.map((slug) => getLimitsUnitRouteBySlug(slug)).filter(Boolean),
    answerKey: page.answerKey,
  };
}

function publicNode(node, exerciseCounter) {
  if (node.type === "quick-check" && node.checkId) return { type: node.type, checkId: node.checkId };
  const visual = node.type === "graph-specification" && node.graphId
    ? getLimitsPublicVisual(node.graphId)
    : undefined;
  const exerciseNumber = node.type === "exercise" || node.type === "problem"
    ? ++exerciseCounter.current
    : undefined;
  return {
    ...node,
    ...(exerciseNumber ? { exerciseNumber } : {}),
    ...(visual ? { visual } : {}),
    ...(node.children ? { children: node.children.map((child) => publicNode(child, exerciseCounter)) } : {}),
  };
}

function publicCheck(check) {
  return {
    id: check.id,
    routeSlug: check.routeSlug,
    mode: check.mode,
    answerType: check.answerType,
    promptLatex: check.promptLatex,
    hintLatex: check.hintLatex,
    attemptRequiredBeforeReveal: check.attemptRequiredBeforeReveal,
  };
}

export function getPublicLimitsUnitPage(path) {
  const page = getLimitsUnitPage(path);
  if (!page) return undefined;
  const exerciseAnswers = exerciseAnswersBySlug.get(page.route.sourceSlug);
  const exerciseCounter = { current: 0 };
  const companionVisuals = (companionVisualDefinitions.get(page.route.sourceSlug) ?? []).map((definition) => ({
    ...definition,
    visual: getLimitsPublicVisual(definition.id),
  }));
  return {
    route: page.route,
    page: { sourceSlug: page.page.sourceSlug, sourceFile: page.page.sourceFile, sha256: page.page.sha256, nodes: page.page.nodes.map((node) => publicNode(node, exerciseCounter)) },
    checks: page.checks.map(publicCheck),
    previous: page.previous,
    next: page.next,
    returnRoute: page.returnRoute,
    related: page.related,
    answerKey: page.answerKey,
    exerciseAnswers: exerciseAnswers ? { ...exerciseAnswers, sourceFile: exerciseAnswerArtifact.sourceFile } : undefined,
    companionVisuals,
    provenanceNote: unitContent.source.provenance.note,
  };
}
const practiceTypes = new Set(["answer-key", "diagnostic", "exam", "practice", "quiz"]);
const labelFor = (route) => {
  if (route.pageType === "answer-key") return "Answer key";
  if (route.pageType === "exam") return "Practice exam";
  if (route.pageType === "quiz") return "Quiz";
  if (route.pageType === "diagnostic") return "Diagnostic";
  if (route.pageType === "practice") return "Practice set";
  if (route.pageType === "review") return "Review";
  if (route.pageType === "reference") return "Reference";
  if (route.pageType === "hub") return "Unit map";
  return "Lesson";
};

export const limitsUnitSearchRecords = limitsUnitRoutes.map((route) => ({
  id: `limits-unit-${route.sourceSlug.replaceAll("/", "-")}`,
  kind: practiceTypes.has(route.pageType) ? "practice" : route.pageType === "hub" ? "topic" : "guide",
  title: route.h1,
  description: route.description,
  path: route.path,
  domainSlug: "calculus",
  domainName: "Calculus",
  topicName: "Limits & Continuity",
  label: labelFor(route),
  keywords: [route.primaryQuery, route.sourceSlug.replaceAll("/", " "), route.pageType, "limits", "continuity"],
  priority: route.pageType === "hub" ? 92 : practiceTypes.has(route.pageType) ? 90 : 76,
}));

export const limitsUnitPracticeRoutes = limitsUnitRoutes.filter((route) => practiceTypes.has(route.pageType));
export const limitsUnitCoreRoutes = limitsUnitRoutes.filter((route) => route.isCoreSequence).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
export const isLimitsUnitPath = (path) => path === LIMITS_UNIT_PREFIX || path.startsWith(LIMITS_UNIT_PREFIX);
