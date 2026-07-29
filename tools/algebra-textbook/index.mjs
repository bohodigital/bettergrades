import { getLessonCase } from "./lesson-cases.mjs";
import { getExtraExamples } from "./extra-examples.mjs";
import { getUnitGuide } from "./unit-guides.mjs";

const sentence = (value) => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

function makeQuestions(lesson, lessonCases, guide) {
  const [lessonCase, secondCase, thirdCase] = lessonCases;
  const completeWork = (example) => `${example.steps.join(" ")} Therefore ${sentence(example.answer)} ${sentence(example.interpretation)}`;
  const entries = [
    [`Classify the mathematical object and requested action in this lesson case: ${lessonCase.prompt}`, `The object and action must agree with ${lesson.title.toLowerCase()} and the instruction in the prompt.`],
    [`State the central definition behind this outcome: ${lesson.outcome}`, sentence(lesson.outcome)],
    [`Before calculating, list every sign, endpoint, unit, grouping, or domain condition that can affect: ${lessonCase.prompt}`, guide.check],
    [`Explain why this opening move is valid: ${lessonCase.steps[0]}`, lessonCase.steps[0]],
    [lessonCase.prompt, lessonCase.answer],
    [secondCase.prompt, secondCase.answer],
    [thirdCase.prompt, thirdCase.answer],
    [`Verify the proposed result “${lessonCase.answer}” against the original statement.`, guide.check],
    [`Complete the calculation after “${secondCase.steps[0]}” in this problem: ${secondCase.prompt}`, secondCase.answer],
    [`Name and justify the most efficient first move, then solve: ${thirdCase.prompt}`, thirdCase.answer],
    [`Compare the methods used in these two cases and identify the structural reason they differ: ${secondCase.prompt} ${thirdCase.prompt}`, `${secondCase.interpretation} ${thirdCase.interpretation}`],
    [`Create the representation most useful for checking this result: ${secondCase.prompt} ${guide.representation}`, secondCase.answer],
    [`A learner reports “${lessonCase.answer}” but omits the original-condition check. Explain the risk before deciding whether the result is supported.`, guide.check],
    [`Repair a solution that skips “${thirdCase.steps[1]}” while solving: ${thirdCase.prompt}`, thirdCase.steps.join(" ")],
    [`In this ${lesson.title.toLowerCase()} case, change one numerical value, solve the revised problem, and identify which parts of the original method still apply: ${lessonCase.prompt}`, `A correct revision preserves the method’s structural conditions and includes a new original-condition check.`],
    [`Connect the opening situation “${sentence(lesson.opening)}” to the algebraic structure used in the worked case. Define quantities and units before writing any equation.`, lessonCase.interpretation],
    [`Explain why the method for ${lesson.title.toLowerCase()} is valid here and name one nearby problem where it would not apply.`, `${lessonCase.interpretation} The counterexample must violate a stated structural condition.`],
    [`Compare the conclusions of all three worked cases with this lesson outcome—${sentence(lesson.outcome)} Explain what remains invariant across them.`, lessonCases.map((example) => example.interpretation).join(" ")],
    [`Exit check: solve and verify without referring to the displayed steps. ${secondCase.prompt}`, secondCase.answer],
    [`Exit check: solve and verify without referring to the displayed steps. ${thirdCase.prompt}`, thirdCase.answer],
  ];
  return entries.map(([prompt, answer], index) => ({
    prompt,
    answer: sentence(answer),
    solution: index === 4
      ? completeWork(lessonCase)
      : index === 5 || index === 18
        ? completeWork(secondCase)
        : index === 6 || index === 19
          ? completeWork(thirdCase)
          : sentence(answer),
  }));
}

