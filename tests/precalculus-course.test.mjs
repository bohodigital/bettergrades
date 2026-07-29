import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import course from "../content/precalculus/course.public.json" with { type: "json" };
import provenance from "../content/precalculus/provenance.server.json" with { type: "json" };
import routeIndex from "../content/precalculus/routes.public.json" with { type: "json" };
import searchIndex from "../content/precalculus/search.public.json" with { type: "json" };
import solutions from "../content/precalculus/solutions.server.json" with { type: "json" };
import sourceLessons from "../content/precalculus/source-package/data/lessons.json" with { type: "json" };
import { getPrecalculusAssessmentAnswer } from "../lib/precalculus/precalculus-course.server.mjs";
import { getPublicPrecalculusCoursePage } from "../lib/precalculus/precalculus-course.mjs";
import { precalculusCourseSearchRecords } from "../lib/precalculus/precalculus-course-search.mjs";

test("Precalculus imports the exact approved learner inventory without public production-split language", () => {
  assert.deepEqual(course.counts, { units: 8, lessons: 84, figures: 252, practiceItems: 840 });
  assert.equal(course.units.length, 8);
  assert.equal(course.lessons.length, 84);
  assert.equal(course.routes.length, 93);
  assert.equal(routeIndex.routes.length, 93);
  assert.equal(searchIndex.records.length, 93);
  assert.equal(solutions.solutions.length, 924);
  assert.equal(new Set(course.routes.map((route) => route.path)).size, 93);
  assert.equal(new Set(course.lessons.map((lesson) => lesson.id)).size, 84);
  assert.doesNotMatch(
    JSON.stringify({ course, routes: routeIndex, search: searchIndex }),
    /\bP[0-7](?:\.\d+)?\b|phase(?:[\s_-]+a)\b|p0(?:[\s_-]+p7)\b|first (?:internal production )?half/i,
  );
  assert.ok(course.routes.every((route) => route.path.startsWith("/subjects/math/precalculus/")));
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
  assert.equal(provenance.publicCopyAdaptations.length, 1);
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

test("Precalculus search and answer services use public IDs and exact protected answers", () => {
  const lesson = course.lessons[0];
  const firstPractice = lesson.practice[0];
  const sourceAnswer = sourceLessons[0].practice[0].answer;
  assert.equal(getPrecalculusAssessmentAnswer(firstPractice.id), `Answer: ${sourceAnswer}`);
  assert.equal(precalculusCourseSearchRecords.length, 93);
  assert.ok(precalculusCourseSearchRecords.some((record) => record.path === lesson.path && record.title === lesson.title));
  assert.doesNotMatch(firstPractice.id, /\bP[0-7](?:\.\d+)?\b/);
});

test("Precalculus source package remains byte-verified by its own checksum inventory", async () => {
  const checksumLines = (await readFile(new URL("../content/precalculus/source-package/SHA256SUMS.txt", import.meta.url), "utf8"))
    .trim()
    .split("\n");
  assert.equal(checksumLines.length, 19);
  assert.equal(provenance.lessons.length, 84);
});

test("Every rendered Precalculus route has canonical course metadata and the dedicated social card", async () => {
  const pages = resolve(import.meta.dirname, "../dist/pages");
  await access(resolve(import.meta.dirname, "../public/og-precalculus.png"));
  for (const route of course.routes) {
    const html = await readFile(resolve(pages, route.path.slice(1), "index.html"), "utf8");
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, route.path);
    assert.match(html, /rel="canonical"/, route.path);
    assert.match(html, /og-precalculus\.png/, route.path);
    assert.doesNotMatch(html, /\bP[0-7](?:\.\d+)?\b|phase(?:[\s_-]+a)\b|first (?:internal production )?half/i, route.path);
  }
});
