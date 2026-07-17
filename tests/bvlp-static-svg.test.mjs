import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import { compileVisualSpec } from "../lib/visualization/compiler/index.ts";
import {
  STATIC_SVG_TARGET_BYTES,
  StaticSvgRenderError,
  assertStaticSvgSafety,
  measureStaticSvg,
  renderStaticSvg,
} from "../lib/visualization/renderers/static-svg/index.ts";
import { cloneFixture, makeVisualSpec, richText } from "../lib/visualization/testkit/index.ts";

test("renderStaticSvg is byte deterministic, responsive, accessible, print-safe, and content-addressed", () => {
  const scene = compileVisualSpec(makeVisualSpec());
  const first = renderStaticSvg(scene);
  const second = renderStaticSvg(structuredClone(scene));

  assert.deepEqual(first, second);
  assert.equal(first.sha256, createHash("sha256").update(first.svg, "utf8").digest("hex"));
  assert.equal(first.byteLength, Buffer.byteLength(first.svg, "utf8"));
  assert.equal(first.assetFileName, `fixture-function-plot.${first.sha256.slice(0, 16)}.svg`);
  assert.equal(first.assetPath, `/visuals/v1/${first.assetFileName}`);
  assert.equal(first.meetsTarget, first.byteLength <= STATIC_SVG_TARGET_BYTES);
  assert.match(first.svg, /^<svg /);
  assert.match(first.svg, /role="img"/);
  assert.match(first.svg, /aria-labelledby="bvlp-fixture-function-plot-title bvlp-fixture-function-plot-description"/);
  assert.match(first.svg, /viewBox="0 0 960 [0-9]+"/);
  assert.match(first.svg, /width="100%"/);
  assert.match(first.svg, /height:auto/);
  assert.match(first.svg, /data-grayscale-safe="true"/);
  assert.match(first.svg, /@media print/);
  assert.match(first.svg, /data-layer-id="quadratic"/);
  assert.match(first.svg, /<path /);
  assert.doesNotThrow(() => assertStaticSvgSafety(first.svg, scene.id));
  assert.doesNotMatch(first.svg, /<script|<image|<foreignObject|\son[a-z]+=/i);
});

test("authored text is escaped and math segments emit spoken text rather than raw LaTeX", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.title = {
    segments: [
      { kind: "text", text: `<script onload="steal()">A&B</script> ` },
      { kind: "math", latex: String.raw`\frac{1}{x}`, spokenText: "one over x" },
    ],
  };
  const result = renderStaticSvg(compileVisualSpec(spec));
  assert.match(result.svg, /&lt;script onload=&quot;steal\(\)&quot;&gt;A&amp;B&lt;\/script&gt; one over x/);
  assert.doesNotMatch(result.svg, /<script|\\frac|steal\(\)"/);
  assert.doesNotThrow(() => assertStaticSvgSafety(result.svg, spec.id));
});

test("stable panel title/description IDs and explicit multi-panel layout survive static rendering", () => {
  const spec = cloneFixture(makeVisualSpec());
  const secondLayer = cloneFixture(spec.layers[0]);
  secondLayer.id = "comparison-function";
  secondLayer.geometry.expression.ast.right.value = 3;
  spec.panels = [
    { id: "left-panel", title: richText("Quadratic panel"), description: "A quadratic function in the left panel.", row: 0, column: 0, rowSpan: 1, columnSpan: 1, order: 0 },
    { id: "right-panel", title: richText("Cubic panel"), description: "A cubic function in the right panel.", row: 0, column: 1, rowSpan: 1, columnSpan: 1, order: 1 },
  ];
  spec.layers[0].panelId = "left-panel";
  secondLayer.panelId = "right-panel";
  spec.layers.push(secondLayer);
  spec.requiredCapabilities.push("multi-panel");
  spec.accessibility.readingOrder = ["left-panel", "quadratic", "right-panel", "comparison-function"];

  const { svg, height } = renderStaticSvg(compileVisualSpec(spec));
  assert.equal(height, 338);
  for (const panel of ["left-panel", "right-panel"]) {
    assert.match(svg, new RegExp(`id="bvlp-fixture-function-plot-panel-${panel}"`));
    assert.match(svg, new RegExp(`id="bvlp-fixture-function-plot-panel-${panel}-title"`));
    assert.match(svg, new RegExp(`id="bvlp-fixture-function-plot-panel-${panel}-desc"`));
    assert.match(svg, new RegExp(`id="bvlp-fixture-function-plot-panel-${panel}-clip"`));
  }
  assert.match(svg, />Quadratic panel</);
  assert.match(svg, />Cubic panel</);
  assert.match(svg, /Reading order: left-panel:/);
});

test("asset measurement and rendering fail closed on unsafe output, invalid paths, and hard byte budgets", () => {
  const scene = compileVisualSpec(makeVisualSpec());
  const rendered = renderStaticSvg(scene);
  assert.deepEqual(
    measureStaticSvg(scene.id, rendered.svg),
    {
      byteLength: rendered.byteLength,
      sha256: rendered.sha256,
      assetFileName: rendered.assetFileName,
      assetPath: rendered.assetPath,
      meetsTarget: rendered.meetsTarget,
      requiresSizeJustification: rendered.requiresSizeJustification,
    },
  );
  assert.throws(
    () => renderStaticSvg(scene, { maxOutputBytes: 100 }),
    (error) => error instanceof StaticSvgRenderError && error.code === "svg-output-budget",
  );
  assert.throws(
    () => measureStaticSvg(scene.id, rendered.svg, { assetPrefix: "https://example.test/visuals" }),
    (error) => error instanceof StaticSvgRenderError && error.code === "invalid-asset-prefix",
  );
  assert.throws(
    () => assertStaticSvgSafety(`<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>\n`, scene.id),
    (error) => error instanceof StaticSvgRenderError && error.code === "unsafe-script",
  );
});

test("renderer rejects malformed compiled scenes and reserved 3D requirements", () => {
  const scene = compileVisualSpec(makeVisualSpec());
  const malformed = structuredClone(scene);
  malformed.layers[0].unexpected = true;
  assert.throws(
    () => renderStaticSvg(malformed),
    (error) => error instanceof StaticSvgRenderError && error.code === "invalid-compiled-scene",
  );

  const reserved = structuredClone(scene);
  reserved.requiredCapabilities.push("surface-3d");
  assert.throws(
    () => renderStaticSvg(reserved),
    (error) => error instanceof StaticSvgRenderError && error.code === "unsupported-3d",
  );
});
