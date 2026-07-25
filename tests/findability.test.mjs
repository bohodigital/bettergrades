import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { resolve } from "node:path";
import graph from "../data/learning-graph/graph.json" with { type: "json" };
import auditInventory from "../data/ia/page-inventory.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");

test("every canonical audit route is mapped or explicitly excluded", () => {
  const covered = new Set([...graph.nodes.map((node) => node.canonicalPath), ...graph.exclusions.map((item) => item.canonicalPath)]);
  assert.equal(auditInventory.routes.filter((route) => !covered.has(route.route)).length, 0);
  assert.equal(covered.size, auditInventory.routeCount);
});

test("graph ids and canonical paths are unique", () => {
  assert.equal(new Set(graph.nodes.map((node) => node.id)).size, graph.nodes.length);
  assert.equal(new Set(graph.nodes.map((node) => node.canonicalPath)).size, graph.nodes.length);
});

test("public relationships resolve and expose at most one primary destination", () => {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const primaryCounts = new Map();
  for (const relationship of graph.relationships.filter((item) => ["approved", "existing"].includes(item.editorialStatus))) {
    assert.ok(nodeIds.has(relationship.sourceId), `missing source ${relationship.sourceId}`);
    assert.ok(nodeIds.has(relationship.targetId), `missing target ${relationship.targetId}`);
    if (relationship.type === "full_version_of") {
      primaryCounts.set(relationship.sourceId, (primaryCounts.get(relationship.sourceId) ?? 0) + 1);
    }
  }
  assert.ok([...primaryCounts.values()].every((count) => count <= 1));
});

test("graph hierarchy references resolve to canonical graph nodes", () => {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  for (const node of graph.nodes) {
    for (const field of ["subjectId", "courseId", "unitId"]) {
      if (node[field]) assert.ok(nodeIds.has(node[field]), `${node.id} has unresolved ${field}: ${node[field]}`);
    }
  }
});

test("provisional candidates stay in the editorial queue", () => {
  const provisional = graph.relationships.filter((relationship) => relationship.editorialStatus === "provisional");
  assert.equal(provisional.length, 2756);
  assert.ok(provisional.every((relationship) => relationship.placement === "editorial-queue"));
});

test("critical routes have ordinary canonical parent anchors", async () => {
  const sources = await Promise.all([
    readFile(resolve(root, "app/LimitsUnitPages.tsx"), "utf8"),
    readFile(resolve(root, "app/CalculusUnitPages.tsx"), "utf8"),
    readFile(resolve(root, "app/LibraryPages.tsx"), "utf8"),
    readFile(resolve(root, "app/ResourcePages.tsx"), "utf8"),
    readFile(resolve(root, "app/BetterGradesApp.tsx"), "utf8"),
  ]);
  const combined = sources.join("\n");
  const routes = [
    "/glossary/",
    "/subjects/math/calculus/derivative-applications/curve-sketching-from-derivatives/",
    "/subjects/math/calculus/integration-applications/average-value-of-a-function/",
    "/subjects/math/calculus/integration-applications/washer-vs-shell/",
    "/subjects/math/calculus/integration-applications/work-and-fluid-force/",
    "/subjects/math/calculus/sequences-series/ratio-test-vs-root-test/",
    "/practice/math/calculus/exams/calculus-foundations/",
  ];
  for (const route of routes) assert.match(combined, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(combined.includes("<LimitsUnitMap showSupporting topicPage />"));
});

test("learning-path renderer enforces four destinations and purpose labels", async () => {
  const source = await readFile(resolve(root, "lib/learning-graph/queries.ts"), "utf8");
  assert.match(source, /Math\.min\(limit, 4\)/);
  assert.doesNotMatch(source, /Learn more|Read more|Related content/);
});

test("visible query results preserve the exact search ranking contract", async () => {
  const source = await readFile(resolve(root, "app/BetterGradesApp.tsx"), "utf8");
  assert.match(source, /id: "ranked"[\s\S]*records: visibleResults/);
  assert.match(source, /Ranked by exactness and relevance/);
});

test("findability click events carry source and target roles", async () => {
  const source = await readFile(resolve(root, "app/LearningPathLinks.tsx"), "utf8");
  assert.match(source, /source_page_role: relationship\.sourceRole/);
  assert.match(source, /target_page_role: target\.pageRole/);
  assert.match(source, /trackFindabilityEvent\(specific, eventData\)/);
});
