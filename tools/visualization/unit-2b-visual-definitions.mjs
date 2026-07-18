import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UNIT = "unit-2b";
const STATIC = "static-svg";
const INTERACTIVE = "bettergrades-interactive-2d";
const JSX = "jsxgraph";

function plain(value) {
  return String(value)
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\\(?:infty|to|mapsto|Rightarrow|leq|geq|approx)\b/g, (value) => ({ "\\infty": "infinity", "\\to": "to", "\\mapsto": "maps to", "\\Rightarrow": "implies", "\\leq": "at most", "\\geq": "at least", "\\approx": "approximately" }[value]))
    .replace(/\\[A-Za-z]+/g, " ")
    .replace(/[{}^_]/g, " ")
    .replace(/``|''/g, '"')
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

const series = (id, data, label, token = "visual-primary", lineStyle = "solid", panelId) => ({
  id, kind: "sampled-series", ...(panelId ? { panelId } : {}), label: text(label),
  geometry: { ...data, connect: true },
  presentation: style(token, `${label}; ${lineStyle} line.`, { lineStyle }),
});
const functionLayer = (id, latex, min, max, label, token = "visual-primary", lineStyle = "solid") => ({
  id, kind: "function", label: text(label), geometry: { expression: expr(latex), variable: "x", domain: { min, max, includeMin: true, includeMax: true } },
  presentation: style(token, `${label}; ${lineStyle} line.`, { lineStyle }),
});
const point = (id, x, y, label, token = "visual-ink", markerShape = "circle") => ({
  id, kind: "closed-point", label: text(label), geometry: { position: { x, y } },
  presentation: style(token, `Filled ${markerShape} marks ${label}.`, { fillToken: token, markerShape }),
});
const openPoint = (id, x, y, label, token = "visual-emphasis") => ({
  id, kind: "open-point", label: text(label), geometry: { position: { x, y } },
  presentation: style(token, `Open circle marks ${label}.`, { markerShape: "circle" }),
});
const segment = (id, x1, y1, x2, y2, label, token = "visual-guide", lineStyle = "solid") => ({
  id, kind: "segment", label: text(label), geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, `${label}; ${lineStyle} segment.`, { lineStyle }),
});
const arrow = (id, x1, y1, x2, y2, label, token = "visual-guide") => ({
  id, kind: "direction-arrow", geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, label),
});
const polygon = (id, coordinates, label, token = "visual-primary", pattern = "diagonal") => ({
  id, kind: "polygon", geometry: { points: coordinates.map(([x, y]) => ({ x, y })), closed: true },
  presentation: style(token, label, { fillToken: token, pattern }),
});
const label = (id, x, y, content, token = "visual-ink") => ({
  id, kind: "label", geometry: { position: { x, y }, content: text(content) }, presentation: style(token, `Label: ${content}.`),
});
const annotation = (id, x, y, content, token = "visual-ink") => ({
  id, kind: "annotation", geometry: { anchor: { x, y }, content: text(content) }, presentation: style(token, `Annotation: ${content}.`),
});
const withoutCanvasLabel = (layer) => {
  const unlabelledLayer = { ...layer };
  delete unlabelledLayer.label;
  return unlabelledLayer;
};

function axes(xLabel = "input x", yLabel = "output y", xStep, yStep) {
  return { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text(xLabel), scale: "linear", tickMode: xStep ? "fixed-step" : "automatic", ...(xStep ? { tickStep: xStep } : {}), showGrid: true },
    { id: "y-axis", orientation: "y", label: text(yLabel), scale: "linear", tickMode: yStep ? "fixed-step" : "automatic", ...(yStep ? { tickStep: yStep } : {}), showGrid: true },
  ] };
}

function diagram(nodes, arrows = [], labels = []) {
  const layers = [];
  for (const [id, x, y, width, height, content, token = "visual-primary"] of nodes) {
    layers.push(polygon(`${id}-box`, [[x, y], [x + width, y], [x + width, y + height], [x, y + height]], `Box: ${content}.`, token, id.length % 2 ? "dots" : "diagonal"));
    layers.push(label(`${id}-label`, x + width / 2, y + height / 2, content));
  }
  for (const [id, x1, y1, x2, y2, content = "Follow the next step", showLabel = true] of arrows) {
    layers.push(arrow(`${id}-arrow`, x1, y1, x2, y2, content));
    if (content && showLabel) layers.push(label(`${id}-label`, (x1 + x2) / 2, (y1 + y2) / 2 + 0.28, content));
  }
  for (const [id, x, y, content, token] of labels) layers.push(label(`${id}-label`, x, y, content, token));
  return { kind: "geometry-2d", coordinateSpace: { type: "diagram-2d", variables: ["horizontal", "vertical"], unitsRequired: false }, viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7.5, aspectRatio: 1.72, padding: 0.04 }, axes: { mode: "none", reason: "This is a labeled instructional diagram rather than a numeric graph." }, panels: [], layers, controls: [] };
}

function graph(viewport, layers, controls = [], xLabel = "input x", yLabel = "output y") {
  return { kind: "cartesian-2d", coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.05 }, axes: axes(xLabel, yLabel), panels: [], layers, controls };
}

function geometry(viewport, layers, controls = []) {
  return { kind: "geometry-2d", coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false }, viewport: { ...viewport, aspectRatio: 1.72, padding: 0.05 }, axes: { mode: "none", reason: "The labeled geometry and dimensions carry the mathematical meaning." }, panels: [], layers, controls };
}

