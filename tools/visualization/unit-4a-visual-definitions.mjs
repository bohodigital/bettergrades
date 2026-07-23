import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UNIT = "unit-4a";
const STATIC = "static-svg";
const INTERACTIVE = "interactive-2d";

function plain(value) {
  return String(value)
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[{}^_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const text = (value) => ({ segments: [{ kind: "text", text: plain(value) }] });
const expr = (expressionLatex) => ({ format: "latex", expressionLatex });
const style = (strokeToken, cue, extra = {}) => ({ strokeToken, lineStyle: "solid", markerShape: "none", pattern: "none", colorIndependentCue: cue, ...extra });

function samples(fn, min, max, count = 81) {
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

const series = (id, data, labelValue, token = "visual-primary", lineStyle = "solid") => ({
  id, kind: "sampled-series", label: text(labelValue), geometry: { ...data, connect: true },
  presentation: style(token, `${labelValue}; ${lineStyle} curve.`, { lineStyle }),
});
const segment = (id, x1, y1, x2, y2, cue, token = "visual-guide", lineStyle = "solid") => ({
  id, kind: "segment", geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, cue, { lineStyle }),
});
const polygon = (id, points, cue, token = "visual-secondary", pattern = "diagonal") => ({
  id, kind: "polygon", geometry: { points: points.map(([x, y]) => ({ x, y })), closed: true },
  presentation: style(token, cue, { fillToken: token, pattern }),
});
const label = (id, x, y, value, token = "visual-ink") => ({
  id, kind: "label", geometry: { position: { x, y }, content: text(value) }, presentation: style(token, `Label: ${value}.`),
});
const annotation = (id, x, y, value, token = "visual-ink") => ({
  id, kind: "annotation", geometry: { anchor: { x, y }, content: text(value) }, presentation: style(token, `Annotation: ${value}.`),
});
const point = (id, x, y, cue, token = "visual-emphasis", markerShape = "circle") => ({
  id, kind: "closed-point", geometry: { position: { x, y } }, presentation: style(token, cue, { fillToken: token, markerShape }),
});
const points = (prefix, values, token = "visual-emphasis", markerShape = "circle") => values.map(([x, y], index) => point(`${prefix}-${index + 1}`, x, y, `${prefix} point ${index + 1}.`, token, markerShape));

function axes(xLabel = "n", yLabel = "value", xStep = 1, yStep) {
  return { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text(xLabel), scale: "linear", tickMode: xStep ? "fixed-step" : "automatic", ...(xStep ? { tickStep: xStep } : {}), showGrid: true },
    { id: "y-axis", orientation: "y", label: text(yLabel), scale: "linear", tickMode: yStep ? "fixed-step" : "automatic", ...(yStep ? { tickStep: yStep } : {}), showGrid: true },
  ] };
}

function graph(viewport, layers, controls = [], xLabel = "n", yLabel = "value", xStep = 1, yStep) {
  return { kind: "cartesian-2d", coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 }, axes: axes(xLabel, yLabel, xStep, yStep), panels: [], layers, controls };
}

function geometry(viewport, layers, controls = []) {
  return { kind: "geometry-2d", coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 }, axes: { mode: "none", reason: "The labeled diagram carries the instructional structure." }, panels: [], layers, controls };
}

const sequenceValues = (fn, count = 10) => Array.from({ length: count }, (_, index) => [index + 1, fn(index + 1)]);
const harmonicPartial = (n) => Array.from({ length: n }, (_, index) => 1 / (index + 1)).reduce((sum, value) => sum + value, 0);
const alternatingPartial = (n) => Array.from({ length: n }, (_, index) => ((index % 2 ? -1 : 1) / (index + 1))).reduce((sum, value) => sum + value, 0);

