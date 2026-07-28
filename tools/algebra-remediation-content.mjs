const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const sentence = (value) => {
  const text = normalize(value);
  return /[.!?]$/.test(text) ? text : `${text}.`;
};
const slug = (value) => normalize(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CASES = [
  {
    matches: /signed|absolute value|interval|inequalit/i,
    prompt: "Solve and represent −2x + 3 > 7.",
    steps: ["Subtract 3 from both sides to obtain −2x > 4.", "Divide by −2 and reverse the order symbol.", "Check one value from the proposed set in the original inequality."],
    answer: "x < −2",
    interpretation: "The solution is every number to the left of −2 on a number line; −2 is not included.",
  },
  {
    matches: /fraction|ratio|rate|percent|proportion|variation/i,
    prompt: "A recipe uses 3 cups of water for 5 cups of flour. Find the water needed for 20 cups of flour.",
    steps: ["Write the ordered ratio 3/5 = w/20.", "Multiply both sides by 20.", "Check that 12/20 reduces to 3/5."],
    answer: "12 cups of water",
    interpretation: "The scale factor from 5 to 20 is 4, so the water quantity also scales by 4.",
  },
  {
    matches: /factor|prime|polynomial|special product|distribution|terms|coefficient/i,
    prompt: "Factor x² − 5x + 6 completely and verify the result.",
    steps: ["Find two integers whose product is 6 and whose sum is −5.", "Write the product (x − 2)(x − 3).", "Expand to recover x² − 5x + 6."],
    answer: "(x − 2)(x − 3)",
    interpretation: "The factors expose the zeros 2 and 3 while expansion confirms equivalence.",
  },
  {
    matches: /quadratic|parabola|completing the square|discriminant|square-root method/i,
    prompt: "Solve x² − 5x + 6 = 0 and identify the corresponding horizontal intercepts.",
    steps: ["Factor the quadratic as (x − 2)(x − 3).", "Apply the zero-product property.", "Check both values in the original equation."],
    answer: "x = 2 or x = 3; intercepts (2, 0) and (3, 0)",
    interpretation: "The algebraic roots and the graph’s horizontal intercepts name the same inputs.",
  },
  {
    matches: /rational expression|denominator|rational equation|rationaliz|conjugate|radical/i,
    prompt: "Simplify (x² − 9)/(x − 3) and preserve the original restriction.",
    steps: ["Factor the numerator as (x − 3)(x + 3).", "Cancel the common nonzero factor x − 3.", "Retain the restriction inherited from the original denominator."],
    answer: "x + 3, with x ≠ 3",
    interpretation: "The simplified expression agrees with the original wherever the original expression is defined.",
  },
  {
    matches: /exponent|power|root|scientific notation/i,
    prompt: "Simplify 2³ · 2² and explain the exponent law used.",
    steps: ["Recognize five repeated factors of 2.", "Add the exponents because the bases match.", "Evaluate 2⁵."],
    answer: "2⁵ = 32",
    interpretation: "Multiplying powers with the same base combines their repeated factors.",
  },
  {
    matches: /exponential|logarithm|geometric|compound interest|growth|decay/i,
    prompt: "Solve 2ˣ = 8 and express the same relationship with a logarithm.",
    steps: ["Rewrite 8 as 2³.", "Equate exponents because the positive bases match.", "Translate the exponential statement into inverse-operation notation."],
    answer: "x = 3 and log₂(8) = 3",
    interpretation: "The logarithm names the exponent needed to produce 8 from base 2.",
  },
  {
    matches: /system|simultaneous|elimination|substitution/i,
    prompt: "Solve the system x + y = 7 and x − y = 1.",
    steps: ["Add the equations to eliminate y and obtain 2x = 8.", "Solve x = 4, then substitute to find y = 3.", "Check (4, 3) in both equations."],
    answer: "(4, 3)",
    interpretation: "The ordered pair is the single point that satisfies both conditions.",
  },
  {
    matches: /slope|line|linear|intercept|coordinate|residual/i,
    prompt: "Find the slope and equation of the line through (1, 3) and (4, 9).",
    steps: ["Compute the vertical change 9 − 3 and horizontal change 4 − 1.", "Form the ratio 6/3 = 2.", "Use y − 3 = 2(x − 1) and simplify."],
    answer: "slope 2; y = 2x + 1",
    interpretation: "The output rises 2 units for every 1-unit increase in the input.",
  },
  {
    matches: /function|domain|range|piecewise|relation/i,
    prompt: "For f(x) = 2x² − 3, find f(2) and state what the result means.",
    steps: ["Replace every x with 2 while preserving grouping.", "Compute 2(2²) − 3.", "Pair the input with its resulting output."],
    answer: "f(2) = 5",
    interpretation: "The function assigns the output 5 to the input 2.",
  },
  {
    matches: /equation|solution|formula|substitution|evaluation|equality/i,
    prompt: "Solve 3x + 5 = 20 and verify the solution.",
    steps: ["Subtract 5 from both sides.", "Divide both sides by 3.", "Substitute the result into the original equation."],
    answer: "x = 5",
    interpretation: "The value 5 makes both sides of the original equation equal to 20.",
  },
  {
    matches: /whole-number|estimation|place value|operation|order of operations/i,
    prompt: "Estimate and then calculate 198 × 31.",
    steps: ["Round to 200 × 30 for an estimate of 6,000.", "Compute 198(30 + 1).", "Compare the exact result with the estimate."],
    answer: "6,138; the estimate 6,000 is plausible",
    interpretation: "The exact product is close to the order-of-magnitude estimate, so no scale error is evident.",
  },
  {
    matches: /unit|dimension|model|quantity|variable/i,
    prompt: "A car travels 180 miles in 3 hours. Find the unit rate and predict the distance in 5 hours at that rate.",
    steps: ["Divide distance by time to obtain miles per hour.", "Multiply the unit rate by 5 hours.", "Cancel hours and retain miles."],
    answer: "60 miles per hour; 300 miles",
    interpretation: "The units show both the rate and the predicted distance are dimensionally consistent.",
  },
  {
    matches: /complex number/i,
    prompt: "Simplify (3 + 2i)(3 − 2i).",
    steps: ["Recognize a conjugate product.", "Use (a + b)(a − b) = a² − b².", "Replace i² with −1."],
    answer: "13",
    interpretation: "Multiplying conjugates removes the imaginary terms and produces a real number.",
  },
];

const DEFAULT_CASE = {
  prompt: "Classify 3x + 5 = 20, solve it, and name the check that confirms the result.",
  steps: ["Identify the object as an equation in one variable.", "Use inverse operations to isolate x.", "Substitute the result into the original statement."],
  answer: "It is a linear equation; x = 5; substitution gives 20 = 20.",
  interpretation: "Correct classification selects a valid method, and the check confirms the candidate is a solution.",
};

function workedCase(lesson) {
  return CASES.find((candidate) => candidate.matches.test(`${lesson.title} ${lesson.outcome}`)) ?? DEFAULT_CASE;
}

function concreteExamples(lesson, unit) {
  const item = workedCase(lesson);
  return [
    {
      kind: "foundation",
      prompt: item.prompt,
      steps: item.steps,
      answer: item.answer,
      interpretation: item.interpretation,
    },
    {
      kind: "representation",
      prompt: `Represent the result of this ${lesson.title.toLowerCase()} case in a second form: ${item.prompt}`,
      steps: [
        "Complete the calculation or classification before changing representations.",
        "Choose a table, graph, number line, diagram, or equivalent symbolic form that preserves the same quantities.",
        "Label the input, output, units, restrictions, or endpoints that carry mathematical meaning.",
      ],
      answer: `A correctly labeled second representation that preserves ${item.answer}.`,
      interpretation: `The second form must communicate the same relationship, not merely repeat the symbols from the first form.`,
    },
    {
      kind: "transfer",
      prompt: `A classmate reaches “${item.answer}” in a ${unit.title.toLowerCase()} problem. Decide whether the reasoning is valid and justify the decision from the original conditions.`,
      steps: [
        "Restate the original condition and identify any domain, unit, sign, or equivalence requirement.",
        "Reproduce the decisive operation using the worked case.",
        "Check the proposed result against the original statement and explain the conclusion.",
      ],
      answer: `The result is valid only when the reproduced work and original-condition check both support ${item.answer}.`,
      interpretation: `A transferred method is complete only after its conditions and conclusion are checked in context.`,
    },
  ];
}

function buildQuestions(lesson, unit) {
  const item = workedCase(lesson);
  const purposes = [
    "retrieval", "retrieval", "concept", "concept",
    "procedure", "procedure", "procedure", "procedure", "procedure", "procedure",
    "representation", "representation", "error-analysis", "transfer", "modeling", "exit",
  ];
  const difficulties = ["foundation", "foundation", "standard", "standard", "standard", "standard", "mixed", "mixed", "standard", "mixed", "mixed", "transfer", "mixed", "transfer", "transfer", "standard"];
  const promptBuilders = [
    () => `Before using a formula, classify the mathematical objects and quantities in this case: ${item.prompt}`,
    () => `State the condition, restriction, unit, or sign rule that must be preserved while answering: ${item.prompt}`,
    () => `Explain why the first step “${item.steps[0]}” is valid for ${lesson.title.toLowerCase()}.`,
    () => `Compare the lesson outcome with this case and identify the exact relationship being used: ${item.prompt}`,
    () => item.prompt,
    () => `Complete the worked case independently, showing the step between “${item.steps[0]}” and “${item.steps.at(-1)}”: ${item.prompt}`,
    () => `Use a different valid method to answer the same case, then compare it with the supplied sequence: ${item.prompt}`,
    () => `Check the proposed result “${item.answer}” in the original condition and report the evidence.`,
    () => `Rewrite the case in an equivalent form before solving it: ${item.prompt}`,
    () => `Identify the most efficient first move, carry it out, and finish the calculation: ${item.prompt}`,
    () => `Create a labeled table, graph, number line, or diagram that communicates the result “${item.answer}.”`,
    () => `Translate this case into a second representation and explain which feature stays invariant: ${item.prompt}`,
    () => `A learner skips the original-condition check and reports “${item.answer}.” Explain what could go wrong and repair the work.`,
    () => `Change one numerical value in the case, solve the revised problem, and explain which steps remain valid: ${item.prompt}`,
    () => `Write a short real-world situation modeled by the same relationship as this case, including units where they apply: ${item.prompt}`,
    () => `Exit check: answer the case and give one sentence explaining why the result fits the lesson outcome: ${item.prompt}`,
  ];
  return purposes.map((purpose, index) => {
    const number = index + 1;
    return {
      id: `${slug(lesson.id)}-q${String(number).padStart(2, "0")}`,
      lessonId: lesson.id,
      unitCode: unit.code,
      prompt: promptBuilders[index](),
      responseType: "open-response",
      skill: lesson.outcome,
      purpose,
      difficulty: difficulties[index],
      hint: index < 4 ? `Name what ${lesson.title.toLowerCase()} requires before doing arithmetic.` : `Start from the original condition, preserve its structure, and use the lesson’s worked case as a check.`,
      errorTags: [`${slug(lesson.title)}-structure`, `${slug(unit.code)}-unchecked-result`],
      remediationPath: lesson.path,
      units: /unit|rate|percent|distance|interest/i.test(`${lesson.title} ${lesson.outcome}`) ? "Preserve and report the units named in the prompt." : null,
      roundingPolicy: "Keep exact form unless the prompt explicitly requests an approximation.",
      seedPolicy: { deterministic: true, source: lesson.id, variant: number },
      solutionRef: `solution:${slug(lesson.id)}:q${String(number).padStart(2, "0")}`,
    };
  });
}

export function buildLessonArtifacts({ lesson, unit, figures, families, previous, next }) {
  const examples = concreteExamples(lesson, unit);
  const questions = buildQuestions(lesson, unit);
  const figureDescriptions = figures.map((figure) => sentence(figure.description));
  const publicFigures = figures.map(({ role: _privateRole, ...figure }) => figure);
  const publicLesson = {
    id: lesson.id,
    unitCode: lesson.unitCode,
    sequence: lesson.sequence,
    title: lesson.title,
    path: lesson.path,
    outcome: lesson.outcome,
    opening: {
      prompt: sentence(lesson.opening),
      purpose: `Use a concrete situation to identify the quantities and decision that make ${lesson.title.toLowerCase()} necessary.`,
    },
    prerequisiteChecks: [
      `Name the known quantity, the unknown quantity, and any units in the opening situation.`,
      `Classify the central object as an expression, equation, inequality, relation, function, or numerical comparison.`,
      `State one earlier rule or representation you would use to check a result for ${lesson.title.toLowerCase()}.`,
    ],
    exposition: [
      `${sentence(lesson.outcome)} Begin by naming the mathematical objects before manipulating them. In ${lesson.title.toLowerCase()}, notation compresses a relationship among quantities; it does not replace that relationship. Track what each symbol represents, preserve grouping and units, and mark any restriction or endpoint as soon as it appears. The first useful question is therefore not “Which memorized move do I use?” but “What must remain true from one line or representation to the next?”`,
      `${figureDescriptions[0] ?? `The first figure for ${lesson.title} displays the governing quantities.`} Read the labels as mathematical evidence: identify what is fixed, what changes, and how the objects are related. Then connect that evidence to the symbolic work one justified step at a time. A correct transformation preserves the relevant value, truth set, rate, domain, or geometric feature. If a step changes one of those, it needs a stated condition and a check against the original problem.`,
      `${figureDescriptions[1] ?? `A second representation makes the mechanism visible.`} Use the worked examples to compare symbolic, numerical, and visual forms. Each form should answer the same question, even when it emphasizes a different feature. Finish by interpreting the result in a complete sentence and checking it with substitution, estimation, units, graph position, or an inverse operation. That final check distinguishes a plausible-looking candidate from a supported conclusion.`,
    ],
    definitions: [
      {
        term: lesson.title,
        definition: `${sentence(lesson.outcome)} The term names the lesson’s central relationship and the conditions under which its methods are valid.`,
        conditions: `Preserve the original domain, units, grouping, direction, and equivalence conditions whenever they apply.`,
      },
      {
        term: "valid transformation",
        definition: "A justified change of form that preserves the value, truth set, relationship, or solution information required by the original problem.",
        conditions: "One-way operations can create candidates and therefore require checking in the original statement.",
      },
    ],
    examples,
    figures: publicFigures,
    misconceptions: [
      {
        wrongMove: `Manipulating the symbols in a ${lesson.title.toLowerCase()} problem before identifying the quantities and governing condition.`,
        whyItFails: `That move can lose a sign, unit, endpoint, denominator restriction, grouping symbol, or other condition that the outcome explicitly requires.`,
        repair: `Annotate the original condition, perform one justified step, and check the conclusion using ${workedCase(lesson).interpretation.toLowerCase()}`,
      },
    ],
    checkpoint: {
      id: questions[15].id,
      prompt: questions[15].prompt,
      responseType: questions[15].responseType,
    },
    exercises: questions.map((question) => question.id),
    practiceQuestions: questions,
    exitCheck: [questions[14].id, questions[15].id],
    takeaway: {
      summary: `${sentence(lesson.outcome)} A complete solution names the relationship, preserves its conditions, and verifies the conclusion.`,
      conditions: ["Keep original restrictions and units visible.", "Use an independent check whenever an operation may create candidates or lose information."],
    },
    navigation: {
      unit: unit.root,
      previous: previous?.path ?? null,
      next: next?.path ?? null,
      practice: unit.practiceRoute,
    },
    sources: [
      {
        sourceId: "bettergrades-algebra-storyboard-v2",
        use: "Original scope, lesson outcome, narrative opening, and route placement.",
        rights: "BetterGrades-owned editorial composition; named external references remain rights-separated and are not reproduced.",
      },
    ],
    previous: previous ? { title: previous.title, path: previous.path } : null,
    next: next ? { title: next.title, path: next.path } : null,
  };
  const privateAuthoring = {
    lessonId: lesson.id,
    storyBeat: lesson.storyBeat,
    exampleTargets: lesson.examples,
    visualBriefs: figures.map((figure) => `${figure.role}: ${figure.description}`),
    exerciseFamilies: families.map((family) => `${family.id}: ${family.purpose} (${family.recommendedCount})`),
    editorialChecks: ["Public lesson schema complete", "Concrete question bank materialized", "Protected solutions remain server-only"],
    private: true,
  };
  const solutions = questions.map((question) => ({
    id: question.solutionRef,
    questionId: question.id,
    expectedAnswer: workedCase(lesson).answer,
    acceptedAlternatives: ["Equivalent exact forms and complete verbal explanations supported by the shown work."],
    detailedRubric: `The response must address ${lesson.outcome.toLowerCase()} Credit the method, preservation of relevant conditions, a supported conclusion, and an explicit check. Do not award full credit for an unsupported final value.`,
    completeSolution: `${workedCase(lesson).steps.join(" ")} Therefore ${workedCase(lesson).answer}. ${workedCase(lesson).interpretation}`,
    gradingBoundary: "Open responses receive rubric-guided review after a substantive attempt.",
    parserRules: "No automatic exact-string grading for open responses.",
  }));
  return { publicLesson, privateAuthoring, questions, solutions };
}

export function exactAssessmentCount(questionCount) {
  const count = Number.parseInt(String(questionCount).match(/\d+/)?.[0] ?? "1", 10);
  return Number.isFinite(count) && count > 0 ? count : 1;
}

export function publicAssessmentKind(kind) {
  if (kind === "performance-task") return "investigation";
  if (kind === "exam" || kind === "diagnostic") return "final";
  return kind;
}

export function buildVisualSemanticManifest(brief, lesson) {
  const description = sentence(brief.description);
  const words = normalize(brief.description).split(" ").filter((word) => word.length > 3).slice(0, 8);
  return {
    id: brief.id,
    lessonId: brief.lessonId,
    route: brief.path,
    learningClaim: `${description} The visible mathematical objects support the lesson outcome: ${lesson.outcome}`,
    requiredObjects: [description],
    requiredLabels: [lesson.title, ...words.slice(0, 3)],
    requiredRelationships: [`The rendered objects visibly communicate: ${description}`],
    units: /unit|rate|distance|time|percent/i.test(description) ? ["Use the units named by the figure."] : [],
    domain: /graph|function|line|parabola|number line/i.test(description) ? { visible: true, boundedViewport: true } : null,
    interactionVariables: brief.interactive ? ["p"] : [],
    forbiddenForms: ["generic three-panel scaffold", "unlabeled mathematical objects", "decorative arrows without a mathematical relationship"],
    renderer: brief.interactive ? "bg-interactive-2d" : "static-svg",
    staticFallback: { equivalent: true, initialState: brief.interactive ? "The initial parameter state shown in the authored scene." : "The complete static scene." },
    accessibility: {
      summary: `${lesson.title}: ${description}`,
      longDescription: `${description} Read the labeled objects in spatial order and connect their mathematical relationship to ${lesson.outcome.toLowerCase()}`,
      readingOrder: ["visual title", "mathematical objects", "relationship annotation", "caption"],
    },
    assertions: [
      { type: "required_text", value: lesson.title },
      { type: "required_layer_count", value: 4 },
      { type: "forbidden_generic_scaffold", value: true },
      { type: "static_fallback_equivalent", value: true },
      { type: "max_bytes", value: 50000 },
    ],
  };
}
