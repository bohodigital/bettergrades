import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { loadPhaseBLessons } from "./precalculus-phase-b.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(root, "content/precalculus/source-package");
const phaseBSourceDirectory = resolve(root, "content/precalculus/source-package-phase-b");
const outputDirectory = resolve(root, "content/precalculus");
const checkOnly = process.argv.includes("--check");
const courseRoot = "/subjects/math/precalculus/";

const auditCorrections = [
  {
    sourceLessonId: "P12.1",
    source: "(x+2)^2+(y-3)^2=25; solve with y=0 or x=0.",
    corrected: "(x+2)^2+(y-3)^2=25; x-intercepts (-6,0) and (2,0); y-intercepts (0,3-sqrt(21)) and (0,3+sqrt(21)).",
    reason: "The accepted live audit found that the worked conclusion omitted every requested intercept.",
  },
  {
    sourceLessonId: "P13.1",
    source: "Endpoints (-5,4),(5,9); eliminate t=(x+1)/2 to get y=(x+1)^2/4 with restricted segment and direction.",
    corrected: "Endpoints (-5,4) and (5,9); eliminate t=(x+1)/2 to get y=(x+1)^2/4 with -5<=x<=5, traced from left to right as t increases from -2 to 3.",
    reason: "The accepted live audit found that the Cartesian conclusion omitted the exact x-domain and direction.",
  },
];

function applyAuditCorrections(sourceLesson) {
  const correction = auditCorrections.find((candidate) => candidate.sourceLessonId === sourceLesson.id);
  if (!correction) return sourceLesson;
  const serialized = JSON.stringify(sourceLesson);
  if (!serialized.includes(correction.source)) throw new Error(`Expected audited source statement is missing from ${sourceLesson.id}.`);
  return JSON.parse(serialized.replaceAll(correction.source, correction.corrected));
}

const unitProfiles = [
  { sourceCode: "P0", sequence: 1, title: "Algebra and Function Readiness", slug: "algebra-and-function-readiness" },
  { sourceCode: "P1", sequence: 2, title: "Functions and Multiple Representations", slug: "functions-and-multiple-representations" },
  { sourceCode: "P2", sequence: 3, title: "Transformations and Function Operations", slug: "transformations-and-function-operations" },
  { sourceCode: "P3", sequence: 4, title: "Composition, Inverses, and Modeling", slug: "composition-inverses-and-modeling" },
  { sourceCode: "P4", sequence: 5, title: "Polynomial Functions", slug: "polynomial-functions" },
  { sourceCode: "P5", sequence: 6, title: "Rational Functions", slug: "rational-functions" },
  { sourceCode: "P6", sequence: 7, title: "Exponential and Logarithmic Functions", slug: "exponential-and-logarithmic-functions" },
  { sourceCode: "P7", sequence: 8, title: "Systems, Matrices, and Multivariable Models", slug: "systems-matrices-and-multivariable-models" },
  { sourceCode: "P8", sequence: 9, title: "Angles, Radians, and the Unit Circle", slug: "angles-radians-and-the-unit-circle" },
  { sourceCode: "P9", sequence: 10, title: "Trigonometric Functions and Periodic Models", slug: "trigonometric-functions-and-periodic-models" },
  { sourceCode: "P10", sequence: 11, title: "Trigonometric Identities and Equations", slug: "trigonometric-identities-and-equations" },
  { sourceCode: "P11", sequence: 12, title: "Triangle Trigonometry and Vectors", slug: "triangle-trigonometry-and-vectors" },
  { sourceCode: "P12", sequence: 13, title: "Conic Sections and Implicit Relations", slug: "conic-sections-and-implicit-relations" },
  { sourceCode: "P13", sequence: 14, title: "Parametric, Polar, and Complex Representations", slug: "parametric-polar-and-complex-representations" },
  { sourceCode: "P14", sequence: 15, title: "Sequences, Series, and Discrete Models", slug: "sequences-series-and-discrete-models" },
  { sourceCode: "P15", sequence: 16, title: "Calculus Readiness and Function Synthesis", slug: "calculus-readiness-and-function-synthesis" },
];

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function publicLearnerText(value) {
  return value === "Use function notation from P0."
    ? "Use function notation from the algebra and function readiness unit."
    : value;
}

