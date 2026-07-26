import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import exerciseAnswerArtifact from "../content/limits-continuity/exercise-answers.json" with { type: "json" };
import { getPublicLimitsUnitPage } from "../lib/calculus/limits-unit.mjs";
import { limitsUnitChapters } from "../lib/calculus/limits-unit-index.mjs";

const answerRouteCounts = new Map([
  ["calculus/limits/prerequisite-diagnostic", 20],
  ["calculus/limits/meaning-practice", 42],
  ["calculus/limits/finite-limits-practice", 58],
  ["calculus/limits/trig-limits-practice", 38],
  ["calculus/limits/infinite-behavior-practice", 40],
  ["calculus/continuity/continuity-practice", 48],
  ["calculus/limits/epsilon-delta-practice", 18],
  ["calculus/limits/cumulative-practice", 52],
  ["calculus/limits/practice-exam-a", 18],
  ["calculus/limits/practice-exam-b", 14],
]);

const companionVisuals = new Map([
  ["calculus/limits/what-a-limit-means", ["removable-hole"]],
  ["calculus/limits/meaning-practice", ["jump-discontinuity"]],
  ["calculus/limits/finite-limits-practice", ["removable-hole"]],
  ["calculus/limits/trig-limits-practice", ["sine-over-x"]],
  ["calculus/limits/infinite-behavior-practice", ["vertical-asymptotes", "horizontal-asymptote"]],
  ["calculus/continuity/continuity-at-a-point", ["limit-versus-value"]],
  ["calculus/continuity/bisection-method", ["ivt-root"]],
  ["calculus/continuity/continuity-practice", ["discontinuity-gallery", "ivt-root"]],
  ["calculus/limits/epsilon-delta-introduction", ["epsilon-delta-window"]],
  ["calculus/limits/epsilon-delta-practice", ["epsilon-delta-window"]],
  ["calculus/limits/cumulative-practice", ["discontinuity-gallery"]],
]);

function countExercises(nodes) {
  return nodes.reduce((total, node) => total
    + (node.type === "exercise" || node.type === "problem" ? 1 : 0)
    + countExercises(node.children ?? []), 0);
}

function routePath(sourceSlug) {
  return `/subjects/math/calculus/limits-continuity/unit/${sourceSlug.replace(/^calculus\//, "")}/`;
}

test("every exercise-only route receives a complete, source-traced answer reveal set", async () => {
  assert.equal(exerciseAnswerArtifact.schemaVersion, "1.0");
  assert.match(exerciseAnswerArtifact.sourceSha256, /^[a-f0-9]{64}$/);
  const source = (await readFile(new URL("../content/limits-continuity/latex/appendices/answers.tex", import.meta.url), "utf8"))
    .replace(/\r\n?/g, "\n");
  assert.equal(exerciseAnswerArtifact.sourceSha256, createHash("sha256").update(source).digest("hex"));
  assert.deepEqual(new Set(Object.keys(exerciseAnswerArtifact.routes)), new Set(answerRouteCounts.keys()));

  for (const [sourceSlug, expectedCount] of answerRouteCounts) {
    const artifact = exerciseAnswerArtifact.routes[sourceSlug];
    assert.equal(artifact.answers.length, expectedCount, sourceSlug);
    assert.deepEqual(artifact.answers.map(({ number }) => number), Array.from({ length: expectedCount }, (_, index) => index + 1), sourceSlug);
    assert.ok(artifact.answers.every(({ content }) => content.trim().length > 0), sourceSlug);

    const page = getPublicLimitsUnitPage(routePath(sourceSlug));
    assert.ok(page, sourceSlug);
    assert.equal(countExercises(page.page.nodes), expectedCount, `${sourceSlug} exercise inventory`);
    assert.equal(page.exerciseAnswers?.answers.length, expectedCount, `${sourceSlug} public answer inventory`);
    assert.equal(page.exerciseAnswers?.sourceSha256, artifact.sourceSha256, `${sourceSlug} source trace`);
  }
});

