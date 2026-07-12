import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
});
