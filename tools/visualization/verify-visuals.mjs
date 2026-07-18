import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "../..");
const manifestRelativePath = "content/visualizations/limits-continuity/compiled-scenes.v1.json";
const compilerRelativePath = "tools/visualization/compile-visuals.mjs";
const assetDirectoryRelativePath = "public/visuals/v1";
const maximumSvgBytes = 50_000;

export const EXPECTED_VISUAL_IDS = Object.freeze([
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

export const INTERACTIVE_VISUAL_IDS = Object.freeze([
  "secant-tangent",
  "squeeze-bounds",
  "unit-circle-squeeze",
  "epsilon-delta-window",
]);

const expectedVisualIdSet = new Set(EXPECTED_VISUAL_IDS);
const interactiveVisualIdSet = new Set(INTERACTIVE_VISUAL_IDS);
const expectedManifestKeys = [
  "assetPrefix",
  "collectionId",
  "compilerVersion",
  "manifestVersion",
  "sceneCount",
  "scenes",
  "sourceSha256",
];
const expectedManifestEntryKeys = [
  "compiledScene",
  "hydration",
  "id",
  "route",
  "selectedRenderer",
  "staticAsset",
];
const expectedStaticAssetKeys = ["bytes", "height", "path", "sha256", "width"];
const expectedPublicVisualKeys = [
  "accessibility",
  "caption",
  "hydration",
  "id",
  "learningPurpose",
  "longDescription",
  "selectedRenderer",
  "sourceFingerprint",
  "staticAsset",
  "title",
];
const expectedPublicProvenanceKeys = [
  "compilerVersion",
  "route",
  "sourceFingerprint",
  "sourceVisualId",
  "visibility",
];
const prohibitedPublicField = /^(?:canonicalAnswer|workedFeedbackLatex|expressionLatex)$/i;
const prohibitedRuntimeValue = /@cortex-js|compute-engine|\bComputeEngine\b/i;
const rawLatexValue = /\\(?:\(|\[|begin\b|end\b|frac\b|dfrac\b|tfrac\b|sqrt\b|varepsilon\b|epsilon\b|delta\b|theta\b|infty\b|lim\b|left\b|right\b|cdot\b|times\b|leq\b|geq\b|to\b)|\$\$/;

function fail(message) {
  throw new Error(`BVLP visual verification failed: ${message}`);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sortedKeys(value) {
  return Object.keys(value).sort();
}

function assertPlainObject(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    fail(`${label} must be an object.`);
  }
}

function assertExactKeys(value, expectedKeys, label) {
  assertPlainObject(value, label);
  const actual = sortedKeys(value);
  const expected = [...expectedKeys].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} keys must be exactly ${expected.join(", ")}; found ${actual.join(", ")}.`);
  }
}

function assertExactOrderedIds(actual, expected, label) {
  if (!Array.isArray(actual)) fail(`${label} must be an array.`);
  if (new Set(actual).size !== actual.length) fail(`${label} contains duplicate IDs.`);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${label} must be exactly ${expected.join(", ")} in canonical order; found ${actual.join(", ")}.`);
  }
}

function assertSameIdSet(actual, expected, label) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);
  if (actualSet.size !== actual.length) fail(`${label} contains a duplicate scene request.`);
  const missing = [...expectedSet].filter((id) => !actualSet.has(id));
  const unexpected = [...actualSet].filter((id) => !expectedSet.has(id));
  if (missing.length || unexpected.length) {
    fail(`${label} does not match its requested scenes (missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}).`);
  }
}

