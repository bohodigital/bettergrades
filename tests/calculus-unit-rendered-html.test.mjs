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
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === "calc-1-unit-2a-derivative-foundations-techniques");
  assert.equal(unitRoutes.length, 67);
  for (const route of unitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    assert.match(html, /data-unit-id="calc-1-unit-2a-derivative-foundations-techniques"/, route.path);
    assert.match(visibleText(html), /Calculus I · Unit 2A/, route.path);
    assert.match(html, /aria-label="Calculus Unit 2 course navigation"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivatives\/"[^>]+aria-current="location"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivative-applications\/"/, route.path);
    assert.match(html, /Continue to Unit 2B/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    if (route.pageType !== "hub" && !/Unit 2A/.test(route.title)) assert.match(html, /<title>[^<]+\| Unit 2A \| Better Grades<\/title>/, route.path);
    assert.doesNotMatch(visibleText(html), /\\(?:begin|end|frac|varepsilon|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(visibleText(html), /\b(?:core pages|study hours|interactive checks|BVLP visuals)\b/i, route.path);
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

test("all 76 Unit 2B pages render as clean application-textbook pages", async () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === "calc-1-unit-2b-derivative-applications");
  assert.equal(unitRoutes.length, 76);
  for (const route of unitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    assert.match(html, /data-unit-id="calc-1-unit-2b-derivative-applications"/, route.path);
    assert.match(visibleText(html), /Calculus I · Unit 2B/, route.path);
    assert.match(html, /aria-label="Calculus Unit 2 course navigation"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivative-applications\/"[^>]+aria-current="location"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivatives\/"/, route.path);
    assert.match(html, /Review Unit 2A foundations/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    if (route.pageType !== "hub" && !/Unit 2B/.test(route.title)) assert.match(html, /<title>[^<]+\| Unit 2B \| Better Grades<\/title>/, route.path);
    assert.doesNotMatch(visibleText(html), /\\(?:begin|end|frac|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(visibleText(html), /\b(?:core pages|study hours|interactive checks|BVLP visuals)\b/i, route.path);
    assert.doesNotMatch(html, /This equation could not be rendered safely|This visual is temporarily unavailable|class="katex-error"/, route.path);
    const renderedCheckIds = [...html.matchAll(/data-check-id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(renderedCheckIds.length, new Set(renderedCheckIds).size, `${route.path} renders each interactive check once`);
    if (route.pageType !== "hub") {
      assert.match(html, /Section overview/, route.path);
      assert.match(html, /Reading lens/, route.path);
    }
    const answerRoute = route.path.match(/\/(?:bridge-diagnostic|interpretation-review|approximation-review|related-rates-review|theorems-shape-review|optimization-review|lhopital-review|modeling-studio-review|advanced-newton-convergence|cumulative-practice)\/$/);
    if (answerRoute) assert.ok((html.match(/Show supplied answer/g) ?? []).length > 0, route.path);
    if (route.path.endsWith("/cumulative-practice/")) assert.equal((html.match(/Show supplied answer/g) ?? []).length, 30);
  }
});

test("the Unit 2B map uses application-specific orientation and released navigation", async () => {
  const response = await render("/subjects/math/calculus/derivative-applications/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /The complete Unit 2B path/);
  assert.match(text, /Turn derivatives into explanations, estimates, and decisions/);
  assert.match(text, /Review Unit 2A foundations/);
  assert.doesNotMatch(text, /The complete Unit 2A path|release-gated|Coming after verified 2A release/);
});

test("focused derivative articles remain visibly and semantically connected to Units 2A and 2B", async () => {
  for (const path of [
    "/subjects/math/calculus/derivatives/derivative-of-x-to-the-x/",
    "/subjects/math/calculus/derivatives/chain-rule/",
    "/subjects/math/calculus/derivatives/product-rule-vs-quotient-rule/",
    "/subjects/math/calculus/derivatives/derivatives-of-inverse-trig-functions/",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /aria-label="Calculus Unit 2 course navigation"/, path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivatives\/"[^>]+aria-current="location"/, path);
    assert.match(html, /href="\/subjects\/math\/calculus\/derivative-applications\/"/, path);
    assert.match(visibleText(html), /Calculus I · Unit 2A/, path);
    assert.match(html, /<title>[^<]+\| Unit 2A \| Better Grades<\/title>/, path);
    assert.match(html, /<meta[^>]+name="description"[^>]+Unit 2A/i, path);
  }
});
