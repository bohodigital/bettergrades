import { execFileSync, spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { pagesPackageHash } from "../lib/seo/build-hash.mjs";

const root = resolve(import.meta.dirname, "..");
const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;
function integerArgument(name, fallback) {
  const inline = process.argv.find((argument) => argument.startsWith(`${name}=`));
  const value = Number(inline?.slice(name.length + 1) ?? fallback);
  if (!Number.isInteger(value)) throw new Error(`${name} must be an integer.`);
  return value;
}

const shardCount = integerArgument("--shard-count", 1);
const shardIndex = integerArgument("--shard-index", 0);
const resume = process.argv.includes("--resume");
if (shardCount < 1 || shardIndex < 0 || shardIndex >= shardCount) throw new Error("Rendered-DOM shard coordinates are invalid.");
const artifactName = shardCount === 1
  ? "final-rendered-dom-audit.json"
  : `final-rendered-dom-audit.shard-${String(shardIndex).padStart(3, "0")}-of-${String(shardCount).padStart(3, "0")}.json`;
const artifactPath = resolve(root, "artifacts", "seo", artifactName);
function routePasses(entry) {
  return entry
    && !entry.error
    && entry.status === 200
    && entry.h1Count === 1
    && entry.mainCount === 1
    && entry.noscriptCount === 0
    && entry.overflowPixels <= 1
    && entry.visibleTextLength >= 80
    && !entry.softError
    && !entry.malformedMath
    && !entry.editorialLeak
    && entry.consoleErrors?.length === 0
    && entry.failedRequests?.length === 0;
}
const server = spawn(process.execPath, ["tools/serve-pages-preview.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "inherit"],
});

async function waitForServer() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`${baseURL}/sitemap.xml`);
      if (response.ok) return response.text();
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error("Timed out waiting for the local Pages package server");
}

let browser;
try {
  const sitemap = await waitForServer();
  const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((match) => match[1]);
  const htmlSitemapPaths = sitemapPaths.filter((path) => path !== "/sitemap-images.xml");
  const sitemapBodies = await Promise.all(htmlSitemapPaths.map(async (path) => {
    const response = await fetch(`${baseURL}${path}`);
    if (!response.ok) throw new Error(`Sitemap ${path} returned ${response.status}`);
    return response.text();
  }));
  const allRoutes = sitemapBodies.flatMap((body) => [...body.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((match) => match[1]));
  if (allRoutes.length === 0) throw new Error("Expected at least one sitemap route");
  if (new Set(allRoutes).size !== allRoutes.length) throw new Error("Expected every sitemap route to be unique");
  const routes = allRoutes.filter((_, index) => index % shardCount === shardIndex);
  const priorReport = resume
    ? JSON.parse(await readFile(artifactPath, "utf8").catch(() => "{}"))
    : {};
  const priorByPath = new Map(Array.isArray(priorReport.routes)
    ? priorReport.routes.filter(routePasses).map((entry) => [entry.path, entry])
    : []);

  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  let cursor = 0;
  const results = new Array(routes.length);
  await Promise.all(Array.from({ length: 4 }, async () => {
    const page = await context.newPage();
    const pageConsoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !/googletagmanager|analytics\.bohodigitalservices/.test(message.text())) {
        pageConsoleErrors.push(message.text());
      }
    });
    while (cursor < routes.length) {
      const index = cursor;
      cursor += 1;
      const path = routes[index];
      if (priorByPath.has(path)) {
        results[index] = priorByPath.get(path);
        continue;
      }
      pageConsoleErrors.length = 0;
      const failedRequests = [];
      const requestFailure = (request) => {
        if (!/googletagmanager|analytics\.bohodigitalservices/.test(request.url())) failedRequests.push(request.url());
      };
      page.on("requestfailed", requestFailure);
      const started = performance.now();
      try {
        const response = await page.goto(`${baseURL}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
        const values = await page.evaluate(() => ({
          h1Count: document.querySelectorAll("h1").length,
          mainCount: document.querySelectorAll("main").length,
          noscriptCount: document.querySelectorAll("noscript").length,
          overflowPixels: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          visibleTextLength: document.body.innerText.length,
          softError: /internal server error|service unavailable|resource limit reached|error code 1102/i.test(document.body.innerText),
          malformedMath: /(?:\bfrac(?:13|56|311)\b|\\(?:frac|sum|prod|lim|int|cdots|ldots)\b)/i.test(document.body.innerText),
          editorialLeak: /Preserve the misconception control|implementation note|author instruction|developer note|\/Users\/|\/srv\/local1\//i.test(document.body.innerText),
        }));
        results[index] = {
          path,
          status: response?.status() ?? null,
          durationMs: Number((performance.now() - started).toFixed(2)),
          ...values,
          consoleErrors: [...pageConsoleErrors],
          failedRequests,
        };
      } catch (error) {
        results[index] = {
          path,
          durationMs: Number((performance.now() - started).toFixed(2)),
          error: error instanceof Error ? error.message : String(error),
          consoleErrors: [...pageConsoleErrors],
          failedRequests,
        };
      } finally {
        page.off("requestfailed", requestFailure);
      }
    }
    await page.close();
  }));
  await context.close();

  const failures = results.filter((entry) => !routePasses(entry));
  const report = {
    schemaVersion: 2,
    label: "final-local",
    generatedAt: new Date().toISOString(),
    environment: "local-candidate",
    browser: "Playwright Chromium",
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    sourceTree: execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim(),
    buildHash: await pagesPackageHash(resolve(root, "dist", "pages")),
    totalSiteRouteCount: allRoutes.length,
    routeCount: routes.length,
    shard: { index: shardIndex, count: shardCount, partition: "sitemap-order-index-modulo" },
    resumedPassingRoutes: priorByPath.size,
    concurrency: 4,
    expectations: {
      status: 200,
      h1Count: 1,
      mainCount: 1,
      noscriptCount: 0,
      horizontalOverflowPixelsMaximum: 1,
      minimumVisibleTextLength: 80,
      consoleErrors: 0,
      failedRequests: 0,
      softError: false,
      malformedMath: false,
      editorialLeak: false,
    },
    failureCount: failures.length,
    failures,
    routes: results,
    pass: failures.length === 0,
  };
  await mkdir(resolve(root, "artifacts", "seo"), { recursive: true });
  await writeFile(artifactPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ routeCount: report.routeCount, failureCount: report.failureCount, pass: report.pass }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
