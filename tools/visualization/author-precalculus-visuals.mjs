import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const checkOnly = process.argv.includes("--check");
const requestedUnit = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1];
const course = JSON.parse(await readFile(resolve(root, "content/precalculus/course.public.json"), "utf8"));
const unitSequences = requestedUnit
  ? [Number(requestedUnit.replace(/^unit-/i, ""))]
  : course.units.map((unit) => unit.sequence);

const rich = (text) => ({ segments: [{ kind: "text", text: String(text) }] });
const style = (token, cue, extra = {}) => ({
  strokeToken: token,
  lineStyle: "solid",
  markerShape: "none",
  pattern: "none",
  colorIndependentCue: cue,
  ...extra,
});
const performance = {
  maxSamples: 256,
  maxAdaptiveDepth: 4,
  maxAstNodes: 32,
  maxAstDepth: 8,
  maxOperationsPerEvaluation: 64,
  maxPayloadBytes: 65_536,
  maxAnimationFps: 1,
  activation: "none",
};

function compact(value, length = 74) {
  const clean = String(value).replace(/\s+/g, " ").trim();
  return clean.length <= length ? clean : `${clean.slice(0, length - 1).trimEnd()}…`;
}

function wrap(value, length = 27, limit = 4) {
  const words = String(value).replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = `${line} ${word}`.trim();
    if (next.length > length && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length <= limit) return lines;
  return [...lines.slice(0, limit - 1), `${lines.slice(limit - 1).join(" ").slice(0, length - 1)}…`];
}

const label = (id, x, y, content, token = "visual-ink", zIndex = 40) => ({
  id,
  kind: "label",
  zIndex,
  geometry: { position: { x, y }, content: rich(content) },
  presentation: style(token, `Label: ${content}.`),
});
const segment = (id, x1, y1, x2, y2, cue, token = "visual-guide", lineStyle = "solid") => ({
  id,
  kind: "segment",
  zIndex: 10,
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, cue, { lineStyle }),
});
const arrow = (id, x1, y1, x2, y2, cue, token = "visual-guide") => ({
  id,
  kind: "direction-arrow",
  zIndex: 12,
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, cue),
});
const card = (id, x, y, width, height, cue, token = "visual-secondary", pattern = "dots") => ({
  id,
  kind: "polygon",
  zIndex: 5,
  geometry: {
    points: [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }],
    closed: true,
  },
  presentation: style(token, cue, { fillToken: token, pattern }),
});
const point = (id, x, y, content, token = "visual-primary", markerShape = "circle") => ({
  id,
  kind: "closed-point",
  zIndex: 30,
  label: rich(content),
  geometry: { position: { x, y } },
  presentation: style(token, `Filled ${markerShape} marks ${content}.`, { fillToken: token, markerShape }),
});
const openPoint = (id, x, y, content, token = "visual-emphasis") => ({
  id,
  kind: "open-point",
  zIndex: 30,
  label: rich(content),
  geometry: { position: { x, y } },
  presentation: style(token, `Open circle marks ${content}.`, { markerShape: "circle" }),
});
const withoutCanvasLabel = (layer) => {
  const copy = { ...layer };
  delete copy.label;
  return copy;
};
const series = (id, fn, min, max, content, token = "visual-primary", lineStyle = "solid", count = 81) => {
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
  return {
    id,
    kind: "sampled-series",
    zIndex: 20,
    label: rich(content),
    geometry: { xValues, yValues, connect: true },
    presentation: style(token, `${content}; ${lineStyle} curve.`, { lineStyle }),
  };
};
const parametricSeries = (id, xFn, yFn, min, max, content, token = "visual-primary", lineStyle = "solid", count = 121) => {
  const xValues = [];
  const yValues = [];
  for (let index = 0; index < count; index += 1) {
    const parameter = min + ((max - min) * index) / (count - 1);
    const x = xFn(parameter);
    const y = yFn(parameter);
    if (Number.isFinite(x) && Number.isFinite(y)) {
      xValues.push(Number(x.toFixed(6)));
      yValues.push(Number(y.toFixed(6)));
    }
  }
  return {
    id,
    kind: "sampled-series",
    zIndex: 20,
    label: rich(content),
    geometry: { xValues, yValues, connect: true },
    presentation: style(token, `${content}; ${lineStyle} curve.`, { lineStyle }),
  };
};

function addWrapped(layers, prefix, content, x, top, length = 27, limit = 4, spacing = 0.45, token = "visual-ink") {
  for (const [index, line] of wrap(content, length, limit).entries()) {
    layers.push(label(`${prefix}-${index + 1}`, x, top - index * spacing, line, token));
  }
}

function diagram(layers, yMax = 7) {
  return {
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["horizontal", "vertical"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax, aspectRatio: 1.72, padding: 0.045 },
    axes: { mode: "none", reason: "The labeled mathematical structure, arrows, and spatial grouping carry the meaning." },
    panels: [],
    layers,
    controls: [],
  };
}

function graph(viewport, layers, xLabel = "input x", yLabel = "output y") {
  return {
    kind: "cartesian-2d",
    coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { ...viewport, aspectRatio: 1.72, padding: 0.065 },
    axes: {
      mode: "explicit",
      axes: [
        { id: "x-axis", orientation: "x", label: rich(xLabel), scale: "linear", tickMode: "automatic", showGrid: true },
        { id: "y-axis", orientation: "y", label: rich(yLabel), scale: "linear", tickMode: "automatic", showGrid: true },
      ],
    },
    panels: [],
    layers,
    controls: [],
  };
}

