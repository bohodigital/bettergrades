import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildLessonArtifacts,
  exactAssessmentCount,
  publicAssessmentKind,
} from "./algebra-remediation-content.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = resolve(root, "content/algebra/storyboard-v2");
const outputDirectory = resolve(root, "content/algebra");
const checkOnly = process.argv.includes("--check");

const PACKAGE_COLLISION_PATH = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/";
const PRESERVED_COURSE_PATH = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/";

function parseCsv(source) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        value += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else value += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else value += character;
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows
    .filter((candidate) => candidate.some(Boolean))
    .map((candidate) => Object.fromEntries(headers.map((header, index) => [header, candidate[index] ?? ""])));
}

const cleanPath = (path) => path === PACKAGE_COLLISION_PATH ? PRESERVED_COURSE_PATH : path;
const learnerSafeText = (value) => String(value ?? "")
  .replace(/\bUndefined zero cases\b/gi, "Cases where zero powers are not defined")
  .replace(/\bMissing-power placeholders\b/gi, "Explicit gaps for missing powers")
  .replace(/\s+/g, " ")
  .trim();
const publicDescription = (route, unit, lesson) => lesson?.outcome
  ?? (route.page_type === "course-hub"
    ? "A complete Algebra course from arithmetic readiness through functions, logarithms, synthesis, cumulative practice, and assessment."
    : route.page_type === "unit-hub"
      ? `${unit.role} ${unit.governingQuestion}`
      : `${route.title} for ${unit?.title ?? "the complete Algebra course"}, with an explicit attempt-first assessment blueprint.`);
const publicExercise = (exercise) => {
  const copy = { ...exercise };
  delete copy.answerBoundary;
  delete copy.gradingPolicy;
  return copy;
};

async function loadCsv(name) {
  return parseCsv(await readFile(resolve(sourceDirectory, name), "utf8"));
}

const sourceText = await readFile(resolve(sourceDirectory, "02_FULL_EDITORIAL_STORYBOARD.json"), "utf8");
const storyboard = JSON.parse(sourceText);
const [rawRoutes, rawUnits, rawLessons, rawAssessments, rawExercises, rawVisuals, rawGraph] = await Promise.all([
  loadCsv("route_registry.csv"),
  loadCsv("unit_registry.csv"),
  loadCsv("lesson_registry.csv"),
  loadCsv("assessment_manifest.csv"),
  loadCsv("exercise_manifest.csv"),
  loadCsv("visual_authoring_briefs.csv"),
  loadCsv("learning_graph_seed.csv"),
]);

const editorialUnits = new Map(storyboard.units.map((unit) => [unit.code, unit]));
const units = rawUnits.map((unit) => ({
  id: `algebra-unit-${unit.unit.toLowerCase()}`,
  code: unit.unit,
  title: unit.title,
  shortTitle: unit.title,
  act: unit.act,
  role: unit.role,
  governingQuestion: unit.governing_question,
  root: unit.canonical_root,
  rootAction: unit.root_action,
  lessonCount: Number(unit.lesson_count),
  estimatedHours: Number(unit.estimated_hours),
  releasePhase: Number(unit.release_phase),
  investigationRoute: unit.investigation_route || null,
  reviewRoute: unit.review_route,
  practiceRoute: unit.practice_route,
  masteryRoute: unit.mastery_route,
  answerKeyRoute: unit.answer_key_route,
  storyArc: editorialUnits.get(unit.unit)?.story_arc ?? "",
  outcomes: editorialUnits.get(unit.unit)?.outcomes ?? [],
  investigation: editorialUnits.get(unit.unit)?.investigation ?? "",
  mastery: editorialUnits.get(unit.unit)?.mastery ?? "",
}));
const unitsByCode = new Map(units.map((unit) => [unit.code, unit]));
const lessonsById = new Map(rawLessons.map((lesson) => [lesson.lesson_id, {
  id: lesson.lesson_id,
  unitCode: lesson.unit,
  sequence: Number(lesson.sequence),
  title: lesson.lesson_title,
  path: cleanPath(lesson.canonical_path),
  outcome: lesson.outcome,
  opening: lesson.opening,
  prerequisites: lesson.prerequisites,
  storyBeat: lesson.story_beat,
  checkpoint: lesson.checkpoint,
  exitCheck: editorialUnits.get(lesson.unit)?.lessons.find((item) => item.id === lesson.lesson_id)?.exit_check ?? [],
  expositionBeats: editorialUnits.get(lesson.unit)?.lessons.find((item) => item.id === lesson.lesson_id)?.exposition_beats ?? [],
  examples: editorialUnits.get(lesson.unit)?.lessons.find((item) => item.id === lesson.lesson_id)?.examples ?? [],
  misconceptions: editorialUnits.get(lesson.unit)?.lessons.find((item) => item.id === lesson.lesson_id)?.misconceptions ?? [],
  bridgeForward: lesson.bridge_forward,
  exerciseCount: lesson.exercise_count,
  releasePhase: Number(lesson.release_phase),
}]));

