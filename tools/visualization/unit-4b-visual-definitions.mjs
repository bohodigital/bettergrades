import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UNIT = "unit-4b";
const STATIC = "static-svg";
const INTERACTIVE = "interactive-2d";

function plain(value) {
  return String(value).replace(/\\\((.*?)\\\)/gs, "$1").replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1").replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2").replace(/\\[A-Za-z]+/g, " ").replace(/[{}^_]/g, " ").replace(/\s+/g, " ").trim();
}
const text = (value) => ({ segments: [{ kind: "text", text: plain(value) }] });
const expr = (expressionLatex) => ({ format: "latex", expressionLatex });
const style = (strokeToken, cue, extra = {}) => ({ strokeToken, lineStyle: "solid", markerShape: "none", pattern: "none", colorIndependentCue: cue, ...extra });
function samples(fn, min, max, count = 81) { const xValues = []; const yValues = []; for (let i = 0; i < count; i += 1) { const x = min + ((max - min) * i) / (count - 1); const y = fn(x); if (Number.isFinite(y)) { xValues.push(Number(x.toFixed(6))); yValues.push(Number(y.toFixed(6))); } } return { xValues, yValues }; }
const series = (id, data, labelValue, token = "visual-primary", lineStyle = "solid") => ({ id, kind: "sampled-series", label: text(labelValue), geometry: { ...data, connect: true }, presentation: style(token, `${labelValue}; ${lineStyle} curve.`, { lineStyle }) });
const segment = (id, x1, y1, x2, y2, cue, token = "visual-guide", lineStyle = "solid") => ({ id, kind: "segment", geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } }, presentation: style(token, cue, { lineStyle }) });
const polygon = (id, values, cue, token = "visual-secondary", pattern = "diagonal") => ({ id, kind: "polygon", geometry: { points: values.map(([x, y]) => ({ x, y })), closed: true }, presentation: style(token, cue, { fillToken: token, pattern }) });
const label = (id, x, y, value, token = "visual-ink") => ({ id, kind: "label", geometry: { position: { x, y }, content: text(value) }, presentation: style(token, `Label: ${value}.`) });
const annotation = (id, x, y, value) => ({ id, kind: "annotation", geometry: { anchor: { x, y }, content: text(value) }, presentation: style("visual-ink", `Annotation: ${value}.`) });
const point = (id, x, y, cue, token = "visual-emphasis", markerShape = "circle", kind = "closed-point") => ({ id, kind, geometry: { position: { x, y } }, presentation: style(token, cue, { fillToken: token, markerShape }) });
const box = (id, x1, y1, x2, y2, value, token = "visual-secondary", pattern = "diagonal") => [polygon(`${id}-box`, [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], `${value} box.`, token, pattern), label(`${id}-label`, (x1 + x2) / 2, (y1 + y2) / 2, value)];
function axes(xLabel = "x", yLabel = "y", xStep, yStep) { return { mode: "explicit", axes: [{ id: "x-axis", orientation: "x", label: text(xLabel), scale: "linear", tickMode: xStep ? "fixed-step" : "automatic", ...(xStep ? { tickStep: xStep } : {}), showGrid: true }, { id: "y-axis", orientation: "y", label: text(yLabel), scale: "linear", tickMode: yStep ? "fixed-step" : "automatic", ...(yStep ? { tickStep: yStep } : {}), showGrid: true }] }; }
function graph(viewport, layers, controls = [], xLabel = "x", yLabel = "y", xStep, yStep) { return { kind: "cartesian-2d", coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 }, axes: axes(xLabel, yLabel, xStep, yStep), panels: [], layers, controls }; }
function geometry(viewport, layers, controls = []) { return { kind: "geometry-2d", coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.07 }, axes: { mode: "none", reason: "The labeled diagram carries the instructional structure." }, panels: [], layers, controls }; }
const slider = (id, labelValue, announcementTemplate, min, max, step, initial) => ({ id, kind: "slider", label: text(labelValue), announcementTemplate, parameter: "p", min, max, step, initial });

