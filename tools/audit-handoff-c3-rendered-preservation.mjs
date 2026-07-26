import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const baselinePages = resolve(process.argv[2] ?? "");
const candidatePages = resolve(root, "dist/pages");
const inventory = JSON.parse(await readFile(resolve(root, "data/ia/page-inventory.json"), "utf8"));
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();

if (!process.argv[2]) throw new Error("Usage: node tools/audit-handoff-c3-rendered-preservation.mjs BASELINE_PAGES_DIR");

const decode = (value) => value
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number(digits)));
const normalize = (value) => decode(value).replace(/\s+/g, " ").trim();
const wordCount = (value) => normalize(value).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
const routeFile = (directory, route) => route === "/" ? resolve(directory, "index.html") : resolve(directory, route.slice(1), "index.html");

function segments(html) {
  const stack = [];
  const output = [];
  const tokens = html.match(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g) ?? [];
  for (const token of tokens) {
    if (token.startsWith("<!--") || token.startsWith("<!")) continue;
    if (token.startsWith("</")) {
      const tag = token.match(/^<\/\s*([^\s>]+)/)?.[1]?.toLowerCase();
      for (let index = stack.length - 1; index >= 0; index -= 1) {
        if (stack[index].tag === tag) { stack.splice(index); break; }
      }
      continue;
    }
    if (token.startsWith("<")) {
      const tag = token.match(/^<\s*([^\s/>]+)/)?.[1]?.toLowerCase();
      if (!tag) continue;
      const className = token.match(/\bclass=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find((value) => value !== undefined) ?? "";
      const entry = { tag, classes: className.split(/\s+/).filter(Boolean) };
      if (!/\/>\s*$/.test(token) && !["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"].includes(tag)) stack.push(entry);
      continue;
    }
    if (stack.some((entry) => ["script", "style", "annotation"].includes(entry.tag))) continue;
    const text = normalize(token);
    if (!text) continue;
    output.push({
      text,
      words: wordCount(text),
      inMain: stack.some((entry) => entry.tag === "main"),
      ancestors: stack.map((entry) => ({ tag: entry.tag, classes: entry.classes })),
      classes: [...new Set(stack.flatMap((entry) => entry.classes))],
    });
  }
  return output;
}

const protectedClasses = new Set([
  "limits-node",
  "latex-article-document",
  "resource-preview",
  "resource-solutions",
  "resource-explanation",
  "resource-notation",
  "finder-tool",
  "limits-visual-study",
  "calculus-assessment-set",
  "limits-check",
  "limits-exercise",
  "limits-answer-key",
]);
const allowedRemovedClasses = new Set([
  "calculus-unit-navigation",
  "limits-progress",
  "limits-editorial-intro",
  "limits-overview-header",
  "limits-overview-guides",
  "limits-overview-footer",
  "limits-overview-connection",
  "limits-reading-lens",
  "limits-unit-hero",
  "article-meta-line",
  "resource-meta",
  "resource-includes",
  "page-terms",
]);
const allowedDirectorySummaryClasses = new Set([
  "resource-card",
  "resource-library-card",
  "glossary-hero",
  "glossary-hub-list",
]);

function classification(segment) {
  if (segment.ancestors.some((entry) => entry.tag === "nav")) return "removed_repeated_navigation";
  if (segment.ancestors.some((entry) => entry.tag === "aside" && entry.classes.length === 0)) return "removed_repeated_navigation";
  if (
    segment.text === "Printable preview"
    && segment.classes.includes("resource-preview")
  ) return "removed_duplicate_metadata_or_generic_boilerplate";
  if (segment.classes.some((name) => allowedDirectorySummaryClasses.has(name))) {
    return "removed_duplicate_metadata_or_generic_boilerplate";
  }
  if (segment.classes.some((name) => allowedRemovedClasses.has(name))) return "removed_duplicate_metadata_or_generic_boilerplate";
  return null;
}

const routes = [];
const failures = [];
for (const record of inventory.routes) {
  const [baselineHtml, candidateHtml] = await Promise.all([
    readFile(routeFile(baselinePages, record.route), "utf8"),
    readFile(routeFile(candidatePages, record.route), "utf8"),
  ]);
  const baseline = segments(baselineHtml).filter((segment) => segment.inMain);
  const candidate = segments(candidateHtml);
  const candidateByText = new Map();
  for (const segment of candidate) {
    const locations = candidateByText.get(segment.text) ?? [];
    locations.push(segment.inMain ? "main" : "outside_main");
    candidateByText.set(segment.text, locations);
  }
  const counts = {
    baselineMainWords: baseline.reduce((sum, segment) => sum + segment.words, 0),
    preservedInMainWords: 0,
    movedOutsideMainWords: 0,
    deduplicatedOrMovedWords: 0,
    removedRepeatedNavigationWords: 0,
    removedDuplicateMetadataOrGenericBoilerplateWords: 0,
    unclassifiedRemovedWords: 0,
    protectedRemovedWords: 0,
  };
  const unclassified = [];
  const protectedMissing = [];
  for (const segment of baseline) {
    const retainedLocations = candidateByText.get(segment.text);
    if (retainedLocations?.length) {
      if (retainedLocations.includes("main")) counts.preservedInMainWords += segment.words;
      else counts.movedOutsideMainWords += segment.words;
      if (retainedLocations.length === 1 && baseline.filter((item) => item.text === segment.text).length > 1) counts.deduplicatedOrMovedWords += segment.words;
      continue;
    }
    const kind = classification(segment);
    const isProtected = segment.classes.some((name) => protectedClasses.has(name));
    if (isProtected) {
      if (kind === "removed_duplicate_metadata_or_generic_boilerplate") {
        counts.removedDuplicateMetadataOrGenericBoilerplateWords += segment.words;
        continue;
      }
      counts.protectedRemovedWords += segment.words;
      protectedMissing.push(segment.text);
      continue;
    }
    if (kind === "removed_repeated_navigation") counts.removedRepeatedNavigationWords += segment.words;
    else if (kind === "removed_duplicate_metadata_or_generic_boilerplate") counts.removedDuplicateMetadataOrGenericBoilerplateWords += segment.words;
    else {
      counts.unclassifiedRemovedWords += segment.words;
      unclassified.push({ text: segment.text, classes: segment.classes });
    }
  }
  const candidateGuidance = candidate.filter((segment) => segment.classes.includes("lesson-guidance") && segment.ancestors.some((entry) => entry.tag === "p"));
  const row = {
    route: record.route,
    pageRole: record.page_role,
    ...counts,
    candidateGuidanceParagraphCount: candidateGuidance.length,
    protectedMissing: protectedMissing.slice(0, 20),
    unclassified: unclassified.slice(0, 20),
    pass: counts.protectedRemovedWords === 0 && counts.unclassifiedRemovedWords === 0,
  };
  routes.push(row);
  if (!row.pass) failures.push(row);
}

const totals = Object.fromEntries(
  Object.keys(routes[0]).filter((key) => key.endsWith("Words")).map((key) => [key, routes.reduce((sum, route) => sum + route[key], 0)]),
);
const report = {
  schemaVersion: 1,
  baselineCommit: "61463a9d26fcf5fe8c4bc32658675b4b056dd8d8",
  sourceCommit,
  sourceTree,
  comparison: "rendered baseline main text segments versus rendered candidate body text segments",
  allowedClassifications: [
    "preserved in main",
    "moved outside main but retained",
    "deduplicated content retained at least once",
    "removed repeated navigation",
    "removed duplicate metadata or generic boilerplate",
  ],
  routeCount: routes.length,
  routesOverTwoPercentGrossReductionCount: routes.filter((route) => {
    const removed = route.removedRepeatedNavigationWords + route.removedDuplicateMetadataOrGenericBoilerplateWords;
    return route.baselineMainWords > 0 && removed / route.baselineMainWords > 0.02;
  }).length,
  ...totals,
  failureCount: failures.length,
  failures,
  routes,
  pass: failures.length === 0 && routes.length === 509,
};

await writeFile(resolve(root, "artifacts/ia/handoff-c3-rendered-content-diff.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ routeCount: report.routeCount, failureCount: report.failureCount, totals, pass: report.pass }, null, 2));
if (!report.pass) process.exitCode = 1;
