import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { build } from "esbuild";

import course from "../content/algebra/course.public.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");
const pages = resolve(root, "dist/pages");
const sitemapClasses = {
  "course-hub": "sitemap-course-hubs.xml",
  "unit-hub": "sitemap-unit-hubs.xml",
  lesson: "sitemap-lessons.xml",
  review: "sitemap-reviews-practice.xml",
  practice: "sitemap-reviews-practice.xml",
  diagnostic: "sitemap-reviews-practice.xml",
  exam: "sitemap-reviews-practice.xml",
  "mastery-check": "sitemap-mastery-checks.xml",
  investigation: "sitemap-investigations.xml",
  "answer-key": "sitemap-answer-keys.xml",
};

test("the course hub carries the complete expandable lesson index", () => {
  const courseHub = course.pages.find((page) => page.route.pageType === "course-hub");
  assert.ok(courseHub);
  assert.equal(courseHub.units.length, 15);
  assert.equal(courseHub.units.reduce((sum, unit) => sum + unit.lessons.length, 0), 139);
  for (const unit of courseHub.units) {
    assert.equal(unit.lessons.length, unit.lessonCount, unit.code);
    assert.equal(new Set(unit.lessons.map((lesson) => lesson.path)).size, unit.lessonCount, unit.code);
  }
});

test("all 226 Algebra routes are in exactly one role-based sitemap with a real revision date", async () => {
  const files = [...new Set(Object.values(sitemapClasses))];
  const sitemaps = new Map(await Promise.all(files.map(async (file) => [file, await readFile(resolve(pages, file), "utf8")])));
  for (const route of course.routes.filter((candidate) => candidate.indexable)) {
    const canonical = `https://bettergrades.net${route.path}`;
    const matches = files.filter((file) => sitemaps.get(file).includes(`<loc>${canonical}</loc>`));
    assert.deepEqual(matches, [sitemapClasses[route.pageType]], `${route.path} (${route.pageType})`);
  }
  for (const source of sitemaps.values()) {
    assert.doesNotMatch(source, /2026-07-23/);
    assert.match(source, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  }
});

test("rendered Algebra pages expose finished instruction, unique metadata, and the course social image", async () => {
  const titles = new Set();
  const descriptions = new Set();
  const forbidden = /Foundation example: a clean numerical case|Let the anchor figure establish|Connect the representation to the lesson outcome|A strong response demonstrates|\bPLACEHOLDER\b/;
  for (const route of course.routes) {
    const html = await readFile(resolve(pages, route.path.slice(1), "index.html"), "utf8");
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    assert.doesNotMatch(visibleHtml, forbidden, route.path);
    assert.doesNotMatch(visibleHtml.replace(/\bundefined slope\b/gi, ""), /\bundefined\b/i, route.path);
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, route.path);
    assert.match(html, /<main(?:\s|>)/, route.path);
    assert.match(html, /rel="canonical"/, route.path);
    assert.match(html, /og-algebra\.png/, route.path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="(.*?)"/)?.[1];
    assert.ok(title && !titles.has(title), `${route.path} duplicate title`);
    assert.ok(description && !descriptions.has(description), `${route.path} duplicate description`);
    titles.add(title);
    descriptions.add(description);
  }
  assert.equal(titles.size, 226);
  assert.equal(descriptions.size, 226);
});

test("representative A0–A2 lessons render textbook mathematics through KaTeX and MathML", async () => {
  const paths = [
    "/subjects/math/algebra/arithmetic-readiness/fractions-as-numbers/",
    "/subjects/math/algebra/quantities-variables/variables-and-changing-quantities/",
    "/subjects/math/algebra/linear-equations/multistep-linear-equations/",
  ];
  for (const path of paths) {
    const html = await readFile(resolve(pages, path.slice(1), "index.html"), "utf8");
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const latexCount = (visibleHtml.match(/class="latex latex-inline/g) ?? []).length;
    assert.ok(latexCount >= 50, `${path} rendered only ${latexCount} LaTeX expressions`);
    assert.match(visibleHtml, /class="katex-mathml"/, path);
    assert.match(visibleHtml, /encoding="application\/x-tex"/, path);
    assert.doesNotMatch(visibleHtml, /class="katex-error"/, path);
  }
});

test("worked Algebra examples separate display equations from inline prose mathematics", async () => {
  const cases = [
    ["/subjects/math/algebra/arithmetic-readiness/fractions-as-numbers/", 6],
    ["/subjects/math/algebra/linear-equations/multistep-linear-equations/", 9],
    ["/subjects/math/algebra/linear-equations/equations-with-fractions-and-decimals/", 10],
  ];
  for (const [path, minimumDisplays] of cases) {
    const html = await readFile(resolve(pages, path.slice(1), "index.html"), "utf8");
    const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    const examples = visibleHtml.match(/class="limits-node limits-node-example algebra-lesson-examples"[\s\S]*?class="limits-node limits-node-exercise/)?.[0] ?? "";
    const exposition = visibleHtml.match(/class="limits-node limits-node-exposition algebra-lesson-exposition"[\s\S]*?class="limits-node limits-node-method/)?.[0] ?? "";
    assert.ok((examples.match(/class="latex latex-display/g) ?? []).length >= minimumDisplays, `${path} kept worked equations inline`);
    assert.equal((examples.match(/class="algebra-example-answer/g) ?? []).length, 3, `${path} lost textbook answer lines`);
    assert.doesNotMatch(examples, /class="katex-error"/, path);
    assert.doesNotMatch(exposition, /class="latex latex-display"/, `${path} promoted ordinary prose math`);
  }
});

test("all 139 exact lesson titles rank first in the generated search index", async () => {
  const output = resolve(tmpdir(), `bettergrades-algebra-remediation-search-${process.pid}.mjs`);
  try {
    await build({ entryPoints: [resolve(root, "lib/site-search.ts")], outfile: output, bundle: true, platform: "node", format: "esm", logLevel: "silent" });
    const { searchSite } = await import(`${pathToFileURL(output).href}?v=${Date.now()}`);
    for (const page of course.pages.filter((candidate) => candidate.lesson)) {
      assert.equal(searchSite(page.lesson.title)[0]?.path, page.route.path, page.lesson.id);
    }
  } finally {
    await rm(output, { force: true });
  }
});
