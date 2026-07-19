import unit2aManifest from "../../content/calculus/units/unit-2a/compiled-scenes.v1.json" with { type: "json" };
import unit2bManifest from "../../content/calculus/units/unit-2b/compiled-scenes.v1.json" with { type: "json" };
import unit3aManifest from "../../content/calculus/units/unit-3a/compiled-scenes.v1.json" with { type: "json" };
import unit3bManifest from "../../content/calculus/units/unit-3b/compiled-scenes.v1.json" with { type: "json" };

const manifests = new Map([
  ["calc-1-unit-2a-derivative-foundations-techniques", unit2aManifest],
  ["calc-1-unit-2b-derivative-applications", unit2bManifest],
  ["calc-1-unit-3a-integral-foundations-techniques", unit3aManifest],
  ["calc-1-unit-3b-integration-applications", unit3bManifest],
]);
const expectations = new Map([
  ["calc-1-unit-2a-derivative-foundations-techniques", { count: 27, interactive: 1 }],
  ["calc-1-unit-2b-derivative-applications", { count: 34, interactive: 7 }],
  ["calc-1-unit-3a-integral-foundations-techniques", { count: 11, interactive: 4 }],
  ["calc-1-unit-3b-integration-applications", { count: 9, interactive: 4 }],
]);

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
  const { route, sourceVisualId, sourceFingerprint, compilerVersion, visibility } = scene.provenance;
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
    provenance: { route, sourceVisualId, sourceFingerprint, compilerVersion, visibility },
  };
}

function normalizedSpecId(unitId, sourceVisualId) {
  const prefix = unitId === "calc-1-unit-2a-derivative-foundations-techniques" ? "unit-2a" : unitId === "calc-1-unit-2b-derivative-applications" ? "unit-2b" : unitId === "calc-1-unit-3a-integral-foundations-techniques" ? "unit-3a" : "unit-3b";
  return `${prefix}-${String(sourceVisualId).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getCalculusUnitPublicVisual(unitId, sourceVisualId) {
  const manifest = manifests.get(unitId);
  const expected = expectations.get(unitId);
  if (!manifest || !expected) throw new Error(`Unknown calculus-unit visual collection ${unitId}.`);
  if (manifest.manifestVersion !== 1 || manifest.sceneCount !== expected.count || manifest.scenes.length !== expected.count) throw new Error(`${unitId} compiled visual inventory is invalid.`);
  if (manifest.scenes.filter((entry) => entry.hydration !== "none").length !== expected.interactive) throw new Error(`${unitId} interactive visual inventory is invalid.`);
  const specId = normalizedSpecId(unitId, sourceVisualId);
  const entry = manifest.scenes.find(({ id }) => id === specId);
  if (!entry) throw new Error(`Visual ${sourceVisualId} is not compiled for ${unitId}.`);
  const scene = entry.compiledScene;
  if (scene.provenance.visibility !== "public" || !entry.staticAsset.path.startsWith("/visuals/v1/")) throw new Error(`Visual ${sourceVisualId} failed its public delivery boundary.`);
  return {
    id: entry.id,
    sourceVisualId,
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
