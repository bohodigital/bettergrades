import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import unitPayload from "../content/limits-continuity/unit.json" with { type: "json" };
import {
  LIMITS_UNIT_PREFIX,
  compareLimitAnswer,
  parseLimitsUnitPage,
  validateLimitsUnitPayload,
} from "../lib/calculus/limits-unit-core.mjs";
import { getLimitsUnitPage } from "../lib/calculus/limits-unit.mjs";
import { isLimitsUnitPath, limitsUnitRoutes, limitsUnitSearchRecords } from "../lib/calculus/limits-unit-index.mjs";

function flatten(nodes, result = []) {
  for (const node of nodes) {
    result.push(node);
    if (node.children) flatten(node.children, result);
  }
  return result;
}

test("the v3 payload has one complete, collision-free course graph", () => {
  assert.equal(unitPayload.source.archiveSha256, "24e5cf5ca36d9756dc5fb9b799be1dc1c480891ef6046039440cd9b5e8b926f1");
  assert.equal(unitPayload.routes.length, 71);
  assert.equal(unitPayload.routes.filter((route) => route.isCoreSequence).length, 47);
  assert.equal(unitPayload.routes.filter((route) => !route.isCoreSequence).length, 24);
  assert.equal(unitPayload.checks.length, 38);
  assert.deepEqual(validateLimitsUnitPayload(unitPayload), []);

  const paths = unitPayload.routes.map((route) => route.path);
  assert.equal(new Set(paths).size, paths.length);
  assert.equal(paths[0], LIMITS_UNIT_PREFIX);
  assert.ok(unitPayload.routes.every((route) => route.title && route.h1 && route.description && route.breadcrumbs.length >= 4));
  assert.ok(unitPayload.routes.every((route) => route.path.startsWith(LIMITS_UNIT_PREFIX)));
});

test("all imported pages compile to typed semantic nodes without raw HTML", () => {
  const nodeTypes = new Set();
  const visit = (nodes) => nodes.forEach((node) => {
    nodeTypes.add(node.type);
    if (node.children) visit(node.children);
  });
  for (const page of unitPayload.pages) {
    const nodes = parseLimitsUnitPage(page.source);
    assert.ok(nodes.length > 0, page.sourceFile);
    visit(nodes);
    assert.ok(!JSON.stringify(nodes).includes("dangerouslySetInnerHTML"), page.sourceFile);
    assert.ok(!JSON.stringify(nodes).includes("\\\\lessonobjective"), page.sourceFile);
  }

  for (const required of [
    "definition", "concept", "method", "worked-example", "guided-walkthrough",
    "exercise", "problem", "hint", "solution", "quick-check", "common-mistake",
    "exam-note", "summary", "graph-specification",
  ]) assert.ok(nodeTypes.has(required), `missing semantic node type ${required}`);
});
test("unsupported LaTeX environments fail instead of being silently dropped", () => {
  assert.throws(() => parseLimitsUnitPage(String.raw`\\begin{unknownsemantic}content\\end{unknownsemantic}`), /Unsupported LaTeX environment: unknownsemantic/);
});


test("every supplied check id is unique, routed, and attempt-gated", () => {
  const ids = unitPayload.checks.map((check) => check.id);
  assert.equal(new Set(ids).size, 38);
  const routeSlugs = new Set(unitPayload.routes.map((route) => route.sourceSlug));
  for (const check of unitPayload.checks) {
    assert.ok(routeSlugs.has(check.routeSlug), check.id);
    assert.equal(unitPayload.routes.filter((route) => route.checkIds.includes(check.id)).length, 1, check.id);
    assert.equal(check.attemptRequiredBeforeReveal, true, check.id);
    assert.ok(check.hintLatex && check.workedFeedbackLatex, check.id);
  }
});

test("typed answer validation accepts equivalents and rejects wrong answers", async () => {
  const byId = Object.fromEntries(unitPayload.checks.map((check) => [check.id, check]));
  assert.equal((await compareLimitAnswer(byId["limit-continuous-01"], "10")).status, "correct");
  assert.equal((await compareLimitAnswer(byId["limit-continuous-01"], "9")).status, "incorrect");
  assert.equal((await compareLimitAnswer(byId["conjugate-flow-01"], "0.25")).status, "correct");
  assert.equal((await compareLimitAnswer(byId["conjugate-flow-01"], "1/5")).status, "incorrect");
  assert.equal((await compareLimitAnswer(byId["left-right-01"], "does not exist")).status, "correct");
  assert.equal((await compareLimitAnswer(byId["left-right-01"], "5")).status, "incorrect");
  assert.equal((await compareLimitAnswer(byId["epsilon-flow-01"], String.raw`\frac{\varepsilon}{2}`)).status, "correct");
  assert.equal((await compareLimitAnswer(byId["epsilon-flow-01"], "epsilon/3")).status, "correct");

  for (const check of unitPayload.checks) {
    assert.equal((await compareLimitAnswer(check, check.canonicalAnswer)).status, "correct", check.id);
    assert.notEqual((await compareLimitAnswer(check, "__definitely_wrong__")).status, "correct", check.id);
    assert.equal(check.attemptRequiredBeforeReveal, true, check.id);
    assert.ok(check.hintLatex.length > 0 && check.workedFeedbackLatex.length > 0, check.id);
  }
});