const visualBriefs = rawVisuals.map((visual) => ({
  id: visual.figure_id,
  lessonId: visual.lesson_id,
  unitCode: visual.unit,
  role: visual.figure_role,
  description: learnerSafeText(visual.description),
  interactive: visual.interaction_required === "yes",
  rendererRequirement: visual.renderer_requirement,
  path: cleanPath(visual.canonical_lesson_path),
  altText: `Figure for ${lessonsById.get(visual.lesson_id)?.title ?? visual.lesson_id}: ${learnerSafeText(visual.description)}`,
}));
const exercises = rawExercises.map((exercise) => ({
  id: exercise.exercise_set,
  lessonId: exercise.lesson_id,
  unitCode: exercise.unit,
  purpose: exercise.purpose,
  recommendedCount: exercise.recommended_count,
  path: cleanPath(exercise.canonical_lesson_path),
  gradingPolicy: exercise.grading_policy,
  answerBoundary: exercise.answer_boundary,
}));
const assessmentBlueprints = rawAssessments.map((assessment) => ({
  id: assessment.assessment_id,
  unitCode: assessment.unit === "course" ? null : assessment.unit,
  kind: publicAssessmentKind(assessment.kind),
  path: assessment.path,
  sourceQuestionRange: assessment.question_count,
  questionCount: exactAssessmentCount(assessment.question_count),
  durationMinutes: assessment.duration_minutes,
  grading: assessment.grading,
  answerRoute: assessment.answer_route,
  cumulativeShare: assessment.cumulative_share,
  indexable: assessment.indexable === "yes",
}));
const routes = rawRoutes.map((route) => {
  const lesson = [...lessonsById.values()].find((candidate) => candidate.path === cleanPath(route.path));
  const unit = unitsByCode.get(route.unit);
  return {
    id: route.id,
    path: cleanPath(route.path),
    sourcePath: route.path,
    title: route.title,
    pageType: route.page_type,
    unitCode: route.unit || null,
    action: route.action,
    indexable: route.indexable === "yes",
    sequence: route.sequence ? Number(route.sequence) : null,
    lessonId: lesson?.id ?? null,
    description: publicDescription(route, unit, lesson),
    searchTerms: [
      route.title,
      route.page_type.replaceAll("-", " "),
      unit?.title ?? "Algebra",
      unit?.governingQuestion ?? storyboard.central_story,
      lesson?.outcome ?? "",
      "algebra textbook",
    ].filter(Boolean),
  };
});

const routesByPath = new Map(routes.map((route) => [route.path, route]));
const practicePageTypes = new Set(["answer-key", "diagnostic", "exam", "investigation", "mastery-check", "practice", "review"]);
const routeLabel = (pageType) => {
  if (pageType === "course-hub") return "Complete course";
  if (pageType === "unit-hub") return "Unit map";
  if (pageType === "answer-key") return "Response guide";
  if (pageType === "mastery-check") return "Mastery check";
  return pageType.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};