test("section guides provide concept-specific exposition instead of one generic paragraph", () => {
  assert.equal(limitsUnitChapters.length, 8);
  for (const section of limitsUnitChapters) {
    for (const field of ["lens", "mentalModel", "decision", "commonTrap", "checkpoint"]) {
      assert.ok(typeof section[field] === "string" && section[field].length >= 45, `${section.id}.${field}`);
      assert.doesNotMatch(section[field], /\bchapter\b/i, `${section.id}.${field}`);
    }
  }
});

test("additional visual study stops are route-scoped and reuse only verified public scenes", () => {
  for (const [sourceSlug, expectedIds] of companionVisuals) {
    const page = getPublicLimitsUnitPage(routePath(sourceSlug));
    assert.ok(page, sourceSlug);
    assert.deepEqual(page.companionVisuals?.map(({ visual }) => visual.id), expectedIds, sourceSlug);
    assert.ok(page.companionVisuals?.every(({ heading, explanation }) => heading.length >= 12 && explanation.length >= 80), sourceSlug);
  }
});

test("generated graph labels publish collision-free bounded placement metadata", async () => {
  const manifest = JSON.parse(await readFile(new URL("../content/visualizations/limits-continuity/compiled-scenes.v1.json", import.meta.url), "utf8"));
  let labelCount = 0;
  for (const scene of manifest.scenes) {
    const asset = await readFile(new URL(`../public${scene.staticAsset.path}`, import.meta.url), "utf8");
    const boxes = [...asset.matchAll(/data-bvlp-label-box="([\d.,-]+)"/g)].map((match) => match[1].split(",").map(Number));
    labelCount += boxes.length;
    for (const [x, y, width, height] of boxes) {
      assert.ok(x >= 0 && y >= 0 && width > 0 && height > 0, `${scene.id}: invalid label box`);
      assert.ok(x + width <= scene.staticAsset.width && y + height <= scene.staticAsset.height, `${scene.id}: label escapes SVG`);
    }
    for (let left = 0; left < boxes.length; left += 1) {
      for (let right = left + 1; right < boxes.length; right += 1) {
        const [ax, ay, aw, ah] = boxes[left];
        const [bx, by, bw, bh] = boxes[right];
        const overlapWidth = Math.min(ax + aw, bx + bw) - Math.max(ax, bx);
        const overlapHeight = Math.min(ay + ah, by + bh) - Math.max(ay, by);
        assert.ok(overlapWidth <= 1 || overlapHeight <= 1, `${scene.id}: labels ${left + 1} and ${right + 1} overlap`);
      }
    }
  }
  assert.ok(labelCount >= 30, `expected at least 30 positioned labels, found ${labelCount}`);
});

test("shared Limits components expose the compressed lesson frame and native answer details", async () => {
  const [component, map, css, interactive] = await Promise.all([
    readFile(new URL("../app/LimitsUnitPages.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LimitsUnitMap.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/visualization/renderers/bg-interactive-2d/BgInteractive2D.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(component, /className="lesson-objective"/);
  assert.match(component, /className="lesson-position"/);
  assert.match(component, /Lesson objective/);
  assert.doesNotMatch(component, /className="limits-reading-lens"/);
  assert.doesNotMatch(component, /className="limits-overview-guides"/);
  assert.match(component, /className="limits-exercise-answer"/);
  assert.match(component, /<summary>Show answer<\/summary>/);
  assert.match(map, /className="limits-reading-lens limits-map-lens"/);
  assert.match(css, /\.lesson-objective \{/);
  assert.match(css, /\.lesson-position \{/);
  assert.match(css, /\.limits-exercise-answer \{/);
  assert.match(interactive, /renderInteractiveAxes/);
  assert.match(interactive, /layoutRuntimeLabel/);
});
