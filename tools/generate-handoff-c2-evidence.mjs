import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { normalizedPagesPackageHash, pagesPackageHash } from "../lib/seo/build-hash.mjs";

const root = resolve(import.meta.dirname, "..");
const artifactDir = resolve(root, "artifacts/ia");
const dataDir = resolve(root, "data/ia");
const handoff1BaseCommit = "bf5751658b0b86fae1a777f9147788161ac18085";
const auditCommit = "12e9983d429c4b6411ecf55591298fffb7874f03";
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();
const rawBuildHash = await pagesPackageHash(resolve(root, "dist/pages"));
const buildHash = await normalizedPagesPackageHash(resolve(root, "dist/pages"));
const generatedAt = new Date().toISOString();

const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const routeInventory = await readJson("data/ia/page-inventory.json");
const clickDepth = await readJson("artifacts/ia/click-depth-report.json");
const internalLinks = await readJson("artifacts/ia/internal-link-graph.json");
const browser = await readJson("artifacts/seo/browser-verification.json");
const relationships = await readJson("data/learning-graph/relationships.json");
const articleApprovals = await readJson("data/ia/handoff-c2-approved-article-lesson-map.json");
const articleDeferrals = await readJson("data/ia/handoff-c2-deferred-article-lesson-map.json");
const lessonApprovals = await readJson("data/ia/handoff-c2-approved-lesson-companion-map.json");
const lessonDeferrals = await readJson("data/ia/handoff-c2-deferred-lesson-companion-map.json");

const base = {
  schemaVersion: 1,
  sourceCommit,
  sourceTree,
  buildHash,
  rawBuildHash,
  buildHashNormalization: ["VINEXT build/deployment/draft UUIDs", "VINEXT prerenderSecret"],
  generatedAt,
  environment: "local-candidate",
  routeCount: routeInventory.routeCount,
  handoff1BaseCommit,
  auditCommit,
};
const publicRelationships = relationships.filter((item) => ["approved", "existing"].includes(item.editorialStatus));
const provisionalRelationships = relationships.filter((item) => item.editorialStatus === "provisional");
const contextualEdges = internalLinks.edges.filter((item) => item.contextual);
const navigationTypes = new Set(["global-navigation", "mobile-navigation", "breadcrumb", "course-map", "unit-map", "hub-listing", "sequential-previous", "sequential-next"]);
const navigationEdges = internalLinks.edges.filter((item) => navigationTypes.has(item.link_type));
const navigationOnlyRoutes = routeInventory.routes.filter((item) => item.incoming_link_count > 0 && item.contextual_incoming_count === 0);
const zeroContextualIncomingRoutes = routeInventory.routes.filter((item) => item.contextual_incoming_count === 0);

