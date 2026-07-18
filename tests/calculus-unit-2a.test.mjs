import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import routesArtifact from "../content/calculus/units/unit-2a/routes.public.json" with { type: "json" };
import pagesArtifact from "../content/calculus/units/unit-2a/pages.compiled.server.json" with { type: "json" };
import publicProblems from "../content/calculus/units/unit-2a/assessments.public.json" with { type: "json" };
import publicSets from "../content/calculus/units/unit-2a/assessment-sets.public.json" with { type: "json" };
import compiledVisuals from "../content/calculus/units/unit-2a/compiled-scenes.v1.json" with { type: "json" };
import exerciseAnswers from "../content/calculus/units/unit-2a/exercise-answers.server.json" with { type: "json" };
import { evaluateCalculusAnswer, revealCalculusAnswer } from "../lib/calculus/calculus-assessment.server.mjs";
import { calculusUnitRoutes, calculusUnitSearchRecords, getCalculusUnitRoute, isCalculusUnitPath } from "../lib/calculus/calculus-units-index.mjs";
import { getCalculusUnitReveal, getPublicCalculusUnitPage } from "../lib/calculus/calculus-unit.mjs";

const UNIT_ID = "calc-1-unit-2a-derivative-foundations-techniques";

function walk(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    if (node.children) walk(node.children, callback);
  }
}

test("Unit 2A has the exact unique route and core-sequence inventory", () => {
  assert.equal(routesArtifact.unit.routeCount, 67);
  assert.equal(routesArtifact.unit.coreRouteCount, 49);
  assert.equal(routesArtifact.routes.length, 67);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.path)).size, 67);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.title)).size, 67);
  const core = routesArtifact.routes.filter((route) => route.isCore).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
  assert.deepEqual(core.map((route) => route.coreSequenceIndex), Array.from({ length: 49 }, (_, index) => index + 1));
  assert.equal(core[0].path, "/subjects/math/calculus/derivatives/");
  assert.ok(routesArtifact.routes.every((route) => route.indexable && route.releaseState === "public"));
  assert.ok(routesArtifact.routes.every((route) => !/\bChapter\b/i.test(`${route.title} ${route.description}`)));
  assert.ok(routesArtifact.routes.every((route) => !/(?:\.{3}|…)/.test(route.description)));
});

test("Unit 2A owns its canonical paths without duplicate registry records", () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID);
  const unitSearchRecords = calculusUnitSearchRecords.filter((record) => unitRoutes.some((route) => route.path === record.path));
  assert.equal(unitRoutes.length, 67);
  assert.equal(unitSearchRecords.length, 67);
  for (const route of unitRoutes) {
    assert.equal(isCalculusUnitPath(route.path), true);
    assert.equal(getCalculusUnitRoute(route.path)?.id, route.id);
    assert.equal(calculusUnitSearchRecords.filter((record) => record.path === route.path).length, 1);
  }
  assert.equal(isCalculusUnitPath("/subjects/math/calculus/derivatives/not-a-real-page/"), false);
});

test("all 67 server pages compile semantically with no raw drawing source", () => {
  assert.equal(pagesArtifact.pageCount, 67);
  assert.equal(pagesArtifact.pages.length, 67);
  const forbidden = /\\(?:begin\{(?:tikzpicture|axis|groupplot)|addplot|nextgroupplot|BGV[A-Za-z0-9]+)/;
  for (const page of pagesArtifact.pages) {
    assert.ok(page.nodes.length > 0, page.routeId);
    walk(page.nodes, (node) => {
      for (const value of [node.text, node.tex, node.title].filter(Boolean)) assert.doesNotMatch(value, forbidden, page.routeId);
    });
  }
  const keys = pagesArtifact.pages.filter((page) => page.nodes.some((node) => node.type === "answer-key-item"));
  assert.equal(keys.length, 2);
  for (const key of keys) assert.equal(key.nodes.filter((node) => node.type === "answer-key-item").length, 14);
});

test("public page payloads are route-local and strip ordinary solution bodies", () => {
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
        assert.ok(node.visual.staticAsset.path.startsWith("/visuals/v1/unit-2a-"));
        visualIds.add(node.visualId);
      }
    });
    assert.equal("sourceFile" in page.page, false);
    assert.equal("sourceLatex" in page.page, false);
  }
  assert.equal(checkCount, 34);
  assert.equal(visualIds.size, 27);
});