function base(brief, scene) {
  const caption = brief.caption ?? brief.description;
  const readingOrder = scene.layers.map((layer) => layer.id);
  const requiredCapabilities = new Set(["static-fallback"]);
  requiredCapabilities.add(scene.kind === "cartesian-2d" ? "cartesian-axes" : "geometry-primitives");
  if (scene.layers.some((layer) => layer.kind === "sampled-series")) requiredCapabilities.add("data-series");
  if (scene.layers.some((layer) => layer.kind === "open-point" || layer.kind === "closed-point")) requiredCapabilities.add("open-closed-points");
  if (scene.layers.some((layer) => layer.kind === "label" || layer.kind === "annotation")) requiredCapabilities.add("annotations");
  return {
    schemaVersion: 1,
    id: brief.id,
    kind: scene.kind,
    title: rich(`${brief.lessonTitle} · ${brief.title}`),
    caption: rich(caption),
    learningPurpose: `Use the mathematical objects in this figure to support the lesson outcome: ${brief.lessonOutcome}`,
    longDescription: `${caption} The figure uses concrete points, curves, arrows, intervals, or matrix structure instead of relying on color alone.`,
    coordinateSpace: scene.coordinateSpace,
    viewport: scene.viewport,
    axes: scene.axes,
    panels: scene.panels,
    layers: scene.layers,
    controls: scene.controls,
    accessibility: {
      ariaLabel: `${brief.title}. ${caption}`,
      summary: caption,
      readingOrder,
      colorIndependentDescription: "Labels, point shapes, line styles, arrows, and position carry the mathematical meaning; color is supplementary.",
      controlInstructions: [],
      reducedMotion: "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: {
      representation: "generated-svg",
      caption: rich(caption),
      grayscaleSafe: true,
      pageBreak: "avoid",
      widthInches: 7.1,
    },
    performance,
    provenance: {
      route: brief.route,
      sourceFile: `content/precalculus/units/unit-${brief.unitSequence}/visual-specs.v1.json`,
      authoringId: brief.id,
      visibility: "public",
    },
    requiredCapabilities: [...requiredCapabilities],
    preferredRenderer: "prefer-static",
  };
}

function readinessScene(brief) {
  const layers = [
    label("figure-kicker", 0.55, 6.5, "WORK THE STRUCTURE, THEN CHECK THE ORIGINAL", "visual-primary"),
    card("given", 0.55, 3.05, 2.35, 2.55, "The original problem is the source of every restriction.", "visual-secondary", "dots"),
    card("structure", 3.5, 3.05, 2.35, 2.55, "Classify the algebraic family and expose its structure.", "visual-emphasis", "diagonal"),
    card("solve", 6.45, 3.05, 2.35, 2.55, "Use valid transformations and record candidates.", "visual-secondary", "crosshatch"),
    card("check", 9.4, 3.05, 2.05, 2.55, "Check the original statement and its domain.", "visual-primary", "diagonal"),
    arrow("a", 2.95, 4.3, 3.4, 4.3, "Move from the given statement to its structure."),
    arrow("b", 5.9, 4.3, 6.35, 4.3, "Move from structure to candidate solutions."),
    arrow("c", 8.85, 4.3, 9.3, 4.3, "Return candidates to the original statement."),
    label("given-heading", 0.85, 5.15, "01 · GIVEN"),
    label("structure-heading", 3.8, 5.15, "02 · STRUCTURE"),
    label("solve-heading", 6.75, 5.15, "03 · SOLVE"),
    label("check-heading", 9.7, 5.15, "04 · VERIFY"),
  ];
  addWrapped(layers, "problem", compact(brief.anchorProblem, 80), 0.85, 4.55, 24, 3);
  addWrapped(layers, "conclusion", compact(brief.anchorConclusion, 80), 9.7, 4.55, 19, 4);
  addWrapped(layers, "meaning", brief.anchorInterpretation, 0.65, 1.85, 86, 2, 0.48, "visual-ink");
  return diagram(layers);
}

function mappingScene(brief) {
  const layers = [
    label("title", 0.55, 6.45, "EACH INPUT HAS ONE OUTGOING ARROW", "visual-primary"),
    label("inputs", 2.15, 5.72, "INPUTS"),
    label("outputs", 8.65, 5.72, "OUTPUTS"),
    segment("input-spine", 2.4, 1.25, 2.4, 5.25, "Inputs are listed once.", "visual-guide", "dashed"),
    segment("output-spine", 8.9, 1.25, 8.9, 5.25, "Outputs may receive more than one arrow.", "visual-guide", "dashed"),
  ];
  const inputs = [0, 1, 2, 3];
  const outputs = [3, 5, 5, 8];
  for (const [index, input] of inputs.entries()) {
    const y = 4.9 - index * 1.05;
    layers.push(withoutCanvasLabel(point(`input-${index}`, 2.4, y, `input ${input}`, "visual-secondary", "square")));
    layers.push(label(`input-label-${index}`, 1.7, y, String(input)));
  }
  for (const [index, output] of [3, 5, 8].entries()) {
    const y = 4.65 - index * 1.35;
    layers.push(withoutCanvasLabel(point(`output-${index}`, 8.9, y, `output ${output}`, "visual-primary", "circle")));
    layers.push(label(`output-label-${index}`, 9.45, y, String(output)));
  }
  const outputY = new Map([[3, 4.65], [5, 3.3], [8, 1.95]]);
  for (const [index, output] of outputs.entries()) {
    layers.push(arrow(`mapping-${index}`, 2.75, 4.9 - index * 1.05, 8.55, outputY.get(output), `Input ${inputs[index]} maps to output ${output}.`, index === 2 ? "visual-emphasis" : "visual-guide"));
  }
  layers.push(label("repeat-note", 5.7, 0.75, "Two inputs may share output 5; the relation is still a function."));
  return diagram(layers);
}