const sceneDefinitions = {
  "u4a-sequence-index-machine": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    polygon("input-box", [[0.8, 2.6], [3, 2.6], [3, 4.4], [0.8, 4.4]], "Integer input box.", "visual-secondary", "dots"),
    polygon("rule-box", [[4.4, 2.15], [7.7, 2.15], [7.7, 4.85], [4.4, 4.85]], "Sequence rule box.", "visual-primary", "diagonal"),
    polygon("term-box", [[9.1, 2.6], [11.3, 2.6], [11.3, 4.4], [9.1, 4.4]], "Selected term output box.", "visual-emphasis", "crosshatch"),
    segment("input-arrow", 3, 3.5, 4.4, 3.5, "Arrow sends an integer index into the rule.", "visual-ink", "double"),
    segment("output-arrow", 7.7, 3.5, 9.1, 3.5, "Arrow sends one term out of the rule.", "visual-ink", "double"),
    label("input-label", 1.9, 3.5, "integer n"), label("rule-label", 6.05, 3.5, "a_n = 1/n"), label("term-label", 10.2, 3.5, "term a_n"),
    annotation("domain-note", 6, 6.1, "Only integer inputs select sequence terms; the slider steps one index at a time."),
  ], [{ id: "index-control", kind: "slider", label: text("Sequence index n"), announcementTemplate: "The selected integer index is {value}; the rule returns exactly one ordered term.", parameter: "p", min: 1, max: 10, step: 1, initial: 4 }]),

  "u4a-sequence-points": () => graph({ xMin: 0, xMax: 10.5, yMin: 0, yMax: 1.15 }, [
    series("guide-curve", samples((x) => 1 / x, 1, 10), "faint guide y=1/x", "visual-guide", "dashed"),
    ...points("sequence", sequenceValues((n) => 1 / n), "visual-emphasis", "diamond"),
    annotation("discrete-note", 5.6, 1.02, "Only the marked integer inputs belong to the sequence."),
  ], [], "integer index n", "term a_n", 1, 0.25),

  "u4a-explicit-recursive-bridge": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    label("recursive-title", 3, 6.1, "Recursive: start at 2, then add 3"),
    ...[2, 5, 8, 11].flatMap((value, index) => [
      polygon(`recursive-box-${index}`, [[0.7 + index * 1.7, 3.6], [1.9 + index * 1.7, 3.6], [1.9 + index * 1.7, 4.7], [0.7 + index * 1.7, 4.7]], `Recursive term ${value}.`, "visual-secondary", index % 2 ? "dots" : "diagonal"),
      label(`recursive-label-${index}`, 1.3 + index * 1.7, 4.15, String(value)),
    ]),
    label("explicit-title", 8.9, 6.1, "Explicit: a_n = 2 + 3(n-1)"),
    polygon("explicit-box", [[7.1, 2.5], [10.8, 2.5], [10.8, 4.8], [7.1, 4.8]], "Direct formula evaluates any requested index.", "visual-primary", "crosshatch"),
    label("explicit-label", 8.95, 3.65, "n = 4 gives a_4 = 11"),
    annotation("same-sequence", 6, 1.1, "Both descriptions generate the same ordered terms; they answer different computational needs."),
  ]),

  "u4a-epsilon-n-band": () => graph({ xMin: 0, xMax: 12.5, yMin: 0.2, yMax: 1.8 }, [
    polygon("epsilon-band", [[0, expr("1-p")], [12.5, expr("1-p")], [12.5, expr("1+p")], [0, expr("1+p")]], "Tolerance band from L minus epsilon to L plus epsilon.", "visual-secondary", "dots"),
    segment("limit-line", 0, 1, 12.5, 1, "Limit line L equals 1.", "visual-primary", "double"),
    ...points("epsilon-sequence", sequenceValues((n) => 1 + ((n % 2 ? 1 : -1) / n), 12), "visual-emphasis", "diamond"),
    segment("cutoff", expr("2/p"), 0.2, expr("2/p"), 1.8, "A valid cutoff N; every later point remains in the band.", "visual-ink", "dashed"),
    annotation("epsilon-meaning", 6.2, 1.68, "Evidence before N is irrelevant; the definition controls every term after N."),
  ], [{ id: "epsilon-control", kind: "slider", label: text("Tolerance epsilon"), announcementTemplate: "Epsilon is {value}; the displayed cutoff moves so all later points are trapped.", parameter: "p", min: 0.2, max: 0.8, step: 0.1, initial: 0.4 }], "n", "a_n", 1, 0.4),

  "u4a-convergence-gallery": () => graph({ xMin: 0, xMax: 10.5, yMin: -2.3, yMax: 4.5 }, [
    ...points("oscillation", sequenceValues((n) => (n % 2 ? 1.4 : 0.2)), "visual-emphasis", "diamond"),
    ...points("unbounded", sequenceValues((n) => 1.7 + Math.sqrt(n) / 1.6), "visual-primary", "circle"),
    ...points("wandering", sequenceValues((n) => -1.2 + Math.sin(n * 1.7) * 0.8), "visual-secondary", "square"),
    label("oscillation-label", 8.2, 1.25, "oscillation"), label("growth-label", 8.2, 4.05, "unbounded growth"), label("wander-label", 8.2, -1.7, "no single target"),
  ], [], "n", "three failure patterns", 1, 1),

  "u4a-monotone-bounded": () => graph({ xMin: 0, xMax: 12.5, yMin: -0.05, yMax: 1.15 }, [
    segment("upper-bound", 0, 1, 12.5, 1, "Least upper bound at 1.", "visual-primary", "double"),
    ...points("monotone-sequence", sequenceValues((n) => 1 - 1 / n, 12), "visual-emphasis", "diamond"),
    segment("current-index", expr("p"), -0.05, expr("p"), expr("1-1/p"), "Current recurrence step remains below the bound.", "visual-ink", "dashed"),
    annotation("monotone-note", 6.2, 1.1, "The terms rise and never cross 1; the theorem guarantees convergence."),
  ], [{ id: "term-control", kind: "slider", label: text("Current term index"), announcementTemplate: "The current term is a sub {value}; every displayed term is increasing and below 1.", parameter: "p", min: 2, max: 12, step: 1, initial: 6 }], "n", "a_n", 1, 0.25),

  "u4a-partial-sums": () => graph({ xMin: 0, xMax: 10.5, yMin: 0, yMax: 2.2 }, [
    ...points("terms", sequenceValues((n) => 2 ** (1 - n)), "visual-secondary", "circle"),
    ...points("partial-sums", sequenceValues((n) => 2 - 2 ** (1 - n)), "visual-emphasis", "diamond"),
    segment("sum-limit", 0, 2, 10.5, 2, "Partial-sum limit equals 2.", "visual-primary", "double"),
    segment("selected-index", expr("p"), 0, expr("p"), 2.2, "Selected index compares a term with its running total.", "visual-ink", "dashed"),
    label("term-label", 7.5, 0.35, "terms a_n"), label("sum-label", 7.5, 1.7, "partial sums S_n"),
  ], [{ id: "partial-sum-control", kind: "slider", label: text("Number of terms"), announcementTemplate: "At n equals {value}, compare the shrinking term with the accumulating partial sum.", parameter: "p", min: 1, max: 10, step: 1, initial: 5 }], "n", "term or running total", 1, 0.5),

  "u4a-geometric-self-similarity": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 5 }, [
    segment("unit-interval", 0.8, 2.5, 11.2, 2.5, "The full unit interval.", "visual-ink", "double"),
    ...[[0.8, 6], [6, 8.6], [8.6, 9.9], [9.9, 10.55]].map(([x1, x2], index) => polygon(`piece-${index + 1}`, [[x1, 1.7], [x2, 1.7], [x2, 3.3], [x1, 3.3]], `Geometric piece ${index + 1}.`, index % 2 ? "visual-primary" : "visual-secondary", index % 2 ? "crosshatch" : "dots")),
    label("half", 3.4, 2.5, "1/2"), label("quarter", 7.3, 2.5, "1/4"), label("eighth", 9.25, 2.5, "1/8"), label("tail", 10.85, 2.5, "tail"),
    annotation("self-similar", 6, 4.4, "Each remaining tail is a scaled copy of the whole construction."),
  ]),

  "u4a-geometric-areas": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    polygon("whole", [[1, 1], [7, 1], [7, 6], [1, 6]], "One whole area.", "visual-secondary", "dots"),
    polygon("first-piece", [[1, 1], [expr("1+6*p"), 1], [expr("1+6*p"), 6], [1, 6]], "First geometric fraction r of the whole.", "visual-primary", "diagonal"),
    polygon("second-piece", [[expr("1+6*p"), 1], [expr("1+6*p+6*p*(1-p)"), 1], [expr("1+6*p+6*p*(1-p)"), 6], [expr("1+6*p"), 6]], "Second piece is r times what remains.", "visual-emphasis", "crosshatch"),
    label("ratio-label", 4, 6.55, "Repeatedly take fraction r of what remains"),
    annotation("ratio-condition", 9.3, 3.5, "For |r|<1, the leftover tail shrinks toward zero."),
  ], [{ id: "ratio-control", kind: "slider", label: text("Common ratio r"), announcementTemplate: "The common ratio is {value}; each new piece is that fraction of the remaining area.", parameter: "p", min: 0.2, max: 0.8, step: 0.1, initial: 0.5 }]),

  "u4a-telescoping-cancellation": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    label("positive-row", 6, 5.8, "+1   +1/2   +1/3   +1/4   + ... +1/N"),
    label("negative-row", 6, 4.3, "     -1/2   -1/3   -1/4   - ... -1/(N+1)"),
    ...[3.3, 4.8, 6.3, 7.8, 9.3].map((x, index) => segment(`cancel-${index}`, x, 3.55, x, 6.25, "Matching interior terms cancel.", "visual-guide", "dashed")),
    polygon("left-boundary", [[0.8, 5.1], [2.1, 5.1], [2.1, 6.5], [0.8, 6.5]], "The first boundary term survives.", "visual-primary", "dots"),
    polygon("right-boundary", [[9.9, 3.6], [11.3, 3.6], [11.3, 4.9], [9.9, 4.9]], "The final negative boundary term survives.", "visual-emphasis", "crosshatch"),
    annotation("finite-first", 6, 1.5, "Cancellation is proved in a finite partial sum before N tends to infinity."),
  ]),

  "u4a-terms-versus-partial-sums": () => graph({ xMin: 0, xMax: 20.5, yMin: 0, yMax: 4 }, [
    ...points("harmonic-terms", sequenceValues((n) => 1 / n, 20), "visual-secondary", "circle"),
    ...points("harmonic-sums", sequenceValues((n) => harmonicPartial(n), 20), "visual-emphasis", "diamond"),
    label("shrinking-label", 13, 0.55, "terms 1/n shrink toward zero"),
    label("growing-label", 13, 3.35, "partial sums keep growing"),
  ], [], "n", "term or partial sum", 2, 1),

  "u4a-p-series-threshold": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    segment("p-axis", 1, 2.5, 11, 2.5, "Parameter axis for p.", "visual-ink", "double"),
    segment("threshold", 6, 1.2, 6, 5.6, "Threshold p equals 1.", "visual-primary", "double"),
    polygon("divergent-zone", [[1, 1.5], [6, 1.5], [6, 3.5], [1, 3.5]], "For p at most 1, the positive p-series diverges.", "visual-secondary", "dots"),
    polygon("convergent-zone", [[6, 1.5], [11, 1.5], [11, 3.5], [6, 3.5]], "For p greater than 1, the p-series converges.", "visual-emphasis", "crosshatch"),
    point("selected-p", expr("1+2*(p-1)"), 2.5, "Selected p moves across the threshold.", "visual-primary", "diamond"),
    label("diverges", 3.5, 4.3, "p <= 1: diverges"), label("converges", 8.5, 4.3, "p > 1: converges"),
  ], [{ id: "p-control", kind: "slider", label: text("Exponent p"), announcementTemplate: "The exponent p is {value}; compare its position with the threshold p equals 1.", parameter: "p", min: 0.5, max: 2.5, step: 0.25, initial: 1 }]),

  "u4a-integral-test-rectangles": () => graph({ xMin: 0.8, xMax: 7.2, yMin: 0, yMax: 1.2 }, [
    series("decreasing-curve", samples((x) => 1 / x, 1, 7), "positive decreasing f(x)=1/x", "visual-primary", "double"),
    ...Array.from({ length: 6 }, (_, index) => polygon(`right-rectangle-${index + 1}`, [[index + 1, 0], [index + 2, 0], [index + 2, 1 / (index + 2)], [index + 1, 1 / (index + 2)]], `Right-endpoint rectangle ${index + 1} lies below the curve.`, "visual-secondary", "dots")),
    annotation("rectangle-trap", 4.4, 1.05, "Right rectangles underestimate; shifting left produces an overestimate."),
  ], [], "x", "f(x)", 1, 0.25),

  "u4a-integral-test": () => graph({ xMin: 0.8, xMax: 8.2, yMin: 0, yMax: 1.2 }, [
    polygon("tail-area", [[3, 0], ...samples((x) => 1 / (x * x), 3, 8, 50).xValues.map((x) => [x, 1 / (x * x)]), [8, 0]], "Improper-integral tail area under a positive decreasing curve.", "visual-secondary", "dots"),
    series("integral-curve", samples((x) => 1 / (x * x), 1, 8), "f(x)=1/x squared", "visual-primary", "double"),
    ...points("series-terms", sequenceValues((n) => 1 / (n * n), 8), "visual-emphasis", "diamond"),
    segment("tail-start", 3, 0, 3, 1.1, "Tail begins after a finite prefix.", "visual-ink", "dashed"),
    annotation("same-tail", 5.2, 0.9, "The series tail and integral tail have the same convergence behavior."),
  ], [], "x or n", "height", 1, 0.25),

  "u4a-alternating-brackets": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 6 }, [
    segment("number-line", 1, 2.7, 11, 2.7, "Number line for partial sums.", "visual-ink", "double"),
    point("limit", 6, 2.7, "The limit lies between odd and even partial sums.", "visual-primary", "diamond"),
    point("odd-bracket", expr("6-4/p"), 2.7, "Odd partial sum endpoint.", "visual-emphasis", "circle"),
    point("even-bracket", expr("6+4/p"), 2.7, "Even partial sum endpoint.", "visual-secondary", "square"),
    segment("bracket", expr("6-4/p"), 1.8, expr("6+4/p"), 1.8, "The bracket width shrinks with the next term magnitude.", "visual-primary", "double"),
    label("odd-label", 2.8, 3.6, "odd partial sums"), label("even-label", 9.2, 3.6, "even partial sums"),
    annotation("next-term", 6, 5.1, "Adding terms tightens a certified bracket around the limit."),
  ], [{ id: "alternating-control", kind: "slider", label: text("Number of alternating terms"), announcementTemplate: "After {value} terms, the odd and even partial sums form a narrower bracket.", parameter: "p", min: 2, max: 10, step: 1, initial: 4 }]),

  "u4a-alternating-partial-sums": () => graph({ xMin: 0, xMax: 12.5, yMin: 0.35, yMax: 1.05 }, [
    ...points("alternating-sums", sequenceValues((n) => alternatingPartial(n), 12), "visual-emphasis", "diamond"),
    segment("alternating-limit", 0, Math.log(2), 12.5, Math.log(2), "Limit equals natural log of 2.", "visual-primary", "double"),
    annotation("opposite-sides", 6.2, 0.98, "Odd and even partial sums approach the same limit from opposite sides."),
  ], [], "n", "S_n", 1, 0.1),

  "u4a-ratio-geometric-decay": () => graph({ xMin: 0, xMax: 12.5, yMin: 0, yMax: 1.1 }, [
    ...points("ratio-terms", sequenceValues((n) => 0.72 ** (n - 1), 12), "visual-emphasis", "diamond"),
    series("geometric-envelope", samples((x) => 0.72 ** (x - 1), 1, 12), "geometric envelope with ratio 0.72", "visual-primary", "dashed"),
    annotation("ratio-domination", 6.2, 1.02, "A consecutive-term ratio bounded below 1 forces geometric decay."),
  ], [], "n", "term magnitude", 1, 0.25),

  "u4a-test-selection-tree": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 9 }, [
    polygon("start", [[5.3, 7.2], [8.7, 7.2], [8.7, 8.4], [5.3, 8.4]], "Start with the nth-term limit.", "visual-primary", "diagonal"),
    label("start-label", 7, 7.8, "Does a_n approach 0?"),
    ...[[2.2, 5.7, "geometric / telescoping"], [7, 5.7, "positive comparison"], [11.8, 5.7, "alternating signs"]].flatMap(([x, y, value], index) => [
      polygon(`branch-${index}`, [[x - 1.8, y - 0.65], [x + 1.8, y - 0.65], [x + 1.8, y + 0.65], [x - 1.8, y + 0.65]], `Decision branch: ${value}.`, index === 1 ? "visual-emphasis" : "visual-secondary", index === 1 ? "crosshatch" : "dots"),
      label(`branch-label-${index}`, x, y, value),
      segment(`branch-line-${index}`, 7, 7.2, x, y + 0.65, `Flow to ${value}.`, "visual-guide", "solid"),
    ]),
    ...[[2.2, 2.5, "exact structure"], [7, 2.5, "integral / direct / limit"], [11.8, 2.5, "alternating, then absolute"]].flatMap(([x, y, value], index) => [
      polygon(`method-${index}`, [[x - 1.8, y - 0.65], [x + 1.8, y - 0.65], [x + 1.8, y + 0.65], [x - 1.8, y + 0.65]], `Method family: ${value}.`, "visual-primary", index % 2 ? "diagonal" : "crosshatch"),
      label(`method-label-${index}`, x, y, value),
      segment(`method-line-${index}`, x, 5.05, x, y + 0.65, `Continue to ${value}.`, "visual-guide", "solid"),
    ]),
    annotation("decision-warning", 7, 0.8, "Factorials or nth powers may instead point to the Ratio or Root Test; no keyword alone proves convergence."),
  ]),
};

