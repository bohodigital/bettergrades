import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

import course from "../content/algebra/course.public.json" with { type: "json" };
import collisions from "../content/algebra/route-collision-report.json" with { type: "json" };
import precalculusCourse from "../content/precalculus/course.public.json" with { type: "json" };
import baseline from "../data/ia/page-inventory.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");
const bundle = resolve(tmpdir(), `bettergrades-algebra-course-test-${process.pid}.mjs`);
let routing;
let search;

before(async () => {
  await build({
    entryPoints: [resolve(root, "lib/registry/routing.ts"), resolve(root, "lib/site-search.ts")],
    outdir: resolve(tmpdir(), `bettergrades-algebra-course-test-${process.pid}`),
    bundle: true,
    platform: "node",
    format: "esm",
    entryNames: "[name]",
    logLevel: "silent",
  });
  const outdir = resolve(tmpdir(), `bettergrades-algebra-course-test-${process.pid}`);
  routing = await import(`${pathToFileURL(resolve(outdir, "routing.js")).href}?v=${Date.now()}`);
  search = await import(`${pathToFileURL(resolve(outdir, "site-search.js")).href}?v=${Date.now()}`);
});

after(async () => {
  await rm(resolve(tmpdir(), `bettergrades-algebra-course-test-${process.pid}`), { recursive: true, force: true });
  await rm(bundle, { force: true });
});

test("the reconciled Algebra inventory matches the approved package", () => {
  assert.deepEqual(course.counts, {
    units: 15,
    lessons: 139,
    routes: 226,
    netNewRoutes: 223,
    figures: 417,
    interactiveFigures: 9,
    exerciseFamilies: 695,
    assessmentBlueprints: 55,
    concreteQuestions: 2780,
  });
  assert.equal(new Set(course.routes.map((route) => route.id)).size, 226);
  assert.equal(new Set(course.routes.map((route) => route.path)).size, 226);
  assert.equal(new Set(course.routes.map((route) => route.title)).size, 226);
  assert.equal(new Set(course.routes.map((route) => route.description)).size, 226);
  assert.equal(course.pages.length, 226);
});

test("the fourth collision preserves the compact guide and gives the course lesson a distinct intent", () => {
  const compact = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/";
  const fullLesson = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/";
  assert.ok(!course.routes.some((route) => route.path === compact));
  assert.ok(course.routes.some((route) => route.path === fullLesson && route.lessonId === "A10.2"));
  assert.equal(collisions.netNewRouteCount, 223);
  assert.equal(collisions.expectedFinalCanonicalRouteCount, 732);
  assert.equal(collisions.collisions.find((collision) => collision.path === compact)?.replacementCoursePath, fullLesson);
});

test("all current 509 canonicals survive and the expanded registry has the exact course inventory", () => {
  assert.equal(baseline.routeCount, 509);
  assert.equal(precalculusCourse.routes.length, 256);
  const expectedRouteCount = collisions.expectedFinalCanonicalRouteCount + precalculusCourse.routes.length;
  assert.equal(expectedRouteCount, 988);
  assert.equal(routing.publicRoutes.length, expectedRouteCount);
  assert.equal(routing.registryRoutes.length, expectedRouteCount);
  assert.equal(new Set(routing.publicRoutes).size, expectedRouteCount);
  const routes = new Set(routing.publicRoutes);
  for (const page of baseline.routes) assert.ok(routes.has(page.route), `preserved route ${page.route}`);
  for (const route of precalculusCourse.routes) assert.ok(routes.has(route.path), `Precalculus route ${route.path}`);
});

