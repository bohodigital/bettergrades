import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { buildVisualSemanticManifest } from "../algebra-remediation-content.mjs";

const root = resolve(import.meta.dirname, "../..");
const checkOnly = process.argv.includes("--check");
const requestedUnit = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1];
const sourcePath = resolve(root, "content/algebra/course.public.json");
const course = JSON.parse(await readFile(sourcePath, "utf8"));
const unitCodes = requestedUnit ? [requestedUnit.replace(/^unit-/i, "").toUpperCase()] : course.units.map((unit) => unit.code);

const rich = (text) => ({ segments: [{ kind: "text", text }] });
const presentation = (cue, fillToken) => ({
  strokeToken: "visual-ink",
  ...(fillToken ? { fillToken } : {}),
  lineStyle: "solid",
  markerShape: "none",
  pattern: fillToken ? "diagonal" : "none",
  colorIndependentCue: cue,
});
const performance = (interactive) => ({
  maxSamples: 1024,
  maxAdaptiveDepth: 10,
  maxAstNodes: 96,
  maxAstDepth: 18,
  maxOperationsPerEvaluation: 512,
  maxPayloadBytes: 65536,
  maxAnimationFps: 30,
  activation: interactive ? "near-viewport" : "none",
});

function wrapLabel(value, length = 46) {
  const words = value.replace(/\s+/g, " ").trim().split(" ");
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
  return lines.slice(0, 4);
}

function base(brief, interactive) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const caption = `${brief.description} This figure supports ${lesson?.outcome ?? "the lesson outcome"}`;
  return {
    schemaVersion: 1,
    id: `algebra-${brief.id.toLowerCase().replaceAll(".", "-")}`,
    title: rich(`${lesson?.title ?? brief.lessonId} · ${brief.description}`),
    caption: rich(caption),
    learningPurpose: `Use the visible structure in “${brief.description}” to connect the opening context to the lesson outcome: ${lesson?.outcome ?? "interpret the algebraic relationship"}`,
    longDescription: `${brief.altText} Read the labels in order, identify what is held fixed and what changes, and compare the representations before drawing a conclusion. The figure is a deterministic BetterGrades rendering of storyboard brief ${brief.id}.`,
    panels: [],
    accessibility: {
      ariaLabel: brief.altText,
      summary: `${caption}. The reading order follows the visible labels and mathematical objects.`,
      readingOrder: [],
      colorIndependentDescription: "Meaning is carried by written labels, position, line style, and shape; color is supplementary.",
      ...(interactive ? { keyboardInstructions: "Focus the parameter control and use its previous and next actions to compare states." } : {}),
      controlInstructions: interactive ? ["Change one bounded parameter at a time, then compare the graph with the retained static state."] : [],
      reducedMotion: interactive ? "disable-animation" : "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: {
      representation: "generated-svg",
      caption: rich(caption),
      grayscaleSafe: true,
      pageBreak: "avoid",
      widthInches: 7.1,
    },
    performance: performance(interactive),
    provenance: {
      route: brief.path,
      sourceFile: `content/algebra/units/unit-${brief.unitCode.toLowerCase()}/visual-specs.v1.json`,
      authoringId: brief.id.toLowerCase().replaceAll(".", "-"),
      visibility: "public",
    },
  };
}

const layerLabel = (id, text, x, y, cue = `Written mathematical label: ${text}`) => ({
  id,
  kind: "label",
  zIndex: 40,
  geometry: { position: { x, y }, content: rich(text) },
  presentation: presentation(cue),
});
const segment = (id, x1, y1, x2, y2, cue, lineStyle = "solid") => ({
  id,
  kind: "segment",
  zIndex: 5,
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: { ...presentation(cue), lineStyle },
});
const point = (id, x, y, cue, markerShape = "circle") => ({
  id,
  kind: "closed-point",
  zIndex: 20,
  geometry: { position: { x, y } },
  presentation: { ...presentation(cue, "visual-primary"), markerShape },
});

function semanticPhrases(brief) {
  const cleaned = brief.description.replace(/[.]/g, "").trim();
  const phrases = cleaned.split(/\s+(?:and|versus|vs\.?|with|linked to|for)\s+|:\s*/i).map((part) => part.trim()).filter(Boolean);
  if (phrases.length >= 2) return phrases.slice(0, 4);
  const lines = wrapLabel(cleaned, 30);
  return lines.length >= 2 ? lines : [cleaned, "equivalent mathematical form"];
}

