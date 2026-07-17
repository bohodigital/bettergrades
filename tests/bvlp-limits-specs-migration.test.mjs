import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const ROOT = "content/visualizations/limits-continuity";
const collection = JSON.parse(readFileSync(`${ROOT}/visual-specs.v1.json`, "utf8"));
const manifest = JSON.parse(readFileSync(`${ROOT}/migration-manifest.v1.json`, "utf8"));
const explanatory = JSON.parse(readFileSync(`${ROOT}/explanatory-nodes.v1.json`, "utf8"));
const generatedUnit = JSON.parse(readFileSync("content/limits-continuity/unit.json", "utf8"));

function collectGraphNodes(value, result = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectGraphNodes(item, result);
    return result;
  }
  if (!value || typeof value !== "object") return result;
  if (value.type === "graph-specification") result.push(value);
  for (const nested of Object.values(value)) collectGraphNodes(nested, result);
  return result;
}

test("the authored inventory exactly matches the generated 13 rendered and 3 explanatory nodes", () => {
  const graphNodes = collectGraphNodes(generatedUnit.pages);
  const rendered = graphNodes.filter((node) => typeof node.graphId === "string");
  const nonRendering = graphNodes.filter((node) => node.graphId == null);

  assert.equal(rendered.length, 13);
  assert.equal(new Set(rendered.map((node) => node.graphId)).size, 13);
  assert.deepEqual(new Set(rendered.map((node) => node.graphId)), new Set(collection.visuals.map((visual) => visual.id)));
  assert.equal(nonRendering.length, 3);
  assert.equal(explanatory.nodes.length, 3);
});

test("the manifest maps every stable ID to its source, legacy renderers, print figure, and parity assertions", () => {
  assert.equal(manifest.sourceInventory.renderedGraphCount, 13);
  assert.equal(manifest.sourceInventory.nonRenderingExplanatoryNodeCount, 3);
  assert.equal(manifest.mappings.length, 13);

  const specById = new Map(collection.visuals.map((visual) => [visual.id, visual]));
  const manifestIds = manifest.mappings.map((mapping) => mapping.stableId);
  assert.equal(new Set(manifestIds).size, 13);
  assert.deepEqual(new Set(manifestIds), new Set(specById.keys()));

  manifest.mappings.forEach((mapping, index) => {
    const visual = specById.get(mapping.stableId);
    assert.equal(mapping.visualSpecPointer, `visual-specs.v1.json#/visuals/${index}`, mapping.stableId);
    assert.equal(mapping.publicPath, visual.provenance.route, mapping.stableId);
    assert.ok(mapping.sourceSlug.startsWith("calculus/"), mapping.stableId);
    assert.ok(mapping.generatedSourceFile.endsWith(".tex"), mapping.stableId);
    assert.ok(mapping.printFigure.startsWith("fig:"), mapping.stableId);
    assert.equal(mapping.legacyRenderers.length, 2, mapping.stableId);
    assert.ok(mapping.legacyRenderers.some(({ source }) => source === "app/LimitsGraphCanvas.tsx"), mapping.stableId);
    assert.ok(mapping.legacyRenderers.some(({ printFigure }) => printFigure === mapping.printFigure), mapping.stableId);
    assert.ok(mapping.parityAssertions.length >= 3, mapping.stableId);
    for (const parity of mapping.parityAssertions) {
      assert.ok(parity.id.length > 0, mapping.stableId);
      assert.ok(parity.expect.length >= 50, `${mapping.stableId}/${parity.id}`);
    }
    assert.ok(Array.isArray(mapping.knownLegacyVariances), mapping.stableId);
  });
});

test("the three explanatory nodes remain non-public guidance linked to canonical visuals", () => {
  const visualIds = new Set(collection.visuals.map((visual) => visual.id));
  assert.equal(new Set(explanatory.nodes.map((node) => node.nodeId)).size, 3);
  for (const node of explanatory.nodes) {
    assert.equal(node.sourceNodeType, "graph-specification", node.nodeId);
    assert.equal(node.sourceGraphId, null, node.nodeId);
    assert.equal(node.renderAsPublicVisual, false, node.nodeId);
    assert.equal(node.publishBehavior, "authoring-guidance-only", node.nodeId);
    assert.ok(visualIds.has(node.linkedStableVisualId), node.nodeId);
    assert.ok(node.normalizedInstruction.length >= 150, node.nodeId);
    assert.equal(typeof node.structuredRequirements, "object", node.nodeId);
    assert.equal(node.provenance.generatedNodeSource, "content/limits-continuity/unit.json", node.nodeId);
    assert.ok(node.provenance.latexSource.startsWith("content/limits-continuity/latex/chapters/"), node.nodeId);
    assert.equal(node.provenance.latexLines.length, 2, node.nodeId);
  }
});

test("migration artifacts carry no raw legacy drawing program or executable vendor callback", () => {
  const sources = [
    readFileSync(`${ROOT}/visual-specs.v1.json`, "utf8"),
    readFileSync(`${ROOT}/migration-manifest.v1.json`, "utf8"),
    readFileSync(`${ROOT}/explanatory-nodes.v1.json`, "utf8"),
  ];
  for (const source of sources) {
    assert.doesNotMatch(source, /\\\\begin\s*\{(?:tikzpicture|axis|groupplot)\}|\\\\(?:addplot|draw|node)\b|axis cs:/i);
    assert.doesNotMatch(source, /\b(?:JXG\.|new\s+uPlot|eval\s*\(|new\s+Function\s*\(|document\.createElement\s*\(\s*["']canvas)/i);
    assert.doesNotMatch(source, /"(?:jsExpression|callback|rendererConfig|vendorOptions)"\s*:/i);
  }
});

