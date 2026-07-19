import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import routesArtifact from "../content/calculus/units/unit-3b/routes.public.json" with { type: "json" };
import pagesArtifact from "../content/calculus/units/unit-3b/pages.compiled.server.json" with { type: "json" };
import publicProblems from "../content/calculus/units/unit-3b/assessments.public.json" with { type: "json" };
import publicSets from "../content/calculus/units/unit-3b/assessment-sets.public.json" with { type: "json" };
import serverSets from "../content/calculus/units/unit-3b/assessment-sets.server.json" with { type: "json" };
import compiledVisuals from "../content/calculus/units/unit-3b/compiled-scenes.v1.json" with { type: "json" };
import exerciseAnswers from "../content/calculus/units/unit-3b/exercise-answers.server.json" with { type: "json" };
import { evaluateCalculusAnswer, revealCalculusAnswer } from "../lib/calculus/calculus-assessment.server.mjs";
import { calculusUnitRoutes, calculusUnitSearchRecords, getCalculusUnitRoute, isCalculusUnitPath } from "../lib/calculus/calculus-units-index.mjs";
import { getCalculusUnitReveal, getPublicCalculusUnitPage } from "../lib/calculus/calculus-unit.mjs";

const UNIT_ID = "calc-1-unit-3b-integration-applications";

function walk(nodes, callback) {
  for (const node of nodes) {
    callback(node);
    if (node.children) walk(node.children, callback);
  }
}

test("Unit 3B has the exact unique public route and core sequence", () => {
  assert.equal(routesArtifact.unit.routeCount, 25);
  assert.equal(routesArtifact.unit.coreRouteCount, 18);
  assert.equal(routesArtifact.routes.length, 25);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.path)).size, 25);
  assert.equal(new Set(routesArtifact.routes.map((route) => route.title)).size, 25);
  const core = routesArtifact.routes.filter((route) => route.isCore).sort((a, b) => a.coreSequenceIndex - b.coreSequenceIndex);
  assert.deepEqual(core.map((route) => route.coreSequenceIndex), Array.from({ length: 18 }, (_, index) => index + 1));
  assert.equal(core[0].path, "/subjects/math/calculus/integration-applications/");
  assert.ok(routesArtifact.routes.every((route) => route.indexable && route.releaseState === "public"));
  assert.ok(routesArtifact.routes.every((route) => !/\bChapter\b/i.test(`${route.title} ${route.description}`)));
});

test("Unit 3B owns one registry and search record per canonical path", () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID);
  assert.equal(unitRoutes.length, 25);
  for (const route of unitRoutes) {
    assert.equal(isCalculusUnitPath(route.path), true);
    assert.equal(getCalculusUnitRoute(route.path)?.id, route.id);
    assert.equal(calculusUnitSearchRecords.filter((record) => record.path === route.path).length, 1);
  }
  assert.equal(isCalculusUnitPath("/subjects/math/calculus/integration-applications/not-a-real-page/"), false);
});

test("all Unit 3B pages compile semantically with clean source boundaries", () => {
  assert.equal(pagesArtifact.pageCount, 25);
  assert.equal(pagesArtifact.pages.length, 25);
  const forbidden = /\\(?:begin\{(?:tikzpicture|axis|groupplot)|addplot|nextgroupplot|item\b|BGV[A-Za-z0-9]+)/;
  for (const page of pagesArtifact.pages) {
    assert.ok(page.nodes.length > 0, page.routeId);
    walk(page.nodes, (node) => {
      for (const value of [node.text, node.tex, node.title].filter(Boolean)) assert.doesNotMatch(value, forbidden, page.routeId);
    });
  }
  const keys = pagesArtifact.pages.filter((page) => page.nodes.some((node) => node.type === "answer-key-item"));
  assert.equal(keys.length, 2);
  assert.deepEqual(keys.map((key) => key.nodes.filter((node) => node.type === "answer-key-item").length), [13, 13]);
});

test("public Unit 3B payloads are route-local, visual-complete, and solution-safe", () => {
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
        assert.ok(node.visual.staticAsset.path.startsWith("/visuals/v1/unit-3b-"));
        visualIds.add(node.visualId);
      }
    });
    assert.equal("sourceFile" in page.page, false);
    assert.equal("sourceLatex" in page.page, false);
  }
  assert.equal(checkCount, 16);
  assert.equal(visualIds.size, 9);
});

