import unit2a from "../../content/calculus/units/unit-2a/routes.public.json" with { type: "json" };
import unit2b from "../../content/calculus/units/unit-2b/routes.public.json" with { type: "json" };
import unit3a from "../../content/calculus/units/unit-3a/routes.public.json" with { type: "json" };
import unit3b from "../../content/calculus/units/unit-3b/routes.public.json" with { type: "json" };
import unit4a from "../../content/calculus/units/unit-4a/routes.public.json" with { type: "json" };
import { limitsUnitRoutes } from "./limits-unit-index.mjs";

const unitCollections = [unit2a, unit2b, unit3a, unit3b, unit4a];

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
export const supersededCalculusPaths = Object.freeze([
  "/subjects/math/calculus/sequences-series/",
  "/subjects/math/calculus/sequences-series/geometric-series/",
  "/subjects/math/calculus/sequences-series/choosing-convergence-test/",
]);
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

export const calculusUnitSearchRecords = calculusUnitRoutes.map((route) => {
  const unit = unitsById.get(route.unitId)?.unit;
  const unitLabel = unit ? `Unit ${unit.code}` : "Derivative unit";
  return {
    id: route.id,
    kind: practiceTypes.has(route.pageType) ? "practice" : route.pageType === "hub" ? "topic" : "guide",
    title: route.title.includes(unitLabel) ? route.title : `${route.title} — ${unitLabel}`,
    description: route.description,
    path: route.path,
    domainSlug: "calculus",
    domainName: "Calculus",
    topicName: `${unitLabel}: ${route.sectionTitle}`,
    label: `${unitLabel} · ${labelFor(route)}`,
    keywords: [...route.searchTerms, route.pageType, unitLabel, unit?.title ?? "", unit?.shortTitle ?? "", unit?.code?.startsWith("4") ? "sequence series convergence" : unit?.code?.startsWith("3") ? "integral" : "derivative", "calculus"].filter(Boolean),
    priority: route.pageType === "hub" ? 94 : practiceTypes.has(route.pageType) ? 91 : route.isCore ? 82 : 76,
  };
});

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

