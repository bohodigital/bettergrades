import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const UNIT = "unit-3a";
const STATIC = "static-svg";
const INTERACTIVE = "interactive-2d";

function plain(value) {
  return String(value)
    .replace(/\\\((.*?)\\\)/gs, "$1")
    .replace(/\\(?:textbf|emph|textit|mathrm|operatorname)\{([^{}]*)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1 divided by $2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "square root of $1")
    .replace(/\\(?:infty|to|mapsto|Rightarrow|leq|geq|approx)\b/g, (value) => ({ "\\infty": "infinity", "\\to": "to", "\\mapsto": "maps to", "\\Rightarrow": "implies", "\\leq": "at most", "\\geq": "at least", "\\approx": "approximately" }[value]))
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

const series = (id, data, label, token = "visual-primary", lineStyle = "solid") => ({
  id, kind: "sampled-series", label: text(label), geometry: { ...data, connect: true },
  presentation: style(token, `${label}; ${lineStyle} curve.`, { lineStyle }),
});
const point = (id, x, y, label, token = "visual-ink", markerShape = "circle") => ({
  id, kind: "closed-point", label: text(label), geometry: { position: { x, y } },
  presentation: style(token, `Filled ${markerShape} marks ${label}.`, { fillToken: token, markerShape }),
});
const marker = (id, x, y, description, token = "visual-ink", markerShape = "circle") => ({
  id, kind: "closed-point", geometry: { position: { x, y } },
  presentation: style(token, description, { fillToken: token, markerShape }),
});
const segment = (id, x1, y1, x2, y2, label, token = "visual-guide", lineStyle = "solid") => ({
  id, kind: "segment", label: text(label), geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, `${label}; ${lineStyle} segment.`, { lineStyle }),
});
const guideSegment = (id, x1, y1, x2, y2, description, token = "visual-guide", lineStyle = "solid") => ({
  id, kind: "segment", geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: style(token, `${description}; ${lineStyle} segment.`, { lineStyle }),
});
const polygon = (id, coordinates, cue, token = "visual-primary", pattern = "diagonal") => ({
  id, kind: "polygon", geometry: { points: coordinates.map(([x, y]) => ({ x, y })), closed: true },
  presentation: style(token, cue, { fillToken: token, pattern }),
});
const label = (id, x, y, content, token = "visual-ink") => ({
  id, kind: "label", geometry: { position: { x, y }, content: text(content) }, presentation: style(token, `Label: ${content}.`),
});
const annotation = (id, x, y, content, token = "visual-ink") => ({
  id, kind: "annotation", geometry: { anchor: { x, y }, content: text(content) }, presentation: style(token, `Annotation: ${content}.`),
});

function axes(xLabel, yLabel, xStep, yStep) {
  return { mode: "explicit", axes: [
    { id: "x-axis", orientation: "x", label: text(xLabel), scale: "linear", tickMode: xStep ? "fixed-step" : "automatic", ...(xStep ? { tickStep: xStep } : {}), showGrid: true },
    { id: "y-axis", orientation: "y", label: text(yLabel), scale: "linear", tickMode: yStep ? "fixed-step" : "automatic", ...(yStep ? { tickStep: yStep } : {}), showGrid: true },
  ] };
}

function graph(viewport, layers, controls = [], xLabel = "input x", yLabel = "output y", xStep, yStep) {
  return {
    kind: "cartesian-2d",
    coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { ...viewport, aspectRatio: 1.72, padding: 0.06 },
    axes: axes(xLabel, yLabel, xStep, yStep),
    panels: [], layers, controls,
  };
}

function geometry(viewport, layers) {
  return {
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { ...viewport, aspectRatio: 1.72, padding: 0.06 },
    axes: { mode: "none", reason: "The labeled geometry and dimensions carry the mathematical meaning." },
    panels: [], layers, controls: [],
  };
}

function box(id, x, y, width, height, content, token) {
  return [
    polygon(`${id}-box`, [[x, y], [x + width, y], [x + width, y + height], [x, y + height]], `Box for ${content}.`, token, "dots"),
    label(`${id}-label`, x + width / 2, y + height / 2, content),
  ];
}

function curvePolygon(fn, min, max, steps, baseline = 0) {
  const points = [[min, baseline]];
  for (let index = 0; index <= steps; index += 1) {
    const x = min + ((max - min) * index) / steps;
    points.push([Number(x.toFixed(6)), Number(fn(x).toFixed(6))]);
  }
  points.push([max, baseline]);
  return points;
}

function riemannRectangles(count, sampleOffsetExpression) {
  return Array.from({ length: count }, (_, index) => {
    const left = `${index}/2`;
    const right = `${index + 1}/2`;
    const sample = `(${index}+${sampleOffsetExpression})/2`;
    const height = `(${sample})^2+1`;
    return polygon(`rectangle-${index + 1}`, [[expr(left), 0], [expr(right), 0], [expr(right), expr(height)], [expr(left), expr(height)]], `Rectangle ${index + 1} uses the selected left, midpoint, or right sample.`, index % 2 ? "visual-secondary" : "visual-primary", index % 2 ? "dots" : "diagonal");
  });
}

function convergenceRectangles(count) {
  return Array.from({ length: count }, (_, index) => {
    const left = `2*${index}/n`;
    const right = `2*(${index}+1)/n`;
    const height = `(${left})^2`;
    return polygon(`convergence-rectangle-${index + 1}`, [[expr(left), 0], [expr(right), 0], [expr(right), expr(height)], [expr(left), expr(height)]], `Left rectangle ${index + 1}; rectangles beyond the selected partition lie outside the viewport.`, index % 2 ? "visual-secondary" : "visual-primary", index % 2 ? "dots" : "diagonal");
  });
}

function trapezoids(count) {
  const layers = [];
  for (let index = 0; index < count; index += 1) {
    const left = `4*${index}/n`;
    const right = `4*(${index}+1)/n`;
    const leftHeight = `1+(${left})^2/2`;
    const rightHeight = `1+(${right})^2/2`;
    const midpoint = `4*(${index}+0.5)/n`;
    layers.push(polygon(`trapezoid-${index + 1}`, [[expr(left), 0], [expr(right), 0], [expr(right), expr(rightHeight)], [expr(left), expr(leftHeight)]], `Trapezoid ${index + 1} follows the endpoint heights.`, index % 2 ? "visual-secondary" : "visual-primary", index % 2 ? "dots" : "diagonal"));
    layers.push(marker(`midpoint-${index + 1}`, expr(midpoint), expr(`1+(${midpoint})^2/2`), `A diamond marks midpoint sample ${index + 1}.`, "visual-emphasis", "diamond"));
  }
  return layers;
}

const sceneDefinitions = {
  "U3A-V01": () => graph({ xMin: 0, xMax: 4.1, yMin: -1.6, yMax: 3.5 }, [
    polygon("positive-left", curvePolygon((t) => (t - 1) * (t - 3), 0, 1, 12), "Area above the axis adds positive displacement.", "visual-success", "dots"),
    polygon("negative-middle", curvePolygon((t) => (t - 1) * (t - 3), 1, 3, 24), "Area below the axis adds negative displacement.", "visual-emphasis", "crosshatch"),
    polygon("positive-right", curvePolygon((t) => (t - 1) * (t - 3), 3, 4, 12), "The final region adds positive displacement.", "visual-success", "dots"),
    series("velocity", samples((t) => (t - 1) * (t - 3), 0, 4), "v(t)=(t−1)(t−3)", "visual-primary", "double"),
    annotation("sign-story", 2.05, 3.05, "Signed accumulation: above +, below −"),
  ], [], "time t", "velocity v(t)", 1, 1),

  "U3A-V02": () => graph({ xMin: 0, xMax: 2.08, yMin: 0, yMax: 5.7 }, [
    ...riemannRectangles(4, "m"),
    series("curve", samples((x) => x * x + 1, 0, 2), "f(x)=x²+1", "visual-ink", "double"),
    annotation("method-note", 1.04, 5.35, "m=0 left · m=0.5 midpoint · m=1 right"),
  ], [{ id: "method-control", kind: "step-control", label: text("Rectangle sample position"), announcementTemplate: "The sample offset is {value}: zero is left, one half is midpoint, and one is right.", parameter: "m", values: [0, 0.5, 1], initialIndex: 1 }], "x", "f(x)", 0.5, 1),

  "U3A-V03": () => graph({ xMin: 0, xMax: 2, yMin: 0, yMax: 4.35 }, [
    ...convergenceRectangles(16),
    series("parabola", samples((x) => x * x, 0, 2), "f(x)=x²", "visual-ink", "double"),
    annotation("limit-note", 1.05, 4.05, "As n grows, width 2/n shrinks and the sum stabilizes near 8/3."),
  ], [{ id: "n-control", kind: "step-control", label: text("Number of rectangles n"), announcementTemplate: "The partition uses {value} left rectangles on zero to two.", parameter: "n", values: [2, 4, 8, 16], initialIndex: 1 }], "x", "height", 0.5, 1),

  "U3A-V04": () => graph({ xMin: 0, xMax: 6.35, yMin: -1.35, yMax: 1.55 }, [
    polygon("positive-region", curvePolygon(Math.sin, 0, Math.PI, 30), "The first lobe contributes positive signed area.", "visual-success", "dots"),
    polygon("negative-region", curvePolygon(Math.sin, Math.PI, 2 * Math.PI, 30), "The second lobe contributes negative signed area.", "visual-emphasis", "crosshatch"),
    series("sine", samples(Math.sin, 0, 2 * Math.PI, 121), "y=sin x", "visual-primary", "double"),
    label("positive-label", 1.57, 0.55, "+A"), label("negative-label", 4.71, -0.62, "−B"),
    annotation("net-note", 3.15, 1.32, "Definite integral = A − B, not A + B"),
  ], [], "x", "f(x)", 1, 0.5),

  "U3A-V05": () => graph({ xMin: 0, xMax: 2.08, yMin: 0, yMax: 5.35 }, [
    polygon("average-rectangle", [[0, 0], [2, 0], [2, 7 / 3], [0, 7 / 3]], "Crosshatched rectangle has the same area as the curve region.", "visual-secondary", "crosshatch"),
    series("average-curve", samples((x) => x * x + 1, 0, 2), "f(x)=x²+1", "visual-primary", "double"),
    segment("average-line", 0, 7 / 3, 2, 7 / 3, "average height 7/3", "visual-emphasis", "dashed"),
    annotation("equal-area", 1.03, 4.95, "Same base, same area → rectangle height is f_avg"),
  ], [], "x", "height", 0.5, 1),

  "U3A-V06": () => {
    const areaPoints = [[0, 0]];
    for (let index = 0; index <= 12; index += 1) {
      const t = `p*${index}/12`;
      areaPoints.push([expr(t), expr(`(${t})-1`)]);
    }
    areaPoints.push([expr("p"), 0]);
    return graph({ xMin: 0, xMax: 3.05, yMin: -1.25, yMax: 2.15 }, [
      polygon("moving-area", areaPoints, "Patterned signed area runs from zero to the selected upper bound p.", "visual-secondary", "dots"),
      series("integrand", samples((x) => x - 1, 0, 3), "integrand f(t)=t−1", "visual-primary", "double"),
      series("accumulation", samples((x) => x * x / 2 - x, 0, 3), "accumulation A(x)=x²/2−x", "visual-emphasis", "dashed"),
      guideSegment("moving-bound", expr("p"), -1.15, expr("p"), 2.05, "The dotted line marks the moving upper bound x=p", "visual-guide", "dotted"),
      point("accumulation-point", expr("p"), expr("p^2/2-p"), "current point on A", "visual-emphasis", "diamond"),
      annotation("ftc-note", 1.55, 1.88, "The slope of A at p equals f(p)."),
    ], [{ id: "p-control", kind: "slider", label: text("Upper bound p"), announcementTemplate: "The upper bound is {value}; signed area and the accumulation point update together.", parameter: "p", min: 0.25, max: 3, step: 0.25, initial: 2.25 }], "input", "f and A", 0.5, 0.5);
  },

  "U3A-V07": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.2 }, [
    ...box("recognize", 0.25, 4.45, 2.35, 1.25, "Match inner x²", "visual-primary"),
    ...box("substitute", 3.25, 4.45, 2.35, 1.25, "Set u=x²", "visual-secondary"),
    ...box("integrate", 6.25, 4.45, 2.35, 1.25, "Integrate cos u", "visual-emphasis"),
    ...box("return", 9.25, 4.45, 2.35, 1.25, "Back-substitute", "visual-success"),
    guideSegment("a", 2.65, 5.08, 3.15, 5.08, "The differential 2x dx becomes du", "visual-guide", "dashed"),
    guideSegment("b", 5.65, 5.08, 6.15, 5.08, "The u-integral is simpler", "visual-guide", "dashed"),
    guideSegment("c", 8.65, 5.08, 9.15, 5.08, "The final step restores x", "visual-guide", "dashed"),
    label("start", 6, 2.65, "∫ 2x cos(x²) dx → ∫ cos(u) du → sin(x²)+C"),
    annotation("warning", 6, 1.05, "Substitution preserves the differential; it is not arbitrary symbol swapping."),
  ]),

  "U3A-V08": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 7.2 }, [
    ...box("product", 0.6, 4.35, 3, 1.4, "Product rule", "visual-primary"),
    ...box("rearrange", 4.5, 4.35, 3, 1.4, "Rearrange terms", "visual-secondary"),
    ...box("integrate", 8.4, 4.35, 3, 1.4, "Integrate both sides", "visual-success"),
    guideSegment("p-to-r", 3.7, 5.05, 4.4, 5.05, "Rearrange to isolate u dv", "visual-guide", "dashed"),
    guideSegment("r-to-i", 7.6, 5.05, 8.3, 5.05, "Integrate the rearranged identity", "visual-guide", "dashed"),
    label("product-form", 2.1, 2.75, "d(uv)=u dv+v du"),
    label("parts-form", 6, 2.75, "u dv=d(uv)−v du"),
    label("integral-form", 9.9, 2.75, "∫u dv=uv−∫v du"),
    annotation("heuristic", 6, 1.05, "Choose u so differentiating it simplifies the remaining integral; LIATE is a heuristic, not a theorem."),
  ]),

  "U3A-V09": () => geometry({ xMin: 0, xMax: 12, yMin: 0, yMax: 6.2 }, [
    polygon("triangle-one", [[0.55, 1], [3.35, 1], [0.55, 4]], "Right triangle for square root of a squared minus x squared.", "visual-primary", "dots"),
    polygon("triangle-two", [[4.6, 1], [7.4, 1], [4.6, 4]], "Right triangle for square root of x squared plus a squared.", "visual-secondary", "diagonal"),
    polygon("triangle-three", [[8.65, 1], [11.45, 1], [8.65, 4]], "Right triangle for square root of x squared minus a squared.", "visual-emphasis", "crosshatch"),
    label("one-base", 1.95, 0.55, "x"), label("one-height", 0.2, 2.5, "√(a²−x²)"), label("one-hyp", 2.35, 2.85, "a"),
    label("two-base", 6, 0.55, "a"), label("two-height", 4.2, 2.5, "x"), label("two-hyp", 6.55, 2.85, "√(x²+a²)"),
    label("three-base", 10.05, 0.55, "√(x²−a²)"), label("three-height", 8.25, 2.5, "a"), label("three-hyp", 10.45, 2.85, "x"),
    label("one-rule", 1.95, 5.15, "x=a sin θ"), label("two-rule", 6, 5.15, "x=a tan θ"), label("three-rule", 10.05, 5.15, "x=a sec θ"),
  ]),

  "U3A-V10": () => graph({ xMin: 0, xMax: 4, yMin: 0, yMax: 9.6 }, [
    ...trapezoids(8),
    series("numerical-curve", samples((x) => 1 + x * x / 2, 0, 4), "f(x)=1+x²/2", "visual-ink", "double"),
    annotation("comparison-note", 2.02, 9.05, "Trapezoid edges use endpoints; diamonds mark midpoint samples."),
  ], [{ id: "n-control", kind: "step-control", label: text("Subinterval count n"), announcementTemplate: "The numerical partition uses {value} subintervals.", parameter: "n", values: [2, 4, 8], initialIndex: 1 }], "x", "f(x)", 1, 2),

  "U3A-V11": () => graph({ xMin: 1, xMax: 9.1, yMin: 0, yMax: 1.15 }, [
    polygon("tail-area", curvePolygon((x) => 1 / (x * x), 4, 9, 40), "Patterned tail area begins at cutoff b=4 and continues toward infinity.", "visual-secondary", "dots"),
    series("improper-curve", samples((x) => 1 / (x * x), 1, 9, 161), "f(x)=1/x²", "visual-primary", "double"),
    segment("cutoff", 4, 0, 4, 1.05, "finite cutoff b=4", "visual-emphasis", "dashed"),
    annotation("tail-note", 6.45, 0.92, "Tail from b to ∞ equals 1/b → 0"),
  ], [], "x", "1/x²", 1, 0.25),
};