test("every Algebra unit has normalized route, page, assessment, exercise, visual, and provenance artifacts", async () => {
  for (const unit of course.units) {
    const directory = resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`);
    const files = [
      "unit-index.public.json",
      "routes.public.json",
      "pages.server.json",
      "assessments.public.json",
      "assessment-rubrics.server.json",
      "exercise-families.public.json",
      "exercise-guidance.server.json",
      "exercise-bank.public.json",
      "exercise-solutions.server.json",
      "visual-authoring-briefs.v3.json",
      "visual-semantic-manifests.v1.json",
      "visual-specs.v1.json",
      "compiled-scenes.v1.json",
      "public-runtime-scenes.server.json",
      "provenance.json",
    ];
    for (const name of files) assert.ok((await readFile(resolve(directory, name), "utf8")).length > 20, `${unit.code} ${name}`);
  }
});

test("all 417 visuals compile through BVLP with nine route-local interactives and bounded SVGs", async () => {
  let scenes = 0;
  let interactive = 0;
  let functionGraphs = 0;
  let interactiveFunctionGraphs = 0;
  const ids = new Set();
  for (const unit of course.units) {
    const manifest = JSON.parse(await readFile(resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`, "public-runtime-scenes.server.json"), "utf8"));
    const specs = JSON.parse(await readFile(resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`, "visual-specs.v1.json"), "utf8"));
    const graphIds = new Set(specs.visuals
      .filter((visual) => visual.kind === "cartesian-2d" && visual.layers.some((layer) => layer.kind === "function"))
      .map((visual) => visual.id));
    scenes += manifest.sceneCount;
    interactive += manifest.interactiveCount;
    for (const scene of manifest.scenes) {
      assert.ok(!ids.has(scene.id), scene.id);
      ids.add(scene.id);
      assert.ok(scene.staticAsset.bytes < 50_000, scene.id);
      assert.ok(scene.staticAsset.path.startsWith("/visuals/v1/algebra-"), scene.id);
      assert.equal(Boolean(scene.interactiveScene), scene.hydration !== "none", scene.id);
      assert.equal(scene.isFunctionGraph, graphIds.has(scene.id), `${scene.id} function-graph classification`);
      if (scene.isFunctionGraph) {
        functionGraphs += 1;
        if (scene.hydration !== "none") interactiveFunctionGraphs += 1;
      }
    }
  }
  assert.equal(scenes, 417);
  assert.equal(interactive, 9);
  assert.equal(functionGraphs, 38);
  assert.equal(interactiveFunctionGraphs, 8);
  assert.equal(ids.size, 417);
});

test("browser-safe Algebra data does not expose answer boundaries or response rubrics", async () => {
  const source = await readFile(resolve(root, "content/algebra/course.public.json"), "utf8");
  assert.doesNotMatch(source, /canonicalAnswer|expectedAnswer|acceptedAnswers|completeSolution|answerBoundary|gradingPolicy|A strong response demonstrates/);
  const api = await readFile(resolve(root, "app/api/algebra-course-reveal/route.ts"), "utf8");
  assert.match(api, /getAlgebraAssessmentRubric/);
  assert.match(api, /Write a real attempt/);
});

test("all 139 learner lessons satisfy the remediation authoring contract", () => {
  const lessons = course.pages.filter((page) => page.lesson).map((page) => page.lesson);
  assert.equal(lessons.length, 139);
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, 139);
  for (const lesson of lessons) {
    assert.equal(lesson.prerequisiteChecks.length, 3, lesson.id);
    assert.ok(lesson.exposition.length >= 2, lesson.id);
    assert.ok(lesson.exposition.every((paragraph) => paragraph.length >= 180), lesson.id);
    assert.ok(lesson.definitions.length >= 1, lesson.id);
    const expectedExampleKinds = lesson.textbookEdition === "authored-v4"
      ? ["worked-example-1", "worked-example-2", "worked-example-3"]
      : ["foundation", "representation", "transfer"];
    assert.deepEqual(lesson.examples.map((example) => example.kind), expectedExampleKinds, lesson.id);
    assert.ok(lesson.examples.every((example) => example.steps.length >= 2 && example.answer && example.interpretation.length >= 15), lesson.id);
    assert.ok(lesson.misconceptions.every((item) => item.wrongMove.length >= 10 && item.whyItFails.length >= 20 && item.repair.length >= 15), lesson.id);
    const expectedQuestionCount =
      lesson.foundationEdition === "authored-v2" || lesson.textbookEdition?.startsWith("authored-")
        ? 20
        : 16;
    assert.equal(lesson.practiceQuestions.length, expectedQuestionCount, lesson.id);
    assert.equal(lesson.exercises.length, expectedQuestionCount, lesson.id);
    assert.equal(lesson.exitCheck.length, 2, lesson.id);
    assert.ok(lesson.sources.length >= 1, lesson.id);
  }
});

test("A3–A14 meet the complete textbook authoring standard", async () => {
  const lessons = course.pages
    .filter((page) => page.lesson && /^A(?:[3-9]|1[0-4])\./.test(page.lesson.id))
    .map((page) => page.lesson);
  const questions = lessons.flatMap((lesson) => lesson.practiceQuestions);
  const publicTextbook = JSON.stringify(lessons);

  assert.equal(lessons.length, 111);
  assert.ok(lessons.every((lesson) => lesson.textbookEdition === "authored-v4"));
  assert.equal(questions.length, 2220);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, 2220);
  assert.ok(lessons.every((lesson) => lesson.exposition.length >= 10));
  assert.ok(lessons.every((lesson) => {
    const wordCount = lesson.exposition.join(" ").match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu)?.length ?? 0;
    return wordCount >= 650;
  }));
  assert.ok(lessons.every((lesson) => lesson.method?.title && lesson.method.steps.length === 3 && lesson.method.check));
  assert.ok(lessons.every((lesson) => lesson.definitions.length >= 4));
  assert.ok(lessons.every((lesson) => lesson.examples.length === 3));
  assert.ok(lessons.every((lesson) => new Set(lesson.examples.map((example) => example.prompt)).size === 3));
  const examples = lessons.flatMap((lesson) => lesson.examples);
  assert.equal(examples.length, 333);
  assert.equal(new Set(examples.map((example) => example.prompt)).size, 333);
  assert.ok(examples.every((example) => example.steps.length >= 3 && example.answer && example.interpretation.length >= 20));
  assert.doesNotMatch(publicTextbook, /Begin by naming the mathematical objects before manipulating them/);
  assert.doesNotMatch(publicTextbook, /Represent the result of this .* case/);
  assert.doesNotMatch(publicTextbook, /A correctly labeled second representation that preserves/);
  assert.doesNotMatch(publicTextbook, /Represent and verify the result of the worked case/);
  assert.doesNotMatch(publicTextbook, /A learner reports .* but does not show the check/);

  const expectedLessonCases = new Map([
    ["A10.2", /Simplify \(x² − 9\)\/\(x² − x − 6\)/],
    ["A12.5", /find the range and intervals of increase and decrease/],
    ["A13.3", /5\(0\.8\)/],
  ]);
  for (const [lessonId, expectedPrompt] of expectedLessonCases) {
    const lesson = lessons.find((entry) => entry.id === lessonId);
    assert.match(lesson.examples[0].prompt, expectedPrompt, lessonId);
  }

  const protectedSolutions = [];
  for (const unitCode of course.units.map((unit) => unit.code.toLowerCase()).filter((unitCode) => Number(unitCode.slice(1)) >= 3)) {
    const records = JSON.parse(await readFile(resolve(root, "content/algebra/units", `unit-${unitCode}`, "exercise-solutions.server.json"), "utf8"));
    protectedSolutions.push(...records.solutions);
  }
  assert.equal(protectedSolutions.length, 2220);
});

test("A0–A2 are fully authored foundations rather than generic lesson-template variants", async () => {
  const lessons = course.pages
    .filter((page) => page.lesson && /^A[012]\./.test(page.lesson.id))
    .map((page) => page.lesson);
  const questions = lessons.flatMap((lesson) => lesson.practiceQuestions);
  const publicFoundation = JSON.stringify(lessons);
  assert.equal(lessons.length, 28);
  assert.ok(lessons.every((lesson) => lesson.foundationEdition === "authored-v2"));
  assert.equal(questions.length, 560);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, 560);
  assert.ok(lessons.every((lesson) => lesson.exposition.length >= 10));
  assert.ok(lessons.every((lesson) => {
    const wordCount = lesson.exposition.join(" ").match(/\b[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*\b/gu)?.length ?? 0;
    return wordCount >= 650;
  }));
  assert.ok(lessons.every((lesson) => lesson.method?.title && lesson.method.steps.length === 4 && lesson.method.check));
  assert.ok(lessons.every((lesson) => lesson.definitions.length >= 5));
  const expositionParagraphs = lessons.flatMap((lesson) => lesson.exposition);
  assert.equal(new Set(expositionParagraphs).size, expositionParagraphs.length);
  assert.ok(lessons.every((lesson) => new Set(lesson.examples.map((example) => example.prompt)).size === 3));
  assert.doesNotMatch(publicFoundation, /Begin by naming the mathematical objects before manipulating them/);
  assert.doesNotMatch(publicFoundation, /A classmate reaches/);
  assert.doesNotMatch(publicFoundation, /Create a labeled table, graph, number line, or diagram/);

  const protectedSolutions = [];
  for (const unitCode of ["a0", "a1", "a2"]) {
    const records = JSON.parse(await readFile(resolve(root, "content/algebra/units", `unit-${unitCode}`, "exercise-solutions.server.json"), "utf8"));
    protectedSolutions.push(...records.solutions);
  }
  assert.equal(protectedSolutions.length, 560);
  for (const lesson of lessons) {
    const lessonSlug = lesson.id.toLowerCase().replace(".", "-");
    const lessonSolutions = protectedSolutions.filter((solution) => solution.questionId.split("-q")[0] === lessonSlug);
    assert.equal(lessonSolutions.length, 20, lesson.id);
    assert.equal(new Set(lessonSolutions.map((solution) => solution.completeSolution)).size, 20, lesson.id);
  }
});

test("the public learner payload contains no authoring scaffolds or accidental programming tokens", async () => {
  const source = await readFile(resolve(root, "content/algebra/course.public.json"), "utf8");
  const forbidden = [
    "Foundation example: a clean numerical case",
    "Representation example: apply the same idea",
    "Transfer example: combine",
    "Let the anchor figure establish",
    "Return to the opening",
    "The closing paragraph should make",
    "One clean attempt-before-reveal item",
    "Mastery of the preceding dependency strand",
    "Connect the representation to the lesson outcome",
    "A strong response demonstrates",
  ];
  for (const phrase of forbidden) assert.ok(!source.includes(phrase), phrase);
  assert.doesNotMatch(source, /\b(?:NaN|PLACEHOLDER|TODO|TBD)\b/);
  for (const route of course.routes) assert.doesNotMatch(route.description, /\b(?:undefined|null|NaN)\b/, route.path);
});

test("all exercise and assessment surfaces use concrete, protected question records", async () => {
  assert.equal(course.exerciseBank.length, 2780);
  assert.equal(new Set(course.exerciseBank.map((question) => question.id)).size, 2780);
  for (const question of course.exerciseBank) {
    assert.ok(question.prompt.length >= 10, question.id);
    assert.ok(question.hint.length >= 5, question.id);
    assert.ok(question.remediationPath.startsWith("/subjects/math/algebra/"), question.id);
    assert.ok(question.solutionRef.startsWith("solution:"), question.id);
  }
  assert.equal(course.assessments.length, 55);
  for (const assessment of course.assessments) {
    assert.equal(assessment.questionIds.length, assessment.questionCount, assessment.id);
    assert.equal(new Set(assessment.questionIds).size, assessment.questionCount, assessment.id);
    assert.ok(assessment.questionIds.every((id) => course.exerciseBank.some((question) => question.id === id)), assessment.id);
  }
  const protectedRecords = JSON.parse(await readFile(resolve(root, "content/algebra/assessment-rubrics.server.json"), "utf8"));
  assert.equal(protectedRecords.rubrics.length, 2780);
  assert.ok(protectedRecords.rubrics.every((record) => record.expectedAnswer && record.completeSolution && record.rubric));
});

test("all 417 visuals have semantic manifests and no generic scaffold signatures", async () => {
  let manifestCount = 0;
  for (const unit of course.units) {
    const directory = resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`);
    const semantics = JSON.parse(await readFile(resolve(directory, "visual-semantic-manifests.v1.json"), "utf8"));
    const specs = await readFile(resolve(directory, "visual-specs.v1.json"), "utf8");
    manifestCount += semantics.manifests.length;
    assert.ok(semantics.manifests.every((manifest) => manifest.requiredObjects.length && manifest.requiredRelationships.length && manifest.assertions.length));
    assert.doesNotMatch(specs, /Connect the representation to the lesson outcome|context-box|structure-box|meaning-box/);
  }
  assert.equal(manifestCount, 417);
});