const unit2bSectionGuidance = Object.freeze({
  orientation: {
    lens: "Begin with the modeled quantity and the question it must answer; differentiation belongs in the middle of the translation, not at the beginning.",
    mentalModel: "An application moves from situation to variables, units, relationship, derivative objective, feasible domain, and finally a contextual claim.",
    decision: "Name what changes, with respect to what, and in which units before selecting a derivative method.",
    commonTrap: "Calculating a derivative of an unexamined formula and reporting a bare number that does not answer the situation.",
    checkpoint: "Can you state the variables, units, assumptions, relationship, and requested rate in complete sentences?",
  },
  interpretation: {
    lens: "Use the sign, size, units, and zeros of derivatives to tell a time-aligned story about motion or another changing quantity.",
    mentalModel: "Position, velocity, and acceleration are synchronized views: amount, rate of amount, and rate of the rate.",
    decision: "Separate direction from speed, and compare the signs of velocity and acceleration before describing speeding behavior.",
    commonTrap: "Treating negative velocity as slowing down or confusing a function's height with the slope of its graph.",
    checkpoint: "Can you interpret a first and second derivative at the same input without mixing their units or meanings?",
  },
  approximation: {
    lens: "A differentiable curve behaves like its tangent line over a small enough neighborhood, with concavity explaining the direction of error.",
    mentalModel: "Linearization, differentials, and Newton's method reuse one local line for estimation, uncertainty, or a better root guess.",
    decision: "Choose a nearby easy input, record the local slope, and state why the requested change is small enough for the model.",
    commonTrap: "Presenting a tangent estimate as exact or running Newton iterations without checking residuals and failure modes.",
    checkpoint: "Can you give the estimate, error direction, units, and a reason the local line is trustworthy here?",
  },
  "related-rates": {
    lens: "Freeze the geometry at one instant, but differentiate the relationship while every changing quantity is still a function of time.",
    mentalModel: "The picture supplies a constraint; implicit differentiation transmits known rates through that constraint to the unknown rate.",
    decision: "Draw and label first, write one relationship, differentiate with time, then substitute the snapshot measurements and rates.",
    commonTrap: "Substituting numerical dimensions before differentiating and thereby erasing the very change the problem asks about.",
    checkpoint: "Does your final rate have the predicted sign, the correct units, and a magnitude compatible with the diagram?",
  },
  "theorems-shape": {
    lens: "Turn derivative signs and theorem hypotheses into a defensible account of extrema, monotonicity, concavity, and global shape.",
    mentalModel: "Critical numbers divide the domain into testable intervals; endpoints and discontinuities keep local evidence from becoming an unjustified global claim.",
    decision: "List the domain and candidates, test derivative signs, compare endpoint values, and verify each theorem's hypotheses explicitly.",
    commonTrap: "Calling every point with f-prime zero an extremum or every point with f-double-prime zero an inflection point.",
    checkpoint: "Can every turn, bend, endpoint result, and asymptote in your sketch be traced to algebraic evidence?",
  },
  optimization: {
    lens: "Separate the objective from the constraint, reduce to one feasible variable, and interpret the winning candidate in the original design.",
    mentalModel: "Optimization is a modeling problem first: the derivative only compares candidates after the geometry, units, and feasible domain are correct.",
    decision: "Write variables and units, identify the objective, use the constraint to eliminate a variable, then test critical and boundary candidates.",
    commonTrap: "Optimizing the constraint, ignoring the feasible domain, or keeping an algebraic critical point that cannot exist in the real design.",
    checkpoint: "Have you compared every feasible candidate and explained why the result is physically and economically reasonable?",
  },
  lhopital: {
    lens: "Identify the limiting form before differentiating; transformation and simpler limit laws come before L'Hopital's Rule.",
    mentalModel: "The rule compares numerator and denominator growth only for verified zero-over-zero or infinity-over-infinity quotients.",
    decision: "Evaluate numerator and denominator limits separately, transform nonquotient forms, apply the rule only when justified, then recheck.",
    commonTrap: "Using L'Hopital because an expression looks difficult rather than because the required indeterminate quotient has been proved.",
    checkpoint: "Can you name the form at every application and explain why direct substitution or algebra is not already enough?",
  },
  modeling: {
    lens: "Treat each derivative model as a conditional claim whose variables, units, assumptions, calibration range, and limitations remain visible.",
    mentalModel: "A useful model connects a measurable input to a measurable output, while its derivative describes local sensitivity inside a stated domain.",
    decision: "Define the relationship and objective, differentiate, evaluate candidates or rates, then test sign, scale, units, and assumption sensitivity.",
    commonTrap: "Extending a fitted model outside its data range or presenting medication, stopping-distance, or business outputs without the assumptions that shape them.",
    checkpoint: "What observation would falsify the model, and how would the conclusion change if its strongest assumption failed?",
  },
  advanced: {
    lens: "Use local sensitivity, convexity, and convergence results to explain when familiar application methods become reliable global tools.",
    mentalModel: "Advanced results connect derivative evidence to error amplification, convergence speed, or global optimality under explicit hypotheses.",
    decision: "State the hypotheses before the conclusion and test the result on a concrete numerical or graphical example.",
    commonTrap: "Quoting elasticity, quadratic convergence, or convexity without checking units, root simplicity, or the relevant domain.",
    checkpoint: "Can you describe both what the theorem guarantees and the failure mode its hypotheses exclude?",
  },
  review: {
    lens: "Mixed applications remove the method label; classify the model, commit to a complete attempt, and diagnose the first wrong decision.",
    mentalModel: "A complete response includes setup, calculus, candidates or rates, units, interpretation, and a reasonableness check.",
    decision: "Choose the governing relationship before calculating, then use the attempt-gated answer as feedback rather than as a shortcut.",
    commonTrap: "Reading an answer before modeling the problem or treating every miss as algebra when the first error was conceptual.",
    checkpoint: "Can you defend the model and domain even before checking whether the final number matches?",
  },
  support: {
    lens: "Use reference and answer-key pages to diagnose and repair work after an honest attempt, then return to the exact lesson behind the error.",
    mentalModel: "A key is most useful when it identifies the first decision that diverged, not merely the final expression.",
    decision: "Compare one numbered response at a time, annotate the correction, and retry without the key open.",
    commonTrap: "Copying a finished solution without locating the modeling, theorem, or algebra decision that needs practice.",
    checkpoint: "Can you reproduce the reasoning independently and explain the units and assumptions in your own words?",
  },
});

