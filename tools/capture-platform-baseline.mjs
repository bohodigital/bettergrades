import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);

const baseUrl = args.get("--base-url") || "https://bettergrades.net";
const output = path.resolve(ROOT, args.get("--out") || "platform/baseline/v1/golden-baseline.json");
const screenshotDirectory = path.resolve(ROOT, args.get("--screenshots-dir") || "platform/baseline/v1/screenshots");
const printPdf = args.get("--print-pdf");
const printLog = args.get("--print-log");
const sourceCommit = args.get("--commit");
const canonicalRepository = args.get("--canonical-repo");
const tectonicBinary = args.get("--tectonic-bin");
if (!printPdf || !printLog || !sourceCommit || !canonicalRepository || !tectonicBinary) {
  throw new Error("Required: --commit COMMIT --canonical-repo PATH --tectonic-bin PATH --print-pdf PATH --print-log PATH");
}

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const jsonHash = (value) => sha256(JSON.stringify(value));
const readJson = async (relative) => JSON.parse(await readFile(path.join(ROOT, relative), "utf8"));
const git = (...gitArgs) => {
  const run = spawnSync("git", gitArgs, { cwd: ROOT, encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr);
  return run.stdout.trim();
};
const canonicalGit = (...gitArgs) => {
  const run = spawnSync("git", gitArgs, { cwd: canonicalRepository, encoding: "utf8" });
  if (run.status !== 0) throw new Error(run.stderr);
  return run.stdout.trim();
};

const canonicalHead = canonicalGit("rev-parse", "HEAD");
const canonicalOriginMain = canonicalGit("rev-parse", "origin/main");
const canonicalBranch = canonicalGit("branch", "--show-current");
const canonicalStatus = canonicalGit("status", "--porcelain");
if (canonicalHead !== sourceCommit || canonicalOriginMain !== sourceCommit || canonicalBranch !== "main" || canonicalStatus !== "") {
  throw new Error("Canonical repository is not clean main/origin-main at " + sourceCommit);
}
const sourceInputPaths = ["app", "build", "content", "lib", "public", "worker", "next.config.ts", "vite.config.ts", "wrangler.jsonc"];
const sourceDiff = spawnSync("git", ["diff", "--quiet", sourceCommit, "--", ...sourceInputPaths], { cwd: ROOT });
if (sourceDiff.status !== 0) throw new Error("Task worktree changes public source inputs relative to baseline commit");

const buildRun = spawnSync("corepack", ["pnpm", "run", "build:pages"], { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
const buildLog = (buildRun.stdout || "") + (buildRun.stderr || "");
if (buildRun.status !== 0) throw new Error("Fresh build:pages failed:\n" + buildLog);
const testFiles = (await readdir(path.join(ROOT, "tests"))).filter((name) => name.endsWith(".test.mjs")).sort().map((name) => "tests/" + name);
const testRun = spawnSync(process.execPath, ["--test", "--test-reporter=tap", ...testFiles], { cwd: ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
const testLog = (testRun.stdout || "") + (testRun.stderr || "");
if (testRun.status !== 0) throw new Error("Fresh regression tests failed:\n" + testLog);
const executedTestNumbers = [...testLog.matchAll(/^ok (\d+) -/gm)].map((match) => Number(match[1]));
const existingTestCount = Math.max(0, ...executedTestNumbers);
if (existingTestCount < 1) throw new Error("Could not measure executed TAP test count");

const tectonicVersionRun = spawnSync(tectonicBinary, ["--version"], { encoding: "utf8" });
const tectonicVersion = ((tectonicVersionRun.stdout || "") + (tectonicVersionRun.stderr || "")).trim();
if (tectonicVersionRun.status !== 0 || !tectonicVersion.includes("0.16.9")) throw new Error("Unexpected Tectonic compiler: " + tectonicVersion);

const fetchWithRetry = async (url, init = {}) => {
  let finalError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: { "user-agent": "BetterGradesBaseline/1.0 (+https://bettergrades.net)", ...(init.headers || {}) },
        signal: AbortSignal.timeout(30000),
      });
      return response;
    } catch (error) {
      finalError = error;
    }
  }
  throw finalError;
};

const attributes = (tag) => {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return result;
};

const extractMetadata = (html) => {
  const tags = [...html.matchAll(/<(?:meta|link|script)\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "";
  const description = tags.find((tag) => tag.name?.toLowerCase() === "description")?.content || "";
  const canonical = tags.find((tag) => tag.rel?.toLowerCase() === "canonical")?.href || "";
  const robots = tags.find((tag) => tag.name?.toLowerCase() === "robots")?.content || "";
  const analyticsTag = tags.find((tag) => tag.src === "https://analytics.bohodigitalservices.com/script.js");
  const analyticsConfig = analyticsTag ? {
    scriptUrl: analyticsTag.src,
    websiteId: analyticsTag["data-website-id"] || "",
    domains: analyticsTag["data-domains"] || "",
    doNotTrack: analyticsTag["data-do-not-track"] === "true",
    excludeSearch: analyticsTag["data-exclude-search"] === "true",
  } : null;
  return { title, description, canonical, robots, analytics: Boolean(analyticsTag), analyticsConfig };
};

const vite = await createServer({ configFile: false, root: ROOT, server: { middlewareMode: true }, appType: "custom" });
const routing = await vite.ssrLoadModule("/lib/registry/routing.ts");
const search = await vite.ssrLoadModule("/lib/site-search.ts");
const limits = await import(path.join(ROOT, "lib/calculus/limits-unit.mjs"));
await vite.close();

const unit = await readJson("content/limits-continuity/unit.json");
const answerKeys = await readJson("content/limits-continuity/exam-answer-keys.json");
const routeBySlug = new Map(limits.limitsUnitRoutes.map((route) => [route.sourceSlug, route.path]));
const importedRouteBySlug = new Map(unit.routes.map((route) => [route.sourceSlug, route.path]));

if (routing.publicRoutes.length !== 186) throw new Error("Expected 186 public routes, observed " + routing.publicRoutes.length);
if (limits.limitsUnitRoutes.length !== 73) throw new Error("Expected 73 Limits routes, observed " + limits.limitsUnitRoutes.length);
if (unit.routes.length !== 71) throw new Error("Expected 71 imported Limits routes, observed " + unit.routes.length);
if (unit.checks.length !== 38) throw new Error("Expected 38 checks, observed " + unit.checks.length);

const sitemapUrl = new URL("/sitemap.xml", baseUrl).href;
const sitemapResponse = await fetchWithRetry(sitemapUrl);
const sitemapText = await sitemapResponse.text();
const sitemapLocations = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapPaths = new Set(sitemapLocations.map((url) => new URL(url).pathname));
if (sitemapResponse.status !== 200) throw new Error("Sitemap returned " + sitemapResponse.status);
if (sitemapLocations.length !== 186) throw new Error("Expected 186 sitemap URLs, observed " + sitemapLocations.length);

let observedAnalytics;
const crawlOne = async (route) => {
  const response = await fetchWithRetry(new URL(route, baseUrl));
  const html = await response.text();
  const metadata = extractMetadata(html);
  if (response.status !== 200) throw new Error(route + " returned " + response.status);
  if (!metadata.title || !metadata.canonical || !metadata.robots) throw new Error(route + " is missing required metadata");
  if (new URL(metadata.canonical).pathname !== route) throw new Error(route + " has mismatched canonical " + metadata.canonical);
  if (metadata.robots.toLowerCase() !== "index, follow") throw new Error(route + " has unexpected robots metadata " + metadata.robots);
  if (!metadata.analytics || !metadata.analyticsConfig) throw new Error(route + " is missing analytics");
  if (!observedAnalytics) observedAnalytics = metadata.analyticsConfig;
  if (JSON.stringify(observedAnalytics) !== JSON.stringify(metadata.analyticsConfig)) throw new Error(route + " has inconsistent analytics configuration");
  if (!sitemapPaths.has(route)) throw new Error(route + " is absent from sitemap");
  return {
    route,
    status: response.status,
    title: metadata.title,
    description: metadata.description,
    canonical: metadata.canonical,
    robots: metadata.robots,
    analytics: metadata.analytics,
    sitemap: true,
    htmlSha256: sha256(html),
  };
};

const publicRecords = new Array(routing.publicRoutes.length);
let crawlCursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (crawlCursor < routing.publicRoutes.length) {
    const index = crawlCursor++;
    publicRecords[index] = await crawlOne(routing.publicRoutes[index]);
  }
}));

