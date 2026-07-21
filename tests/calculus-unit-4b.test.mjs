import assert from "node:assert/strict";
import test from "node:test";

import routesArtifact from "../content/calculus/units/unit-4b/routes.public.json" with { type: "json" };
import pagesArtifact from "../content/calculus/units/unit-4b/pages.compiled.server.json" with { type: "json" };
import publicProblems from "../content/calculus/units/unit-4b/assessments.public.json" with { type: "json" };
import publicSets from "../content/calculus/units/unit-4b/assessment-sets.public.json" with { type: "json" };
import compiledVisuals from "../content/calculus/units/unit-4b/compiled-scenes.v1.json" with { type: "json" };
import { calculusUnitRoutes, calculusUnitSearchRecords, getCalculusUnitRoute, isCalculusUnitPath, supersededCalculusPaths } from "../lib/calculus/calculus-units-index.mjs";
import { getCalculusUnitReveal, getPublicCalculusUnitPage } from "../lib/calculus/calculus-unit.mjs";

const UNIT_ID = "calc-2-unit-4b-power-taylor-series";
const ROOT = "/subjects/math/calculus/power-series-and-taylor-series/";
const FORBIDDEN_PUBLIC_KEYS = ["canonical_answer", "worked_solution_latex", "model_solution_latex", "source_file_server_only", "source_latex"];

function walk(nodes, visit) { for (const node of nodes ?? []) { visit(node); walk(node.children, visit); } }

test("Unit 4B publishes the exact route, lesson, assessment, and visual inventory", () => {
  assert.equal(routesArtifact.unit.id, UNIT_ID);
  assert.equal(routesArtifact.unit.root, ROOT);
  assert.equal(routesArtifact.routes.length, 31);
  assert.equal(routesArtifact.routes.filter((route) => route.isCore).length, 21);
  assert.equal(pagesArtifact.pageCount, 31);
  assert.equal(publicProblems.problem_count, 20);
  assert.equal(publicSets.assessments.length, 3);
  assert.equal(compiledVisuals.sceneCount, 20);
  assert.equal(compiledVisuals.scenes.filter((visual) => visual.selectedRenderer === "bg-interactive-2d").length, 6);
});

test("Unit 4B routes are canonical, searchable, and backed by renderable public pages", () => {
  const routes = calculusUnitRoutes.filter((route) => route.unitId === UNIT_ID);
  assert.equal(routes.length, 31);
  assert.equal(routes[0].path, ROOT);
  assert.equal(new Set(routes.map((route) => route.path)).size, routes.length);
  for (const route of routes) {
    assert.ok(route.path.startsWith(ROOT), route.path);
    assert.equal(isCalculusUnitPath(route.path), true, route.path);
    assert.equal(getCalculusUnitRoute(route.path)?.id, route.id, route.path);
    assert.equal(calculusUnitSearchRecords.filter((record) => record.path === route.path).length, 1, route.path);
    assert.ok(getPublicCalculusUnitPage(route.path), route.path);
  }
  assert.equal(isCalculusUnitPath(`${ROOT}not-a-real-page/`), false);
});

test("Unit 4B visual references resolve and interactive checks remain attempt-gated", () => {
  let visualReferences = 0;
  let interactiveReferences = 0;
  for (const route of calculusUnitRoutes.filter((candidate) => candidate.unitId === UNIT_ID)) {
    const page = getPublicCalculusUnitPage(route.path);
    assert.ok(page, route.path);
    walk(page.page.nodes, (node) => {
      if (node.type === "visual-reference") {
        visualReferences += 1;
        assert.ok(node.visual, `${route.path}: ${node.visualId}`);
        assert.ok(node.visual.staticAsset.path.startsWith("/visuals/v1/unit-4b-"));
        if (node.visual.selectedRenderer === "bg-interactive-2d") interactiveReferences += 1;
      }
      if (node.type === "solution-reveal") assert.ok(getCalculusUnitReveal(UNIT_ID, route.id, node.revealId)?.length, `${route.path}: ${node.revealId}`);
    });
    for (const check of page.checks) assert.equal(check.attemptRequiredBeforeReveal, true, check.id);
  }
  assert.equal(visualReferences, 20);
  assert.equal(interactiveReferences, 6);
});

test("Unit 4B public artifacts do not leak answers or source-only fields", () => {
  const publicText = JSON.stringify([routesArtifact, publicProblems, publicSets]);
  for (const field of FORBIDDEN_PUBLIC_KEYS) assert.equal(publicText.includes(`\"${field}\"`), false, field);
  assert.equal(publicText.includes("source/unit4b.tex"), false);
});

test("Unit 4B exams and answer keys are paired", () => {
  for (const exam of ["a", "b"]) {
    const examPath = `${ROOT}practice-exam-${exam}/`;
    const keyPath = `${ROOT}practice-exam-${exam}-answer-key/`;
    assert.equal(getCalculusUnitRoute(examPath)?.pageType, "exam");
    assert.equal(getCalculusUnitRoute(keyPath)?.pageType, "answer-key");
    assert.ok(getPublicCalculusUnitPage(examPath)?.related.some((route) => route.path === keyPath));
  }
});

test("Unit 4B owns the two retired legacy Chapter 4 intents", () => {
  assert.ok(supersededCalculusPaths.includes("/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/"));
  assert.ok(supersededCalculusPaths.includes("/subjects/math/calculus/sequences-series/taylor-series-remainder/"));
  assert.equal(getCalculusUnitRoute(`${ROOT}radius-and-interval-of-convergence/`)?.unitId, UNIT_ID);
  assert.equal(getCalculusUnitRoute(`${ROOT}taylor-remainder-theorem/`)?.unitId, UNIT_ID);
});
