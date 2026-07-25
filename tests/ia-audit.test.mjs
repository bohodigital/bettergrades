import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";

const required = [
  "data/ia/page-inventory.json",
  "data/ia/page-inventory.csv",
  "artifacts/ia/internal-link-graph.json",
  "artifacts/ia/click-depth-report.json",
  "artifacts/ia/search-findability-report.json",
  "artifacts/ia/chrome-density-report.json",
  "artifacts/ia/seo-metadata-report.json",
  "data/ia/article-lesson-candidates.json",
  "data/ia/prioritized-backlog.csv",
  "docs/ia/BETTERGRADES_IA_FINDABILITY_AUDIT_2026-07-24.md",
  "artifacts/ia/audit-manifest.json",
];

test("IA audit produces every core artifact", async () => {
  for (const path of required) assert.ok((await stat(path)).size > 0, `${path} should exist and be non-empty`);
});

test("page inventory covers each canonical route exactly once", async () => {
  const artifact = JSON.parse(await readFile("data/ia/page-inventory.json", "utf8"));
  assert.equal(artifact.routeCount, 509);
  assert.equal(artifact.routes.length, 509);
  assert.equal(new Set(artifact.routes.map((row) => row.route)).size, 509);
  assert.ok(artifact.routes.every((row) => row.page_role));
  assert.ok(artifact.routes.filter((row) => row.page_role === "other").every((row) => row.other_reason));
});

test("typed graph and relationship queues are bounded and source-bound", async () => {
  const graph = JSON.parse(await readFile("artifacts/ia/internal-link-graph.json", "utf8"));
  const candidates = JSON.parse(await readFile("data/ia/article-lesson-candidates.json", "utf8"));
  assert.equal(graph.routeCount, 509);
  assert.ok(graph.edges.length > 0);
  assert.ok(graph.edges.every((edge) => edge.link_type && edge.link_location));
  assert.equal(candidates.routeCount, 509);
  assert.ok(candidates.candidates.every((row) => row.source_article && row.recommended_relationship));
});

test("audit manifest declares no public or production change", async () => {
  const manifest = JSON.parse(await readFile("artifacts/ia/audit-manifest.json", "utf8"));
  assert.equal(manifest.publicBehaviorChanged, false);
  assert.equal(manifest.productionDeploymentChanged, false);
  assert.equal(manifest.failureCount, 0);
});