const redirectRecords = new Array(routing.redirects.length);
let redirectCursor = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (redirectCursor < routing.redirects.length) {
    const index = redirectCursor++;
    const redirect = routing.redirects[index];
    const response = await fetchWithRetry(new URL(redirect.from, baseUrl), { redirect: "manual" });
    const location = response.headers.get("location");
    if (!location) throw new Error(redirect.from + " did not return a Location header");
    if (response.status !== redirect.status) throw new Error(redirect.from + " returned " + response.status + ", expected " + redirect.status);
    const observedPath = new URL(location, baseUrl).pathname;
    if (observedPath !== redirect.to) throw new Error(redirect.from + " redirected to " + observedPath + ", expected " + redirect.to);
    redirectRecords[index] = {
      source: redirect.from,
      expectedDestination: redirect.to,
      status: response.status,
      observedLocation: location,
    };
  }
}));

const notFoundRoute = "/bettergrades-baseline-not-found/";
const notFoundResponse = await fetchWithRetry(new URL(notFoundRoute, baseUrl));
if (notFoundResponse.status !== 404) throw new Error("Unknown route returned " + notFoundResponse.status);

const robotsUrl = new URL("/robots.txt", baseUrl).href;
const robotsResponse = await fetchWithRetry(robotsUrl);
const robotsText = await robotsResponse.text();
if (robotsResponse.status !== 200) throw new Error("robots.txt returned " + robotsResponse.status);

