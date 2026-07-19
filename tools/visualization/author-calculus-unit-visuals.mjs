import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1] ?? "unit-2a";
const checkOnly = process.argv.includes("--check");
if (requested === "unit-3b") {
  const { authorUnit3bVisuals } = await import("./unit-3b-visual-definitions.mjs");
  await authorUnit3bVisuals({ root, checkOnly });
  process.exit(0);
}
if (requested === "unit-3a") {
  const { authorUnit3aVisuals } = await import("./unit-3a-visual-definitions.mjs");
  await authorUnit3aVisuals({ root, checkOnly });
  process.exit(0);
}
if (requested === "unit-2b") {
  const { authorUnit2bVisuals } = await import("./unit-2b-visual-definitions.mjs");
  await authorUnit2bVisuals({ root, checkOnly });
  process.exit(0);
}
const directory = resolve(root, "content/calculus/units", requested);
const briefs = JSON.parse(await readFile(resolve(directory, "visual-authoring-briefs.v3.json"), "utf8"));

function plain(value) {
  return String(value)
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\^\{?2\}?/g, "²")
    .replace(/\^\{?3\}?/g, "³")
    .replace(/\^\{?4\}?/g, "⁴")
    .replace(/\^\{?5\}?/g, "⁵")
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
  "2A-V02": [samples((x) => x * x - 2 * x, -1, 4), samples((x) => 2 * x - 4, -1, 4)],
  "2A-V04": [samples((x) => x * x - 2 * x, -1.5, 4), samples((x) => 2 * x - 4, -1.5, 4), samples((x) => -0.5 * x + 1, -1.5, 4)],
  "2A-E02": [samples((x) => x * x, -3, 3), samples((x) => 2 * x, -3, 3)],
  "2A-V06": [samples((x) => x * x, 0, 4), samples((x) => 3 * x - 2, 0, 4), samples((x) => 5 * x - 6, 0, 4), samples((x) => 4 * x - 4, 0, 4)],
  "2A-V07": [samples((x) => x * x, -2, 2), samples((x) => Math.abs(x), -2, 2), samples((x) => Math.cbrt(x * x), -2, 2), samples(Math.cbrt, -2, 2)],
  "2A-V08": [samples((x) => x * x, -2, 2), samples((x) => 2 * x, -2, 2), samples((x) => x ** 3, -2, 2), samples((x) => 3 * x * x, -2, 2)],
  "2A-V12": [samples(Math.sin, -Math.PI, Math.PI), samples(Math.cos, -Math.PI, Math.PI), samples((x) => -Math.sin(x), -Math.PI, Math.PI)],
  "2A-V13": [samples(Math.exp, -2.4, 1.6), samples((x) => x + 1, -2.4, 1.6)],
  "2A-V14": [samples(Math.exp, -2, 1.5), samples(Math.log, 0.08, 4), samples((x) => x, -2, 4)],
  "2A-V17": [samples((x) => Math.sqrt(Math.max(0, 25 - x * x)), -5, 5), samples((x) => -Math.sqrt(Math.max(0, 25 - x * x)), -5, 5), samples((x) => -0.75 * x + 6.25, -1, 6)],
  "2A-V18": [samples((x) => x * x, 0, 3), samples(Math.sqrt, 0, 6), samples((x) => x, 0, 6), samples((x) => 4 * x - 4, 0, 3), samples((x) => 0.25 * x + 1, 0, 6)],
  "2A-V20": [samples((x) => x ** 3 - 3 * x, -2.5, 2.5), samples((x) => 3 * x * x - 3, -2.5, 2.5), samples((x) => 6 * x, -2.5, 2.5)],
  "2A-V22": [samples((x) => Math.abs(x), -0.8, 0.8), samples((x) => x * x, -0.8, 0.8)],
  "2A-V23": [{ xValues: [-3, -0.03], yValues: [-1, -1] }, { xValues: [0.03, 3], yValues: [1, 1] }, samples((x) => Math.tanh(1.4 * x) + 0.18 * Math.sin(5 * x), -3, 3), { xValues: [-3, 3], yValues: [0, 0] }],
  "2A-V25": [samples((x) => Math.sqrt(Math.max(0, 25 - x * x)), -5, 5), samples((x) => -Math.sqrt(Math.max(0, 25 - x * x)), -5, 5)],
};

