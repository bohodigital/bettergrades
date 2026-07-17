import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getPublicLimitsUnitPage, limitsUnitRoutes } from "../lib/calculus/limits-unit.mjs";
import { limitsPublicVisualIds } from "../lib/visualization/limits-public.server.mjs";

function allNodes(nodes) {
  return nodes.flatMap((node) => [node, ...allNodes(node.children ?? [])]);
}

const interactiveIds = new Set(["secant-tangent", "squeeze-bounds", "unit-circle-squeeze", "epsilon-delta-window"]);

test("all 13 canonical Limits graphs and their route-scoped study placements use the public BVLP delivery path", async () => {
  const delivered = [];
  for (const route of limitsUnitRoutes) {
    const page = getPublicLimitsUnitPage(route.path);
    const pageNodes = allNodes(page.page.nodes);
    for (const node of pageNodes) {
      if (node.visual) delivered.push({ route, node, visual: node.visual });
    }
    const requestedIds = pageNodes.filter((node) => node.graphId).map((node) => node.graphId);
    const deliveredIds = pageNodes.filter((node) => node.visual).map((node) => node.visual.id);
    const companionIds = page.companionVisuals.map(({ visual }) => visual.id);
    assert.deepEqual(deliveredIds, requestedIds, `${route.path} must serialize exactly its requested visuals`);
    assert.equal(new Set(deliveredIds).size, deliveredIds.length, `${route.path} serialized a duplicate visual`);
    assert.equal(new Set(companionIds).size, companionIds.length, `${route.path} serialized a duplicate companion visual`);

    const projection = JSON.stringify(page);
    assert.doesNotMatch(projection, /expressionLatex|canonicalAnswer|workedFeedbackLatex|@cortex-js/i, route.path);
    const allowedIds = new Set([...requestedIds, ...companionIds]);
    for (const otherId of limitsPublicVisualIds) {
      if (!allowedIds.has(otherId)) assert.doesNotMatch(projection, new RegExp(`"id":"${otherId}"`), `${route.path} leaked ${otherId}`);
    }
  }
  assert.equal(delivered.length, 13);
  assert.deepEqual(new Set(limitsPublicVisualIds), new Set(delivered.map(({ visual }) => visual.id)));
  assert.equal(new Set(delivered.map(({ visual }) => visual.id)).size, 13);

  for (const { node, visual } of delivered) {
    assert.equal(node.graphId, visual.id);
    assert.match(visual.staticAsset.path, new RegExp(`^/visuals/v1/${visual.id}\\.[a-f0-9]{16}\\.svg$`));
    assert.ok(visual.longDescription.length >= 140, visual.id);
    assert.equal(visual.accessibility.staticFallbackEquivalent, true, visual.id);
    assert.equal(Boolean(visual.interactiveScene), interactiveIds.has(visual.id), visual.id);
    assert.equal(visual.hydration === "none", !interactiveIds.has(visual.id), visual.id);
    if (visual.interactiveScene) {
      assert.equal(visual.interactiveScene.provenance.sourceFile, undefined, visual.id);
      assert.doesNotMatch(JSON.stringify(visual.interactiveScene), /sourceFile|content\/visualizations/i, visual.id);
    }

    const asset = await readFile(new URL(`../public${visual.staticAsset.path}`, import.meta.url));
    assert.equal(asset.byteLength, visual.staticAsset.bytes, visual.id);
    assert.equal(createHash("sha256").update(asset).digest("hex"), visual.staticAsset.sha256, visual.id);
  }
});

test("the public component retains the SVG fallback and isolates optional interaction", async () => {
  const component = await readFile(new URL("../app/BetterGradesVisual.tsx", import.meta.url), "utf8");
  const pagesBuild = await readFile(new URL("../tools/prepare-pages-build.mjs", import.meta.url), "utf8");
  assert.match(component, /<img/);
  assert.match(component, /data-static-fallback="retained"/);
  assert.match(component, /Read this graph as text/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /class VisualEnhancementBoundary extends Component/);
  assert.match(component, /static getDerivedStateFromError/);
  assert.match(component, /componentDidCatch/);
  assert.match(component, /import\("\.\.\/lib\/visualization\/renderers\/bg-interactive-2d\/index\.tsx"\)/);
  assert.doesNotMatch(component, /jsxgraph|uplot|@cortex-js|dangerouslySetInnerHTML|innerHTML/i);
  assert.match(pagesBuild, /"\/visuals\/\*"/);
});