const explanationPrompt = /\b(?:explain|justify|describe|interpret|compare|analy[sz]e|why|defend|discuss|write a|construct an argument|show that|prove)\b/i;
const numericAnswer = /^[+-]?(?:(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?)(?:\s*%)?\.?$/;
const allowedSymbolicWord = /^(?:[a-z]|pi|sqrt|sin|cos|tan|sec|csc|cot|log|ln|exp|abs)$/i;

function directValidationPolicy(answer) {
  const source = answer.trim();
  if (numericAnswer.test(source)) return { type: "numeric", tolerance: 1e-9 };
  const words = source.match(/[A-Za-z]+/g) ?? [];
  const symbolic = source.length <= 120
    && /[=<>^/()+*\-√πθ≠≤≥]|\d[A-Za-z]|[A-Za-z]\d/.test(source)
    && words.every((word) => allowedSymbolicWord.test(word));
  return symbolic ? { type: "symbolic" } : { type: "exact_text" };
}

function validationPolicy(prompt, answer) {
  const source = answer.trim();
  if (source.length > 80 || (explanationPrompt.test(prompt) && source.length > 40)) {
    return {
      type: "manual_rubric",
      revealPolicy: "attempt_then_model",
      contentPolicy: "nonprotected_model_response",
      minimumAttemptLength: 24,
    };
  }
  const components = source.split(";").map((value) => value.trim()).filter(Boolean);
  if (components.length > 1) {
    return {
      type: "multipart",
      separator: ";",
      components: components.map(directValidationPolicy),
    };
  }
  return directValidationPolicy(source);
}

function publicPolicy(validation) {
  return {
    responseType: validation.type,
    expectedAnswerPolicy: validation.type === "manual_rubric" ? "rubric_guided_model_comparison" : validation.type,
    acceptedEquivalentForms: validation.type === "symbolic" ? "mathematically_equivalent_expression" : validation.type === "numeric" ? "equivalent_finite_number" : "declared_server_policy",
    unitsAndRoundingPolicy: "Follow the units, exactness, and rounding requested in the prompt; otherwise preserve the exact form.",
    randomizationPolicy: "fixed_source_authored_item",
  };
}

const editorialProfiles = {
  1: {
    lens: "Precalculus is unforgiving about hidden algebra errors. The useful habit is to separate reversible algebra from steps that can create candidates, and to keep domain restrictions beside the work instead of trying to remember them at the end.",
    check: "Re-read the original statement, not only the simplified line. Confirm every restriction, substitute each candidate, and describe what the result means before moving on.",
    questions: ["What family of problem is this?", "Which values are forbidden before any simplification?", "Did any step create candidates that still need checking?"],
    application: "These algebra choices are the load-bearing steps beneath later work with functions. A restriction lost here can turn into a false intercept, a missing asymptote, or an invalid model several lessons later.",
  },
  2: {
    lens: "A function is a dependency, not merely an equation. Inputs, outputs, units, and domain must agree in words, tables, graphs, and formulas; each representation should tell the same mathematical story.",
    check: "Choose two representations and make them verify one another. A table can test a formula, a graph can expose a domain or range claim, and units can reveal a model that is algebraically neat but conceptually wrong.",
    questions: ["What is the input and what is the output?", "Which inputs are allowed?", "Where is the same feature visible in another representation?"],
    application: "The same dependency may arrive as a story, table, graph, or formula. Learning to preserve the inputs, outputs, units, and domain while moving among those forms is the central language of the course.",
  },
  3: {
    lens: "Transformations become reliable when they are treated as coordinate mappings. Outside operations change outputs; inside operations change the inputs that produce those outputs, which is why horizontal changes often appear to work in the opposite direction.",
    check: "Track at least one landmark point from the parent graph to the transformed graph, then verify the new domain, range, intercepts, or asymptotes from the formula.",
    questions: ["Which parent family is underneath the formula?", "Does the operation act on input or output?", "Where do the landmark points move?"],
    application: "Transformation language lets you read a complicated graph as a modified parent rather than a collection of disconnected points. That makes prediction possible before any calculator window is opened.",
  },
  4: {
    lens: "Composition and inversion are about information flow. A composite sends an input through stages in a fixed order; an inverse reverses that flow only when each output identifies a unique input.",
    check: "Name the intermediate quantity, enforce its domain, and verify an inverse with composition. Units are especially useful because the output unit of one stage must match the input unit of the next.",
    questions: ["Which function acts first?", "Is the intermediate output allowed?", "Can the process be reversed without ambiguity?"],
    application: "Many real models are built in stages—a conversion followed by a cost rule, or a measurement followed by a calibration. Composition records that order, while inverse reasoning asks whether the stages can be undone.",
  },
  5: {
    lens: "Polynomial formulas contain structural information before a graph is drawn. Degree and leading coefficient control the ends, factors reveal zeros, multiplicity predicts crossing or touching, and selected values settle the remaining shape.",
    check: "Compare the proposed graph with the factorization and leading term. Every real zero, sign interval, end direction, and y-intercept should agree with the same formula.",
    questions: ["What does the leading term force at the ends?", "Where are the zeros and what are their multiplicities?", "Which intervals are positive or negative?"],
    application: "Polynomial structure links symbolic factors to visible graph behavior. Reading that structure efficiently makes it possible to sketch, solve, and model without treating every problem as a blind numerical search.",
  },
  6: {
    lens: "A rational function carries permanent memory of its original denominator. Factoring may reveal holes, asymptotes, and sign changes, but cancellation never restores an input that the original formula excluded.",
    check: "Record exclusions first, then compare the factored and simplified forms. Test one point in every sign interval and examine both sides of each vertical asymptote.",
    questions: ["Which inputs make the original denominator zero?", "Does each excluded input create a hole or an asymptote?", "What happens on each continuity interval?"],
    application: "Rational graphs are organized around the inputs the denominator forbids. Those exclusions divide the graph into continuity intervals and explain why a simplified expression may still contain a hole or asymptote.",
  },
  7: {
    lens: "Exponential change multiplies over equal input steps, while logarithms answer the inverse question: what exponent produces a given output? Parameters must be interpreted as an initial value, a multiplier, a rate, or a long-run bound—not as decoration.",
    check: "Test the model at input zero and one step later, confirm the multiplier or inverse relationship, and state whether the domain and long-run behavior make sense in context.",
    questions: ["Is change additive, multiplicative, or bounded?", "What do the parameters mean with units?", "Would a logarithm reverse the relationship?"],
    application: "Multiplicative models describe repeated percentage change, while logarithms recover the time or exponent hidden inside that process. Together they support growth, decay, finance, regression, and bounded models.",
  },
  8: {
    lens: "A system asks for simultaneous truth. Graphs show common intersections, elimination preserves the solution set, and matrices record the same operations compactly; the representation changes, but the solution condition does not.",
    check: "Substitute the result into every original equation or inequality. For matrix work, translate the final rows back into statements about variables, pivots, free variables, and consistency.",
    questions: ["What does a solution represent in this context?", "Which elimination move preserves the solution set?", "Does the result satisfy every original condition?"],
    application: "Systems combine several conditions into one decision. Graphs, equations, inequalities, and matrices are different views of the same requirement: the final result must satisfy every condition at once.",
  },
};

function lowerInitial(value) {
  return value ? `${value[0].toLowerCase()}${value.slice(1)}` : value;
}

function methodSteps(sourceLesson, profile) {
  const clauses = sourceLesson.exposition[0]
    .split(/,\s+(?:and\s+)?|\s+and\s+(?=[a-z])/i)
    .map((clause) => clause.trim().replace(/[.]$/, ""))
    .filter(Boolean);
  const steps = clauses.slice(0, 4);
  while (steps.length < 3) steps.push(profile.questions[steps.length] ?? profile.check);
  return steps.map((step, index) => `${index + 1}. ${step[0].toUpperCase()}${step.slice(1)}.`);
}

function editorialGuide(sourceLesson, unitSequence) {
  if (sourceLesson.guide) return sourceLesson.guide;
  const profile = editorialProfiles[unitSequence];
  const foundation = sourceLesson.examples[0];
  return {
    application: profile.application,
    bigIdea: [
      profile.lens,
      `This lesson narrows that lens to one goal: ${lowerInitial(sourceLesson.outcome)} The point is not to memorize an isolated trick; it is to know what evidence makes the conclusion valid and how a second representation can check it.`,
    ],
    method: methodSteps(sourceLesson, profile),
    questions: profile.questions,
    verification: profile.check,
    foundationWalkthrough: {
      problem: foundation.problem,
      plan: `Start by identifying the mathematical structure in the prompt. Then use the lesson method rather than guessing from appearance: ${sourceLesson.exposition[0]}`,
      conclusion: foundation.solution,
      check: foundation.interpretation,
    },
  };
}

function normalizedPromptKey(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z#]+/g, " ")
    .trim();
}

const sourceExerciseTypes = ["retrieval", "procedural", "procedural", "conceptual", "conceptual"];
const sourceDifficulties = ["foundational", "developing", "developing", "transfer", "foundational"];

function annotateSourcePractice(items) {
  return items.map((item, index) => ({
    ...item,
    exerciseType: sourceExerciseTypes[index] ?? "explanation",
    difficulty: sourceDifficulties[index] ?? "developing",
    provenance: "source-authored",
  }));
}

function phaseBExpandedPractice(sourceLesson, guide) {
  const retainedProfiles = [
    { index: 0, exerciseType: "retrieval", difficulty: "foundational" },
    { index: 4, exerciseType: "conceptual", difficulty: "foundational" },
    { index: 5, exerciseType: "verification", difficulty: "developing", contextualize: true },
    { index: 6, exerciseType: "error-analysis", difficulty: "developing", contextualize: true },
    { index: 9, exerciseType: "synthesis", difficulty: "transfer", contextualize: true },
  ];
  const retained = retainedProfiles.map((profile) => {
    const item = sourceLesson.practice[profile.index];
    return {
      ...item,
      prompt: profile.contextualize
        ? `For ${sourceLesson.title.toLowerCase()}, ${lowerInitial(item.prompt)}`
        : item.prompt,
      exerciseType: profile.exerciseType,
      difficulty: profile.difficulty,
      provenance: "source-authored",
    };
  });
  const [foundation, representation, transfer] = sourceLesson.examples;
  const [anchorFigure, mechanismFigure, comparisonFigure] = sourceLesson.figures;
  const conclusionMarker = "Following that structure gives ";
  const conclusionStart = foundation.solution.lastIndexOf(conclusionMarker);
  if (conclusionStart < 0) throw new Error(`${sourceLesson.id} lacks an exact foundation conclusion.`);
  const foundationConclusion = foundation.solution.slice(conclusionStart + conclusionMarker.length).trim();
  const firstMethodStep = guide.method[0].replace(/^\d+\.\s*/, "");
  const additions = [
    {
      exerciseType: "procedural",
      difficulty: "foundational",
      prompt: `Solve this ${sourceLesson.title.toLowerCase()} problem and state the final result: ${foundation.problem}`,
      answer: `${foundationConclusion} Check: ${foundation.interpretation}`,
    },
    {
      exerciseType: "procedural",
      difficulty: "developing",
      prompt: `In ${sourceLesson.title.toLowerCase()}, for “${representation.problem}”, identify the first valid mathematical step and the condition that must remain visible.`,
      answer: `First step: ${firstMethodStep} Required condition: ${guide.verification}`,
    },
    {
      exerciseType: "transfer",
      difficulty: "transfer",
      prompt: `For “${transfer.problem}”, identify the governing definition or relationship and what a complete conclusion must include.`,
      answer: `Governing relationship: ${sourceLesson.exposition[0]} A complete conclusion must satisfy ${guide.verification} Interpretation: ${transfer.interpretation}`,
    },
    {
      exerciseType: "verification",
      difficulty: "developing",
      prompt: `Verify “${foundationConclusion}” using the required condition for ${sourceLesson.title.toLowerCase()}.`,
      answer: `Required condition: ${guide.verification} Applying it to the opening problem confirms ${foundationConclusion}`,
    },
    {
      exerciseType: "explanation",
      difficulty: "developing",
      prompt: `Explain why “${foundationConclusion}” follows from this lesson’s mathematical mechanism.`,
      answer: `${sourceLesson.visualMechanism ?? sourceLesson.exposition[1]} Therefore ${foundationConclusion}`,
    },
    {
      exerciseType: "conceptual",
      difficulty: "developing",
      prompt: `What mathematical structure is shared by the opening problem and “${transfer.problem}”?`,
      answer: `${sourceLesson.exposition[0]} The opening result is ${foundationConclusion} The transfer problem must preserve the same defining structure.`,
    },
    {
      exerciseType: "graphical",
      difficulty: "developing",
      prompt: `In “${anchorFigure.title}”, which mathematical objects or labels must be visible to support “${foundationConclusion}”?`,
      answer: `${anchorFigure.description} These features support the conclusion because ${foundation.interpretation}`,
    },
    {
      exerciseType: "graphical",
      difficulty: "transfer",
      prompt: `How should “${mechanismFigure.title}” make the governing relationship in “${representation.problem}” visible?`,
      answer: `${mechanismFigure.description} Governing mechanism: ${sourceLesson.visualMechanism ?? sourceLesson.exposition[1]}`,
    },
    {
      exerciseType: "error-analysis",
      difficulty: "transfer",
      prompt: `In “${comparisonFigure.title}”, identify the first point where the misconception diverges from valid ${sourceLesson.title.toLowerCase()} reasoning.`,
      answer: `${comparisonFigure.description} The invalid path is: ${sourceLesson.commonMistake} The valid structure is: ${sourceLesson.exposition[1]}`,
    },
    {
      exerciseType: "modeling",
      difficulty: "transfer",
      prompt: `In the application “${guide.application}”, what quantities or geometric objects must be identified, and what condition makes the model valid?`,
      answer: `The governing relationship is ${sourceLesson.exposition[0]} The model must preserve ${guide.verification}`,
    },
    {
      exerciseType: "exit-check",
      difficulty: "transfer",
      prompt: `Answer “${sourceLesson.practice[0].prompt}” and name the condition used to check the result.`,
      answer: `${sourceLesson.practice[0].answer} Check: ${guide.verification}`,
    },
  ].map((item) => ({ ...item, provenance: "audit-remediation" }));

  return [...retained, ...additions];
}

function expandedPractice(sourceLesson, guide) {
  if (sourceLesson.preservePractice) return phaseBExpandedPractice(sourceLesson, guide);
  const original = annotateSourcePractice(sourceLesson.practice.slice(0, 4));
  const [foundation, representation, transfer] = sourceLesson.examples;
  const additions = [
    {
      prompt: `Explain why this conclusion is valid: ${foundation.solution} Use the foundation problem as evidence: ${foundation.problem}`,
      answer: `${foundation.solution} ${foundation.interpretation}`,
    },
    {
      prompt: `Solve the representation example, then name the feature of ${sourceLesson.title.toLowerCase()} that it illustrates: ${representation.problem}`,
      answer: `${representation.solution} ${representation.interpretation}`,
    },
    {
      prompt: `Correct this reasoning and identify the first unsafe assumption: ${sourceLesson.commonMistake}`,
      answer: `A correct approach begins by following the lesson method: ${sourceLesson.exposition[0]} ${guide.verification}`,
    },
    {
      prompt: `Connect two representations for this example: ${foundation.problem} Describe what a graph, table, mapping, or algebraic form would have to show.`,
      answer: `${foundation.solution} The second representation must preserve the same inputs, outputs, restrictions, and conclusion. ${foundation.interpretation}`,
    },
    {
      prompt: `Create a nearby example by changing one number or condition in this prompt: ${transfer.problem} Predict the effect, solve your new example, and compare it with the original.`,
      answer: `Answers vary. The comparison should state the changed condition, show valid work, and use the original result as a reference: ${transfer.solution} ${transfer.interpretation}`,
    },
    {
      prompt: `Write a short verification checklist for ${sourceLesson.title.toLowerCase()}, then apply it to one worked example from this lesson.`,
      answer: `${guide.verification} A complete response should apply that check to a specific example and explain why the conclusion follows.`,
    },
  ];
  return [
    ...original,
    ...additions.map((item, index) => ({
      ...item,
      exerciseType: ["explanation", "procedural", "error-analysis", "graphical", "transfer", "verification"][index],
      difficulty: index < 2 ? "developing" : "transfer",
      provenance: "editorial-expansion",
    })),
  ];
}

function learnerFigureCaption(sourceLesson, figure, index) {
  if (index === 0) {
    return `Follow the foundation example from its given information to the conclusion. The labels identify the mathematical feature that makes the result valid: ${sourceLesson.examples[0].interpretation}`;
  }
  if (index === 1) {
    return `Read the numbered reasoning path in order. Each stage preserves the quantities, restrictions, or structural conditions needed for ${sourceLesson.title.toLowerCase()}.`;
  }
  const shortcut = sourceLesson.commonMistake
    .replace(/^A (?:frequent|common) error is\s+/i, "")
    .replace(/[.!?]+$/, "");
  return `Compare the valid path with the tempting shortcut. The figure shows why ${lowerInitial(shortcut)} leads to a false conclusion.`;
}

function learnerFigureTitle(value) {
  return value
    .replace(/\banimation\b/gi, "diagram")
    .replace(/\bmoving point\b/gi, "directed point sequence");
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function assertPackageIntegrity(directory) {
  const manifest = await loadJson(resolve(directory, "package_manifest.json"));
  for (const file of manifest.files) {
    const body = await readFile(resolve(directory, file.path));
    const digest = createHash("sha256").update(body).digest("hex");
    if (body.byteLength !== file.bytes || digest !== file.sha256) {
      throw new Error(`Precalculus source package integrity failed for ${file.path}.`);
    }
  }
  return manifest;
}

async function writeOrCheck(path, value, label) {
  const expected = `${JSON.stringify(value, null, 2)}\n`;
  if (checkOnly) {
    const actual = await readFile(path, "utf8").catch(() => "");
    if (actual.replace(/\r\n?/g, "\n") !== expected) {
      throw new Error(`${label} is missing or stale. Run precalculus:import.`);
    }
    return;
  }
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, expected, "utf8");
}

const packageManifest = await assertPackageIntegrity(sourceDirectory);
const phaseBPackageManifest = await assertPackageIntegrity(phaseBSourceDirectory);
const phaseALessons = await loadJson(resolve(sourceDirectory, "data/lessons.json"));
const phaseBLessons = await loadPhaseBLessons(phaseBSourceDirectory);
const sourceLessons = [...phaseALessons, ...phaseBLessons].map(applyAuditCorrections);
const qa = await loadJson(resolve(sourceDirectory, "qa/QA_REPORT.json"));
const phaseBQa = await loadJson(resolve(phaseBSourceDirectory, "qa/QA_REPORT.json"));

if (
  !Array.isArray(sourceLessons)
  || phaseALessons.length !== 84
  || phaseBLessons.length !== 90
  || sourceLessons.length !== 174
  || qa.status !== "PASS"
  || phaseBQa.status !== "PASS"
) {
  throw new Error("The approved Precalculus packages must contain exactly 174 QA-passing lessons.");
}

const unitsBySourceCode = new Map(unitProfiles.map((unit) => [unit.sourceCode, unit]));
const publicLessons = [];
const solutions = [];
const provenanceLessons = [];

for (const sourceLesson of sourceLessons) {
  const profile = unitsBySourceCode.get(sourceLesson.unit);
  if (!profile) throw new Error(`Unknown Precalculus source unit ${sourceLesson.unit}.`);
  const unitLessons = sourceLessons.filter((candidate) => candidate.unit === sourceLesson.unit);
  const lessonSequence = unitLessons.findIndex((candidate) => candidate.id === sourceLesson.id) + 1;
  if (lessonSequence < 1) throw new Error(`Could not sequence ${sourceLesson.id}.`);
  const publicLessonId = `precalculus-u${profile.sequence}-l${lessonSequence}`;
  const path = `${courseRoot}${profile.slug}/${slugify(sourceLesson.title)}/`;
  const checkpointId = `${publicLessonId}-checkpoint`;
  const guide = editorialGuide(sourceLesson, profile.sequence);
  const practice = expandedPractice(sourceLesson, guide).map((item, index) => {
    const id = `${publicLessonId}-practice-${String(index + 1).padStart(2, "0")}`;
    const validation = validationPolicy(item.prompt, item.answer);
    solutions.push({
      id,
      lessonId: publicLessonId,
      kind: "practice",
      sequence: index + 1,
      prompt: item.prompt,
      answer: item.answer,
      validation,
      exerciseType: item.exerciseType,
      difficulty: item.difficulty,
      provenance: item.provenance,
    });
    return {
      id,
      sequence: index + 1,
      prompt: item.prompt,
      exerciseType: item.exerciseType,
      difficulty: item.difficulty,
      provenance: item.provenance,
      ...publicPolicy(validation),
    };
  });
  const checkpointValidation = validationPolicy(sourceLesson.checkpoint.prompt, sourceLesson.checkpoint.answer);
  solutions.push({
    id: checkpointId,
    lessonId: publicLessonId,
    kind: "checkpoint",
    sequence: 0,
    prompt: sourceLesson.checkpoint.prompt,
    answer: sourceLesson.checkpoint.answer,
    validation: checkpointValidation,
  });
  const figures = sourceLesson.figures.map((figure, index) => ({
    id: `${publicLessonId}-v${index + 1}`,
    sequence: index + 1,
    role: figure.role,
    title: learnerFigureTitle(figure.title),
    description: figure.description,
    caption: learnerFigureCaption(sourceLesson, figure, index),
    anchorProblem: sourceLesson.examples[0].problem,
    anchorConclusion: sourceLesson.examples[0].solution,
    anchorInterpretation: sourceLesson.examples[0].interpretation,
    mechanism: sourceLesson.visualMechanism ?? sourceLesson.exposition[0],
    validStructure: sourceLesson.exposition[1],
    invalidMove: sourceLesson.commonMistake,
  }));
  publicLessons.push({
    id: publicLessonId,
    unitId: `precalculus-unit-${profile.sequence}`,
    unitSequence: profile.sequence,
    sequence: lessonSequence,
    courseSequence: publicLessons.length + 1,
    title: sourceLesson.title,
    path,
    outcome: sourceLesson.outcome,
    opening: sourceLesson.opening,
    prerequisites: sourceLesson.prerequisites.map(publicLearnerText),
    exposition: sourceLesson.exposition,
    guide,
    commonMistake: sourceLesson.commonMistake,
    examples: sourceLesson.examples,
    figures,
    checkpoint: { id: checkpointId, prompt: sourceLesson.checkpoint.prompt, ...publicPolicy(checkpointValidation) },
    practice,
    close: sourceLesson.close,
    sources: sourceLesson.sources,
    ...(sourceLesson.textbookSections ? { textbookSections: sourceLesson.textbookSections } : {}),
  });
  const packageDirectory = sourceLesson.sourcePackageDirectory ?? "source-package";
  const packageSourcePrefix = sourceLesson.sourcePackageLessonPath ?? `units/${sourceLesson.unit.toLowerCase()}_`;
  const sourceManifest = packageDirectory === "source-package-phase-b" ? phaseBPackageManifest : packageManifest;
  provenanceLessons.push({
    publicLessonId,
    sourceLessonId: sourceLesson.id,
    sourceUnitCode: sourceLesson.unit,
    sourceFile: `content/precalculus/${packageDirectory}/units/${sourceManifest.files.find((file) => file.path.startsWith(packageSourcePrefix))?.path.split("/").at(-1) ?? "unknown"}`,
    sources: sourceLesson.sources,
  });
}

for (const [index, lesson] of publicLessons.entries()) {
  lesson.previous = index > 0
    ? { title: publicLessons[index - 1].title, path: publicLessons[index - 1].path }
    : null;
  lesson.next = index < publicLessons.length - 1
    ? { title: publicLessons[index + 1].title, path: publicLessons[index + 1].path }
    : null;
}

const publicUnits = unitProfiles.map((profile) => {
  const lessons = publicLessons.filter((lesson) => lesson.unitSequence === profile.sequence);
  const sources = [...new Set(lessons.flatMap((lesson) => lesson.sources))];
  return {
    id: `precalculus-unit-${profile.sequence}`,
    sequence: profile.sequence,
    title: profile.title,
    root: `${courseRoot}${profile.slug}/`,
    description: lessons[0].opening[0],
    lessonCount: lessons.length,
    outcomes: lessons.map((lesson) => lesson.outcome),
    sources,
    lessons: lessons.map(({ id, sequence, title, path, outcome }) => ({ id, sequence, title, path, outcome })),
  };
});

function assessmentItem(lesson, prompt, sequence) {
  return {
    id: prompt.id,
    sequence,
    hint: lesson.guide.questions[0],
    errorTags: [`unit-${lesson.unitSequence}-concept`, prompt.responseType === "manual_rubric" ? "reasoning-incomplete" : "answer-form"],
    remediationTarget: lesson.path,
    sourceLessonId: lesson.id,
  };
}

function takeEvenly(items, count) {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, index) => items[Math.floor(index * items.length / count)]);
}

