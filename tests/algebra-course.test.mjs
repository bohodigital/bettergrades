import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

import course from "../content/algebra/course.public.json" with { type: "json" };
import collisions from "../content/algebra/route-collision-report.json" with { type: "json" };
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

test("all current 509 canonicals survive and the combined registry is exactly 732 unique routes", () => {
  assert.equal(baseline.routeCount, 509);
  assert.equal(routing.publicRoutes.length, 732);
  assert.equal(routing.registryRoutes.length, 732);
  assert.equal(new Set(routing.publicRoutes).size, 732);
  const routes = new Set(routing.publicRoutes);
  for (const page of baseline.routes) assert.ok(routes.has(page.route), `preserved route ${page.route}`);
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
      "visual-authoring-briefs.v3.json",
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
  const ids = new Set();
  for (const unit of course.units) {
    const manifest = JSON.parse(await readFile(resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`, "public-runtime-scenes.server.json"), "utf8"));
    scenes += manifest.sceneCount;
    interactive += manifest.interactiveCount;
    for (const scene of manifest.scenes) {
      assert.ok(!ids.has(scene.id), scene.id);
      ids.add(scene.id);
      assert.ok(scene.staticAsset.bytes < 50_000, scene.id);
      assert.ok(scene.staticAsset.path.startsWith("/visuals/v1/algebra-"), scene.id);
      assert.equal(Boolean(scene.interactiveScene), scene.hydration !== "none", scene.id);
    }
  }
  assert.equal(scenes, 417);
  assert.equal(interactive, 9);
  assert.equal(ids.size, 417);
});

test("browser-safe Algebra data does not expose answer boundaries or response rubrics", async () => {
  const source = await readFile(resolve(root, "content/algebra/course.public.json"), "utf8");
  assert.doesNotMatch(source, /canonicalAnswer|acceptedAnswers|answerBoundary|gradingPolicy|A strong response demonstrates/);
  const api = await readFile(resolve(root, "app/api/algebra-course-reveal/route.ts"), "utf8");
  assert.match(api, /getAlgebraAssessmentRubric/);
  assert.match(api, /Write a real attempt/);
});

test("exact Algebra titles and skills resolve through the shared search index", () => {
  assert.equal(search.searchSite("Algebra: Quantities, Equations, and Structure")[0]?.path, "/subjects/math/algebra/");
  assert.equal(search.searchSite("Number lines and signed quantities")[0]?.path, "/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  assert.ok(search.searchSite("factor and cancel common factors restrictions").some((record) => record.path === "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/"));
  assert.ok(search.searchSite("simplifying rational expressions by factors").some((record) => record.path === "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/"));
});
