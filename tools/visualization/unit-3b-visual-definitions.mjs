import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UNIT = "unit-3b";
const STATIC = "static-svg";
const INTERACTIVE = "interactive-2d";

function plain(value) {
  return String(value)
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[{}^_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const text = (value) => ({ segments: [{ kind: "text", text: plain(value) }] });
const expr = (expressionLatex) => ({ format: "latex", expressionLatex });
const style = (strokeToken, cue, extra = {}) => ({ strokeToken, lineStyle: "solid", markerShape: "none", pattern: "none", colorIndependentCue: cue, ...extra });

function samples(fn, min, max, count = 101) {
  const xValues = [];
  const yValues = [];
  for (let index = 0; index < count; index += 1) {
    const x = min + ((max - min) * index) / (count - 1);
    const y = fn(x);
    if (Number.isFinite(y)) {
      xValues.push(Number(x.toFixed(6)));
      yValues.push(Number(y.toFixed(6)));
    }
  }
  return { xValues, yValues };
}

function betweenCurves(top, bottom, min, max, count = 40) {
  const coordinates = [];
  for (let index = 0; index <= count; index += 1) {
    const x = min + ((max - min) * index) / count;
    coordinates.push([Number(x.toFixed(6)), Number(top(x).toFixed(6))]);
  }
  for (let index = count; index >= 0; index -= 1) {
    const x = min + ((max - min) * index) / count;
    coordinates.push([Number(x.toFixed(6)), Number(bottom(x).toFixed(6))]);
  }
  return coordinates;
}

function circle(cx, cy, radius, count = 48) {
  return samples((angle) => cy + radius * Math.sin(angle), 0, 2 * Math.PI, count + 1).xValues.map((angle) => [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
}

const series = (id, data, labelValue, token = "visual-primary", lineStyle = "solid") => ({
  id,
  kind: "sampled-series",
  label: text(labelValue),
  geometry: { ...data, connect: true },
  presentation: style(token, `${labelValue}; ${lineStyle} curve.`, { lineStyle }),
});
const unlabeledSeries = (id, data, cue, token = "visual-primary", lineStyle = "solid") => ({
  id,
  kind: "sampled-series",
  geometry: { ...data, connect: true },
  presentation: style(token, `${cue}; ${lineStyle} curve.`, { lineStyle }),
});
const segment = (id, x1, y1, x2, y2, labelValue, token = "visual-guide", lineStyle = "solid") => ({
  id,
  kind: "segment",
  label: text(labelValue),
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, `${labelValue}; ${lineStyle} segment.`, { lineStyle }),
});
const guide = (id, x1, y1, x2, y2, cue, token = "visual-guide", lineStyle = "solid") => ({
  id,
  kind: "segment",
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, `${cue}; ${lineStyle} segment.`, { lineStyle }),
});
const polygon = (id, coordinates, cue, token = "visual-primary", pattern = "diagonal") => ({
  id,
  kind: "polygon",
  geometry: { points: coordinates.map(([x, y]) => ({ x, y })), closed: true },
  presentation: style(token, cue, { fillToken: token, pattern }),
});
const label = (id, x, y, content, token = "visual-ink") => ({
  id,
  kind: "label",
  geometry: { position: { x, y }, content: text(content) },
  presentation: style(token, `Label: ${content}.`),
});
const annotation = (id, x, y, content, token = "visual-ink") => ({
  id,
  kind: "annotation",
  geometry: { anchor: { x, y }, content: text(content) },
  presentation: style(token, `Annotation: ${content}.`),
});
const marker = (id, x, y, cue, token = "visual-emphasis", markerShape = "diamond") => ({
  id,
  kind: "closed-point",
  geometry: { position: { x, y } },
  presentation: style(token, cue, { fillToken: token, markerShape }),
});

function axes(xLabel, yLabel, xStep, yStep) {
  return { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text(xLabel), scale: "linear", tickMode: xStep ? "fixed-step" : "automatic", ...(xStep ? { tickStep: xStep } : {}), showGrid: true },
    { id: "y-axis", orientation: "y", label: text(yLabel), scale: "linear", tickMode: yStep ? "fixed-step" : "automatic", ...(yStep ? { tickStep: yStep } : {}), showGrid: true },
  ] };
}

function graph(viewport, layers, controls = [], xLabel = "x", yLabel = "y", xStep, yStep) {
  return {
    kind: "cartesian-2d",
    coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 },
    axes: axes(xLabel, yLabel, xStep, yStep),
    panels: [],
    layers,
    controls,
  };
}