const sceneDefinitions = {
  "u4b-power-series-three-inputs": () => graph({ xMin: 0, xMax: 10.5, yMin: -1, yMax: 8 }, [
    series("inside", samples((n) => 2 - 2 ** (1 - n), 1, 10, 10), "x=1/2: partial sums settle", "visual-success", "solid"),
    series("endpoint", samples((n) => n % 2 ? 1 : 0, 1, 10, 10), "x=-1: partial sums oscillate", "visual-secondary", "dashed"),
    series("outside", samples((n) => (1.2 ** (n + 1) - 1) / 0.2, 1, 10, 10), "x=1.2: partial sums grow", "visual-emphasis", "double"),
    segment("selected-n", expr("p"), -1, expr("p"), 8, "Selected partial-sum index.", "visual-ink", "dashed"), annotation("input-warning", 5.2, 7.4, "The same coefficient series becomes a different numerical series at each x."),
  ], [slider("terms", "Partial-sum index N", "The selected partial sum index is {value}; compare all three inputs at the same finite stage.", 1, 10, 1, 5)], "N", "partial sum", 1, 2),

  "u4b-radius-number-line": () => geometry({ xMin: -5, xMax: 5, yMin: 0, yMax: 5 }, [
    segment("number-line", -4.5, 2.2, 4.5, 2.2, "Number line centered at zero.", "visual-ink", "double"),
    polygon("inside", [[expr("-p"), 1.5], [expr("p"), 1.5], [expr("p"), 2.9], [expr("-p"), 2.9]], "Automatic convergence where absolute distance is below R.", "visual-success", "dots"),
    point("left-end", expr("-p"), 2.2, "Left endpoint requires its own test.", "visual-emphasis", "circle", "open-point"), point("right-end", expr("p"), 2.2, "Right endpoint requires its own test.", "visual-emphasis", "circle", "open-point"),
    point("center", 0, 2.2, "Center c equals zero.", "visual-primary", "diamond"), label("center-label", 0, 3.5, "center c=0"), annotation("radius-rule", 0, 4.4, "Inside: converges. Outside: diverges. Endpoints: test separately."),
  ], [slider("radius", "Radius R", "The radius is {value}; both open endpoints remain separate questions.", 1, 4, 0.5, 2)]),

  "u4b-power-series-interval": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 6 }, [
    segment("line", 1, 2.4, 11, 2.4, "Real line through the convergence interval.", "visual-ink", "double"), polygon("interval", [[3, 1.7], [9, 1.7], [9, 3.1], [3, 3.1]], "Centered open interval from c minus R to c plus R.", "visual-success", "dots"),
    point("left", 3, 2.4, "Left boundary awaits testing.", "visual-emphasis", "circle", "open-point"), point("center", 6, 2.4, "Expansion center.", "visual-primary", "diamond"), point("right", 9, 2.4, "Right boundary awaits testing.", "visual-emphasis", "circle", "open-point"),
    label("left-label", 3, 3.8, "c-R"), label("center-label", 6, 3.8, "c"), label("right-label", 9, 3.8, "c+R"), annotation("symmetry-note", 6, 5.1, "The radius is symmetric; endpoint inclusion need not be."),
  ]),

  "u4b-endpoint-zones": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 7 }, [
    ...box("interior", 0.5, 2.4, 4.1, 5, "|x-c| < R\nautomatic convergence", "visual-success", "dots"), ...box("endpoints", 5.2, 2.4, 8.8, 5, "|x-c| = R\ntest each series", "visual-emphasis", "crosshatch"), ...box("exterior", 9.9, 2.4, 13.5, 5, "|x-c| > R\ndivergence", "visual-secondary", "diagonal"),
    segment("interior-to-endpoint", 4.1, 3.7, 5.2, 3.7, "Move from radius result to separate endpoint tests.", "visual-guide", "double"), segment("endpoint-to-exterior", 8.8, 3.7, 9.9, 3.7, "Exterior is already decided by the radius.", "visual-guide", "double"), annotation("logic", 7, 6.2, "Radius and endpoint testing answer different questions."),
  ]),

  "u4b-cauchy-product-grid": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 8 }, [
    ...Array.from({ length: 5 }, (_, row) => Array.from({ length: 5 }, (_, col) => polygon(`cell-${row}-${col}`, [[1 + col * 1.3, 1 + row * 1.05], [2.1 + col * 1.3, 1 + row * 1.05], [2.1 + col * 1.3, 1.85 + row * 1.05], [1 + col * 1.3, 1.85 + row * 1.05]], `Coefficient product a${col} b${row}.`, row + col === 4 ? "visual-emphasis" : "visual-secondary", row + col === 4 ? "crosshatch" : "dots"))).flat(),
    annotation("diagonal", 9.4, 5.1, "One diagonal collects every pair whose indices add to n."), label("formula", 9.4, 3.2, "c_n = sum a_k b_(n-k)"),
  ]),

  "u4b-coefficient-shift": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 8 }, [
    ...box("source", 0.5, 4.8, 4.1, 6.6, "a_n x^n", "visual-primary"), ...box("derivative", 5.2, 4.8, 9, 6.6, "n a_n x^(n-1)", "visual-emphasis", "crosshatch"), ...box("integral", 9.9, 4.8, 13.5, 6.6, "a_n x^(n+1)/(n+1)", "visual-success", "dots"),
    segment("differentiate", 4.1, 5.7, 5.2, 5.7, "Differentiate: multiply coefficient and lower power.", "visual-guide", "double"), segment("integrate", 9, 5.7, 9.9, 5.7, "Integrate: raise power and divide coefficient.", "visual-guide", "double"),
    annotation("constant", 7, 2.2, "Track index shifts, the constant of integration, and endpoint behavior."),
  ]),

  "u4b-geometric-transformation-tree": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 9 }, [
    ...box("root", 4.9, 6.8, 9.1, 8.3, "1/(1-x) = sum x^n", "visual-primary"), ...box("substitute", 0.5, 3.6, 4.5, 5.2, "substitute u(x)", "visual-secondary", "dots"), ...box("differentiate", 5, 3.6, 9, 5.2, "differentiate", "visual-emphasis", "crosshatch"), ...box("integrate", 9.5, 3.6, 13.5, 5.2, "integrate", "visual-success", "diagonal"),
    segment("to-sub", 6, 6.8, 2.5, 5.2, "Transform the input and interval.", "visual-guide", "double"), segment("to-derivative", 7, 6.8, 7, 5.2, "Transform coefficients and powers.", "visual-guide", "double"), segment("to-integral", 8, 6.8, 11.5, 5.2, "Add an integration constant.", "visual-guide", "double"), annotation("domain", 7, 1.7, "Every branch carries a convergence domain with the identity."),
  ]),

  "u4b-taylor-degree-ladder": () => graph({ xMin: -2.5, xMax: 2.5, yMin: -1.5, yMax: 4.5 }, [
    series("exp", samples(Math.exp, -2.2, 1.45), "f(x)=e^x", "visual-primary", "double"), series("p1", samples((x) => 1 + x, -2.2, 2.2), "degree 1", "visual-secondary", "dashed"), series("p2", samples((x) => 1 + x + x * x / 2, -2.2, 2.2), "degree 2", "visual-emphasis", "solid"), series("p3", samples((x) => 1 + x + x * x / 2 + x ** 3 / 6, -2.2, 2.2), "degree 3", "visual-success", "solid"),
    segment("selected-x", expr("p"), -1.5, expr("p"), 4.5, "Selected input compares all approximation degrees.", "visual-ink", "dashed"), annotation("local", 0, 4, "Higher degree matches more derivatives at the center, so the local fit lasts farther."),
  ], [slider("input", "Comparison input x", "The comparison input is {value}; inspect how approximation quality changes with distance from zero.", -2, 1, 0.25, 0.5)], "x", "value", 1, 1),

  "u4b-taylor-polynomials": () => graph({ xMin: -2.5, xMax: 2.5, yMin: -1.5, yMax: 2.2 }, [
    series("sine", samples(Math.sin, -2.4, 2.4), "sin x", "visual-primary", "double"), series("linear", samples((x) => x, -2.1, 2.1), "P1=x", "visual-secondary", "dashed"), series("cubic", samples((x) => x - x ** 3 / 6, -2.4, 2.4), "P3=x-x^3/6", "visual-emphasis", "solid"), point("center", 0, 0, "All models match at the center.", "visual-success", "diamond"), annotation("match", 0, 1.8, "Taylor polynomials match successive derivatives at x=0."),
  ], [], "x", "value", 1, 0.5),

  "u4b-derivative-cycle": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 8 }, [
    ...box("sin", 4.6, 6, 7.4, 7.2, "sin x", "visual-primary"), ...box("cos", 8.3, 3.7, 11.1, 4.9, "cos x", "visual-secondary", "dots"), ...box("minus-sin", 4.6, 1.3, 7.4, 2.5, "-sin x", "visual-emphasis", "crosshatch"), ...box("minus-cos", 0.9, 3.7, 3.7, 4.9, "-cos x", "visual-success", "diagonal"),
    segment("d1", 7.4, 6.3, 8.8, 4.9, "Differentiate.", "visual-guide", "double"), segment("d2", 8.3, 3.7, 7.1, 2.5, "Differentiate.", "visual-guide", "double"), segment("d3", 4.6, 1.9, 3.2, 3.7, "Differentiate.", "visual-guide", "double"), segment("d4", 3.7, 4.9, 4.8, 6, "Differentiate and repeat.", "visual-guide", "double"), annotation("coefficients", 6, 0.5, "The four-step derivative cycle explains zeros and alternating Taylor coefficients."),
  ]),

  "u4b-two-taylor-centers": () => graph({ xMin: -2, xMax: 3, yMin: -1, yMax: 7 }, [
    series("exp", samples(Math.exp, -1.8, 1.9), "e^x", "visual-primary", "double"), series("center-zero", samples((x) => 1 + x + x * x / 2, -1.8, 2.5), "quadratic centered at 0", "visual-secondary", "dashed"), series("center-one", samples((x) => Math.E * (1 + (x - 1) + (x - 1) ** 2 / 2), -1.2, 2.5), "quadratic centered at 1", "visual-emphasis", "solid"),
    point("selected-center", expr("p"), expr("1+p+p*p/2"), "Selected center marker compares locality.", "visual-success", "diamond"), annotation("locality", 0.5, 6.3, "Changing the center moves where derivative matching is strongest."),
  ], [slider("center", "Selected center", "The selected center is {value}; compare it with the two fixed Taylor models.", 0, 1, 1, 0)], "x", "value", 1, 1),

  "u4b-standard-series-patterns": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 9 }, [
    ...box("geometric", 0.5, 5.3, 4.3, 7.4, "geometric\nall coefficients 1", "visual-primary"), ...box("exponential", 5.1, 5.3, 8.9, 7.4, "exponential\ncoefficients 1/n!", "visual-secondary", "dots"), ...box("trig", 9.7, 5.3, 13.5, 7.4, "sine/cosine\nalternating parity", "visual-emphasis", "crosshatch"),
    ...box("log", 2.8, 1.6, 6.6, 3.7, "logarithm\nalternating 1/n", "visual-success", "diagonal"), ...box("arctan", 7.4, 1.6, 11.2, 3.7, "arctangent\nodd alternating powers", "visual-secondary", "dots"), annotation("library", 7, 8.3, "Coefficient patterns make the standard series recognizable and reusable."),
  ]),

  "u4b-series-operation-pipeline": () => graph({ xMin: 0, xMax: 12, yMin: 0, yMax: 7 }, [
    ...box("source", 0.5, 4.1, 3.2, 5.8, "source series", "visual-primary"), ...box("substitution", 4.6, 4.1, 7.3, 5.8, "substitute", "visual-secondary", "dots"), ...box("result", 8.8, 4.1, 11.5, 5.8, "new series", "visual-emphasis", "crosshatch"),
    segment("first", 3.2, 4.95, 4.6, 4.95, "Apply one explicit transformation.", "visual-guide", "double"), segment("second", 7.3, 4.95, 8.8, 4.95, "Simplify coefficients and powers.", "visual-guide", "double"), segment("domain", 1.8, 2.1, 10.2, 2.1, "Transform the convergence condition on the same line.", "visual-success", "dashed"), label("domain-label", 6, 1.4, "identity + transformed interval"),
  ]),

  "u4b-binomial-partial-sums": () => graph({ xMin: -0.9, xMax: 0.9, yMin: 0, yMax: 1.6 }, [
    series("root", samples((x) => Math.sqrt(1 + x), -0.85, 0.85), "sqrt(1+x)", "visual-primary", "double"), series("p1", samples((x) => 1 + x / 2, -0.85, 0.85), "first binomial partial sum", "visual-secondary", "dashed"), series("p2", samples((x) => 1 + x / 2 - x * x / 8, -0.85, 0.85), "second binomial partial sum", "visual-emphasis", "solid"), annotation("binomial-local", 0, 1.48, "Partial sums improve near the center while the convergence interval still controls validity."),
  ], [], "x", "value", 0.25, 0.4),

  "u4b-taylor-error-envelope": () => graph({ xMin: -1.5, xMax: 1.5, yMin: -0.5, yMax: 4.5 }, [
    series("exp", samples(Math.exp, -1.4, 1.4), "e^x", "visual-primary", "double"), series("p2", samples((x) => 1 + x + x * x / 2, -1.4, 1.4), "quadratic Taylor model", "visual-emphasis", "solid"), series("upper", samples((x) => 1 + x + x * x / 2 + 0.22, -1.4, 1.4), "upper error envelope", "visual-secondary", "dashed"), series("lower", samples((x) => 1 + x + x * x / 2 - 0.22, -1.4, 1.4), "lower error envelope", "visual-secondary", "dashed"),
    segment("selected-x", expr("p"), -0.5, expr("p"), 4.5, "Selected approximation input.", "visual-ink", "dashed"), annotation("certify", 0, 4.05, "The polynomial estimates; the remainder bound certifies."),
  ], [slider("input", "Approximation input x", "The approximation input is {value}; distance from the center changes the error risk.", -1, 1, 0.25, 0.5)], "x", "value", 0.5, 1),

  "u4b-remainder-band": () => graph({ xMin: 0, xMax: 6, yMin: -0.2, yMax: 1.4 }, [
    polygon("band", [[0.5, 0.4], [5.5, 0.4], [5.5, 1], [0.5, 1]], "Certified band P_n minus B through P_n plus B.", "visual-secondary", "dots"), segment("approximation", 0.5, 0.7, 5.5, 0.7, "Polynomial approximation P_n.", "visual-primary", "double"), point("truth", 4, 0.86, "Unknown true value lies inside the certified band.", "visual-emphasis", "diamond"), label("upper", 5.6, 1, "P_n+B"), label("lower", 5.6, 0.4, "P_n-B"), annotation("bound", 3, 1.25, "|R_n(x)| <= B encloses the unknown error without knowing its sign."),
  ], [], "input", "value", 1, 0.2),

  "u4b-gaussian-series-integral": () => graph({ xMin: 0, xMax: 1.6, yMin: 0, yMax: 1.15 }, [
    series("gaussian", samples((x) => Math.exp(-x * x), 0, 1.5), "e^(-x^2)", "visual-primary", "double"), series("polynomial", samples((x) => 1 - x * x + x ** 4 / 2 - x ** 6 / 6, 0, 1.5), "series polynomial", "visual-emphasis", "solid"), polygon("area", [[0, 0], ...samples((x) => 1 - x * x + x ** 4 / 2 - x ** 6 / 6, 0, 1, 50).xValues.map((x) => [x, 1 - x * x + x ** 4 / 2 - x ** 6 / 6]), [1, 0]], "Polynomial area integrated term by term from zero to one.", "visual-secondary", "dots"), annotation("integral", 0.75, 1.05, "A finite polynomial approximates a definite integral with no elementary antiderivative."),
  ], [], "x", "height", 0.25, 0.25),

  "u4b-small-angle-comparison": () => graph({ xMin: -2, xMax: 2, yMin: -2, yMax: 2 }, [
    series("sine", samples(Math.sin, -2, 2), "sin x", "visual-primary", "double"), series("angle", samples((x) => x, -2, 2), "small-angle model x", "visual-secondary", "dashed"), series("cubic", samples((x) => x - x ** 3 / 6, -2, 2), "cubic correction", "visual-emphasis", "solid"), point("center", 0, 0, "All models agree at the center.", "visual-success", "diamond"), annotation("separate", 0, 1.75, "sin x and x agree locally; the cubic term predicts how they separate."),
  ], [], "x", "value", 1, 1),

  "u4b-ode-coefficient-machine": () => geometry({ xMin: 0, xMax: 14, yMin: 0, yMax: 8 }, [
    ...box("assume", 0.4, 4.9, 3.8, 6.6, "assume y=sum a_n x^n", "visual-primary"), ...box("substitute", 5.2, 4.9, 8.8, 6.6, "substitute into ODE", "visual-secondary", "dots"), ...box("match", 10.2, 4.9, 13.6, 6.6, "match coefficients", "visual-emphasis", "crosshatch"),
    ...box("recurrence", 5.2, 1.3, 8.8, 3, "recurrence for a_n", "visual-success", "diagonal"), segment("a", 3.8, 5.75, 5.2, 5.75, "Differentiate the assumed series as needed.", "visual-guide", "double"), segment("b", 8.8, 5.75, 10.2, 5.75, "Collect equal powers of x.", "visual-guide", "double"), segment("c", 11.9, 4.9, 8.2, 3, "Coefficient equality creates a recurrence.", "visual-guide", "double"), annotation("initial", 3, 1.9, "Initial conditions determine the starting coefficients."),
  ]),

  "u4b-uniform-error-envelope": () => graph({ xMin: 0, xMax: 1, yMin: 0, yMax: 1.1 }, [
    series("n2", samples((x) => x ** 2, 0, 1), "x^2", "visual-secondary", "dashed"), series("n6", samples((x) => x ** 6, 0, 1), "x^6", "visual-emphasis", "solid"), series("limit", samples(() => 0, 0, 1), "pointwise limit 0 for x<1", "visual-primary", "double"),
    segment("selected-x", expr("p"), 0, expr("p"), 1.1, "Selected input approaches the moving error near one.", "visual-ink", "dashed"), point("endpoint", 1, 1, "At x=1 every function still equals one.", "visual-success", "diamond"), annotation("uniform", 0.48, 1.02, "The largest error stays 1 at the endpoint, so convergence is not uniform on [0,1]."),
  ], [slider("input", "Selected input x", "The selected input is {value}; move toward one to see the error concentrate near the endpoint.", 0, 1, 0.1, 0.8)], "x", "value", 0.2, 0.25),
};

