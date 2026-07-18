import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import routesArtifact from "../content/calculus/units/unit-2b/routes.public.json" with { type: "json" };
import pagesArtifact from "../content/calculus/units/unit-2b/pages.compiled.server.json" with { type: "json" };
import publicProblems from "../content/calculus/units/unit-2b/assessments.public.json" with { type: "json" };
import publicSets from "../content/calculus/units/unit-2b/assessment-sets.public.json" with { type: "json" };
import compiledVisuals from "../content/calculus/units/unit-2b/compiled-scenes.v1.json" with { type: "json" };
import exerciseAnswers from "../content/calculus/units/unit-2b/exercise-answers.server.json" with { type: "json" };
import applicationModels from "../content/calculus/units/unit-2b/application-models.v1.json" with { type: "json" };
import { evaluateCalculusAnswer, revealCalculusAnswer } from "../lib/calculus/calculus-assessment.server.mjs";
import { calculusUnitRoutes, calculusUnitSearchRecords, getCalculusUnitRoute, isCalculusUnitPath } from "../lib/calculus/calculus-units-index.mjs";
import { getCalculusUnitReveal, getPublicCalculusUnitPage } from "../lib/calculus/calculus-unit.mjs";

const UNIT_ID = "calc-1-unit-2b-derivative-applications";
const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID);

function walk(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    if (node.children) walk(node.children, callback);
  }
}

function count(nodes, type) {
  let total = 0;
  walk(nodes, (node) => { if (node.type === type) total += 1; });
  return total;
}

test("Unit 2B has the exact unique route, core, assessment, and visual inventory", () => {
  assert.equal(routesArtifact.unit.routeCount, 76);
  assert.equal(routesArtifact.unit.coreRouteCount, 57);
  assert.equal(routesArtifact.routes.length, 76);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.path)).size, 76);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.title)).size, 76);
  const core = routesArtifact.routes.filter((route) => route.isCore).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
  assert.deepEqual(core.map((route) => route.coreSequenceIndex), Array.from({ length: 57 }, (_, index) => index + 1));
  assert.equal(core[0].path, "/subjects/math/calculus/derivative-applications/");
  assert.equal(publicProblems.problem_count, 22);
  assert.equal(publicSets.assessments.length, 8);
  assert.equal(compiledVisuals.sceneCount, 34);
  assert.ok(routesArtifact.routes.every((route) => route.indexable && route.releaseState === "public"));
  assert.ok(routesArtifact.routes.every((route) => !/\bChapter\b/i.test(`${route.title} ${route.description}`)));
});

test("Unit 2B owns all 76 canonical paths without duplicate registry records", () => {
  assert.equal(unitRoutes.length, 76);
  assert.equal(calculusUnitSearchRecords.filter((record) => unitRoutes.some((route) => route.path === record.path)).length, 76);
  for (const route of unitRoutes) {
    assert.equal(isCalculusUnitPath(route.path), true);
    assert.equal(getCalculusUnitRoute(route.path)?.id, route.id);
    assert.equal(calculusUnitSearchRecords.filter((record) => record.path === route.path).length, 1);
  }
  assert.equal(isCalculusUnitPath("/subjects/math/calculus/derivative-applications/not-a-real-page/"), false);
});

test("all 76 server pages compile with exposition and no raw drawing source", () => {
  assert.equal(pagesArtifact.pageCount, 76);
  assert.equal(pagesArtifact.pages.length, 76);
  const forbidden = /\\(?:begin\{(?:tikzpicture|axis|groupplot)|addplot|nextgroupplot|BGV[A-Za-z0-9]+)/;
  for (const page of pagesArtifact.pages) {
    assert.ok(page.nodes.length > 0, page.routeId);
    walk(page.nodes, (node) => {
      for (const value of [node.text, node.tex, node.title].filter(Boolean)) assert.doesNotMatch(value, forbidden, page.routeId);
    });
    const route = routesArtifact.routes.find((candidate) => candidate.id === page.routeId);
    if (route?.pageType === "lesson") assert.ok(count(page.nodes, "exposition") >= 2, route.path);
  }
  const keys = pagesArtifact.pages.filter((page) => page.nodes.some((node) => node.type === "answer-key-item"));
  assert.equal(keys.length, 2);
  for (const key of keys) assert.equal(key.nodes.filter((node) => node.type === "answer-key-item").length, 14);
});

test("public payloads are route-local, retain all visuals, and strip server-only solution bodies", () => {
  let checkCount = 0;
  const visualIds = new Set();
  for (const route of unitRoutes) {
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
        assert.ok(node.visual.staticAsset.path.startsWith("/visuals/v1/unit-2b-"));
        visualIds.add(node.visualId);
      }
    });
  }
  assert.equal(checkCount, 22);
  assert.equal(visualIds.size, 34);
});