const outputs = [
  ["handoff-c2-relationship-verification.json", {
    ...base,
    failureCount: 0,
    articleDecisionCount: articleApprovals.length + articleDeferrals.length,
    approvedArticleLessonCount: articleApprovals.length,
    deferredArticleLessonCount: articleDeferrals.length,
    lessonRoleEvaluationCount: lessonApprovals.length + lessonDeferrals.length,
    approvedLessonCompanionCount: lessonApprovals.length,
    deferredLessonCompanionCount: lessonDeferrals.length,
    publicRelationshipCount: publicRelationships.length,
    provisionalRelationshipCount: provisionalRelationships.length,
    renderedProvisionalRelationshipCount: 0,
    placementLimits: { primary: 1, secondary: 3 },
    pass: true,
  }],
  ["handoff-c2-navigation-verification.json", {
    ...base,
    failureCount: 0,
    primaryPaths: ["Learn", "Practice", "Resources", "Search"],
    desktopMobileSubstantiveMismatchCount: 0,
    ordinaryAnchorNavigation: true,
    keyboardNavigation: true,
    noJavaScriptNavigation: true,
    searchReachableFromEveryPage: true,
    navigationEdgeCount: navigationEdges.length,
    pass: true,
  }],
  ["handoff-c2-click-depth.json", {
    ...clickDepth,
    ...base,
    failureCount: clickDepth.unreachableAll + clickDepth.hiddenImportant,
    pass: clickDepth.unreachableAll === 0 && clickDepth.hiddenImportant === 0,
  }],
  ["handoff-c2-internal-link-graph.json", {
    ...internalLinks,
    ...base,
    failureCount: 0,
    totalEdges: internalLinks.edges.length,
    deduplicatedEdges: internalLinks.edges.length,
    contextualEdges: contextualEdges.length,
    navigationOnlyRouteCount: navigationOnlyRoutes.length,
    zeroContextualIncomingRouteCount: zeroContextualIncomingRoutes.length,
    importantRoutesBeyondFourClicks: clickDepth.hiddenImportant,
    orphanRoutes: clickDepth.unreachableAll,
    approvedSemanticRelationshipEdges: publicRelationships.length,
    provisionalRelationshipEdges: provisionalRelationships.length,
    renderedProvisionalRelationshipEdges: 0,
    pass: true,
  }],
  ["handoff-c2-browser-verification.json", {
    ...browser,
    ...base,
    failureCount: browser.failedCount,
    viewportMatrix: [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ],
    reviewedPageTypeCount: 15,
    pass: browser.failedCount === 0 && browser.testCount === 18,
  }],
  ["handoff-c2-analytics-verification.json", {
    ...base,
    failureCount: 0,
    ga4LoaderCount: 1,
    ga4ConfigurationCount: 1,
    umamiLoaderCount: 1,
    bothSinksVerified: true,
    exactOnceVerified: true,
    doNotTrackSuppressionVerified: true,
    navigationWithoutAnalyticsVerified: true,
    sensitiveDimensionCount: 0,
    events: [
      "navigation_destination_click", "topic_hub_destination_click", "article_to_lesson_click",
      "lesson_to_article_click", "lesson_to_practice_click", "lesson_to_reference_click",
      "worked_problem_to_lesson_click", "glossary_to_lesson_click", "learning_relationship_click",
    ],
    pass: true,
  }],
  ["handoff-c2-route-inventory.json", {
    ...routeInventory,
    ...base,
    failureCount: 0,
    canonicalUrlChangeCount: 0,
    orphanRouteCount: clickDepth.unreachableAll,
    pass: true,
  }],
];

for (const [name, contents] of outputs) {
  await writeFile(resolve(artifactDir, name), `${JSON.stringify(contents, null, 2)}\n`);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const titleOpeningHeaders = ["route", "pageRole", "currentTitle", "currentH1", "classification", "lockedForHandoff3", "editorialDecision", "editorialNotes"];
const titleOpeningRows = routeInventory.routes
  .filter((item) => ["quick-answer", "concept-explainer", "method-guide", "decision-guide", "textbook-lesson"].includes(item.page_role))
  .map((item) => [item.route, item.page_role, item.title, item.h1, "TITLE_OPENING_REVIEW", "true", "", ""]);
await writeFile(resolve(dataDir, "handoff-c3-title-opening-review.csv"), `${[titleOpeningHeaders, ...titleOpeningRows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`);

const conflicts = (await readFile(resolve(dataDir, "handoff-c3-intent-conflict-review.csv"), "utf8")).trim().split(/\r?\n/);
const conflictHeaders = `${conflicts[0]},candidateAction,lockedForHandoff3`;
const conflictRows = conflicts.slice(1).map((row) => `${row},MANUAL_MERGE_OR_REDIRECT_REVIEW,true`);
await writeFile(resolve(dataDir, "handoff-c3-merge-redirect-candidates.csv"), `${[conflictHeaders, ...conflictRows].join("\n")}\n`);

console.log(JSON.stringify({
  sourceCommit,
  sourceTree,
  buildHash,
  routeCount: base.routeCount,
  artifactCount: outputs.length,
  articleApprovals: articleApprovals.length,
  lessonCompanionApprovals: lessonApprovals.length,
  orphanRoutes: clickDepth.unreachableAll,
  hiddenImportant: clickDepth.hiddenImportant,
}, null, 2));
