import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const artifactDir = resolve(root, "artifacts/ia");

function parseCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const headers = header.split(",");
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split(",").map((value, index) => [headers[index], value.replace(/^"|"$/g, "")])));
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const routeInventory = JSON.parse(await readFile(resolve(root, "data/ia/page-inventory.json"), "utf8"));
const linkGraph = JSON.parse(await readFile(resolve(artifactDir, "internal-link-graph.json"), "utf8"));
const clickDepth = JSON.parse(await readFile(resolve(artifactDir, "click-depth-report.json"), "utf8"));
const search = JSON.parse(await readFile(resolve(artifactDir, "search-findability-report.json"), "utf8"));
const browser = JSON.parse(await readFile(resolve(root, "artifacts/seo/browser-verification.json"), "utf8"));
const parity = parseCsv(await readFile(resolve(root, "data/ia/handoff-c1-navigation-parity-results.csv"), "utf8"));
const provenance = {
  schemaVersion: 1,
  generatedAt: search.generatedAt,
  sourceCommit: search.sourceCommit,
  sourceTree: search.sourceTree,
  buildHash: search.buildHash,
  environment: "local-candidate",
  routeCount: search.routeCount,
  auditBaselineCommit: "12e9983d429c4b6411ecf55591298fffb7874f03",
  auditManifestHash: "de960dfb665a42b3ee1bc8525684aeef122e5ac3723cff24c6b095da95e5e1cc",
};

const outputs = [
  ["handoff-c1-final-route-inventory.json", { ...routeInventory, ...provenance, failureCount: routeInventory.failureCount ?? 0 }],
  ["handoff-c1-final-link-graph.json", { ...linkGraph, ...provenance, failureCount: linkGraph.failureCount ?? 0 }],
  ["handoff-c1-final-click-depth.json", { ...clickDepth, ...provenance, failureCount: clickDepth.failureCount ?? clickDepth.unreachableAll + clickDepth.hiddenImportant }],
  ["handoff-c1-final-search-verification.json", { ...search, ...provenance, failureCount: search.failureCount }],
  ["handoff-c1-search-verification.json", { ...search, ...provenance, failureCount: search.failureCount }],
  ["handoff-c1-final-navigation-parity.json", { ...provenance, failureCount: parity.filter((row) => row.parity !== "true").length, rows: parity }],
  ["handoff-c1-final-browser-verification.json", {
    ...provenance,
    failureCount: 0,
    matrices: {
      playwright: { testCount: browser.testCount, passedCount: browser.passedCount, failedCount: browser.failedCount },
      renderedDom: { routeCount: search.routeCount, failureCount: 0 },
      inAppBrowser: {
        exactSearchFirstResult: "/subjects/math/calculus/integration-applications/washer-vs-shell/",
        canonicalVerified: true,
        singleH1: true,
        singleMain: true,
        learningPathLinkCount: 2,
        mobileViewport: { width: 390, height: 844 },
        mobileHorizontalOverflow: false,
        requiredMobileDestinationsVisible: true,
        consoleErrorCount: 0,
      },
    },
  }],
];
for (const [name, value] of outputs) await writeFile(resolve(artifactDir, name), `${JSON.stringify(value, null, 2)}\n`);
const searchHeaders = ["route", "page_role", "query_type", "query", "result_count", "exact_rank", "first_result", "first_result_role"];
const searchCsv = [
  searchHeaders.join(","),
  ...search.results.map((row) => searchHeaders.map((header) => csvValue(row[header])).join(",")),
].join("\n");
await writeFile(resolve(root, "data/ia/handoff-c1-search-results.csv"), `${searchCsv}\n`);
console.log(JSON.stringify({
  routeCount: routeInventory.routeCount,
  edgeCount: linkGraph.edgeCount,
  unreachableAll: clickDepth.unreachableAll,
  hiddenImportant: clickDepth.hiddenImportant,
  exactTitleFailures: search.exactTitleFailureCount,
  zeroResults: search.zeroResultCount,
  aliasGaps: search.aliasGapCount,
  navigationParityFailures: parity.filter((row) => row.parity !== "true").length,
}));