function numberLineSpec(brief) {
  const phrases = semanticPhrases(brief);
  const spec = {
    ...base(brief, false),
    kind: "number-line",
    coordinateSpace: { type: "number-line", variables: ["x"], unitsRequired: false },
    viewport: { xMin: -6, xMax: 6, yMin: -2, yMax: 2, aspectRatio: 3, padding: 0.05 },
    axes: { mode: "explicit", axes: [{ id: "value-axis", orientation: "x", label: rich(phrases[0]), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: false }] },
    layers: [
      segment("number-line", -5.5, 0, 5.5, 0, `Number line for ${brief.description}`, "double"),
      point("left-value", -3, 0, "Marked value at negative three.", "diamond"),
      point("origin", 0, 0, "Origin at zero.", "square"),
      point("right-value", 3, 0, "Marked value at positive three.", "circle"),
      layerLabel("relationship-label", phrases.join(" · "), -5, 1.35),
    ],
    controls: [],
    requiredCapabilities: ["static-fallback", "number-line", "open-closed-points", "annotations"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function graphSpec(brief) {
  const text = `${brief.description} ${course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson?.title ?? ""}`;
  const expression = /parabola|quadratic|square/i.test(text) ? "x^2-4"
    : /exponential|growth|decay/i.test(text) ? "2^x"
      : /rational|asymptote/i.test(text) ? "1/x"
        : /absolute value/i.test(text) ? "abs(x)"
          : "2*x+1";
  const spec = {
    ...base(brief, false),
    kind: "cartesian-2d",
    coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: -5, xMax: 5, yMin: -6, yMax: 10, aspectRatio: 1.72, padding: 0.05 },
    axes: { mode: "explicit", axes: [
      { id: "input-axis", orientation: "x", label: rich("input x"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: true },
      { id: "output-axis", orientation: "y", label: rich("output y"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: true },
    ] },
    layers: [
      {
        id: "mathematical-curve",
        kind: "function",
        geometry: { expression: { format: "latex", expressionLatex: expression }, variable: "x", domain: { min: -5, max: 5, includeMin: true, includeMax: true } },
        presentation: { strokeToken: "visual-primary", lineStyle: "solid", markerShape: "none", pattern: "none", colorIndependentCue: `Solid curve models ${brief.description}` },
      },
      point("reference-point", 0, expression === "2*x+1" ? 1 : expression === "x^2-4" ? -4 : expression === "2^x" ? 1 : 0, "Labeled reference point.", "diamond"),
      layerLabel("figure-claim", brief.description, -4.5, 8.8),
      layerLabel("lesson-label", course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson?.title ?? brief.lessonId, -4.5, 7.7),
    ],
    controls: [],
    requiredCapabilities: ["static-fallback", "cartesian-axes", "function-paths", "annotations", "open-closed-points"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function lessonMathLabels(brief) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const text = `${lesson?.title ?? ""} ${lesson?.outcome ?? ""} ${brief.description}`;
  if (/logarithm|exponential|growth|decay|geometric/i.test(text)) return ["2³ = 8", "log₂(8) = 3", "inverse operations"];
  if (/quadratic|parabola|factor|polynomial|trinomial/i.test(text)) return ["x² − 5x + 6", "(x − 2)(x − 3)", "zeros 2 and 3"];
  if (/rational|fraction|denominator|numerator|conjugate|radical/i.test(text)) return ["(x² − 9)/(x − 3)", "x + 3", "x ≠ 3"];
  if (/system|simultaneous|elimination/i.test(text)) return ["x + y = 7", "x − y = 1", "(x, y) = (4, 3)"];
  if (/slope|linear|line|intercept|coordinate/i.test(text)) return ["(1, 3), (4, 9)", "m = (9−3)/(4−1) = 2", "y = 2x + 1"];
  if (/exponent|power|root|scientific notation/i.test(text)) return ["2³ · 2²", "2⁵", "32"];
  if (/function|domain|range|relation/i.test(text)) return ["f(x) = 2x² − 3", "f(2) = 5", "input 2 → output 5"];
  if (/inequal|absolute value|interval/i.test(text)) return ["−2x + 3 > 7", "−2x > 4", "x < −2"];
  if (/ratio|rate|percent|proportion|variation/i.test(text)) return ["3/5 = w/20", "w = 12", "3:5 = 12:20"];
  if (/complex number/i.test(text)) return ["(3 + 2i)(3 − 2i)", "9 − 4i²", "13"];
  return ["3x + 5 = 20", "3x = 15", "x = 5"];
}

function equationSpec(brief) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const labels = lessonMathLabels(brief);
  const layers = [
    layerLabel("figure-claim", brief.description, 0.8, 6.2),
    segment("step-line-one", 1.1, 4.7, 10.9, 4.7, "First equivalence line.", "double"),
    segment("step-line-two", 1.1, 2.7, 10.9, 2.7, "Second equivalence line."),
    layerLabel("original-form", labels[0], 1.2, 5.2),
    layerLabel("equivalent-form", labels[1], 4.5, 3.2),
    layerLabel("checked-result", labels[2], 8.2, 1.4),
    point("check-marker", 10.6, 1.45, `Checked result: ${labels[2]}.`, "diamond"),
    layerLabel("lesson-label", lesson?.title ?? brief.lessonId, 0.8, 0.55),
  ];
  const spec = {
    ...base(brief, false),
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: `Equivalent mathematical forms show ${brief.description}` },
    layers,
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives", "open-closed-points"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function areaSpec(brief) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const labels = lessonMathLabels(brief);
  const layers = [
    layerLabel("figure-claim", brief.description, 0.7, 6.3),
    layerLabel("lesson-label", lesson?.title ?? brief.lessonId, 0.7, 0.55),
  ];
  let cell = 0;
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      cell += 1;
      const x = 1.1 + column * 2.35;
      const y = 1.35 + row * 1.45;
      layers.push({
        id: `cell-${cell}`,
        kind: "polygon",
        zIndex: 5,
        geometry: { points: [{ x, y }, { x: x + 2.2, y }, { x: x + 2.2, y: y + 1.3 }, { x, y: y + 1.3 }], closed: true },
        presentation: {
          ...presentation(`Equal area cell ${cell} of 12.`, cell <= 6 ? "visual-primary" : "visual-secondary"),
          pattern: cell <= 6 ? "diagonal" : "dots",
        },
      });
    }
  }
  layers.push(layerLabel("part-count", `Model ${labels[0]} as equal parts; connect the partition to ${labels[1]}.`, 1.1, 5.75));
  const spec = {
    ...base(brief, false),
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: `The partitioned area directly supports ${brief.description}` },
    layers,
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function tableSpec(brief) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const labels = lessonMathLabels(brief);
  const values = [
    ["stage", "mathematical form", "check"],
    ["given", labels[0], "identify"],
    ["transform", labels[1], "equivalent"],
    ["verify", labels[2], "confirmed"],
  ];
  const layers = [layerLabel("figure-claim", brief.description, 0.6, 6.3), layerLabel("lesson-label", lesson?.title ?? brief.lessonId, 0.6, 0.55)];
  for (let row = 0; row <= 4; row += 1) layers.push(segment(`row-${row}`, 1, 1.2 + row * 1.1, 11, 1.2 + row * 1.1, `Table row boundary ${row}.`, row === 0 || row === 4 ? "double" : "solid"));
  for (let column = 0; column <= 3; column += 1) layers.push(segment(`column-${column}`, 1 + column * (10 / 3), 1.2, 1 + column * (10 / 3), 5.6, `Table column boundary ${column}.`, column === 0 || column === 3 ? "double" : "solid"));
  for (const [row, cells] of values.entries()) {
    for (const [column, value] of cells.entries()) layers.push(layerLabel(`cell-label-${row}-${column}`, value, 1.45 + column * (10 / 3), 5.0 - row * 1.1));
  }
  const spec = {
    ...base(brief, false),
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: `The labeled value table makes the comparison in ${brief.description} explicit.` },
    layers,
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function factorTreeSpec(brief) {
  const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
  const layers = [
    layerLabel("figure-claim", brief.description, 0.7, 6.3),
    layerLabel("root-value", "12", 5.8, 5.5),
    segment("branch-left", 6, 5.2, 3.8, 3.8, "Twelve decomposes into three times four."),
    segment("branch-right", 6, 5.2, 8.2, 3.8, "Twelve decomposes into three times four."),
    layerLabel("prime-three", "3", 3.65, 3.45),
    layerLabel("factor-four", "4", 8.05, 3.45),
    segment("branch-two-a", 8.2, 3.2, 7, 2.0, "Four decomposes into two times two."),
    segment("branch-two-b", 8.2, 3.2, 9.4, 2.0, "Four decomposes into two times two."),
    layerLabel("prime-two-a", "2", 6.8, 1.65),
    layerLabel("prime-two-b", "2", 9.25, 1.65),
    layerLabel("factorization", "12 = 2² · 3", 1.0, 1.1),
    layerLabel("lesson-label", lesson?.title ?? brief.lessonId, 0.7, 0.5),
  ];
  const spec = {
    ...base(brief, false),
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: `The branching factorization supports ${brief.description}` },
    layers,
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives"],
    preferredRenderer: "prefer-static",
  };
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

function staticSpec(brief) {
  if (/number line|interval|timeline|scale|slider|before-after|place-value slider/i.test(brief.description)) return numberLineSpec(brief);
  if (/graph|coordinate|slope|parabola|function|curve|intercept|asymptote|residual/i.test(brief.description)) return graphSpec(brief);
  if (/factor tree|prime-exponent inventory/i.test(brief.description)) return factorTreeSpec(brief);
  if (/area|grid|array|strip|rectangle|square|tile|bar model|region|shading/i.test(brief.description)) return areaSpec(brief);
  if (/table|matrix|chart|inventory|sorter|comparison|cards|map|network|decision|strategy|clinic/i.test(brief.description)) return tableSpec(brief);
  return equationSpec(brief);
}

const interactiveExpressions = {
  "A3.6-V1": { expression: "(x-p)^2", variable: "x", label: "center p", yLabel: "squared distance", xMin: -5, xMax: 5, yMin: -1, yMax: 20 },
  "A4.7-V1": { expression: "p*x", variable: "x", label: "slope p", yLabel: "linear output", xMin: -5, xMax: 5, yMin: -10, yMax: 10 },
  "A4.10-V1": { expression: "x+p", variable: "x", label: "parallel offset p", yLabel: "parallel line", xMin: -5, xMax: 5, yMin: -8, yMax: 8 },
  "A6.9-V1": { expression: "p*x^2", variable: "x", label: "power coefficient p", yLabel: "power output", xMin: -4, xMax: 4, yMin: -2, yMax: 16 },
  "A9.2-V1": { expression: "p*x^2", variable: "x", label: "parabola coefficient p", yLabel: "quadratic output", xMin: -4, xMax: 4, yMin: -12, yMax: 16 },
  "A9.4-V1": { expression: "(x-p)^2", variable: "x", label: "horizontal shift p", yLabel: "transformed output", xMin: -6, xMax: 6, yMin: -2, yMax: 18 },
  "A12.5-V2": { expression: "x^2+p", variable: "x", label: "vertical probe p", yLabel: "function output", xMin: -5, xMax: 5, yMin: -6, yMax: 20 },
  "A13.3-V1": { expression: "p^x", variable: "x", label: "exponential base p", yLabel: "exponential output", xMin: -3, xMax: 4, yMin: -1, yMax: 18, values: [0.5, 0.75, 1.25, 1.5, 2, 3] },
};

function interactiveSpec(brief) {
  if (brief.id === "A0.1-V1") {
    const spec = {
      ...base(brief, true),
      kind: "number-line",
      coordinateSpace: { type: "number-line", variables: ["x", "p"], unitsRequired: false },
      viewport: { xMin: -6, xMax: 6, yMin: -2, yMax: 2, aspectRatio: 3, padding: 0.05 },
      axes: { mode: "explicit", axes: [{ id: "signed-axis", orientation: "x", label: rich("signed value"), scale: "linear", tickMode: "fixed-step", tickStep: 1, showGrid: false }] },
      layers: [
        segment("signed-number-line", -5.5, 0, 5.5, 0, "Signed number line with negative and positive directions.", "double"),
        point("origin", 0, 0, "Origin at zero.", "square"),
        {
          id: "selected-position",
          kind: "closed-point",
          zIndex: 30,
          geometry: { position: { x: { format: "latex", expressionLatex: "p" }, y: 0 } },
          presentation: { ...presentation("Diamond marks the selected signed position.", "visual-primary"), markerShape: "diamond" },
        },
        layerLabel("negative-direction", "negative ←", -5.2, 1.2),
        layerLabel("positive-direction", "→ positive", 3.8, 1.2),
      ],
      controls: [{ id: "signed-position-control", kind: "step-control", label: rich("signed position p"), announcementTemplate: "The signed position is {value}.", parameter: "p", values: [-5, -3, -1, 0, 1, 3, 5], initialIndex: 3 }],
      requiredCapabilities: ["static-fallback", "number-line", "open-closed-points", "annotations", "parameter-controls"],
      preferredRenderer: "prefer-interactive",
    };
    spec.accessibility.readingOrder = [...spec.layers.map((layer) => layer.id), "signed-position-control"];
    return spec;
  }
  const config = interactiveExpressions[brief.id];
  if (!config) throw new Error(`Missing interactive authoring profile for ${brief.id}.`);
  const spec = {
    ...base(brief, true),
    kind: "cartesian-2d",
    coordinateSpace: { type: "cartesian-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: config.xMin, xMax: config.xMax, yMin: config.yMin, yMax: config.yMax, aspectRatio: 1.72, padding: 0.05 },
    axes: {
      mode: "explicit",
      axes: [
        { id: "input-axis", orientation: "x", label: rich("input x"), scale: "linear", tickMode: "automatic", showGrid: true },
        { id: "output-axis", orientation: "y", label: rich(config.yLabel), scale: "linear", tickMode: "automatic", showGrid: true },
      ],
    },
    layers: [
      {
        id: "parameter-family",
        kind: "function",
        geometry: {
          expression: { format: "latex", expressionLatex: config.expression },
          variable: config.variable,
          domain: { min: config.xMin, max: config.xMax, includeMin: true, includeMax: true },
        },
        presentation: {
          strokeToken: "visual-primary",
          lineStyle: "solid",
          markerShape: "none",
          pattern: "none",
          colorIndependentCue: `Solid curve shows the current state controlled by ${config.label}.`,
        },
      },
      {
        id: "reading-note",
        kind: "annotation",
        geometry: {
          anchor: { x: config.xMin + (config.xMax - config.xMin) * 0.06, y: config.yMax - (config.yMax - config.yMin) * 0.08 },
          content: rich(`${brief.description} Change ${config.label}; compare shape, direction, and intercepts.`),
        },
        presentation: presentation(`Written directions identify how to inspect ${config.label}.`),
      },
    ],
    controls: [
      {
        id: "parameter-control",
        kind: "step-control",
        label: rich(config.label),
        announcementTemplate: `${config.label} is {value}.`,
        parameter: "p",
        values: config.values ?? [-3, -2, -1, -0.5, 0.5, 1, 2, 3],
        initialIndex: config.values ? 4 : 5,
      },
    ],
    requiredCapabilities: ["static-fallback", "cartesian-axes", "function-paths", "annotations", "parameter-controls"],
    preferredRenderer: "prefer-interactive",
  };
  spec.accessibility.readingOrder = ["parameter-family", "reading-note", "parameter-control"];
  return spec;
}

for (const unitCode of unitCodes) {
  const unit = course.units.find((candidate) => candidate.code === unitCode);
  if (!unit) throw new Error(`Unknown Algebra unit ${unitCode}.`);
  const briefs = course.pages
    .filter((page) => page.lesson?.unitCode === unitCode)
    .flatMap((page) => page.lesson.figures);
  const visuals = briefs.map((brief) => brief.interactive ? interactiveSpec(brief) : staticSpec(brief));
  const semanticManifests = briefs.map((brief) => {
    const lesson = course.pages.find((page) => page.lesson?.id === brief.lessonId)?.lesson;
    return buildVisualSemanticManifest(brief, lesson);
  });
  const collection = {
    collectionSchemaVersion: 1,
    collectionId: `algebra-unit-${unitCode.toLowerCase()}-visuals`,
    migrationOnly: false,
    visuals,
  };
  const path = resolve(root, "content/algebra/units", `unit-${unitCode.toLowerCase()}`, "visual-specs.v1.json");
  const semanticPath = resolve(root, "content/algebra/units", `unit-${unitCode.toLowerCase()}`, "visual-semantic-manifests.v1.json");
  const expected = `${JSON.stringify(collection, null, 2)}\n`;
  const semanticExpected = `${JSON.stringify({ schemaVersion: 1, unitCode, manifests: semanticManifests }, null, 2)}\n`;
  if (checkOnly) {
    const actual = await readFile(path, "utf8").catch(() => "");
    if (actual.replace(/\r\n?/g, "\n") !== expected) throw new Error(`${path.replace(`${root}/`, "")} is stale. Run algebra:visuals:author.`);
    const semanticActual = await readFile(semanticPath, "utf8").catch(() => "");
    if (semanticActual.replace(/\r\n?/g, "\n") !== semanticExpected) throw new Error(`${semanticPath.replace(`${root}/`, "")} is stale. Run algebra:visuals:author.`);
  } else {
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(path, expected, "utf8");
    await writeFile(semanticPath, semanticExpected, "utf8");
  }
  console.log(`${checkOnly ? "Verified" : "Authored"} ${visuals.length} Algebra ${unitCode} VisualSpec records (${visuals.filter((visual) => visual.preferredRenderer === "prefer-interactive").length} interactive).`);
}
