import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";

import catalog from "../content/calculus/resources/catalog.json" with { type: "json" };
import {
  enrichedGlossaryResources,
  flagshipResources,
  promotedVisualPages,
  publishedResourcePages,
  resourceHubs,
  workedProblemResources,
} from "../lib/resources/catalog.mjs";

const root = resolve(import.meta.dirname, "..");

test("the canonical registry publishes the complete initial resource collection", () => {
  assert.equal(flagshipResources.length, 10);
  assert.equal(promotedVisualPages.length, 3);
  assert.equal(workedProblemResources.length, 26);
  assert.equal(enrichedGlossaryResources.length, 24);
  assert.equal(resourceHubs.length, 5);
  assert.equal(new Set(publishedResourcePages.map((item) => item.id)).size, publishedResourcePages.length);
  assert.equal(new Set(publishedResourcePages.map((item) => item.canonicalPath)).size, publishedResourcePages.length);
  for (const resource of publishedResourcePages) {
    assert.equal(resource.status, "published", resource.id);
    assert.equal(resource.indexPolicy, "index", resource.id);
    assert.ok(resource.relatedLessons.length, `${resource.id}: lesson`);
    assert.ok(resource.relatedResources.length >= 2, `${resource.id}: related resources`);
    assert.ok(resource.relatedGlossaryTerms.length, `${resource.id}: glossary`);
  }
});

test("flagship problem counts and solution coverage match the editorial brief", () => {
  const count = (slug) => flagshipResources.find((resource) => resource.slug === slug).problemCount;
  assert.equal(count("evaluating-limits"), 24);
  assert.equal(count("chain-rule"), 24);
  assert.equal(count("optimization"), 16);
  assert.equal(count("calculus-1-final"), 25);
  assert.equal(count("integration-by-parts"), 20);
  assert.equal(count("geometric-series"), 20);
  assert.equal(count("taylor-series"), 20);
  assert.equal(count("calculus-2-final"), 25);
  for (const resource of flagshipResources) {
    assert.equal(resource.problemCount, resource.problems.length, resource.id);
    for (const problem of resource.problems) {
      assert.ok(problem.prompt.trim(), `${resource.id}/${problem.id}: prompt`);
      assert.ok(problem.answer.trim(), `${resource.id}/${problem.id}: answer`);
      assert.ok(problem.steps.length >= 2, `${resource.id}/${problem.id}: steps`);
      assert.ok(problem.method.trim(), `${resource.id}/${problem.id}: method`);
      assert.ok(problem.commonError.trim(), `${resource.id}/${problem.id}: common error`);
    }
  }
});

test("mathematical verification covers every flagship and selected worked problem", async () => {
  const artifact = JSON.parse(await readFile(resolve(root, "artifacts/seo/mathematical-verification.json"), "utf8"));
  const expected = flagshipResources.reduce((sum, resource) => sum + resource.problemCount, 0) + workedProblemResources.length;
  assert.equal(artifact.entries.length, expected);
  assert.ok(artifact.entries.every((entry) => entry.result === "pass" && entry.review_status === "reviewed"));
  const keys = new Set(artifact.entries.map((entry) => `${entry.resource_id}/${entry.problem_id}`));
  for (const resource of flagshipResources) for (const problem of resource.problems) assert.ok(keys.has(`${resource.id}/${problem.id}`));
});

