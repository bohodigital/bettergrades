import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const headers = await readFile(new URL("../public/_headers", import.meta.url), "utf8");
const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");

test("ships an accessible private-preview landing page", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<h1 id="page-title">/);
  assert.match(html, /Skip to content/);
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /https:\/\/bettergrades\.net\//);
});

test("does not collect data or load active third-party code", () => {
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /<input\b/i);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(
    html,
    /googletagmanager|google-analytics|segment\.com|plausible\.io/i,
  );
});

test("applies crawler and browser security guardrails", () => {
  assert.match(headers, /Content-Security-Policy:/);
  assert.match(headers, /form-action 'none'/);
  assert.match(headers, /X-Robots-Tag: noindex, nofollow/);
  assert.match(robots, /Disallow: \//);
});

test("contains no common UTF-8 mojibake", () => {
  assert.doesNotMatch(html, /â€”|â€™|Ã|Â/);
});
