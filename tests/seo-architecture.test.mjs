import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const rendered = async (path) => readFile(resolve(root, path === "/" ? "dist/pages/index.html" : `dist/pages${path}index.html`), "utf8");

test("Branch 1 ownership registry covers every instructional graph node", async () => {
  const graph = await readJson("data/learning-graph/graph.json");
  const registry = await readJson("data/seo/search-intent-ownership-registry.json");
  assert.equal(registry.records.length, graph.nodes.length);
  assert.equal(new Set(registry.records.map((row) => row.url)).size, graph.nodes.length);
  assert.ok(registry.records.every((row) => row.primaryTargetQuery && row.action && row.evidenceRequest));
  assert.ok(registry.records.every((row) => row.gscClicks === "UNAVAILABLE"));
});

test("all 64 Precalculus unit assessments have topic-qualified titles", async () => {
  const course = await readJson("content/precalculus/course.public.json");
  const assessments = course.assessments.filter((assessment) => assessment.type !== "final-assessment");
  assert.equal(assessments.length, 64);
  assert.ok(assessments.every((assessment) => !/^Unit \d+/.test(assessment.title)));
  assert.ok(assessments.every((assessment) => /Review|Practice Problems|Practice Test|Modeling Investigation$/.test(assessment.title)));
});

test("high-risk Algebra pairs preserve URLs and link in both directions", async () => {
  const compact = "/subjects/math/algebra/systems-inequalities/substitution-systems/";
  const textbook = "/subjects/math/algebra/systems/substitution/";
  assert.match(await rendered(compact), /When should you use substitution for a system\?/);
  assert.match(await rendered(compact), new RegExp(textbook.replaceAll("/", "\\/")));
  assert.match(await rendered(textbook), new RegExp(compact.replaceAll("/", "\\/")));

  const rationalCompact = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/";
  const rationalTextbook = "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/";
  assert.match(await rendered(rationalCompact), new RegExp(rationalTextbook.replaceAll("/", "\\/")));
  assert.match(await rendered(rationalTextbook), new RegExp(rationalCompact.replaceAll("/", "\\/")));
});

test("integration-by-parts surfaces expose separate intents", async () => {
  assert.match(await rendered("/learn/calculus/integration-by-parts/"), /When should you use integration by parts\?/);
  assert.match(await rendered("/subjects/math/calculus/integration-techniques/integration-by-parts-strategy/"), /Repeated, tabular, and cyclic integration by parts/);
  assert.match(await rendered("/subjects/math/calculus/integrals/integration-by-parts/"), /<h1[^>]*>Integration by parts<\/h1>/i);
});
