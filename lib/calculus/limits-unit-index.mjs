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

const chapterDefinitions = [
  { id: "orientation", from: 1, to: 3, title: "Start here: orientation", description: "Meet the purpose, prerequisite skills, and notation of the unit before solving a limit.", lens: "What information does limit notation give you, and what does it deliberately leave open?" },
  { id: "meaning", from: 4, to: 10, title: "Chapter 1: What a limit means", description: "Build the neighborhood idea with motion, tables, holes, one-sided behavior, and graphs.", lens: "What are nearby outputs doing as the input approaches the target from both sides?" },
  { id: "finite", from: 11, to: 18, title: "Chapter 2: Finite limits and algebra", description: "Turn indeterminate forms into solvable expressions using substitution, limit laws, factoring, conjugates, and piecewise reasoning.", lens: "What did direct substitution reveal, and which algebraic move removes the obstacle without changing nearby behavior?" },
  { id: "trigonometric", from: 19, to: 25, title: "Chapter 3: Trigonometric limits", description: "Use squeezing, the fundamental sine limit, identities, and scaling to make trigonometric behavior predictable.", lens: "Can the expression be rewritten around a known small-angle limit, with every scaling factor accounted for?" },
  { id: "infinite", from: 26, to: 32, title: "Chapter 4: Infinite behavior", description: "Read vertical, horizontal, and slant asymptotes through sign analysis and dominant-term reasoning.", lens: "Is the function growing without bound near a finite input, or settling into end behavior as the input grows?" },
  { id: "continuity", from: 33, to: 41, title: "Chapter 5: Continuity", description: "Connect limits to function values, classify discontinuities, repair piecewise definitions, and use the Intermediate Value Theorem.", lens: "Do the limit, the function value, and the surrounding domain fit together at the point or across the interval?" },
  { id: "formal", from: 42, to: 46, title: "Chapter 6: Formal limits", description: "Translate the intuitive neighborhood picture into epsilon-delta language, constructive proofs, graph windows, and counterexamples.", lens: "How small must the input window be to force every allowed output into the requested tolerance band?" },
  { id: "synthesis", from: 47, to: 47, title: "Chapter 7: Synthesis", description: "Bring the unit together by choosing methods, explaining decisions, and correcting weak spots before an exam.", lens: "Can you diagnose the limit type and justify a method before beginning the algebra?" },
];

export const limitsUnitChapters = chapterDefinitions.map((chapter) => ({
  ...chapter,
  routes: limitsUnitCoreRoutes.filter((route) => route.coreSequenceIndex >= chapter.from && route.coreSequenceIndex <= chapter.to),
}));

export function getLimitsUnitChapter(coreSequenceIndex) {
  if (!Number.isInteger(coreSequenceIndex)) return undefined;
  return limitsUnitChapters.find((chapter) => coreSequenceIndex >= chapter.from && coreSequenceIndex <= chapter.to);
}

export const isLimitsUnitPath = (path) => routesByPath.has(path);
