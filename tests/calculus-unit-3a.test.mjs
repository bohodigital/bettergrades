import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import routesArtifact from "../content/calculus/units/unit-3a/routes.public.json" with { type: "json" };
import pagesArtifact from "../content/calculus/units/unit-3a/pages.compiled.server.json" with { type: "json" };
import publicProblems from "../content/calculus/units/unit-3a/assessments.public.json" with { type: "json" };
import publicSets from "../content/calculus/units/unit-3a/assessment-sets.public.json" with { type: "json" };
import serverSets from "../content/calculus/units/unit-3a/assessment-sets.server.json" with { type: "json" };
import compiledVisuals from "../content/calculus/units/unit-3a/compiled-scenes.v1.json" with { type: "json" };
import exerciseAnswers from "../content/calculus/units/unit-3a/exercise-answers.server.json" with { type: "json" };
import { evaluateCalculusAnswer, revealCalculusAnswer } from "../lib/calculus/calculus-assessment.server.mjs";
import { calculusUnitRoutes, calculusUnitSearchRecords, getCalculusUnitRoute, isCalculusUnitPath } from "../lib/calculus/calculus-units-index.mjs";
import { getCalculusUnitReveal, getPublicCalculusUnitPage } from "../lib/calculus/calculus-unit.mjs";

const UNIT_ID = "calc-1-unit-3a-integral-foundations-techniques";

function walk(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    if (node.children) walk(node.children, callback);
  }
}

test("Unit 3A has the exact unique public route and core sequence", () => {
  assert.equal(routesArtifact.unit.routeCount, 36);
  assert.equal(routesArtifact.unit.coreRouteCount, 30);
  assert.equal(routesArtifact.routes.length, 36);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.path)).size, 36);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.title)).size, 36);
  const core = routesArtifact.routes.filter((route) => route.isCore).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
  assert.deepEqual(core.map((route) => route.coreSequenceIndex), Array.from({ length: 30 }, (_, index) => index + 1));
  assert.equal(core[0].path, "/subjects/math/calculus/integrals/");
  assert.ok(routesArtifact.routes.every((route) => route.indexable && route.releaseState === "public"));
  assert.ok(routesArtifact.routes.every((route) => !/\bChapter\b/i.test(`${route.title} ${route.description}`)));
  assert.ok(routesArtifact.routes.every((route) => !/(?:\.{3}|â€¦)/.test(route.description)));
});

test("Unit 3A owns one registry and search record per canonical path", () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID);
  assert.equal(unitRoutes.length, 36);
  for (const route of unitRoutes) {
    assert.equal(isCalculusUnitPath(route.path), true);
    assert.equal(getCalculusUnitRoute(route.path)?.id, route.id);
    assert.equal(calculusUnitSearchRecords.filter((record) => record.path === route.path).length, 1);
  }
  assert.equal(isCalculusUnitPath("/subjects/math/calculus/integrals/not-a-real-page/"), false);
});

test("all Unit 3A pages compile semantically with no raw drawing source", () => {
  assert.equal(pagesArtifact.pageCount, 36);
  assert.equal(pagesArtifact.pages.length, 36);
  const forbidden = /\\(?:begin\{(?:tikzpicture|axis|groupplot)|addplot|nextgroupplot|BGV[A-Za-z0-9]+)/;
  for (const page of pagesArtifact.pages) {
    assert.ok(page.nodes.length > 0, page.routeId);
    walk(page.nodes, (node) => {
      for (const value of [node.text, node.tex, node.title].filter(Boolean)) assert.doesNotMatch(value, forbidden, page.routeId);
    });
  }
  const keys = pagesArtifact.pages.filter((page) => page.nodes.some((node) => node.type === "answer-key-item"));
  assert.equal(keys.length, 2);
  assert.deepEqual(keys.map((key) => key.nodes.filter((node) => node.type === "answer-key-item").length).sort((a, b) => a - b), [10, 12]);
});

test("public Unit 3A payloads are route-local, visual-complete, and solution-safe", () => {
  let checkCount = 0;
  const visualIds = new Set();
  for (const route of calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID)) {
    const page = getPublicCalculusUnitPage(route.path);
    assert.ok(page, route.path);
    assert.equal(page.route.id, route.id);
    checkCount += page.checks.length;
    walk(page.page.nodes, (node) => {
      if (route.pageType !== "answer-key") assert.notEqual(node.type, "solution", route.path);
      if (node.type === "solution-reveal") assert.equal(node.children, undefined);
      assert.notEqual(node.type, "graph-specification", route.path);
      if (node.type === "visual-reference") {
        assert.ok(node.visual, `${route.path} ${node.visualId}`);
        assert.ok(node.visual.staticAsset.path.startsWith("/visuals/v1/unit-3a-"));
        visualIds.add(node.visualId);
      }
    });
    assert.equal("sourceFile" in page.page, false);
    assert.equal("sourceLatex" in page.page, false);
  }
  assert.equal(checkCount, 28);
  assert.equal(visualIds.size, 11);
});

