import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { gzipSync } from "node:zlib";

import { INTERACTIVE_SOURCE_GZIP_BUDGET_BYTES } from "../lib/visualization/renderers/bg-interactive-2d/controls.ts";

const ROOT = "lib/visualization/renderers/bg-interactive-2d";

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : [path];
  }).filter((path) => /\.(?:ts|tsx)$/.test(path));
}

test("interactive runtime stays below the 30 KB gzip source budget", () => {
  const files = sourceFiles(ROOT).sort();
  const source = files.map((path) => readFileSync(path, "utf8")).join("\n");
  const gzipBytes = gzipSync(source, { level: 9 }).byteLength;
  assert.ok(gzipBytes < INTERACTIVE_SOURCE_GZIP_BUDGET_BYTES, `${gzipBytes} >= ${INTERACTIVE_SOURCE_GZIP_BUDGET_BYTES}`);
});

test("client runtime has no build-only math compiler, executable source, or heavyweight renderer import", () => {
  const source = sourceFiles(ROOT).map((path) => readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(source, /@cortex-js|compute-engine|mathjson|jsxgraph|uplot|d3-(?:scale|shape)|new\s+Function\s*\(|\beval\s*\(/i);
  assert.match(source, /evaluateNumericAst/);
  assert.match(source, /ResizeObserver/);
  assert.match(source, /disconnect\(\)/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /requestAnimationFrame|setInterval/);
});

test("the enhancement exposes a visible failure while preserving parent fallback ownership", () => {
  const source = readFileSync(join(ROOT, "BgInteractive2D.tsx"), "utf8");
  assert.match(source, /role="alert"/);
  assert.match(source, /static visual remains available/i);
  assert.doesNotMatch(source, /removeChild|replaceChildren|innerHTML/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /minHeight:\s*44/);
});

test("the lightweight renderer draws connected and unconnected sampled series", () => {
  const source = readFileSync(join(ROOT, "BgInteractive2D.tsx"), "utf8");
  assert.match(source, /layer\.kind === "sampled-series"/);
  assert.match(source, /geometry\.connect/);
  assert.match(source, /<polyline/);
  assert.match(source, /<circle key=\{`\$\{layer\.id\}-\$\{index\}`\}/);
});

