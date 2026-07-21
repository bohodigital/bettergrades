import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import { gzipSync } from "node:zlib";

const expectedLimitsVisuals = [
  ["secant-tangent", "/subjects/math/calculus/limits-continuity/unit/limits/why-limits-matter/"],
  ["removable-hole", "/subjects/math/calculus/limits-continuity/unit/limits/limit-at-a-hole/"],
  ["limit-versus-value", "/subjects/math/calculus/limits-continuity/unit/limits/function-value-vs-limit/"],
  ["jump-discontinuity", "/subjects/math/calculus/limits-continuity/unit/limits/one-sided-limits/"],
  ["rapid-oscillation", "/subjects/math/calculus/limits-continuity/unit/limits/when-a-limit-does-not-exist/"],
  ["squeeze-bounds", "/subjects/math/calculus/limits-continuity/unit/limits/squeeze-theorem/"],
  ["unit-circle-squeeze", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["sine-over-x", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["vertical-asymptotes", "/subjects/math/calculus/limits-continuity/unit/limits/infinite-limits/"],
  ["horizontal-asymptote", "/subjects/math/calculus/limits-continuity/unit/limits/limits-at-infinity/"],
  ["discontinuity-gallery", "/subjects/math/calculus/limits-continuity/unit/continuity/types-of-discontinuity/"],
  ["ivt-root", "/subjects/math/calculus/limits-continuity/unit/continuity/intermediate-value-theorem/"],
  ["epsilon-delta-window", "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/"],
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("Pages package contains the advanced Worker and static assets", async () => {
  await assert.rejects(
    access(new URL("../.wrangler/deploy/config.json", import.meta.url)),
    /ENOENT/,
  );
  await access(new URL("../dist/pages/_worker.js", import.meta.url));
  await access(new URL("../dist/pages/index.js", import.meta.url));
  await access(new URL("../dist/pages/assets", import.meta.url));

  const routes = JSON.parse(
    await readFile(new URL("../dist/pages/_routes.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(routes.include, ["/*"]);
  assert.ok(routes.exclude.includes("/assets/*"));
  assert.ok(routes.exclude.includes("/visuals/*"), "immutable generated visuals must use the Pages static asset lane");

  const worker = await readFile(
    new URL("../dist/pages/_worker.js", import.meta.url),
    "utf8",
  );
  assert.match(worker, /ASSETS/);
  assert.doesNotMatch(
    worker,
    /(?:from\s*|import\s*\()\s*["']\.\.?\//,
    "the no-bundle Pages Worker must be one self-contained module",
  );
  assert.ok(
    gzipSync(worker, { level: 9 }).byteLength <= 2_750_000,
    `Cloudflare Worker entry exceeds its 2.75 MB gzip release budget: ${gzipSync(worker, { level: 9 }).byteLength}`,
  );

  const wranglerConfig = JSON.parse(await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
  assert.equal(wranglerConfig.no_bundle, true, "Wrangler must publish the verified standalone Worker without rebundling it");

  const assetsIgnore = await readFile(
    new URL("../dist/pages/.assetsignore", import.meta.url),
    "utf8",
  );
  assert.match(assetsIgnore, /^index\.js$/m);
  assert.match(assetsIgnore, /^ssr\/\*\*$/m);

  const clientAssets = await readdir(new URL("../dist/pages/assets/", import.meta.url));
  const clientJavaScript = await Promise.all(clientAssets
    .filter((name) => name.endsWith(".js"))
    .map((name) => readFile(new URL(`../dist/pages/assets/${name}`, import.meta.url), "utf8")));
  assert.ok(
    clientJavaScript.every((source) => !source.includes("A derivative is the limit of average rates over shrinking intervals")),
    "full glossary definitions must remain server-fed on glossary routes",
  );
  for (const source of clientJavaScript) {
    assert.doesNotMatch(
      source,
      /canonicalAnswer|workedFeedbackLatex|@cortex-js\/compute-engine|\bComputeEngine\b/,
      "assessment answers, worked feedback, and the server-only Cortex parser must not enter client JavaScript",
    );
    assert.doesNotMatch(
      source,
      /sourceFile:["'`]calculus__[^"'`]*\.tex["'`]/,
      "route-source filenames must not enter client JavaScript",
    );
  }
  const appAssetName = clientAssets.find((name) => /^BetterGradesApp-.*\.js$/.test(name));
  assert.ok(appAssetName, "BetterGradesApp client asset is present");
  const appAsset = await readFile(new URL(`../dist/pages/assets/${appAssetName}`, import.meta.url), "utf8");
  assert.ok(Buffer.byteLength(appAsset) <= 500_000, `BetterGradesApp client asset exceeds 500 KB: ${Buffer.byteLength(appAsset)}`);

  for (const file of ["favicon.ico", "favicon.svg", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "site.webmanifest"]) {
    await access(new URL(`../dist/pages/${file}`, import.meta.url));
  }
  const manifest = JSON.parse(await readFile(new URL("../dist/pages/site.webmanifest", import.meta.url), "utf8"));
  assert.equal(manifest.name, "Better Grades");
  assert.ok(manifest.icons.some((icon) => icon.src === "/icon-512.png" && icon.sizes === "512x512"));

  for (const path of ["/favicon.ico", "/favicon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/site.webmanifest"]) {
    assert.ok(routes.exclude.includes(path), `${path} must bypass the Worker and use the Pages static asset lane`);
  }
});

test("Pages package preserves the exact Limits and Units 2A through 4A visual inventories", async () => {
  const limitsManifest = JSON.parse(
    await readFile(new URL("../content/visualizations/limits-continuity/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const unitManifest = JSON.parse(
    await readFile(new URL("../content/calculus/units/unit-2a/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const unit2bManifest = JSON.parse(
    await readFile(new URL("../content/calculus/units/unit-2b/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const unit3aManifest = JSON.parse(
    await readFile(new URL("../content/calculus/units/unit-3a/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const unit3bManifest = JSON.parse(
    await readFile(new URL("../content/calculus/units/unit-3b/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const unit4aManifest = JSON.parse(
    await readFile(new URL("../content/calculus/units/unit-4a/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  const runtimeManifests = await Promise.all(
    ["unit-2a", "unit-2b", "unit-3a", "unit-3b", "unit-4a"].map(async (unit) => JSON.parse(
      await readFile(new URL(`../content/calculus/units/${unit}/public-runtime-scenes.server.json`, import.meta.url), "utf8"),
    )),
  );
  assert.equal(limitsManifest.manifestVersion, 1);
  assert.equal(limitsManifest.sceneCount, 13);
  assert.equal(limitsManifest.scenes.length, 13);
  assert.deepEqual(
    limitsManifest.scenes.map(({ id, route }) => [id, route]),
    expectedLimitsVisuals,
  );
  assert.equal(unitManifest.manifestVersion, 1);
  assert.equal(unitManifest.sceneCount, 27);
  assert.equal(unitManifest.scenes.length, 27);
  assert.equal(unit2bManifest.manifestVersion, 1);
  assert.equal(unit2bManifest.sceneCount, 34);
  assert.equal(unit2bManifest.scenes.length, 34);
  assert.equal(unit3aManifest.manifestVersion, 1);
  assert.equal(unit3aManifest.sceneCount, 11);
  assert.equal(unit3aManifest.scenes.length, 11);
  assert.equal(unit3bManifest.manifestVersion, 1);
  assert.equal(unit3bManifest.sceneCount, 9);
  assert.equal(unit3bManifest.scenes.length, 9);
  assert.equal(unit4aManifest.manifestVersion, 1);
  assert.equal(unit4aManifest.sceneCount, 18);
  assert.equal(unit4aManifest.scenes.length, 18);
  const calculusManifests = [unitManifest, unit2bManifest, unit3aManifest, unit3bManifest, unit4aManifest];
  for (let index = 0; index < runtimeManifests.length; index += 1) {
    const sourceManifest = calculusManifests[index];
    const runtimeManifest = runtimeManifests[index];
    assert.equal(runtimeManifest.manifestVersion, 1);
    assert.equal(runtimeManifest.sceneCount, sourceManifest.sceneCount);
    assert.equal(runtimeManifest.scenes.length, sourceManifest.sceneCount);
    assert.equal(runtimeManifest.interactiveCount, sourceManifest.scenes.filter(({ hydration }) => hydration !== "none").length);
    assert.deepEqual(runtimeManifest.scenes.map(({ id }) => id), sourceManifest.scenes.map(({ id }) => id));
    for (const runtimeScene of runtimeManifest.scenes) {
      const sourceScene = sourceManifest.scenes.find(({ id }) => id === runtimeScene.id);
      assert.deepEqual(runtimeScene.staticAsset, sourceScene.staticAsset);
      assert.equal(runtimeScene.sourceFingerprint, sourceScene.compiledScene.provenance.sourceFingerprint);
      assert.equal(runtimeScene.visibility, "public");
      assert.equal(Object.hasOwn(runtimeScene, "interactiveScene"), runtimeScene.hydration !== "none");
    }
  }
  const manifests = [limitsManifest, unitManifest, unit2bManifest, unit3aManifest, unit3bManifest, unit4aManifest];
  const expectedAssetNames = manifests.flatMap(({ scenes }) => scenes.map(({ staticAsset }) => staticAsset.path.split("/").at(-1))).sort();
  const publicAssetNames = (await readdir(new URL("../public/visuals/v1/", import.meta.url)))
    .filter((name) => name.endsWith(".svg"))
    .sort();
  const packagedAssetNames = (await readdir(new URL("../dist/pages/visuals/v1/", import.meta.url)))
    .filter((name) => name.endsWith(".svg"))
    .sort();
  assert.deepEqual(publicAssetNames, expectedAssetNames, "public visual directory must contain the exact manifest inventory");
  assert.deepEqual(packagedAssetNames, expectedAssetNames, "Pages visual directory must contain the exact manifest inventory");

  for (const scene of manifests.flatMap(({ scenes }) => scenes)) {
    const { id, staticAsset } = scene;
    assert.equal(
      staticAsset.path,
      `/visuals/v1/${id}.${staticAsset.sha256.slice(0, 16)}.svg`,
      `${id} must use its content-addressed public path`,
    );
    const relativePath = staticAsset.path.slice(1);
    const sourceAsset = await readFile(new URL(`../public/${relativePath}`, import.meta.url));
    const packagedAsset = await readFile(new URL(`../dist/pages/${relativePath}`, import.meta.url));
    assert.equal(packagedAsset.byteLength, staticAsset.bytes, `${id} packaged byte count`);
    assert.equal(sha256(packagedAsset), staticAsset.sha256, `${id} packaged SHA-256`);
    assert.deepEqual(packagedAsset, sourceAsset, `${id} source and Pages assets must be byte-identical`);
    const svg = packagedAsset.toString("utf8");
    assert.match(svg, /^<svg\b/);
    assert.doesNotMatch(svg, /expressionLatex|\\(?:frac|sin|varepsilon|epsilon|delta|sqrt)\b|<script\b|<foreignObject\b/i, id);
  }
});

test("the JSXGraph construction stays explicit-action lazy and below its 180 KB gzip budget", async () => {
  const directory = new URL("../dist/pages/assets/", import.meta.url);
  const scripts = (await readdir(directory)).filter((name) => name.endsWith(".js"));
  const chunks = await Promise.all(scripts.map(async (name) => ({ name, body: await readFile(new URL(name, directory)) })));
  const vendor = chunks.filter(({ body }) => body.includes(Buffer.from("JessieCode")));
  assert.equal(vendor.length, 1, "exactly one lazy JSXGraph construction chunk should be emitted");
  assert.match(vendor[0].name, /minimal-vendor/);
  assert.ok(gzipSync(vendor[0].body, { level: 9 }).byteLength <= 180_000, `${vendor[0].name} exceeds the registry lazy-gzip budget`);
  assert.ok(chunks.filter(({ name }) => /BetterGradesApp|BetterGradesVisual|framework/.test(name)).every(({ body }) => !body.includes(Buffer.from("JessieCode"))), "ordinary application chunks must not absorb JSXGraph");

  const worker = await readFile(new URL("../dist/pages/_worker.js", import.meta.url));
  const ssrDirectory = new URL("../dist/pages/ssr/assets/", import.meta.url);
  const ssrScripts = (await readdir(ssrDirectory)).filter((name) => name.endsWith(".js"));
  const ssrChunks = await Promise.all(ssrScripts.map(async (name) => readFile(new URL(name, ssrDirectory))));
  assert.ok(!worker.includes(Buffer.from("JessieCode")), "the Cloudflare Worker must not absorb the browser-only JSXGraph vendor");
  assert.ok(ssrChunks.every((body) => !body.includes(Buffer.from("JessieCode"))), "SSR chunks must not absorb the browser-only JSXGraph vendor");
});

test("limits tables and generated visual fallbacks remain bounded on narrow screens and in print", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.limits-graph figcaption \{[^}]*min-width: 0/);
  assert.match(css, /\.bvlp-visual \{[^}]*min-width: 0/);
  assert.match(css, /\.bvlp-static-visual img \{[^}]*width: 100%;[^}]*height: auto;[^}]*max-width: 100%/);
  assert.match(css, /\.bvlp-interactive__toolbar button, \.bvlp-interactive__control button \{[^}]*background: var\(--paper\);[^}]*color: var\(--ink\)/);
  assert.match(css, /\.bvlp-long-description summary \{[^}]*min-height: 44px/);
  assert.match(css, /\.limits-graph-exposition \{[^}]*margin-top: 12px;[^}]*border-top:/);
  assert.match(css, /@media print \{[\s\S]*\.site-footer \{[^}]*display: none !important/, "print output must not create navigation-only footer pages");
  assert.match(css, /@media print \{[\s\S]*\.site-header \{[^}]*position: static !important/, "print output must not repeat the sticky site header across pages");
  assert.match(css, /@media print \{[\s\S]*\.bvlp-visual\.is-interactive-ready \.bvlp-static-visual \{[^}]*display: block !important/);
  assert.match(css, /@media print \{[\s\S]*\.bvlp-interactive-slot \{[^}]*display: none !important/);
  assert.doesNotMatch(css, /\.limits-graph-(?:canvas|spec)\b/);
  assert.match(css, /\.limits-table-wrap \{[^}]*max-width: 100%;[^}]*overflow-x: auto/);
});

test("the visual component retains an accessible generated fallback and the legacy canvas is gone", async () => {
  await assert.rejects(
    access(new URL("../app/LimitsGraphCanvas.tsx", import.meta.url)),
    /ENOENT/,
  );
  const component = await readFile(new URL("../app/BetterGradesVisual.tsx", import.meta.url), "utf8");
  const limitsPages = await readFile(new URL("../app/LimitsUnitPages.tsx", import.meta.url), "utf8");
  assert.match(component, /data-bvlp-visual=\{visual\.id\}/);
  assert.match(component, /data-static-fallback="retained"/);
  assert.match(component, /<img\b/);
  assert.match(component, /aria-describedby=\{descriptionId\}/);
  assert.match(component, /<details className="bvlp-long-description" id=\{descriptionId\}>/);
  assert.match(component, /<summary>Read this graph as text<\/summary>/);
  assert.match(component, /visual\.longDescription/);
  assert.match(component, /visual\.accessibility\.colorIndependentDescription/);
  assert.doesNotMatch(component, /<canvas\b|dangerouslySetInnerHTML|LimitsGraphCanvas|limits-graph-canvas/);
  assert.doesNotMatch(limitsPages, /<canvas\b|LimitsGraphCanvas|limits-graph-canvas|data-graph-id/);
});
