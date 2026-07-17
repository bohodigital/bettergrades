import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getPublicLimitsUnitPage, limitsUnitRoutes } from "../lib/calculus/limits-unit.mjs";
import { representativeLimitsVisualId } from "../lib/visualization/limits-public.server.mjs";

function allNodes(nodes) {
  return nodes.flatMap((node) => [node, ...allNodes(node.children ?? [])]);
}

test("the representative gate exposes only removable-hole through the new static delivery path", async () => {
  const delivered = [];
  for (const route of limitsUnitRoutes) {
    const page = getPublicLimitsUnitPage(route.path);
    for (const node of allNodes(page.page.nodes)) {
      if (node.visual) delivered.push({ route, node, visual: node.visual });
    }
  }
  assert.equal(representativeLimitsVisualId, "removable-hole");
  assert.equal(delivered.length, 1);
  const [{ route, node, visual }] = delivered;
  assert.equal(route.path, "/subjects/math/calculus/limits-continuity/unit/limits/limit-at-a-hole/");
  assert.equal(node.graphId, "removable-hole");
  assert.equal(visual.id, "removable-hole");
  assert.equal(visual.hydration, "none");
  assert.equal(visual.interactiveScene, undefined);
  assert.match(visual.staticAsset.path, /^\/visuals\/v1\/removable-hole\.[a-f0-9]{16}\.svg$/);
  assert.ok(visual.longDescription.length >= 140);
  assert.equal(visual.accessibility.staticFallbackEquivalent, true);

  const asset = await readFile(new URL(`../public${visual.staticAsset.path}`, import.meta.url));
  assert.equal(asset.byteLength, visual.staticAsset.bytes);
  assert.equal(createHash("sha256").update(asset).digest("hex"), visual.staticAsset.sha256);

  const projection = JSON.stringify(getPublicLimitsUnitPage(route.path));
  assert.doesNotMatch(projection, /expressionLatex|canonicalAnswer|workedFeedbackLatex|@cortex-js/i);
});

test("the public component retains the SVG fallback and isolates optional interaction", async () => {
  const component = await readFile(new URL("../app/BetterGradesVisual.tsx", import.meta.url), "utf8");
  const pagesBuild = await readFile(new URL("../tools/prepare-pages-build.mjs", import.meta.url), "utf8");
  assert.match(component, /<img/);
  assert.match(component, /data-static-fallback="retained"/);
  assert.match(component, /Read this graph as text/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /import\("\.\.\/lib\/visualization\/renderers\/bg-interactive-2d\/index\.tsx"\)/);
  assert.doesNotMatch(component, /jsxgraph|uplot|@cortex-js|dangerouslySetInnerHTML|innerHTML/i);
  assert.match(pagesBuild, /"\/visuals\/\*"/);
});
