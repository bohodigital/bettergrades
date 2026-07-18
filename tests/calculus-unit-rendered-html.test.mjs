import assert from "node:assert/strict";
import test from "node:test";

import { calculusUnitRoutes } from "../lib/calculus/calculus-units-index.mjs";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<annotation\b[\s\S]*?<\/annotation>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("all 67 Unit 2A pages render as clean textbook pages with no source notation", async () => {
  assert.equal(calculusUnitRoutes.length, 67);
  for (const route of calculusUnitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    assert.match(html, /data-unit-id="calc-1-unit-2a-derivative-foundations-techniques"/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    assert.doesNotMatch(visibleText(html), /\\(?:begin|end|frac|varepsilon|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(html, /This equation could not be rendered safely|This visual is temporarily unavailable|class="katex-error"/, route.path);
    assert.doesNotMatch(visibleText(html), /visual accompanies the complete printable source|Graph reading guide/, route.path);
    const renderedCheckIds = [...html.matchAll(/data-check-id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(renderedCheckIds.length, new Set(renderedCheckIds).size, `${route.path} renders each interactive check once`);
    if (route.pageType !== "hub") {
      assert.match(html, /Section overview/, route.path);
      assert.match(html, /Reading lens/, route.path);
    }
    if (route.path.endsWith("/unit-2a-cumulative-practice/")) {
      assert.equal((html.match(/Show supplied answer/g) ?? []).length, 36);
      assert.match(html, /Work in three passes/);
    }
  }
});