function inferCapabilities(scene) {
  const capabilities = new Set(["static-fallback"]);
  if (scene.kind === "cartesian-2d") capabilities.add("cartesian-axes");
  if (scene.kind === "geometry-2d") capabilities.add("geometry-primitives");
  for (const layer of scene.layers) {
    if (layer.kind === "sampled-series") capabilities.add("data-series");
    if (["open-point", "closed-point"].includes(layer.kind)) capabilities.add("open-closed-points");
    if (["annotation", "label"].includes(layer.kind)) capabilities.add("annotations");
  }
  if (scene.controls.length) capabilities.add("parameter-controls");
  return [...capabilities];
}

function makeSpec(brief) {
  const factory = sceneDefinitions[brief.visual_id];
  if (!factory) throw new Error(`Unit 4A visual ${brief.visual_id} lacks an explicit scene definition.`);
  if (![STATIC, INTERACTIVE].includes(brief.recommended_renderer)) throw new Error(`Unit 4A visual ${brief.visual_id} names unsupported renderer ${brief.recommended_renderer}.`);
  const scene = factory();
  if (scene.kind !== brief.visual_kind) throw new Error(`Unit 4A visual ${brief.visual_id} expected ${brief.visual_kind}; received ${scene.kind}.`);
  const interactive = brief.recommended_renderer === INTERACTIVE;
  // Authoring controls guide the visual editor. They are not learner-facing
  // description copy and must never cross the public VisualSpec boundary.
  const longDescription = `${plain(brief.long_description)} ${plain(brief.learning_purpose)}`;
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
      colorIndependentDescription: `Written labels, distinct line styles, markers, and fill patterns communicate every relationship in ${plain(brief.title).toLowerCase()}; color is never the only cue.`,
      ...(interactive ? { keyboardInstructions: "Use Tab to reach the bounded control, then use arrow keys to change one value at a time." } : {}),
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

export async function authorUnit4aVisuals({ root, checkOnly }) {
  const directory = resolve(root, "content/calculus/units/unit-4a");
  const briefs = JSON.parse(await readFile(resolve(directory, "handoff/visual-authoring-briefs.v3.json"), "utf8")).visual_briefs;
  const briefIds = briefs.map((brief) => brief.visual_id);
  const definitionIds = Object.keys(sceneDefinitions);
  const missing = briefIds.filter((id) => !definitionIds.includes(id));
  const extra = definitionIds.filter((id) => !briefIds.includes(id));
  if (missing.length || extra.length) throw new Error(`Unit 4A explicit visual inventory mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
  const specs = briefs.map(makeSpec);
  if (specs.length !== 18 || new Set(specs.map((spec) => spec.id)).size !== 18) throw new Error("Unit 4A requires exactly 18 unique explicit visual specs.");
  if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== 7) throw new Error("Unit 4A requires exactly seven BetterGrades Interactive 2D scenes.");
  const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: "unit-4a-calculus-visuals", migrationOnly: false, explicitDefinitionsOnly: true, visuals: specs }, null, 2)}\n`;
  const outputPath = resolve(directory, "visual-specs.v1.json");
  if (checkOnly) {
    if ((await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n") !== output) throw new Error("unit-4a visual specs are stale.");
  } else await writeFile(outputPath, output);
  console.log(`${checkOnly ? "Verified" : "Authored"} 18 Unit 4A explicit VisualSpec v1 records (11 static, seven BetterGrades Interactive 2D).`);
}