const searchRecords = routes.map((route) => ({
  id: route.id,
  kind: practicePageTypes.has(route.pageType) ? "practice" : route.pageType.endsWith("hub") ? "topic" : "guide",
  title: route.title,
  description: route.description,
  path: route.path,
  domainSlug: "algebra",
  domainName: "Algebra",
  topicName: route.unitCode ? `Unit ${route.unitCode}` : "Complete Algebra course",
  label: routeLabel(route.pageType),
  keywords: route.searchTerms,
  priority: route.pageType === "course-hub" ? 99 : route.pageType === "unit-hub" ? 96 : practicePageTypes.has(route.pageType) ? 92 : 84,
}));

const lessonArtifacts = new Map();
for (const unit of units) {
  const unitLessons = [...lessonsById.values()]
    .filter((candidate) => candidate.unitCode === unit.code)
    .sort((left, right) => left.sequence - right.sequence);
  for (const [index, lesson] of unitLessons.entries()) {
    lessonArtifacts.set(lesson.id, buildLessonArtifacts({
      lesson,
      unit,
      figures: visualBriefs.filter((visual) => visual.lessonId === lesson.id),
      families: exercises.filter((exercise) => exercise.lessonId === lesson.id),
      previous: index > 0 ? unitLessons[index - 1] : null,
      next: index < unitLessons.length - 1 ? unitLessons[index + 1] : null,
    }));
  }
}
const concreteQuestions = [...lessonArtifacts.values()].flatMap((artifact) => artifact.questions);
const protectedSolutions = [...lessonArtifacts.values()].flatMap((artifact) => artifact.solutions);
const questionsByUnit = Map.groupBy(concreteQuestions, (question) => question.unitCode);
const questionById = new Map(concreteQuestions.map((question) => [question.id, question]));
const materializedAssessments = assessmentBlueprints.map((assessment) => {
  const pool = assessment.unitCode ? questionsByUnit.get(assessment.unitCode) ?? [] : concreteQuestions;
  if (pool.length === 0) throw new Error(`Assessment ${assessment.id} has no concrete question pool.`);
  const offset = [...assessment.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % pool.length;
  const questionIds = Array.from({ length: assessment.questionCount }, (_, index) => pool[(offset + index) % pool.length].id);
  return {
    ...assessment,
    questionIds,
    solutionAccess: assessment.answerRoute?.startsWith("/") ? assessment.answerRoute : "Attempt-gated response guide on this route.",
    cumulativePolicy: assessment.cumulativeShare,
  };
});

const courseUnits = units.map((unit) => ({
  ...unit,
  lessons: [...lessonsById.values()]
    .filter((candidate) => candidate.unitCode === unit.code)
    .sort((left, right) => left.sequence - right.sequence)
    .map(({ id, sequence, title, path, outcome }) => ({ id, sequence, title, path, outcome })),
}));

const routePages = routes.map((route) => {
  const unit = unitsByCode.get(route.unitCode);
  const lesson = route.lessonId ? lessonsById.get(route.lessonId) : undefined;
  const unitLessons = [...lessonsById.values()].filter((candidate) => candidate.unitCode === route.unitCode).sort((a, b) => a.sequence - b.sequence);
  const assessment = materializedAssessments.find((candidate) => candidate.path === route.path || candidate.answerRoute === route.path);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Mathematics", path: "/subjects/math/" },
    { name: "Algebra", path: "/subjects/math/algebra/" },
    ...(unit && route.path !== unit.root ? [{ name: `Unit ${unit.code}`, path: unit.root }] : []),
    { name: route.title, path: route.path },
  ];
  return {
    route,
    unit: unit ?? null,
    lesson: lesson ? lessonArtifacts.get(lesson.id).publicLesson : null,
    assessment: assessment ?? null,
    assessmentPrompts: assessment ? assessment.questionIds.map((id) => questionById.get(id)) : [],
    unitLessons: route.pageType === "unit-hub" ? unitLessons.map((candidate) => lessonArtifacts.get(candidate.id).publicLesson) : [],
    units: route.pageType === "course-hub" ? courseUnits : [],
    breadcrumbs,
  };
});

const graph = rawGraph.map((edge) => ({
  sourceId: edge.source_id,
  relationship: edge.relationship,
  targetId: edge.target_id,
  public: edge.public === "yes",
  reviewState: edge.review_state,
  purpose: edge.purpose,
}));

