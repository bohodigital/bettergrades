import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { readableMath } from "../lib/math-readable.mjs";

const representativeRoutes = [
  "/subjects/math/calculus/limits-continuity/unit/limits/what-a-limit-means/",
  "/subjects/math/calculus/derivatives/product-rule/",
  "/subjects/math/calculus/derivative-applications/optimization/",
  "/subjects/math/calculus/integrals/integration-by-parts/",
  "/subjects/math/calculus/integration-applications/disks-and-washers/",
  "/subjects/math/calculus/sequences-and-series/geometric-series/",
  "/subjects/math/calculus/power-series-and-taylor-series/taylor-remainder-theorem/",
];

test("static lesson output has one crawl-visible document landmark and no duplicate fallback", async () => {
  for (const route of representativeRoutes) {
    const html = await readFile(new URL(`../dist/pages${route}index.html`, import.meta.url), "utf8");
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: H1`);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route}: main`);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route}: canonical`);
    assert.doesNotMatch(html, /<noscript>|data-noscript-calculus-fallback=|class="no-script-lesson"/, route);
    const visibleText = html
      .replace(/<(?:script|style|annotation)\b[^>]*>[\s\S]*?<\/(?:script|style|annotation)>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    assert.doesNotMatch(visibleText, /canonicalAnswer|acceptedAnswers|sourceFile/, route);
  }
});

test("AST-backed math serialization preserves mathematical structure", () => {
  const fixtures = new Map([
    ["\\frac{1}{3}", "1 over 3"],
    ["\\frac{1}{\\frac{2}{3}}", "1 over (2 over 3)"],
    ["x^2+x_1", "x squared plus x subscript"],
    ["\\sum_{n=1}^{\\infty} ar^{n-1}", "sum from n equals 1 to infinity"],
    ["\\lim_{x\\to 0}\\frac{\\sin x}{x}", "limit as x approaches 0"],
    ["\\int_0^1 x^2\\,dx", "integral from 0 to 1"],
    ["\\begin{cases}x^2&x<0\\\\x&x\\ge 0\\end{cases}", "piecewise function"],
    ["\\begin{bmatrix}1&2\\\\3&4\\end{bmatrix}", "matrix"],
    ["\\text{distance}=|x-2|", "distance equals the absolute value"],
    ["a_1+a_2+\\cdots+a_n", "and so on"],
  ]);
  for (const [latex, expected] of fixtures) {
    const spoken = readableMath(latex);
    assert.match(spoken, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `${latex}: ${spoken}`);
    assert.doesNotMatch(spoken, /\b(?:frac13|frac56|frac311|cdots|ldots)\b/i, latex);
  }
});
