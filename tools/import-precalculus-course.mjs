import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(root, "content/precalculus/source-package");
const outputDirectory = resolve(root, "content/precalculus");
const checkOnly = process.argv.includes("--check");
const courseRoot = "/subjects/math/precalculus/";

const unitProfiles = [
  { sourceCode: "P0", sequence: 1, title: "Algebra and Function Readiness", slug: "algebra-and-function-readiness" },
  { sourceCode: "P1", sequence: 2, title: "Functions and Multiple Representations", slug: "functions-and-multiple-representations" },
  { sourceCode: "P2", sequence: 3, title: "Transformations and Function Operations", slug: "transformations-and-function-operations" },
  { sourceCode: "P3", sequence: 4, title: "Composition, Inverses, and Modeling", slug: "composition-inverses-and-modeling" },
  { sourceCode: "P4", sequence: 5, title: "Polynomial Functions", slug: "polynomial-functions" },
  { sourceCode: "P5", sequence: 6, title: "Rational Functions", slug: "rational-functions" },
  { sourceCode: "P6", sequence: 7, title: "Exponential and Logarithmic Functions", slug: "exponential-and-logarithmic-functions" },
  { sourceCode: "P7", sequence: 8, title: "Systems, Matrices, and Multivariable Models", slug: "systems-matrices-and-multivariable-models" },
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

function expandedPractice(sourceLesson, guide) {
  const original = sourceLesson.practice.slice(0, 4);
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
  return [...original, ...additions];
}

function learnerFigureCaption(sourceLesson, figure, index) {
  if (index === 0) {
    return `Follow the foundation example from its given information to the conclusion. The labels identify the mathematical feature that makes the result valid: ${sourceLesson.examples[0].interpretation}`;
  }
  if (index === 1) {
    return `Read the numbered reasoning path in order. Each stage preserves the quantities, restrictions, or structural conditions needed for ${sourceLesson.title.toLowerCase()}.`;
  }
  const shortcut = sourceLesson.commonMistake
    .replace(/^A frequent error is\s+/i, "")
    .replace(/[.!?]+$/, "");
  return `Compare the valid path with the tempting shortcut. The figure shows why ${lowerInitial(shortcut)} leads to a false conclusion.`;
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function assertPackageIntegrity() {
  const manifest = await loadJson(resolve(sourceDirectory, "package_manifest.json"));
  for (const file of manifest.files) {
    const body = await readFile(resolve(sourceDirectory, file.path));
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

const packageManifest = await assertPackageIntegrity();
const sourceLessons = await loadJson(resolve(sourceDirectory, "data/lessons.json"));
const qa = await loadJson(resolve(sourceDirectory, "qa/QA_REPORT.json"));

if (!Array.isArray(sourceLessons) || sourceLessons.length !== 84 || qa.status !== "PASS") {
  throw new Error("The approved Precalculus package must contain exactly 84 QA-passing lessons.");
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
    solutions.push({
      id,
      lessonId: publicLessonId,
      kind: "practice",
      sequence: index + 1,
      prompt: item.prompt,
      answer: item.answer,
    });
    return { id, sequence: index + 1, prompt: item.prompt };
  });
  solutions.push({
    id: checkpointId,
    lessonId: publicLessonId,
    kind: "checkpoint",
    sequence: 0,
    prompt: sourceLesson.checkpoint.prompt,
    answer: sourceLesson.checkpoint.answer,
  });
  const figures = sourceLesson.figures.map((figure, index) => ({
    id: `${publicLessonId}-v${index + 1}`,
    sequence: index + 1,
    role: figure.role,
    title: figure.title,
    description: figure.description,
    caption: learnerFigureCaption(sourceLesson, figure, index),
    anchorProblem: sourceLesson.examples[0].problem,
    anchorConclusion: sourceLesson.examples[0].solution,
    anchorInterpretation: sourceLesson.examples[0].interpretation,
    mechanism: sourceLesson.exposition[0],
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
    checkpoint: { id: checkpointId, prompt: sourceLesson.checkpoint.prompt },
    practice,
    close: sourceLesson.close,
    sources: sourceLesson.sources,
  });
  provenanceLessons.push({
    publicLessonId,
    sourceLessonId: sourceLesson.id,
    sourceUnitCode: sourceLesson.unit,
    sourceFile: `content/precalculus/source-package/units/${packageManifest.files.find((file) => file.path.startsWith(`units/${sourceLesson.unit.toLowerCase()}_`))?.path.split("/").at(-1) ?? "unknown"}`,
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
const routes = [courseRoute, ...unitRoutes, ...lessonRoutes];

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
    label: route.pageType === "course-hub" ? "Course map" : route.pageType === "unit-hub" ? "Unit map" : "Lesson",
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
  },
  units: publicUnits,
  lessons: publicLessons,
  routes,
};

const provenance = {
  schemaVersion: 1,
  package: packageManifest.package,
  packageManifestSha256: createHash("sha256")
    .update(await readFile(resolve(sourceDirectory, "package_manifest.json")))
    .digest("hex"),
  masterManuscript: "content/precalculus/source-package/BETTERGRADES_PRECALCULUS_P0_P7_EXACT_STORYBOARD.md",
  sourceUseMap: "content/precalculus/source-package/manifests/SOURCE_USE_MAP.md",
  qaReport: "content/precalculus/source-package/qa/QA_REPORT.json",
  publicCopyAdaptations: [{
    source: "Use function notation from P0.",
    public: "Use function notation from the algebra and function readiness unit.",
    reason: "The approved install prompt forbids exposing internal production identifiers in learner-facing copy.",
  }],
  lessons: provenanceLessons,
};

const publicText = JSON.stringify({ course, searchRecords });
const splitLanguage = publicText.match(/\bP[0-7](?:\.\d+)?\b|phase(?:[\s_-]+a)\b|p0(?:[\s_-]+p7)\b|first (?:internal production )?half/i);
if (splitLanguage) {
  throw new Error(`Internal Precalculus production-split language leaked into a public artifact: ${splitLanguage[0]}.`);
}
if (course.counts.figures !== 252 || course.counts.practiceItems !== 840) {
  throw new Error("The public Precalculus inventory must contain 252 figures and 840 practice items.");
}
if (solutions.length !== 924) throw new Error("The protected Precalculus answer inventory must contain 84 checkpoints and 840 practice answers.");
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
  + `${course.counts.practiceItems} practice items, and ${solutions.length} protected answer records.`,
);
