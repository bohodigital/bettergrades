import assert from "node:assert/strict";
import test from "node:test";

import { compileVisualSpec, compileVisualSpecs } from "../lib/visualization/compiler/index.ts";
import {
  RENDERER_REGISTRY,
  RendererRegistryError,
  inferRequiredCapabilities,
  resolveRenderer,
} from "../lib/visualization/capabilities/index.ts";
import { CompiledSceneSchema, VisualSpecSchema } from "../lib/visualization/schema/index.ts";
import { cloneFixture, makeVisualSpec, richText } from "../lib/visualization/testkit/index.ts";

test("strict VisualSpec v1 accepts the complete fixture and CompiledScene v1 is deterministic", () => {
  const spec = makeVisualSpec();
  assert.equal(VisualSpecSchema.parse(spec).schemaVersion, 1);
  const first = compileVisualSpec(spec);
  const second = compileVisualSpec(cloneFixture(spec));
  assert.deepEqual(first, second);
  assert.equal(first.compiledSceneVersion, 1);
  assert.equal(first.selectedRenderer, "static-svg");
  assert.equal(first.delivery.hydration, "none");
  assert.equal(first.staticFallback.required, true);
  assert.equal(Object.isFrozen(first), true);
  assert.doesNotThrow(() => CompiledSceneSchema.parse(first));
});

test("schema fails closed on unknown fields, versions, kinds, layers, and controls", () => {
  for (const mutation of [
    (spec) => { spec.unknown = true; },
    (spec) => { spec.rendererPreference = spec.preferredRenderer; delete spec.preferredRenderer; },
    (spec) => { spec.schemaVersion = 2; },
    (spec) => { spec.kind = "surface-3d"; },
    (spec) => { spec.layers[0].kind = "vendor-line"; },
    (spec) => { spec.controls = [{ id: "bad", kind: "vendor-widget" }]; },
  ]) {
    const spec = cloneFixture(makeVisualSpec());
    mutation(spec);
    assert.equal(VisualSpecSchema.safeParse(spec).success, false);
  }
});

test("mandatory accessibility and print representations cannot be omitted", () => {
  for (const key of ["accessibility", "print"]) {
    const spec = cloneFixture(makeVisualSpec());
    delete spec[key];
    assert.equal(VisualSpecSchema.safeParse(spec).success, false);
  }
});

test("IDs, references, cycles, controls, units, and reading order are validated", () => {
  const duplicate = cloneFixture(makeVisualSpec());
  duplicate.layers.push(cloneFixture(duplicate.layers[0]));
  assert.equal(VisualSpecSchema.safeParse(duplicate).success, false);

  const missingReference = cloneFixture(makeVisualSpec());
  missingReference.layers[0].references = ["absent"];
  assert.equal(VisualSpecSchema.safeParse(missingReference).success, false);

  const cycle = cloneFixture(makeVisualSpec());
  const second = cloneFixture(cycle.layers[0]);
  second.id = "second-function";
  cycle.layers[0].references = [second.id];
  second.references = [cycle.layers[0].id];
  cycle.layers.push(second);
  cycle.accessibility.readingOrder.push(second.id);
  assert.equal(VisualSpecSchema.safeParse(cycle).success, false);

  const badControl = cloneFixture(makeVisualSpec());
  badControl.controls = [{
    id: "point-control",
    kind: "draggable-point",
    label: richText("Move the point"),
    announcementTemplate: "x is {x}",
    targetLayerId: "absent",
    keyboardStep: 0.1,
  }];
  assert.equal(VisualSpecSchema.safeParse(badControl).success, false);

  const units = cloneFixture(makeVisualSpec());
  units.coordinateSpace.unitsRequired = true;
  assert.equal(VisualSpecSchema.safeParse(units).success, false);

  const order = cloneFixture(makeVisualSpec());
  order.accessibility.readingOrder = ["absent"];
  assert.equal(VisualSpecSchema.safeParse(order).success, false);
});

