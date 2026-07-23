import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const label = process.argv.find((argument) => argument.startsWith("--label="))?.split("=")[1] ?? "baseline";
if (!["baseline", "final"].includes(label)) throw new Error(`Unsupported audit label: ${label}`);

const artifactDirectory = resolve(root, "artifacts", "seo");
await mkdir(artifactDirectory, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("seo-audit", `${label}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const context = { waitUntil() {}, passThroughOnException() {} };

function fetchLocal(path, init) {
  return worker.fetch(new Request(`http://localhost${path}`, {
    headers: { accept: "text/html", ...(init?.headers ?? {}) },
    ...init,
  }), env, context);
}

function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:x27|39);/gi, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
}

function visibleText(html) {
  return decodeEntities(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<annotation\b[\s\S]*?<\/annotation>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedFingerprintText(html) {
  return visibleText(html)
    .toLowerCase()
    .replace(/\b(?:reviewed|updated|revision)\s+[a-z]+\s+\d{1,2},?\s+\d{4}\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function firstMatch(html, pattern) {
  return decodeEntities(html.match(pattern)?.[1] ?? "").replace(/\s+/g, " ").trim();
}

function classify(path) {
  if (path === "/") return "home";
  if (path.includes("/worksheets/")) return "worksheet";
  if (path.includes("/practice-exams/")) return "practice-exam";
  if (path.includes("/formula-sheets/")) return "formula-sheet";
  if (path.includes("/worked-problems/")) return "worked-problem";
  if (path.includes("/visuals/")) return "visual";
  if (path.startsWith("/glossary/")) return "glossary";
  if (path.startsWith("/tools/")) return "tool";
  if (path.startsWith("/practice/")) return "practice";
  if (path.startsWith("/answers/")) return "answer";
  if (path.includes("/unit/") || /\/(?:derivatives|derivative-applications|integrals|integration-applications|sequences-and-series|power-series-and-taylor-series)\/.+\/$/.test(path)) return "lesson";
  if (path.startsWith("/subjects/")) return "subject-or-article";
  return "policy-or-directory";
}

function canonical(html) {
  return html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
    ?? html.match(/<link\b[^>]*href="([^"]+)"[^>]*rel="canonical"/i)?.[1]
    ?? "";
}

function metaDescription(html) {
  return html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1]
    ?? html.match(/<meta\b[^>]*content="([^"]*)"[^>]*name="description"/i)?.[1]
    ?? "";
}

function mainText(html) {
  const matches = [...html.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/gi)];
  return matches.map((match) => normalizedFingerprintText(match[1])).join(" ");
}