function inferCapabilities(scene) {
  const capabilities = new Set(["static-fallback"]);
  if (scene.kind === "cartesian-2d") capabilities.add("cartesian-axes");
  if (scene.kind === "geometry-2d") capabilities.add("geometry-primitives");
  for (const layer of scene.layers) {
    if (["function", "tangent-line", "secant-line"].includes(layer.kind)) capabilities.add("function-paths");
    if (["sampled-series", "trace", "data-marker"].includes(layer.kind)) capabilities.add("data-series");
    if (["open-point", "closed-point"].includes(layer.kind)) capabilities.add("open-closed-points");
    if (["annotation", "label"].includes(layer.kind)) capabilities.add("annotations");
  }
  if (scene.controls.length) capabilities.add("parameter-controls");
  return [...capabilities];
}

function makeSpec(brief) {
  const factory = sceneDefinitions[brief.visual_id];
  if (!factory) throw new Error(`Unit 3A visual ${brief.visual_id} lacks an explicit scene definition.`);
  const scene = factory();
  if (![STATIC, INTERACTIVE].includes(brief.recommended_renderer)) throw new Error(`Unit 3A visual ${brief.visual_id} names unsupported renderer ${brief.recommended_renderer}.`);
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
      ...(interactive ? { keyboardInstructions: "Use Tab to reach the bounded control, then use the arrow keys or labeled control buttons to change one value at a time." } : {}),
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

export async function authorUnit3aVisuals({ root, checkOnly }) {
  const directory = resolve(root, "content/calculus/units/unit-3a");
  const briefs = JSON.parse(await readFile(resolve(directory, "handoff/visual-authoring-briefs.v3.json"), "utf8")).visual_briefs;
  const briefIds = briefs.map((brief) => brief.visual_id);
  const definitionIds = Object.keys(sceneDefinitions);
  const missing = briefIds.filter((id) => !definitionIds.includes(id));
  const extra = definitionIds.filter((id) => !briefIds.includes(id));
  if (missing.length || extra.length) throw new Error(`Unit 3A explicit visual inventory mismatch. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`);
  const specs = briefs.map(makeSpec);
  if (specs.length !== 11 || new Set(specs.map((spec) => spec.id)).size !== 11) throw new Error("Unit 3A requires exactly 11 unique explicit visual specs.");
  if (specs.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== 4) throw new Error("Unit 3A requires exactly four BetterGrades Interactive 2D scenes.");
  const output = `${JSON.stringify({ collectionSchemaVersion: 1, collectionId: "unit-3a-calculus-visuals", migrationOnly: false, explicitDefinitionsOnly: true, visuals: specs }, null, 2)}\n`;
  const outputPath = resolve(directory, "visual-specs.v1.json");
  if (checkOnly) {
    const current = (await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n");
    if (current !== output) throw new Error("unit-3a visual specs are stale.");
  } else await writeFile(outputPath, output, "utf8");
  console.log(`${checkOnly ? "Verified" : "Authored"} 11 Unit 3A explicit VisualSpec v1 records (7 static, 4 BetterGrades Interactive 2D).`);
}
