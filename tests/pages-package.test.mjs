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
});