const collisionReport = {
  schemaVersion: 1,
  auditedAgainstCommit: "f04574b0052824348f7bf6fa5dfaf246e504109e",
  packageRouteCount: 226,
  resolvedRouteCount: routes.length,
  currentCanonicalRouteCount: 509,
  netNewRouteCount: 223,
  expectedFinalCanonicalRouteCount: 732,
  collisions: [
    { path: "/subjects/math/algebra/", resolution: "replace-content-preserve-canonical", role: "course hub" },
    { path: "/subjects/math/algebra/linear-relationships/", resolution: "course-unit-resolves-before-legacy-topic", role: "Unit A4 hub" },
    { path: "/subjects/math/algebra/rational-expressions/", resolution: "course-unit-resolves-before-legacy-topic", role: "Unit A10 hub" },
    {
      path: PACKAGE_COLLISION_PATH,
      resolution: "preserve-existing-compact-guide-and-move-course-lesson",
      replacementCoursePath: PRESERVED_COURSE_PATH,
      role: "Unit A10.2 lesson",
      reason: "The canonical compact factor-method guide predates the storyboard audit and remains independently useful.",
    },
  ],
};

const coursePublic = {
  schemaVersion: 1,
  sourceVersion: storyboard.version,
  title: storyboard.title,
  subtitle: storyboard.subtitle,
  centralStory: storyboard.central_story,
  counts: {
    units: units.length,
    lessons: lessonsById.size,
    routes: routes.length,
    netNewRoutes: collisionReport.netNewRouteCount,
    figures: visualBriefs.length,
    interactiveFigures: visualBriefs.filter((visual) => visual.interactive).length,
    exerciseFamilies: exercises.length,
    assessmentBlueprints: assessmentBlueprints.length,
    concreteQuestions: concreteQuestions.length,
  },
  units,
  routes,
  pages: routePages,
  assessments: materializedAssessments,
  exerciseBank: concreteQuestions,
  learningGraph: graph,
  release: {
    state: "private-preview-required",
    productionApproved: false,
    sourceRights: "BetterGrades-original storyboard composition; outside reference books remain rights-separated.",
  },
};
const sourceFingerprint = createHash("sha256").update(sourceText).digest("hex");
const provenanceServer = {
  schemaVersion: 1,
  sourceFingerprint,
  sourceFile: "content/algebra/storyboard-v2/02_FULL_EDITORIAL_STORYBOARD.json",
  sourceStatus: storyboard.status,
  compositionStatus: "BetterGrades-original editorial storyboard supplied by the owner.",
  releaseRestriction: "Private preview and explicit owner approval are required before production publication.",
  collisionReport: "content/algebra/route-collision-report.json",
};
const assessmentRubricsServer = {
  schemaVersion: 1,
  rubrics: protectedSolutions.map((solution) => ({
    id: questionById.get(solution.questionId)?.id,
    solutionRef: solution.id,
    rubric: solution.detailedRubric,
    expectedAnswer: solution.expectedAnswer,
    acceptedAlternatives: solution.acceptedAlternatives,
    completeSolution: solution.completeSolution,
    gradingBoundary: solution.gradingBoundary,
  })),
};

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const outputs = new Map([
  [resolve(outputDirectory, "course.public.json"), json(coursePublic)],
  [resolve(outputDirectory, "routes.public.json"), json({ schemaVersion: 1, routes })],
  [resolve(outputDirectory, "search.public.json"), json({ schemaVersion: 1, records: searchRecords })],
  [resolve(outputDirectory, "route-collision-report.json"), json(collisionReport)],
  [resolve(outputDirectory, "provenance.server.json"), json(provenanceServer)],
  [resolve(outputDirectory, "assessment-rubrics.server.json"), json(assessmentRubricsServer)],
  [resolve(outputDirectory, "authoring", "lessons.private.json"), json({
    schemaVersion: 1,
    private: true,
    lessons: [...lessonArtifacts.values()].map((artifact) => artifact.privateAuthoring),
  })],
]);

