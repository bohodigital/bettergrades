import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCortexJsLatexCompiler } from "../../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpecs } from "../../lib/visualization/compiler/index.ts";
import { renderStaticSvg } from "../../lib/visualization/renderers/static-svg/index.ts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDirectory, "../..");
const sourcePath = resolve(root, "content/visualizations/limits-continuity/visual-specs.v1.json");
const manifestPath = resolve(root, "content/visualizations/limits-continuity/compiled-scenes.v1.json");
const assetDirectory = resolve(root, "public/visuals/v1");
const checkOnly = process.argv.includes("--check");
const expectedIds = new Set([
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
const isLimitsAssetName = (name) => [...expectedIds].some((id) => name.startsWith(`${id}.`));

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function readUtf8(path) {
  return readFile(path, "utf8");
}

async function writeAtomic(path, value) {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  await writeFile(temporaryPath, value, "utf8");
  await rename(temporaryPath, path);
}

function collectAllowedVariables(specs) {
  const variables = new Set();
  for (const spec of specs) {
    for (const variable of spec.coordinateSpace?.variables ?? []) variables.add(variable);
    for (const control of spec.controls ?? []) {
      if (typeof control.parameter === "string") variables.add(control.parameter);
    }
  }
  return [...variables].sort();
}

function assertExactInventory(specs) {
  const ids = specs.map((spec) => spec.id);
  if (ids.length !== expectedIds.size || new Set(ids).size !== ids.length) {
    throw new Error(`Expected exactly ${expectedIds.size} unique migrated visual IDs; found ${ids.length}.`);
  }
  for (const id of expectedIds) {
    if (!ids.includes(id)) throw new Error(`Required migrated visual ${id} is missing.`);
  }
  for (const id of ids) {
    if (!expectedIds.has(id)) throw new Error(`Unexpected public visual ${id}; this work order permits only the current 13 Limits visuals.`);
  }
}

async function assertCurrent(path, expected, label) {
  let actual;
  try {
    actual = await readUtf8(path);
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`${label} is missing at ${path}. Run visuals:compile.`);
    throw error;
  }
  if (actual !== expected) throw new Error(`${label} is stale at ${path}. Run visuals:compile and commit the deterministic output.`);
}

const sourceText = await readUtf8(sourcePath);
const canonicalSourceText = sourceText.replace(/\r\n?/g, "\n");
const collection = JSON.parse(canonicalSourceText);
if (collection.collectionSchemaVersion !== 1 || !Array.isArray(collection.visuals)) {
  throw new Error("The Limits visual collection must use collectionSchemaVersion 1 and a visuals array.");
}
assertExactInventory(collection.visuals);

const compileLatex = await createCortexJsLatexCompiler({
  allowedVariables: collectAllowedVariables(collection.visuals),
  maxDepth: 32,
  maxNodes: 512,
  maxExpressionLength: 2_048,
});
const scenes = compileVisualSpecs(collection.visuals, { compileLatex });
const rendered = scenes.map((scene) => {
  const asset = renderStaticSvg(scene, { assetPrefix: "/visuals/v1", maxOutputBytes: 50_000 });
  if (!asset.meetsTarget || asset.requiresSizeJustification) {
    throw new Error(`Static SVG ${scene.id} is ${asset.byteLength} bytes; the version 1 release target is 50,000 bytes without an approved exception.`);
  }
  return { scene, asset };
});

const manifest = {
  manifestVersion: 1,
  collectionId: collection.collectionId,
  sourceSha256: sha256(canonicalSourceText),
  compilerVersion: "bvlp-compiler-v1",
  assetPrefix: "/visuals/v1",
  sceneCount: rendered.length,
  scenes: rendered.map(({ scene, asset }) => ({
    id: scene.id,
    route: scene.provenance.route,
    selectedRenderer: scene.selectedRenderer,
    hydration: scene.delivery.hydration,
    staticAsset: {
      path: asset.assetPath,
      sha256: asset.sha256,
      bytes: asset.byteLength,
      width: asset.width,
      height: asset.height,
    },
    compiledScene: scene,
  })),
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
const expectedAssetNames = new Set(rendered.map(({ asset }) => asset.assetFileName));

if (checkOnly) {
  await assertCurrent(manifestPath, manifestText, "Compiled visual manifest");
  for (const { scene, asset } of rendered) {
    await assertCurrent(resolve(assetDirectory, asset.assetFileName), asset.svg, `Static SVG for ${scene.id}`);
  }
  const existing = await readdir(assetDirectory);
  const stale = existing.filter((name) => isLimitsAssetName(name) && name.endsWith(".svg") && !expectedAssetNames.has(name));
  if (stale.length) throw new Error(`Stale generated visual assets are present: ${stale.join(", ")}.`);
  console.log(`Verified ${rendered.length} deterministic compiled scenes and static SVG assets.`);
} else {
  await mkdir(assetDirectory, { recursive: true });
  for (const { asset } of rendered) {
    await writeAtomic(resolve(assetDirectory, asset.assetFileName), asset.svg);
  }
  for (const name of await readdir(assetDirectory)) {
    if (isLimitsAssetName(name) && /^[a-z][a-z0-9-]*\.[a-f0-9]{16}\.svg$/.test(name) && !expectedAssetNames.has(name)) {
      await unlink(resolve(assetDirectory, name));
    }
  }
  await writeAtomic(manifestPath, manifestText);
  console.log(`Compiled ${rendered.length} VisualSpec scenes into ${assetDirectory}.`);
}
