import assert from "node:assert/strict";
import test from "node:test";

import unitPayload from "../content/limits-continuity/unit.json" with { type: "json" };
import {
  LIMITS_UNIT_PREFIX,
  compareLimitAnswer,
  parseLimitsUnitPage,
  validateLimitsUnitPayload,
} from "../lib/calculus/limits-unit-core.mjs";

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
  }

  for (const required of [
    "definition", "concept", "method", "worked-example", "guided-walkthrough",
    "exercise", "problem", "hint", "solution", "quick-check", "common-mistake",
    "exam-note", "summary", "graph-specification",
  ]) assert.ok(nodeTypes.has(required), `missing semantic node type ${required}`);
});

test("every supplied check id is unique, routed, and attempt-gated", () => {
  const ids = unitPayload.checks.map((check) => check.id);
  assert.equal(new Set(ids).size, 38);
  const routeSlugs = new Set(unitPayload.routes.map((route) => route.sourceSlug));
  for (const check of unitPayload.checks) {
    assert.ok(routeSlugs.has(check.routeSlug), check.id);
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
  assert.equal((await compareLimitAnswer(byId["epsilon-flow-01"], "epsilon/3")).status, "incorrect");
});

test("provenance stays explicit and rights-separated", () => {
  assert.equal(unitPayload.source.provenance.status, "bettergrades-original");
  assert.equal(unitPayload.source.provenance.activeCalculusAdaptedMaterial, false);
  assert.match(unitPayload.source.provenance.note, /No Active Calculus exercise is reproduced verbatim/i);
  assert.ok(unitPayload.source.excludedArchiveMembers.every((path) => /\.(?:pdf|zip|py)$/i.test(path)));
});