for (const unit of units) {
  const directory = resolve(outputDirectory, "units", `unit-${unit.code.toLowerCase()}`);
  const unitRoutes = routes.filter((route) => route.unitCode === unit.code);
  const unitLessons = [...lessonsById.values()].filter((lesson) => lesson.unitCode === unit.code).sort((a, b) => a.sequence - b.sequence);
  const unitPages = routePages.filter((page) => page.route.unitCode === unit.code);
  const unitAssessments = materializedAssessments.filter((assessment) => assessment.unitCode === unit.code);
  const publicUnitLessons = unitLessons.map((lesson) => lessonArtifacts.get(lesson.id).publicLesson);
  const unitQuestions = questionsByUnit.get(unit.code) ?? [];
  outputs.set(resolve(directory, "unit-index.public.json"), json({ schemaVersion: 1, unit, lessons: publicUnitLessons }));
  outputs.set(resolve(directory, "routes.public.json"), json({ schemaVersion: 1, unit, routes: unitRoutes }));
  outputs.set(resolve(directory, "pages.server.json"), json({ schemaVersion: 1, unitId: unit.id, pages: unitPages }));
  outputs.set(resolve(directory, "assessments.public.json"), json({ schemaVersion: 1, unitId: unit.id, assessments: unitAssessments }));
  outputs.set(resolve(directory, "assessment-rubrics.server.json"), json({
    schemaVersion: 1,
    unitId: unit.id,
    rubrics: assessmentRubricsServer.rubrics.filter((rubric) => unitQuestions.some((question) => question.id === rubric.id)),
  }));
  outputs.set(resolve(directory, "exercise-families.public.json"), json({
    schemaVersion: 1,
    unitId: unit.id,
    families: exercises.filter((exercise) => exercise.unitCode === unit.code).map(publicExercise),
  }));
  outputs.set(resolve(directory, "exercise-guidance.server.json"), json({
    schemaVersion: 1,
    unitId: unit.id,
    families: exercises.filter((exercise) => exercise.unitCode === unit.code),
  }));
  outputs.set(resolve(directory, "exercise-bank.public.json"), json({
    schemaVersion: 1,
    unitId: unit.id,
    questionCount: unitQuestions.length,
    questions: unitQuestions,
  }));
  outputs.set(resolve(directory, "exercise-solutions.server.json"), json({
    schemaVersion: 1,
    unitId: unit.id,
    solutions: protectedSolutions.filter((solution) => unitQuestions.some((question) => question.id === solution.questionId)),
  }));
  outputs.set(resolve(directory, "visual-authoring-briefs.v3.json"), json({
    schemaVersion: 3,
    unitId: unit.id,
    figures: visualBriefs.filter((visual) => visual.unitCode === unit.code),
  }));
  outputs.set(resolve(directory, "provenance.json"), json({ ...provenanceServer, unitId: unit.id, unitCode: unit.code }));
}

async function assertCurrent(path, expected) {
  let actual;
  try {
    actual = await readFile(path, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`${path.replace(`${root}/`, "")} is missing. Run algebra:import.`);
    throw error;
  }
  if (actual.replace(/\r\n?/g, "\n") !== expected) throw new Error(`${path.replace(`${root}/`, "")} is stale. Run algebra:import.`);
}

if (checkOnly) {
  for (const [path, expected] of outputs) await assertCurrent(path, expected);
} else {
  for (const [path, value] of outputs) {
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(path, value, "utf8");
  }
}

if (units.length !== 15 || lessonsById.size !== 139 || routes.length !== 226 || visualBriefs.length !== 417 || exercises.length !== 695 || assessmentBlueprints.length !== 55) {
  throw new Error("The Algebra package inventory differs from the approved 15/139/226/417/695/55 contract.");
}
if (routesByPath.size !== routes.length) throw new Error("The reconciled Algebra route registry contains duplicate paths.");
if (visualBriefs.filter((visual) => visual.interactive).length !== 9) throw new Error("The Algebra visual inventory must contain exactly nine interactives.");
console.log(`${checkOnly ? "Verified" : "Imported"} Algebra: 15 units, 139 lessons, 226 course routes (223 net-new), 417 visuals, 695 exercise families, and 55 assessment blueprints.`);
