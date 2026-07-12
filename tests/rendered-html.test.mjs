import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Better Grades homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Find the answer/);
  assert.match(html, /Understand the method/);
  assert.match(html, /No account required/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|taking shape/i);
});

test("server-renders the canonical sec-cubed answer", async () => {
  const response = await render("/answers/calculus/integral-of-sec-cubed/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /What is the integral of sec³x/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /application\/x-tex/);
  assert.match(html, /\\frac12\\sec x\\tan x/);
  assert.match(html, /Integration by parts/);
  assert.match(html, /Verified/);
});

test("unknown routes use the custom 404", async () => {
  const response = await render("/definitely-not-a-page/");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Wrong turn\. Useful recovery/);
});

test("topic hub exposes the organized calculus library", async () => {
  const response = await render("/topics/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Choose the topic/);
  assert.match(html, /Limits &amp; Continuity/);
  assert.match(html, /Sequences &amp; Series/);
  assert.match(html, /30/);
});

test("library archetype renders a full worked article", async () => {
  const response = await render("/library/limits-continuity/limit-of-sin-x-over-x/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Why is the limit of sin x over x equal to 1/);
  assert.match(html, /Worked example/);
  assert.match(html, /Common mistakes/);
  assert.match(html, /class="katex-display"/);
});