test("public Unit 3A artifacts contain no canonical answers or source paths", async () => {
  const names = ["routes.public.json", "assessments.public.json", "assessment-sets.public.json"];
  const combined = (await Promise.all(names.map((name) => readFile(new URL(`../content/calculus/units/unit-3a/${name}`, import.meta.url), "utf8")))).join("\n");
  for (const field of ["canonical_answer", "worked_solution_latex", "source_latex", "source_file_server_only"]) assert.equal(combined.includes(`\"${field}\"`), false, field);
  assert.equal(combined.includes("bettergrades_integral_calculus_units_3a_3b_complete_handoff_v3"), false);
});

test("Unit 3A checks grade bounded numeric, rational, and antiderivative answers", async () => {
  assert.equal(publicProblems.problem_count, 28);
  assert.equal(publicSets.assessments.length, 2);
  assert.equal(new Set(publicProblems.problems.map((problem) => problem.problem_id)).size, 28);
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3a-rate-total-01", "28")).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3a-partition-01", "0.6")).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3a-antiderivative-01", "4x - 3x^2 + 2x^3 + K")).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3a-antiderivative-01", "2x^3 - 3x^2 + 4x")).status, "incorrect");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3a-antiderivative-01", "")).status, "empty");
  assert.equal(revealCalculusAnswer(UNIT_ID, "u3a-rate-total-01", "").status, 400);
  assert.match(revealCalculusAnswer(UNIT_ID, "u3a-rate-total-01", "28").solutionLatex, /28/);
});

test("both Unit 3A exam answer keys are complete, separate, and easy to resolve", () => {
  assert.equal(serverSets.assessments.length, 2);
  assert.deepEqual(serverSets.assessments.map((set) => set.items.length), [10, 12]);
  for (const set of publicSets.assessments) {
    const examPath = `/${set.route}/`;
    const keyPath = `/${set.answer_key_route}/`;
    assert.equal(getCalculusUnitRoute(examPath)?.pageType, "exam");
    assert.equal(getCalculusUnitRoute(keyPath)?.pageType, "answer-key");
    assert.ok(getPublicCalculusUnitPage(examPath));
    assert.ok(getPublicCalculusUnitPage(keyPath));
  }
});

test("the cumulative practice page has one attempt-gated answer per exercise", () => {
  const route = getCalculusUnitRoute("/subjects/math/calculus/integrals/cumulative-practice/");
  const compiled = pagesArtifact.pages.find((page) => page.routeId === route.id);
  assert.equal(compiled.nodes.filter((node) => node.type === "exercise").length, 12);
  assert.equal(compiled.nodes.filter((node) => node.type === "solution").length, 12);
  assert.equal(exerciseAnswers.routes[0].answers.length, 12);
  const page = getPublicCalculusUnitPage(route.path);
  const revealIds = page.page.nodes.filter((node) => node.type === "solution-reveal").map((node) => node.revealId);
  assert.equal(revealIds.length, 12);
  for (const revealId of revealIds) assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, revealId)?.length > 0, revealId);
});

test("all Unit 3A visuals retain lightweight, accessible static and print fallbacks", () => {
  assert.equal(compiledVisuals.sceneCount, 11);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration !== "none").length, 4);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration === "none").length, 7);
  for (const entry of compiledVisuals.scenes) {
    assert.ok(entry.staticAsset.path.startsWith("/visuals/v1/unit-3a-"));
    assert.ok(entry.staticAsset.bytes < 50_000);
    assert.equal(entry.compiledScene.accessibility.staticFallbackEquivalent, true);
    assert.equal(entry.compiledScene.print.grayscaleSafe, true);
    assert.ok(entry.compiledScene.longDescription.length > 80);
  }
});
