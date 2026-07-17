import compiledManifest from "../../content/visualizations/limits-continuity/compiled-scenes.v1.json" with { type: "json" };

// Phase 6 intentionally starts with one static-only public graph. The set is
// expanded to the exact 13-item migration inventory only after this route has
// passed build, browser, no-JavaScript, mobile, accessibility, and print review.
const enabledVisualIds = new Set(["removable-hole"]);

if (
  compiledManifest.manifestVersion !== 1 ||
  compiledManifest.sceneCount !== 13 ||
  !Array.isArray(compiledManifest.scenes) ||
  compiledManifest.scenes.length !== 13
) {
  throw new Error("The Limits visual manifest must contain exactly 13 compiled v1 scenes.");
}

const scenesById = new Map(compiledManifest.scenes.map((entry) => [entry.id, entry]));

export function getLimitsPublicVisual(graphId) {
  if (!enabledVisualIds.has(graphId)) return undefined;
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
    ...(entry.hydration === "none" ? {} : { interactiveScene: scene }),
  };
}

export const representativeLimitsVisualId = "removable-hole";
