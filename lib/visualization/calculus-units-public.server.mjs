import unit2aManifest from "../../content/calculus/units/unit-2a/public-runtime-scenes.server.json" with { type: "json" };
import unit2bManifest from "../../content/calculus/units/unit-2b/public-runtime-scenes.server.json" with { type: "json" };
import unit3aManifest from "../../content/calculus/units/unit-3a/public-runtime-scenes.server.json" with { type: "json" };
import unit3bManifest from "../../content/calculus/units/unit-3b/public-runtime-scenes.server.json" with { type: "json" };
import unit4aManifest from "../../content/calculus/units/unit-4a/public-runtime-scenes.server.json" with { type: "json" };
import unit4bManifest from "../../content/calculus/units/unit-4b/public-runtime-scenes.server.json" with { type: "json" };

const manifests = new Map([
  ["calc-1-unit-2a-derivative-foundations-techniques", unit2aManifest],
  ["calc-1-unit-2b-derivative-applications", unit2bManifest],
  ["calc-1-unit-3a-integral-foundations-techniques", unit3aManifest],
  ["calc-1-unit-3b-integration-applications", unit3bManifest],
  ["calc-2-unit-4a-sequences-infinite-series", unit4aManifest],
  ["calc-2-unit-4b-power-taylor-series", unit4bManifest],
]);
const expectations = new Map([
  ["calc-1-unit-2a-derivative-foundations-techniques", { count: 27, interactive: 1 }],
  ["calc-1-unit-2b-derivative-applications", { count: 34, interactive: 7 }],
  ["calc-1-unit-3a-integral-foundations-techniques", { count: 11, interactive: 4 }],
  ["calc-1-unit-3b-integration-applications", { count: 9, interactive: 4 }],
  ["calc-2-unit-4a-sequences-infinite-series", { count: 18, interactive: 7 }],
  ["calc-2-unit-4b-power-taylor-series", { count: 20, interactive: 6 }],
]);

function normalizedSpecId(unitId, sourceVisualId) {
  const prefixes = new Map([
    ["calc-1-unit-2a-derivative-foundations-techniques", "unit-2a"],
    ["calc-1-unit-2b-derivative-applications", "unit-2b"],
    ["calc-1-unit-3a-integral-foundations-techniques", "unit-3a"],
    ["calc-1-unit-3b-integration-applications", "unit-3b"],
    ["calc-2-unit-4a-sequences-infinite-series", "unit-4a"],
    ["calc-2-unit-4b-power-taylor-series", "unit-4b"],
  ]);
  const prefix = prefixes.get(unitId);
  if (!prefix) throw new Error(`Unknown calculus-unit visual prefix ${unitId}.`);
  return `${prefix}-${String(sourceVisualId).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getCalculusUnitPublicVisual(unitId, sourceVisualId) {
  const manifest = manifests.get(unitId);
  const expected = expectations.get(unitId);
  if (!manifest || !expected) throw new Error(`Unknown calculus-unit visual collection ${unitId}.`);
  if (manifest.manifestVersion !== 1 || manifest.sceneCount !== expected.count || manifest.scenes.length !== expected.count) throw new Error(`${unitId} compiled visual inventory is invalid.`);
  if (manifest.interactiveCount !== expected.interactive || manifest.scenes.filter((entry) => entry.hydration !== "none").length !== expected.interactive) throw new Error(`${unitId} interactive visual inventory is invalid.`);
  const specId = normalizedSpecId(unitId, sourceVisualId);
  const entry = manifest.scenes.find(({ id }) => id === specId);
  if (!entry) throw new Error(`Visual ${sourceVisualId} is not compiled for ${unitId}.`);
  if (entry.visibility !== "public" || !entry.staticAsset.path.startsWith("/visuals/v1/")) throw new Error(`Visual ${sourceVisualId} failed its public delivery boundary.`);
  const visual = { ...entry };
  delete visual.visibility;
  return visual;
}
