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
  const required = ["conceptId", "queryFamily", "intent", "courseLevel", "primaryUrl", "primaryRole", "currentTitle", "currentH1", "proposedH1", "proposedSeoTitle", "proposedDescription", "canonicalPolicy", "indexPolicy", "action", "status", "verification"];
  assert.ok(registry.records.every((row) => required.every((field) => row[field] !== undefined && row[field] !== "")));
  assert.ok(registry.records.every((row) => row.gscImpressions === "UNAVAILABLE"));
  assert.ok(graph.provenance?.inputBaseCommit && graph.provenance?.inputBaseTree);
  assert.equal(graph.provenance.artifactState, "includes-current-worktree");
});

test("query-family ownership has exactly one primary per intent and course level", async () => {
  const registry = await readJson("data/seo/search-intent-ownership-registry.json");
  const groups = Map.groupBy(registry.records, (row) => `${row.queryFamily}\0${row.intent}\0${row.courseLevel}`);
  for (const [key, rows] of groups) {
    assert.equal(rows.filter((row) => row.isPrimaryOwner).length, 1, key);
    assert.ok(rows.every((row) => row.primaryUrl === rows.find((item) => item.isPrimaryOwner).url));
  }
});

test("all required cross-course ownership fixtures are machine readable", async () => {
  const policy = await readJson("data/seo/CROSS_COURSE_OWNERSHIP.json");
  const required = ["domain", "range", "function-notation", "piecewise", "exponential-functions", "growth-decay", "log-laws", "solve-exponential", "systems", "geometric-sequences", "infinite-geometric-series", "difference-quotients", "limits", "continuity", "local-linearity"];
  assert.equal(policy.rules.length, 15);
  assert.deepEqual(policy.rules.map((row) => row.conceptId.replace("cross.", "")), required);
  assert.ok(policy.rules.every((row) => row.genericOwner && row.secondaryUrls.length && row.distinction));
});

test("all collision candidates have an approved explicit disposition", async () => {
  const similarity = await readJson("artifacts/seo-architecture/current-content-similarity.json");
  assert.ok(similarity.candidates.length > 700);
  assert.ok(similarity.candidates.every((row) => similarity.allowedDispositions.includes(row.disposition) && row.adjudicationReason && row.explained));
  assert.equal(similarity.candidates.filter((row) => row.score >= 10 && !row.explained).length, 0);
  assert.equal(similarity.candidates.filter((row) => row.disposition === "MANUAL_REVIEW").length, 0);
});

test("course audits and handoffs are exhaustive", async () => {
  const csvRows = async (path) => (await readFile(resolve(root, path), "utf8")).trim().split(/\r?\n/);
  assert.equal((await csvRows("data/seo/ALGEBRA_COMPACT_GUIDE_AUDIT.csv")).length, 37);
  assert.equal((await csvRows("data/seo/PRECALCULUS_TITLE_AUDIT.csv")).length, 175);
  assert.equal((await csvRows("data/seo/CALCULUS_CLUSTER_AUDIT.csv")).length, 18);
  assert.ok((await csvRows("data/seo/BRANCH2_CONTENT_GAPS_HANDOFF.csv")).length >= 31);
  assert.ok((await csvRows("data/seo/BRANCH3_SUPPORTING_ASSETS_HANDOFF.csv")).length >= 31);
});

test("actual built routes, redirects, and sitemap reconcile with the graph", async () => {
  const qa = await readJson("artifacts/seo-architecture/BRANCH1_QA_REPORT.json");
  assert.equal(qa.routeCounts.instructionalRegistry, 974);
  assert.equal(qa.precalculusTitleAuditRows, 174);
  assert.equal(qa.precalculusAssessmentTitlesQualified, 64);
  assert.equal(qa.unexplainedHighRisk, 0);
  assert.equal(qa.duplicatePrimaryOwners, 0);
  assert.ok(Object.values(qa.checks).every(Boolean), JSON.stringify(qa.failures));
});

test("significant ownership clusters render satellite and canonical links", async () => {
  const links = await readJson("data/seo/sitewide-ownership-links.json");
  const fixtures = [
    ["/subjects/math/precalculus/calculus-readiness-and-function-synthesis/intuitive-limits/", "/subjects/math/calculus/limits-continuity/unit/limits/what-a-limit-means/"],
    ["/subjects/math/algebra/radicals-exponents-functions/exponential-growth-and-decay/", "/subjects/math/algebra/exponential-logarithmic/growth-and-decay-models/"],
    ["/subjects/math/calculus/worksheets/optimization/", "/subjects/math/calculus/derivative-applications/anatomy-of-optimization/"],
  ];
  for (const [satellite, owner] of fixtures) {
    assert.ok(links[satellite]?.some((row) => row.href === owner));
    assert.match(await rendered(satellite), new RegExp(owner.replaceAll("/", "\\/")));
  }
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
