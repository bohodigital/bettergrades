import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  RENDERER_REGISTRY,
  RendererRegistryError,
  resolveRenderer,
} from "../lib/visualization/capabilities/index.ts";
import { compileVisualSpec } from "../lib/visualization/compiler/index.ts";
import {
  JSXGRAPH_ADAPTER_CONTRACT,
  JsxGraphAdapterError,
  assertJsxGraphAdapterRequest,
} from "../lib/visualization/renderers/jsxgraph-adapter/index.ts";
import {
  UPLOT_MAX_NUMERIC_VALUES,
  UPLOT_MAX_POINTS,
  UPLOT_MIN_DENSE_POINTS,
  UPlotAdapterError,
  assertUPlotAdapterRequest,
} from "../lib/visualization/renderers/uplot-adapter/index.ts";
import {
  FUTURE_SPECIALIST_CONTRACT,
  UnsupportedSpecialistRendererError,
  requestFutureSpecialistAdapter,
} from "../lib/visualization/renderers/future-specialist/index.ts";
import { cloneFixture, makeVisualSpec } from "../lib/visualization/testkit/index.ts";

const JSXGRAPH_SOURCE = readFileSync("lib/visualization/renderers/jsxgraph-adapter/index.ts", "utf8");
const UPLOT_SOURCE = readFileSync("lib/visualization/renderers/uplot-adapter/index.ts", "utf8");

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  }).filter((path) => /\.(?:ts|tsx|mjs)$/.test(path));
}

function makeDenseScene(pointCount = UPLOT_MIN_DENSE_POINTS) {
  const spec = cloneFixture(makeVisualSpec());
  const xValues = Array.from({ length: pointCount }, (_, index) => index / 10);
  const yValues = xValues.map((value) => Math.sin(value));
  spec.id = "fixture-dense-series";
  spec.kind = "data-series";
  spec.coordinateSpace.type = "data-2d";
  spec.layers = [{
    id: "dense-samples",
    kind: "sampled-series",
    visible: true,
    zIndex: 1,
    presentation: {
      strokeToken: "visual-primary",
      lineStyle: "solid",
      markerShape: "none",
      pattern: "none",
      colorIndependentCue: "Solid dense fixture series.",
    },
    references: [],
    geometry: { xValues, yValues, connect: true },
  }];
  spec.accessibility.readingOrder = ["dense-samples"];
  spec.requiredCapabilities = ["static-fallback", "data-series", "dense-series"];
  spec.provenance = {
    route: "/__nonpublic__/fixtures/dense-series",
    sourceFile: "tests/bvlp-adapters-boundary.test.mjs",
    authoringId: "fixture-dense-series",
    visibility: "fixture",
  };
  return { scene: compileVisualSpec(spec), xValues, yValues };
}

function makeUPlotRequest(pointCount = UPLOT_MIN_DENSE_POINTS) {
  const { scene, xValues, yValues } = makeDenseScene(pointCount);
  return {
    scene,
    xValues,
    series: [{ id: "observations", label: "Fixture observations", values: yValues }],
    dataSummary: "A bounded non-public sine sample used to validate the dense data adapter.",
    staticFallback: {
      available: true,
      elementId: "fixture-static-svg",
      describedById: "fixture-static-description",
      preserveDuringEnhancement: true,
    },
  };
}

function makeJsxGraphScene() {
  const collection = JSON.parse(readFileSync("content/visualizations/fixtures/cross-domain.visual-specs.v1.json", "utf8"));
  return compileVisualSpec(collection.find((spec) => spec.id === "fixture-ode-direction-field"));
}

function makeJsxGraphRequest() {
  return {
    scene: makeJsxGraphScene(),
    learnerActivated: true,
    staticFallback: {
      available: true,
      elementId: "fixture-static-svg",
      describedById: "fixture-static-description",
      preserveDuringEnhancement: true,
    },
  };
}

test("registry keeps both heavy renderers lazy, capability-gated, and fallback-backed", () => {
  const jsxgraph = RENDERER_REGISTRY.get("jsxgraph");
  const uplot = RENDERER_REGISTRY.get("uplot");
  assert.equal(jsxgraph?.runtimeClass, "browser-lazy");
  assert.equal(jsxgraph?.activation, "explicit-user-action");
  assert.equal(jsxgraph?.learnerActivationRequired, true);
  assert.equal(jsxgraph?.fallbackRenderer, "static-svg");
  assert.equal(jsxgraph?.dynamicImportPath, "lib/visualization/renderers/jsxgraph-adapter");
  assert.equal(uplot?.runtimeClass, "browser-lazy");
  assert.equal(uplot?.fallbackRenderer, "static-svg");
  assert.equal(uplot?.dynamicImportPath, "lib/visualization/renderers/uplot-adapter");
  assert.equal(resolveRenderer({ visualId: "geometry", kind: "geometry-2d", requiredCapabilities: ["static-fallback", "geometry-primitives", "advanced-constraints"] }).id, "jsxgraph");
  assert.equal(resolveRenderer({ visualId: "dense", kind: "data-series", requiredCapabilities: ["static-fallback", "data-series", "dense-series"] }).id, "uplot");
});

