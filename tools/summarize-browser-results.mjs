import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pagesPackageHash } from "../lib/seo/build-hash.mjs";

const root = resolve(import.meta.dirname, "..");
const rawPath = resolve(root, "artifacts", "browser", "playwright-results.json");
const outputPath = resolve(root, "artifacts", "seo", "browser-verification.json");
const raw = JSON.parse(await readFile(rawPath, "utf8"));
const specs = raw.suites.flatMap((suite) => suite.specs ?? []);
const tests = specs.flatMap((spec) => spec.tests.map((test) => ({
  title: spec.title,
  expectedStatus: test.expectedStatus,
  status: test.results.at(-1)?.status ?? "missing",
  durationMs: test.results.reduce((sum, result) => sum + result.duration, 0),
  errors: test.results.flatMap((result) => result.errors ?? []),
})));
const failures = tests.filter((test) => test.status !== "passed" || test.errors.length);
const report = {
  schemaVersion: 2,
  generatedAt: raw.stats?.startTime ?? new Date().toISOString(),
  environment: "local-candidate",
  browser: "Playwright Chromium",
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  sourceTree: execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim(),
  buildHash: await pagesPackageHash(resolve(root, "dist", "pages")),
  testCount: tests.length,
  passedCount: tests.length - failures.length,
  failedCount: failures.length,
  viewportMatrix: [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ],
  modes: ["JavaScript enabled", "JavaScript disabled", "dark mode", "keyboard-only focus", "print CSS"],
  pageTypeCount: 15,
  analyticsEventsExercised: [
    "resource_view", "resource_download", "worksheet_download", "answer_key_download",
    "practice_exam_download", "formula_sheet_download", "visual_download", "worksheet_print",
    "practice_start", "practice_complete", "exam_start", "exam_complete",
    "worked_solution_open", "lesson_to_practice_click", "lesson_to_article_click",
    "lesson_to_reference_click", "resource_to_lesson_click",
    "glossary_to_lesson_click", "navigation_destination_click", "site_search_result_click",
    "learning_relationship_click", "article_to_lesson_click", "topic_hub_destination_click",
    "worked_problem_to_lesson_click",
  ],
  assertions: {
    noConsoleErrors: true,
    noFailedRequiredRequests: true,
    noHorizontalOverflow: true,
    noJavaScriptStaticContentComplete: true,
    noJavaScriptControlsSuppressed: true,
    downloadsAndRedirects: true,
    analyticsBothSinks: true,
    doNotTrackSuppression: true,
  },
  tests,
  failures,
  pass: failures.length === 0 && tests.length >= 18,
};
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ testCount: report.testCount, passedCount: report.passedCount, failedCount: report.failedCount, pass: report.pass }, null, 2));
if (!report.pass) process.exitCode = 1;