function geometry(viewport, layers, controls = []) {
  return {
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 },
    axes: { mode: "none", reason: "Labels and dimension guides carry the instructional geometry." },
    panels: [],
    layers,
    controls,
  };
}

const sceneDefinitions = {
  "U3B-V01": () => graph({ xMin: 0, xMax: 2.08, yMin: 0, yMax: 4.65 }, [
    polygon("bounded-region", betweenCurves((x) => 2 * x, (x) => x * x, 0, 2), "Patterned area between upper line and lower parabola.", "visual-secondary", "dots"),
    series("upper-curve", samples((x) => 2 * x, 0, 2), "upper y=2x", "visual-primary", "double"),
    series("lower-curve", samples((x) => x * x, 0, 2), "lower y=x squared", "visual-ink", "solid"),
    guide("moving-slice", expr("p"), expr("p^2"), expr("p"), expr("2p"), "Movable vertical slice shows top minus bottom.", "visual-emphasis", "double"),
    label("slice-height-label", 0.52, 2.25, "slice height = 2x - x squared"),
    annotation("slice-rule", 1.04, 4.37, "Area adds (top - bottom) dx from x=0 to x=2."),
  ], [{ id: "slice-control", kind: "slider", label: text("Vertical slice position"), announcementTemplate: "The vertical slice is at x equals {value}; its height is two x minus x squared.", parameter: "p", min: 0.2, max: 1.8, step: 0.2, initial: 1 }], "x", "y", 0.5, 1),

  "U3B-V02": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.2 }, [
    polygon("solid-body", [[1, 1.35], [9.6, 1.35], [11, 3.15], [2.4, 3.15]], "Perspective body decomposed into thin slabs.", "visual-secondary", "dots"),
    polygon("front-face", [[1, 1.35], [2.4, 3.15], [2.4, 5.35], [1, 3.55]], "Representative cross-section at the front of the solid.", "visual-primary", "diagonal"),
    ...[3.5, 4.8, 6.1, 7.4, 8.7].map((x, index) => guide(`slice-${index + 1}`, x, 1.35, x + 1.4, 3.15, `Slab boundary ${index + 1}.`, "visual-guide", "dashed")),
    segment("thickness", 6.1, 0.75, 7.4, 0.75, "slice thickness dx", "visual-emphasis", "double"),
    label("cross-section-label", 1.15, 5.85, "cross-sectional area A(x)"),
    annotation("volume-rule", 7.1, 6.15, "One slab is approximately A(x) dx; integration adds all slabs."),
  ]),

  "U3B-V03": () => geometry({ xMin: 0, xMax: 12, yMin: -0.6, yMax: 7.4 }, [
    polygon("washer-region", [[0.8, 1.2], [4.3, 1.2], [4.3, 4.3], [0.8, 5.4]], "Region between two curves above the rotation axis.", "visual-secondary", "dots"),
    guide("rotation-axis", 0.3, 0.7, 5, 0.7, "Horizontal axis of rotation.", "visual-ink", "double"),
    guide("moving-outer-radius", expr("p"), 0.7, expr("p"), expr("5.64-0.31p"), "Outer radius R(x), measured from the axis.", "visual-primary", "double"),
    guide("moving-inner-radius", expr("p+0.12"), 0.7, expr("p+0.12"), 1.2, "Inner radius r(x), measured from the axis.", "visual-emphasis", "dashed"),
    label("outer-radius-source-label", 2.2, 5.95, "R(x): axis to upper curve"),
    label("inner-radius-source-label", 2.2, -0.3, "r(x): axis to lower curve"),
    unlabeledSeries("outer-circle", { xValues: circle(8.5, 3.5, 2.35).map(([x]) => x), yValues: circle(8.5, 3.5, 2.35).map(([, y]) => y) }, "Outer washer boundary R.", "visual-primary", "double"),
    unlabeledSeries("inner-circle", { xValues: circle(8.5, 3.5, 0.9).map(([x]) => x), yValues: circle(8.5, 3.5, 0.9).map(([, y]) => y) }, "Inner washer boundary r.", "visual-emphasis", "dashed"),
    guide("washer-r", 8.5, 3.5, 9.4, 3.5, "Inner radius r.", "visual-emphasis", "dashed"),
    guide("washer-outer-radius", 8.5, 3.5, 10.85, 3.5, "Outer radius R.", "visual-primary", "double"),
    label("washer-r-label", 8.92, 3.05, "r"),
    label("washer-outer-radius-label", 9.72, 4.02, "R"),
    label("washer-area", 8.5, 6.55, "cross-section area = pi(R squared - r squared)"),
  ], [{ id: "washer-slice-control", kind: "slider", label: text("Washer slice position"), announcementTemplate: "The vertical source slice is at x equals {value}; both radii are measured from the rotation axis.", parameter: "p", min: 1, max: 4, step: 0.5, initial: 2.5 }]),

  "U3B-V04": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.4 }, [
    polygon("shell-region", betweenCurves((x) => 4 - x * x, () => 0, 0, 2), "Region rotated about the vertical axis.", "visual-secondary", "dots"),
    guide("shell-axis", 0, 0.2, 0, 5.3, "Vertical axis of rotation.", "visual-ink", "double"),
    guide("shell-radius", 0, 0.35, expr("p"), 0.35, "Shell radius x.", "visual-emphasis", "double"),
    guide("shell-height", expr("p"), 0.2, expr("p"), expr("4-p^2"), "Shell height is top minus bottom.", "visual-primary", "double"),
    label("shell-radius-label", 1.15, 0.78, "radius x"),
    label("shell-height-label", 3.1, 4.75, "height = top - bottom"),
    unlabeledSeries("shell-top", { xValues: circle(8.2, 5.15, 2.1).map(([x]) => x), yValues: circle(8.2, 5.15, 2.1).map(([, y]) => 5.15 + (y - 5.15) * 0.32) }, "Top rim of cylindrical shell.", "visual-primary", "solid"),
    unlabeledSeries("shell-bottom", { xValues: circle(8.2, 1.85, 2.1).map(([x]) => x), yValues: circle(8.2, 1.85, 2.1).map(([, y]) => 1.85 + (y - 1.85) * 0.32) }, "Bottom rim of cylindrical shell.", "visual-primary", "dashed"),
    guide("shell-left", 6.1, 1.85, 6.1, 5.15, "Shell side shows height.", "visual-primary", "solid"),
    guide("shell-right", 10.3, 1.85, 10.3, 5.15, "Shell side shows height.", "visual-primary", "solid"),
    label("shell-top-label", 8.2, 4.55, "top rim"),
    label("shell-bottom-label", 8.2, 1.15, "bottom rim"),
    label("shell-product", 8.2, 6.65, "2 pi x times height times dx"),
  ], [{ id: "shell-slice-control", kind: "slider", label: text("Shell slice position"), announcementTemplate: "The vertical source strip is at x equals {value}; radius and height update together.", parameter: "p", min: 0.25, max: 1.75, step: 0.25, initial: 1 }]),

  "U3B-V05": () => graph({ xMin: 0, xMax: 4, yMin: 0, yMax: 4.6 }, [
    series("smooth-curve", samples((x) => 0.22 * x * x + 0.45, 0, 4), "smooth curve", "visual-primary", "double"),
    ...Array.from({ length: 8 }, (_, index) => {
      const x1 = index / 2;
      const x2 = (index + 1) / 2;
      return guide(`chord-${index + 1}`, x1, 0.22 * x1 * x1 + 0.45, x2, 0.22 * x2 * x2 + 0.45, `Short polygonal chord ${index + 1}.`, "visual-emphasis", "solid");
    }),
    marker("arc-point-a", 0, 0.45, "First partition point.", "visual-ink", "circle"),
    marker("arc-point-b", 4, 3.97, "Last partition point.", "visual-ink", "circle"),
    label("chord-label", 2.2, 3.15, "polygonal chords"),
    annotation("arc-limit", 2, 4.3, "Short chord lengths add; refinement approaches the curve's length."),
  ], [], "x", "y", 1, 1),

  "U3B-V06": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 6.3 }, [
    polygon("rod-light", [[1, 2.35], [3.5, 2.35], [3.5, 3.65], [1, 3.65]], "Low-density left part of the rod.", "visual-secondary", "dots"),
    polygon("rod-medium", [[3.5, 2.35], [6, 2.35], [6, 3.65], [3.5, 3.65]], "Medium-density part of the rod.", "visual-primary", "diagonal"),
    polygon("rod-heavy", [[6, 2.35], [11, 2.35], [11, 3.65], [6, 3.65]], "High-density right part of the rod.", "visual-emphasis", "crosshatch"),
    segment("rod-axis", 1, 1.6, 11, 1.6, "rod coordinate from zero to L", "visual-ink", "solid"),
    marker("geometric-midpoint", 6, 1.6, "Circle marks geometric midpoint.", "visual-guide", "circle"),
    marker("center-of-mass", 7.7, 1.6, "Diamond marks center of mass toward denser material.", "visual-emphasis", "diamond"),
    label("midpoint-label", 5.2, 0.75, "geometric midpoint"),
    label("center-label", 8.3, 0.75, "balance point x-bar"),
    annotation("moment-rule", 6, 5.25, "The balance point satisfies x-bar = first moment divided by total mass."),
  ]),

  "U3B-V07": () => graph({ xMin: 0, xMax: 4.15, yMin: 0, yMax: 9.1 }, [
    polygon("work-area", [[0, 0], ...samples((x) => 4 + x, 0, 4, 50).xValues.map((x) => [x, 4 + x]), [4, 0]], "Patterned area under force versus position equals accumulated work.", "visual-secondary", "dots"),
    series("force-curve", samples((x) => 4 + x, 0, 4), "force F(x)", "visual-primary", "double"),
    polygon("thin-work-strip", [[2.4, 0], [2.65, 0], [2.65, 6.65], [2.4, 6.4]], "Highlighted thin contribution F(x) dx.", "visual-emphasis", "crosshatch"),
    annotation("work-units", 2.05, 8.65, "Force times distance gives newton-meters, or joules."),
  ], [], "position x (meters)", "force F(x) (newtons)", 1, 2),

  "U3B-V08": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.5 }, [
    polygon("tank-water", [[2, 0.8], [6, 0.8], [6, 5], [2, 5]], "Water fills the rectangular tank.", "visual-secondary", "dots"),
    guide("tank-left", 2, 0.5, 2, 5.3, "Left tank wall.", "visual-ink", "solid"),
    guide("tank-right", 6, 0.5, 6, 5.3, "Right tank wall.", "visual-ink", "solid"),
    guide("outlet", 6, 6.3, 9.7, 6.3, "Outlet lies above the tank.", "visual-primary", "double"),
    polygon("moving-liquid-slice", [[2.15, expr("p-0.10")], [5.85, expr("p-0.10")], [5.85, expr("p+0.10")], [2.15, expr("p+0.10")]], "Movable horizontal liquid layer of thickness dy.", "visual-emphasis", "crosshatch"),
    guide("lift-distance", 6.45, expr("p"), 6.45, 6.3, "Lift distance D(y).", "visual-primary", "dashed"),
    label("slice-area", 3.95, expr("p+0.55"), "slice volume A(y) dy"),
    label("distance-label", 8.25, 4.45, "D(y) = outlet height - y"),
    annotation("pumping-product", 8.1, 1.45, "Work slice = weight density times A(y) dy times D(y)."),
  ], [{ id: "liquid-slice-control", kind: "slider", label: text("Liquid slice height"), announcementTemplate: "The liquid slice is at height y equals {value}; its lift distance changes oppositely.", parameter: "p", min: 1, max: 4.8, step: 0.4, initial: 3 }]),

  "U3B-V09": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.4 }, [
    guide("waterline", 0.8, 6.15, 10.8, 6.15, "Water surface; depth begins here.", "visual-primary", "double"),
    polygon("submerged-plate", [[2.2, 5.75], [7.8, 5.75], [6.2, 0.9], [3.8, 0.9]], "Submerged plate narrows with depth.", "visual-secondary", "dots"),
    polygon("pressure-strip", [[2.95, 3.25], [7.05, 3.25], [6.9, 2.95], [3.1, 2.95]], "Representative horizontal strip with width w(y) and thickness dy.", "visual-emphasis", "crosshatch"),
    segment("depth", 1.55, 6.15, 1.55, 3.1, "depth y below the surface", "visual-ink", "dashed"),
    ...[5.25, 4.25, 3.1, 1.75].map((y, index) => guide(`pressure-arrow-${index + 1}`, 8, y, 8.8 + index * 0.55, y, `Pressure arrow ${index + 1} grows with depth.`, "visual-primary", "double")),
    label("strip-width", 5, 2.35, "strip area = w(y) dy"),
    annotation("force-rule", 6, 6.8, "Strip force = weight density times depth times strip area."),
  ]),
};

