import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const root = resolve(import.meta.dirname, "../..");
const baseURL = "http://127.0.0.1:4179";
const artifactDir = resolve(root, "artifacts/ia");
const screenshotRoot = resolve(artifactDir, "screenshots");
await mkdir(resolve(screenshotRoot, "page-types"), { recursive: true });
await mkdir(resolve(screenshotRoot, "navigation"), { recursive: true });
const server = spawn(process.execPath, ["tools/serve-pages-preview.mjs"], {
  cwd: root,
  env: { ...process.env, PORT: "4179" },
  stdio: ["ignore", "pipe", "pipe"],
});
const waitForServer = async () => {
  for (let i = 0; i < 100; i += 1) {
    try { if ((await fetch(baseURL)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Preview server did not start");
};
await waitForServer();
const browser = await chromium.launch({ headless: true });
try {
  const inventoryArtifact = JSON.parse(await readFile(resolve(root, "data/ia/page-inventory.json"), "utf8"));
  const inventory = inventoryArtifact.routes;
  const graph = JSON.parse(await readFile(resolve(root, "artifacts/ia/internal-link-graph.json"), "utf8"));
  const articleCandidates = JSON.parse(await readFile(resolve(root, "data/ia/article-lesson-candidates.json"), "utf8")).candidates;
  const routeSet = new Set(inventory.map((row) => row.route));
  const roleFor = new Map(inventory.map((row) => [row.route, row.page_role]));
  const adjacency = new Map();
  for (const edge of graph.edges) {
    if (!routeSet.has(edge.target)) continue;
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    adjacency.get(edge.source).push(edge.target);
  }
  const shortestPath = (start, target) => {
    const queue = [[start]];
    const seen = new Set([start]);
    while (queue.length) {
      const path = queue.shift();
      const current = path.at(-1);
      if (current === target) return path;
      for (const next of adjacency.get(current) ?? []) {
        if (seen.has(next)) continue;
        seen.add(next);
        queue.push([...path, next]);
      }
    }
    return null;
  };
  const routeByRole = new Map();
  for (const row of inventory) if (!routeByRole.has(row.page_role)) routeByRole.set(row.page_role, row.route);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const framing = [];
  for (const row of inventory) {
    await page.goto(`${baseURL}${row.route}`, { waitUntil: "domcontentloaded" });
    const measurement = await page.evaluate(() => {
      const main = document.querySelector("main");
      const first = main?.querySelector("p, form, table, ol, ul, .limits-section-copy, .calculus-lesson-body, .resource-problem");
      const breadcrumb = main?.querySelector('[class*="breadcrumb"]');
      return {
        firstSubstantiveTop: first ? Math.round(first.getBoundingClientRect().top) : null,
        firstSubstantiveHeading: first?.previousElementSibling?.textContent?.trim().slice(0, 160) ?? "",
        breadcrumbHeight: breadcrumb ? Math.round(breadcrumb.getBoundingClientRect().height) : 0,
        headerHeight: Math.round(document.querySelector("header")?.getBoundingClientRect().height ?? 0),
        overflowPixels: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      };
    });
    framing.push({ route: row.route, ...measurement });
  }
  await context.close();
  await writeFile(resolve(artifactDir, "browser-framing.json"), `${JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), sourceCommit: inventoryArtifact.sourceCommit, sourceTree: inventoryArtifact.sourceTree, buildHash: inventoryArtifact.buildHash, toolVersion: "1.0.0", routeCount: inventory.length, failureCount: framing.filter((r) => r.overflowPixels > 0).length, routes: framing }, null, 2)}\n`);

  const representativeRoutes = new Map(
    ["home", "course-hub", "unit-hub", "quick-answer", "method-guide", "textbook-lesson", "worksheet", "practice-exam", "worked-problem", "formula-sheet", "visual-guide", "glossary-term", "tool", "search"]
      .map((role) => [role, routeByRole.get(role)])
      .filter(([, route]) => route)
  );
  // The current inventory has no canonical topic-hub role. Capture the nearest
  // current topic-group surface under the requested filename and disclose the
  // surrogate in the report instead of inventing a production classification.
  representativeRoutes.set("topic-hub", "/subjects/math/calculus/sequences-and-series/");
  const viewports = [{ name: "desktop", width: 1440, height: 900 }, { name: "tablet", width: 768, height: 1024 }, { name: "mobile", width: 390, height: 844 }];
  for (const viewport of viewports) {
    const shotContext = await browser.newContext({ viewport });
    const shotPage = await shotContext.newPage();
    for (const [role, route] of representativeRoutes) {
      await shotPage.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
      await shotPage.screenshot({ path: resolve(screenshotRoot, "page-types", `${role}-${viewport.name}.png`), fullPage: true });
    }
    await shotContext.close();
  }

  const matchedArticle = articleCandidates.find((row) => row.candidate_lesson && row.current_link_exists) ?? articleCandidates.find((row) => row.candidate_lesson);
  const lessonPracticeEdge = graph.edges.find((edge) => roleFor.get(edge.source) === "textbook-lesson" && ["worksheet", "practice-exam", "worked-problem"].includes(roleFor.get(edge.target)));
  const workedLessonEdge = graph.edges.find((edge) => roleFor.get(edge.source) === "worked-problem" && roleFor.get(edge.target) === "textbook-lesson");
  const glossaryLessonEdge = graph.edges.find((edge) => roleFor.get(edge.source) === "glossary-term" && roleFor.get(edge.target) === "textbook-lesson");
  const targets = [
    ["Find the Calculus course from the homepage", "/", "/subjects/math/calculus/"],
    ["Find Unit 4A from the homepage", "/", "/subjects/math/calculus/sequences-and-series/"],
    ["Find the full Geometric Series textbook lesson", "/", "/subjects/math/calculus/sequences-and-series/geometric-series/"],
    ["Find the Geometric Series worksheet", "/", inventory.find((p) => p.page_role === "worksheet" && /geometric-series/.test(p.route))?.route],
    ["Find the Chain Rule lesson", "/", "/subjects/math/calculus/derivatives/chain-rule-basic/"],
    ["Find the Chain Rule worksheet", "/", inventory.find((p) => p.page_role === "worksheet" && /chain-rule/.test(p.route))?.route],
    ["Find the Derivative Rules formula sheet", "/", inventory.find((p) => p.page_role === "formula-sheet" && /derivative/.test(p.route))?.route],
    ["Find the Calculus I practice final", "/", inventory.find((p) => p.page_role === "practice-exam" && /calculus-i-|calculus-1/.test(p.route))?.route],
    ["Find the Calculus II practice final", "/", inventory.find((p) => p.page_role === "practice-exam" && /calculus-ii-|calculus-2/.test(p.route))?.route],
    ["Find the Convergence Tests visual guide", "/", inventory.find((p) => p.page_role === "visual-guide" && /convergence/.test(p.route))?.route],
    ["Find a specific glossary term", "/", inventory.find((p) => p.page_role === "glossary-term")?.route],
    ["Find a known article from its exact title", "/search/", inventory.find((p) => ["quick-answer", "concept-explainer", "method-guide", "decision-guide"].includes(p.page_role))?.route, "exact-title"],
    ["Find a known page using part of its URL slug", "/search/", inventory.find((p) => p.page_role === "textbook-lesson")?.route, "slug"],
    ["Move from a short-form article to the exact full textbook lesson", matchedArticle?.source_article, matchedArticle?.candidate_lesson, "relationship"],
    ["Move from a textbook lesson to exact practice", lessonPracticeEdge?.source ?? "/subjects/math/calculus/derivatives/chain-rule-basic/", lessonPracticeEdge?.target ?? "/subjects/math/calculus/worksheets/chain-rule/", "relationship"],
    ["Move from a worked problem to the full lesson", workedLessonEdge?.source, workedLessonEdge?.target, "relationship"],
    ["Move from a glossary term to the full lesson", glossaryLessonEdge?.source ?? "/glossary/math/chain-rule/", glossaryLessonEdge?.target ?? "/subjects/math/calculus/derivatives/chain-rule-basic/", "relationship"],
    ["Find the Resources library from mobile navigation", "/", "/resources/"],
    ["Find a lesson with JavaScript disabled", "/", "/subjects/math/calculus/sequences-and-series/geometric-series/", "javascript-disabled"],
    ["Distinguish page roles for the same concept in search", "/search/", "/search/", "role-diversity"],
  ].filter((row) => row[1] && row[2]);
  const results = [];
  for (const viewport of viewports) {
    const scenarioContext = await browser.newContext({ viewport, javaScriptEnabled: true });
    const scenarioPage = await scenarioContext.newPage();
    for (let index = 0; index < targets.length; index += 1) {
      const [task, start, target, mode = "navigation"] = targets[index];
      if (mode === "javascript-disabled") {
        const noJsContext = await browser.newContext({ viewport, javaScriptEnabled: false });
        const noJsPage = await noJsContext.newPage();
        const graphPath = shortestPath(start, target);
        let success = false;
        const path = [start];
        await noJsPage.goto(`${baseURL}${start}`, { waitUntil: "domcontentloaded" });
        for (const next of graphPath?.slice(1) ?? []) {
          let link = noJsPage.locator(`a[href="${next}"]:visible`).first();
          if (!await link.count()) {
            const hiddenCopies = noJsPage.locator(`a[href="${next}"]`);
            for (let copy = 0; copy < await hiddenCopies.count(); copy += 1) {
              await hiddenCopies.nth(copy).evaluate((element) => {
                for (let parent = element.parentElement; parent; parent = parent.parentElement) {
                  if (parent instanceof HTMLDetailsElement) parent.open = true;
                }
              });
            }
            link = noJsPage.locator(`a[href="${next}"]:visible`).first();
          }
          if (!await link.count()) break;
          await link.click();
          await noJsPage.waitForLoadState("domcontentloaded");
          path.push(new URL(noJsPage.url()).pathname);
        }
        success = new URL(noJsPage.url()).pathname === target;
        if (viewport.name === "mobile") await noJsPage.screenshot({ path: resolve(screenshotRoot, "navigation", `task-${String(index + 1).padStart(2, "0")}.png`), fullPage: true });
        results.push({ task, viewport: viewport.name, starting_route: start, target_route: target, success, click_count: Math.max(0, path.length - 1), menu_open_count: 0, search_used: false, result_rank: "", backtrack_count: 0, ambiguous_choices: 0, dead_ends: success ? 0 : 1, path: path.join(" > "), notes: "JavaScript disabled for the complete task." });
        await noJsContext.close();
        continue;
      }
      await scenarioPage.goto(`${baseURL}${start}`, { waitUntil: "domcontentloaded" });
      let searchUsed = false;
      let resultRank = "";
      let path = [start];
      let success = start === target;
      let menuOpenCount = 0;
      let ambiguousChoices = 0;
      if (mode === "role-diversity") {
        const query = "chain rule";
        await scenarioPage.goto(`${baseURL}/search/?q=${encodeURIComponent(query)}`, { waitUntil: "networkidle" });
        const hrefs = await scenarioPage.locator(".site-search-list a").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
        const roles = new Set(hrefs.map((href) => roleFor.get(href)).filter(Boolean));
        success = ["textbook-lesson", "worksheet", "worked-problem", "glossary-term"].filter((role) => roles.has(role)).length >= 3;
        searchUsed = true;
        path = ["/search/"];
        ambiguousChoices = hrefs.length;
      } else if (task === "Find the Resources library from mobile navigation" && viewport.name === "mobile") {
        const mobileDetails = scenarioPage.locator("details.mobile-menu").first();
        if (await mobileDetails.count()) {
          await mobileDetails.locator(":scope > summary").click();
          menuOpenCount = 1;
        }
        const resourceLink = scenarioPage.locator(`nav[aria-label='Mobile navigation'] a[href="${target}"]:visible`).first();
        if (await resourceLink.count()) {
          await resourceLink.click();
          await scenarioPage.waitForLoadState("domcontentloaded");
          path.push(new URL(scenarioPage.url()).pathname);
          success = new URL(scenarioPage.url()).pathname === target;
        }
      }
      if (!success) {
        const graphPath = shortestPath(start, target);
        if (mode !== "exact-title" && mode !== "slug" && graphPath && graphPath.length <= 7) {
          for (const next of graphPath.slice(1)) {
            const direct = scenarioPage.locator(`a[href="${next}"]:visible`).first();
            if (!await direct.count()) break;
            await direct.click();
            await scenarioPage.waitForLoadState("domcontentloaded");
            path.push(new URL(scenarioPage.url()).pathname);
          }
          success = new URL(scenarioPage.url()).pathname === target;
        }
        if (!success) {
          searchUsed = true;
          const targetRecord = inventory.find((p) => p.route === target);
          const slugQuery = target.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ");
          const query = mode === "slug" ? slugQuery : targetRecord?.short_title ?? targetRecord?.title ?? target;
          await scenarioPage.goto(`${baseURL}/search/?q=${encodeURIComponent(query)}`, { waitUntil: "networkidle" });
          const matches = scenarioPage.locator(`a[href="${target}"]:visible`);
          const count = await matches.count();
          if (count) {
            const allResults = scenarioPage.locator(".site-search-list a");
            const hrefs = await allResults.evaluateAll((els) => els.map((el) => el.getAttribute("href")));
            resultRank = hrefs.indexOf(target) + 1 || "";
            await matches.first().click();
            await scenarioPage.waitForLoadState("domcontentloaded");
            path.push("/search/", new URL(scenarioPage.url()).pathname);
            success = new URL(scenarioPage.url()).pathname === target;
          }
        }
      }
      if (viewport.name === "mobile") await scenarioPage.screenshot({ path: resolve(screenshotRoot, "navigation", `task-${String(index + 1).padStart(2, "0")}.png`), fullPage: true });
      results.push({ task, viewport: viewport.name, starting_route: start, target_route: target, success, click_count: Math.max(0, path.length - 1), menu_open_count: menuOpenCount, search_used: searchUsed, result_rank: resultRank, backtrack_count: 0, ambiguous_choices: ambiguousChoices || (resultRank && resultRank > 1 ? resultRank - 1 : 0), dead_ends: success ? 0 : 1, path: path.join(" > "), notes: success ? "Automated exact-destination task completed." : "No rendered path and search did not provide the exact target." });
    }
    await scenarioContext.close();
  }
  const scenarioArtifact = { schemaVersion: 1, generatedAt: new Date().toISOString(), sourceCommit: inventoryArtifact.sourceCommit, sourceTree: inventoryArtifact.sourceTree, buildHash: inventoryArtifact.buildHash, toolVersion: "1.0.0", routeCount: inventory.length, scenarioCount: results.length, failureCount: results.filter((r) => !r.success).length, results };
  await writeFile(resolve(artifactDir, "navigation-scenario-results.json"), `${JSON.stringify(scenarioArtifact, null, 2)}\n`);
  const fields = Object.keys(results[0]);
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  await writeFile(resolve(root, "data/ia/navigation-scenarios.csv"), `${fields.join(",")}\n${results.map((r) => fields.map((f) => esc(r[f])).join(",")).join("\n")}\n`);
  console.log(JSON.stringify({ framingRoutes: framing.length, scenarioRows: results.length, scenarioFailures: results.filter((r) => !r.success).length, screenshots: representativeRoutes.size * viewports.length + targets.length }, null, 2));
} finally {
  await browser.close();
  server.kill("SIGTERM");
}