function functionScene(brief) {
  const layers = [
    series("function", (x) => x * x - 1, -3, 3, "f(x) = x² − 1", "visual-primary"),
    point("left-point", -2, 3, "input -2 gives output 3", "visual-secondary", "square"),
    point("vertex", 0, -1, "minimum output -1", "visual-emphasis", "diamond"),
    point("right-point", 2, 3, "input 2 gives output 3", "visual-secondary", "circle"),
    segment("domain-guide", -2, 3, 2, 3, "Repeated output 3 is allowed.", "visual-guide", "dashed"),
    label("reading", -2.75, 7.35, compact(brief.anchorProblem, 62), "visual-ink"),
    label("result", -2.75, 6.55, compact(brief.anchorConclusion, 62), "visual-primary"),
  ];
  return graph({ xMin: -3.4, xMax: 3.4, yMin: -2, yMax: 8 }, layers);
}

function transformationScene(brief) {
  const layers = [
    series("parent", (x) => x * x, -2.3, 2.3, "parent y = x²", "visual-guide", "dashed"),
    series("transformed", (x) => -2 * Math.abs(x - 3) + 5, -0.5, 6.5, "transformed y = −2|x−3|+5", "visual-primary"),
    point("parent-landmark", 0, 0, "parent landmark (0,0)", "visual-secondary", "circle"),
    point("new-landmark", 3, 5, "new vertex (3,5)", "visual-emphasis", "diamond"),
    arrow("landmark-map", 0.25, 0.35, 2.75, 4.65, "Track a landmark instead of guessing the shape.", "visual-guide"),
    label("inside", -2.7, 8.6, "Inside x−3 moves input locations right 3."),
    label("outside", -2.7, 7.8, "Outside −2 reflects and doubles output distance."),
  ];
  return graph({ xMin: -3.2, xMax: 7, yMin: -4, yMax: 9.5 }, layers);
}

function compositionScene() {
  const layers = [
    label("title", 0.55, 6.45, "ORDER MATTERS: THE INNER FUNCTION ACTS FIRST", "visual-primary"),
    card("input-card", 0.55, 2.65, 1.75, 2.25, "Original price.", "visual-secondary", "dots"),
    card("inner-card", 3.05, 2.65, 2.15, 2.25, "Coupon stage subtracts 20.", "visual-emphasis", "diagonal"),
    card("middle-card", 5.95, 2.65, 1.75, 2.25, "Intermediate price.", "visual-secondary", "crosshatch"),
    card("outer-card", 8.45, 2.65, 2.15, 2.25, "Tax stage multiplies by 1.06.", "visual-emphasis", "diagonal"),
    arrow("one", 2.35, 3.75, 2.95, 3.75, "Feed 100 to the coupon function."),
    arrow("two", 5.25, 3.75, 5.85, 3.75, "The coupon output is 80."),
    arrow("three", 7.75, 3.75, 8.35, 3.75, "Feed 80 to the tax function."),
    label("input", 1.15, 3.75, "$100"),
    label("inner", 3.55, 3.75, "d(p)=p−20"),
    label("middle", 6.55, 3.75, "$80"),
    label("outer", 8.85, 3.75, "t(q)=1.06q"),
    label("result", 4.0, 1.45, "t(d(100)) = 1.06(80) = $84.80", "visual-primary"),
    label("warning", 3.4, 0.7, "Reversing the stages gives $86, so the functions do not commute."),
  ];
  return diagram(layers);
}

function polynomialScene(brief) {
  const layers = [
    series("polynomial", (x) => x ** 3 - 4 * x, -2.7, 2.7, "P(x) = x³ − 4x", "visual-primary"),
    point("zero-left", -2, 0, "zero -2", "visual-emphasis", "diamond"),
    point("zero-center", 0, 0, "zero 0", "visual-emphasis", "square"),
    point("zero-right", 2, 0, "zero 2", "visual-emphasis", "circle"),
    label("factorization", -2.95, 8.6, "P(x)=x(x−2)(x+2): factors predict all three intercepts."),
    label("ends", -2.95, 7.75, "Positive cubic leading term: left end down, right end up."),
    label("lesson", -2.95, -8.3, compact(brief.anchorConclusion, 76), "visual-primary"),
  ];
  return graph({ xMin: -3.2, xMax: 3.2, yMin: -9, yMax: 9.5 }, layers);
}

function rationalScene() {
  const layers = [
    series("left-branch", (x) => (x + 1) / (x - 2), -5, 1.82, "left branch of (x+1)/(x−2)", "visual-primary"),
    series("right-branch", (x) => (x + 1) / (x - 2), 2.18, 7, "right branch of (x+1)/(x−2)", "visual-primary"),
    segment("vertical-asymptote", 2, -7, 2, 7, "Vertical asymptote x=2.", "visual-emphasis", "dashed"),
    segment("horizontal-asymptote", -5, 1, 7, 1, "Horizontal asymptote y=1.", "visual-guide", "dashed"),
    point("x-intercept", -1, 0, "x-intercept -1", "visual-secondary", "diamond"),
    point("y-intercept", 0, -0.5, "y-intercept -1/2", "visual-secondary", "square"),
    label("domain", -4.7, 6.3, "Original denominator excludes x=2.", "visual-ink"),
    label("structure", -4.7, 5.55, "Intercepts, signs, and asymptotes must agree.", "visual-primary"),
  ];
  return graph({ xMin: -5.3, xMax: 7.3, yMin: -7.5, yMax: 7.5 }, layers);
}

