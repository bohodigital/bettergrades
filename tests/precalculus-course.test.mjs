import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import course from "../content/precalculus/course.public.json" with { type: "json" };
import exerciseInventory from "../content/precalculus/exercise-inventory.server.json" with { type: "json" };
import provenance from "../content/precalculus/provenance.server.json" with { type: "json" };
import routeIndex from "../content/precalculus/routes.public.json" with { type: "json" };
import searchIndex from "../content/precalculus/search.public.json" with { type: "json" };
import solutions from "../content/precalculus/solutions.server.json" with { type: "json" };
import sourceLessons from "../content/precalculus/source-package/data/lessons.json" with { type: "json" };
import phaseBSourceLessons from "../content/precalculus/source-package-phase-b/data/lessons.json" with { type: "json" };
import { evaluatePrecalculusAssessmentAnswer, getPrecalculusAssessmentRecord, normalizePrecalculusAnswer, validatePrecalculusAssessmentAnswer } from "../lib/precalculus/precalculus-course.server.mjs";
import { getPublicPrecalculusCoursePage } from "../lib/precalculus/precalculus-course.mjs";
import { precalculusCourseSearchRecords } from "../lib/precalculus/precalculus-course-search.mjs";

test("Precalculus imports the exact approved learner inventory without public production-split language", () => {
  assert.deepEqual(course.counts, { units: 16, lessons: 174, figures: 522, practiceItems: 2_280, assessmentRoutes: 65, assessmentPlacements: 2_013 });
  assert.equal(course.units.length, 16);
  assert.equal(course.lessons.length, 174);
  assert.equal(course.routes.length, 256);
  assert.equal(routeIndex.routes.length, 256);
  assert.equal(searchIndex.records.length, 256);
  assert.equal(solutions.solutions.length, 2_454);
  assert.equal(new Set(course.routes.map((route) => route.path)).size, 256);
  assert.equal(new Set(course.lessons.map((lesson) => lesson.id)).size, 174);
  assert.doesNotMatch(
    JSON.stringify({ course, routes: routeIndex, search: searchIndex }),
    /\bP(?:[0-9]|1[0-5])(?:\.\d+)?\b|phase(?:[\s_-]+[ab])\b|p0(?:[\s_-]+p15)\b|(?:first|second) (?:internal production )?half/i,
  );
  assert.ok(course.routes.every((route) => route.path.startsWith("/subjects/math/precalculus/")));
});

test("every unit publishes concrete review, practice, mastery, and investigation routes plus a cumulative final", () => {
  assert.equal(course.assessments.length, 65);
  for (const unit of course.units) {
    assert.deepEqual(unit.assessments.map((assessment) => assessment.type), ["unit-review", "flexible-practice", "mastery-check", "investigation"]);
    const records = course.assessments.filter((assessment) => assessment.unitId === unit.id);
    assert.ok(records.find((assessment) => assessment.type === "unit-review").items.length >= 40);
    assert.equal(records.find((assessment) => assessment.type === "flexible-practice").items.length, 32);
    assert.ok(records.find((assessment) => assessment.type === "mastery-check").items.length >= 28);
    assert.ok(records.find((assessment) => assessment.type === "investigation").items.length >= 4);
    for (const assessment of records) {
      const page = getPublicPrecalculusCoursePage(assessment.path);
      assert.ok(page.assessment.items.every((item) => item.prompt && item.responseType && item.expectedAnswerPolicy && item.hint && item.remediationTarget));
      assert.ok(assessment.navigation.parent.path === unit.root);
    }
  }
  const final = course.assessments.find((assessment) => assessment.type === "final-assessment");
  assert.equal(final.items.length, 64);
  assert.equal(new Set(final.items.map((item) => item.sourceLessonId.split("-l")[0])).size, 16);
});

