import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

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
  const caption = `${brief.description} This ${brief.role.toLowerCase()} figure supports ${lesson?.outcome ?? "the lesson outcome"}`;
  return {
    schemaVersion: 1,
    id: `algebra-${brief.id.toLowerCase().replaceAll(".", "-")}`,
    title: rich(`${brief.lessonId} · ${brief.role}`),
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

function staticSpec(brief) {
  const spec = {
    ...base(brief, false),
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["horizontal", "vertical"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: "A labeled structural diagram communicates the storyboard relationship without numeric axes." },
    layers: [],
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives"],
    preferredRenderer: "prefer-static",
  };
  const lines = wrapLabel(brief.description);
  const labels = [
    { id: "context", text: brief.role, x: 2.2, y: 5.5, fill: "visual-secondary" },
    { id: "structure", text: lines.join(" · "), x: 6, y: 3.5, fill: "visual-primary" },
    { id: "meaning", text: "Connect the representation to the lesson outcome", x: 9.8, y: 1.5, fill: "visual-success" },
  ];
  for (const [index, label] of labels.entries()) {
    const width = index === 1 ? 5.4 : 3.5;
    spec.layers.push({
      id: `${label.id}-box`,
      kind: "polygon",
      zIndex: index,
      geometry: {
        points: [
          { x: label.x - width / 2, y: label.y - 0.72 },
          { x: label.x + width / 2, y: label.y - 0.72 },
          { x: label.x + width / 2, y: label.y + 0.72 },
          { x: label.x - width / 2, y: label.y + 0.72 },
        ],
        closed: true,
      },
      presentation: presentation(`Labeled ${label.id} panel: ${label.text}`, label.fill),
    });
    spec.layers.push({
      id: `${label.id}-label`,
      kind: "label",
      zIndex: 40 + index,
      geometry: { position: { x: label.x, y: label.y }, content: rich(label.text) },
      presentation: presentation(`Written label: ${label.text}`),
    });
    if (index < labels.length - 1) {
      spec.layers.push({
        id: `${label.id}-arrow`,
        kind: "direction-arrow",
        zIndex: 20 + index,
        geometry: {
          start: { x: label.x + width / 2 + 0.08, y: label.y - 0.35 },
          end: { x: labels[index + 1].x - (index === 0 ? 2.78 : 1.83), y: labels[index + 1].y + 0.35 },
        },
        presentation: { ...presentation("Arrow establishes the intended reading order."), lineStyle: index === 0 ? "solid" : "dashed" },
      });
    }
  }
  spec.accessibility.readingOrder = spec.layers.map((layer) => layer.id);
  return spec;
}

const interactiveExpressions = {
  "A0.1-V1": { expression: "p", variable: "x", label: "signed position p", yLabel: "position", xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
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
  const collection = {
    collectionSchemaVersion: 1,
    collectionId: `algebra-unit-${unitCode.toLowerCase()}-visuals`,
    migrationOnly: false,
    visuals,
  };
  const path = resolve(root, "content/algebra/units", `unit-${unitCode.toLowerCase()}`, "visual-specs.v1.json");
  const expected = `${JSON.stringify(collection, null, 2)}\n`;
  if (checkOnly) {
    const actual = await readFile(path, "utf8").catch(() => "");
    if (actual.replace(/\r\n?/g, "\n") !== expected) throw new Error(`${path.replace(`${root}/`, "")} is stale. Run algebra:visuals:author.`);
  } else {
    await mkdir(resolve(path, ".."), { recursive: true });
    await writeFile(path, expected, "utf8");
  }
  console.log(`${checkOnly ? "Verified" : "Authored"} ${visuals.length} Algebra ${unitCode} VisualSpec records (${visuals.filter((visual) => visual.preferredRenderer === "prefer-interactive").length} interactive).`);
}
