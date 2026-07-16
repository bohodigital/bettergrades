import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

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

  const worker = await readFile(
    new URL("../dist/pages/_worker.js", import.meta.url),
    "utf8",
  );
  assert.match(worker, /ASSETS/);

  const assetsIgnore = await readFile(
    new URL("../dist/pages/.assetsignore", import.meta.url),
    "utf8",
  );
  assert.match(assetsIgnore, /^index\.js$/m);
  assert.match(assetsIgnore, /^ssr\/\*\*$/m);

  const clientAssets = await readdir(new URL("../dist/pages/assets/", import.meta.url));
  const clientJavaScript = await Promise.all(clientAssets.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../dist/pages/assets/${name}`, import.meta.url), "utf8")));
  assert.ok(clientJavaScript.every((source) => !source.includes("A derivative is the limit of average rates over shrinking intervals")), "full glossary definitions must remain server-fed on glossary routes");
  assert.ok(clientJavaScript.every((source) => !source.includes("canonicalAnswer") && !source.includes("workedFeedbackLatex")), "assessment answers and worked feedback must remain server-only");
  const appAssetName = clientAssets.find((name) => /^BetterGradesApp-.*\.js$/.test(name));
  assert.ok(appAssetName, "BetterGradesApp client asset is present");
  const appAsset = await readFile(new URL(`../dist/pages/assets/${appAssetName}`, import.meta.url), "utf8");
  assert.ok(Buffer.byteLength(appAsset) <= 500_000, `BetterGradesApp client asset exceeds 500 KB: ${Buffer.byteLength(appAsset)}`);
});

test("limits tables and graph explanations remain bounded on narrow screens", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.limits-graph figcaption \{[^}]*min-width: 0/);
  assert.match(css, /\.limits-graph-exposition \{[^}]*margin-top: 12px;[^}]*border-top:/);
  assert.doesNotMatch(css, /\.limits-graph-spec\b/);
  assert.match(css, /\.limits-table-wrap \{[^}]*max-width: 100%;[^}]*overflow-x: auto/);
});