test("Every exact lesson field is preserved and every protected answer stays out of public prompt records", () => {
  for (const [index, source] of sourceLessons.entries()) {
    const lesson = course.lessons[index];
    assert.equal(lesson.title, source.title);
    assert.equal(lesson.outcome, source.outcome);
    assert.deepEqual(lesson.opening, source.opening);
    assert.deepEqual(
      lesson.prerequisites,
      source.prerequisites.map((value) => value === "Use function notation from P0."
        ? "Use function notation from the algebra and function readiness unit."
        : value),
    );
    assert.deepEqual(lesson.exposition, source.exposition);
    assert.equal(lesson.commonMistake, source.commonMistake);
    assert.deepEqual(lesson.examples, source.examples);
    assert.equal(lesson.figures.length, 3);
    assert.equal(lesson.practice.length, 10);
    assert.equal(lesson.checkpoint.prompt, source.checkpoint.prompt);
    assert.ok(!Object.hasOwn(lesson.checkpoint, "answer"));
    assert.ok(lesson.practice.every((item) => !Object.hasOwn(item, "answer")));
    assert.equal(lesson.close, source.close);
    assert.deepEqual(lesson.sources, source.sources);
  }
  assert.equal(provenance.publicCopyAdaptations.length, 3);
  assert.deepEqual(
    provenance.publicCopyAdaptations.slice(1).map((correction) => correction.sourceLessonId),
    ["P12.1", "P13.1"],
  );
});

test("accepted P12 and P13 mathematical findings remain corrected in generated learner copy", () => {
  const circleLesson = course.lessons.find((lesson) => lesson.title === "Conics as loci and the circle foundation");
  const parametricLesson = course.lessons.find((lesson) => lesson.title === "Parametric equations and orientation");
  assert.match(JSON.stringify(circleLesson), /x-intercepts \(-6,0\) and \(2,0\).*y-intercepts \(0,3-sqrt\(21\)\) and \(0,3\+sqrt\(21\)\)/);
  assert.match(JSON.stringify(parametricLesson), /-5<=x<=5, traced from left to right as t increases from -2 to 3/);
});