function exponentialScene(brief) {
  const logarithmLesson = brief.lessonSequence >= 9;
  if (logarithmLesson) {
    return graph({ xMin: -4.5, xMax: 9, yMin: -4.5, yMax: 9 }, [
      series("exponential", (x) => 2 ** x, -4, 2.65, "y=2^x", "visual-primary"),
      series("logarithm", (x) => Math.log2(x), 0.08, 6, "y=log₂(x)", "visual-secondary", "dashed"),
      segment("inverse-line", -4, -4, 6, 6, "Reflection line y=x.", "visual-guide", "dotted"),
      point("exp-point", 3, 8, "2³=8", "visual-emphasis", "diamond"),
      point("log-point", 8, 3, "log₂(8)=3", "visual-emphasis", "square"),
      label("inverse-note", -4.1, 5.8, "Exponentials and logarithms reverse input and output."),
    ], "x", "y");
  }
  return graph({ xMin: -2.5, xMax: 4.5, yMin: -1, yMax: 22 }, [
    series("exponential", (x) => 5 * 1.6 ** x, -2, 3, "multiplicative model 5(1.6)^x", "visual-primary"),
    series("linear", (x) => 5 + 3 * x, -1.65, 4, "additive model 5+3x", "visual-secondary", "dashed"),
    point("initial", 0, 5, "both models start at 5", "visual-emphasis", "diamond"),
    label("difference-note", -2.15, 20.3, "Equal steps: linear adds 3; exponential multiplies by 1.6."),
    label("lesson-note", -2.15, 18.6, compact(brief.anchorConclusion, 76), "visual-primary"),
  ]);
}

function systemsScene(brief) {
  if (brief.lessonSequence <= 3) {
    return graph({ xMin: -1, xMax: 7, yMin: -2, yMax: 10 }, [
      series("line-one", (x) => 2 * x + 1, -1, 4.5, "y=2x+1", "visual-primary"),
      series("line-two", (x) => -x + 7, -1, 7, "y=−x+7", "visual-secondary", "dashed"),
      point("intersection", 2, 5, "common solution (2,5)", "visual-emphasis", "diamond"),
      segment("x-guide", 2, 0, 2, 5, "The solution has x-coordinate 2.", "visual-guide", "dotted"),
      segment("y-guide", 0, 5, 2, 5, "The solution has y-coordinate 5.", "visual-guide", "dotted"),
      label("meaning", 3.6, 9.1, "One point satisfies both equations."),
    ]);
  }
  const layers = [
    label("title", 0.55, 6.45, "THE MATRIX RECORDS A SYSTEM WITHOUT LOSING ITS STRUCTURE", "visual-primary"),
    card("matrix", 0.7, 1.45, 4.1, 4.2, "Coefficient and constant array.", "visual-secondary", "dots"),
    card("operations", 5.35, 1.45, 2.2, 4.2, "Equivalent row operations.", "visual-emphasis", "diagonal"),
    card("meaning", 8.1, 1.45, 3.2, 4.2, "Read pivots and rows as equations.", "visual-primary", "crosshatch"),
    arrow("matrix-to-operations", 4.9, 3.55, 5.25, 3.55, "Apply a row operation."),
    arrow("operations-to-meaning", 7.65, 3.55, 8.0, 3.55, "Interpret the result."),
    label("matrix-title", 1.0, 5.15, "AUGMENTED MATRIX"),
    label("matrix-row-one", 1.15, 4.35, "[ 1   2   1 |  6 ]"),
    label("matrix-row-two", 1.15, 3.55, "[ 1  −1   1 |  2 ]"),
    label("matrix-row-three", 1.15, 2.75, "[ 1   1  −1 |  0 ]"),
    label("operation-one", 5.75, 4.45, "swap"),
    label("operation-two", 5.75, 3.55, "scale"),
    label("operation-three", 5.75, 2.65, "replace"),
    label("meaning-one", 8.45, 4.45, "pivot → leading variable"),
    label("meaning-two", 8.45, 3.55, "free column → parameter"),
    label("meaning-three", 8.45, 2.65, "[0 0 0 | c] → consistency"),
    label("answer", 3.8, 0.75, compact(brief.anchorConclusion, 80), "visual-primary"),
  ];
  return diagram(layers);
}

function angleAndCircleScene(brief) {
  const angle = [225, 60, 120, 135, 45, 300, 150, 30, 210, 240][(brief.lessonSequence - 1) % 10] * Math.PI / 180;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  const layers = [
    parametricSeries("unit-circle", Math.cos, Math.sin, 0, 2 * Math.PI, "unit circle x²+y²=1", "visual-guide", "solid"),
    parametricSeries("directed-arc", (t) => 0.72 * Math.cos(t), (t) => 0.72 * Math.sin(t), 0, angle, "directed arc records signed rotation", "visual-emphasis", "solid", 81),
    arrow("terminal-ray", 0, 0, x, y, "terminal ray from the origin", "visual-primary"),
    point("terminal-point", x, y, `terminal point (${x.toFixed(2)}, ${y.toFixed(2)})`, "visual-emphasis", "diamond"),
    segment("cosine-coordinate", x, 0, x, y, "vertical coordinate segment gives sine", "visual-secondary", "dashed"),
    segment("sine-coordinate", 0, 0, x, 0, "horizontal coordinate segment gives cosine", "visual-secondary", "dashed"),
    label("circle-title", -1.42, 1.37, compact(brief.title, 64), "visual-primary"),
    label("angle-label", 0.22, 0.28, `θ = ${Math.round(angle * 180 / Math.PI)}°`),
    label("meaning", -1.42, -1.35, compact(brief.anchorInterpretation, 76), "visual-ink"),
  ];
  return graph({ xMin: -1.55, xMax: 1.55, yMin: -1.55, yMax: 1.55 }, layers, "cos θ", "sin θ");
}

