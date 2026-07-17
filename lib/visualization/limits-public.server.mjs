import compiledManifest from "../../content/visualizations/limits-continuity/compiled-scenes.v1.json" with { type: "json" };

const enabledVisualIds = new Set([
  "secant-tangent",
  "removable-hole",
  "limit-versus-value",
  "jump-discontinuity",
  "rapid-oscillation",
  "squeeze-bounds",
  "unit-circle-squeeze",
  "sine-over-x",
  "vertical-asymptotes",
  "horizontal-asymptote",
  "discontinuity-gallery",
  "ivt-root",
  "epsilon-delta-window",
]);

if (
  compiledManifest.manifestVersion !== 1 ||
  compiledManifest.sceneCount !== 13 ||
  !Array.isArray(compiledManifest.scenes) ||
  compiledManifest.scenes.length !== 13
) {
  throw new Error("The Limits visual manifest must contain exactly 13 compiled v1 scenes.");
}

const scenesById = new Map(compiledManifest.scenes.map((entry) => [entry.id, entry]));

function publicInteractiveScene(scene) {
  const {
    compiledSceneVersion,
    sourceSpecVersion,
    id,
    kind,
    title,
    caption,
    learningPurpose,
    longDescription,
    coordinateSpace,
    viewport,
    axes,
    panels,
    layers,
    controls,
    accessibility,
    print,
    performance,
    requiredCapabilities,
    selectedRenderer,
    staticFallback,
    delivery,
  } = scene;
  const {
    route,
    sourceVisualId,
    sourceFingerprint,
    compilerVersion,
    visibility,
  } = scene.provenance;
  return {
    compiledSceneVersion,
    sourceSpecVersion,
    id,
    kind,
    title,
    caption,
    learningPurpose,
    longDescription,
    coordinateSpace,
    viewport,
    axes,
    panels,
    layers,
    controls,
    accessibility,
    print,
    performance,
    requiredCapabilities,
    selectedRenderer,
    staticFallback,
    delivery,
    provenance: {
      route,
      sourceVisualId,
      sourceFingerprint,
      compilerVersion,
      visibility,
    },
  };
}

export function getLimitsPublicVisual(graphId) {
  if (!enabledVisualIds.has(graphId)) {
    throw new Error(`Limits graph ${graphId} is outside the exact 13-item BVLP migration inventory.`);
  }
  const entry = scenesById.get(graphId);
  if (!entry) throw new Error(`Enabled Limits visual ${graphId} is absent from the compiled manifest.`);
  const scene = entry.compiledScene;
  if (
    scene.id !== graphId ||
    scene.provenance.visibility !== "public" ||
    entry.staticAsset.path.startsWith("/visuals/v1/") !== true
  ) {
    throw new Error(`Enabled Limits visual ${graphId} failed its public delivery contract.`);
  }
  return {
    id: entry.id,
    selectedRenderer: entry.selectedRenderer,
    hydration: entry.hydration,
    staticAsset: entry.staticAsset,
    title: scene.title,
    caption: scene.caption,
    learningPurpose: scene.learningPurpose,
    longDescription: scene.longDescription,
    accessibility: scene.accessibility,
    sourceFingerprint: scene.provenance.sourceFingerprint,
    ...(entry.hydration === "none" ? {} : { interactiveScene: publicInteractiveScene(scene) }),
  };
}

export const limitsPublicVisualIds = Object.freeze([...enabledVisualIds]);