const sitemapResponse = await fetchLocal("/sitemap.xml");
if (sitemapResponse.status !== 200) throw new Error(`Local sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const routes = [...sitemap.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((match) => match[1]);
if (!routes.length) throw new Error("Local sitemap contains no routes");

const leakPatterns = [
  ["preserve-misconception-control", /Preserve the misconception control/i],
  ["storyboard", /described in (?:the lesson and )?storyboard/i],
  ["implementation-note", /\bimplementation note\b/i],
  ["author-instruction", /\bauthor instruction\b/i],
  ["developer-note", /\bdeveloper note\b/i],
  ["todo", /\bTODO\b/],
  ["fixme", /\bFIXME\b/],
  ["local-path", /(?:\/Users\/|\/srv\/local1\/|\/home\/bohopi\/)/i],
  ["private-preview", /https?:\/\/[^\s"'<>]*mankopoppi\.chatgpt\.site/i],
];
const malformedMathPatterns = [
  ["frac13", /\bfrac13\b/i],
  ["frac56", /\bfrac56\b/i],
  ["frac311", /\bfrac311\b/i],
  ["cdots", /\bcdots\b/i],
  ["ldots", /\bldots\b/i],
  ["latex-command", /\\(?:frac|sum|prod|lim|int|cdots|ldots)\b/],
];

const inventory = [];
const rawAudit = [];
for (const path of routes) {
  const response = await fetchLocal(path);
  const html = await response.text();
  const text = normalizedFingerprintText(html);
  const main = mainText(html);
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const mainCount = (html.match(/<main\b/gi) ?? []).length;
  const noScriptLessonCount = (html.match(/data-noscript-calculus-fallback=/gi) ?? []).length;
  const primaryLessonCount = (html.match(/data-unit-id=/gi) ?? []).length;
  const leaks = leakPatterns.filter(([, pattern]) => pattern.test(html)).map(([id]) => id);
  const malformedMath = malformedMathPatterns.filter(([, pattern]) => pattern.test(visibleText(html))).map(([id]) => id);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missingAltCount = images.filter((tag) => !/\balt="[^"]+"/i.test(tag)).length;
  const jsonLdTypes = [...html.matchAll(/"@type":"([^"]+)"/g)].map((match) => match[1]);
  inventory.push({
    path,
    pageType: classify(path),
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    canonical: canonical(html),
    robots: firstMatch(html, /<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/i),
    title: firstMatch(html, /<title>([\s\S]*?)<\/title>/i),
    metaDescription: decodeEntities(metaDescription(html)),
    h1Count,
    mainCount,
    imageCount: images.length,
    missingAltCount,
    jsonLdTypes: [...new Set(jsonLdTypes)],
    textLength: text.length,
    textFingerprint: hash(text),
    mainTextLength: main.length,
    mainTextFingerprint: hash(main),
  });
  rawAudit.push({
    path,
    status: response.status,
    h1Count,
    mainCount,
    noScriptLessonCount,
    primaryLessonCount,
    substantiveLessonBodies: noScriptLessonCount + primaryLessonCount,
    leakFindings: leaks,
    malformedMathFindings: malformedMath,
    canonical: canonical(html),
    expectedCanonical: `https://bettergrades.net${path}`,
    textFingerprint: hash(text),
    mainTextFingerprint: hash(main),
  });
}

const duplicateGroups = [...Map.groupBy(inventory, (entry) => entry.mainTextFingerprint)]
  .filter(([, entries]) => entries.length > 1)
  .map(([fingerprint, entries]) => ({ fingerprint, paths: entries.map((entry) => entry.path) }));

const redirectsFile = await readFile(resolve(root, "dist", "pages", "_redirects"), "utf8");
const literalRedirects = redirectsFile
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [from, to, status] = line.split(/\s+/);
    return { from, to, expectedStatus: Number(status) };
  });