function periodicScene(brief) {
  const sequence = brief.lessonSequence;
  if (sequence === 7) {
    return graph({ xMin: -1.6, xMax: 1.6, yMin: -5, yMax: 5 }, [
      series("tangent", Math.tan, -1.4, 1.4, "y=tan(x)", "visual-primary"),
      segment("left-asymptote", -Math.PI / 2, -5, -Math.PI / 2, 5, "vertical asymptote x=−π/2", "visual-guide", "dashed"),
      segment("right-asymptote", Math.PI / 2, -5, Math.PI / 2, 5, "vertical asymptote x=π/2", "visual-guide", "dashed"),
      point("origin", 0, 0, "tangent crosses the origin", "visual-emphasis", "diamond"),
      label("title", -1.48, 4.4, compact(brief.title, 58), "visual-primary"),
    ], "angle x", "tan x");
  }
  if (sequence === 8) {
    return graph({ xMin: -Math.PI, xMax: Math.PI, yMin: -4, yMax: 4 }, [
      series("cosine", Math.cos, -Math.PI, Math.PI, "y=cos(x)", "visual-guide", "dashed"),
      series("secant-center", (x) => 1 / Math.cos(x), -1.35, 1.35, "y=sec(x)", "visual-primary"),
      segment("asymptote-left", -Math.PI / 2, -4, -Math.PI / 2, 4, "secant asymptote", "visual-emphasis", "dashed"),
      segment("asymptote-right", Math.PI / 2, -4, Math.PI / 2, 4, "secant asymptote", "visual-emphasis", "dashed"),
      label("title", -2.9, 3.5, compact(brief.title, 62), "visual-primary"),
    ], "angle x", "output");
  }
  if (sequence === 10) {
    return graph({ xMin: -1.2, xMax: 1.2, yMin: -1.9, yMax: 1.9 }, [
      series("arcsine", Math.asin, -1, 1, "y=arcsin(x) on its principal branch", "visual-primary"),
      segment("range-low", -1.1, -Math.PI / 2, 1.1, -Math.PI / 2, "lower branch boundary −π/2", "visual-guide", "dashed"),
      segment("range-high", -1.1, Math.PI / 2, 1.1, Math.PI / 2, "upper branch boundary π/2", "visual-guide", "dashed"),
      label("title", -1.08, 1.7, compact(brief.title, 60), "visual-primary"),
    ], "ratio x", "principal angle");
  }
  const amplitude = sequence >= 3 ? 2 : 1;
  const phase = sequence >= 5 ? Math.PI / 3 : 0;
  const midline = sequence >= 3 ? 1 : 0;
  return graph({ xMin: -Math.PI, xMax: 3 * Math.PI, yMin: -2.2, yMax: 4.2 }, [
    series("periodic-model", (x) => midline + amplitude * Math.sin(x - phase), -Math.PI, 3 * Math.PI, "modeled sinusoid", "visual-primary"),
    segment("midline", -Math.PI, midline, 3 * Math.PI, midline, `midline y=${midline}`, "visual-guide", "dashed"),
    segment("one-period", phase, -1.7, phase + 2 * Math.PI, -1.7, "one complete period spans 2π", "visual-emphasis"),
    point("maximum", phase + Math.PI / 2, midline + amplitude, "maximum identifies amplitude", "visual-emphasis", "diamond"),
    label("title", -2.85, 3.75, compact(brief.title, 66), "visual-primary"),
  ], "angle or time", "periodic output");
}

function identityScene(brief) {
  const layers = [
    label("title", 0.55, 6.45, compact(brief.title, 68), "visual-primary"),
    card("given", 0.55, 2.0, 3.15, 3.4, "Start from one side and preserve equality.", "visual-secondary", "dots"),
    card("identity", 4.4, 2.0, 3.15, 3.4, "Use a fundamental identity as a reversible substitution.", "visual-emphasis", "diagonal"),
    card("target", 8.25, 2.0, 3.15, 3.4, "Arrive at the target form without assuming it.", "visual-primary", "crosshatch"),
    arrow("step-one", 3.78, 3.7, 4.3, 3.7, "Rewrite with a known identity."),
    arrow("step-two", 7.63, 3.7, 8.15, 3.7, "Simplify to the target."),
    label("given-form", 1.0, 4.65, "1 − cos²θ"),
    label("identity-form", 4.8, 4.65, "sin²θ + cos²θ = 1"),
    label("target-form", 8.7, 4.65, "sin²θ"),
    label("guardrail", 1.0, 1.18, "An identity is true on the common domain; an equation is true only at its solutions."),
    label("meaning", 1.0, 0.55, compact(brief.anchorInterpretation, 88), "visual-ink"),
  ];
  return diagram(layers);
}

function triangleAndVectorScene(brief) {
  const vectorLesson = brief.lessonSequence >= 8;
  const layers = vectorLesson
    ? [
      arrow("vector-u", 1.2, 1.2, 6.0, 4.9, "vector u has horizontal and vertical components", "visual-primary"),
      arrow("vector-v", 1.2, 1.2, 9.4, 2.6, "vector v has a different direction", "visual-secondary"),
      segment("u-horizontal", 1.2, 1.2, 6.0, 1.2, "horizontal component of u", "visual-guide", "dashed"),
      segment("u-vertical", 6.0, 1.2, 6.0, 4.9, "vertical component of u", "visual-guide", "dashed"),
      point("origin", 1.2, 1.2, "common vector tail", "visual-emphasis", "diamond"),
      label("u-label", 5.3, 5.35, "u = ⟨u₁,u₂⟩", "visual-primary"),
      label("v-label", 9.35, 2.95, "v", "visual-secondary"),
      label("dot-note", 2.2, 0.55, "u·v = |u||v|cos θ connects components, magnitude, angle, and projection."),
    ]
    : [
      segment("base", 1.4, 1.2, 10.2, 1.2, "triangle base c", "visual-primary"),
      segment("left-side", 1.4, 1.2, 7.1, 5.8, "triangle side b", "visual-secondary"),
      segment("right-side", 7.1, 5.8, 10.2, 1.2, "triangle side a", "visual-emphasis"),
      point("vertex-a", 1.4, 1.2, "vertex A", "visual-primary", "diamond"),
      point("vertex-b", 10.2, 1.2, "vertex B", "visual-secondary", "square"),
      point("vertex-c", 7.1, 5.8, "vertex C", "visual-emphasis", "circle"),
      label("angle-a", 2.0, 1.65, "A"),
      label("angle-b", 9.35, 1.65, "B"),
      label("angle-c", 7.0, 5.2, "C"),
      label("law", 3.4, 0.55, brief.lessonSequence <= 4 ? "a / sin A = b / sin B = c / sin C" : "c² = a² + b² − 2ab cos C", "visual-primary"),
    ];
  layers.unshift(label("title", 0.55, 6.45, compact(brief.title, 68), "visual-primary"));
  return diagram(layers);
}