test("multi-panel layouts require stable non-overlapping panels and valid layer references", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.panels = [
    { id: "left-panel", title: richText("Left"), description: "The left comparison panel.", row: 0, column: 0, rowSpan: 1, columnSpan: 1, order: 0 },
    { id: "right-panel", title: richText("Right"), description: "The right comparison panel.", row: 0, column: 1, rowSpan: 1, columnSpan: 1, order: 1 },
  ];
  spec.layers[0].panelId = "left-panel";
  spec.requiredCapabilities.push("multi-panel");
  spec.accessibility.readingOrder = ["left-panel", "quadratic", "right-panel"];
  assert.equal(VisualSpecSchema.safeParse(spec).success, true);

  const missing = cloneFixture(spec);
  missing.layers[0].panelId = "absent-panel";
  assert.equal(VisualSpecSchema.safeParse(missing).success, false);

  const overlap = cloneFixture(spec);
  overlap.panels[1].column = 0;
  assert.equal(VisualSpecSchema.safeParse(overlap).success, false);

  const undeclared = cloneFixture(spec);
  undeclared.requiredCapabilities = undeclared.requiredCapabilities.filter((capability) => capability !== "multi-panel");
  assert.equal(VisualSpecSchema.safeParse(undeclared).success, false);
});

test("compiler rejects undeclared inferred capabilities and duplicate compilation IDs", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.requiredCapabilities = ["static-fallback", "cartesian-axes"];
  assert.throws(() => compileVisualSpec(spec), /function-paths/);
  assert.throws(() => compileVisualSpecs([makeVisualSpec(), makeVisualSpec()]), /duplicated/);

  const latex = cloneFixture(makeVisualSpec());
  latex.layers[0].geometry.expression = { format: "latex", expressionLatex: "x" };
  assert.throws(
    () => compileVisualSpec(latex, {
      compileLatex: () => ({ type: "variable", name: "undeclared" }),
    }),
    /not allowlisted/,
  );
});

test("capability inference is derived from scene primitives and controls", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.controls = [{
    id: "x-slider",
    kind: "slider",
    label: richText("x value"),
    announcementTemplate: "x is {value}",
    parameter: "x",
    min: -4,
    max: 4,
    step: 0.25,
    initial: 0,
  }];
  assert.deepEqual(inferRequiredCapabilities(spec), [
    "cartesian-axes",
    "function-paths",
    "parameter-controls",
    "static-fallback",
  ]);
});

test("resolver deterministically chooses the cheapest compatible installed renderer", () => {
  assert.equal(resolveRenderer({ visualId: "a", kind: "cartesian-2d", requiredCapabilities: ["static-fallback", "function-paths"] }).id, "static-svg");
  assert.equal(resolveRenderer({ visualId: "b", kind: "cartesian-2d", requiredCapabilities: ["static-fallback", "function-paths", "parameter-controls"] }).id, "bg-interactive-2d");
  assert.equal(resolveRenderer({ visualId: "c", kind: "geometry-2d", requiredCapabilities: ["static-fallback", "geometry-primitives", "advanced-constraints"] }).id, "jsxgraph");
  assert.equal(resolveRenderer({ visualId: "d", kind: "data-series", requiredCapabilities: ["static-fallback", "data-series", "dense-series"] }).id, "uplot");
  const advisoryOnly = makeVisualSpec({ preferredRenderer: "prefer-interactive" });
  assert.equal(compileVisualSpec(advisoryOnly).selectedRenderer, "static-svg");
  assert.equal(RENDERER_REGISTRY.size, 5);
});

test("resolver fails clearly for unsupported 3D and incompatible capability mixtures", () => {
  assert.throws(
    () => resolveRenderer({ visualId: "three-d", kind: "geometry-2d", requiredCapabilities: ["surface-3d"] }),
    (error) => error instanceof RendererRegistryError && error.code === "unsupported-3d" && /three-d/.test(error.message),
  );
  assert.throws(
    () => resolveRenderer({ visualId: "mixed", kind: "data-series", requiredCapabilities: ["dense-series", "advanced-constraints"] }),
    (error) => error instanceof RendererRegistryError && error.code === "unsupported-capabilities",
  );
});

test("authored specs contain capability intent, not renderer or vendor API calls", () => {
  const serialized = JSON.stringify(makeVisualSpec());
  assert.equal(/selectedRenderer|jsxgraph|uplot|canvas|getContext|createElementNS/i.test(serialized), false);
});