const unit3aSectionGuidance = Object.freeze({
  orientation: {
    lens: "Read integration as accumulated contribution before treating the integral sign as a request for an antiderivative.",
    mentalModel: "A rate or density contributes a small amount on each short interval; integration adds those contributions while preserving sign and units.",
    decision: "Identify the accumulated quantity, input variable, interval, sign convention, and units before choosing a computational method.",
    commonTrap: "Jumping straight to symbolic rules without deciding what the integral represents or whether the answer should be a function, family, or number.",
    checkpoint: "Can you explain what is being accumulated and what units the result must have?",
  },
  "antiderivatives-change": {
    lens: "Connect every antiderivative to a derivative check, and every varying rate to a sum of rate-times-width contributions.",
    mentalModel: "Indefinite integration recovers a family of functions; definite accumulation combines signed local changes into one net change.",
    decision: "Ask whether the task wants a general antiderivative, an initial-condition solution, displacement, distance, or a numerical total from data.",
    commonTrap: "Omitting the arbitrary constant, confusing displacement with distance, or multiplying one changing rate by the entire interval.",
    checkpoint: "Can you differentiate your antiderivative and interpret the sign and units of a rate-based total?",
  },
  "riemann-definite": {
    lens: "Treat a definite integral as the limit of structured approximations, with the sample rule and sign visible in every rectangle.",
    mentalModel: "Partition, sample, multiply height by width, add, and then refine; the sum approaches a signed accumulated value.",
    decision: "Choose left, right, or midpoint samples from the prompt, predict bias from monotonicity, and distinguish net signed area from geometric area.",
    commonTrap: "Using the wrong endpoints, losing the common width, or adding magnitudes when the integral requires signed contributions.",
    checkpoint: "Can you construct the sum from a table or formula and predict whether it is high or low before calculating?",
  },
  "fundamental-theorem": {
    lens: "Use the Fundamental Theorem as the bridge between accumulation functions, local rates, and endpoint evaluation.",
    mentalModel: "Differentiating a running total recovers its current integrand, while evaluating an accumulated total subtracts antiderivative endpoint values.",
    decision: "Separate FTC Part I, FTC Part II, net change, and variable-bound chain-rule tasks before manipulating notation.",
    commonTrap: "Forgetting a chain-rule factor at a variable bound, reversing endpoint subtraction, or adding +C to a definite value.",
    checkpoint: "Can you state which part of the theorem applies and why its hypotheses and bounds fit?",
  },
  techniques: {
    lens: "Choose an integration method from the integrand's structure, then verify the result by differentiation.",
    mentalModel: "Substitution reverses a chain rule, parts reverses a product rule, and algebraic or trigonometric rewrites expose a recognizable derivative pattern.",
    decision: "Simplify first; look for an inner derivative; then consider parts, identities, trigonometric substitution, or partial fractions in a deliberate order.",
    commonTrap: "Choosing a method by surface appearance, transforming only part of the differential, or accepting a more complicated integral than the one you started with.",
    checkpoint: "Can you name the derivative rule being reversed and differentiate the final answer back to the integrand?",
  },
  "numerical-improper": {
    lens: "Make approximation error and limiting behavior explicit rather than hiding them behind a calculator result or an infinity symbol.",
    mentalModel: "Numerical rules replace a curve with simple local shapes; improper integrals replace a forbidden endpoint or infinite interval with a limit.",
    decision: "Choose the rule and partition, estimate scale and sign, or write the correct defining limit before evaluating.",
    commonTrap: "Treating an approximation as exact, using Simpson's Rule with an invalid partition, or substituting infinity as though it were a number.",
    checkpoint: "Can you defend the estimate's scale or the improper integral's convergence from a written calculation?",
  },
  review: {
    lens: "Mixed integral work tests recognition: classify the output and structure before committing to a method.",
    mentalModel: "A complete response carries setup, method, computation, bounds or constants, units, interpretation, and an independent verification.",
    decision: "Attempt the entire problem first, then use one answer at a time to locate the earliest reasoning decision that needs repair.",
    commonTrap: "Reading a key before modeling the problem or treating every mismatch as algebra when the first error was conceptual.",
    checkpoint: "Can you reproduce the reasoning without the key and explain why the final form fits the question?",
  },
});