export function buildTextbookProfile(lesson, unit) {
  if (Number(unit.code.slice(1)) < 3) return null;
  const lessonCase = getLessonCase(lesson.id);
  const extraExamples = getExtraExamples(lesson.id);
  const guide = getUnitGuide(unit.code);
  if (!lessonCase) throw new Error(`Missing textbook worked case for ${lesson.id}.`);
  if (!extraExamples || extraExamples.length !== 2) throw new Error(`Missing two rigorous worked examples for ${lesson.id}.`);
  if (!guide) throw new Error(`Missing textbook unit guide for ${unit.code}.`);
  const lessonCases = [lessonCase, ...extraExamples];

  const methodTitle = `Solve ${lesson.title.toLowerCase()} from structure`;
  const exposition = [
    `${sentence(lesson.outcome)} The lesson is about a particular mathematical decision, not a keyword or a decorative notation pattern. In ${lesson.title.toLowerCase()}, first identify the object being studied and the information the answer must contain. Then mark the conditions that cannot be lost: these may include sign, endpoint inclusion, grouping, units, denominator restrictions, real-number domain, or the difference between an exact value and an approximation. A useful solution explains why its first move matches that structure.`,
    `${sentence(lesson.opening)} This opening is useful because it forces the quantities to acquire meaning before symbols compress them. Name the changing and fixed quantities, define any reference value or input interval, and decide what would count as a plausible result. An estimate, sign prediction, graph feature, or domain statement made before calculation becomes an independent check afterward. Without that prediction, algebra can be internally tidy while answering the wrong contextual question.`,
    `Consider the worked problem: ${sentence(lessonCase.prompt)} Begin with this justified move: ${sentence(lessonCase.steps[0])} Next, ${lessonCase.steps[1].charAt(0).toLowerCase()}${lessonCase.steps[1].slice(1)} Finally, ${lessonCase.steps[2].charAt(0).toLowerCase()}${lessonCase.steps[2].slice(1)} Each line should preserve the relevant relationship or deliberately produce candidates that are later tested. Skipping the middle line may hide the exact sign, factor, interval, or restriction on which the conclusion depends.`,
    `The result is ${sentence(lessonCase.answer)} ${sentence(lessonCase.interpretation)} A textbook answer does not stop at the last symbol. It states what the result means, includes units or set notation where required, and distinguishes a verified solution from a candidate. The original statement remains the final authority whenever the method includes a one-way operation, denominator clearing, squaring, graph estimation, regression, or numerical approximation.`,
    `${guide.representation} Changing representation is useful only when it exposes information rather than duplicating decoration. A table may reveal constant difference or ratio, a graph may reveal intersections or extrema, interval notation may compress a truth set, and factored or vertex form may expose a feature hidden in expanded form. The second representation must preserve the same values, restrictions, units, endpoints, and conclusions as the first.`,
    ...guide.principles.map((principle) => `${principle} For ${lesson.title.toLowerCase()}, connect this principle directly to the stated outcome: ${sentence(lesson.outcome)}`),
    `A common failure is: ${sentence(guide.misconception[0])} ${sentence(guide.misconception[1])} The repair is concrete: ${sentence(guide.misconception[2])} In the worked case, use the repair by checking “${lessonCase.answer}” against the original problem rather than trusting that the final line merely looks familiar.`,
    `${sentence(lessonCase.interpretation)} That conclusion is the bridge to the next lesson: the method matters because it preserves meaning while the representation changes. A durable summary therefore has four parts—classify the object, state the conditions, carry out one justified step at a time, and perform an independent check. If any of those parts is missing, return to the original quantities before adding more algebra.`,
  ];

  return {
    textbookEdition: "authored-v4",
    purpose: `Use the opening situation and three distinct, fully solved cases to learn ${lesson.title.toLowerCase()} as a connected mathematical idea rather than a memorized slogan.`,
    prerequisites: [
      `State the earlier definition or operation most directly connected to: ${lesson.outcome}`,
      `Classify the object in the worked prompt before choosing an operation: ${lessonCase.prompt}`,
      `Name the check you would use to reject an answer with the wrong sign, domain, units, endpoint, or graph behavior.`,
    ],
    exposition,
    method: {
      title: methodTitle,
      steps: lessonCase.steps,
      check: guide.check,
    },
    definitions: [
      [lesson.title, sentence(lesson.outcome), "Use the term only when the object satisfies the structural and domain conditions developed in this lesson."],
      ...guide.definitions,
    ],
    examples: lessonCases,
    misconception: guide.misconception,
    questions: makeQuestions(lesson, lessonCases, guide),
    takeaway: [
      `${sentence(lesson.outcome)} Use structure to choose the method, preserve every condition, and interpret the checked result.`,
      guide.check,
      lessonCase.interpretation,
    ],
  };
}

export function assertCompleteTextbookProfiles(lessons, unitsByCode) {
  const remaining = lessons.filter((lesson) => Number(lesson.unitCode.slice(1)) >= 3);
  const examplePrompts = new Set();
  for (const lesson of remaining) {
    const profile = buildTextbookProfile(lesson, unitsByCode.get(lesson.unitCode));
    const wordCount = profile.exposition.join(" ").match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu)?.length ?? 0;
    if (profile.exposition.length < 10) throw new Error(`${lesson.id} requires at least 10 textbook exposition paragraphs.`);
    if (wordCount < 650) throw new Error(`${lesson.id} requires at least 650 exposition words; found ${wordCount}.`);
    if (profile.examples.length !== 3) throw new Error(`${lesson.id} requires exactly three worked examples.`);
    if (new Set(profile.examples.map((example) => example.prompt)).size !== 3) throw new Error(`${lesson.id} requires three distinct worked examples.`);
    for (const example of profile.examples) {
      if (examplePrompts.has(example.prompt)) throw new Error(`Worked-example prompt is duplicated across lessons: ${example.prompt}`);
      examplePrompts.add(example.prompt);
      if (example.steps.length < 3 || !example.answer || !example.interpretation) throw new Error(`${lesson.id} has an incomplete worked example: ${example.prompt}`);
    }
    if (profile.questions.length !== 20) throw new Error(`${lesson.id} requires exactly twenty authored practice questions.`);
  }
  if (examplePrompts.size !== remaining.length * 3) throw new Error(`Expected ${remaining.length * 3} unique worked examples; found ${examplePrompts.size}.`);
  return remaining.length;
}
