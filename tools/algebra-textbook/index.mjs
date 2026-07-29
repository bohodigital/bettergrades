import { getLessonCase } from "./lesson-cases.mjs";
import { getUnitGuide } from "./unit-guides.mjs";

const sentence = (value) => {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

function makeQuestions(lesson, lessonCase, guide) {
  const completeWork = `${lessonCase.steps.join(" ")} Therefore ${sentence(lessonCase.answer)} ${sentence(lessonCase.interpretation)}`;
  const entries = [
    [`Classify the mathematical object and requested action in this lesson case: ${lessonCase.prompt}`, `The object and action must agree with ${lesson.title.toLowerCase()} and the instruction in the prompt.`],
    [`State the central definition behind this outcome: ${lesson.outcome}`, sentence(lesson.outcome)],
    [`Before calculating, list every sign, endpoint, unit, grouping, or domain condition that can affect: ${lessonCase.prompt}`, guide.check],
    [`Explain why this opening move is valid: ${lessonCase.steps[0]}`, lessonCase.steps[0]],
    [lessonCase.prompt, lessonCase.answer],
    [`Complete the calculation after the first step “${lessonCase.steps[0]}” and show the missing algebra.`, lessonCase.answer],
    [`Solve the worked case independently, using a second valid organization when one is available: ${lessonCase.prompt}`, lessonCase.answer],
    [`Verify the proposed result “${lessonCase.answer}” against the original statement.`, guide.check],
    [`Rewrite the worked case in the form or notation that most clearly exposes the lesson outcome: ${lessonCase.prompt}`, lessonCase.answer],
    [`Name the most efficient first move for this problem and justify it from structure: ${lessonCase.prompt}`, lessonCase.steps[0]],
    [`Build the second representation requested here: ${guide.representation} Use the worked case ${lessonCase.prompt}`, lessonCase.answer],
    [`For ${lesson.title.toLowerCase()}, explain which value, truth set, rate, domain, or graph feature must remain invariant between the two representations of this case: ${lessonCase.prompt}`, lessonCase.interpretation],
    [`A learner reports “${lessonCase.answer}” but omits the original-condition check. Explain the risk before deciding whether the result is supported.`, guide.check],
    [`Repair a solution that performs the final step before completing “${lessonCase.steps[1]}” in the worked case.`, lessonCase.steps.join(" ")],
    [`In this ${lesson.title.toLowerCase()} case, change one numerical value, solve the revised problem, and identify which parts of the original method still apply: ${lessonCase.prompt}`, `A correct revision preserves the method’s structural conditions and includes a new original-condition check.`],
    [`Connect the opening situation “${sentence(lesson.opening)}” to the algebraic structure used in the worked case. Define quantities and units before writing any equation.`, lessonCase.interpretation],
    [`Explain why the method for ${lesson.title.toLowerCase()} is valid here and name one nearby problem where it would not apply.`, `${lessonCase.interpretation} The counterexample must violate a stated structural condition.`],
    [`Compare the answer to ${lessonCase.prompt} with this lesson outcome—${sentence(lesson.outcome)} Explain what the answer reveals rather than merely restating it.`, lessonCase.interpretation],
    [`Exit check: solve and verify the complete worked case without referring to the displayed steps. ${lessonCase.prompt}`, lessonCase.answer],
    [`Exit check: write a compact method-and-check summary for ${lesson.title.toLowerCase()}, using the worked case as evidence.`, `${lessonCase.steps.join(" ")} ${guide.check}`],
  ];
  return entries.map(([prompt, answer], index) => ({
    prompt,
    answer: sentence(answer),
    solution: index === 4 || index === 5 || index === 6 || index === 18 ? completeWork : sentence(answer),
  }));
}

export function buildTextbookProfile(lesson, unit) {
  if (Number(unit.code.slice(1)) < 3) return null;
  const lessonCase = getLessonCase(lesson.id);
  const guide = getUnitGuide(unit.code);
  if (!lessonCase) throw new Error(`Missing textbook worked case for ${lesson.id}.`);
  if (!guide) throw new Error(`Missing textbook unit guide for ${unit.code}.`);

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
    textbookEdition: "authored-v3",
    purpose: `Use the opening situation and a fully checked worked case to learn ${lesson.title.toLowerCase()} as a connected mathematical idea rather than a memorized slogan.`,
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
    examples: [
      {
        prompt: lessonCase.prompt,
        steps: lessonCase.steps,
        answer: lessonCase.answer,
        interpretation: lessonCase.interpretation,
      },
      {
        prompt: `Represent and verify the result of the worked case in a second form. ${guide.representation}`,
        steps: [
          `First solve the original case and retain the exact result ${lessonCase.answer}.`,
          "Label every input, output, unit, endpoint, restriction, intercept, or factor that carries meaning in the second form.",
          "Read the conclusion back from the second form and compare it with the original statement.",
        ],
        answer: `The second representation must preserve ${lessonCase.answer}.`,
        interpretation: `${lessonCase.interpretation} The representation is evidence only when the same conclusion can be read from it.`,
      },
      {
        prompt: `A learner reports “${lessonCase.answer}” but does not show the check. Decide whether the conclusion is justified and supply the missing verification.`,
        steps: [
          "Return to the original condition rather than checking only a transformed line.",
          guide.check,
          "State whether the proposed result is verified, only a candidate, or invalid, and explain why.",
        ],
        answer: `The conclusion is justified only after the original-condition check confirms ${lessonCase.answer}.`,
        interpretation: "Verification is part of the solution, especially when a transformation may lose restrictions or create candidates.",
      },
    ],
    misconception: guide.misconception,
    questions: makeQuestions(lesson, lessonCase, guide),
    takeaway: [
      `${sentence(lesson.outcome)} Use structure to choose the method, preserve every condition, and interpret the checked result.`,
      guide.check,
      lessonCase.interpretation,
    ],
  };
}

export function assertCompleteTextbookProfiles(lessons, unitsByCode) {
  const remaining = lessons.filter((lesson) => Number(lesson.unitCode.slice(1)) >= 3);
  for (const lesson of remaining) {
    const profile = buildTextbookProfile(lesson, unitsByCode.get(lesson.unitCode));
    const wordCount = profile.exposition.join(" ").match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu)?.length ?? 0;
    if (profile.exposition.length < 10) throw new Error(`${lesson.id} requires at least 10 textbook exposition paragraphs.`);
    if (wordCount < 650) throw new Error(`${lesson.id} requires at least 650 exposition words; found ${wordCount}.`);
    if (profile.examples.length !== 3) throw new Error(`${lesson.id} requires exactly three worked examples.`);
    if (profile.questions.length !== 20) throw new Error(`${lesson.id} requires exactly twenty authored practice questions.`);
  }
  return remaining.length;
}