test("all 84 A0–A2 visuals carry lesson-authored mathematical labels and relationships", async () => {
  let count = 0;
  for (const unitCode of ["a0", "a1", "a2"]) {
    const directory = resolve(root, "content/algebra/units", `unit-${unitCode}`);
    const semantics = JSON.parse(await readFile(resolve(directory, "visual-semantic-manifests.v1.json"), "utf8"));
    const specs = await readFile(resolve(directory, "visual-specs.v1.json"), "utf8");
    count += semantics.manifests.length;
    assert.ok(semantics.manifests.every((manifest) => manifest.requiredLabels.length >= 4));
    assert.ok(semantics.manifests.every((manifest) => manifest.requiredObjects.length >= 4));
    assert.doesNotMatch(specs, /"id": "checked-result"|generic three-panel scaffold/);
  }
  assert.equal(count, 84);
});

test("exact Algebra titles and skills resolve through the shared search index", () => {
  assert.equal(search.searchSite("Algebra: Quantities, Equations, and Structure")[0]?.path, "/subjects/math/algebra/");
  assert.equal(search.searchSite("Number lines and signed quantities")[0]?.path, "/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  assert.ok(search.searchSite("factor and cancel common factors restrictions").some((record) => record.path === "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/"));
  assert.ok(search.searchSite("simplifying rational expressions by factors").some((record) => record.path === "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/"));
});