test("public Unit 3B artifacts contain no canonical answers or source paths", async () => {
  const names = ["routes.public.json", "assessments.public.json", "assessment-sets.public.json"];
  const combined = (await Promise.all(names.map((name) => readFile(new URL(`../content/calculus/units/unit-3b/${name}`, import.meta.url), "utf8")))).join("\n");
  for (const field of ["canonical_answer", "worked_solution_latex", "source_latex", "source_file_server_only"]) assert.equal(combined.includes(`\"${field}\"`), false, field);
  assert.equal(combined.includes("bettergrades_integral_calculus_units_3a_3b_complete_handoff_v3"), false);
});

test("Unit 3B pumping setup grading proves equivalents, rejects contradictions, and preserves uncertainty", async () => {
  assert.equal(publicProblems.problem_count, 16);
  assert.equal(publicSets.assessments.length, 2);
  assert.equal(new Set(publicProblems.problems.map((problem) => problem.problem_id)).size, 16);
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", String.raw`9800\int_0^2 12(3-y)dy`)).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", String.raw`117600\int_0^2(3-y)dy`)).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", String.raw`117600\int_0^3(3-y)dy`)).status, "incorrect");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", String.raw`117600\int_0^2(2-y)dy`)).status, "incorrect");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", "weight density times volume times distance")).status, "uncertain");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-area-01", "4/3")).status, "correct");
  assert.equal((await evaluateCalculusAnswer(UNIT_ID, "u3b-pump-01", "")).status, "empty");
  assert.equal(revealCalculusAnswer(UNIT_ID, "u3b-pump-01", "").status, 400);
  assert.match(revealCalculusAnswer(UNIT_ID, "u3b-pump-01", "integral setup").solutionLatex, /\\int_0\^2/);
});

test("both Unit 3B exam answer keys are complete, separate, and easy to resolve", () => {
  assert.equal(serverSets.assessments.length, 2);
  assert.deepEqual(serverSets.assessments.map((set) => set.items.length), [13, 13]);
  for (const set of publicSets.assessments) {
    const examPath = `/${set.route}/`;
    const keyPath = `/${set.answer_key_route}/`;
    assert.equal(getCalculusUnitRoute(examPath)?.pageType, "exam");
    assert.equal(getCalculusUnitRoute(keyPath)?.pageType, "answer-key");
    assert.ok(getPublicCalculusUnitPage(examPath));
    assert.ok(getPublicCalculusUnitPage(keyPath));
  }
});

test("Unit 3B exercise pages have one attempt-gated worked answer per exercise", () => {
  const expected = new Map([
    ["/subjects/math/calculus/integration-applications/physics-application-studio/", 6],
    ["/subjects/math/calculus/integration-applications/review/", 10],
    ["/subjects/math/calculus/integration-applications/cumulative-practice/", 11],
  ]);
  assert.deepEqual(exerciseAnswers.routes.map((route) => route.answers.length), [6, 10, 11]);
  for (const [path, count] of expected) {
    const route = getCalculusUnitRoute(path);
    const compiled = pagesArtifact.pages.find((page) => page.routeId === route.id);
    let exercises = 0;
    let solutions = 0;
    walk(compiled.nodes, (node) => {
      if (node.type === "exercise") exercises += 1;
      if (node.type === "solution") solutions += 1;
    });
    assert.equal(exercises, count, path);
    assert.equal(solutions, count, path);
    const page = getPublicCalculusUnitPage(path);
    const revealIds = [];
    walk(page.page.nodes, (node) => { if (node.type === "solution-reveal") revealIds.push(node.revealId); });
    assert.equal(revealIds.length, count, path);
    for (const revealId of revealIds) assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, revealId)?.length > 0, `${path} ${revealId}`);
  }
});

test("all Unit 3B visuals retain lightweight, accessible static and print fallbacks", () => {
  assert.equal(compiledVisuals.sceneCount, 9);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration !== "none").length, 4);
  assert.equal(compiledVisuals.scenes.filter((entry) => entry.hydration === "none").length, 5);
  for (const entry of compiledVisuals.scenes) {
    assert.ok(entry.staticAsset.path.startsWith("/visuals/v1/unit-3b-"));
    assert.ok(entry.staticAsset.bytes < 50_000);
    assert.equal(entry.compiledScene.accessibility.staticFallbackEquivalent, true);
    assert.equal(entry.compiledScene.print.grayscaleSafe, true);
    assert.ok(entry.compiledScene.longDescription.length > 80);
  }
});