function conicScene(brief) {
  const sequence = brief.lessonSequence;
  const layers = [label("title", -5.5, 5.35, compact(brief.title, 62), "visual-primary")];
  if (sequence === 2) {
    layers.push(
      series("parabola", (x) => x * x / 4, -4, 4, "points equidistant from focus and directrix", "visual-primary"),
      segment("directrix", -5, -1, 5, -1, "directrix y=−1", "visual-guide", "dashed"),
      point("focus", 0, 1, "focus (0,1)", "visual-emphasis", "diamond"),
      point("sample", 3, 2.25, "sample point on parabola", "visual-secondary", "circle"),
    );
  } else if (sequence === 4) {
    layers.push(
      parametricSeries("right-hyperbola", (t) => 2 / Math.cos(t), (t) => Math.tan(t), -1.05, 1.05, "right branch", "visual-primary"),
      parametricSeries("left-hyperbola", (t) => -2 / Math.cos(t), (t) => Math.tan(t), -1.05, 1.05, "left branch", "visual-secondary"),
      segment("asymptote-one", -5, -2.5, 5, 2.5, "asymptote y=x/2", "visual-guide", "dashed"),
      segment("asymptote-two", -5, 2.5, 5, -2.5, "asymptote y=−x/2", "visual-guide", "dashed"),
      point("focus-left", -Math.sqrt(5), 0, "left focus", "visual-emphasis", "square"),
      point("focus-right", Math.sqrt(5), 0, "right focus", "visual-emphasis", "diamond"),
    );
  } else {
    layers.push(
      parametricSeries("ellipse", (t) => 4 * Math.cos(t), (t) => 2.5 * Math.sin(t), 0, 2 * Math.PI, "ellipse x²/16+y²/6.25=1", "visual-primary"),
      point("focus-left", -Math.sqrt(9.75), 0, "left focus", "visual-emphasis", "square"),
      point("focus-right", Math.sqrt(9.75), 0, "right focus", "visual-emphasis", "diamond"),
      segment("major-axis", -4, 0, 4, 0, "major axis", "visual-guide", "dashed"),
      label("locus-note", -5.5, -4.9, "A conic is organized by a geometric locus condition, not by appearance alone."),
    );
  }
  return graph({ xMin: -6, xMax: 6, yMin: -5.5, yMax: 6 }, layers);
}

function parametricPolarComplexScene(brief) {
  const sequence = brief.lessonSequence;
  if (sequence >= 10) {
    const angle = sequence === 12 ? 2 * Math.PI / 3 : Math.PI / 4;
    const x = 3.5 * Math.cos(angle);
    const y = 3.5 * Math.sin(angle);
    return graph({ xMin: -5, xMax: 5, yMin: -5, yMax: 5 }, [
      arrow("complex-vector", 0, 0, x, y, "complex number in polar form r(cos θ+i sin θ)", "visual-primary"),
      parametricSeries("modulus-circle", (t) => 3.5 * Math.cos(t), (t) => 3.5 * Math.sin(t), 0, 2 * Math.PI, "constant modulus circle", "visual-guide", "dashed"),
      point("complex-point", x, y, "complex number endpoint", "visual-emphasis", "diamond"),
      label("title", -4.6, 4.45, compact(brief.title, 62), "visual-primary"),
      label("polar-label", 0.5, 0.65, `r=3.5, θ=${Math.round(angle * 180 / Math.PI)}°`),
    ], "real axis", "imaginary axis");
  }
  if (sequence >= 5) {
    return graph({ xMin: -4.5, xMax: 4.5, yMin: -4.5, yMax: 4.5 }, [
      parametricSeries("polar-curve", (t) => 3 * Math.cos(3 * t) * Math.cos(t), (t) => 3 * Math.cos(3 * t) * Math.sin(t), 0, 2 * Math.PI, "polar rose r=3cos(3θ)", "visual-primary"),
      point("pole", 0, 0, "pole", "visual-emphasis", "diamond"),
      label("title", -4.1, 4.0, compact(brief.title, 62), "visual-primary"),
      label("tracing", -4.1, -4.0, "Angle controls direction; signed radius controls distance and orientation."),
    ], "x=r cos θ", "y=r sin θ");
  }
  return graph({ xMin: -1, xMax: 7, yMin: -1, yMax: 10 }, [
    parametricSeries("parametric-path", (t) => t, (t) => 0.2 * t * (6 - t) + t / 2, 0, 6, "oriented parametric path", "visual-primary"),
    point("start", 0, 0, "t=0 start", "visual-emphasis", "diamond"),
    point("middle", 3, 2.7, "t=3", "visual-secondary", "square"),
    point("end", 6, 3, "t=6 end", "visual-emphasis", "circle"),
    arrow("orientation", 2.1, 2.25, 3.8, 3.0, "increasing parameter gives orientation"),
    label("title", -0.65, 9.2, compact(brief.title, 62), "visual-primary"),
  ], "x(t)", "y(t)");
}