test("vendor packages occur only in lazy import expressions inside their adapters", () => {
  assert.doesNotMatch(JSXGRAPH_SOURCE, /(?:^|\n)\s*import\s+[^\n]*from\s+["']jsxgraph["']/);
  assert.match(JSXGRAPH_SOURCE, /await\s+import\(["']jsxgraph["']\)/);
  assert.doesNotMatch(UPLOT_SOURCE, /(?:^|\n)\s*import\s+(?!type\b)[^\n]*from\s+["']uplot["']/);
  assert.match(UPLOT_SOURCE, /import\s+type\s+UPlot\s+from\s+["']uplot["']/);
  assert.match(UPLOT_SOURCE, /await\s+import\(["']uplot["']\)/);

  const runtimeSources = sourceFiles("app")
    .concat(sourceFiles("lib"))
    .filter((path) => !path.includes("jsxgraph-adapter") && !path.includes("uplot-adapter"));
  const packageImport = /(?:from\s+|require\s*\(|import\s*\()["'](?:jsxgraph|uplot)["']/;
  for (const path of runtimeSources) {
    assert.doesNotMatch(readFileSync(path, "utf8"), packageImport, path);
  }
});

test("JSXGraph requires advanced capability, explicit learner activation, and retained fallback", () => {
  const request = makeJsxGraphRequest();
  assert.doesNotThrow(() => assertJsxGraphAdapterRequest(request));
  assert.deepEqual(JSXGRAPH_ADAPTER_CONTRACT.advancedCapabilities, [
    "advanced-constraints",
    "dynamic-loci",
    "implicit-curves",
    "ode-solution-family",
  ]);
  assert.equal(JSXGRAPH_ADAPTER_CONTRACT.removesFallback, false);

  assert.throws(
    () => assertJsxGraphAdapterRequest({ ...request, learnerActivated: false }),
    (error) => error instanceof JsxGraphAdapterError && error.code === "activation-required",
  );
  assert.throws(
    () => assertJsxGraphAdapterRequest({ ...request, staticFallback: { ...request.staticFallback, available: false } }),
    (error) => error instanceof JsxGraphAdapterError && error.code === "missing-static-fallback",
  );

  const ordinary = compileVisualSpec(makeVisualSpec({
    requiredCapabilities: ["static-fallback", "cartesian-axes", "function-paths", "parameter-controls"],
    controls: [{
      id: "fixture-slider",
      kind: "slider",
      label: { segments: [{ kind: "text", text: "Fixture slider" }] },
      announcementTemplate: "Value is {value}",
      parameter: "p",
      min: 0,
      max: 1,
      step: 0.1,
      initial: 0,
    }],
  }));
  assert.throws(
    () => assertJsxGraphAdapterRequest({ ...request, scene: { ...ordinary, selectedRenderer: "jsxgraph", delivery: { ...ordinary.delivery, hydration: "explicit-user-action" } } }),
    (error) => error instanceof JsxGraphAdapterError && error.code === "advanced-capability-required",
  );
});

test("uPlot accepts only bounded aligned finite numeric arrays with summary and fallback", () => {
  const request = makeUPlotRequest();
  assert.doesNotThrow(() => assertUPlotAdapterRequest(request));

  assert.throws(
    () => assertUPlotAdapterRequest({ ...request, expression: { format: "latex", expressionLatex: "x^2" } }),
    (error) => error instanceof UPlotAdapterError && error.code === "symbolic-input-forbidden",
  );
  assert.throws(
    () => assertUPlotAdapterRequest({ ...request, series: [{ ...request.series[0], values: request.series[0].values.slice(1) }] }),
    (error) => error instanceof UPlotAdapterError && error.code === "series-length-mismatch",
  );
  assert.throws(
    () => assertUPlotAdapterRequest({ ...request, dataSummary: "" }),
    (error) => error instanceof UPlotAdapterError && error.code === "missing-data-summary",
  );
  assert.throws(
    () => assertUPlotAdapterRequest({ ...request, staticFallback: { ...request.staticFallback, preserveDuringEnhancement: false } }),
    (error) => error instanceof UPlotAdapterError && error.code === "missing-static-fallback",
  );
  const tooManyPoints = Array.from({ length: UPLOT_MAX_POINTS + 1 }, (_, index) => index);
  assert.throws(
    () => assertUPlotAdapterRequest({ ...request, xValues: tooManyPoints, series: [{ ...request.series[0], values: tooManyPoints }] }),
    (error) => error instanceof UPlotAdapterError && error.code === "point-bound-exceeded",
  );
  assert.equal(UPLOT_MAX_NUMERIC_VALUES, 60_000);
});

test("future specialist boundary has no dependency and fails clearly for 3D", () => {
  assert.equal(FUTURE_SPECIALIST_CONTRACT.status, "reserved-not-installed");
  assert.deepEqual(FUTURE_SPECIALIST_CONTRACT.heavyDependencies, []);
  assert.throws(
    () => requestFutureSpecialistAdapter("surface-3d", "fixture-surface"),
    (error) => error instanceof UnsupportedSpecialistRendererError && error.code === "unsupported-3d" && /no installed 3D/i.test(error.message),
  );
  assert.throws(
    () => resolveRenderer({ visualId: "fixture-surface", kind: "geometry-2d", requiredCapabilities: ["surface-3d"] }),
    (error) => error instanceof RendererRegistryError && error.code === "unsupported-3d",
  );
  const source = readFileSync("lib/visualization/renderers/future-specialist/index.ts", "utf8");
  assert.doesNotMatch(source, /(?:^|\n)\s*import\s|three|babylon|plotly|vtk|webgl/i);
});