test("the public artifacts do not contain canonical answers or source paths", async () => {
  const publicText = [
    "routes.public.json",
    "assessments.public.json",
    "assessment-sets.public.json",
  ].map((name) => readFile(new URL(`../content/calculus/units/unit-2a/${name}`, import.meta.url), "utf8"));
  const combined = (await Promise.all(publicText)).join("\n");
  for (const field of ["canonical_answer", "worked_solution_latex", "source_latex", "source_file_server_only"]) assert.equal(combined.includes(`\"${field}\"`), false, field);
  assert.equal(combined.includes("bettergrades_calculus_units_2a_2b_normalized_handoff_v3/unit-2a/source"), false);
});

test("Unit 2A assessment inventory is complete and deterministic", async () => {
  assert.equal(publicProblems.problem_count, 34);
  assert.equal(publicSets.assessments.length, 7);
  assert.equal(new Set(publicProblems.problems.map((problem) => problem.problem_id)).size, 34);
  const integer = await evaluateCalculusAnswer(UNIT_ID, "deriv-foundation-01", "12");
  assert.equal(integer.status, "correct");
  const rational = await evaluateCalculusAnswer(UNIT_ID, "inverse-function-01", "2/16");
  assert.equal(rational.status, "correct");
  const choice = await evaluateCalculusAnswer(UNIT_ID, "meaning-derivative-01", "a rate of change");
  assert.equal(choice.status, "correct");
  const empty = await evaluateCalculusAnswer(UNIT_ID, "deriv-foundation-01", "");
  assert.equal(empty.status, "empty");
  const rubric = await evaluateCalculusAnswer(UNIT_ID, "units-derivative-01", "It is measured in liters for each centimeter.");
  assert.ok(["correct", "uncertain"].includes(rubric.status));
  const concept = await evaluateCalculusAnswer(UNIT_ID, "chain-rule-concept-quiz-01", "Each stage passes its local rate to the next.");
  assert.equal(concept.status, "uncertain");
  assert.equal(revealCalculusAnswer(UNIT_ID, "deriv-foundation-01", "").status, 400);
  assert.match(revealCalculusAnswer(UNIT_ID, "deriv-foundation-01", "12").solutionLatex, /12/);
});

test("route answer reveals require the exact unit, route, and reveal ID", () => {
  const route = getCalculusUnitRoute("/subjects/math/calculus/derivatives/prerequisite-diagnostic/");
  const page = getPublicCalculusUnitPage(route.path);
  const revealIds = [];
  walk(page.page.nodes, (node) => { if (node.type === "solution-reveal") revealIds.push(node.revealId); });
  assert.ok(revealIds.length > 0);
  assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, revealIds[0]).length > 0);
  assert.equal(getCalculusUnitReveal(UNIT_ID, "wrong-route", revealIds[0]), undefined);
  assert.equal(getCalculusUnitReveal("wrong-unit", route.id, revealIds[0]), undefined);
});

test("the cumulative practice set has one attempt-gated answer for every exercise", () => {
  const route = getCalculusUnitRoute("/subjects/math/calculus/derivatives/unit-2a-cumulative-practice/");
  const compiled = pagesArtifact.pages.find((page) => page.routeId === route.id);
  assert.equal(compiled.nodes.filter((node) => node.type === "exercise").length, 36);
  assert.equal(compiled.nodes.filter((node) => node.type === "solution").length, 36);
  assert.equal(exerciseAnswers.routes[0].answers.length, 36);
  const page = getPublicCalculusUnitPage(route.path);
  const revealIds = page.page.nodes.filter((node) => node.type === "solution-reveal").map((node) => node.revealId);
  assert.equal(revealIds.length, 36);
  for (const revealId of revealIds) assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, revealId)?.length > 0, revealId);
});

test("all 27 Unit 2A visuals retain static fallbacks and the approved renderer split", () => {
  assert.equal(compiledVisuals.sceneCount, 27);
  assert.equal(compiledVisuals.scenes.length, 27);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration !== "none").length, 1);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration === "none").length, 26);
  for (const entry of compiledVisuals.scenes) {
    assert.ok(entry.staticAsset.path.startsWith("/visuals/v1/unit-2a-"));
    assert.ok(entry.staticAsset.bytes < 50_000);
    assert.equal(entry.compiledScene.accessibility.staticFallbackEquivalent, true);
    assert.equal(entry.compiledScene.print.grayscaleSafe, true);
    assert.ok(entry.compiledScene.longDescription.length > 80);
  }
});