const checkRecords = unit.checks.map((check) => {
  const route = routeBySlug.get(check.routeSlug);
  if (!route) throw new Error("No public route for check " + check.id + " on " + check.routeSlug);
  return {
    id: check.id,
    route,
    answerKind: check.answerType,
    promptSha256: sha256(check.promptLatex),
    hintSha256: sha256(check.hintLatex),
    answerSha256: sha256(check.canonicalAnswer),
    feedbackSha256: sha256(check.workedFeedbackLatex),
    publicContractSha256: jsonHash({
      id: check.id,
      routeSlug: check.routeSlug,
      mode: check.mode,
      answerType: check.answerType,
      promptLatex: check.promptLatex,
      hintLatex: check.hintLatex,
      attemptRequiredBeforeReveal: check.attemptRequiredBeforeReveal,
    }),
    serverContractSha256: jsonHash({
      canonicalAnswer: check.canonicalAnswer,
      workedFeedbackLatex: check.workedFeedbackLatex,
    }),
    attemptRequiredBeforeReveal: check.attemptRequiredBeforeReveal,
  };
});

const semanticNodes = [];
const graphRoutes = new Map();
for (const page of unit.pages) {
  const route = importedRouteBySlug.get(page.sourceSlug);
  if (!route) throw new Error("No imported route for page " + page.sourceSlug);
  page.nodes.forEach((node, index) => {
    const id = page.sourceSlug + "#node-" + String(index + 1).padStart(5, "0");
    semanticNodes.push({
      id,
      route,
      sourceLocator: page.sourceFile + "#" + String(index + 1),
      type: node.type,
      contentSha256: jsonHash(node),
    });
    if (node.graphId) {
      if (!graphRoutes.has(node.graphId)) graphRoutes.set(node.graphId, new Set());
      graphRoutes.get(node.graphId).add(route);
    }
  });
}
const graphIds = [...graphRoutes.keys()].sort();
if (graphIds.length !== 13) throw new Error("Expected 13 graph IDs, observed " + graphIds.length);

const answerKeyRecords = answerKeys.keys.map((key) => {
  const route = limits.limitsUnitRoutes.find((candidate) => candidate.pageType === "answer-key" && candidate.path.includes("exam-" + key.exam.toLowerCase()))?.path;
  if (!route) throw new Error("No answer-key route for exam " + key.exam);
  return {
    route,
    exam: key.exam,
    answerCount: key.answers.length,
    answersSha256: jsonHash(key.answers),
  };
});