const assessments = [];
for (const unit of publicUnits) {
  const lessons = publicLessons.filter((lesson) => lesson.unitId === unit.id);
  const practicePool = lessons.flatMap((lesson) => lesson.practice.map((prompt) => ({ lesson, prompt })));
  const reviewPool = lessons.flatMap((lesson) => lesson.practice.slice(0, 5).map((prompt) => ({ lesson, prompt })));
  const masteryPool = lessons.flatMap((lesson) => [lesson.checkpoint, ...lesson.practice.slice(0, 3)].map((prompt) => ({ lesson, prompt })));
  const investigationPool = takeEvenly(practicePool.filter(({ prompt }) => prompt.responseType === "manual_rubric"), 5);
  const fallbackInvestigationPool = investigationPool.length >= 4 ? investigationPool : takeEvenly(practicePool, 5);
  const definitions = [
    { type: "unit-review", slug: "review", title: `Unit ${unit.sequence} Review`, description: "A 40–50 item cumulative unit review.", selected: takeEvenly(reviewPool, Math.min(50, Math.max(40, reviewPool.length))) },
    { type: "flexible-practice", slug: "practice", title: `Unit ${unit.sequence} Flexible Practice`, description: "A 32-item mixed practice set with repair links.", selected: takeEvenly(practicePool, 32) },
    { type: "mastery-check", slug: "mastery-check", title: `Unit ${unit.sequence} Mastery Check`, description: "A 28–36 item check spanning every unit lesson.", selected: masteryPool.slice(0, 36) },
    { type: "investigation", slug: "investigation", title: `Unit ${unit.sequence} Investigation`, description: "A multistage representation and verification task.", selected: fallbackInvestigationPool },
  ];
  const unitAssessments = definitions.map((definition) => {
    const id = `${unit.id}-${definition.type}`;
    const path = `${unit.root}${definition.slug}/`;
    const items = definition.selected.map(({ lesson, prompt }, index) => assessmentItem(lesson, prompt, index + 1));
    return {
      id,
      unitId: unit.id,
      type: definition.type,
      title: definition.title,
      description: definition.description,
      path,
      items,
      rubric: definition.type === "investigation" ? {
        stages: ["represent the situation", "perform valid mathematical work", "interpret the result", "verify with a second representation"],
        modelResponsePolicy: "server_held_attempt_then_model_comparison",
      } : null,
    };
  });
  unit.assessments = unitAssessments.map(({ id, type, title, path, items }) => ({ id, type, title, path, itemCount: items.length }));
  assessments.push(...unitAssessments);
}