const cartesianLabels = {
  "2A-V02": ["curve f(x) = x^2 - 2x", "tangent y = 2x - 4"],
  "2A-V04": ["curve f", "tangent slope 2", "normal slope -1/2"],
  "2A-E02": ["f(x) = x^2", "f'(x) = 2x"],
  "2A-V06": ["f(x) = x^2", "backward slope 3", "forward slope 5", "central slope 4"],
  "2A-V07": ["smooth: x^2", "corner: |x|", "cusp: |x|^(2/3)", "vertical tangent: x^(1/3)"],
  "2A-V08": ["x^2", "derivative 2x", "x^3", "derivative 3x^2"],
  "2A-V12": ["sin x", "cos x = derivative of sin", "-sin x = derivative of cos"],
  "2A-V13": ["y = e^x", "tangent y = x + 1"],
  "2A-V14": ["y = e^x", "y = ln x", "reflection line y = x"],
  "2A-V17": ["circle upper branch", "circle lower branch", "tangent slope -3/4"],
  "2A-V18": ["y = x^2, x >= 0", "y = sqrt(x)", "reflection y = x", "slope 4", "slope 1/4"],
  "2A-V20": ["f(x) = x^3 - 3x", "f'(x) = 3x^2 - 3", "f''(x) = 6x"],
  "2A-V22": ["input scale |h|", "remainder h^2"],
  "2A-V23": ["forbidden jump: left", "forbidden jump: right", "rough curve with intermediate values", "representative intermediate slope 0"],
  "2A-V25": ["circle upper branch", "circle lower branch"],
};

const cartesianViewports = {
  "2A-V02": { xMin: -1.2, xMax: 4.2, yMin: -3, yMax: 7 },
  "2A-V04": { xMin: -1.5, xMax: 4.5, yMin: -5, yMax: 6 },
  "2A-E02": { xMin: -3.2, xMax: 3.2, yMin: -6.5, yMax: 9.5 },
  "2A-V06": { xMin: 0, xMax: 4.1, yMin: -2, yMax: 17 },
  "2A-V07": { xMin: -2.2, xMax: 2.2, yMin: -2, yMax: 4.5 },
  "2A-V08": { xMin: -2.2, xMax: 2.2, yMin: -8.5, yMax: 12.5 },
  "2A-V12": { xMin: -3.3, xMax: 3.3, yMin: -1.4, yMax: 1.4 },
  "2A-V13": { xMin: -2.5, xMax: 1.8, yMin: -1.5, yMax: 5.5 },
  "2A-V14": { xMin: -2.2, xMax: 4.2, yMin: -2.2, yMax: 4.2 },
  "2A-V17": { xMin: -5.5, xMax: 6, yMin: -5.5, yMax: 5.5 },
  "2A-V18": { xMin: -0.4, xMax: 6.2, yMin: -0.4, yMax: 6.2 },
  "2A-V20": { xMin: -2.6, xMax: 2.6, yMin: -11, yMax: 11 },
  "2A-V22": { xMin: -0.85, xMax: 0.85, yMin: -0.05, yMax: 0.85 },
  "2A-V23": { xMin: -3.2, xMax: 3.2, yMin: -1.7, yMax: 1.7 },
  "2A-V25": { xMin: -5.5, xMax: 5.7, yMin: -5.5, yMax: 5.5 },
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
  const labels = cartesianLabels[brief.visual_id] ?? [];
  const layers = [
    ...curves.map((curve, index) => ({
      id: `relationship-${index + 1}`,
      kind: "sampled-series",
      label: text(labels[index] ?? (index === 0 ? "original relationship" : index === 1 ? "compared relationship" : "reference relationship")),
      geometry: { ...curve, connect: true },
      presentation: presentation(tokens[index % tokens.length], `${styles[index % styles.length]} curve ${index + 1} is distinguished by line style and label.`, { lineStyle: styles[index % styles.length] }),
    })),
    ...cartesianExtraLayers(brief.visual_id),
  ];
  const viewport = cartesianViewports[brief.visual_id] ?? { xMin: -3.2, xMax: 4.2, yMin: -4.8, yMax: 5.2 };
  const ySpan = viewport.yMax - viewport.yMin;
  return base(brief, id, "cartesian-2d", { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false }, { ...viewport, aspectRatio: 1.72, padding: 0.05 }, { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text(brief.visual_id === "2A-V22" ? "input step h" : "input x"), scale: "linear", tickMode: "automatic", showGrid: true },
    { id: "y-axis", orientation: "y", label: text("function value or slope"), scale: "linear", tickMode: "fixed-step", tickStep: ySpan > 12 ? 2 : ySpan < 3 ? 0.25 : 1, showGrid: true },
  ] }, layers);
}