const assetDirectory = path.join(ROOT, "dist/client/assets");
const assetNames = (await readdir(assetDirectory)).filter((name) => name.endsWith(".js") || name.endsWith(".css")).sort();
const forbiddenTerms = ["canonicalAnswer", "workedFeedbackLatex", "acceptedVariants", "workedFeedback"];
const secretCorpus = [...new Set(unit.checks.flatMap((check) => [check.canonicalAnswer, check.workedFeedbackLatex]))];
const publicArtifactPaths = ["content/limits-continuity/unit-index.json", "content/limits-continuity/unit-checks-public.json"];
const publicArtifactTexts = await Promise.all(publicArtifactPaths.map((relative) => readFile(path.join(ROOT, relative), "utf8")));
const shortValuesExcluded = secretCorpus.filter((value) => value.length < 8).length;
const candidateSecrets = secretCorpus.filter((value) => value.length >= 8);
const publicCollisionValues = candidateSecrets.filter((secret) => {
  const escaped = JSON.stringify(secret).slice(1, -1);
  return publicArtifactTexts.some((text) => text.includes(secret) || text.includes(escaped));
});
const publicCollisions = new Set(publicCollisionValues);
const genericCollisionValues = candidateSecrets.filter((secret) => /^[+-]?infinity$/i.test(secret));
const genericCollisions = new Set(genericCollisionValues);
const distinctiveSecrets = candidateSecrets.filter((secret) => !publicCollisions.has(secret) && !genericCollisions.has(secret));
let forbiddenMatches = 0;
const clientAssets = [];
const scanTargets = [];
for (const name of assetNames) {
  const bytes = await readFile(path.join(assetDirectory, name));
  const text = bytes.toString("utf8");
  forbiddenMatches += forbiddenTerms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
  forbiddenMatches += distinctiveSecrets.reduce((count, secret) => {
    const escaped = JSON.stringify(secret).slice(1, -1);
    return count + (text.includes(secret) || text.includes(escaped) ? 1 : 0);
  }, 0);
  scanTargets.push("dist/client/assets/" + name);
  clientAssets.push({
    path: "dist/client/assets/" + name,
    bytes: bytes.length,
    gzipBytes: gzipSync(bytes).length,
    sha256: sha256(bytes),
  });
}
for (const [index, relative] of publicArtifactPaths.entries()) {
  const text = publicArtifactTexts[index];
  forbiddenMatches += forbiddenTerms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
  forbiddenMatches += distinctiveSecrets.reduce((count, secret) => {
    const escaped = JSON.stringify(secret).slice(1, -1);
    return count + (text.includes(secret) || text.includes(escaped) ? 1 : 0);
  }, 0);
  scanTargets.push(relative);
}
if (forbiddenMatches !== 0) throw new Error("Client answer leak scan found " + forbiddenMatches + " forbidden matches");

await mkdir(screenshotDirectory, { recursive: true });
const screenshotTargets = [
  { slug: "home", route: "/" },
  { slug: "limits-unit", route: "/subjects/math/calculus/limits-continuity/unit/" },
  { slug: "epsilon-delta-graph", route: "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/" },
  { slug: "exam-a-answer-key", route: "/subjects/math/calculus/limits-continuity/unit/limits/practice-exam-a/answer-key/" },
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];
const screenshots = [];
for (const target of screenshotTargets) {
  for (const viewport of viewports) {
    const fileName = target.slug + "-" + viewport.name + ".png";
    const destination = path.join(screenshotDirectory, fileName);
    const chromium = spawnSync("chromium", [
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-features=VizDisplayCompositor",
      "--hide-scrollbars",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=5000",
      "--window-size=" + viewport.width + "," + viewport.height,
      "--screenshot=" + destination,
      new URL(target.route, baseUrl).href,
    ], { encoding: "utf8", timeout: 60000 });
    if (chromium.status !== 0) throw new Error("Chromium failed for " + target.route + ": " + chromium.stderr);
    const bytes = await readFile(destination);
    screenshots.push({
      route: target.route,
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      path: path.relative(ROOT, destination),
      bytes: bytes.length,
      sha256: sha256(bytes),
    });
  }
}

const pdfBytes = await readFile(printPdf);
const printLogBytes = await readFile(printLog);
const printLogText = printLogBytes.toString("utf8");
const pages = Number(printLogText.match(/Output written on .+?\((\d+) pages?[,)]/)?.[1]);
if (!pages) throw new Error("Could not parse print page count");
const fatalPrintErrors = printLogText.split("\n").filter((line) => /^!|^error:/i.test(line.trim())).length;
if (fatalPrintErrors !== 0) throw new Error("Print log contains " + fatalPrintErrors + " fatal errors");
const printWarnings = [...new Set(printLogText.split("\n").filter((line) => /warning|overfull|underfull/i.test(line)).map((line) => line.trim()).filter(Boolean))];

