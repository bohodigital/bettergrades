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
  const practice = sourceLesson.practice.map((item, index) => {
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
      lessonTitle: lesson.title,
      lessonOutcome: lesson.outcome,
      route: lesson.path,
    }))),
  }, `Precalculus unit ${unit.sequence} visual briefs`);
}

console.log(
  `${checkOnly ? "Verified" : "Imported"} Precalculus: ${course.counts.units} available units, `
  + `${course.counts.lessons} exact lessons, ${course.counts.figures} semantic figures, `
  + `${course.counts.practiceItems} practice items, and ${solutions.length} protected answer records.`,
);
