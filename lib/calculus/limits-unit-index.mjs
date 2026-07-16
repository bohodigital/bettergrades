import unitIndex from "../../content/limits-continuity/unit-index.json" with { type: "json" };
import { LIMITS_UNIT_PREFIX } from "./limits-unit-core.mjs";

export { LIMITS_UNIT_PREFIX, unitIndex as limitsUnitIndex };

export const limitsUnitRoutes = unitIndex.routes.map((route) => ({
  ...route,
  metadataTitle: route.title.replace(/\s*\|\s*BetterGrades$/i, ""),
}));

const routesByPath = new Map(limitsUnitRoutes.map((route) => [route.path, route]));
const routesBySlug = new Map(limitsUnitRoutes.map((route) => [route.sourceSlug, route]));

export function getLimitsUnitRoute(path) {
  return routesByPath.get(path);
}

export function getLimitsUnitRouteBySlug(sourceSlug) {
  return routesBySlug.get(sourceSlug);
}

const practiceTypes = new Set(["diagnostic", "exam", "practice", "quiz"]);
const labelFor = (route) => {
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
export const isLimitsUnitPath = (path) => routesByPath.has(path);