const unit3bSectionGuidance = Object.freeze({
  orientation: {
    lens: "Begin with a physical or geometric contribution, then let the integral add those contributions across the whole object or interval.",
    mentalModel: "Every application follows the same architecture: choose a thin slice, express what that slice contributes, attach the differential, and accumulate over justified bounds.",
    decision: "Name the output, draw the geometry, choose a variable and slice orientation, then build units before choosing a formula.",
    commonTrap: "Selecting a memorized formula before deciding what one slice means, where its dimensions come from, or which interval actually covers the object.",
    checkpoint: "Can you describe one representative contribution in words and predict the final units before integrating?",
  },
  "area-volume": {
    lens: "Let the axis and slice orientation determine every distance; top-minus-bottom, right-minus-left, radii, and shell height must all come from the same picture.",
    mentalModel: "Area adds thin rectangles, slicing adds cross-sectional slabs, washers add annular slabs, and shells add thin cylindrical walls.",
    decision: "Sketch the region and axis, test vertical and horizontal slices, and choose the description that stays single-valued with the fewest interval splits.",
    commonTrap: "Measuring a radius from the wrong curve, subtracting boundaries in the wrong order, or mixing a shell radius with its height.",
    checkpoint: "Do the slice dimensions remain nonnegative on the full interval, and do their units multiply to area or volume?",
  },
  "length-mass": {
    lens: "Distinguish geometric size from weighted amount: arc and surface formulas stretch local distance, while density assigns unequal mass to equal pieces.",
    mentalModel: "Arc length adds short chord lengths; surface area adds narrow bands; mass adds density-times-size; moments add position-weighted mass.",
    decision: "Identify the local size element first, then multiply by circumference, density, or position only when the modeled quantity requires it.",
    commonTrap: "Using geometric midpoint for a nonuniform object, forgetting the surface radius, or treating differential legs as independent finite lengths.",
    checkpoint: "Can you explain why every factor belongs in the slice contribution and why the result has the intended units?",
  },
  "quantitative-applications": {
    lens: "Translate the situation into rate, density, force, pressure, or probability before calculating; the integral is the final accumulation step, not the first modeling decision.",
    mentalModel: "Work adds force through distance, pumping adds slice weight through lift distance, pressure adds depth-dependent strip force, and marginal or probability models add weighted local contributions.",
    decision: "Draw a coordinate system, define the slice at a general position, express every changing factor in one variable, and state the domain and units.",
    commonTrap: "Confusing mass density with weight density, measuring depth from the wrong reference, or integrating a marginal quantity without an initial value when a total function is requested.",
    checkpoint: "Does the setup respond correctly when the slice moves, and can a units or scale check expose a missing factor?",
  },
  review: {
    lens: "Mixed applications test modeling recognition: commit to a diagram and slice statement before looking for a familiar formula.",
    mentalModel: "A complete solution connects context, variable, bounds, slice contribution, integral, computation, units, interpretation, and a reasonableness check.",
    decision: "Classify the output and geometry first, solve from a blank start, then reveal one worked answer only to diagnose the earliest divergent decision.",
    commonTrap: "Reading a key before forming a setup or treating every wrong result as algebra when the real error was a radius, width, density, or bound.",
    checkpoint: "Can you rebuild the setup without the answer open and defend every factor in a sentence?",
  },
  support: {
    lens: "Use answer keys and reference pages after an honest attempt to isolate one modeling decision, then return to the exact lesson that repairs it.",
    mentalModel: "The value of a worked answer is the chain of choices from picture to contribution to integral—not merely the final number.",
    decision: "Compare one item at a time, mark the first different line, close the key, and reproduce the reasoning independently.",
    commonTrap: "Copying a polished calculation without learning how its variable, geometry, bounds, and units were chosen.",
    checkpoint: "Can you explain the corrected model and solve a nearby variation without consulting the key?",
  },
});