test("student and answer-key PDFs are distinct, searchable, embedded, and answer-safe", async () => {
  const verification = JSON.parse(await readFile(resolve(root, "artifacts/seo/pdf-verification.json"), "utf8"));
  for (const resource of [...flagshipResources, ...promotedVisualPages]) {
    const studentPath = resolve(root, "public", resource.studentPdf.slice(1));
    const studentInfo = await stat(studentPath);
    assert.ok(studentInfo.size > 5_000 && studentInfo.size < 2_000_000, resource.id);
    const studentTextRun = spawnSync("pdftotext", [studentPath, "-"], { encoding: "utf8" });
    assert.equal(studentTextRun.status, 0, resource.id);
    assert.match(studentTextRun.stdout, new RegExp(resource.shortTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.doesNotMatch(studentTextRun.stdout, /\bAnswer:\b|Worked Answer Key/i, `${resource.id}: student answer leak`);
    assert.doesNotMatch(studentTextRun.stdout, /\/Users\/|\/srv\/|source_file|internal instruction/i, resource.id);
    const fontRun = spawnSync("pdffonts", [studentPath], { encoding: "utf8" });
    assert.equal(fontRun.status, 0, resource.id);
    assert.match(fontRun.stdout, /\byes\s+yes\b/i, `${resource.id}: fonts`);
    if (resource.resourceType === "visual-guide") {
      const imagesRun = spawnSync("pdfimages", ["-list", studentPath], { encoding: "utf8" });
      assert.equal(imagesRun.status, 0, resource.id);
      assert.match(imagesRun.stdout, /\bimage\s+1200\s+805\s+rgb\s+3\s+8\b/, `${resource.id}: visible 8-bit visual`);
      assert.doesNotMatch(imagesRun.stdout, /\bsmask\b/, `${resource.id}: transparent image mask`);
    }
    if (!resource.answerKeyPdf) continue;
    const keyPath = resolve(root, "public", resource.answerKeyPdf.slice(1));
    const keyTextRun = spawnSync("pdftotext", [keyPath, "-"], { encoding: "utf8" });
    assert.equal(keyTextRun.status, 0, resource.id);
    assert.match(keyTextRun.stdout, /Worked Answer Key/i, resource.id);
    assert.notEqual((await readFile(studentPath)).toString("hex"), (await readFile(keyPath)).toString("hex"), resource.id);
  }
  assert.equal(verification.files.length, [...flagshipResources, ...promotedVisualPages].reduce((count, resource) => count + (resource.answerKeyPdf ? 2 : 1), 0));
  assert.ok(verification.files.every((file) => file.status === "verified" && file.canonical.startsWith("https://bettergrades.net/")));
});

test("download headers canonicalize PDFs to their HTML landing pages", async () => {
  const headers = await readFile(resolve(root, "public/_headers"), "utf8");
  for (const resource of [...flagshipResources, ...promotedVisualPages]) {
    for (const path of [resource.studentPdf, resource.answerKeyPdf].filter(Boolean)) {
      assert.match(headers, new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n  Link: <https://bettergrades\\.net${resource.canonicalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}>; rel="canonical"`));
    }
  }
});

test("promoted visual assets are script-free, described, explicit-size, and raster-backed", async () => {
  const ids = [
    "secant-tangent-approach",
    "derivative-rules-map",
    "open-top-box-optimization",
    "riemann-sum-progression",
    "fundamental-theorem-relationship",
    "integration-by-parts-guide",
    "geometric-series-self-similarity",
    "convergence-tests-flowchart",
    "radius-interval-convergence",
    "taylor-approximation-sequence",
  ];
  for (const id of ids) {
    const svg = await readFile(resolve(root, "public/visuals/resources", `${id}.svg`), "utf8");
    assert.match(svg, /^<svg[^>]+width="1200"[^>]+height="\d+"/);
    assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
    assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
    assert.doesNotMatch(svg, /<script|javascript:|onload=/i);
    assert.match(svg, /stroke=|Written|text/i);
    const png = await readFile(resolve(root, "public/visuals/resources", `${id}.png`));
    assert.ok(png.length > 10_000);
    assert.equal(png[25], 2, `${id}: PNG must be opaque truecolor, not alpha-masked`);
  }
});

test("resource HTML has unique landmarks, metadata, solutions, and no preview host", async () => {
  const routes = [
    "/subjects/math/calculus/worksheets/evaluating-limits/",
    "/subjects/math/calculus/formula-sheets/derivative-rules/",
    "/subjects/math/calculus/practice-exams/calculus-1-final/",
    "/subjects/math/calculus/worked-problems/limit-by-factoring/",
    "/subjects/math/calculus/visuals/convergence-tests-flowchart/",
    "/glossary/math/derivative/",
  ];
  for (const route of routes) {
    const html = await readFile(resolve(root, "dist/pages", route.slice(1), "index.html"), "utf8");
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route}: h1`);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route}: main`);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route}: canonical`);
    assert.match(html, new RegExp(`https://bettergrades\\.net${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    assert.doesNotMatch(html, /chatgpt\.site|localhost|\/Users\/|\/srv\/|storyboard/i, route);
    assert.match(html, /application\/ld\+json/, route);
  }
});

test("segmented sitemaps form a canonical, duplicate-free partition", async () => {
  const files = [
    "sitemap-lessons.xml", "sitemap-articles.xml", "sitemap-unit-hubs.xml", "sitemap-worksheets.xml",
    "sitemap-practice-exams.xml", "sitemap-formula-sheets.xml", "sitemap-worked-problems.xml",
    "sitemap-visuals.xml", "sitemap-glossary.xml", "sitemap-pages.xml",
  ];
  const seen = new Set();
  for (const file of files) {
    const xml = await readFile(resolve(root, "dist/pages", file), "utf8");
    assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    assert.match(xml, /<urlset /);
    for (const url of [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])) {
      assert.ok(url.startsWith("https://bettergrades.net/"), `${file}: ${url}`);
      assert.equal(seen.has(url), false, `duplicate ${url}`);
      seen.add(url);
    }
    assert.doesNotMatch(xml, /chatgpt\.site|pages\.dev/);
  }
  const index = await readFile(resolve(root, "dist/pages/sitemap.xml"), "utf8");
  assert.match(index, /<sitemapindex /);
  for (const file of [...files, "sitemap-images.xml"]) assert.match(index, new RegExp(`https://bettergrades\\.net/${file.replace(".", "\\.")}`));
});

test("resource analytics preserve one loader and enumerate privacy-safe events", async () => {
  const layout = await readFile(resolve(root, "app/layout.tsx"), "utf8");
  const pages = [
    await readFile(resolve(root, "app/ResourcePages.tsx"), "utf8"),
    await readFile(resolve(root, "app/CalculusUnitPages.tsx"), "utf8"),
    await readFile(resolve(root, "app/LimitsUnitPages.tsx"), "utf8"),
  ].join("\n");
  assert.equal((layout.match(/googletagmanager\.com\/gtag\/js/g) ?? []).length, 1);
  assert.equal((layout.match(/analytics\.bohodigitalservices\.com\/script\.js/g) ?? []).length, 1);
  for (const event of [
    "resource_view", "resource_download", "worksheet_download", "answer_key_download", "practice_exam_download",
    "formula_sheet_download", "visual_download", "worksheet_print", "practice_start", "practice_complete",
    "exam_start", "exam_complete", "worked_solution_open", "resource_to_lesson_click",
    "lesson_to_resource_click", "glossary_to_lesson_click",
  ]) assert.match(pages, new RegExp(`"${event}"`), event);
  assert.doesNotMatch(pages, /student_name|student_email|full_response|raw_work/i);
});

test("generated catalog remains deterministic", () => {
  assert.deepEqual(catalog.resources, flagshipResources);
  assert.deepEqual(catalog.workedProblems, workedProblemResources);
  assert.deepEqual(catalog.glossaryEnrichments, enrichedGlossaryResources);
});