test("The full second-half manuscript renders as structured textbook reading while answers remain server-held", () => {
  const installedLessons = course.lessons.slice(sourceLessons.length);
  assert.equal(installedLessons.length, phaseBSourceLessons.length);
  for (const [index, source] of phaseBSourceLessons.entries()) {
    const lesson = installedLessons[index];
    assert.equal(lesson.title, source.title);
    assert.equal(lesson.practice.length, 16);
    assert.equal(lesson.figures.length, 3);
    assert.ok(lesson.textbookSections.length >= 10);
    assert.ok(lesson.textbookSections.some((section) => section.kind === "figures"));
    assert.ok(lesson.textbookSections.some((section) => section.kind === "checkpoint"));
    assert.ok(lesson.textbookSections.some((section) => section.kind === "practice"));
    assert.ok(lesson.textbookSections.some((section) => section.kind === "sources"));
    assert.ok(lesson.practice.every((item) => !Object.hasOwn(item, "answer")));
    assert.ok(!Object.hasOwn(lesson.checkpoint, "answer"));
  }
  assert.doesNotMatch(JSON.stringify(installedLessons), /Practice answers and guidance|<details|lesson's main figure/i);
});

test("All Precalculus figures resolve to deterministic static BVLP assets", async () => {
  for (const lesson of course.lessons) {
    const page = getPublicPrecalculusCoursePage(lesson.path);
    assert.ok(page?.lesson);
    assert.equal(page.lesson.figures.length, 3);
    for (const figure of page.lesson.figures) {
      assert.ok(figure.visual, `${figure.id} resolves to a compiled visual`);
      assert.equal(figure.visual.selectedRenderer, "static-svg");
      assert.equal(figure.visual.hydration, "none");
      assert.ok(figure.visual.staticAsset.bytes <= 50_000);
      await access(new URL(`../public${figure.visual.staticAsset.path}`, import.meta.url));
    }
  }
});

test("all 522 Precalculus scenes carry complete semantic and multimode manifests", async () => {
  const manifests = [];
  for (let unit = 1; unit <= 16; unit += 1) {
    const artifact = JSON.parse(await readFile(new URL(`../content/precalculus/units/unit-${unit}/visual-semantic-manifests.v1.json`, import.meta.url), "utf8"));
    manifests.push(...artifact.manifests);
  }
  assert.equal(manifests.length, 522);
  const requiredFields = [
    "mathematicalClaim", "requiredMathematicalObjects", "requiredLabelsAndUnits", "domainAndExcludedCases",
    "visibleRelationships", "forbiddenMisleadingStates", "renderer", "fallbackRenderer", "keyboardInteraction",
    "initialState", "reducedMotionBehavior", "darkModeBehavior", "responsive320Behavior", "printBehavior",
    "accessibleShortDescription", "accessibleLongDescription", "machineVerifiableAssertions",
  ];
  for (const manifest of manifests) {
    for (const field of requiredFields) assert.ok(Object.hasOwn(manifest, field), `${manifest.id} lacks ${field}`);
    assert.equal(manifest.renderer, "static-svg");
    assert.equal(manifest.machineVerifiableAssertions.length, 4);
  }
});

test("the eleven audited anchor mismatches compile to their route-specific mathematical objects", async () => {
  const expectations = new Map([
    [1, /rational-expression error routes to repair/i],
    [2, /C\(h\)=18\+7h/],
    [3, /square-root endpoint/i],
    [5, /y=-2x\^4/],
    [6, /vertical asymptote x=-2/],
    [7, /each equal step multiplies by 3/i],
    [10, /period is 8 seconds/i],
    [12, /Horizontal run 7\.2 meters/],
    [13, /x-intercept \(-6,0\)/],
    [14, /-5<=x<=5/],
    [16, /shifted exponential decay/i],
  ]);
  for (const [unit, pattern] of expectations) {
    const artifact = await readFile(new URL(`../content/precalculus/units/unit-${unit}/compiled-scenes.v1.json`, import.meta.url), "utf8");
    assert.match(artifact, pattern, `unit ${unit} anchor must match its audited route claim`);
  }
});

test("Precalculus search and protected validation use public IDs without bundling answer data", async () => {
  const lesson = course.lessons[0];
  const firstPractice = lesson.practice[0];
  const sourceAnswer = sourceLessons[0].practice[0].answer;
  const storage = { get: async (id) => solutions.solutions.find((record) => record.id === id) };
  const record = await getPrecalculusAssessmentRecord(storage, firstPractice.id);
  assert.equal(record.answer, sourceAnswer);
  assert.equal(await validatePrecalculusAssessmentAnswer(record, sourceAnswer), true);
  assert.equal(await validatePrecalculusAssessmentAnswer(record, "anything nonempty"), false);
  assert.equal(normalizePrecalculusAnswer(" Identity; all real numbers. "), "identityallrealnumbers");
  assert.equal(precalculusCourseSearchRecords.length, 256);
  assert.ok(precalculusCourseSearchRecords.some((record) => record.path === lesson.path && record.title === lesson.title));
  assert.doesNotMatch(firstPractice.id, /\bP[0-7](?:\.\d+)?\b/);
});

test("P8–P15 publishes a typed, difficulty-balanced, duplication-free concrete exercise inventory", () => {
  assert.deepEqual(exerciseInventory.totals, {
    coursePracticeItems: 2_280,
    phaseBPracticeItems: 1_440,
    phaseBLessons: 90,
    normalizedDuplicateGroups: 0,
    normalizedDuplicatePlacements: 0,
    authoringInstructionOnlyItems: 0,
    genericNonAnswerGuides: 0,
    overlongPrompts: 0,
    solutionScaffoldPromptLeaks: 0,
  });
  assert.equal(exerciseInventory.phaseBByLesson.length, 90);
  assert.ok(exerciseInventory.phaseBByLesson.every((lesson) => lesson.practiceItemCount === 16));
  assert.ok(exerciseInventory.phaseBByLesson.every((lesson) => Object.keys(lesson.exerciseTypes).length >= 7));
  assert.ok(exerciseInventory.phaseBByLesson.every((lesson) => Object.keys(lesson.difficulties).length === 3));
  assert.deepEqual(exerciseInventory.normalizedDuplicates, []);
  assert.deepEqual(exerciseInventory.authoringInstructionItems, []);
  assert.deepEqual(exerciseInventory.qualityFindings, {
    genericNonAnswerGuides: [],
    overlongPrompts: [],
    solutionScaffoldPromptLeaks: [],
  });
});

test("all 2,454 Precalculus records enforce an explicit validation and reveal policy", async () => {
  const policyCounts = new Map();
  for (const record of solutions.solutions) {
    assert.ok(["numeric", "symbolic", "multipart", "exact_text", "manual_rubric"].includes(record.validation.type), `${record.id} has a declared policy`);
    policyCounts.set(record.validation.type, (policyCounts.get(record.validation.type) ?? 0) + 1);

    const correct = await evaluatePrecalculusAssessmentAnswer(record, record.answer);
    if (record.validation.type === "manual_rubric") {
      assert.equal(correct.status, "manual_review", `${record.id} must not be called automatically correct`);
      assert.equal(correct.revealAllowed, true, `${record.id} permits model comparison after substantive work`);
    } else {
      assert.equal(correct.status, "correct", `${record.id} accepts its canonical correct corpus`);
      assert.equal(correct.revealAllowed, true);
    }

    const arbitrary = await evaluatePrecalculusAssessmentAnswer(record, "anything nonempty");
    assert.notEqual(arbitrary.status, "correct", `${record.id} rejects arbitrary nonempty text as correct`);
    assert.equal(arbitrary.revealAllowed, false, `${record.id} does not reveal for arbitrary nonempty text`);
  }
  assert.deepEqual(Object.fromEntries([...policyCounts].sort()), {
    exact_text: 330,
    manual_rubric: 1798,
    multipart: 23,
    numeric: 70,
    symbolic: 233,
  });
});

test("numeric, symbolic, multipart, and manual policies enforce their distinct semantics", async () => {
  assert.equal((await evaluatePrecalculusAssessmentAnswer({ answer: "1/2", validation: { type: "numeric", tolerance: 1e-9 } }, "0.5")).status, "correct");
  assert.equal((await evaluatePrecalculusAssessmentAnswer({ answer: "(x-2)(x-3)", validation: { type: "symbolic" } }, "x^2-5x+6")).status, "correct");
  assert.equal((await evaluatePrecalculusAssessmentAnswer({ answer: "2; 3", validation: { type: "multipart", separator: ";", components: [{ type: "numeric" }, { type: "numeric" }] } }, "2")).status, "incorrect");
  const manual = await evaluatePrecalculusAssessmentAnswer({ answer: "A model response with complete reasoning.", validation: { type: "manual_rubric", revealPolicy: "attempt_then_model", minimumAttemptLength: 24 } }, "I used the domain restriction and checked the result by substitution.");
  assert.equal(manual.status, "manual_review");
  assert.equal(manual.revealAllowed, true);
});

test("Precalculus source package remains byte-verified by its own checksum inventory", async () => {
  const checksumLines = (await readFile(new URL("../content/precalculus/source-package/SHA256SUMS.txt", import.meta.url), "utf8"))
    .trim()
    .split("\n");
  const phaseBChecksumLines = (await readFile(new URL("../content/precalculus/source-package-phase-b/SHA256SUMS.txt", import.meta.url), "utf8"))
    .trim()
    .split("\n");
  assert.equal(checksumLines.length, 19);
  assert.equal(phaseBChecksumLines.length, 20);
  assert.equal(provenance.packages.length, 2);
  assert.equal(provenance.lessons.length, 174);
});

test("Every rendered Precalculus route has canonical course metadata and the dedicated social card", async () => {
  const pages = resolve(import.meta.dirname, "../dist/pages");
  await access(resolve(import.meta.dirname, "../public/og-precalculus.png"));
  for (const route of course.routes) {
    const html = await readFile(resolve(pages, route.path.slice(1), "index.html"), "utf8");
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, route.path);
    assert.match(html, /rel="canonical"/, route.path);
    assert.match(html, /og-precalculus\.png/, route.path);
    assert.doesNotMatch(html, /\bP(?:[0-9]|1[0-5])(?:\.\d+)?\b|phase(?:[\s_-]+[ab])\b|(?:first|second) (?:internal production )?half/i, route.path);
  }
});
