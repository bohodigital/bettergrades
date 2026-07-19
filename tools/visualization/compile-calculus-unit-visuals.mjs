import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createCortexJsLatexCompiler } from "../../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpecs } from "../../lib/visualization/compiler/index.ts";
import { renderStaticSvg } from "../../lib/visualization/renderers/static-svg/index.ts";

const root = resolve(import.meta.dirname, "../..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1] ?? "unit-2a";
const checkOnly = process.argv.includes("--check");
const expectations = { "unit-2a": { count: 27, interactive: 1, jsxgraph: 0 }, "unit-2b": { count: 34, interactive: 7, jsxgraph: 1 }, "unit-3a": { count: 11, interactive: 4, jsxgraph: 0 }, "unit-3b": { count: 9, interactive: 4, jsxgraph: 0 } };
const expected = expectations[requested];
if (!expected) throw new Error(`Unknown calculus unit ${requested}.`);
const directory = resolve(root, "content/calculus/units", requested);
const sourcePath = resolve(directory, "visual-specs.v1.json");
const manifestPath = resolve(directory, "compiled-scenes.v1.json");
const runtimeManifestPath = resolve(directory, "public-runtime-scenes.server.json");
const assetDirectory = resolve(root, "public/visuals/v1");

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

const sourceText = (await readFile(sourcePath, "utf8")).replace(/\r\n?/g, "\n");
const collection = JSON.parse(sourceText);
if (collection.collectionSchemaVersion !== 1 || !Array.isArray(collection.visuals)) throw new Error(`${requested} must use VisualSpec collection schema version 1.`);
if (collection.visuals.length !== expected.count || new Set(collection.visuals.map((spec) => spec.id)).size !== expected.count) throw new Error(`${requested} requires exactly ${expected.count} unique visual specs.`);
if (collection.visuals.filter((spec) => spec.preferredRenderer === "prefer-interactive").length !== expected.interactive) throw new Error(`${requested} interactive renderer inventory differs from the release plan.`);

const variables = new Set();
for (const spec of collection.visuals) {
  for (const variable of spec.coordinateSpace?.variables ?? []) variables.add(variable);
  for (const control of spec.controls ?? []) if (typeof control.parameter === "string") variables.add(control.parameter);
}
const compileLatex = await createCortexJsLatexCompiler({ allowedVariables: [...variables].sort(), maxDepth: 32, maxNodes: 512, maxExpressionLength: 2_048 });
const scenes = compileVisualSpecs(collection.visuals, { compileLatex });
if (scenes.filter((scene) => scene.delivery.hydration !== "none").length !== expected.interactive) throw new Error(`${requested} hydrated scene inventory differs from the release plan.`);
if (scenes.filter((scene) => scene.selectedRenderer === "jsxgraph").length !== expected.jsxgraph) throw new Error(`${requested} JSXGraph inventory differs from the release plan.`);
const rendered = scenes.map((scene) => {
  const asset = renderStaticSvg(scene, { assetPrefix: "/visuals/v1", maxOutputBytes: 50_000 });
  if (!asset.meetsTarget || asset.requiresSizeJustification) throw new Error(`${scene.id} static SVG is ${asset.byteLength} bytes and exceeds the approved target.`);
  return { scene, asset };
});
const manifest = {
  manifestVersion: 1,
  collectionId: collection.collectionId,
  sourceSha256: createHash("sha256").update(sourceText).digest("hex"),
  compilerVersion: "bvlp-compiler-v1",
  assetPrefix: "/visuals/v1",
  sceneCount: rendered.length,
  scenes: rendered.map(({ scene, asset }) => ({
    id: scene.id,
    route: scene.provenance.route,
    sourceVisualId: scene.provenance.sourceVisualId,
    selectedRenderer: scene.selectedRenderer,
    hydration: scene.delivery.hydration,
    staticAsset: { path: asset.assetPath, sha256: asset.sha256, bytes: asset.byteLength, width: asset.width, height: asset.height },
    compiledScene: scene,
  })),
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
const runtimeManifest = {
  manifestVersion: 1,
  collectionId: collection.collectionId,
  sourceSha256: manifest.sourceSha256,
  compilerVersion: manifest.compilerVersion,
  sceneCount: manifest.sceneCount,
  interactiveCount: rendered.filter(({ scene }) => scene.delivery.hydration !== "none").length,
  scenes: manifest.scenes.map((entry) => {
    const scene = entry.compiledScene;
    return {
      id: entry.id,
      sourceVisualId: entry.sourceVisualId,
      selectedRenderer: entry.selectedRenderer,
      hydration: entry.hydration,
      staticAsset: entry.staticAsset,
      title: scene.title,
      caption: scene.caption,
      learningPurpose: scene.learningPurpose,
      longDescription: scene.longDescription,
      accessibility: scene.accessibility,
      sourceFingerprint: scene.provenance.sourceFingerprint,
      visibility: scene.provenance.visibility,
      ...(entry.hydration === "none" ? {} : { interactiveScene: publicInteractiveScene(scene) }),
    };
  }),
};
const runtimeManifestText = `${JSON.stringify(runtimeManifest, null, 2)}\n`;
const expectedAssets = new Map(rendered.map(({ asset }) => [asset.assetFileName, asset.svg]));

async function assertCurrent(path, expectedText, label) {
  let actual;
  try { actual = await readFile(path, "utf8"); } catch (error) {
    if (error?.code === "ENOENT") throw new Error(`${label} is missing. Run the calculus visual compiler.`);
    throw error;
  }
  if (actual.replace(/\r\n?/g, "\n") !== expectedText) throw new Error(`${label} is stale.`);
}

if (checkOnly) {
  await assertCurrent(manifestPath, manifestText, `${requested} compiled visual manifest`);
  await assertCurrent(runtimeManifestPath, runtimeManifestText, `${requested} public runtime visual manifest`);
  for (const [name, svg] of expectedAssets) await assertCurrent(resolve(assetDirectory, name), svg, `${requested} static SVG ${name}`);
  const stale = (await readdir(assetDirectory)).filter((name) => name.startsWith(`${requested}-`) && name.endsWith(".svg") && !expectedAssets.has(name));
  if (stale.length) throw new Error(`${requested} has stale SVG assets: ${stale.join(", ")}.`);
} else {
  await mkdir(assetDirectory, { recursive: true });
  for (const [name, svg] of expectedAssets) {
    const path = resolve(assetDirectory, name);
    const temporary = `${path}.tmp-${process.pid}`;
    await writeFile(temporary, svg, "utf8");
    await rename(temporary, path);
  }
  for (const name of await readdir(assetDirectory)) if (name.startsWith(`${requested}-`) && name.endsWith(".svg") && !expectedAssets.has(name)) await unlink(resolve(assetDirectory, name));
  const temporary = `${manifestPath}.tmp-${process.pid}`;
  await writeFile(temporary, manifestText, "utf8");
  await rename(temporary, manifestPath);
  const runtimeTemporary = `${runtimeManifestPath}.tmp-${process.pid}`;
  await writeFile(runtimeTemporary, runtimeManifestText, "utf8");
  await rename(runtimeTemporary, runtimeManifestPath);
}
console.log(`${checkOnly ? "Verified" : "Compiled"} ${rendered.length} ${requested} BVLP scenes and static SVG fallbacks.`);
