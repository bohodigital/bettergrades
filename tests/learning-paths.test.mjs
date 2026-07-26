import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { resolve } from "node:path";
import graph from "../data/learning-graph/graph.json" with { type: "json" };
import approvedMap from "../data/ia/handoff-c2-approved-article-lesson-map.json" with { type: "json" };
import deferredMap from "../data/ia/handoff-c2-deferred-article-lesson-map.json" with { type: "json" };
import approvedLessonCompanions from "../data/ia/handoff-c2-approved-lesson-companion-map.json" with { type: "json" };
import deferredLessonCompanions from "../data/ia/handoff-c2-deferred-lesson-companion-map.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");

test("every audited instructional article has one explicit C2 decision", async () => {
  const decisions = await readFile(resolve(root, "data/ia/handoff-c2-article-decisions.csv"), "utf8");
  assert.equal(decisions.trim().split("\n").length - 1, 78);
  assert.equal(approvedMap.length + deferredMap.length, 78);
  assert.equal(new Set([...approvedMap, ...deferredMap].map((row) => row.sourceId)).size, 78);
});

test("only the three exact, unique article-to-lesson matches are approved", () => {
  assert.equal(approvedMap.length, 3);
  const approved = graph.relationships.filter((relationship) => relationship.source === "data/ia/handoff-c2-approved-article-lesson-map.json");
  assert.equal(approved.length, 3);
  assert.ok(approved.every((relationship) => relationship.editorialStatus === "approved"));
  assert.ok(approved.every((relationship) => relationship.type === "full_version_of"));
  assert.ok(approved.every((relationship) => relationship.placement === "article-intro"));
});

test("every textbook lesson is evaluated for all five companion roles", async () => {
  const decisions = await readFile(resolve(root, "data/ia/handoff-c2-lesson-companion-decisions.csv"), "utf8");
  assert.equal(decisions.trim().split("\n").length - 1, 328 * 5);
  assert.equal(approvedLessonCompanions.length, 17);
  assert.equal(approvedLessonCompanions.length + deferredLessonCompanions.length, 328 * 5);
  const categoryCounts = Object.groupBy([...approvedLessonCompanions, ...deferredLessonCompanions], (row) => row.category);
  for (const category of ["practice", "quick-explanation", "worked-example", "reference", "tool-or-visual"]) {
    assert.equal(categoryCounts[category].length, 328);
  }
});

test("provisional learning relationships cannot enter public destinations", async () => {
  const publicDestinations = JSON.parse(await readFile(resolve(root, "data/learning-graph/public-article-destinations.json"), "utf8"));
  const publicPairs = new Set(Object.values(publicDestinations).flat().map(({ relationship }) => `${relationship.sourceId}\0${relationship.targetId}\0${relationship.type}`));
  for (const relationship of graph.relationships.filter((item) => item.editorialStatus === "provisional")) {
    assert.ok(!publicPairs.has(`${relationship.sourceId}\0${relationship.targetId}\0${relationship.type}`));
  }
});

test("relationship renderer separates one primary action from three secondary actions", async () => {
  const [source, lessonSource] = await Promise.all([
    readFile(resolve(root, "app/LearningPathLinks.tsx"), "utf8"),
    readFile(resolve(root, "app/LessonCompanionLinks.tsx"), "utf8"),
  ]);
  assert.match(source, /\.slice\(0, 1\)/);
  assert.match(source, /\.slice\(0, 3\)/);
  assert.match(source, /relationship\.type !== "full_version_of"/);
  assert.doesNotMatch(source, /Learn more|Read more/);
  assert.match(lessonSource, /\.slice\(0, 1\)/);
  assert.match(lessonSource, /\.slice\(0, 3\)/);
});