const sceneDefinitions = {
  "2B-V01": () => diagram([
    ["situation", 0.2, 4.8, 2.15, 1.25, "Situation + question"], ["variables", 2.65, 4.8, 2.15, 1.25, "Variables + units", "visual-secondary"], ["relation", 5.1, 4.8, 2.15, 1.25, "Relationship", "visual-emphasis"], ["derivative", 7.55, 4.8, 2.15, 1.25, "Differentiate", "visual-success"], ["meaning", 10, 4.8, 1.8, 1.25, "Interpret"],
    ["check", 4.25, 1.25, 3.5, 1.25, "Check units, sign, domain, scale", "visual-guide"],
  ], [["a", 2.4, 5.42, 2.58, 5.42, "Name variables", false], ["b", 4.85, 5.42, 5.03, 5.42, "Build the model", false], ["c", 7.3, 5.42, 7.48, 5.42, "Differentiate", false], ["d", 9.75, 5.42, 9.93, 5.42, "Return to context", false], ["e", 10.9, 4.65, 7.9, 2.75, "verify"], ["f", 4.1, 1.88, 2, 4.65, "revise if unreasonable"]], [["claim", 6, 0.45, "The derivative is the middle of a complete model—not the whole solution."]]),

  "2B-V02": () => graph({ xMin: 0, xMax: 6.4, yMin: -5.8, yMax: 11.8 }, [
    series("position", samples((t) => 0.32 * t ** 3 - 2.4 * t ** 2 + 4.2 * t + 6, 0, 6), "position s(t), top band", "visual-primary"),
    series("velocity", samples((t) => 0.96 * t ** 2 - 4.8 * t + 4.2, 0, 6), "velocity v(t), middle band", "visual-secondary", "dashed"),
    series("acceleration", samples((t) => 1.92 * t - 4.8 - 4.2, 0, 6), "acceleration a(t), lower band", "visual-emphasis", "dotted"),
    segment("time-guide", 2.5, -5.4, 2.5, 11.4, "One time read vertically through all three views", "visual-guide", "dashed"),
    label("position-label", 0.75, 10.6, "position"), label("velocity-label", 0.75, 3.2, "velocity"), label("acceleration-label", 0.85, -4.75, "acceleration"),
  ], [], "time t", "aligned values"),

  "2B-V03": () => diagram([
    ["pp", 0.35, 4.6, 2.55, 1.45, "v > 0 and a > 0: speeding up", "visual-success"], ["pn", 3.25, 4.6, 2.55, 1.45, "v > 0 and a < 0: slowing down", "visual-secondary"],
    ["np", 6.2, 4.6, 2.55, 1.45, "v < 0 and a > 0: slowing down", "visual-secondary"], ["nn", 9.1, 4.6, 2.55, 1.45, "v < 0 and a < 0: speeding up", "visual-success"],
    ["rule", 2.6, 1.25, 6.8, 1.45, "Same signs grow |v|; opposite signs shrink |v|", "visual-emphasis"],
  ], [["one", 1.6, 4.45, 4.2, 2.85, "compare signs"], ["two", 10.35, 4.45, 7.8, 2.85, "compare signs"]], [["note", 6, 0.4, "Negative velocity means negative direction—not automatically slowing down."]]),

  "2B-E01": () => graph({ xMin: -2.4, xMax: 2.4, yMin: -4.5, yMax: 4.5 }, [
    series("function", samples((x) => x ** 3 - 3 * x, -2.2, 2.2), "f(x) = x^3 - 3x", "visual-primary"),
    series("derivative", samples((x) => 3 * x * x - 3, -2.2, 2.2), "f'(x) = 3x^2 - 3", "visual-secondary", "dashed"),
    point("critical-left", -1, 0, "f' is zero at x = -1", "visual-emphasis", "diamond"), point("critical-right", 1, 0, "f' is zero at x = 1", "visual-emphasis", "diamond"),
    annotation("sign-note", 0, 3.65, "Above axis: f increases. Below axis: f decreases."),
  ]),

  "2B-V04": () => graph({ xMin: 0, xMax: 6, yMin: 16, yMax: 27 }, [
    series("temperature", { xValues: [0, 1, 2, 3, 4, 5, 6], yValues: [18, 20.4, 22.3, 23.8, 24.9, 25.6, 26] }, "measured data", "visual-primary"),
    point("target", 3, 23.8, "target t=3", "visual-emphasis", "diamond"),
    segment("backward", 2, 22.3, 3, 23.8, "backward difference", "visual-secondary", "dashed"),
    segment("forward", 3, 23.8, 4, 24.9, "forward difference", "visual-emphasis", "dotted"),
    segment("central", 2, 22.3, 4, 24.9, "central difference", "visual-success", "double"),
    annotation("estimate", 4.45, 18.2, "Include units and data spacing."),
  ], [], "time t (minutes)", "temperature (degrees)"),

  "2B-E02": () => graph({ xMin: 0, xMax: 9, yMin: 0, yMax: 4.1 }, [
    functionLayer("sqrt-curve", "\\sqrt{x}", 0, 9, "f(x) = sqrt(x)", "visual-primary"),
    functionLayer("linearization", "2+(x-4)/4", 0, 9, "tangent L(x) = 2 + (x-4)/4", "visual-success", "dashed"),
    point("base-point", 4, 2, "contact point (4, 2)", "visual-ink", "diamond"),
    point("moving-point", expr("p"), expr("\\sqrt{p}"), "selected point on the square-root curve", "visual-emphasis"),
    annotation("local-note", 6.4, 0.55, "Near x=4, curve and tangent nearly overlap."),
  ], [{ id: "p-control", kind: "slider", label: text("Compare at x"), announcementTemplate: "x is {value}; compare square root x with its tangent estimate.", parameter: "p", min: 2, max: 7, step: 0.25, initial: 4.5 }], "x", "square root of x"),

  "2B-V05": () => graph({ xMin: 2.8, xMax: 5.25, yMin: 1.5, yMax: 2.45 }, [
    series("curve", samples(Math.sqrt, 2.8, 5.25), "square-root curve", "visual-primary"),
    series("tangent", samples((x) => 2 + (x - 4) / 4, 2.8, 5.25), "linearization at x=4", "visual-success", "dashed"),
    point("known", 4, 2, "known point (4, 2)", "visual-ink"), point("estimate", 4.5, 2.125, "linear estimate 2.125", "visual-emphasis", "diamond"),
    segment("dx", 4, 1.7, 4.5, 1.7, "horizontal move dx = 0.5", "visual-secondary"),
    segment("dy", 4.5, 2, 4.5, 2.125, "estimated vertical change 0.125", "visual-emphasis", "dashed"),
  ]),

  "2B-V06": () => graph({ xMin: 0.4, xMax: 2.1, yMin: 0.2, yMax: 4.5 }, [
    series("curve", samples((x) => x * x, 0.4, 2.1), "actual curve y=x^2", "visual-primary"),
    series("tangent", samples((x) => 2 * x - 1, 0.4, 2.1), "tangent at x=1", "visual-success", "dashed"),
    point("start", 1, 1, "starting point", "visual-ink"), point("actual", 1.7, 2.89, "actual new output", "visual-primary"), point("linear", 1.7, 2.4, "tangent estimate", "visual-emphasis", "diamond"),
    segment("dx", 1, 0.55, 1.7, 0.55, "dx = 0.7", "visual-secondary"), segment("dy", 1.7, 1, 1.7, 2.4, "dy = 1.4", "visual-success", "dashed"), segment("error", 1.7, 2.4, 1.7, 2.89, "approximation error", "visual-emphasis", "dotted"),
  ]),

  "2B-V07": () => graph({ xMin: 0.8, xMax: 2.35, yMin: -1, yMax: 3.6 }, [
    series("curve", samples((x) => x * x - 2, 0.8, 2.35), "f(x)=x^2-2", "visual-primary"),
    series("tangent-zero", samples((x) => 4 * x - 6, 0.8, 2.35), "tangent at x0=2", "visual-secondary", "dashed"),
    series("tangent-one", samples((x) => 3 * x - 4.25, 0.8, 2.35), "tangent at x1=1.5", "visual-emphasis", "dotted"),
    point("x-zero", 2, 2, "start (2,2)"), point("x-one", 1.5, 0, "first intercept x1=1.5", "visual-secondary", "diamond"), point("x-two", 1.416667, 0, "second intercept near 1.4167", "visual-emphasis", "diamond"),
    annotation("root", 1.43, 3.05, "Intercepts move toward sqrt(2)."),
  ]),

  "2B-E03": () => graph({ xMin: 0.8, xMax: 2.35, yMin: -1, yMax: 3.6 }, [
    functionLayer("newton-curve", "x^2-2", 0.8, 2.35, "f(x)=x^2-2", "visual-primary"),
    functionLayer("current-tangent", "2*n*x-n^2-2", 0.8, 2.35, "tangent at current iterate n", "visual-emphasis", "dashed"),
    point("current-point", expr("n"), expr("n^2-2"), "current point on curve", "visual-ink"),
    point("next-intercept", expr("(n^2+2)/(2*n)"), 0, "next Newton estimate", "visual-success", "diamond"),
    annotation("formula", 1.62, 3.05, "next = n - f(n)/f'(n)"),
  ], [{ id: "n-control", kind: "step-control", label: text("Newton iteration"), announcementTemplate: "Current estimate is {value}; the tangent intercept is the next estimate.", parameter: "n", values: [2, 1.5, 1.416667, 1.414216], initialIndex: 0 }]),

  "2B-V08": () => diagram([
    ["draw", 0.3, 4.7, 2.45, 1.35, "1. Draw variables"], ["relate", 3.25, 4.7, 2.45, 1.35, "2. Write one relation", "visual-secondary"], ["differentiate", 6.2, 4.7, 2.45, 1.35, "3. Differentiate in time", "visual-emphasis"], ["substitute", 9.15, 4.7, 2.45, 1.35, "4. Substitute snapshot", "visual-success"],
    ["interpret", 3.3, 1.15, 5.4, 1.35, "5. Solve, add units, check sign", "visual-guide"],
  ], [["a", 2.8, 5.38, 3.18, 5.38, "Model the relationship", false], ["b", 5.75, 5.38, 6.13, 5.38, "Differentiate before substituting", false], ["c", 8.7, 5.38, 9.08, 5.38, "Use the snapshot values", false], ["d", 10.35, 4.55, 7.5, 2.65, "interpret"]], [["order", 6, 0.42, "Relationship → differentiate → substitute. Snapshot numbers come last."]]),

  "2B-V09": () => geometry({ xMin: -0.8, xMax: 8.8, yMin: -0.7, yMax: 7.3 }, [
    segment("wall", 0, 0, 0, 7, "vertical wall", "visual-ink"), segment("ground", 0, 0, 8.5, 0, "level ground", "visual-ink"),
    segment("ladder", 0, 6, 8, 0, "fixed ladder L=10", "visual-primary", "double"),
    point("top", 0, 6, "ladder top y=6", "visual-emphasis"), point("foot", 8, 0, "ladder foot x=8", "visual-secondary", "diamond"),
    arrow("dx", 6.7, 0.55, 8.1, 0.55, "foot moves right: dx/dt > 0", "visual-secondary"), arrow("dy", 0.55, 6.2, 0.55, 4.8, "top moves down: dy/dt < 0", "visual-emphasis"),
    label("constraint", 4.5, 6.55, "x^2 + y^2 = L^2"), label("rates", 4.6, 5.75, "2x dx/dt + 2y dy/dt = 0"),
  ], [{ id: "foot-control", kind: "draggable-point", label: text("Move the ladder foot along the ground"), announcementTemplate: "The foot moves along the ground while the ladder length remains fixed.", targetLayerId: "foot", constraintLayerId: "ground", keyboardStep: 0.25 }]),

  "2B-V10": () => geometry({ xMin: -6, xMax: 6, yMin: -0.7, yMax: 8.2 }, [
    segment("cone-left", 0, 7.5, -5, 0, "tank side"), segment("cone-right", 0, 7.5, 5, 0, "tank side"), segment("rim", -5, 0, 5, 0, "tank radius R"),
    polygon("water", [[0, 7.5], [-2.7, 3.45], [2.7, 3.45]], "water cone with depth h and radius r", "visual-secondary", "dots"),
    segment("depth", 0, 7.5, 0, 3.45, "water depth h", "visual-emphasis", "dashed"), segment("radius", 0, 3.45, 2.7, 3.45, "water radius r", "visual-success"),
    label("similarity", -3.2, 7.15, "r/h = R/H"), label("volume", 3.05, 6.45, "V = (1/3) pi r^2 h"), label("order", 0, 0.75, "Use similarity before differentiating volume."),
  ]),

  "2B-V11": () => geometry({ xMin: -0.6, xMax: 12.6, yMin: -0.7, yMax: 7.8 }, [
    withoutCanvasLabel(segment("ground", 0, 0, 12, 0, "ground")), withoutCanvasLabel(segment("lamp", 0, 0, 0, 7, "light height H", "visual-primary")), withoutCanvasLabel(point("light", 0, 7, "light source", "visual-emphasis")),
    withoutCanvasLabel(segment("person", 7, 0, 7, 3, "person height h", "visual-secondary")), withoutCanvasLabel(segment("ray", 0, 7, 11.2, 0, "light ray to shadow tip", "visual-guide", "dashed")),
    withoutCanvasLabel(segment("walk", 0, -0.3, 7, -0.3, "person distance x")), withoutCanvasLabel(segment("shadow", 7, -0.3, 11.2, -0.3, "shadow length s", "visual-emphasis")),
    label("lamp-label", 0.55, 5.2, "H"), label("person-label", 7.45, 2.0, "h"), label("walk-label", 3.5, -0.52, "x"), label("shadow-label", 9.1, -0.52, "s"),
    label("large", 4.1, 6.4, "large base x+s"), label("relation", 9, 6.4, "H/(x+s) = h/s"), withoutCanvasLabel(point("tip", 11.2, 0, "shadow tip", "visual-ink", "diamond")),
  ]),

  "2B-V12": () => geometry({ xMin: -0.7, xMax: 9.4, yMin: -0.7, yMax: 6.8 }, [
    segment("path", 0, 5, 9, 5, "target path"), segment("offset", 0, 0, 0, 5, "fixed perpendicular distance d"),
    segment("line-of-sight", 0, 0, expr("p"), 5, "line of sight", "visual-primary", "double"), point("station", 0, 0, "tracking station", "visual-ink"), point("target", expr("p"), 5, "moving target", "visual-emphasis", "diamond"),
    segment("horizontal", 0, 0, expr("p"), 0, "horizontal position x", "visual-secondary", "dashed"),
    label("angle", 1.25, 0.75, "theta"), label("relation", 5.5, 1.15, "tan(theta) = d/x (for this angle)"),
  ], [{ id: "p-control", kind: "slider", label: text("Target position x"), announcementTemplate: "Target position is {value}; the line-of-sight angle changes.", parameter: "p", min: 2, max: 8, step: 0.5, initial: 5 }]),

  "2B-V13": () => graph({ xMin: -3.4, xMax: 3.4, yMin: -2.2, yMax: 12.4 }, [
    series("curve", samples((x) => 0.22 * x ** 4 - 1.45 * x ** 2 + 0.4 * x + 2, -3.2, 3.2), "function on a closed interval", "visual-primary"),
    point("left-end", -3.2, 8.941, "left endpoint", "visual-ink"), point("critical-one", -1.881, -1.129, "critical x≈-1.881", "visual-emphasis", "diamond"), point("critical-two", 0.139, 2.028, "critical x≈0.139", "visual-secondary", "diamond"), point("critical-three", 1.742, 0.323, "critical x≈1.742", "visual-emphasis", "diamond"), point("right-end", 3.2, 11.501, "right endpoint", "visual-ink"),
    annotation("compare", 0, 10.6, "Evaluate every candidate; then compare function values."),
  ]),

  "2B-V14": () => graph({ xMin: -0.4, xMax: 5.4, yMin: -1, yMax: 26 }, [
    functionLayer("curve", "x^2", 0, 5.2, "f(x)=x^2", "visual-primary"),
    { id: "secant", kind: "secant-line", label: text("secant slope"), geometry: { firstPoint: { x: 0, y: 0 }, secondPoint: { x: expr("b"), y: expr("b^2") } }, presentation: style("visual-emphasis", "Dashed secant records the average slope.", { lineStyle: "dashed" }) },
    { id: "matching-tangent", kind: "tangent-line", label: text("parallel tangent"), geometry: { point: { x: expr("b/2"), y: expr("b^2/4") }, slope: expr("b") }, presentation: style("visual-success", "Double tangent has the same slope as the secant.", { lineStyle: "double" }) },
    point("left", 0, 0, "a=0"), point("right", expr("b"), expr("b^2"), "endpoint b", "visual-emphasis"), point("mvt-point", expr("b/2"), expr("b^2/4"), "c=b/2", "visual-success", "diamond"),
    annotation("hypotheses", 1.2, 23.5, "MVT: continuous on [a,b], differentiable inside."),
  ], [{ id: "b-control", kind: "slider", label: text("Right endpoint b"), announcementTemplate: "Right endpoint b is {value}; the matching point is halfway for this curve.", parameter: "b", min: 2, max: 5, step: 0.5, initial: 4 }]),

  "2B-V15": () => geometry({ xMin: -5.2, xMax: 5.2, yMin: -1, yMax: 5.2 }, [
    segment("axis", -4.8, 2.6, 4.8, 2.6, "number line divided by critical numbers", "visual-ink"), point("critical-left", -2, 2.6, "critical number -2", "visual-emphasis", "diamond"), point("critical-right", 1, 2.6, "critical number 1", "visual-emphasis", "diamond"),
    arrow("rise-left", -4.5, 1.5, -2.4, 3.9, "f increases where f' is positive", "visual-success"), arrow("fall", -1.7, 3.9, 0.7, 1.5, "f decreases where f' is negative", "visual-secondary"), arrow("rise-right", 1.3, 1.5, 4.4, 3.9, "f increases where f' is positive", "visual-success"),
    label("sign-left", -3.4, 0.5, "f' > 0"), label("sign-middle", -0.5, 0.5, "f' < 0"), label("sign-right", 3, 0.5, "f' > 0"), label("max", -2, 4.7, "local maximum"), label("min", 1, 4.7, "local minimum"),
  ]),

  "2B-V16": () => graph({ xMin: -4.2, xMax: 4.2, yMin: -0.5, yMax: 8.5 }, [
    series("up", samples((x) => 0.45 * (x + 2.2) ** 2 + 0.4, -4, -0.35), "concave up: slopes increase", "visual-primary"),
    series("down", samples((x) => -0.45 * (x - 2.2) ** 2 + 7.8, 0.35, 4), "concave down: slopes decrease", "visual-secondary"),
    segment("up-tangent-one", -3.5, 2.7, -2.5, 0.7, "negative tangent slope", "visual-emphasis", "dashed"), segment("up-tangent-two", -1.9, 0.35, -0.9, 1.25, "positive tangent slope", "visual-success", "dashed"),
    segment("down-tangent-one", 0.8, 5.8, 1.8, 8, "positive tangent slope", "visual-success", "dashed"), segment("down-tangent-two", 2.7, 7.65, 3.7, 5.55, "negative tangent slope", "visual-emphasis", "dashed"),
    annotation("up-note", -2.3, 7.6, "f'' > 0"), annotation("down-note", 2.3, 1.0, "f'' < 0"),
  ]),

  "2B-V17": () => graph({ xMin: -5.2, xMax: 5.2, yMin: -1.2, yMax: 1.2 }, [
    series("curve", samples((x) => x / (x * x + 1), -5, 5, 121), "f(x)=x/(x^2+1)", "visual-primary"), segment("horizontal-asymptote", -5, 0, 5, 0, "horizontal asymptote y=0", "visual-guide", "dashed"),
    point("minimum", -1, -0.5, "local minimum (-1,-1/2)", "visual-emphasis", "diamond"), point("intercept", 0, 0, "intercept and symmetry center"), point("maximum", 1, 0.5, "local maximum (1,1/2)", "visual-success", "diamond"),
    openPoint("inflection-left", -1.732, -0.433, "inflection near -sqrt(3)", "visual-secondary"), openPoint("inflection-right", 1.732, 0.433, "inflection near sqrt(3)", "visual-secondary"),
    annotation("story", 0, 1.02, "Signs of f' and f'' justify every turn and bend."),
  ]),

  "2B-E04": () => graph({ xMin: -5.2, xMax: 5.2, yMin: -1.2, yMax: 1.2 }, [
    functionLayer("curve", "x/(x^2+1)", -5, 5, "function f", "visual-primary"),
    segment("asymptote", -5, 0, 5, 0, "end behavior y=0", "visual-guide", "dashed"),
    point("minimum", -1, -0.5, "minimum at x=-1", "visual-emphasis", "diamond"), point("origin", 0, 0, "intercept and odd symmetry center"), point("maximum", 1, 0.5, "maximum at x=1", "visual-success", "diamond"),
    openPoint("inflection-left", -1.732, -0.433, "left inflection", "visual-secondary"), openPoint("inflection-right", 1.732, 0.433, "right inflection", "visual-secondary"),
    annotation("derivative-sign", -3.1, 0.85, "f': down, up, down across -1 and 1"), annotation("concavity-sign", 3.05, -0.92, "f'': bends change at ±sqrt(3) and 0"),
  ], [
    { id: "turning-toggle", kind: "toggle", label: text("Show extrema evidence"), announcementTemplate: "Extrema evidence is {value}.", targetLayerIds: ["minimum", "maximum", "derivative-sign"], initial: true },
    { id: "concavity-toggle", kind: "toggle", label: text("Show concavity evidence"), announcementTemplate: "Concavity evidence is {value}.", targetLayerIds: ["inflection-left", "origin", "inflection-right", "concavity-sign"], initial: true },
  ]),

  "2B-V18": () => geometry({ xMin: -0.5, xMax: 12.5, yMin: -0.8, yMax: 7.5 }, [
    polygon("rectangle", [[0.7, 1.2], [5.4, 1.2], [5.4, 4.8], [0.7, 4.8]], "rectangle with width x and length y", "visual-primary", "dots"),
    segment("width", 0.7, 0.75, 5.4, 0.75, "width x", "visual-secondary"), segment("length", 5.8, 1.2, 5.8, 4.8, "length y", "visual-emphasis"),
    polygon("constraint-box", [[7, 4.4], [12, 4.4], [12, 6.4], [7, 6.4]], "constraint box", "visual-secondary", "diagonal"),
    polygon("objective-box", [[7, 1.25], [12, 1.25], [12, 3.25], [7, 3.25]], "objective box", "visual-success", "crosshatch"),
    label("constraint", 9.5, 5.4, "Constraint: 2x+2y=P ⇒ y=P/2-x"), label("objective", 9.5, 2.25, "Objective: A(x)=x(P/2-x)"),
    arrow("eliminate", 9.5, 4.25, 9.5, 3.4, "eliminate one variable"), label("domain", 3.05, 6.5, "Feasible domain: 0 < x < P/2"),
  ]),

  "2B-V19": () => geometry({ xMin: -0.7, xMax: 12.7, yMin: -0.7, yMax: 8.1 }, [
    polygon("sheet", [[1, 1], [11, 1], [11, 7], [1, 7]], "original L by W sheet", "visual-primary", "dots"),
    polygon("cut-one", [[1, 1], [expr("1+x"), 1], [expr("1+x"), expr("1+x")], [1, expr("1+x")]], "corner cut x by x", "visual-emphasis", "crosshatch"),
    polygon("cut-two", [[expr("11-x"), 1], [11, 1], [11, expr("1+x")], [expr("11-x"), expr("1+x")]], "corner cut x by x", "visual-emphasis", "crosshatch"),
    polygon("cut-three", [[1, expr("7-x")], [expr("1+x"), expr("7-x")], [expr("1+x"), 7], [1, 7]], "corner cut x by x", "visual-emphasis", "crosshatch"),
    polygon("cut-four", [[expr("11-x"), expr("7-x")], [11, expr("7-x")], [11, 7], [expr("11-x"), 7]], "corner cut x by x", "visual-emphasis", "crosshatch"),
    segment("base-length", expr("1+x"), 0.55, expr("11-x"), 0.55, "base length L-2x", "visual-secondary"), segment("base-width", 11.45, expr("1+x"), 11.45, expr("7-x"), "base width W-2x", "visual-success"),
    label("volume", 6, 4, "V(x)=x(L-2x)(W-2x)"), label("feasible", 6, 7.55, "0 < x < min(L,W)/2"),
  ], [{ id: "x-control", kind: "slider", label: text("Corner cut x"), announcementTemplate: "Cut size is {value}; the remaining base dimensions shrink twice as fast.", parameter: "x", min: 0.5, max: 2.5, step: 0.25, initial: 1 }]),

  "2B-V20": () => graph({ xMin: 0, xMax: 10.3, yMin: -11.5, yMax: 67 }, [
    series("revenue", samples((q) => 8 * q - 0.25 * q * q + 8, 0, 10), "R(q)", "visual-primary"), series("cost", samples((q) => 0.25 * q * q + 2 * q + 8, 0, 10), "C(q)", "visual-secondary", "dashed"),
    series("marginal-revenue", samples((q) => 8 - 0.5 * q - 12, 0, 10), "MR(q)-12", "visual-emphasis"), series("marginal-cost", samples((q) => 0.5 * q + 2 - 12, 0, 10), "MC(q)-12", "visual-success", "dashed"),
    segment("quantity-guide", 6, -11, 6, 65.5, "q=6: MR=MC", "visual-guide", "dotted"),
    annotation("decision", 7.45, 58, "Profit rises for MR>MC; q=6 is the candidate."),
  ], [], "production q", "total and marginal values"),

  "2B-V21": () => diagram([
    ["evaluate", 0.3, 4.75, 2.45, 1.35, "Evaluate limits"], ["form", 3.2, 4.75, 2.45, 1.35, "Is it 0/0 or infinity/infinity?", "visual-secondary"],
    ["apply", 6.15, 4.75, 2.45, 1.35, "Differentiate top and bottom", "visual-emphasis"], ["recheck", 9.1, 4.75, 2.45, 1.35, "Evaluate again", "visual-success"],
    ["other", 3.2, 1.2, 5.4, 1.35, "Other form: simplify, transform, or use another theorem", "visual-guide"],
  ], [["a", 2.8, 5.42, 3.13, 5.42, "Identify the limiting form", false], ["b", 5.7, 5.42, 6.08, 5.42, "Verified form", false], ["c", 8.65, 5.42, 9.03, 5.42, "Evaluate again", false], ["no", 4.4, 4.6, 5.2, 2.75, "no"]], [["warning", 6, 0.42, "A complicated quotient is not automatically an indeterminate form."]]),

  "2B-V22": () => diagram([
    ["product", 0.3, 4.8, 2.45, 1.3, "0·infinity: rewrite"], ["difference", 3.2, 4.8, 2.45, 1.3, "infinity-infinity: combine", "visual-secondary"], ["power", 6.1, 4.8, 2.45, 1.3, "Power form: take logs", "visual-emphasis"],
    ["quotient", 9, 4.8, 2.45, 1.3, "Create 0/0 or infinity/infinity", "visual-success"], ["rule", 3.3, 1.25, 5.4, 1.35, "Only then consider L'Hopital's Rule", "visual-guide"],
  ], [["a", 2.8, 5.45, 8.93, 5.45, "Transform the product", false], ["b", 5.7, 5.45, 8.93, 5.45, "Transform the difference", false], ["c", 8.6, 5.45, 8.93, 5.45, "Transform the power", false], ["d", 10.2, 4.65, 7.8, 2.75, "verify form"]]),

  "2B-V23": () => graph({ xMin: 0, xMax: 12, yMin: -1, yMax: 7.2 }, [
    series("concentration", samples((t) => 4.8 * t * Math.exp(-0.42 * t), 0, 12), "C(t)", "visual-primary"),
    series("rate", samples((t) => 4.8 * Math.exp(-0.42 * t) * (1 - 0.42 * t), 0, 12), "C'(t)", "visual-secondary", "dashed"),
    point("peak", 2.381, 4.201, "peak: C'=0", "visual-emphasis", "diamond"), point("rate-zero", 2.381, 0, "rate changes sign", "visual-success"),
    annotation("assumption", 7.6, 6.4, "Simplified model: not an individual dosing recommendation."),
  ], [], "time t", "concentration and rate"),

  "2B-V24": () => graph({ xMin: 0, xMax: 80, yMin: 0, yMax: 155 }, [
    series("reaction", samples((v) => 0.75 * v, 0, 80), "reaction distance", "visual-secondary", "dashed"),
    series("braking", samples((v) => 0.015 * v * v, 0, 80), "braking distance", "visual-emphasis", "dotted"),
    series("total", samples((v) => 0.75 * v + 0.015 * v * v, 0, 80), "total D(v)", "visual-primary", "double"),
    point("example", 60, 99, "D(60)=99", "visual-ink", "diamond"), annotation("doubling", 30, 138, "Double speed: reaction ×2, braking ×4."),
  ], [], "speed v", "stopping distance"),

  "2B-V25": () => graph({ xMin: 1.65, xMax: 2.35, yMin: 2.8, yMax: 5.3 }, [
    series("curve", samples((x) => x * x, 1.65, 2.35), "output f(x)=x^2", "visual-primary"),
    polygon("input-band", [[1.9, 2.8], [2.1, 2.8], [2.1, 5.3], [1.9, 5.3]], "input tolerance 2±0.1", "visual-secondary", "dots"),
    segment("lower-output", 1.65, 3.61, 2.35, 3.61, "lower output near 3.61", "visual-emphasis", "dashed"), segment("upper-output", 1.65, 4.41, 2.35, 4.41, "upper output near 4.41", "visual-emphasis", "dashed"),
    point("nominal", 2, 4, "nominal input and output", "visual-ink", "diamond"), annotation("amplification", 2.02, 5.05, "Local slope 4 maps ±0.1 to about ±0.4."),
  ]),

  "2B-V26": () => graph({ xMin: 2.5, xMax: 8.5, yMin: 20, yMax: 72 }, [
    series("cost", samples((q) => 0.5 * q * q + 3 * q + 12, 2.5, 8.5), "C(q)", "visual-primary"),
    series("tangent", samples((q) => 8 * (q - 5) + 39.5, 2.5, 8.5), "tangent at q=5", "visual-success", "dashed"),
    point("current", 5, 39.5, "q=5", "visual-ink"), point("next", 6, 48, "C(6)", "visual-emphasis", "diamond"), point("predicted", 6, 47.5, "marginal estimate", "visual-success"),
    segment("increment", 5, 25, 6, 25, "one-unit increment", "visual-secondary"), segment("gap", 6, 47.5, 6, 48, "prediction error", "visual-emphasis", "dotted"),
  ], [], "production q (units)", "total cost (dollars)"),

  "2B-V27": () => diagram([
    ["input", 0.5, 4.65, 3, 1.45, "Relative input change: dx/x"], ["elasticity", 4.5, 4.65, 3, 1.45, "Elasticity: E=x f'(x)/f(x)", "visual-emphasis"], ["output", 8.5, 4.65, 3, 1.45, "Relative output change: dy/y", "visual-success"],
    ["units", 3.4, 1.25, 5.2, 1.35, "Dimensionless comparison: percent in → percent out", "visual-guide"],
  ], [["a", 3.55, 5.38, 4.43, 5.38, "Multiply by elasticity", false], ["b", 7.55, 5.38, 8.43, 5.38, "Predict output change", false], ["c", 10, 4.5, 7.5, 2.7, "interpret"]], [["meaning", 6, 0.42, "E=2 means a 1% input increase produces about a 2% output increase locally."]]),

  "2B-V28": () => diagram([
    ["e0", 0.3, 4.7, 2.15, 1.4, "error 10^-1"], ["e1", 3.35, 4.7, 2.15, 1.4, "error 10^-2", "visual-secondary"], ["e2", 6.4, 4.7, 2.15, 1.4, "error 10^-4", "visual-emphasis"], ["e3", 9.45, 4.7, 2.15, 1.4, "error 10^-8", "visual-success"],
    ["condition", 3.2, 1.25, 5.6, 1.4, "Near a simple root with a suitable starting value", "visual-guide"],
  ], [["a", 2.5, 5.4, 3.28, 5.4, "square"], ["b", 5.55, 5.4, 6.33, 5.4, "square"], ["c", 8.6, 5.4, 9.38, 5.4, "square"]], [["note", 6, 0.42, "Quadratic convergence can roughly double correct digits each step."]]),

  "2B-V29": () => graph({ xMin: -4.2, xMax: 4.2, yMin: -1, yMax: 8.5 }, [
    series("convex", samples((x) => 0.5 * (x - 0.5) ** 2 + 1, -4, 4), "convex objective f(x)", "visual-primary"),
    segment("supporting-tangent", -4, 1, 4, 1, "horizontal supporting tangent at stationary point", "visual-success", "double"),
    point("stationary", 0.5, 1, "f'(x*)=0 at global minimum", "visual-emphasis", "diamond"),
    annotation("global", 0.5, 7.6, "Convexity keeps the entire graph above the tangent."),
  ]),

  "2B-V30": () => graph({ xMin: 0.5, xMax: 3.5, yMin: 0, yMax: 10.5 }, [
    series("f", samples((x) => x * x, 1, 3), "f(x)=x^2", "visual-primary"), series("g", samples((x) => x + 6, 1, 3), "g(x)=x+6", "visual-secondary", "dashed"),
    segment("f-secant", 1, 1, 3, 9, "f secant: Δf=8", "visual-emphasis", "dotted"), segment("g-secant", 1, 7, 3, 9, "g secant: Δg=2", "visual-success", "dotted"),
    point("common-c-f", 2, 4, "c=2 on f", "visual-emphasis", "diamond"), point("common-c-g", 2, 8, "c=2 on g", "visual-success", "diamond"),
    annotation("ratio", 2, 10, "8/2 = f'(2)/g'(2) = 4."),
  ]),
};

