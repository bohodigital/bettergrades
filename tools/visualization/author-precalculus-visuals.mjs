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

function anchorScene(brief) {
  if (brief.unitSequence === 1) return readinessScene(brief);
  if (brief.unitSequence === 2) return brief.lessonSequence === 2 ? mappingScene(brief) : functionScene(brief);
  if (brief.unitSequence === 3) return transformationScene(brief);
  if (brief.unitSequence === 4) return compositionScene(brief);
  if (brief.unitSequence === 5) return polynomialScene(brief);
  if (brief.unitSequence === 6) return rationalScene(brief);
  if (brief.unitSequence === 7) return exponentialScene(brief);
  return systemsScene(brief);
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