function sequenceSeriesScene(brief) {
  const geometric = brief.lessonSequence >= 4 && brief.lessonSequence <= 9;
  const pascal = brief.lessonSequence >= 11;
  const layers = [label("title", 0.55, 6.45, compact(brief.title, 70), "visual-primary")];
  if (pascal) {
    const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]];
    for (const [rowIndex, row] of rows.entries()) {
      const y = 5.5 - rowIndex;
      const start = 6 - (row.length - 1) * 0.75;
      for (const [index, value] of row.entries()) {
        layers.push(label(`pascal-${rowIndex}-${index}`, start + index * 1.5, y, String(value), rowIndex === rows.length - 1 ? "visual-primary" : "visual-ink"));
      }
    }
    layers.push(label("rule", 2.25, 0.72, "Each interior entry is the sum of the two entries above it."));
    return diagram(layers);
  }
  for (let n = 1; n <= 8; n += 1) {
    const value = geometric ? 5 * 0.72 ** (n - 1) : 0.55 * n + 0.8;
    layers.push(segment(`stem-${n}`, n + 0.6, 0.9, n + 0.6, value + 0.9, `term ${n} has value ${value.toFixed(2)}`, "visual-guide"));
    layers.push(withoutCanvasLabel(point(`term-${n}`, n + 0.6, value + 0.9, `a_${n}=${value.toFixed(2)}`, n === 8 ? "visual-emphasis" : "visual-primary", n % 2 ? "circle" : "square")));
    layers.push(label(`n-${n}`, n + 0.48, 0.55, String(n), "visual-ink"));
  }
  layers.push(label("rule", 0.75, 0.1, geometric ? "Equal index steps multiply by a common ratio." : "A sequence is a function whose inputs are discrete indices."));
  return diagram(layers);
}

function calculusReadinessScene(brief) {
  const sequence = brief.lessonSequence;
  if (sequence >= 11) {
    const layers = [
      series("curve", (x) => 0.12 * x * x + 0.6, 0, 6, "curved boundary f(x)", "visual-primary"),
      label("title", 0.25, 5.35, compact(brief.title, 64), "visual-primary"),
    ];
    for (let index = 0; index < 6; index += 1) {
      const height = 0.12 * (index + 1) ** 2 + 0.6;
      layers.push(card(`rectangle-${index}`, index, 0, 1, height, `rectangle ${index + 1} approximates accumulated area`, index % 2 ? "visual-secondary" : "visual-emphasis", index % 2 ? "dots" : "diagonal"));
    }
    return graph({ xMin: -0.3, xMax: 6.5, yMin: -0.3, yMax: 5.8 }, layers, "input x", "accumulated height");
  }
  if (sequence >= 7) {
    return graph({ xMin: -4, xMax: 4, yMin: -4, yMax: 7 }, [
      series("left-piece", (x) => (x * x - 1) / (x - 1), -3.5, 0.92, "simplified branch y=x+1", "visual-primary"),
      series("right-piece", (x) => (x * x - 1) / (x - 1), 1.08, 3.5, "simplified branch y=x+1", "visual-primary"),
      openPoint("hole", 1, 2, "excluded point creates a hole"),
      segment("vertical-guide", 1, -4, 1, 7, "inspect behavior as x approaches 1", "visual-guide", "dashed"),
      label("title", -3.6, 6.35, compact(brief.title, 62), "visual-primary"),
      label("limit-note", -3.6, 5.45, "Nearby values approach 2 even though the original expression is undefined at x=1."),
    ]);
  }
  return graph({ xMin: -3.2, xMax: 4.2, yMin: -2, yMax: 10 }, [
    series("function", (x) => x * x, -3, 3, "f(x)=x²", "visual-primary"),
    segment("secant", 0.5, 0.25, 2.5, 6.25, "secant line through two curve points", "visual-secondary", "dashed"),
    segment("tangent", -0.5, -2, 3.5, 6, "tangent approximation at x=1", "visual-emphasis"),
    point("base-point", 1, 1, "base point (1,1)", "visual-emphasis", "diamond"),
    point("nearby-point", 2.5, 6.25, "nearby point", "visual-secondary", "square"),
    label("title", -2.9, 9.15, compact(brief.title, 62), "visual-primary"),
    label("rate-note", -2.9, 8.25, "Average rate over an interval becomes local as the interval narrows."),
  ]);
}

function anchorScene(brief) {
  if (brief.unitSequence === 1) return readinessScene(brief);
  if (brief.unitSequence === 2) return brief.lessonSequence === 2 ? mappingScene(brief) : functionScene(brief);
  if (brief.unitSequence === 3) return transformationScene(brief);
  if (brief.unitSequence === 4) return compositionScene(brief);
  if (brief.unitSequence === 5) return polynomialScene(brief);
  if (brief.unitSequence === 6) return rationalScene(brief);
  if (brief.unitSequence === 7) return exponentialScene(brief);
  if (brief.unitSequence === 8) return systemsScene(brief);
  if (brief.unitSequence === 9) return angleAndCircleScene(brief);
  if (brief.unitSequence === 10) return periodicScene(brief);
  if (brief.unitSequence === 11) return identityScene(brief);
  if (brief.unitSequence === 12) return triangleAndVectorScene(brief);
  if (brief.unitSequence === 13) return conicScene(brief);
  if (brief.unitSequence === 14) return parametricPolarComplexScene(brief);
  if (brief.unitSequence === 15) return sequenceSeriesScene(brief);
  return calculusReadinessScene(brief);
}

function mechanismSteps(value) {
  const clauses = String(value)
    .split(/,\s+(?:and\s+)?|\s+and\s+(?=[a-z])/i)
    .map((clause) => clause.trim().replace(/[.]$/, ""))
    .filter(Boolean);
  const fallbacks = ["Identify the mathematical structure", "Carry out the defining operation", "Check the result in the original setting"];
  return [...clauses, ...fallbacks].slice(0, 4);
}