function inferCapabilities(scene, renderer) {
  const capabilities = new Set(["static-fallback"]);
  if (scene.kind === "cartesian-2d") capabilities.add("cartesian-axes");
  if (scene.kind === "geometry-2d") capabilities.add("geometry-primitives");
  for (const layer of scene.layers) {
    if (layer.kind === "function" || layer.kind === "tangent-line" || layer.kind === "secant-line") capabilities.add("function-paths");
    if (["sampled-series", "trace", "data-marker"].includes(layer.kind)) capabilities.add("data-series");
    if (["open-point", "closed-point"].includes(layer.kind)) capabilities.add("open-closed-points");
    if (["annotation", "label"].includes(layer.kind)) capabilities.add("annotations");
  }
  if (scene.controls.length) capabilities.add("parameter-controls");
  if (scene.controls.some((control) => control.kind === "draggable-point")) capabilities.add("draggable-points");
  if (renderer === JSX) capabilities.add("advanced-constraints");
  return [...capabilities];
}

function makeSpec(brief) {
  const factory = sceneDefinitions[brief.visual_id];
  if (!factory) throw new Error(`Unit 2B visual ${brief.visual_id} lacks an explicit scene definition.`);
  const scene = factory();
  const renderer = brief.recommended_renderer;
  if (![STATIC, INTERACTIVE, JSX].includes(renderer)) throw new Error(`Unit 2B visual ${brief.visual_id} names unsupported renderer ${renderer}.`);
  const interactive = renderer !== STATIC;
  const longDescription = plain(brief.long_description);
  return {
    schemaVersion: 1,
    id: `${UNIT}-${brief.visual_id.toLowerCase()}`,
    kind: scene.kind,
    title: text(brief.title_latex),
    caption: text(brief.caption_latex),
    learningPurpose: plain(brief.learning_purpose),
    longDescription: longDescription.length > 120 ? longDescription : `${longDescription} ${plain(brief.reading_guide_latex)}`,
    coordinateSpace: scene.coordinateSpace,
    viewport: scene.viewport,
    axes: scene.axes,
    panels: scene.panels,
    layers: scene.layers,
    controls: scene.controls,
    accessibility: {
      ariaLabel: plain(brief.caption_latex),
      summary: `${longDescription} ${plain(brief.reading_guide_latex)}`,
      readingOrder: [...scene.layers.map((layer) => layer.id), ...scene.controls.map((control) => control.id)],
      colorIndependentDescription: `Every relationship in ${plain(brief.title_latex).toLowerCase()} is identified with written labels plus distinct solid, dashed, dotted, double, marker, or pattern cues; color is never the only carrier of meaning.`,
      ...(interactive ? { keyboardInstructions: renderer === JSX ? "Activate the advanced ladder figure, then use the keyboard-operable endpoint control; the complete static construction remains visible." : "Use Tab to reach each control, then arrow keys or the labeled buttons to change one bounded value at a time." } : {}),
      controlInstructions: scene.controls.map((control) => plain(control.label.segments[0].text)),
      reducedMotion: interactive ? "disable-animation" : "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: { representation: "generated-svg", caption: text(brief.caption_latex), grayscaleSafe: true, pageBreak: "avoid", widthInches: 7.1 },
    performance: { maxSamples: 2048, maxAdaptiveDepth: 12, maxAstNodes: 160, maxAstDepth: 24, maxOperationsPerEvaluation: 2048, maxPayloadBytes: 65536, maxAnimationFps: 30, activation: renderer === JSX ? "explicit-user-action" : interactive ? "near-viewport" : "none" },
    requiredCapabilities: inferCapabilities(scene, renderer),
    preferredRenderer: interactive ? "prefer-interactive" : "prefer-static",
    provenance: { route: `/${brief.route.replace(/^\/+|\/+$/g, "")}/`, sourceFile: `content/calculus/units/${UNIT}/visual-specs.v1.json`, authoringId: `source-${brief.visual_id.toLowerCase()}`, visibility: "public" },
  };
}

export async function authorUnit2bVisuals({ root, checkOnly }) {
  const directory = resolve(root, "content/calculus/units/unit-2b");
  const briefs = JSON.parse(await readFile(resolve(directory, "visual-authoring-briefs.v3.json"), "utf8"));
  const briefIds = briefs.visuals.map((brief) => brief.visual_id);
  const definitionIds = Object.keys(sceneDefinitions);
  const missing = briefIds.filter((id) => !definitionIds.includes(id));
  const extra = definitionIds.filter((id) => !briefIds.includes(id));
  if (missing.length || extra.length) throw new Error(`Unit 2B explicit visual inventory mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
  const specs = briefs.visuals.map(makeSpec);
  if (specs.length !== 34 || new Set(specs.map((spec) => spec.id)).size !== 34) throw new Error("Unit 2B requires exactly 34 unique explicit visual specs.");
  if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== 7) throw new Error("Unit 2B requires six BetterGrades Interactive 2D scenes plus one JSXGraph scene.");
  if (specs.filter((spec) => spec.requiredCapabilities.includes("advanced-constraints")).map((spec) => spec.id).join() !== "unit-2b-2b-v09") throw new Error("Only the sliding-ladder scene may select JSXGraph.");
  const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: "unit-2b-calculus-visuals", migrationOnly: false, explicitDefinitionsOnly: true, visuals: specs }, null, 2)}\n`;
  const outputPath = resolve(directory, "visual-specs.v1.json");
  if (checkOnly) {
    const current = (await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n");
    if (current !== output) throw new Error("unit-2b visual specs are stale.");
  } else {
    await writeFile(outputPath, output, "utf8");
  }
  console.log(`${checkOnly ? "Verified" : "Authored"} 34 Unit 2B explicit VisualSpec v1 records (27 static, 6 BetterGrades Interactive 2D, 1 JSXGraph).`);
}