const searchKindCounts = {};
for (const record of search.siteSearchRecords) searchKindCounts[record.kind] = (searchKindCounts[record.kind] || 0) + 1;
const searchRecords = search.siteSearchRecords.map((record) => ({
  id: record.id,
  kind: record.kind,
  path: record.path,
  priority: record.priority,
  contentSha256: jsonHash(record),
}));

const sourceTree = git("rev-parse", sourceCommit + "^{tree}");
const originMain = git("rev-parse", "origin/main");
if (sourceCommit !== originMain) throw new Error("Baseline commit " + sourceCommit + " differs from origin/main " + originMain);

const assetTotals = clientAssets.reduce((totals, asset) => ({
  bytes: totals.bytes + asset.bytes,
  gzipBytes: totals.gzipBytes + asset.gzipBytes,
}), { bytes: 0, gzipBytes: 0 });

const baseline = {
  schemaVersion: "1.0.0",
  capturedAt: new Date().toISOString(),
  productionBaseUrl: new URL("/", baseUrl).href,
  source: {
    commit: sourceCommit,
    tree: sourceTree,
    branch: canonicalBranch,
    originMain,
    clean: true,
    canonicalRepository,
    sourceInputsMatchCommit: true,
  },
  routes: {
    public: publicRecords,
    redirects: redirectRecords,
    notFound: { route: notFoundRoute, status: 404 },
  },
  limits: {
    routes: limits.limitsUnitRoutes.map((route) => route.path),
    importedRoutes: unit.routes.map((route) => route.path),
    coreSequence: limits.limitsUnitCoreRoutes.map((route) => route.path),
    supportSequence: limits.limitsUnitRoutes.filter((route) => !route.isCoreSequence).map((route) => route.path),
    checks: checkRecords,
    graphIds,
    graphs: graphIds.map((id) => ({ id, routes: [...graphRoutes.get(id)].sort() })),
    semanticNodes,
    answerKeyRoutes: answerKeyRecords,
  },
  discoverability: {
    registryCount: routing.registryRoutes.length,
    searchRecordCount: search.siteSearchRecords.length,
    searchKindCounts,
    searchRecords,
    sitemap: {
      url: sitemapUrl,
      status: sitemapResponse.status,
      count: sitemapLocations.length,
      sha256: sha256(sitemapText),
    },
    robotsTxt: {
      url: robotsUrl,
      status: robotsResponse.status,
      sha256: sha256(robotsText),
      sitemapDeclared: robotsText.includes(sitemapUrl),
    },
    analytics: observedAnalytics,
  },
  assets: {
    client: clientAssets,
    totals: assetTotals,
    answerLeakScan: {
      scannedFiles: scanTargets.length,
      forbiddenMatches,
      forbiddenTerms,
      secretValuesScanned: distinctiveSecrets.length,
      shortValuesExcluded,
      publicCollisionValuesExcluded: publicCollisionValues.length,
      genericCollisionValuesExcluded: genericCollisionValues.length,
      scannedTargets: scanTargets,
    },
  },
  print: {
    source: "content/limits-continuity/latex/main.tex",
    compiler: tectonicVersion,
    pages,
    pdfBytes: pdfBytes.length,
    pdfSha256: sha256(pdfBytes),
    logSha256: sha256(printLogBytes),
    fatalErrors: fatalPrintErrors,
    warnings: printWarnings,
  },
  screenshots,
  verification: {
    existingTestCount,
    existingTestsPassed: true,
    existingTestLogSha256: sha256(testLog),
    buildPagesPassed: true,
    buildLogSha256: sha256(buildLog),
    routeCount: publicRecords.length,
    limitsRouteCount: limits.limitsUnitRoutes.length,
    graphCount: graphIds.length,
    screenshotCount: screenshots.length,
  },
};

await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(baseline, null, 2) + "\n");
console.log(JSON.stringify({
  output: path.relative(ROOT, output),
  publicRoutes: publicRecords.length,
  redirects: redirectRecords.length,
  limitsRoutes: limits.limitsUnitRoutes.length,
  semanticNodes: semanticNodes.length,
  checks: checkRecords.length,
  graphs: graphIds.length,
  screenshots: screenshots.length,
  assets: clientAssets.length,
}, null, 2));
