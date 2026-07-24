import { execFileSync, spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";
import { pagesPackageHash } from "../lib/seo/build-hash.mjs";

const root = resolve(import.meta.dirname, "..");
const port = 4174;
const baseURL = `http://127.0.0.1:${port}`;
const artifactPath = resolve(root, "artifacts", "seo", "final-rendered-dom-audit.json");
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
  const routes = sitemapBodies.flatMap((body) => [...body.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((match) => match[1]));
  if (routes.length === 0) throw new Error("Expected at least one sitemap route");
  if (new Set(routes).size !== routes.length) throw new Error("Expected every sitemap route to be unique");

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
          softError: /internal server error|service unavailable|resource limit|error code 1102/i.test(document.body.innerText),
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

  const failures = results.filter((entry) => entry.error
    || entry.status !== 200
    || entry.h1Count !== 1
    || entry.mainCount !== 1
    || entry.noscriptCount !== 0
    || entry.overflowPixels > 1
    || entry.visibleTextLength < 80
    || entry.softError
    || entry.malformedMath
    || entry.editorialLeak
    || entry.consoleErrors.length
    || entry.failedRequests.length);
  const report = {
    schemaVersion: 2,
    label: "final-local",
    generatedAt: new Date().toISOString(),
    environment: "local-candidate",
    browser: "Playwright Chromium",
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    sourceTree: execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim(),
    buildHash: await pagesPackageHash(resolve(root, "dist", "pages")),
    routeCount: routes.length,
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