function inferCapabilities(scene) { const capabilities = new Set(["static-fallback"]); if (scene.kind === "cartesian-2d") capabilities.add("cartesian-axes"); if (scene.kind === "geometry-2d") capabilities.add("geometry-primitives"); for (const layer of scene.layers) { if (layer.kind === "sampled-series") capabilities.add("data-series"); if (["open-point", "closed-point"].includes(layer.kind)) capabilities.add("open-closed-points"); if (["annotation", "label"].includes(layer.kind)) capabilities.add("annotations"); } if (scene.controls.length) capabilities.add("parameter-controls"); return [...capabilities]; }
function makeSpec(brief) {
  const factory = sceneDefinitions[brief.visual_id]; if (!factory) throw new Error(`Unit 4B visual ${brief.visual_id} lacks an explicit scene definition.`);
  if (![STATIC, INTERACTIVE].includes(brief.recommended_renderer)) throw new Error(`Unit 4B visual ${brief.visual_id} names unsupported renderer ${brief.recommended_renderer}.`);
  const scene = factory(); if (scene.kind !== brief.visual_kind) throw new Error(`Unit 4B visual ${brief.visual_id} expected ${brief.visual_kind}; received ${scene.kind}.`);
  const interactive = brief.recommended_renderer === INTERACTIVE; const longDescription = `${plain(brief.long_description)} ${plain(brief.learning_purpose)} ${plain(brief.misconception_control)}`; const caption = `${brief.title}. ${brief.learning_purpose}`;
  return { schemaVersion: 1, id: `${UNIT}-${brief.visual_id.toLowerCase()}`, kind: scene.kind, title: text(brief.title), caption: text(caption), learningPurpose: plain(brief.learning_purpose), longDescription, coordinateSpace: scene.coordinateSpace, viewport: scene.viewport, axes: scene.axes, panels: scene.panels, layers: scene.layers, controls: scene.controls,
    accessibility: { ariaLabel: plain(caption), summary: longDescription, readingOrder: [...scene.layers.map((layer) => layer.id), ...scene.controls.map((control) => control.id)], colorIndependentDescription: `Written labels, distinct line styles, markers, and fill patterns communicate every relationship in ${plain(brief.title).toLowerCase()}; color is never the only cue.`, ...(interactive ? { keyboardInstructions: "Use Tab to reach the bounded control, then use arrow keys to change one value at a time." } : {}), controlInstructions: scene.controls.map((control) => plain(control.label.segments[0].text)), reducedMotion: interactive ? "disable-animation" : "not-applicable", staticFallbackEquivalent: true },
    print: { representation: "generated-svg", caption: text(caption), grayscaleSafe: true, pageBreak: "avoid", widthInches: 7.1 }, performance: { maxSamples: 2048, maxAdaptiveDepth: 12, maxAstNodes: 192, maxAstDepth: 24, maxOperationsPerEvaluation: 2048, maxPayloadBytes: 65536, maxAnimationFps: 30, activation: interactive ? "near-viewport" : "none" }, requiredCapabilities: inferCapabilities(scene), preferredRenderer: interactive ? "prefer-interactive" : "prefer-static", provenance: { route: `/${brief.route_id.replace(/^\/+|\/+$/g, "")}/`, sourceFile: `content/calculus/units/${UNIT}/visual-specs.v1.json`, authoringId: `source-${brief.visual_id.toLowerCase()}`, visibility: "public" } };
}

