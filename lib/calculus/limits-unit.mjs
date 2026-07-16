import unitContent from "../../content/limits-continuity/unit-content.json" with { type: "json" };
import unitPublicChecks from "../../content/limits-continuity/unit-checks-public.json" with { type: "json" };
import { LIMITS_UNIT_PREFIX } from "./limits-unit-core.mjs";
import { adaptImportedLimitsRoute, limitsExamAnswerKeyPages, limitsExamAnswerKeyRoutes } from "./limits-exam-answer-keys.mjs";

export { LIMITS_UNIT_PREFIX, unitContent as limitsUnitPayload };

export const limitsUnitRoutes = [
  ...unitContent.routes.map(adaptImportedLimitsRoute),
  ...limitsExamAnswerKeyRoutes,
];

const pagesBySourceSlug = new Map([...unitContent.pages, ...limitsExamAnswerKeyPages].map((page) => [page.sourceSlug, page]));
const checksById = new Map(unitPublicChecks.map((check) => [check.id, check]));
const routesByPath = new Map(limitsUnitRoutes.map((route) => [route.path, route]));
const routesBySlug = new Map(limitsUnitRoutes.map((route) => [route.sourceSlug, route]));

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

function publicNode(node) {
  if (node.type === "quick-check" && node.checkId) return { type: node.type, checkId: node.checkId };
  return { ...node, ...(node.children ? { children: node.children.map(publicNode) } : {}) };
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
  return {
    route: page.route,
    page: { sourceSlug: page.page.sourceSlug, sourceFile: page.page.sourceFile, sha256: page.page.sha256, nodes: page.page.nodes.map(publicNode) },
    checks: page.checks.map(publicCheck),
    previous: page.previous,
    next: page.next,
    returnRoute: page.returnRoute,
    related: page.related,
    answerKey: page.answerKey,
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