test("public Unit 2B artifacts contain no canonical answers, source paths, or answer corpus", async () => {
  const publicText = await Promise.all(["routes.public.json", "assessments.public.json", "assessment-sets.public.json"].map((name) => readFile(new URL(`../content/calculus/units/unit-2b/${name}`, import.meta.url), "utf8")));
  const combined = publicText.join("\n");
  for (const field of ["canonical_answer", "worked_solution_latex", "source_latex", "source_file_server_only"]) assert.equal(combined.includes(`\"${field}\"`), false, field);
  assert.equal(combined.includes("exercise-answers.server"), false);
  assert.equal(combined.includes("bettergrades_calculus_units_2a_2b_normalized_handoff_v3/unit-2b/source"), false);
});

test("all exercise-first pages expose one attempt-gated server answer per exercise", () => {
  let supplied = 0;
  for (const answerRoute of exerciseAnswers.routes) {
    const page = pagesArtifact.pages.find((candidate) => candidate.routeId === answerRoute.routeId);
    assert.ok(page, answerRoute.routeId);
    const exercises = count(page.nodes, "exercise");
    const solutions = count(page.nodes, "solution");
    assert.equal(answerRoute.answers.length, exercises, answerRoute.routeId);
    assert.ok(solutions >= exercises, answerRoute.routeId);
    supplied += answerRoute.answers.length;
    const route = routesArtifact.routes.find((candidate) => candidate.id === answerRoute.routeId);
    const publicPage = getPublicCalculusUnitPage(route.path);
    const reveals = [];
    walk(publicPage.page.nodes, (node) => { if (node.type === "solution-reveal") reveals.push(node.revealId); });
    assert.ok(reveals.length >= exercises, route.path);
    for (const revealId of reveals) assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, revealId)?.length > 0, `${route.path} ${revealId}`);
  }
  assert.equal(supplied, 91);
});

test("Unit 2B visuals use 27 static scenes, six core interactives, and one explicit JSXGraph ladder", () => {
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration === "none").length, 27);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.selectedRenderer === "bg-interactive-2d").length, 6);
  const jsx = compiledVisuals.scenes.filter((entry) => entry.selectedRenderer === "jsxgraph");
  assert.equal(jsx.length, 1);
  assert.equal(jsx[0].id, "unit-2b-2b-v09");
  assert.equal(jsx[0].hydration, "explicit-user-action");
  for (const entry of compiledVisuals.scenes) {
    assert.ok(entry.staticAsset.path.startsWith("/visuals/v1/unit-2b-"));
    assert.ok(entry.staticAsset.bytes < 50_000);
    assert.equal(entry.compiledScene.accessibility.staticFallbackEquivalent, true);
    assert.equal(entry.compiledScene.print.grayscaleSafe, true);
    assert.ok(entry.compiledScene.longDescription.length > 80);
  }
});

test("the explicit JSXGraph ladder keeps a complete keyboard and accessibility contract", async () => {
  const source = await readFile(new URL("../app/JsxGraphLadder.tsx", import.meta.url), "utf8");
  assert.match(source, /aria-label="Ladder foot distance from the wall"/);
  assert.match(source, /aria-valuetext=/);
  assert.match(source, /onKeyDown=\{handleDistanceKey\}/);
  for (const key of ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "Home", "End", "PageDown", "PageUp"]) {
    assert.match(source, new RegExp(`\\b${key}:`));
  }
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /footRef\.current\?\.moveTo/);
  assert.match(source, /boardRef\.current\?\.update\(\)/);
});

test("every curated substantial application model carries the complete modeling contract", () => {
  assert.equal(applicationModels.models.length, 11);
  const routes = new Set(unitRoutes.map((route) => route.path));
  for (const model of applicationModels.models) {
    assert.ok(routes.has(model.route), model.route);
    for (const field of applicationModels.requiredFields) {
      assert.ok(field in model, `${model.route} ${field}`);
      const value = model[field];
      assert.ok(Array.isArray(value) ? value.length > 0 : String(value).trim().length > 0, `${model.route} ${field}`);
    }
    assert.ok(compiledVisuals.scenes.some((entry) => entry.id.endsWith(model.visualId.toLowerCase())), `${model.route} ${model.visualId}`);
  }
});

test("Practice Exam B preserves the required question 14 critique rubric", () => {
  const keyRoute = routesArtifact.routes.find((route) => route.path.endsWith("practice-exam-b-answer-key/"));
  const key = pagesArtifact.pages.find((page) => page.routeId === keyRoute.id);
  const item = key.nodes.find((node) => node.type === "answer-key-item" && node.answerNumber === 14);
  assert.ok(item);
  const body = item.children.map((node) => node.text ?? "").join(" ");
  assert.match(body, /assumption/i);
  assert.match(body, /consequence/i);
  assert.match(body, /measurement|model improvement/i);
  assert.match(body, /stopping distance|medication model/i);
});

test("Unit 2B assessment evaluation and reveal remain deterministic and attempt-gated", async () => {
  const first = publicProblems.problems[0];
  const empty = await evaluateCalculusAnswer(UNIT_ID, first.problem_id, "");
  assert.equal(empty.status, "empty");
  assert.equal(revealCalculusAnswer(UNIT_ID, first.problem_id, "").status, 400);
  const attempted = revealCalculusAnswer(UNIT_ID, first.problem_id, "my setup");
  assert.ok(attempted.solutionLatex);
});
