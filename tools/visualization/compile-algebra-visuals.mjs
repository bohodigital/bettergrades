import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { createCortexJsLatexCompiler } from "../../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpecs } from "../../lib/visualization/compiler/index.ts";
import { renderStaticSvg } from "../../lib/visualization/renderers/static-svg/index.ts";

const root = resolve(import.meta.dirname, "../..");
const checkOnly = process.argv.includes("--check");
const requestedUnit = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1];
const course = JSON.parse(await readFile(resolve(root, "content/algebra/course.public.json"), "utf8"));
const unitCodes = requestedUnit ? [requestedUnit.replace(/^unit-/i, "").toUpperCase()] : course.units.map((unit) => unit.code);
const assetDirectory = resolve(root, "public/visuals/v1");

if (!checkOnly) {
  const prefix = requestedUnit ? `algebra-${requestedUnit.replace(/^unit-/i, "").toLowerCase()}-` : "algebra-";
  const existingAssets = await readdir(assetDirectory).catch(() => []);
  for (const name of existingAssets) {
    if (name.startsWith(prefix) && name.endsWith(".svg")) await rm(resolve(assetDirectory, name));
  }
}

function publicInteractiveScene(scene) {
  const {
    compiledSceneVersion, sourceSpecVersion, id, kind, title, caption, learningPurpose, longDescription,
    coordinateSpace, viewport, axes, panels, layers, controls, accessibility, print, performance,
    requiredCapabilities, selectedRenderer, staticFallback, delivery,
  } = scene;
  const { route, sourceVisualId, sourceFingerprint, compilerVersion, visibility } = scene.provenance;
  return {
    compiledSceneVersion, sourceSpecVersion, id, kind, title, caption, learningPurpose, longDescription,
    coordinateSpace, viewport, axes, panels, layers, controls, accessibility, print, performance,
    requiredCapabilities, selectedRenderer, staticFallback, delivery,
    provenance: { route, sourceVisualId, sourceFingerprint, compilerVersion, visibility },
  };
}

async function assertCurrent(path, expected, label) {
  const actual = await readFile(path, "utf8").catch(() => "");
  if (actual.replace(/\r\n?/g, "\n") !== expected) throw new Error(`${label} is missing or stale.`);
}

for (const unitCode of unitCodes) {
  const directory = resolve(root, "content/algebra/units", `unit-${unitCode.toLowerCase()}`);
  const sourcePath = resolve(directory, "visual-specs.v1.json");
  const manifestPath = resolve(directory, "compiled-scenes.v1.json");
  const runtimePath = resolve(directory, "public-runtime-scenes.server.json");
  const sourceText = (await readFile(sourcePath, "utf8")).replace(/\r\n?/g, "\n");
  const collection = JSON.parse(sourceText);
  const variables = new Set();
  for (const spec of collection.visuals) {
    for (const variable of spec.coordinateSpace?.variables ?? []) variables.add(variable);
    for (const control of spec.controls ?? []) if (control.parameter) variables.add(control.parameter);
  }
  const compileLatex = await createCortexJsLatexCompiler({
    allowedVariables: [...variables].sort(),
    maxDepth: 32,
    maxNodes: 512,
    maxExpressionLength: 2048,
  });
  const scenes = compileVisualSpecs(collection.visuals, { compileLatex });
  const rendered = scenes.map((scene) => ({
    scene,
    asset: renderStaticSvg(scene, { assetPrefix: "/visuals/v1", maxOutputBytes: 50_000 }),
  }));
  for (const { scene, asset } of rendered) {
    if (!asset.meetsTarget || asset.requiresSizeJustification) throw new Error(`${scene.id} exceeds the approved 50 KB static SVG target.`);
  }
  const manifest = {
    manifestVersion: 1,
    collectionId: collection.collectionId,
    sourceSha256: createHash("sha256").update(sourceText).digest("hex"),
    compilerVersion: "bvlp-compiler-v1",
    assetPrefix: "/visuals/v1",
    sceneCount: scenes.length,
    scenes: rendered.map(({ scene, asset }) => ({
      id: scene.id,
      route: scene.provenance.route,
      sourceVisualId: scene.provenance.sourceVisualId,
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
  const runtime = {
    manifestVersion: 1,
    collectionId: collection.collectionId,
    sourceSha256: manifest.sourceSha256,
    compilerVersion: manifest.compilerVersion,
    sceneCount: manifest.sceneCount,
    interactiveCount: scenes.filter((scene) => scene.delivery.hydration !== "none").length,
    scenes: manifest.scenes.map((entry) => {
      const scene = entry.compiledScene;
      const isFunctionGraph = scene.kind === "cartesian-2d"
        && scene.layers.some((layer) => layer.kind === "function");
      return {
        id: entry.id,
        sourceVisualId: entry.sourceVisualId,
        isFunctionGraph,
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
  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  const runtimeText = `${JSON.stringify(runtime, null, 2)}\n`;
  if (checkOnly) {
    await assertCurrent(manifestPath, manifestText, `${unitCode} compiled visual manifest`);
    await assertCurrent(runtimePath, runtimeText, `${unitCode} runtime visual manifest`);
    for (const { asset } of rendered) await assertCurrent(resolve(assetDirectory, asset.assetFileName), asset.svg, `${unitCode} SVG ${asset.assetFileName}`);
  } else {
    await mkdir(assetDirectory, { recursive: true });
    for (const { asset } of rendered) {
      const path = resolve(assetDirectory, asset.assetFileName);
      const temporary = `${path}.tmp-${process.pid}`;
      await writeFile(temporary, asset.svg, "utf8");
      await rename(temporary, path);
    }
    await writeFile(manifestPath, manifestText, "utf8");
    await writeFile(runtimePath, runtimeText, "utf8");
  }
  console.log(`${checkOnly ? "Verified" : "Compiled"} ${scenes.length} Algebra ${unitCode} BVLP scenes (${runtime.interactiveCount} interactive).`);
}
