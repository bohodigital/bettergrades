import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));

test("Handoff C3 rendered preservation audit classifies every removed segment", async () => {
  const audit = await readJson("../artifacts/ia/handoff-c3-rendered-content-diff.json");

  assert.equal(audit.baselineCommit, "61463a9d26fcf5fe8c4bc32658675b4b056dd8d8");
  assert.equal(audit.routeCount, 509);
  assert.equal(audit.failureCount, 0);
  assert.equal(audit.unclassifiedRemovedWords, 0);
  assert.equal(audit.protectedRemovedWords, 0);
  assert.equal(audit.pass, true);
  assert.equal(audit.routes.length, 509);
  assert.ok(audit.routes.every((route) => route.pass));
});

test("Handoff C3 preservation evidence is derived from the rendered diff", async () => {
  const [audit, evidence] = await Promise.all([
    readJson("../artifacts/ia/handoff-c3-rendered-content-diff.json"),
    readJson("../artifacts/ia/handoff-c3-content-preservation.json"),
  ]);

  assert.equal(evidence.renderedDiffMethod, audit.comparison);
  assert.equal(evidence.renderedDiffRouteCount, audit.routeCount);
  assert.equal(evidence.renderedDiffFailureCount, audit.failureCount);
  assert.equal(evidence.substantiveEducationalLossWords, 0);
  assert.equal(evidence.failureCount, 0);
  assert.equal(evidence.pass, true);

  const routes = new Map(evidence.routeContentPreservation.map((route) => [route.route, route]));
  for (const rendered of audit.routes) {
    const route = routes.get(rendered.route);
    assert.ok(route, `missing preservation evidence for ${rendered.route}`);
    assert.equal(route.preservedInMainWords, rendered.preservedInMainWords);
    assert.equal(route.movedOutsideMainWords, rendered.movedOutsideMainWords);
    assert.equal(route.unclassifiedRemovedWords, rendered.unclassifiedRemovedWords);
    assert.equal(route.protectedRemovedWords, rendered.protectedRemovedWords);
  }
});
