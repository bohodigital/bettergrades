import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1] ?? "unit-2a";
const checkOnly = process.argv.includes("--check");
const directory = resolve(root, "content/calculus/units", requested);
const briefs = JSON.parse(await readFile(resolve(directory, "visual-authoring-briefs.v3.json"), "utf8"));

function plain(value) {
  return String(value)
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\\(?:sin|cos|tan|ln|log|sec|csc|cot)\b/g, (match) => match.slice(1))
    .replace(/\\(?:ne|neq)\b/g, " is not equal to ")
    .replace(/\\(?:to|mapsto|longrightarrow|Rightarrow)\b/g, " to ")
    .replace(/\\pi\b/g, "pi")
    .replace(/[{}^_]/g, " ")
    .replace(/``|''/g, '"')
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const text = (value) => ({ segments: [{ kind: "text", text: plain(value) }] });
const presentation = (strokeToken, cue, extra = {}) => ({ strokeToken, lineStyle: "solid", markerShape: "none", pattern: "none", colorIndependentCue: cue, ...extra });

function samples(fn, min = -3, max = 3, count = 61) {
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

const curveDefinitions = {
  "2A-V02": [samples((x) => 0.55 * x * x, -2.5, 2.5), samples((x) => 1.1 * x - 0.55, -2.5, 2.5)],
  "2A-V04": [samples((x) => 0.45 * x * x, -2.5, 2.5), samples((x) => 0.9 * x - 0.45, -2.5, 2.5), samples((x) => -1.11 * x + 1.56, -2.5, 2.5)],
  "2A-E02": [samples((x) => 0.45 * x * x, -3, 3), samples((x) => 0.9 * x, -3, 3)],
  "2A-V06": [samples((x) => 0.35 * x * x + 0.4 * x, -3, 3, 9), samples((x) => 0.4 * x, -3, 3)],
  "2A-V07": [samples((x) => Math.abs(x), -3, 3), samples((x) => Math.cbrt(x * x) - 1.5, -3, 3)],
  "2A-V08": [samples((x) => 0.18 * x ** 3, -3, 3), samples((x) => 0.54 * x * x - 2, -3, 3)],
  "2A-V12": [samples(Math.sin, -Math.PI, Math.PI), samples(Math.cos, -Math.PI, Math.PI), samples((x) => -Math.sin(x), -Math.PI, Math.PI)],
  "2A-V13": [samples(Math.exp, -2.4, 1.6), samples((x) => x + 1, -2.4, 1.6)],
  "2A-V14": [samples(Math.exp, -2, 1.5), samples(Math.log, 0.08, 4), samples((x) => x, -2, 4)],
  "2A-V17": [samples((x) => Math.sqrt(Math.max(0, 6.25 - x * x)), -2.5, 2.5), samples((x) => -Math.sqrt(Math.max(0, 6.25 - x * x)), -2.5, 2.5)],
  "2A-V18": [samples((x) => 1.5 * x + 0.5, -2.5, 2.5), samples((x) => (x - 0.5) / 1.5, -2.5, 2.5), samples((x) => x, -2.5, 2.5)],
  "2A-V20": [samples((x) => 0.18 * x ** 3 - x, -3, 3), samples((x) => 0.54 * x * x - 1, -3, 3), samples((x) => 1.08 * x, -3, 3)],
  "2A-V22": [samples((x) => x * x, -2.5, 2.5), samples((x) => Math.abs(x), -2.5, 2.5)],
  "2A-V23": [samples((x) => Math.tanh(2 * x), -3, 3), { xValues: [-3, -0.02, 0.02, 3], yValues: [-1.4, -1.4, 1.4, 1.4] }],
  "2A-V25": [samples((x) => Math.sqrt(Math.max(0, 6.25 - x * x)), -2.5, 2.5), samples((x) => -Math.sqrt(Math.max(0, 6.25 - x * x)), -2.5, 2.5)],
};

function base(brief, id, kind, coordinateSpace, viewport, axes, layers, controls = []) {
  const interactive = brief.recommended_renderer === "bettergrades-interactive-2d";
  const briefDescription = plain(brief.long_description);
  const longDescription = briefDescription.length >= 120 ? briefDescription : `${briefDescription} ${plain(brief.learning_purpose)}`;
  const capabilities = new Set(["static-fallback"]);
  if (axes.mode === "explicit") capabilities.add("cartesian-axes");
  if (layers.some((layer) => layer.kind === "function")) capabilities.add("function-paths");
  if (layers.some((layer) => layer.kind === "piecewise-branch")) capabilities.add("piecewise-paths");
  if (layers.some((layer) => layer.kind === "sampled-series")) capabilities.add("data-series");
  if (layers.some((layer) => ["point", "open-point", "closed-point"].includes(layer.kind))) capabilities.add("open-closed-points");
  if (layers.some((layer) => layer.kind === "annotation" || layer.kind === "label")) capabilities.add("annotations");
  if (layers.some((layer) => ["circle", "ellipse", "line", "ray", "segment", "direction-arrow", "polygon"].includes(layer.kind))) capabilities.add("geometry-primitives");
  if (controls.length) capabilities.add("parameter-controls");
  return {
    schemaVersion: 1,
    id,
    kind,
    title: text(brief.title_latex),
    caption: text(brief.caption_latex),
    learningPurpose: plain(brief.learning_purpose),
    longDescription,
    coordinateSpace,
    viewport,
    axes,
    panels: [],
    layers,
    controls,
    accessibility: {
      ariaLabel: plain(brief.caption_latex),
      summary: longDescription,
      readingOrder: [...layers.map((layer) => layer.id), ...controls.map((control) => control.id)],
      colorIndependentDescription: `The visual uses labeled positions, solid and dashed line styles, and written descriptions so ${plain(brief.title_latex).toLowerCase()} does not depend on color.`,
      ...(interactive ? { keyboardInstructions: "Focus the step control and use the Previous and Next buttons to move the second secant point." } : {}),
      controlInstructions: interactive ? ["Move through the nonzero h values and compare each secant slope with the tangent slope 7."] : [],
      reducedMotion: interactive ? "disable-animation" : "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: { representation: "generated-svg", caption: text(brief.caption_latex), grayscaleSafe: true, pageBreak: "avoid", widthInches: 7.1 },
    performance: { maxSamples: 2048, maxAdaptiveDepth: 12, maxAstNodes: 128, maxAstDepth: 20, maxOperationsPerEvaluation: 1024, maxPayloadBytes: 65536, maxAnimationFps: 30, activation: interactive ? "near-viewport" : "none" },
    requiredCapabilities: [...capabilities],
    preferredRenderer: interactive ? "prefer-interactive" : "prefer-static",
    provenance: { route: `/${brief.route.replace(/^\/+|\/+$/g, "")}/`, sourceFile: `content/calculus/units/${requested}/visual-specs.v1.json`, authoringId: `source-${brief.visual_id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, visibility: "public" },
  };
}

function interactiveSpec(brief, id) {
  const line = (layerId, expressionLatex, token, style, cue) => ({
    id: layerId,
    kind: "function",
    geometry: { expression: { format: "latex", expressionLatex }, variable: "t", domain: { min: -0.5, max: 4.5, includeMin: true, includeMax: true } },
    presentation: presentation(token, cue, { lineStyle: style }),
  });
  const layers = [
    line("position-curve", "t^2+3t", "visual-primary", "solid", "Heavy solid position curve."),
    line("active-secant", "(7+h)t-4-2h", "visual-emphasis", "dashed", "Dashed secant line controlled by h."),
    line("tangent-line", "7t-4", "visual-success", "double", "Double tangent line with slope 7."),
    { id: "point-p", kind: "closed-point", label: text("P at t = 2"), geometry: { position: { x: 2, y: 10 } }, presentation: presentation("visual-ink", "Filled circle marks the fixed point P.", { fillToken: "visual-ink", markerShape: "circle" }) },
    { id: "point-q", kind: "closed-point", label: text("movable Q"), geometry: { position: { x: { format: "latex", expressionLatex: "2+h" }, y: { format: "latex", expressionLatex: "(2+h)^2+3(2+h)" } } }, presentation: presentation("visual-emphasis", "Filled diamond marks the movable second point Q.", { fillToken: "visual-emphasis", markerShape: "diamond" }) },
    { id: "slope-note", kind: "annotation", geometry: { anchor: { x: 0.1, y: 20 }, content: text("secant slope = 7 + h; tangent slope = 7") }, presentation: presentation("visual-ink", "Written slope comparison identifies convergence.") },
  ];
  const controls = [{ id: "h-control", kind: "step-control", label: text("Horizontal step h"), announcementTemplate: "h is {value}; the secant slope is 7 plus h.", parameter: "h", values: [-1.5, -1, -0.5, -0.2, 0.2, 0.5, 1, 1.5], initialIndex: 5 }];
  return base(brief, id, "cartesian-2d", { type: "cartesian-2d", variables: ["t", "s"], unitsRequired: false }, { xMin: -0.5, xMax: 4.5, yMin: -3, yMax: 25, aspectRatio: 1.75, padding: 0.05 }, { mode: "explicit", axes: [
    { id: "t-axis", orientation: "x", label: text("t"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: true },
    { id: "s-axis", orientation: "y", label: text("s(t)"), scale: "linear", tickMode: "fixed-step", tickStep: 5, showGrid: true },
  ] }, layers, controls);
}

function cartesianSpec(brief, id) {
  const curves = curveDefinitions[brief.visual_id] ?? [samples((x) => 0.22 * x ** 3 - 0.7 * x, -3, 3), samples((x) => 0.66 * x * x - 0.7, -3, 3)];
  const tokens = ["visual-primary", "visual-secondary", "visual-emphasis"];
  const styles = ["solid", "dashed", "dotted"];
  const layers = [
    ...curves.map((curve, index) => ({
      id: `relationship-${index + 1}`,
      kind: "sampled-series",
      label: text(index === 0 ? "original relationship" : index === 1 ? "compared relationship" : "reference relationship"),
      geometry: { ...curve, connect: true },
      presentation: presentation(tokens[index % tokens.length], `${styles[index % styles.length]} curve ${index + 1} is distinguished by line style and label.`, { lineStyle: styles[index % styles.length] }),
    })),
    { id: "reading-note", kind: "annotation", geometry: { anchor: { x: -2.65, y: 4.4 }, content: text(plain(brief.title_latex).slice(0, 88)) }, presentation: presentation("visual-ink", "A written reading cue names the visual's mathematical relationship.") },
  ];
  return base(brief, id, "cartesian-2d", { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false }, { xMin: -3.2, xMax: 4.2, yMin: -4.8, yMax: 5.2, aspectRatio: 1.72, padding: 0.05 }, { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text("input"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: true },
    { id: "y-axis", orientation: "y", label: text("output or local rate"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: true },
  ] }, layers);
}

function diagramSpec(brief, id) {
  const phrases = plain(brief.caption_latex).split(/(?<=[.;:])\s+/).filter(Boolean);
  const labels = (phrases.length >= 3 ? phrases.slice(0, 3) : [plain(brief.title_latex), plain(brief.learning_purpose).slice(0, 90), plain(brief.reading_guide_latex).slice(0, 90)]).map((value) => value.slice(0, 96));
  const anchors = [{ x: 1.6, y: 5.1 }, { x: 5, y: 3.5 }, { x: 8.4, y: 1.9 }];
  const layers = [
    { id: "step-one", kind: "annotation", geometry: { anchor: anchors[0], content: text(labels[0]) }, presentation: presentation("visual-primary", "First labeled stage in the upper left.") },
    { id: "flow-one", kind: "direction-arrow", geometry: { start: { x: 2.6, y: 4.6 }, end: { x: 4.2, y: 3.8 } }, presentation: presentation("visual-guide", "Solid arrow connects the first and second stages.") },
    { id: "step-two", kind: "annotation", geometry: { anchor: anchors[1], content: text(labels[1]) }, presentation: presentation("visual-secondary", "Second labeled stage in the center.") },
    { id: "flow-two", kind: "direction-arrow", geometry: { start: { x: 5.8, y: 3.1 }, end: { x: 7.5, y: 2.3 } }, presentation: presentation("visual-guide", "Dashed arrow connects the second and third stages.", { lineStyle: "dashed" }) },
    { id: "step-three", kind: "annotation", geometry: { anchor: anchors[2], content: text(labels[2]) }, presentation: presentation("visual-emphasis", "Third labeled stage in the lower right.") },
  ];
  return base(brief, id, "geometry-2d", { type: "diagram-2d", variables: ["horizontal", "vertical"], unitsRequired: false }, { xMin: 0, xMax: 10, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.06 }, { mode: "none", reason: "This is a labeled instructional relationship diagram rather than a numeric graph." }, layers);
}

const specs = briefs.visuals.map((brief) => {
  const id = `${requested}-${brief.visual_id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  if (brief.recommended_renderer === "bettergrades-interactive-2d") return interactiveSpec(brief, id);
  if (brief.proposed_visual_kind === "cartesian-2d") return cartesianSpec(brief, id);
  return diagramSpec(brief, id);
});

const expectedInteractive = requested === "unit-2a" ? 1 : 6;
if (new Set(specs.map((spec) => spec.id)).size !== specs.length) throw new Error(`${requested} visual IDs are not unique.`);
if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== expectedInteractive) throw new Error(`${requested} renderer inventory differs from the approved plan.`);
const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: `${requested}-calculus-visuals`, migrationOnly: false, visuals: specs }, null, 2)}\n`;
const outputPath = resolve(directory, "visual-specs.v1.json");
if (checkOnly) {
  if ((await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n") !== output) throw new Error(`${requested} visual specs are stale.`);
} else await writeFile(outputPath, output);
console.log(`${checkOnly ? "Verified" : "Authored"} ${specs.length} ${requested} VisualSpec v1 records (${expectedInteractive} interactive, ${specs.length - expectedInteractive} static-first).`);