function inspectForPublicLeaks(value, label, { rejectRawLatex = false, rejectSourceFile = false } = {}) {
  const visit = (candidate, path) => {
    if (Array.isArray(candidate)) {
      candidate.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    if (candidate !== null && typeof candidate === "object") {
      for (const [key, nested] of Object.entries(candidate)) {
        if (prohibitedPublicField.test(key) || (rejectSourceFile && key === "sourceFile")) {
          fail(`${label} exposes prohibited field ${path}.${key}.`);
        }
        visit(nested, `${path}.${key}`);
      }
      return;
    }
    if (typeof candidate !== "string") return;
    if (prohibitedRuntimeValue.test(candidate)) fail(`${label} exposes a Cortex runtime value at ${path}.`);
    if (rejectRawLatex && rawLatexValue.test(candidate)) fail(`${label} exposes raw LaTeX at ${path}.`);
  };
  visit(value, label);
}

export function assertManifestContract(manifest) {
  assertExactKeys(manifest, expectedManifestKeys, "compiled manifest");
  if (manifest.manifestVersion !== 1) fail(`manifestVersion must be 1; found ${manifest.manifestVersion}.`);
  if (manifest.collectionId !== "limits-continuity-current-public-visuals") {
    fail(`collectionId must remain limits-continuity-current-public-visuals; found ${manifest.collectionId}.`);
  }
  if (manifest.compilerVersion !== "bvlp-compiler-v1") {
    fail(`compilerVersion must be bvlp-compiler-v1; found ${manifest.compilerVersion}.`);
  }
  if (manifest.assetPrefix !== "/visuals/v1") fail(`assetPrefix must be /visuals/v1; found ${manifest.assetPrefix}.`);
  if (!/^[a-f0-9]{64}$/.test(manifest.sourceSha256)) fail("sourceSha256 must be a lowercase SHA-256 digest.");
  if (manifest.sceneCount !== EXPECTED_VISUAL_IDS.length) {
    fail(`sceneCount must be ${EXPECTED_VISUAL_IDS.length}; found ${manifest.sceneCount}.`);
  }
  if (!Array.isArray(manifest.scenes) || manifest.scenes.length !== EXPECTED_VISUAL_IDS.length) {
    fail(`scenes must contain exactly ${EXPECTED_VISUAL_IDS.length} entries.`);
  }

  assertExactOrderedIds(manifest.scenes.map((entry) => entry?.id), EXPECTED_VISUAL_IDS, "manifest scene inventory");
  const assetPaths = new Set();
  const actualInteractiveIds = [];

  for (const entry of manifest.scenes) {
    const label = `manifest scene ${entry.id}`;
    assertExactKeys(entry, expectedManifestEntryKeys, label);
    assertExactKeys(entry.staticAsset, expectedStaticAssetKeys, `${label} staticAsset`);
    assertPlainObject(entry.compiledScene, `${label} compiledScene`);

    const isInteractive = interactiveVisualIdSet.has(entry.id);
    const expectedHydration = isInteractive ? "near-viewport" : "none";
    const expectedRenderer = isInteractive ? "bg-interactive-2d" : "static-svg";
    if (entry.hydration !== expectedHydration) fail(`${label} hydration must be ${expectedHydration}; found ${entry.hydration}.`);
    if (entry.selectedRenderer !== expectedRenderer) fail(`${label} renderer must be ${expectedRenderer}; found ${entry.selectedRenderer}.`);
    if (isInteractive) actualInteractiveIds.push(entry.id);

    const scene = entry.compiledScene;
    if (scene.compiledSceneVersion !== 1) fail(`${label} compiledSceneVersion must be 1.`);
    if (scene.sourceSpecVersion !== 1) fail(`${label} sourceSpecVersion must be 1.`);
    if (scene.id !== entry.id) fail(`${label} compiled scene ID does not match its manifest ID.`);
    if (scene.selectedRenderer !== entry.selectedRenderer) fail(`${label} compiled renderer does not match its manifest renderer.`);
    if (scene.delivery?.hydration !== entry.hydration || scene.delivery?.publicFieldsOnly !== true) {
      fail(`${label} compiled delivery boundary does not match its manifest hydration/public-fields contract.`);
    }
    if (scene.staticFallback?.required !== true || scene.staticFallback?.rendererId !== "static-svg") {
      fail(`${label} must require the static-svg fallback.`);
    }
    if (scene.provenance?.route !== entry.route || scene.provenance?.visibility !== "public") {
      fail(`${label} route/public provenance does not match its manifest entry.`);
    }

    const asset = entry.staticAsset;
    if (!/^[a-f0-9]{64}$/.test(asset.sha256)) fail(`${label} static asset SHA-256 is invalid.`);
    const expectedPath = `/visuals/v1/${entry.id}.${asset.sha256.slice(0, 16)}.svg`;
    if (asset.path !== expectedPath) fail(`${label} static asset path must be ${expectedPath}; found ${asset.path}.`);
    if (assetPaths.has(asset.path)) fail(`${label} reuses static asset path ${asset.path}.`);
    assetPaths.add(asset.path);
    if (!Number.isInteger(asset.bytes) || asset.bytes <= 0 || asset.bytes > maximumSvgBytes) {
      fail(`${label} static asset bytes must be an integer from 1 through ${maximumSvgBytes}; found ${asset.bytes}.`);
    }
    for (const dimension of ["width", "height"]) {
      if (!Number.isInteger(asset[dimension]) || asset[dimension] <= 0) {
        fail(`${label} static asset ${dimension} must be a positive integer.`);
      }
    }
  }

  assertSameIdSet(actualInteractiveIds, INTERACTIVE_VISUAL_IDS, "interactive manifest inventory");
  return manifest;
}

export async function verifyManifestAssets(manifest, { root = projectRoot } = {}) {
  assertManifestContract(manifest);
  const expectedFileNames = new Set();

  for (const entry of manifest.scenes) {
    const fileName = entry.staticAsset.path.slice("/visuals/v1/".length);
    expectedFileNames.add(fileName);
    const path = resolve(root, assetDirectoryRelativePath, fileName);
    let asset;
    try {
      asset = await readFile(path);
    } catch (error) {
      if (error?.code === "ENOENT") fail(`static SVG for ${entry.id} is missing at ${path}.`);
      throw error;
    }
    if (asset.byteLength !== entry.staticAsset.bytes) {
      fail(`static SVG for ${entry.id} is ${asset.byteLength} bytes; manifest records ${entry.staticAsset.bytes}.`);
    }
    if (asset.byteLength > maximumSvgBytes) fail(`static SVG for ${entry.id} exceeds the ${maximumSvgBytes}-byte budget.`);
    const digest = sha256(asset);
    if (digest !== entry.staticAsset.sha256) fail(`static SVG for ${entry.id} has SHA-256 ${digest}; manifest records ${entry.staticAsset.sha256}.`);
    const source = asset.toString("utf8");
    if (!/^<svg\b/.test(source)) fail(`static asset for ${entry.id} is not an SVG document.`);
    if (/<(?:script|foreignObject)\b|\bon\w+\s*=|javascript:/i.test(source)) {
      fail(`static SVG for ${entry.id} contains executable or foreign markup.`);
    }
  }

  const manifestIds = manifest.scenes.map((entry) => entry.id);
  const presentManifestSvgNames = (await readdir(resolve(root, assetDirectoryRelativePath)))
    .filter((name) => name.endsWith(".svg") && manifestIds.some((id) => name.startsWith(`${id}.`)));
  assertSameIdSet(presentManifestSvgNames, [...expectedFileNames], "generated SVG file inventory");
}

export function assertPublicVisualSafety(visual, id) {
  assertPlainObject(visual, `public visual ${id}`);
  const expectedKeys = interactiveVisualIdSet.has(id)
    ? [...expectedPublicVisualKeys, "interactiveScene"]
    : expectedPublicVisualKeys;
  assertExactKeys(visual, expectedKeys, `public visual ${id}`);
  inspectForPublicLeaks(visual, `public visual ${id}`, { rejectRawLatex: true, rejectSourceFile: true });

  const shouldBeInteractive = interactiveVisualIdSet.has(id);
  if (Boolean(visual.interactiveScene) !== shouldBeInteractive) {
    fail(`public visual ${id} interactive payload does not match the exact four-item allowlist.`);
  }
  if (!shouldBeInteractive) return;

  const interactiveScene = visual.interactiveScene;
  assertPlainObject(interactiveScene, `public visual ${id} interactiveScene`);
  assertExactKeys(interactiveScene.provenance, expectedPublicProvenanceKeys, `public visual ${id} interactive provenance`);
  if (interactiveScene.provenance.visibility !== "public") fail(`public visual ${id} interactive provenance must be public.`);
  if (interactiveScene.delivery?.publicFieldsOnly !== true) fail(`public visual ${id} interactive delivery must be public-fields-only.`);
}

function flattenNodes(nodes) {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
}

export async function verifyPublicProjection(manifest, { root = projectRoot } = {}) {
  const limitsModuleUrl = pathToFileURL(resolve(root, "lib/calculus/limits-unit.mjs")).href;
  const visualModuleUrl = pathToFileURL(resolve(root, "lib/visualization/limits-public.server.mjs")).href;
  const [{ getPublicLimitsUnitPage, limitsUnitRoutes }, { limitsPublicVisualIds }] = await Promise.all([
    import(limitsModuleUrl),
    import(visualModuleUrl),
  ]);
  assertSameIdSet([...limitsPublicVisualIds], EXPECTED_VISUAL_IDS, "public visual allowlist");

  const manifestById = new Map(manifest.scenes.map((entry) => [entry.id, entry]));
  const deliveredOccurrences = new Map(EXPECTED_VISUAL_IDS.map((id) => [id, 0]));

  for (const route of limitsUnitRoutes) {
    const projection = getPublicLimitsUnitPage(route.path);
    if (!projection) fail(`public Limits route ${route.path} has no projection.`);
    const nodes = flattenNodes(projection.page.nodes);
    const graphNodes = nodes.filter((node) => node.type === "graph-specification" && typeof node.graphId === "string");
    const requestedIds = graphNodes.map((node) => node.graphId);
    const deliveredNodes = nodes.filter((node) => node.visual !== undefined);
    const deliveredIds = deliveredNodes.map((node) => node.visual?.id);
    assertSameIdSet(deliveredIds, requestedIds, `public route ${route.path}`);

    for (const node of deliveredNodes) {
      const id = node.visual?.id;
      if (!expectedVisualIdSet.has(id)) fail(`public route ${route.path} delivers out-of-scope visual ${id}.`);
      if (node.type !== "graph-specification" || node.graphId !== id) {
        fail(`public route ${route.path} attaches visual ${id} outside its exact graph request.`);
      }
      deliveredOccurrences.set(id, deliveredOccurrences.get(id) + 1);
      const entry = manifestById.get(id);
      if (entry.route !== route.path) fail(`manifest route for ${id} is ${entry.route}; public delivery is ${route.path}.`);
      if (node.visual.selectedRenderer !== entry.selectedRenderer || node.visual.hydration !== entry.hydration) {
        fail(`public delivery metadata for ${id} does not match its manifest entry.`);
      }
      if (JSON.stringify(node.visual.staticAsset) !== JSON.stringify(entry.staticAsset)) {
        fail(`public static asset projection for ${id} does not match its manifest entry.`);
      }
      if (node.visual.sourceFingerprint !== entry.compiledScene.provenance.sourceFingerprint) {
        fail(`public source fingerprint for ${id} does not match the compiled scene.`);
      }
      assertPublicVisualSafety(node.visual, id);
    }

    const companionVisuals = projection.companionVisuals ?? [];
    const companionIds = companionVisuals.map((companion) => companion.visual?.id);
    if (new Set(companionIds).size !== companionIds.length) {
      fail(`public route ${route.path} repeats a companion visual.`);
    }
    for (const companion of companionVisuals) {
      const id = companion.visual?.id;
      if (!expectedVisualIdSet.has(id)) fail(`public route ${route.path} delivers out-of-scope companion visual ${id}.`);
      if (companion.id !== id || typeof companion.heading !== "string" || typeof companion.explanation !== "string") {
        fail(`public route ${route.path} has an invalid companion visual wrapper.`);
      }
      const entry = manifestById.get(id);
      if (companion.visual.selectedRenderer !== entry.selectedRenderer || companion.visual.hydration !== entry.hydration) {
        fail(`companion visual metadata for ${id} on ${route.path} does not match its manifest entry.`);
      }
      if (JSON.stringify(companion.visual.staticAsset) !== JSON.stringify(entry.staticAsset)) {
        fail(`companion static asset projection for ${id} on ${route.path} does not match its manifest entry.`);
      }
      assertPublicVisualSafety(companion.visual, id);
      inspectForPublicLeaks(companion, `companion visual ${id} on ${route.path}`, { rejectRawLatex: true, rejectSourceFile: true });
    }

    if (deliveredNodes.length || companionVisuals.length) {
      inspectForPublicLeaks(projection, `public route ${route.path}`);
    }
  }

  for (const [id, count] of deliveredOccurrences) {
    if (count !== 1) fail(`public visual ${id} must be delivered exactly once across the unit; found ${count}.`);
  }
}

export async function verifyLegacyCanvasRemoval({ root = projectRoot } = {}) {
  const legacyPath = resolve(root, "app/LimitsGraphCanvas.tsx");
  try {
    await access(legacyPath);
    fail(`legacy Canvas renderer still exists at ${legacyPath}.`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  for (const relativePath of ["app/LimitsUnitPages.tsx", "app/globals.css"]) {
    const source = await readFile(resolve(root, relativePath), "utf8");
    if (/LimitsGraphCanvas|limits-graph-canvas/.test(source)) {
      fail(`${relativePath} still references the legacy Limits Canvas renderer.`);
    }
  }
}

export async function verifyDeterministicCompilation({ root = projectRoot } = {}) {
  try {
    await execFileAsync(process.execPath, [resolve(root, compilerRelativePath), "--check"], {
      cwd: root,
      maxBuffer: 10 * 1024 * 1024,
      windowsHide: true,
    });
  } catch (error) {
    const detail = [error?.stdout, error?.stderr].filter(Boolean).join("\n").trim();
    fail(`deterministic compilation is stale.${detail ? `\n${detail}` : ""}`);
  }
}

export async function verifyVisualArtifacts({ root = projectRoot, checkCompilation = true } = {}) {
  const manifestPath = resolve(root, manifestRelativePath);
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    fail(`cannot read the compiled manifest at ${manifestPath}: ${error.message}`);
  }
  assertManifestContract(manifest);
  await verifyManifestAssets(manifest, { root });
  await verifyPublicProjection(manifest, { root });
  await verifyLegacyCanvasRemoval({ root });
  if (checkCompilation) await verifyDeterministicCompilation({ root });
  return { sceneCount: manifest.sceneCount, interactiveCount: INTERACTIVE_VISUAL_IDS.length };
}

async function main() {
  const result = await verifyVisualArtifacts();
  console.log(`Verified ${result.sceneCount} exact Limits visual artifacts, including ${result.interactiveCount} allowlisted interactive scenes.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  try {
    await main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