const finalPool = publicUnits.flatMap((unit) => {
  const lessons = publicLessons.filter((lesson) => lesson.unitId === unit.id);
  return takeEvenly(lessons.flatMap((lesson) => lesson.practice.map((prompt) => ({ lesson, prompt }))), 4);
});
const finalAssessment = {
  id: "precalculus-final-assessment",
  unitId: null,
  type: "final-assessment",
  title: "Precalculus Final Assessment",
  description: "A 64-item cumulative assessment spanning all sixteen Precalculus units.",
  path: `${courseRoot}final-assessment/`,
  items: finalPool.map(({ lesson, prompt }, index) => assessmentItem(lesson, prompt, index + 1)),
  rubric: null,
};
assessments.push(finalAssessment);

for (const unit of publicUnits) {
  const unitAssessments = assessments.filter((assessment) => assessment.unitId === unit.id);
  for (const [index, assessment] of unitAssessments.entries()) {
    assessment.navigation = {
      parent: { title: unit.title, path: unit.root },
      previous: index > 0 ? { title: unitAssessments[index - 1].title, path: unitAssessments[index - 1].path } : { title: unit.title, path: unit.root },
      next: index < unitAssessments.length - 1 ? { title: unitAssessments[index + 1].title, path: unitAssessments[index + 1].path } : { title: "Precalculus course map", path: courseRoot },
      courseProgress: { title: "Continue through the Precalculus course", path: courseRoot },
    };
  }
}
finalAssessment.navigation = {
  parent: { title: "Precalculus course map", path: courseRoot },
  previous: { title: publicUnits.at(-1).title, path: publicUnits.at(-1).root },
  next: { title: "Precalculus course map", path: courseRoot },
  courseProgress: { title: "Review the complete course map", path: courseRoot },
};