test("provenance stays explicit and rights-separated", () => {
  assert.equal(unitPayload.source.provenance.status, "bettergrades-original");
  assert.equal(unitPayload.source.provenance.activeCalculusAdaptedMaterial, false);
  assert.match(unitPayload.source.provenance.note, /No Active Calculus exercise is reproduced verbatim/i);
  assert.ok(unitPayload.source.excludedArchiveMembers.every((path) => /\.(?:pdf|zip|py)$/i.test(path)));
});

test("route and search adapters expose every page exactly once", () => {
  assert.equal(limitsUnitRoutes.length, 71);
  assert.equal(limitsUnitSearchRecords.length, 71);
  assert.equal(new Set(limitsUnitSearchRecords.map((record) => record.path)).size, 71);
  assert.ok(limitsUnitSearchRecords.some((record) => record.kind === "practice" && record.label === "Practice exam"));
  const lesson = getLimitsUnitPage(`${LIMITS_UNIT_PREFIX}limits/what-a-limit-means/`);
  assert.equal(lesson?.route.h1, "What a Limit Means");
  assert.ok(lesson?.checks.some((check) => check.id === "limit-continuous-01"));
  assert.ok(lesson?.page.nodes.some((node) => node.type === "definition"));
  assert.equal(isLimitsUnitPath(`${LIMITS_UNIT_PREFIX}not-a-real-page/`), false);
});

test("every route resolves its checks in source order without placeholder loss", () => {
  for (const route of unitPayload.routes) {
    const page = unitPayload.pages.find((candidate) => candidate.sourceFile === route.sourceFile);
    const nodes = flatten(page.nodes);
    const sourceCheckIds = nodes.filter((node) => node.type === "quick-check" && node.checkId).map((node) => node.checkId);
    assert.deepEqual(sourceCheckIds, route.checkIds, route.sourceSlug);
    for (const node of nodes.filter((candidate) => candidate.type === "quick-check")) {
      if (node.checkId) assert.ok(route.checkIds.includes(node.checkId), `${route.sourceSlug}: ${node.checkId}`);
      else assert.ok(node.children?.length, `${route.sourceSlug}: empty quick check`);
    }
  }
});

test("structured math, tables, and graph specifications remain typed and renderable", () => {
  const nodes = flatten(unitPayload.pages.flatMap((page) => parseLimitsUnitPage(page.source)));
  assert.ok(nodes.some((node) => node.type === "math" && /\\begin\{aligned\}/.test(node.tex ?? "")));
  assert.ok(nodes.some((node) => node.type === "math" && /\\left\\{\\matrix\{/.test(node.tex ?? "")));
  assert.ok(nodes.some((node) => node.type === "table" && node.rows?.length));
  assert.ok(nodes.some((node) => node.type === "graph-specification" && node.text?.trim()));
  assert.ok(!nodes.some((node) => node.type === "math" && /\\begin\{(?:align\*?|tabular|longtable|tabularx|groupplot)\}/.test(node.tex ?? "")));
});

test("the global limits index has no answer or body payload", async () => {
  const index = JSON.parse(await readFile(new URL("../content/limits-continuity/unit-index.json", import.meta.url), "utf8"));
  assert.equal(index.routes.length, 71);
  assert.ok(!JSON.stringify(index).match(/canonicalAnswer|workedFeedbackLatex|\"pages\"|\"checks\"/));
});

test("the standalone LaTeX source is present without generated or binary output", async () => {
  const root = new URL("../content/limits-continuity/latex/", import.meta.url);
  const files = await readdir(root, { recursive: true });
  assert.ok(files.includes("main.tex"));
  assert.ok(files.includes("bettergrades-webtext.sty"));
  assert.ok(files.includes(path.join("chapters", "ch07_review.tex")));
  assert.ok(files.includes(path.join("appendices", "references.tex")));
  assert.ok(files.includes(path.join("checks", "limit-continuous-01.tex")));
  assert.ok(files.every((file) => !/\.(?:pdf|zip|pyc)$/i.test(file)), files.join(", "));
  const main = await readFile(new URL("../content/limits-continuity/latex/main.tex", import.meta.url), "utf8");
  assert.match(main, /\\usepackage\{bettergrades-webtext\}/);
  assert.match(main, /\\input\{appendices\/references\}/);
});
