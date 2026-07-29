import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const checkOnly = process.argv.includes("--check");
const requestedUnit = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1];
const course = JSON.parse(await readFile(resolve(root, "content/precalculus/course.public.json"), "utf8"));
const unitSequences = requestedUnit
  ? [Number(requestedUnit.replace(/^unit-/i, ""))]
  : course.units.map((unit) => unit.sequence);

const rich = (text) => ({ segments: [{ kind: "text", text }] });
const presentation = (cue, fillToken, pattern = "none") => ({
  strokeToken: "visual-ink",
  ...(fillToken ? { fillToken } : {}),
  lineStyle: "solid",
  markerShape: "none",
  pattern,
  colorIndependentCue: cue,
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

function wrapLabel(value, length = 34, limit = 5) {
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

const label = (id, text, x, y, cue = `Written label: ${text}`, zIndex = 40) => ({
  id,
  kind: "label",
  zIndex,
  geometry: { position: { x, y }, content: rich(text) },
  presentation: presentation(cue),
});
const segment = (id, x1, y1, x2, y2, cue, lineStyle = "solid") => ({
  id,
  kind: "segment",
  zIndex: 10,
  geometry: { start: { x: x1, y: y1 }, end: { x: x2, y: y2 } },
  presentation: { ...presentation(cue), lineStyle },
});
const card = (id, x, y, width, height, cue, fillToken, pattern) => ({
  id,
  kind: "polygon",
  zIndex: 5,
  geometry: {
    points: [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }],
    closed: true,
  },
  presentation: presentation(cue, fillToken, pattern),
});
const marker = (id, x, y, cue, markerShape = "diamond", fillToken = "visual-primary") => ({
  id,
  kind: "closed-point",
  zIndex: 30,
  geometry: { position: { x, y } },
  presentation: { ...presentation(cue, fillToken, "diagonal"), markerShape },
});

function base(brief) {
  return {
    schemaVersion: 1,
    id: brief.id,
    title: rich(`${brief.lessonTitle} · ${brief.title}`),
    caption: rich(brief.description),
    learningPurpose: `Use ${brief.title} to support this lesson outcome: ${brief.lessonOutcome}`,
    longDescription: `${brief.description} The visible labels preserve the exact problem, mechanism, valid condition, or error boundary supplied by the approved Precalculus storyboard.`,
    panels: [],
    accessibility: {
      ariaLabel: `${brief.title}. ${brief.description}`,
      summary: `${brief.description} Read the written labels in their numbered or marked order.`,
      readingOrder: [],
      colorIndependentDescription: "Meaning is carried by written labels, position, line style, numbering, and shape; color is supplementary.",
      controlInstructions: [],
      reducedMotion: "not-applicable",
      staticFallbackEquivalent: true,
    },
    print: {
      representation: "generated-svg",
      caption: rich(brief.description),
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
    kind: "geometry-2d",
    coordinateSpace: { type: "diagram-2d", variables: ["x", "y"], unitsRequired: false },
    viewport: { xMin: 0, xMax: 12, yMin: 0, yMax: 7, aspectRatio: 1.72, padding: 0.04 },
    axes: { mode: "none", reason: `The labeled semantic diagram directly communicates ${brief.title}.` },
    controls: [],
    requiredCapabilities: ["static-fallback", "annotations", "geometry-primitives", "open-closed-points"],
    preferredRenderer: "prefer-static",
  };
}

function addWrapped(layers, prefix, text, x, top, width = 34, limit = 5, spacing = 0.52) {
  const lines = wrapLabel(text, width, limit);
  for (const [index, line] of lines.entries()) {
    layers.push(label(`${prefix}-${index + 1}`, line, x, top - index * spacing));
  }
  return lines.length;
}

function anchorSpec(brief) {
  const layers = [
    label("figure-title", brief.title, 0.65, 6.45),
    card("problem-card", 0.65, 1.55, 4.55, 4.25, `Exact foundation problem: ${brief.anchorProblem}`, "visual-secondary", "dots"),
    card("conclusion-card", 6.8, 1.55, 4.55, 4.25, `Exact conclusion: ${brief.anchorConclusion}`, "visual-primary", "diagonal"),
    label("problem-heading", "PROBLEM", 1.0, 5.38),
    label("conclusion-heading", "CONCLUSION", 7.15, 5.38),
    segment("reasoning-arrow", 5.3, 3.7, 6.65, 3.7, "The represented mathematical objects support the exact conclusion.", "double"),
    marker("reasoning-marker", 5.98, 3.7, "Reasoning bridge from the problem to the conclusion."),
  ];
  addWrapped(layers, "problem", brief.anchorProblem, 1.0, 4.7, 29, 6);
  addWrapped(layers, "conclusion", brief.anchorConclusion, 7.15, 4.7, 29, 6);
  addWrapped(layers, "interpretation", brief.anchorInterpretation, 0.8, 1.05, 78, 2, 0.48);
  const spec = { ...base(brief), layers };
  spec.accessibility.readingOrder = layers.map((layer) => layer.id);
  return spec;
}

function mechanismSteps(value) {
  const clauses = value
    .split(/,\s+(?:and\s+)?|\s+and\s+(?=[a-z])/i)
    .map((clause) => clause.trim().replace(/[.]$/, ""))
    .filter(Boolean);
  if (clauses.length >= 3) return clauses.slice(0, 4);
  const sentence = wrapLabel(value, 42, 4);
  return sentence.length >= 3 ? sentence : [value, "Track the intermediate state", "Verify the final representation"];
}

function mechanismSpec(brief) {
  const steps = mechanismSteps(brief.mechanism);
  const layers = [
    label("figure-title", brief.title, 0.65, 6.45),
    label("mechanism-heading", "MECHANISM · READ IN ORDER", 0.65, 5.82),
  ];
  const rowY = [4.5, 3.25, 2.0, 0.75];
  for (const [index, step] of steps.entries()) {
    const y = rowY[index];
    layers.push(marker(`step-marker-${index + 1}`, 1.1, y + 0.35, `Step ${index + 1}: ${step}`, index % 2 ? "square" : "diamond", index === steps.length - 1 ? "visual-primary" : "visual-secondary"));
    layers.push(label(`step-number-${index + 1}`, String(index + 1).padStart(2, "0"), 0.55, y + 0.35));
    addWrapped(layers, `step-${index + 1}`, step, 1.65, y + 0.58, 77, 2, 0.46);
    if (index < steps.length - 1) {
      layers.push(segment(`step-connector-${index + 1}`, 1.1, y - 0.05, 1.1, rowY[index + 1] + 0.75, `Step ${index + 1} leads to step ${index + 2}.`, "double"));
    }
  }
  const spec = { ...base(brief), layers };
  spec.accessibility.readingOrder = layers.map((layer) => layer.id);
  return spec;
}

function errorSpec(brief) {
  const layers = [
    label("figure-title", brief.title, 0.65, 6.45),
    card("valid-card", 0.65, 1.25, 5.1, 4.75, `Valid structure: ${brief.validStructure}`, "visual-primary", "diagonal"),
    card("invalid-card", 6.25, 1.25, 5.1, 4.75, `Invalid move: ${brief.invalidMove}`, "visual-secondary", "crosshatch"),
    label("valid-heading", "VALID STRUCTURE", 1.0, 5.55),
    label("invalid-heading", "FIRST INVALID MOVE", 6.6, 5.55),
    segment("divergence-line", 6.0, 1.15, 6.0, 6.05, "The central divider marks where the conclusions diverge.", "double"),
    marker("divergence-marker", 6.0, 3.65, "The two conclusions diverge at this marked boundary.", "diamond", "visual-primary"),
  ];
  addWrapped(layers, "valid", brief.validStructure, 1.0, 4.78, 33, 7);
  addWrapped(layers, "invalid", brief.invalidMove, 6.6, 4.78, 33, 7);
  const spec = { ...base(brief), layers };
  spec.accessibility.readingOrder = layers.map((layer) => layer.id);
  return spec;
}

function visualSpec(brief) {
  if (brief.role === "Anchor figure") return anchorSpec(brief);
  if (brief.role === "Mechanism figure") return mechanismSpec(brief);
  if (brief.role === "Comparison and error figure") return errorSpec(brief);
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
      description: brief.description,
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
  console.log(`${checkOnly ? "Verified" : "Authored"} ${visuals.length} semantic Precalculus figures for course unit ${unitSequence}.`);
}