const courseRoute = {
  id: "precalculus-course",
  path: courseRoot,
  title: "Precalculus: Functions, Models, and Change",
  description: "A continuous Precalculus course built around functions, multiple representations, exact reasoning, modeling, and change.",
  pageType: "course-hub",
  indexable: true,
  unitId: null,
  lessonId: null,
};
const unitRoutes = publicUnits.map((unit) => ({
  id: unit.id,
  path: unit.root,
  title: unit.title,
  description: unit.description,
  pageType: "unit-hub",
  indexable: true,
  unitId: unit.id,
  lessonId: null,
}));
const lessonRoutes = publicLessons.map((lesson) => ({
  id: lesson.id,
  path: lesson.path,
  title: lesson.title,
  description: lesson.outcome,
  pageType: "lesson",
  indexable: true,
  unitId: lesson.unitId,
  lessonId: lesson.id,
}));
const assessmentRoutes = assessments.map((assessment) => ({
  id: assessment.id,
  path: assessment.path,
  title: assessment.title,
  description: assessment.description,
  pageType: assessment.type,
  indexable: true,
  unitId: assessment.unitId,
  lessonId: null,
  assessmentId: assessment.id,
}));
const routes = [courseRoute, ...unitRoutes, ...lessonRoutes, ...assessmentRoutes];