function inferCapabilities(scene) {
  const capabilities = new Set(["static-fallback"]);
  if (scene.kind === "cartesian-2d") capabilities.add("cartesian-axes");
  if (scene.kind === "geometry-2d") capabilities.add("geometry-primitives");
  for (const layer of scene.layers) {
    if (["sampled-series", "trace", "data-marker"].includes(layer.kind)) capabilities.add("data-series");
    if (["open-point", "closed-point"].includes(layer.kind)) capabilities.add("open-closed-points");
    if (["annotation", "label"].includes(layer.kind)) capabilities.add("annotations");
  }
  if (scene.controls.length) capabilities.add("parameter-controls");
  return [...capabilities];
}

function makeSpec(brief) {
  const factory = sceneDefinitions[brief.visual_id];
  if (!factory) throw new Error(`Unit 3B visual ${brief.visual_id} lacks an explicit scene definition.`);
  if (![STATIC, INTERACTIVE].includes(brief.recommended_renderer)) throw new Error(`Unit 3B visual ${brief.visual_id} names unsupported renderer ${brief.recommended_renderer}.`);
  const scene = factory();
  const interactive = brief.recommended_renderer === INTERACTIVE;
  const longDescription = `${plain(brief.long_description)} ${plain(brief.learning_purpose)} ${plain(brief.misconception_control)}`;
  const caption = `${brief.title}. ${brief.learning_purpose}`;
  return {
    schemaVersion: 1,
    id: `${UNIT}-${brief.visual_id.toLowerCase()}`,
    kind: scene.kind,
    title: text(brief.title),
    caption: text(caption),
    learningPurpose: plain(brief.learning_purpose),
    longDescription,
    coordinateSpace: scene.coordinateSpace,
    viewport: scene.viewport,
    axes: scene.axes,
    panels: scene.panels,
    layers: scene.layers,
    controls: scene.controls,
    accessibility: {
      ariaLabel: plain(caption),
      summary: longDescription,
      readingOrder: [...scene.layers.map((layer) => layer.id), ...scene.controls.map((control) => control.id)],
      colorIndependentDescription: `Every relationship in ${plain(brief.title).toLowerCase()} uses written labels together with distinct line styles, markers, or fill patterns; color is never the only carrier of meaning.`,
      ...(interactive ? { keyboardInstructions: "Use Tab to reach the bounded control, then use arrow keys or labeled buttons to change one value at a time." } : {}),
      controlInstructions: scene.controls.map((control) => plain(control.label.segments[0].text)),
      reducedMotion: interactive ? "disable-animation" : "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: { representation: "generated-svg", caption: text(caption), grayscaleSafe: true, pageBreak: "avoid", widthInches: 7.1 },
    performance: { maxSamples: 2048, maxAdaptiveDepth: 12, maxAstNodes: 192, maxAstDepth: 24, maxOperationsPerEvaluation: 2048, maxPayloadBytes: 65536, maxAnimationFps: 30, activation: interactive ? "near-viewport" : "none" },
    requiredCapabilities: inferCapabilities(scene),
    preferredRenderer: interactive ? "prefer-interactive" : "prefer-static",
    provenance: { route: `/${brief.route_id.replace(/^\/+|\/+$/g, "")}/`, sourceFile: `content/calculus/units/${UNIT}/visual-specs.v1.json`, authoringId: `source-${brief.visual_id.toLowerCase()}`, visibility: "public" },
  };
}

export async function authorUnit3bVisuals({ root, checkOnly }) {
  const directory = resolve(root, "content/calculus/units/unit-3b");
  const briefs = JSON.parse(await readFile(resolve(directory, "handoff/visual-authoring-briefs.v3.json"), "utf8")).visual_briefs;
  const briefIds = briefs.map((brief) => brief.visual_id);
  const definitionIds = Object.keys(sceneDefinitions);
  const missing = briefIds.filter((id) => !definitionIds.includes(id));
  const extra = definitionIds.filter((id) => !briefIds.includes(id));
  if (missing.length || extra.length) throw new Error(`Unit 3B explicit visual inventory mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
  const specs = briefs.map(makeSpec);
  if (specs.length !== 9 || new Set(specs.map((spec) => spec.id)).size !== 9) throw new Error("Unit 3B requires exactly nine unique explicit visual specs.");
  if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== 4) throw new Error("Unit 3B requires exactly four BetterGrades Interactive 2D scenes.");
  const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: "unit-3b-calculus-visuals", migrationOnly: false, explicitDefinitionsOnly: true, visuals: specs }, null, 2)}\n`;
  const outputPath = resolve(directory, "visual-specs.v1.json");
  if (checkOnly) {
    if ((await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n") !== output) throw new Error("unit-3b visual specs are stale.");
  } else await writeFile(outputPath, output);
  console.log(`${checkOnly ? "Verified" : "Authored"} nine Unit 3B explicit VisualSpec v1 records (five static, four BetterGrades Interactive 2D).`);
}