function pointLayer(id, x, y, label, token = "visual-ink", markerShape = "circle") {
  return { id, kind: "closed-point", label: text(label), geometry: { position: { x, y } }, presentation: presentation(token, `Filled ${markerShape} marks ${label}.`, { fillToken: token, markerShape }) };
}

function cartesianExtraLayers(visualId) {
  const points = {
    "2A-V02": [pointLayer("contact-point", 2, 0, "contact at (2, 0)")],
    "2A-V04": [pointLayer("shared-point", 2, 0, "shared point (2, 0)")],
    "2A-V06": [pointLayer("data-left", 1, 1, "data (1, 1)"), pointLayer("data-center", 2, 4, "target (2, 4)", "visual-emphasis", "diamond"), pointLayer("data-right", 3, 9, "data (3, 9)")],
    "2A-V07": [pointLayer("origin", 0, 0, "marked input x = 0")],
    "2A-V13": [pointLayer("exp-contact", 0, 1, "height and slope both 1")],
    "2A-V14": [pointLayer("exp-inverse-point", 1, Number(Math.E.toFixed(6)), "(1, e)"), pointLayer("log-inverse-point", Number(Math.E.toFixed(6)), 1, "(e, 1)", "visual-emphasis", "diamond")],
    "2A-V17": [pointLayer("implicit-point", 3, 4, "point (3, 4)")],
    "2A-V18": [pointLayer("function-point", 2, 4, "(2, 4)"), pointLayer("inverse-point", 4, 2, "(4, 2)", "visual-emphasis", "diamond")],
    "2A-V22": [pointLayer("remainder-half", 0.5, 0.25, "h = 0.5"), pointLayer("remainder-quarter", 0.25, 0.0625, "h = 0.25", "visual-secondary"), pointLayer("remainder-tenth", 0.1, 0.01, "h = 0.1", "visual-emphasis")],
    "2A-V23": [
      { id: "jump-left-open", kind: "open-point", label: text("missing connection at slope -1"), geometry: { position: { x: 0, y: -1 } }, presentation: presentation("visual-primary", "Open circle ends the left step at slope -1.", { markerShape: "circle" }) },
      pointLayer("jump-right-closed", 0, 1, "right step begins at slope 1", "visual-secondary", "diamond"),
    ],
    "2A-V25": [pointLayer("good-local-point", 3, 4, "local graph near (3, 4)"), pointLayer("failure-point", 5, 0, "vertical tangent at (5, 0)", "visual-emphasis", "diamond")],
  };
  const extras = [...(points[visualId] ?? [])];
  if (visualId === "2A-V02") {
    extras.unshift({ id: "zoom-neighborhood", kind: "polygon", geometry: { points: [{ x: 1.7, y: -0.55 }, { x: 2.3, y: -0.55 }, { x: 2.3, y: 0.7 }, { x: 1.7, y: 0.7 }], closed: true }, presentation: presentation("visual-emphasis", "Patterned rectangle marks the neighborhood to magnify around the contact point.", { fillToken: "visual-emphasis", pattern: "crosshatch" }) });
    extras.push({ id: "zoom-note", kind: "annotation", geometry: { anchor: { x: 2.35, y: 0.75 }, content: text("Magnify this neighborhood: curve and tangent nearly overlap") }, presentation: presentation("visual-emphasis", "Written zoom cue explains local linearity.") });
  }
  if (visualId === "2A-V25") {
    extras.unshift({ id: "local-strip", kind: "polygon", geometry: { points: [{ x: 2.65, y: 3.35 }, { x: 3.35, y: 3.35 }, { x: 3.35, y: 4.65 }, { x: 2.65, y: 4.65 }], closed: true }, presentation: presentation("visual-success", "Crosshatched neighborhood isolates the upper local branch.", { fillToken: "visual-success", pattern: "crosshatch" }) });
    extras.push({ id: "vertical-tangent", kind: "segment", label: text("vertical tangent x = 5"), geometry: { start: { x: 5, y: -5 }, end: { x: 5, y: 5 } }, presentation: presentation("visual-emphasis", "Dashed vertical line marks failure to solve locally for y as a function of x.", { lineStyle: "dashed" }) });
  }
  return extras;
}

const diagramIds = new Set(["2A-V01", "2A-V03", "2A-V05", "2A-V09", "2A-V10", "2A-V11", "2A-V15", "2A-V16", "2A-V19", "2A-V21", "2A-V24"]);