const searchRecords = routes.map((route) => {
  const unit = publicUnits.find((candidate) => candidate.id === route.unitId);
  const lesson = publicLessons.find((candidate) => candidate.id === route.lessonId);
  return {
    id: `search-${route.id}`,
    kind: route.pageType.endsWith("hub") ? "topic" : "guide",
    title: route.title,
    description: route.description,
    path: route.path,
    domainSlug: "precalculus",
    domainName: "Precalculus",
    topicName: unit?.title ?? "Precalculus course",
    label: route.pageType === "course-hub" ? "Course map" : route.pageType === "unit-hub" ? "Unit map" : route.pageType === "lesson" ? "Lesson" : "Assessment",
    keywords: [
      route.title,
      route.description,
      unit?.title ?? "",
      lesson?.opening.join(" ") ?? "",
      "precalculus functions models change",
    ].filter(Boolean),
    priority: route.pageType === "course-hub" ? 99 : route.pageType === "unit-hub" ? 96 : 88,
  };
});

const course = {
  schemaVersion: 1,
  title: courseRoute.title,
  subtitle: "Functions, Models, and Change",
  description: courseRoute.description,
  root: courseRoot,
  counts: {
    units: publicUnits.length,
    lessons: publicLessons.length,
    figures: publicLessons.reduce((sum, lesson) => sum + lesson.figures.length, 0),
    practiceItems: publicLessons.reduce((sum, lesson) => sum + lesson.practice.length, 0),
    assessmentRoutes: assessments.length,
    assessmentPlacements: assessments.reduce((sum, assessment) => sum + assessment.items.length, 0),
  },
  units: publicUnits,
  lessons: publicLessons,
  assessments,
  routes,
};