function mechanismScene(brief) {
  const steps = brief.lessonGuide?.method?.map((step) => step.replace(/^\d+\.\s*/, "")) ?? mechanismSteps(brief.mechanism);
  const layers = [
    label("title", 0.55, 6.45, "REASONING ROUTE", "visual-primary"),
    label("context", 2.4, 6.45, compact(brief.lessonTitle, 52)),
  ];
  const rowY = [4.95, 3.75, 2.55, 1.35];
  for (const [index, step] of steps.entries()) {
    const y = rowY[index];
    layers.push(card(`step-${index + 1}`, 1.25, y - 0.42, 10.05, 0.9, `Step ${index + 1}: ${step}`, index === steps.length - 1 ? "visual-primary" : index % 2 ? "visual-emphasis" : "visual-secondary", index === steps.length - 1 ? "crosshatch" : index % 2 ? "diagonal" : "dots"));
    layers.push(withoutCanvasLabel(point(`number-${index + 1}`, 0.72, y, `step ${index + 1}`, index === steps.length - 1 ? "visual-primary" : "visual-secondary", index % 2 ? "square" : "diamond")));
    layers.push(label(`number-copy-${index + 1}`, 0.61, y, String(index + 1), "visual-ink"));
    layers.push(label(`step-copy-${index + 1}`, 1.62, y, compact(step, 92), "visual-ink"));
    if (index < steps.length - 1) layers.push(arrow(`arrow-${index + 1}`, 0.72, y - 0.34, 0.72, rowY[index + 1] + 0.34, `Step ${index + 1} leads to step ${index + 2}.`));
  }
  addWrapped(layers, "check", `Final check: ${brief.anchorInterpretation}`, 1.25, 0.55, 88, 1, 0.48, "visual-primary");
  return diagram(layers);
}

function comparisonScene(brief) {
  const valid = compact(brief.anchorInterpretation, 72);
  const invalid = compact(brief.invalidMove.replace(/^A frequent error is\s+/i, ""), 72);
  const layers = [
    label("title", 0.55, 6.45, "ONE DECISION, TWO DIFFERENT OUTCOMES", "visual-primary"),
    card("decision", 3.85, 4.75, 4.3, 1.15, "The mathematical condition must be checked here.", "visual-secondary", "dots"),
    label("decision-label", 4.25, 5.32, "CHECK THE DEFINING CONDITION"),
    arrow("valid-branch", 5.25, 4.65, 3.1, 3.75, "Follow the condition.", "visual-primary"),
    arrow("invalid-branch", 6.75, 4.65, 8.9, 3.75, "Skip the condition.", "visual-emphasis"),
    card("valid", 0.55, 1.05, 5.0, 2.65, `Valid reasoning: ${valid}`, "visual-primary", "diagonal"),
    card("invalid", 6.45, 1.05, 5.0, 2.65, `Invalid shortcut: ${invalid}`, "visual-emphasis", "crosshatch"),
    label("valid-heading", 0.9, 3.25, "VALID PATH"),
    label("invalid-heading", 6.8, 3.25, "TEMPTING SHORTCUT"),
  ];
  addWrapped(layers, "valid-copy", valid, 0.9, 2.62, 40, 2, 0.54);
  addWrapped(layers, "invalid-copy", invalid, 6.8, 2.62, 38, 2, 0.54);
  return diagram(layers);
}

function visualSpec(brief) {
  if (brief.role === "Anchor figure") return base(brief, anchorScene(brief));
  if (brief.role === "Mechanism figure") return base(brief, mechanismScene(brief));
  if (brief.role === "Comparison and error figure") return base(brief, comparisonScene(brief));
  throw new Error(`Unsupported Precalculus figure role ${brief.role}.`);
}

for (const unitSequence of unitSequences) {
  const directory = resolve(root, "content/precalculus/units", `unit-${unitSequence}`);
  const briefsArtifact = JSON.parse(await readFile(resolve(directory, "visual-authoring-briefs.v1.json"), "utf8"));
  if (briefsArtifact.figures.length !== course.units.find((unit) => unit.sequence === unitSequence)?.lessonCount * 3) {
    throw new Error(`Precalculus unit ${unitSequence} must have exactly three figures per lesson.`);
  }
  const briefs = briefsArtifact.figures.map((brief) => ({ ...brief, unitSequence }));
  const visuals = briefs.map(visualSpec);
  const collection = {
    collectionSchemaVersion: 1,
    collectionId: `precalculus-unit-${unitSequence}-visuals`,
    migrationOnly: false,
    visuals,
  };
  const semanticManifest = {
    schemaVersion: 1,
    unitId: `precalculus-unit-${unitSequence}`,
    manifests: briefs.map((brief) => ({
      id: brief.id,
      lessonId: brief.lessonId,
      route: brief.route,
      role: brief.role,
      title: brief.title,
      description: brief.caption,
      learnerOutcome: brief.lessonOutcome,
      readingOrder: visuals.find((visual) => visual.id === brief.id).accessibility.readingOrder,
      colorIndependent: true,
      printEquivalent: true,
    })),
  };
  for (const [name, value] of [
    ["visual-specs.v1.json", collection],
    ["visual-semantic-manifests.v1.json", semanticManifest],
  ]) {
    const path = resolve(directory, name);
    const expected = `${JSON.stringify(value, null, 2)}\n`;
    if (checkOnly) {
      const actual = await readFile(path, "utf8").catch(() => "");
      if (actual.replace(/\r\n?/g, "\n") !== expected) {
        throw new Error(`Precalculus unit ${unitSequence} ${name} is missing or stale.`);
      }
    } else {
      await mkdir(directory, { recursive: true });
      await writeFile(path, expected, "utf8");
    }
  }
  console.log(`${checkOnly ? "Verified" : "Authored"} ${visuals.length} redesigned Precalculus figures for course unit ${unitSequence}.`);
}