const redirectAudit = [];
for (const redirect of literalRedirects) {
  const response = await fetchLocal(redirect.from, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  const targetPath = location ? new URL(location, "http://localhost").pathname : "";
  const targetResponse = targetPath ? await fetchLocal(targetPath, { redirect: "manual" }) : undefined;
  redirectAudit.push({
    ...redirect,
    status: response.status,
    location,
    targetPath,
    targetStatus: targetResponse?.status ?? null,
    oneHop: response.status === redirect.expectedStatus && targetPath === redirect.to && targetResponse?.status === 200,
  });
}

async function runBatch(paths, concurrency) {
  let cursor = 0;
  const results = [];
  const startedAt = performance.now();
  await Promise.all(Array.from({ length: Math.min(concurrency, paths.length) }, async () => {
    while (cursor < paths.length) {
      const index = cursor;
      cursor += 1;
      const path = paths[index];
      const started = performance.now();
      try {
        const response = await fetchLocal(path);
        const body = await response.text();
        results[index] = {
          path,
          status: response.status,
          contentType: response.headers.get("content-type") ?? "",
          durationMs: Number((performance.now() - started).toFixed(2)),
          stableMarker: /<title>[^<]+<\/title>/.test(body) && /<main\b/.test(body),
          resourceLimitMarker: /resource limit|worker exceeded|error code 1102/i.test(body),
          softErrorMarker: response.status === 200 && /internal server error|service unavailable|resource limit/i.test(body),
        };
      } catch (error) {
        results[index] = { path, error: error instanceof Error ? error.message : String(error) };
      }
    }
  }));
  return {
    concurrency,
    routeCount: paths.length,
    totalDurationMs: Number((performance.now() - startedAt).toFixed(2)),
    unexpected5xx: results.filter((result) => result?.status >= 500).length,
    resourceLimitResponses: results.filter((result) => result?.resourceLimitMarker).length,
    soft200Errors: results.filter((result) => result?.softErrorMarker).length,
    failures: results.filter((result) => result?.error || result?.status !== 200 || !result?.stableMarker),
    results,
  };
}

const sample = routes.filter((_, index) => index % Math.max(1, Math.floor(routes.length / 200)) === 0).slice(0, 200);
const burstSample = sample.slice(0, Math.min(80, sample.length));
const crawlRuns = [
  await runBatch(routes, 1),
  await runBatch(routes, 5),
  await runBatch(sample, 10),
];
for (let repeat = 0; repeat < 5; repeat += 1) crawlRuns.push(await runBatch(burstSample, 20));

const workerBytes = (await readFile(resolve(root, "dist", "pages", "_worker.js"))).byteLength;
const report = {
  schemaVersion: 1,
  label,
  generatedAt: new Date().toISOString(),
  routeCount: routes.length,
  routesByPageType: Object.fromEntries([...Map.groupBy(inventory, (entry) => entry.pageType)].map(([type, entries]) => [type, entries.length])),
  unexpectedStatusCount: inventory.filter((entry) => entry.status !== 200).length,
  canonicalMismatchCount: inventory.filter((entry) => entry.canonical !== `https://bettergrades.net${entry.path}`).length,
  h1ViolationCount: inventory.filter((entry) => entry.h1Count !== 1).length,
  mainViolationCount: inventory.filter((entry) => entry.mainCount !== 1).length,
  duplicateLessonRouteCount: rawAudit.filter((entry) => entry.substantiveLessonBodies > 1).length,
  leakRouteCount: rawAudit.filter((entry) => entry.leakFindings.length).length,
  malformedMathRouteCount: rawAudit.filter((entry) => entry.malformedMathFindings.length).length,
  duplicateGroups,
  workerBytes,
  routes: inventory,
};

const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const columns = ["path", "pageType", "status", "contentType", "canonical", "robots", "title", "metaDescription", "h1Count", "mainCount", "imageCount", "missingAltCount", "textLength", "textFingerprint", "mainTextLength", "mainTextFingerprint"];
const csv = [
  columns.join(","),
  ...inventory.map((entry) => columns.map((column) => csvCell(entry[column])).join(",")),
].join("\n");

await Promise.all([
  writeFile(resolve(artifactDirectory, `${label}-route-inventory.json`), `${JSON.stringify(report, null, 2)}\n`),
  writeFile(resolve(artifactDirectory, `${label}-route-inventory.csv`), `${csv}\n`),
  writeFile(resolve(artifactDirectory, `${label}-raw-html-audit.json`), `${JSON.stringify({ schemaVersion: 1, label, routes: rawAudit }, null, 2)}\n`),
  writeFile(resolve(artifactDirectory, `${label}-redirect-audit.json`), `${JSON.stringify({ schemaVersion: 1, label, redirects: redirectAudit }, null, 2)}\n`),
  writeFile(resolve(artifactDirectory, `crawl-load-${label === "baseline" ? "before" : "after"}.json`), `${JSON.stringify({ schemaVersion: 1, label, runs: crawlRuns }, null, 2)}\n`),
]);

console.log(JSON.stringify({
  label,
  routeCount: routes.length,
  h1ViolationCount: report.h1ViolationCount,
  mainViolationCount: report.mainViolationCount,
  duplicateLessonRouteCount: report.duplicateLessonRouteCount,
  leakRouteCount: report.leakRouteCount,
  malformedMathRouteCount: report.malformedMathRouteCount,
  redirectFailureCount: redirectAudit.filter((entry) => !entry.oneHop).length,
  crawlFailureCount: crawlRuns.reduce((sum, run) => sum + run.failures.length, 0),
  workerBytes,
}, null, 2));