const provenance = {
  schemaVersion: 1,
  package: "bettergrades-precalculus-complete-course",
  packages: [
    {
      name: packageManifest.package,
      packageManifestSha256: createHash("sha256")
        .update(await readFile(resolve(sourceDirectory, "package_manifest.json")))
        .digest("hex"),
      masterManuscript: "content/precalculus/source-package/BETTERGRADES_PRECALCULUS_P0_P7_EXACT_STORYBOARD.md",
      qaReport: "content/precalculus/source-package/qa/QA_REPORT.json",
    },
    {
      name: phaseBPackageManifest.package,
      packageManifestSha256: createHash("sha256")
        .update(await readFile(resolve(phaseBSourceDirectory, "package_manifest.json")))
        .digest("hex"),
      masterManuscript: "content/precalculus/source-package-phase-b/BETTERGRADES_PRECALCULUS_P8_P15_FULL_TEXTBOOK_MANUSCRIPT.md",
      qaReport: "content/precalculus/source-package-phase-b/qa/QA_REPORT.json",
    },
  ],
  publicCopyAdaptations: [{
    source: "Use function notation from P0.",
    public: "Use function notation from the algebra and function readiness unit.",
    reason: "The approved install prompt forbids exposing internal production identifiers in learner-facing copy.",
  }, ...auditCorrections.map((correction) => ({
    sourceLessonId: correction.sourceLessonId,
    source: correction.source,
    public: correction.corrected,
    reason: correction.reason,
  }))],
  lessons: provenanceLessons,
};

