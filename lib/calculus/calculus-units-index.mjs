import unit2a from "../../content/calculus/units/unit-2a/routes.public.json" with { type: "json" };
import { limitsUnitRoutes } from "./limits-unit-index.mjs";

const unitCollections = [unit2a];

export const calculusUnits = Object.freeze([
  {
    id: "calc-1-unit-1-limits-continuity",
    code: "1",
    title: "Unit 1: Limits and Continuity",
    shortTitle: "Limits and Continuity",
    root: "/subjects/math/calculus/limits-continuity/",
    routeCount: limitsUnitRoutes.length,
    coreRouteCount: limitsUnitRoutes.filter((route) => route.isCoreSequence).length,
    problemCount: limitsUnitRoutes.reduce((count, route) => count + route.checkIds.length, 0),
    visualCount: 13,
    releaseState: "public",
  },
  ...unitCollections.map(({ unit }) => ({ ...unit, releaseState: "public" })),
]);

export const calculusUnitRoutes = Object.freeze(unitCollections.flatMap(({ routes }) => routes));
const routesByPath = new Map(calculusUnitRoutes.map((route) => [route.path, route]));
const unitsById = new Map(unitCollections.map((collection) => [collection.unit.id, collection]));

const practiceTypes = new Set(["answer-key", "diagnostic", "exam", "practice", "quiz"]);
const labelFor = (route) => {
  if (route.pageType === "answer-key") return "Answer key";
  if (route.pageType === "exam") return "Practice exam";
  if (route.pageType === "quiz") return "Concept quiz";
  if (route.pageType === "diagnostic") return "Diagnostic";
  if (route.pageType === "practice") return "Practice set";
  if (route.pageType === "review") return "Review";
  if (route.pageType === "reference") return "Reference";
  if (route.pageType === "hub") return "Unit map";
  if (route.pageType === "exploration") return "Advanced exploration";
  return "Lesson";
};

export const calculusUnitSearchRecords = calculusUnitRoutes.map((route) => ({
  id: route.id,
  kind: practiceTypes.has(route.pageType) ? "practice" : route.pageType === "hub" ? "topic" : "guide",
  title: route.title,
  description: route.description,
  path: route.path,
  domainSlug: "calculus",
  domainName: "Calculus",
  topicName: route.sectionTitle,
  label: labelFor(route),
  keywords: [...route.searchTerms, route.pageType, "derivative", "calculus"],
  priority: route.pageType === "hub" ? 94 : practiceTypes.has(route.pageType) ? 91 : route.isCore ? 82 : 76,
}));

export const calculusUnitPracticeRoutes = calculusUnitRoutes.filter((route) => practiceTypes.has(route.pageType));

export function getCalculusUnitRoute(path) {
  return routesByPath.get(path);
}

export function getCalculusUnitCollection(unitId) {
  return unitsById.get(unitId);
}

export function getCalculusUnitForPath(path) {
  const route = getCalculusUnitRoute(path);
  return route ? unitsById.get(route.unitId) : undefined;
}

export function isCalculusUnitPath(path) {
  return routesByPath.has(path);
}

export const calculusUnitSectionGuidance = Object.freeze({
  orientation: {
    lens: "Treat the derivative as a local response rate before treating it as a formula.",
    mentalModel: "A function reports an amount; its derivative reports how that amount responds to a small input change.",
    decision: "Check prerequisites, identify the input and output, and attach units before calculating.",
    commonTrap: "Reading derivative notation as an ordinary fraction or skipping the limit meaning.",
    checkpoint: "Can you explain what a derivative value means in one complete sentence with units?",
  },
  foundations: {
    lens: "Watch a secant slope stabilize into a tangent slope and then generalize from one point to a derivative function.",
    mentalModel: "A derivative exists when shrinking two-point slopes settle to one finite local slope.",
    decision: "Choose whether the task asks for a value at one point, a full derivative function, or an estimate from data.",
    commonTrap: "Confusing the graph's height with its slope or assuming continuity automatically gives differentiability.",
    checkpoint: "Can you move among a limit definition, tangent slope, graph estimate, and units without changing the meaning?",
  },
  rules: {
    lens: "Every rule is a compressed limit calculation; choose the structure before doing algebra.",
    mentalModel: "Sums contribute independently, products have two changing contributions, and quotients must account for a changing denominator.",
    decision: "Name the outermost algebraic structure, then apply the smallest rule set that preserves it.",
    commonTrap: "Applying a familiar rule to the wrong outer structure or simplifying after a differentiation error.",
    checkpoint: "Can you justify the primary rule before writing the first derivative symbol?",
  },
  "special-functions": {
    lens: "Connect each derivative formula to the function's characteristic growth, periodicity, or inverse relationship.",
    mentalModel: "Special-function rules preserve recognizable shapes while scaling them by a function-specific factor.",
    decision: "Identify the function family first, then check whether a composition requires the chain rule too.",
    commonTrap: "Using a power rule on an exponential or forgetting base and domain conditions for logarithms.",
    checkpoint: "Can you distinguish a power, exponential, logarithmic, and trigonometric derivative at a glance?",
  },
  "chain-rule": {
    lens: "Read nested functions from the outside inward, but multiply local response factors through every layer.",
    mentalModel: "A small input change passes through a sequence of machines; the total response multiplies the response at each stage.",
    decision: "List the layers, differentiate one layer at a time, and stop only when every input-dependent layer contributes.",
    commonTrap: "Differentiating the outside and leaving the inside unchanged without its derivative factor.",
    checkpoint: "Can you annotate every factor in your derivative with the layer that produced it?",
  },
  "implicit-inverse": {
    lens: "Track which variable depends on which and use reciprocal or logarithmic structure only where its conditions hold.",
    mentalModel: "Implicit equations constrain variables together; inverse functions exchange inputs and outputs; logarithms turn products and powers into sums.",
    decision: "Choose implicit, inverse, or logarithmic differentiation from the equation's representation, not from surface complexity.",
    commonTrap: "Dropping a y-prime factor, using a reciprocal slope at the wrong point, or ignoring domain restrictions.",
    checkpoint: "Can you identify the correspondence point and all hidden dependencies before differentiating?",
  },
  "higher-derivatives": {
    lens: "Treat repeated derivatives as repeated questions about change, not as superscripts to manipulate mechanically.",
    mentalModel: "Each derivative creates a new function whose own rate of change may carry a new interpretation.",
    decision: "Simplify between stages, keep notation and units consistent, and verify patterns before generalizing.",
    commonTrap: "Losing factors across repeated chain rules or confusing an exponent with derivative order.",
    checkpoint: "Can you state what each derivative order measures and compute it without skipping structure?",
  },
  review: {
    lens: "Mixed practice tests recognition: the page title no longer tells you which rule to use.",
    mentalModel: "A dependable solution separates interpretation, rule selection, calculation, and verification.",
    decision: "Classify first, calculate second, and use answer reveals to diagnose the first incorrect decision.",
    commonTrap: "Reading the solution before making a complete attempt or treating every miss as mere algebra.",
    checkpoint: "Can you explain why your method fits before comparing your final answer?",
  },
  advanced: {
    lens: "Use these optional explorations to see the deeper analysis behind familiar derivative rules.",
    mentalModel: "Differentiability is a local linear approximation property with consequences beyond computation.",
    decision: "Return here after the core path is secure, and connect each abstraction to a concrete derivative example.",
    commonTrap: "Collecting formal language without linking it to the local linear model it describes.",
    checkpoint: "Can you restate the advanced claim in ordinary language and test it on an example?",
  },
});
