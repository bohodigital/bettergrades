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

test("all Unit 3A pages render as clean integral-textbook pages", async () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === "calc-1-unit-3a-integral-foundations-techniques");
  assert.equal(unitRoutes.length, 36);
  for (const route of unitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    const text = visibleText(html);
    assert.match(html, /data-unit-id="calc-1-unit-3a-integral-foundations-techniques"/, route.path);
    assert.match(text, /Calculus I.*Unit 3A/, route.path);
    assert.match(html, /aria-label="Calculus Unit 3 course navigation"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/integrals\/"[^>]+aria-current="location"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/"/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    if (route.pageType !== "hub" && !/Unit 3A/.test(route.title)) assert.match(html, /<title>[^<]+\| Unit 3A \| Better Grades<\/title>/, route.path);
    assert.doesNotMatch(text, /\\(?:begin|end|frac|varepsilon|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(text, /\b\d+\s+(?:topics|pages|study hours|interactive checks|BVLP visuals)\b/i, route.path);
    assert.doesNotMatch(html, /This equation could not be rendered safely|This visual is temporarily unavailable|class="katex-error"/, route.path);
    const renderedCheckIds = [...html.matchAll(/data-check-id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(renderedCheckIds.length, new Set(renderedCheckIds).size, `${route.path} renders each interactive check once`);
    if (route.pageType !== "hub") {
      assert.match(html, /Section overview/, route.path);
      assert.match(html, /Reading lens/, route.path);
    }
    if (route.path.endsWith("/cumulative-practice/")) assert.equal((html.match(/Show supplied answer/g) ?? []).length, 12);
  }
});

test("the Unit 3A map leads with the textbook and preserves focused integral articles below", async () => {
  const response = await render("/subjects/math/calculus/integrals/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /The complete Unit 3A path/);
  assert.match(text, /Begin with antiderivatives and accumulated change/);
  assert.match(text, /Focused integral explorations/);
  assert.match(html, /href="\/subjects\/math\/calculus\/integration-techniques\/"/);
  assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/"/);
});

test("all Unit 3B pages render as clean application-textbook pages", async () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === "calc-1-unit-3b-integration-applications");
  assert.equal(unitRoutes.length, 25);
  const answerCounts = new Map([
    ["/subjects/math/calculus/integration-applications/physics-application-studio/", 6],
    ["/subjects/math/calculus/integration-applications/review/", 10],
    ["/subjects/math/calculus/integration-applications/cumulative-practice/", 11],
  ]);
  for (const route of unitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    const text = visibleText(html);
    assert.match(html, /data-unit-id="calc-1-unit-3b-integration-applications"/, route.path);
    assert.match(text, /Calculus I.*Unit 3B/, route.path);
    assert.match(html, /aria-label="Calculus Unit 3 course navigation"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/"[^>]+aria-current="location"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/integrals\/"/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    if (route.pageType !== "hub" && !/Unit 3B/.test(route.title)) assert.match(html, /<title>[^<]+\| Unit 3B \| Better Grades<\/title>/, route.path);
    assert.doesNotMatch(text, /\\(?:begin|end|frac|varepsilon|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(text, /\b\d+\s+(?:topics|pages|study hours|interactive checks|BVLP visuals)\b/i, route.path);
    assert.doesNotMatch(html, /This equation could not be rendered safely|This visual is temporarily unavailable|class="katex-error"/, route.path);
    const renderedCheckIds = [...html.matchAll(/data-check-id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(renderedCheckIds.length, new Set(renderedCheckIds).size, `${route.path} renders each interactive check once`);
    if (route.pageType !== "hub") {
      assert.match(html, /Section overview/, route.path);
      assert.match(html, /Reading lens/, route.path);
    }
    if (answerCounts.has(route.path)) assert.equal((html.match(/Show supplied answer/g) ?? []).length, answerCounts.get(route.path), route.path);
    if (route.pageType === "exam") assert.match(html, /View the complete answer key/, route.path);
  }
});

test("the Unit 3B map leads with its textbook, published keys, application studios, and Unit 3A return path", async () => {
  const response = await render("/subjects/math/calculus/integration-applications/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /The complete Unit 3B path/);
  assert.match(text, /Begin with one-dimensional area/);
  assert.match(text, /Published exam answer keys/);
  assert.match(text, /Focused integral explorations/);
  assert.match(text, /Return easily to Unit 3A foundations/);
  assert.match(html, /href="\/subjects\/math\/calculus\/integrals\/"/);
  assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/practice-exam-a-answer-key\/"/);
  assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/physics-application-studio\/"/);
});

test("all Unit 4A pages render as clean Calculus II sequence-and-series pages", async () => {
  const unitRoutes = calculusUnitRoutes.filter((route) => route.unitId === "calc-2-unit-4a-sequences-infinite-series");
  assert.equal(unitRoutes.length, 34);
  for (const route of unitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    const text = visibleText(html);
    assert.match(html, /data-unit-id="calc-2-unit-4a-sequences-infinite-series"/, route.path);
    assert.match(text, /Calculus II.*Unit 4A/, route.path);
    assert.match(html, /aria-label="Calculus Unit 4 course navigation"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/sequences-and-series\/"[^>]+aria-current="location"/, route.path);
    assert.match(html, /href="\/subjects\/math\/calculus\/integration-applications\/"/, route.path);
    const renderedTitle = route.title.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");
    assert.match(html, new RegExp(`<h1>${escapeRegExp(renderedTitle)}</h1>`), route.path);
    if (route.pageType !== "hub" && !/Unit 4A/.test(route.title)) assert.match(html, /<title>[^<]+\| Unit 4A \| Better Grades<\/title>/, route.path);
    assert.doesNotMatch(text, /\\(?:begin|end|frac|varepsilon|textbf|emph|section|chapter|addplot|draw|node)\b|\$\$|\\[()[\]]/, route.path);
    assert.doesNotMatch(html, /This equation could not be rendered safely|This visual is temporarily unavailable|class="katex-error"/, route.path);
    const renderedCheckIds = [...html.matchAll(/data-check-id="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(renderedCheckIds.length, new Set(renderedCheckIds).size, `${route.path} renders each interactive check once`);
    if (route.pageType !== "hub") {
      assert.match(html, /Section overview/, route.path);
      assert.match(html, /Reading lens/, route.path);
    }
    if (route.pageType === "exam") assert.match(html, /View the complete answer key/, route.path);
  }
});

test("the Unit 4A map leads with the canonical textbook and keeps Unit 4B unpublished", async () => {
  const response = await render("/subjects/math/calculus/sequences-and-series/");
  assert.equal(response.status, 200);
  const html = await response.text();
  const text = visibleText(html);
  assert.match(text, /The complete Unit 4A path/);
  assert.match(text, /Turn infinite processes into precise convergence decisions/);
  assert.match(text, /Focused convergence explorations/);
  assert.match(text, /Published exam answer keys/);
  assert.match(text, /Return easily to Unit 3B/);
  assert.doesNotMatch(html, /power-series-and-taylor-series/);
});

test("calculus lessons include a complete server-only fallback when JavaScript is unavailable", async () => {
  for (const [path, titlePattern] of [
    ["/subjects/math/calculus/limits-continuity/introduction-to-limits/", /Introduction to limits/i],
    ["/subjects/math/calculus/sequences-and-series/geometric-series/", /Geometric series/i],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
    assert.match(fallback, /data-noscript-calculus-fallback=/, path);
    assert.match(fallback, titlePattern, path);
    assert.match(fallback, /JavaScript is off/, path);
    assert.match(fallback, /class="no-script-lesson"/, path);
    assert.doesNotMatch(fallback, /canonicalAnswer|acceptedAnswers|sourceFile|type="range"|is-interactive-ready/, path);
  }
  const visualResponse = await render("/subjects/math/calculus/sequences-and-series/sequences-as-functions/");
  const visualHtml = await visualResponse.text();
  const visualFallback = visualHtml.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? "";
  assert.match(visualFallback, /data-noscript-visual=/);
  assert.match(visualFallback, /\/visuals\/v1\/[^"']+\.svg/);
});

test("superseded Chapter 4 duplicate intents redirect to Unit 4A canonical routes", async () => {
  const redirects = new Map([
    ["/subjects/math/calculus/sequences-series/", "/subjects/math/calculus/sequences-and-series/"],
    ["/subjects/math/calculus/sequences-series/geometric-series/", "/subjects/math/calculus/sequences-and-series/geometric-series/"],
    ["/subjects/math/calculus/sequences-series/choosing-convergence-test/", "/subjects/math/calculus/sequences-and-series/choosing-a-convergence-test/"],
  ]);
  for (const [from, to] of redirects) {
    const response = await render(from);
    assert.equal(response.status, 308, from);
    assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, to, from);
  }
  for (const path of [
    "/subjects/math/calculus/sequences-series/harmonic-series-diverges/",
    "/subjects/math/calculus/sequences-series/ratio-test-vs-root-test/",
    "/subjects/math/calculus/sequences-series/power-series-interval-of-convergence/",
    "/subjects/math/calculus/sequences-series/taylor-series-remainder/",
  ]) assert.equal((await render(path)).status, 200, path);
});