function tally(values) {
  return Object.fromEntries(
    [...values.reduce((counts, value) => counts.set(value, (counts.get(value) ?? 0) + 1), new Map())]
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

const phaseBPublicLessons = publicLessons.filter((lesson) => lesson.unitSequence >= 9);
const phaseBPublicPractice = phaseBPublicLessons.flatMap((lesson) => lesson.practice.map((item) => ({ lesson, item })));
const generatedPromptGroups = new Map();
for (const { lesson, item } of phaseBPublicPractice) {
  const key = normalizedPromptKey(item.prompt);
  const records = generatedPromptGroups.get(key) ?? [];
  records.push({ lessonId: lesson.id, itemId: item.id, prompt: item.prompt });
  generatedPromptGroups.set(key, records);
}
const generatedDuplicates = [...generatedPromptGroups.entries()]
  .filter(([, records]) => records.length > 1)
  .map(([normalizedPrompt, records]) => ({ normalizedPrompt, count: records.length, records }));
const authoringInstructionPattern = /\b(?:write|draft|design|create)\s+(?:a|an|the|one)\s+(?:lesson|lesson plan|worksheet|quiz|practice set|exercise set|rubric|answer key)\b/i;
const authoringInstructionItems = phaseBPublicPractice
  .filter(({ item }) => authoringInstructionPattern.test(item.prompt))
  .map(({ lesson, item }) => ({ lessonId: lesson.id, itemId: item.id, prompt: item.prompt }));
const phaseBSolutionIds = new Set(phaseBPublicPractice.map(({ item }) => item.id));
const genericNonAnswerPattern = /\bUse the method developed in the lesson\b|\bBegin by identifying the mathematical object\b|\bFollowing that structure gives\b/i;
const genericNonAnswerGuides = solutions
  .filter((record) => phaseBSolutionIds.has(record.id) && genericNonAnswerPattern.test(record.answer))
  .map((record) => ({ lessonId: record.lessonId, itemId: record.id, answer: record.answer }));
const overlongPrompts = phaseBPublicPractice
  .filter(({ item }) => item.prompt.length > 400)
  .map(({ lesson, item }) => ({ lessonId: lesson.id, itemId: item.id, characters: item.prompt.length }));
const solutionScaffoldPromptLeaks = phaseBPublicPractice
  .filter(({ item }) => /\bFollowing that structure gives\b|\bThe relevant conditions are not optional bookkeeping\b/i.test(item.prompt))
  .map(({ lesson, item }) => ({ lessonId: lesson.id, itemId: item.id, prompt: item.prompt }));
const exerciseInventory = {
  schemaVersion: 1,
  scope: "precalculus-concrete-exercise-audit",
  totals: {
    coursePracticeItems: publicLessons.reduce((sum, lesson) => sum + lesson.practice.length, 0),
    phaseBPracticeItems: phaseBPublicPractice.length,
    phaseBLessons: phaseBPublicLessons.length,
    normalizedDuplicateGroups: generatedDuplicates.length,
    normalizedDuplicatePlacements: generatedDuplicates.reduce((sum, group) => sum + group.count, 0),
    authoringInstructionOnlyItems: authoringInstructionItems.length,
    genericNonAnswerGuides: genericNonAnswerGuides.length,
    overlongPrompts: overlongPrompts.length,
    solutionScaffoldPromptLeaks: solutionScaffoldPromptLeaks.length,
  },
  phaseBByUnit: publicUnits.filter((unit) => unit.sequence >= 9).map((unit) => {
    const items = phaseBPublicPractice.filter(({ lesson }) => lesson.unitId === unit.id).map(({ item }) => item);
    return {
      unitId: unit.id,
      unitTitle: unit.title,
      lessonCount: unit.lessonCount,
      practiceItemCount: items.length,
      exerciseTypes: tally(items.map((item) => item.exerciseType)),
      difficulties: tally(items.map((item) => item.difficulty)),
      responsePolicies: tally(items.map((item) => item.responseType)),
    };
  }),
  phaseBByLesson: phaseBPublicLessons.map((lesson) => ({
    lessonId: lesson.id,
    unitId: lesson.unitId,
    title: lesson.title,
    route: lesson.path,
    practiceItemCount: lesson.practice.length,
    exerciseTypes: tally(lesson.practice.map((item) => item.exerciseType)),
    difficulties: tally(lesson.practice.map((item) => item.difficulty)),
    responsePolicies: tally(lesson.practice.map((item) => item.responseType)),
    provenance: tally(lesson.practice.map((item) => item.provenance)),
  })),
  normalizedDuplicates: generatedDuplicates,
  authoringInstructionItems,
  qualityFindings: {
    genericNonAnswerGuides,
    overlongPrompts,
    solutionScaffoldPromptLeaks,
  },
};

const publicText = JSON.stringify({ course, searchRecords });
const splitLanguage = publicText.match(/\bP(?:[0-9]|1[0-5])(?:\.\d+)?\b|phase(?:[\s_-]+[ab])\b|p0(?:[\s_-]+p15)\b|(?:first|second) (?:internal production )?half/i);
if (splitLanguage) {
  throw new Error(`Internal Precalculus production-split language leaked into a public artifact: ${splitLanguage[0]}.`);
}
if (course.counts.figures !== 522 || course.counts.practiceItems !== 2_280) {
  throw new Error("The public Precalculus inventory must contain 522 figures and 2,280 practice items.");
}
if (solutions.length !== 2_454) throw new Error("The protected Precalculus answer inventory must contain 174 checkpoints and 2,280 practice answers.");
if (exerciseInventory.totals.phaseBPracticeItems !== 1_440 || phaseBPublicLessons.some((lesson) => lesson.practice.length !== 16)) {
  throw new Error("Every P8–P15 lesson must contain exactly 16 concrete practice items.");
}
if (generatedDuplicates.length || authoringInstructionItems.length || genericNonAnswerGuides.length || overlongPrompts.length || solutionScaffoldPromptLeaks.length) {
  throw new Error(`The P8–P15 exercise inventory failed its concrete-quality contract: ${generatedDuplicates.length} duplicate groups, ${authoringInstructionItems.length} authoring items, ${genericNonAnswerGuides.length} generic guides, ${overlongPrompts.length} overlong prompts, and ${solutionScaffoldPromptLeaks.length} solution-scaffold leaks.`);
}
if (new Set(routes.map((route) => route.path)).size !== routes.length) {
  throw new Error("The Precalculus route inventory contains a duplicate path.");
}
if (new Set(publicLessons.map((lesson) => lesson.id)).size !== publicLessons.length) {
  throw new Error("The Precalculus lesson inventory contains a duplicate public ID.");
}

await writeOrCheck(resolve(outputDirectory, "course.public.json"), course, "Precalculus public course");
await writeOrCheck(resolve(outputDirectory, "routes.public.json"), { schemaVersion: 1, routes }, "Precalculus route index");
await writeOrCheck(resolve(outputDirectory, "search.public.json"), { schemaVersion: 1, records: searchRecords }, "Precalculus search index");
await writeOrCheck(resolve(outputDirectory, "solutions.server.json"), { schemaVersion: 1, solutions }, "Precalculus protected solutions");
await writeOrCheck(resolve(outputDirectory, "provenance.server.json"), provenance, "Precalculus provenance");
await writeOrCheck(resolve(outputDirectory, "exercise-inventory.server.json"), exerciseInventory, "Precalculus concrete exercise inventory");

for (const unit of publicUnits) {
  const unitDirectory = resolve(outputDirectory, "units", `unit-${unit.sequence}`);
  const unitLessons = publicLessons.filter((lesson) => lesson.unitId === unit.id);
  await writeOrCheck(resolve(unitDirectory, "unit.public.json"), unit, `Precalculus unit ${unit.sequence}`);
  await writeOrCheck(resolve(unitDirectory, "visual-authoring-briefs.v1.json"), {
    schemaVersion: 1,
    unitId: unit.id,
    figures: unitLessons.flatMap((lesson) => lesson.figures.map((figure) => ({
      ...figure,
      lessonId: lesson.id,
      lessonSequence: lesson.sequence,
      lessonTitle: lesson.title,
      lessonOutcome: lesson.outcome,
      lessonGuide: lesson.guide,
      route: lesson.path,
    }))),
  }, `Precalculus unit ${unit.sequence} visual briefs`);
}

console.log(
  `${checkOnly ? "Verified" : "Imported"} Precalculus: ${course.counts.units} available units, `
  + `${course.counts.lessons} exact lessons, ${course.counts.figures} semantic figures, `
  + `${course.counts.practiceItems} practice items, ${course.counts.assessmentRoutes} assessment routes, `
  + `and ${solutions.length} declared answer-policy records.`,
);