function diagramDefinition(brief) {
  const definitions = {
    "2A-V01": {
      nodes: [
        ["quantity", 0.6, 4.8, 4, 1.45, "Original quantity: f(x)", "visual-primary"],
        ["average", 7.4, 4.8, 4, 1.45, "Average rate: change in f / change in x", "visual-secondary"],
        ["tangent", 0.6, 1.0, 4, 1.45, "Tangent slope: local line", "visual-success"],
        ["instant", 7.4, 1.0, 4, 1.45, "Instantaneous rate: f'(x)", "visual-emphasis"],
      ],
      arrows: [
        ["compare", 4.65, 5.52, 7.25, 5.52, "compare nearby inputs"],
        ["shrink", 9.4, 4.65, 9.4, 2.55, "shrink the interval"],
        ["interpret", 7.25, 1.72, 4.75, 1.72, "interpret geometrically"],
        ["return", 2.6, 2.55, 2.6, 4.65, "read from the graph"],
      ],
    },
    "2A-V03": {
      nodes: [
        ["shift", 0.3, 5.0, 3.35, 1.35, "1. Shift input: f(a + h)", "visual-primary"],
        ["subtract", 4.3, 5.0, 3.35, 1.35, "2. Subtract complete outputs", "visual-secondary"],
        ["quotient", 8.3, 5.0, 3.35, 1.35, "3. Divide by input change h", "visual-emphasis"],
        ["factor", 8.3, 1.2, 3.35, 1.35, "4. Factor the numerator", "visual-primary"],
        ["cancel", 4.3, 1.2, 3.35, 1.35, "5. Cancel only while h is not 0", "visual-secondary"],
        ["limit", 0.3, 1.2, 3.35, 1.35, "6. Then take the limit h to 0", "visual-success"],
      ],
      arrows: [["a1", 3.7, 5.68, 4.15, 5.68], ["a2", 7.7, 5.68, 8.15, 5.68], ["a3", 10, 4.85, 10, 2.7], ["a4", 8.15, 1.88, 7.8, 1.88], ["a5", 4.15, 1.88, 3.8, 1.88]],
    },
    "2A-V05": {
      nodes: [
        ["prime", 0.3, 5.0, 3.4, 1.35, "Prime notation: f'(x)", "visual-primary"],
        ["leibniz", 4.3, 5.0, 3.4, 1.35, "Leibniz notation: dy / dx", "visual-secondary"],
        ["operator", 8.3, 5.0, 3.4, 1.35, "Operator notation: d/dx of f", "visual-emphasis"],
        ["meaning", 3.3, 1.15, 5.4, 1.55, "One local rate: output units per input unit", "visual-success"],
      ],
      arrows: [["p", 2, 4.85, 4.45, 2.85], ["l", 6, 4.85, 6, 2.85], ["o", 10, 4.85, 7.55, 2.85]],
    },
    "2A-V09": {
      nodes: [
        ["area", 1.2, 1.2, 6.7, 3.6, "original area u v", "visual-primary"],
        ["width-strip", 7.9, 1.2, 1.25, 3.6, "v du", "visual-secondary"],
        ["height-strip", 1.2, 4.8, 6.7, 1.15, "u dv", "visual-emphasis"],
        ["corner", 7.9, 4.8, 1.25, 1.15, "du dv", "visual-guide"],
      ],
      arrows: [],
      labels: [["rule", 6, 0.55, "First-order change: d(uv) = u dv + v du"]],
    },
    "2A-V10": {
      nodes: [
        ["ratio", 4, 5.5, 4, 1.2, "Original ratio: u / v", "visual-primary"],
        ["numerator", 0.8, 3.1, 4.4, 1.35, "Numerator growth raises the ratio: v u'", "visual-success"],
        ["denominator", 6.8, 3.1, 4.4, 1.35, "Denominator growth lowers the ratio: -u v'", "visual-emphasis"],
        ["rule", 3, 0.75, 6, 1.35, "Quotient rule: (v u' - u v') / v^2", "visual-secondary"],
      ],
      arrows: [["r1", 5.1, 5.4, 3.1, 4.55], ["r2", 6.9, 5.4, 8.9, 4.55], ["r3", 3.1, 3, 4.65, 2.2], ["r4", 8.9, 3, 7.35, 2.2]],
    },
    "2A-V11": {
      nodes: [
        ["start", 3.9, 6, 4.2, 1.0, "Read the outermost operation", "visual-primary"],
        ["sum", 0.1, 3.5, 2.55, 1.25, "sum or difference", "visual-secondary"],
        ["product", 3.15, 3.5, 2.55, 1.25, "product", "visual-emphasis"],
        ["quotient", 6.3, 3.5, 2.55, 1.25, "quotient", "visual-success"],
        ["composition", 9.35, 3.5, 2.55, 1.25, "composition", "visual-primary"],
        ["repeat", 3.8, 0.7, 4.4, 1.2, "Apply that rule, then parse each inner piece again", "visual-guide"],
      ],
      arrows: [["s1", 5.4, 5.85, 1.4, 4.9], ["s2", 5.7, 5.85, 4.4, 4.9], ["s3", 6.3, 5.85, 7.55, 4.9], ["s4", 6.6, 5.85, 10.6, 4.9]],
    },
    "2A-V15": {
      nodes: [
        ["input", 0.3, 3.8, 2.7, 1.45, "input x", "visual-primary"],
        ["inner", 4.1, 3.8, 3.2, 1.45, "inner machine: u = g(x)", "visual-secondary"],
        ["outer", 8.5, 3.8, 3.2, 1.45, "outer machine: y = f(u)", "visual-emphasis"],
      ],
      arrows: [["inner-rate", 3.05, 4.52, 3.95, 4.52, "du / dx"], ["outer-rate", 7.35, 4.52, 8.35, 4.52, "dy / du"]],
      labels: [["formula", 6, 1.55, "dy/dx = (dy/du)(du/dx), evaluated at u = g(x)"]],
    },
    "2A-V16": {
      nodes: [
        ["square", 0.5, 0.7, 11, 6.2, "Outer layer: square", "visual-primary"],
        ["exponential", 1.5, 1.4, 9, 4.8, "Next layer: exponential", "visual-secondary"],
        ["sine", 2.5, 2.1, 7, 3.4, "Next layer: sine", "visual-emphasis"],
        ["polynomial", 3.5, 2.8, 5, 2.0, "Inner layer: x^2 + 1", "visual-success"],
      ],
      arrows: [],
      nodeLabelPositions: {
        square: [2.25, 6.5],
        exponential: [3.25, 5.8],
        sine: [4.25, 5.1],
        polynomial: [6, 3.8],
      },
      labels: [["order", 6, 0.35, "Differentiate from the outside inward; multiply each local rate"]],
    },
    "2A-V19": {
      nodes: [
        ["original", 1.2, 6.0, 9.6, 0.95, "1. Original product, quotient, powers, and radical", "visual-primary"],
        ["take-log", 1.2, 4.35, 9.6, 0.95, "2. Apply ln to both sides", "visual-secondary"],
        ["expand", 1.2, 2.7, 9.6, 0.95, "3. Expand: products become sums; powers become coefficients", "visual-emphasis"],
        ["differentiate", 1.2, 1.05, 9.6, 0.95, "4. Differentiate, solve for y', and substitute y back", "visual-success"],
      ],
      arrows: [["v1", 6, 5.9, 6, 5.4], ["v2", 6, 4.25, 6, 3.75], ["v3", 6, 2.6, 6, 2.1]],
    },
    "2A-V21": {
      nodes: [
        ["parse", 0.1, 4.7, 2.1, 1.35, "1. Parse structure", "visual-primary"],
        ["plan", 2.55, 4.7, 2.1, 1.35, "2. Name the rule plan", "visual-secondary"],
        ["differentiate", 5, 4.7, 2.1, 1.35, "3. Differentiate", "visual-emphasis"],
        ["simplify", 7.45, 4.7, 2.1, 1.35, "4. Simplify carefully", "visual-success"],
        ["check", 9.9, 4.7, 2.1, 1.35, "5. Check sign, units, domain", "visual-primary"],
      ],
      arrows: [["q1", 2.25, 5.38, 2.42, 5.38], ["q2", 4.7, 5.38, 4.87, 5.38], ["q3", 7.15, 5.38, 7.32, 5.38], ["q4", 9.6, 5.38, 9.77, 5.38], ["repair", 10.9, 4.55, 1.2, 3.0, "If a check fails, repair the earliest wrong decision"]],
      labels: [["routine", 6, 1.5, "The calculation is the middle of a reliable solution, not the whole process"]],
    },
    "2A-V24": {
      nodes: [
        ["input-step", 0.3, 3.8, 2.8, 1.45, "input perturbation h", "visual-primary"],
        ["after-g", 4.35, 3.8, 3.3, 1.45, "after g: approximately g'(a) h", "visual-secondary"],
        ["after-f", 8.7, 3.8, 3.0, 1.45, "after f: approximately f'(g(a)) g'(a) h", "visual-emphasis"],
      ],
      arrows: [["g-scale", 3.15, 4.52, 4.2, 4.52, "scale by g'(a)"], ["f-scale", 7.7, 4.52, 8.55, 4.52, "scale by f'(g(a))"]],
      labels: [["composition", 6, 1.55, "Total local scale: Df(g(a)) Dg(a), in composition order"]],
    },
  };
  if (definitions[brief.visual_id]) return definitions[brief.visual_id];
  const sentences = plain(brief.reading_guide_latex).split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4);
  while (sentences.length < 4) sentences.push(plain(brief.caption_latex));
  return {
    nodes: [
      ["one", 0.7, 4.6, 4.8, 1.45, sentences[0], "visual-primary"],
      ["two", 6.5, 4.6, 4.8, 1.45, sentences[1], "visual-secondary"],
      ["three", 0.7, 1.2, 4.8, 1.45, sentences[2], "visual-emphasis"],
      ["four", 6.5, 1.2, 4.8, 1.45, sentences[3], "visual-success"],
    ],
    arrows: [["one-two", 5.6, 5.32, 6.35, 5.32], ["two-four", 8.9, 4.45, 8.9, 2.8], ["four-three", 6.35, 1.92, 5.65, 1.92]],
  };
}