export async function authorUnit4bVisuals({ root, checkOnly }) {
  const directory = resolve(root, "content/calculus/units/unit-4b"); const briefs = JSON.parse(await readFile(resolve(directory, "handoff/visual-authoring-briefs.v3.json"), "utf8")).visual_briefs;
  const briefIds = briefs.map((brief) => brief.visual_id); const definitionIds = Object.keys(sceneDefinitions); const missing = briefIds.filter((id) => !definitionIds.includes(id)); const extra = definitionIds.filter((id) => !briefIds.includes(id));
  if (missing.length || extra.length) throw new Error(`Unit 4B explicit visual inventory mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
  const specs = briefs.map(makeSpec); if (specs.length !== 20 || new Set(specs.map((spec) => spec.id)).size !== 20) throw new Error("Unit 4B requires exactly 20 unique explicit visual specs."); if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== 6) throw new Error("Unit 4B requires exactly six BetterGrades Interactive 2D scenes.");
  const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: "unit-4b-calculus-visuals", migrationOnly: false, explicitDefinitionsOnly: true, visuals: specs }, null, 2)}\n`; const outputPath = resolve(directory, "visual-specs.v1.json");
  if (checkOnly) { if ((await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n") !== output) throw new Error("unit-4b visual specs are stale."); } else await writeFile(outputPath, output);
  console.log(`${checkOnly ? "Verified" : "Authored"} 20 Unit 4B explicit VisualSpec v1 records (14 static, six BetterGrades Interactive 2D).`);
}
