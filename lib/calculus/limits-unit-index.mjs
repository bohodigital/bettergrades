import unitIndex from "../../content/limits-continuity/unit-index.json" with { type: "json" };
import { LIMITS_UNIT_PREFIX } from "./limits-unit-core.mjs";
import { adaptImportedLimitsRoute, limitsExamAnswerKeyRoutes } from "./limits-exam-answer-keys.mjs";

export { LIMITS_UNIT_PREFIX, unitIndex as limitsUnitIndex };

export const limitsUnitRoutes = [
  ...unitIndex.routes.map(adaptImportedLimitsRoute),
  ...limitsExamAnswerKeyRoutes,
];

const routesByPath = new Map(limitsUnitRoutes.map((route) => [route.path, route]));
const routesBySlug = new Map(limitsUnitRoutes.map((route) => [route.sourceSlug, route]));

export function getLimitsUnitRoute(path) {
  return routesByPath.get(path);
}

export function getLimitsUnitRouteBySlug(sourceSlug) {
  return routesBySlug.get(sourceSlug);
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

const chapterDefinitions = [
  {
    id: "orientation", from: 1, to: 3, title: "Start here: orientation",
    description: "Meet the purpose, prerequisite skills, and notation of the unit before solving a limit.",
    lens: "What information does limit notation give you, and what does it deliberately leave open?",
    mentalModel: "Treat a limit as a claim about a neighborhood around an input, not as a command to plug in the input itself.",
    decision: "Before calculating, identify the input target, the output target, and whether the approach is two-sided, one-sided, or toward infinity.",
    commonTrap: "Do not let a filled point, an undefined value, or unfamiliar notation distract you from the nearby behavior the limit actually describes.",
    checkpoint: "You are ready to continue when you can read a limit aloud and name every part of its notation without evaluating it.",
  },
  {
    id: "meaning", from: 4, to: 10, title: "Section 1: What a limit means",
    description: "Build the neighborhood idea with motion, tables, holes, one-sided behavior, and graphs.",
    lens: "What are nearby outputs doing as the input approaches the target from both sides?",
    mentalModel: "Imagine tightening a window around the target input and watching where all nearby outputs are forced to gather.",
    decision: "Read the left-hand and right-hand behavior separately first; combine them only after both sides approach the same output.",
    commonTrap: "The function value at the target can be missing or deliberately moved, so never substitute a plotted dot for evidence from both sides.",
    checkpoint: "You understand the section when you can explain a limit from a graph, table, and sentence without confusing it with the function value.",
  },
  {
    id: "finite", from: 11, to: 18, title: "Section 2: Finite limits and algebra",
    description: "Turn indeterminate forms into solvable expressions using substitution, limit laws, factoring, conjugates, and piecewise reasoning.",
    lens: "What did direct substitution reveal, and which algebraic move removes the obstacle without changing nearby behavior?",
    mentalModel: "Substitution is a diagnostic first move: a real number usually finishes the problem, while an indeterminate form asks for a structural rewrite.",
    decision: "Match the obstacle to the algebra—factor polynomial zeros, rationalize radicals, combine complex fractions, and split absolute values into one-sided cases.",
    commonTrap: "Zero over zero is not an answer, and cancellation is legal only for factors after the expression has been rewritten as a product.",
    checkpoint: "You are ready to move on when you can justify why each rewrite preserves nearby values even if the original expression is undefined at the target.",
  },
  {
    id: "trigonometric", from: 19, to: 25, title: "Section 3: Trigonometric limits",
    description: "Use squeezing, the fundamental sine limit, identities, and scaling to make trigonometric behavior predictable.",
    lens: "Can the expression be rewritten around a known small-angle limit, with every scaling factor accounted for?",
    mentalModel: "The fundamental sine limit is a reusable local shape: other trigonometric limits work when you expose that shape through identities and scaling.",
    decision: "Look for a bounded oscillation times a shrinking factor, or rewrite the expression into sine-over-angle factors whose arguments match their denominators.",
    commonTrap: "The sine function is not equal to its angle; their ratio merely approaches one near zero, and that statement requires radian measure.",
    checkpoint: "Mastery means you can mark every scaling factor before simplifying and can explain where the Squeeze Theorem enters the argument.",
  },
  {
    id: "infinite", from: 26, to: 32, title: "Section 4: Infinite behavior",
    description: "Read vertical, horizontal, and slant asymptotes through sign analysis and dominant-term reasoning.",
    lens: "Is the function growing without bound near a finite input, or settling into end behavior as the input grows?",
    mentalModel: "Vertical asymptotes describe local blow-up near an excluded finite input; end-behavior asymptotes describe the long-run trend as inputs grow in magnitude.",
    decision: "Near a denominator zero, build a sign chart for each side; at infinity, compare dominant powers or divide to expose the lasting term.",
    commonTrap: "Do not merge positive and negative infinity, and remember that square roots produce absolute values when factoring a large squared input.",
    checkpoint: "You understand the section when you can predict signs and asymptotes before doing detailed algebra, then verify them with the expression.",
  },
  {
    id: "continuity", from: 33, to: 41, title: "Section 5: Continuity",
    description: "Connect limits to function values, classify discontinuities, repair piecewise definitions, and use the Intermediate Value Theorem.",
    lens: "Do the limit, the function value, and the surrounding domain fit together at the point or across the interval?",
    mentalModel: "Continuity is a three-part agreement: the value exists, the two-sided limit exists, and those two quantities are equal.",
    decision: "At a point, test the three conditions in order; on an interval, check the domain and endpoints before invoking any continuity theorem.",
    commonTrap: "A sign change supports the Intermediate Value Theorem only when continuity holds on the entire closed interval, and it does not prove uniqueness.",
    checkpoint: "You are ready to continue when you can classify a break, decide whether one value can repair it, and state every IVT hypothesis aloud.",
  },
  {
    id: "formal", from: 42, to: 46, title: "Section 6: Formal limits",
    description: "Translate the intuitive neighborhood picture into epsilon-delta language, constructive proofs, graph windows, and counterexamples.",
    lens: "How small must the input window be to force every allowed output into the requested tolerance band?",
    mentalModel: "Epsilon sets the demanded vertical accuracy; delta is the horizontal promise you choose so every permitted nearby input meets that demand.",
    decision: "Work backward from the desired output inequality, isolate an input-distance bound, then state a positive delta that is no larger than that bound.",
    commonTrap: "A proof must control every eligible input in the punctured window; checking examples or choosing delta after seeing the input is not enough.",
    checkpoint: "Formal understanding means you can translate between bands, inequalities, and words, then verify the implication from delta to epsilon in forward order.",
  },
  {
    id: "synthesis", from: 47, to: 47, title: "Section 7: Synthesis",
    description: "Bring the unit together by choosing methods, explaining decisions, and correcting weak spots before an exam.",
    lens: "Can you diagnose the limit type and justify a method before beginning the algebra?",
    mentalModel: "A mixed problem is a classification task before it is a calculation: direction, substitution result, structure, and required conclusion determine the route.",
    decision: "Name the limit type and first legal move in a margin note, then solve and check whether the conclusion matches the graph or sign behavior.",
    commonTrap: "Pattern matching without diagnosis makes similar-looking problems blur together and hides whether the error was conceptual, algebraic, or strategic.",
    checkpoint: "You are exam-ready when you can choose a method without a section label, explain the choice, and correct a miss by naming its exact cause.",
  },
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