const unit4aSectionGuidance = Object.freeze({
  orientation: {
    lens: "Read the roadmap as a sequence of decisions: identify the object, test necessary conditions, then choose evidence that matches its structure.",
    mentalModel: "Sequences describe term behavior; series describe the limiting behavior of partial sums.",
    decision: "Name whether the question concerns terms, partial sums, convergence, a sum, or an error bound before calculating.",
    commonTrap: "Treating a series as an ordinary expression with infinity substituted into it.",
    checkpoint: "Can you distinguish a sequence term, a series term, and a partial sum in words and notation?",
  },
  sequences: {
    lens: "Track the integer domain, late-term behavior, monotonicity, bounds, and any recurrence before asserting a limit.",
    mentalModel: "A sequence converges when every sufficiently late term remains arbitrarily close to one finite target.",
    decision: "Use algebraic limits when a formula is explicit; use bounds and monotonicity when a recurrence hides the formula.",
    commonTrap: "Reading a finite plot as proof or solving a recurrence's fixed-point equation before proving convergence.",
    checkpoint: "Can you justify both the candidate limit and why the terms must approach it?",
  },
  "series-foundations": {
    lens: "Build every infinite sum from finite partial sums, and expose geometric or telescoping structure before taking a limit.",
    mentalModel: "A series converges exactly when its sequence of partial sums approaches a finite value.",
    decision: "Check the term limit first, then look for an exact partial-sum pattern before selecting a comparison test.",
    commonTrap: "Concluding convergence from terms approaching zero or canceling inside an unwritten infinite expression.",
    checkpoint: "Can you write the relevant finite partial sum and identify which terms survive?",
  },
  "positive-series-tests": {
    lens: "Compare positive terms by long-run size and select a benchmark whose convergence behavior is already known.",
    mentalModel: "Direct comparison transfers inequalities; limit comparison transfers asymptotic scale; the integral test links sums to accumulated area.",
    decision: "Use a clean inequality when available, asymptotic comparison when ratios stabilize, and the integral test when a matching decreasing function is natural.",
    commonTrap: "Reversing the direction needed to prove convergence or divergence, or forgetting an integral-test remainder condition.",
    checkpoint: "Does your benchmark support the conclusion in the direction you claim, and are all hypotheses stated?",
  },
  "signed-and-absolute-tests": {
    lens: "Separate sign behavior from magnitude, then use ratios or roots when powers and factorials dominate.",
    mentalModel: "Absolute convergence controls magnitude strongly enough to imply convergence; conditional convergence relies on cancellation.",
    decision: "Test absolute values first when practical, use the alternating-series hypotheses explicitly, and reserve ratio or root tests for matching algebraic structure.",
    commonTrap: "Calling any alternating-looking series convergent or treating a ratio/root limit of one as a verdict.",
    checkpoint: "Can you state whether convergence is absolute, conditional, divergent, or still undecided?",
  },
  "strategy-and-tails": {
    lens: "Choose tests from structure and interpret convergence through tails that can be made uniformly small.",
    mentalModel: "A convergent series has arbitrarily small late tails; test selection is a justified classification task, not a memorized order.",
    decision: "Simplify, apply the term test, classify signs and dominant structure, then choose the shortest conclusive argument.",
    commonTrap: "Trying tests mechanically without checking hypotheses or explaining why the chosen test fits.",
    checkpoint: "Can you defend the selected test and explain what its conclusion says about partial sums or tails?",
  },
  review: {
    lens: "Mixed work removes the method label; classify first, complete an honest attempt, then diagnose the earliest incorrect decision.",
    mentalModel: "A complete series argument includes hypotheses, a named theorem or comparison, its conclusion, and any requested sum or error estimate.",
    decision: "Identify the object and structure before computing, then use answer reveals only after recording a complete justification.",
    commonTrap: "Reading the key before choosing a test or treating a missing hypothesis as a minor presentation issue.",
    checkpoint: "Can you reproduce the argument without the key and explain why a tempting alternative test is weaker?",
  },
});

export function getCalculusUnitSectionGuidance(unitId, sectionId) {
  if (unitId === "calc-1-unit-2b-derivative-applications") return unit2bSectionGuidance[sectionId] ?? unit2bSectionGuidance.review;
  if (unitId === "calc-1-unit-3a-integral-foundations-techniques") return unit3aSectionGuidance[sectionId] ?? unit3aSectionGuidance.review;
  if (unitId === "calc-1-unit-3b-integration-applications") return unit3bSectionGuidance[sectionId] ?? unit3bSectionGuidance.review;
  if (unitId === "calc-2-unit-4a-sequences-infinite-series") return unit4aSectionGuidance[sectionId] ?? unit4aSectionGuidance.review;
  return calculusUnitSectionGuidance[sectionId] ?? calculusUnitSectionGuidance.review;
}