function diagramSpec(brief, id) {
  const definition = diagramDefinition(brief);
  const boxes = definition.nodes.map(([nodeId, x, y, width, height, label, token], index) => ({
    id: `${nodeId}-box`,
    kind: "polygon",
    zIndex: index,
    geometry: { points: [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }], closed: true },
    presentation: presentation(token, `Labeled box: ${plain(label)}.`, { fillToken: token, pattern: index % 2 ? "dots" : "diagonal" }),
  }));
  const arrows = definition.arrows.map(([arrowId, x1, y1, x2, y2, label], index) => ({
    id: `${arrowId}-arrow`,
    kind: "direction-arrow",
    zIndex: 20 + index,
    geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
    presentation: presentation("visual-guide", label ? `${label}.` : "Arrow preserves the instructional reading order.", { lineStyle: index % 2 ? "dashed" : "solid" }),
  }));
  const nodeLabels = definition.nodes.map(([nodeId, x, y, width, height, label]) => ({
    id: `${nodeId}-label`,
    kind: "label",
    zIndex: 60,
    geometry: { position: definition.nodeLabelPositions?.[nodeId]
      ? { x: definition.nodeLabelPositions[nodeId][0], y: definition.nodeLabelPositions[nodeId][1] }
      : { x: x + width / 2, y: y + height / 2 }, content: text(label) },
    presentation: presentation("visual-ink", `Written label identifies ${plain(label)}.`),
  }));
  const arrowLabels = definition.arrows.filter((entry) => entry[5]).map(([arrowId, x1, y1, x2, y2, label]) => ({
    id: `${arrowId}-label`,
    kind: "label",
    zIndex: 70,
    geometry: { position: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 + 0.3 }, content: text(label) },
    presentation: presentation("visual-ink", `Arrow label: ${plain(label)}.`),
  }));
  const supportingLabels = (definition.labels ?? []).map(([labelId, x, y, label]) => ({
    id: `${labelId}-label`,
    kind: "label",
    zIndex: 80,
    geometry: { position: { x, y }, content: text(label) },
    presentation: presentation("visual-ink", `Written conclusion: ${plain(label)}.`),
  }));
  return base(brief, id, "geometry-2d", { type: "diagram-2d", variables: ["horizontal", "vertical"], unitsRequired: false }, { xMin: 0, xMax: 12, yMin: 0, yMax: 7.5, aspectRatio: 1.72, padding: 0.04 }, { mode: "none", reason: "This is a labeled instructional relationship diagram rather than a numeric graph." }, [...boxes, ...arrows, ...nodeLabels, ...arrowLabels, ...supportingLabels]);
}

const specs = briefs.visuals.map((brief) => {
  const id = `${requested}-${brief.visual_id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  if (brief.recommended_renderer === "bettergrades-interactive-2d") return interactiveSpec(brief, id);
  if (brief.proposed_visual_kind === "cartesian-2d" && !diagramIds.has(brief.visual_id)) return cartesianSpec(brief, id);
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
