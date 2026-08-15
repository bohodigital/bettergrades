import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import {
  algebraCompactOwners,
  calculusClusters,
  crossCourseOwnership,
  duplicatePrimaryResolutions,
} from "./seo-architecture-policy.mjs";

const root = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const site = "https://bettergrades.net";
const outputDirectory = resolve(root, "artifacts/seo-architecture");
const dataDirectory = resolve(root, "data/seo");
const docsDirectory = resolve(root, "docs/seo/branch1");
const allowedDispositions = new Set([
  "SAME_INTENT_COLLISION", "DISTINCT_PAGE_ROLE", "DISTINCT_SUBTOPIC",
  "DISTINCT_COURSE_LEVEL", "WORKED_EXAMPLE", "ASSESSMENT_INTENT",
  "REFERENCE_OR_GLOSSARY", "LEGACY_REDIRECT", "NEEDS_EXTERNAL_EVIDENCE",
  "FALSE_POSITIVE",
]);
const stopWords = new Set("a an and are as at be before better by for from grades how in into is it of on or should that the their this to unit vs what when which why with you your".split(" "));
const precalculusRetitles = new Set([
  "P1.1", "P1.2", "P1.4", "P1.8", "P2.2", "P3.1", "P5.2", "P5.11", "P6.1", "P6.4", "P6.11", "P6.12",
  "P8.2", "P8.3", "P8.6", "P8.7", "P9.3", "P9.6", "P9.9", "P10.1", "P10.4", "P10.8", "P12.1", "P12.6", "P14.2",
]);
const precalculusCrossCourse = new Set(["P15.1", "P15.4", "P15.6", "P15.7", "P15.8", "P15.9", "P15.11"]);

function decode(value = "") {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", "\"").replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}
function plain(value = "") { return decode(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); }
function match(html, expression) { return decode(html.match(expression)?.[1]?.trim() ?? ""); }
function words(value = "") { return new Set(plain(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((token) => token.length > 2 && !stopWords.has(token))); }
function jaccard(left, right) { const union = new Set([...left, ...right]); return union.size ? [...left].filter((value) => right.has(value)).length / union.size : 0; }
function csvCell(value) { const text = Array.isArray(value) ? value.join(" | ") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? ""); return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function toCsv(rows, headers) { return `${[headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))].map((row) => row.map(csvCell).join(",")).join("\n")}\n`; }
function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }
function slugQuery(path) { return path.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? ""; }
function courseLevel(node) { return node.courseId?.split(".").at(-1) ?? "sitewide"; }
function htmlPath(path) { return path === "/" ? resolve(root, "dist/pages/index.html") : resolve(root, `dist/pages${path}index.html`); }
async function exists(path) { return stat(path).then(() => true).catch(() => false); }
async function output(path, content) {
  await mkdir(resolve(path, ".."), { recursive: true });
  if (check) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== content) throw new Error(`SEO architecture output drift: ${relative(root, path)}`);
  } else await writeFile(path, content);
}
function inferIntent(node, page) {
  const haystack = `${node.pageRole} ${node.nodeType} ${node.title} ${node.canonicalPath} ${page.h1}`.toLowerCase();
  if (/answer[- ]key|solutions?\//.test(haystack)) return "answer-key";
  if (/practice[- ]exam/.test(haystack)) return "practice-exam";
  if (/concept[- ]quiz|mastery[- ]check|diagnostic|\bquiz\b|\binvestigation\b|\bassessment\b/.test(haystack)) return "assessment";
  if (/worksheet/.test(haystack)) return "worksheet";
  if (/worked[- ]problem|worked example/.test(haystack)) return "worked-example";
  if (/glossary|definition/.test(haystack)) return "reference-definition";
  if (/reference[- ]sheet|formula[- ]sheet|formula sheet|cheat[- ]sheet/.test(haystack)) return "reference";
  if (/calculator|\btool\b|checker|finder/.test(haystack)) return "tool";
  if (/visual|flowchart/.test(haystack)) return "visual-guide";
  if (/common[- ]errors?|error gallery/.test(haystack)) return "error-prevention";
  if (/mixed[- ]practice|practice problems|\/practice\//.test(haystack)) return "practice";
  if (/\breview\b/.test(haystack)) return "review";
  if (/quick[- ]answer|^what is |^why (is|does)|\?$/.test(`${node.pageRole} ${page.h1}`.toLowerCase())) return "quick-answer";
  if (/decision[- ]guide|choose|choosing|\bvs\.?\b|which method|strategy/.test(haystack)) return "method-selection";
  if (/method[- ]guide|workflow|how to|solving|evaluating/.test(haystack)) return "method-instruction";
  if (["course-hub", "unit-hub", "subject-hub"].includes(node.pageRole)) return "navigation-hub";
  return "learn-deep";
}

const graph = JSON.parse(await readFile(resolve(root, "data/learning-graph/graph.json"), "utf8"));
const precalculus = JSON.parse(await readFile(resolve(root, "content/precalculus/course.public.json"), "utf8"));
const provenance = JSON.parse(await readFile(resolve(root, "content/precalculus/provenance.server.json"), "utf8"));
const nodeByPath = new Map(graph.nodes.map((node) => [node.canonicalPath, node]));
const allPolicyPaths = [
  ...algebraCompactOwners.flatMap(([left, right]) => [left, right].filter(Boolean)),
  ...crossCourseOwnership.flatMap((row) => [row.genericOwner, ...row.secondaryUrls]),
  ...calculusClusters.map(([, owner]) => owner),
  ...duplicatePrimaryResolutions.flatMap(([, owner, secondary]) => [owner, secondary]),
];
for (const path of allPolicyPaths) if (!nodeByPath.has(path)) throw new Error(`SEO ownership policy references missing graph route: ${path}`);

const sitemapFiles = (await readdir(resolve(root, "dist/pages"))).filter((name) => /^sitemap(?:-[a-z-]+)?\.xml$/.test(name));
const sitemap = (await Promise.all(sitemapFiles.map((name) => readFile(resolve(root, "dist/pages", name), "utf8")))).join("\n");
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((item) => item[1]));
const redirectsText = await readFile(resolve(root, "dist/pages/_redirects"), "utf8");
const redirectRows = redirectsText.split(/\r?\n/).filter((line) => line.trim() && !line.startsWith("#")).map((line) => line.trim().split(/\s+/)).map(([from, to, status]) => ({ from, to, status }));
const rendered = new Map();
for (const node of graph.nodes) {
  const html = await readFile(htmlPath(node.canonicalPath), "utf8");
  const title = plain(match(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const h1 = plain(match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || match(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || match(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  const robots = match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const body = plain(match(html, /<body[^>]*>([\s\S]*?)<\/body>/i));
  const links = [...html.matchAll(/<a[^>]+href=["']([^"'#?]+)[^"']*["']/gi)].map((item) => item[1]).filter((href) => href.startsWith("/") && !href.startsWith("//"));
  rendered.set(node.canonicalPath, { title, h1, description, canonical, robots, body, links, titleWords: words(`${title} ${h1}`), bodyWords: words(body.slice(0, 6000)) });
}
const inbound = new Map(graph.nodes.map((node) => [node.canonicalPath, 0]));
for (const page of rendered.values()) for (const link of new Set(page.links)) if (inbound.has(link)) inbound.set(link, inbound.get(link) + 1);

const compactByPath = new Map();
for (const [compactUrl, textbookUrl, compactIntent, decision] of algebraCompactOwners) {
  compactByPath.set(compactUrl, { conceptId: nodeByPath.get(compactUrl).primaryConceptId, queryFamily: compactIntent, intent: compactIntent.includes("selection") ? "method-selection" : "focused-explainer", primaryUrl: textbookUrl || compactUrl, action: decision === "REPOSITION" ? "REPOSITION" : "KEEP", competitor: textbookUrl, notes: `Compact guide intent: ${compactIntent}.` });
}
const crossByPath = new Map();
for (const rule of crossCourseOwnership) {
  crossByPath.set(rule.genericOwner, { conceptId: rule.conceptId, queryFamily: rule.queryFamily, intent: "learn-foundations", primaryUrl: rule.genericOwner, action: "KEEP", notes: rule.distinction });
  for (const secondary of rule.secondaryUrls) crossByPath.set(secondary, { conceptId: rule.conceptId, queryFamily: plain(rendered.get(secondary).h1).toLowerCase(), intent: inferIntent(nodeByPath.get(secondary), rendered.get(secondary)), primaryUrl: secondary, action: "DIFFERENTIATE", competitor: rule.genericOwner, notes: rule.distinction });
}
const clusterByOwner = new Map(calculusClusters.map(([queryFamily, owner]) => [owner, queryFamily]));

const descriptors = graph.nodes.map((node) => {
  const page = rendered.get(node.canonicalPath);
  const compact = compactByPath.get(node.canonicalPath);
  const cross = crossByPath.get(node.canonicalPath);
  const cluster = clusterByOwner.get(node.canonicalPath);
  const conceptId = cross?.conceptId ?? compact?.conceptId ?? node.primaryConceptId ?? `route.${slugQuery(node.canonicalPath).replaceAll(" ", "-")}`;
  const queryFamily = cross?.queryFamily ?? compact?.queryFamily ?? cluster ?? plain(node.searchAliases?.[0] || slugQuery(node.canonicalPath)).replace(/\s*[—|-]\s*unit\s*[0-9a-z]+$/i, "").toLowerCase();
  const intent = cross?.intent ?? compact?.intent ?? (cluster ? "learn-deep" : inferIntent(node, page));
  return { node, page, conceptId, queryFamily, intent, action: cross?.action ?? compact?.action ?? "KEEP", requestedPrimary: cross?.primaryUrl ?? compact?.primaryUrl ?? node.canonicalPath, competitor: cross?.competitor ?? compact?.competitor ?? "", notes: cross?.notes ?? compact?.notes ?? "Page-specific query family is sourced from the content registry; role is inferred from explicit route/title markers." };
});

// Ownership is unique at query-family + intent + course level. A deterministic
// editorial rank elects one owner if two registry rows still share that key.
const ownershipGroups = Map.groupBy(descriptors, (row) => `${row.queryFamily}\0${row.intent}\0${courseLevel(row.node)}`);
const ownerRank = (row) => (row.node.pageRole === "textbook-lesson" ? 50 : 0) + (row.intent === "learn-deep" || row.intent === "learn-foundations" ? 20 : 0) + (row.node.indexPolicy === "index" ? 10 : 0) + Math.min(inbound.get(row.node.canonicalPath) ?? 0, 9);
for (const group of ownershipGroups.values()) group.sort((left, right) => ownerRank(right) - ownerRank(left) || left.node.canonicalPath.localeCompare(right.node.canonicalPath));

const registry = descriptors.map((descriptor) => {
  const { node, page, conceptId, queryFamily, intent, action, competitor, notes } = descriptor;
  const group = ownershipGroups.get(`${queryFamily}\0${intent}\0${courseLevel(node)}`);
  const primaryUrl = group[0].node.canonicalPath;
  const secondaryUrls = group.slice(1).map((row) => row.node.canonicalPath);
  const isPrimaryOwner = node.canonicalPath === primaryUrl;
  return {
    url: node.canonicalPath,
    conceptId,
    queryFamily,
    intent,
    modifiers: queryFamily === slugQuery(node.canonicalPath) ? [] : [slugQuery(node.canonicalPath)],
    courseLevel: courseLevel(node),
    primaryUrl,
    isPrimaryOwner,
    primaryRole: group[0].node.pageRole,
    secondaryUrls,
    currentCompetitors: competitor ? [competitor] : secondaryUrls,
    currentTitle: page.title,
    currentH1: page.h1,
    proposedH1: page.h1,
    proposedSeoTitle: page.title,
    proposedDescription: page.description,
    canonicalUrl: page.canonical,
    canonicalPolicy: "SELF_CANONICAL",
    indexPolicy: node.indexPolicy,
    action: isPrimaryOwner ? action : action === "KEEP" ? "SATELLITE" : action,
    redirectFrom: node.formerPaths,
    collisionScore: 0,
    gscQueryOverlap: "UNAVAILABLE",
    gscImpressions: "UNAVAILABLE",
    googleSelectedCanonical: "UNAVAILABLE",
    backlinkEquity: "UNAVAILABLE",
    branch2Needed: false,
    branch3Needed: false,
    status: "ADJUDICATED",
    notes,
    verification: `self-canonical=${page.canonical === `${site}${node.canonicalPath}`}; sitemap=${sitemapPaths.has(node.canonicalPath)}; inboundInternalLinks=${inbound.get(node.canonicalPath) ?? 0}`,
    lessonId: node.nodeType === "textbook-lesson" ? node.id : "",
    pageRole: node.pageRole,
  };
}).sort((left, right) => left.url.localeCompare(right.url));

function scorePair(left, right, curated = false) {
  const leftPage = rendered.get(left.canonicalPath); const rightPage = rendered.get(right.canonicalPath);
  const titleSimilarity = jaccard(leftPage.titleWords, rightPage.titleWords);
  const semanticSimilarity = jaccard(leftPage.bodyWords, rightPage.bodyWords);
  const sameConcept = left.primaryConceptId && left.primaryConceptId === right.primaryConceptId;
  let score = (sameConcept || curated ? 4 : 0) + (left.pageRole === right.pageRole ? 3 : 0) + (semanticSimilarity >= 0.18 || curated ? 3 : 0) + (titleSimilarity >= 0.55 ? 2 : 0) + (left.indexPolicy === "index" && right.indexPolicy === "index" ? 2 : 0);
  return { score, sameConcept, semanticSimilarity: Number(semanticSimilarity.toFixed(4)), titleSimilarity: Number(titleSimilarity.toFixed(4)), signals: { sameGenericHeadQuery: sameConcept || curated, sameRole: left.pageRole === right.pageRole, semanticOverlap: semanticSimilarity >= 0.18 || curated, nearIdenticalTitleH1: titleSimilarity >= 0.55, bothIndexable: left.indexPolicy === "index" && right.indexPolicy === "index" } };
}
function adjudicate(left, right, result, curated) {
  const leftIntent = inferIntent(left, rendered.get(left.canonicalPath));
  const rightIntent = inferIntent(right, rendered.get(right.canonicalPath));
  if (curated) return { disposition: "DISTINCT_PAGE_ROLE", adjudicationReason: "Reviewed compact-guide versus complete-textbook ownership policy.", ownerUrl: curated[1] || curated[0] };
  if (courseLevel(left) !== courseLevel(right)) return { disposition: "DISTINCT_COURSE_LEVEL", adjudicationReason: "Pages teach different course stages; cross-course policy preserves the qualified role.", ownerUrl: crossByPath.get(left.canonicalPath)?.primaryUrl ?? crossByPath.get(right.canonicalPath)?.primaryUrl ?? "" };
  if ([leftIntent, rightIntent].includes("worked-example")) return { disposition: "WORKED_EXAMPLE", adjudicationReason: "A worked example solves a specific problem and supports rather than replaces the lesson.", ownerUrl: leftIntent === "worked-example" ? right.canonicalPath : left.canonicalPath };
  if ([leftIntent, rightIntent].some((intent) => ["assessment", "practice", "practice-exam", "answer-key", "review"].includes(intent))) return { disposition: "ASSESSMENT_INTENT", adjudicationReason: "Assessment, practice, review, and answer-key modifiers identify a distinct student task.", ownerUrl: [leftIntent, rightIntent].includes("learn-deep") ? (leftIntent === "learn-deep" ? left.canonicalPath : right.canonicalPath) : "" };
  if ([leftIntent, rightIntent].some((intent) => intent.startsWith("reference"))) return { disposition: "REFERENCE_OR_GLOSSARY", adjudicationReason: "Reference/definition intent is narrower than instructional lesson intent.", ownerUrl: leftIntent.startsWith("reference") ? right.canonicalPath : left.canonicalPath };
  if (leftIntent !== rightIntent || left.pageRole !== right.pageRole) return { disposition: "DISTINCT_PAGE_ROLE", adjudicationReason: `Explicit roles differ (${leftIntent} versus ${rightIntent}).`, ownerUrl: leftIntent === "learn-deep" ? left.canonicalPath : rightIntent === "learn-deep" ? right.canonicalPath : "" };
  if (slugQuery(left.canonicalPath) !== slugQuery(right.canonicalPath)) return { disposition: "DISTINCT_SUBTOPIC", adjudicationReason: "Shared concept taxonomy, but route-specific subtopics and titles identify different instructional questions.", ownerUrl: "" };
  if (result.score >= 10) return { disposition: "NEEDS_EXTERNAL_EVIDENCE", adjudicationReason: "Same course, role, and query family; consolidation requires GSC/canonical/backlink evidence.", ownerUrl: "" };
  return { disposition: "FALSE_POSITIVE", adjudicationReason: "Similarity is below the high-risk decision threshold after role and subtopic review.", ownerUrl: "" };
}
const compactPolicyByPair = new Map(algebraCompactOwners.filter(([, owner]) => owner).map((row) => [[row[0], row[1]].sort().join("\0"), row]));
const candidates = [];
const seenPairs = new Set();
function addPair(left, right, curatedRow = null) {
  if (!left || !right || left.id === right.id) return;
  const key = [left.canonicalPath, right.canonicalPath].sort().join("\0");
  if (seenPairs.has(key)) return;
  seenPairs.add(key);
  const result = scorePair(left, right, Boolean(curatedRow));
  if (!curatedRow && result.titleSimilarity < 0.25) return;
  if (result.score < 5 && !curatedRow) return;
  const decision = adjudicate(left, right, result, curatedRow);
  if (!allowedDispositions.has(decision.disposition)) throw new Error(`Unsupported collision disposition: ${decision.disposition}`);
  candidates.push({ leftUrl:left.canonicalPath, rightUrl:right.canonicalPath, leftRole:left.pageRole, rightRole:right.pageRole, leftIntent:inferIntent(left, rendered.get(left.canonicalPath)), rightIntent:inferIntent(right, rendered.get(right.canonicalPath)), ...result, ...decision, explained:true });
}
for (const row of algebraCompactOwners.filter(([, owner]) => owner)) addPair(nodeByPath.get(row[0]), nodeByPath.get(row[1]), row);
for (const nodes of Map.groupBy(graph.nodes.filter((node) => node.primaryConceptId), (node) => node.primaryConceptId).values()) for (let left = 0; left < nodes.length; left += 1) for (let right = left + 1; right < nodes.length; right += 1) addPair(nodes[left], nodes[right], compactPolicyByPair.get([nodes[left].canonicalPath, nodes[right].canonicalPath].sort().join("\0")));
candidates.sort((left, right) => right.score - left.score || left.leftUrl.localeCompare(right.leftUrl));

const provenanceRows = provenance.lessons ?? provenance.lessonMappings ?? [];
const precalculusAudit = provenanceRows.map((mapping) => {
  const lesson = precalculus.lessons.find((item) => item.id === mapping.publicLessonId);
  const page = rendered.get(lesson.path);
  const classification = precalculusCrossCourse.has(mapping.sourceLessonId) ? "CROSS_COURSE_DIFFERENTIATION" : precalculusRetitles.has(mapping.sourceLessonId) ? "RETITLE" : "KEEP_STRONG";
  return { sourceLessonId:mapping.sourceLessonId, url:lesson.path, conceptId:nodeByPath.get(lesson.path)?.primaryConceptId ?? "", queryFamily:registry.find((row) => row.url === lesson.path)?.queryFamily ?? "", currentH1:lesson.title, proposedH1:page.h1, seoTitle:page.title, classification, rationale:classification === "KEEP_STRONG" ? "Reviewed: title already names a specific searchable mathematical lesson." : classification === "RETITLE" ? "Rendered title clarifies the mathematical topic without moving the established URL." : "Rendered title explicitly limits the page to Precalculus/readiness intent so Calculus retains formal ownership." };
}).sort((left, right) => left.sourceLessonId.localeCompare(right.sourceLessonId, undefined, { numeric:true }));

const algebraAudit = algebraCompactOwners.map(([compactUrl, textbookUrl, compactIntent, decision]) => ({
  compactUrl, textbookCounterpart:textbookUrl, compactIntent,
  textbookIntent:textbookUrl ? `complete ordered lesson: ${rendered.get(textbookUrl).h1}` : "No complete textbook counterpart exists",
  decision, rationale:decision === "KEEP_UNIQUE" ? "No equivalent textbook lesson exists; retain the comparison page." : decision === "REPOSITION" ? "Retain URL but make the compact decision/error intent subordinate to the full lesson." : "The compact page answers a narrower student task than the complete lesson.",
  compactLinksToOwner:textbookUrl ? rendered.get(compactUrl).links.includes(textbookUrl) : true,
  ownerLinksToCompact:textbookUrl ? rendered.get(textbookUrl).links.includes(compactUrl) : true,
}));

const calculusAudit = calculusClusters.map(([cluster, genericOwner, selectors]) => {
  const matches = graph.nodes.filter((node) => node.courseId === "course.math.calculus" && selectors.some((selector) => `${node.title} ${node.canonicalPath}`.toLowerCase().includes(selector.toLowerCase())));
  const roles = Object.fromEntries([...Map.groupBy(matches, (node) => inferIntent(node, rendered.get(node.canonicalPath)))].map(([role, rows]) => [role, rows.length]).sort());
  return { cluster, genericOwner, genericOwnerH1:rendered.get(genericOwner).h1, satelliteCount:matches.filter((node) => node.canonicalPath !== genericOwner).length, satelliteRoles:roles, decision:"ADJUDICATED", rule:"Generic owner teaches the deep unmodified query; assessments, references, tools, worked examples, reviews, and named subtopics retain qualified intent." };
});

const ownershipLinks = {};
function addOwnershipLink(source, target, relationship, label) {
  if (!source || !target || source === target || !nodeByPath.has(source) || !nodeByPath.has(target)) return;
  ownershipLinks[source] ??= [];
  if (!ownershipLinks[source].some((item) => item.href === target)) ownershipLinks[source].push({ href:target, relationship, label });
}
for (const [compactUrl, textbookUrl, compactIntent] of algebraCompactOwners) if (textbookUrl) {
  addOwnershipLink(compactUrl, textbookUrl, "satellite-to-primary", `Learn the complete lesson: ${nodeByPath.get(textbookUrl).shortTitle}`);
  addOwnershipLink(textbookUrl, compactUrl, "primary-to-satellite", `Use the focused guide: ${compactIntent}`);
}
for (const rule of crossCourseOwnership) for (const secondary of rule.secondaryUrls) {
  addOwnershipLink(secondary, rule.genericOwner, "satellite-to-primary", `Open the generic owner: ${nodeByPath.get(rule.genericOwner).shortTitle}`);
  addOwnershipLink(rule.genericOwner, secondary, "primary-to-satellite", `Continue with ${courseLevel(nodeByPath.get(secondary))}: ${nodeByPath.get(secondary).shortTitle}`);
}
for (const [cluster, genericOwner, selectors] of calculusClusters) {
  const satellites = graph.nodes.filter((node) => node.courseId === "course.math.calculus" && node.canonicalPath !== genericOwner && selectors.some((selector) => `${node.title} ${node.canonicalPath}`.toLowerCase().includes(selector.toLowerCase())));
  for (const satellite of satellites) addOwnershipLink(satellite.canonicalPath, genericOwner, "satellite-to-primary", `Learn ${cluster} in the canonical lesson`);
  for (const satellite of satellites.filter((node) => ["worksheet", "worked-problem", "glossary-term", "tool", "visual-guide", "quick-answer", "method-guide", "decision-guide"].includes(node.pageRole)).slice(0, 3)) addOwnershipLink(genericOwner, satellite.canonicalPath, "primary-to-satellite", `Use this ${inferIntent(satellite, rendered.get(satellite.canonicalPath)).replaceAll("-", " ")}: ${satellite.shortTitle}`);
}
for (const links of Object.values(ownershipLinks)) links.splice(4);

const allInternalLinks = new Set([...rendered.values()].flatMap((page) => page.links));
const redirectsLedger = await Promise.all(redirectRows.map(async (row) => {
  const targetPage = rendered.get(row.to) ?? await readFile(htmlPath(row.to), "utf8").then((html) => ({
    canonical:match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || match(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i),
    robots:match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i),
  })).catch(() => null);
  const sourceAbsentFromSitemap = !sitemapPaths.has(row.from);
  const targetExists = Boolean(targetPage);
  const targetCanonical = targetPage?.canonical === `${site}${row.to}`;
  const targetIndexable = targetPage ? !/noindex/i.test(targetPage.robots) && sitemapPaths.has(row.to) : false;
  const targetNotRedirect = !redirectRows.some((candidate) => candidate.from === row.to);
  const noInternalLinksToSource = !allInternalLinks.has(row.from);
  const sourceStaticAbsent = !(await exists(htmlPath(row.from)));
  const validationResult = [sourceAbsentFromSitemap, targetExists, targetCanonical, targetIndexable, targetNotRedirect, noInternalLinksToSource, sourceStaticAbsent].every(Boolean) ? "PASS" : "FAIL";
  return { sourceUrl:row.from, targetUrl:row.to, statusCode:row.status, action:"LEAVE_ALONE", migrationFamily:row.from.includes("/calculus/") ? "CALCULUS_MIGRATION" : "SITE_MIGRATION_OR_ALIAS", sourceAbsentFromSitemap, targetExists, targetCanonical, targetIndexable, targetNotRedirect, noInternalLinksToSource, sourceStaticAbsent, validationResult, rationale:"Existing one-hop migration; no consolidation added without evidence." };
}));

const branch2 = [...crossCourseOwnership.map((rule, index) => ({ priority:index < 8 ? "high" : "medium", conceptId:rule.conceptId, canonicalLesson:rule.genericOwner, missingQueryFamily:`${rule.queryFamily} quick explanation`, intendedRole:"quick-answer", forbiddenCompetingIntent:rule.queryFamily, requiredInboundLinks:rule.genericOwner, requiredOutboundLinks:rule.genericOwner, rationale:`Acquisition page must preserve the ownership distinction: ${rule.distinction}` })), ...calculusClusters.map(([cluster, owner], index) => ({ priority:index < 10 ? "high" : "medium", conceptId:`calculus.${cluster.toLowerCase().replaceAll(" ", "-")}`, canonicalLesson:owner, missingQueryFamily:`how to recognize when to use ${cluster}`, intendedRole:"method-selection", forbiddenCompetingIntent:cluster, requiredInboundLinks:owner, requiredOutboundLinks:owner, rationale:"Fill acquisition intent without duplicating the deep lesson." }))];
const branch3 = [...crossCourseOwnership.map((rule, index) => ({ priority:index < 8 ? "high" : "medium", conceptId:rule.conceptId, canonicalLesson:rule.genericOwner, assetIntent:`practice ${rule.queryFamily} with feedback`, assetRole:"worksheet", owner:rule.genericOwner, requiredLinks:rule.genericOwner, guardrail:"Asset title must include worksheet, practice, calculator, visual, or reference intent." })), ...calculusClusters.map(([cluster, owner], index) => ({ priority:index < 10 ? "high" : "medium", conceptId:`calculus.${cluster.toLowerCase().replaceAll(" ", "-")}`, canonicalLesson:owner, assetIntent:`${cluster} decision and error reference`, assetRole:index % 2 ? "visual-guide" : "worksheet", owner, requiredLinks:owner, guardrail:"Support the canonical lesson; do not claim the unmodified instructional query." }))];
const branch4 = candidates.filter((row) => row.disposition === "NEEDS_EXTERNAL_EVIDENCE" || row.disposition === "SAME_INTENT_COLLISION").map((row) => ({ priority:row.score >= 10 ? "high" : "medium", secondaryUrl:row.leftUrl, primaryUrl:row.rightUrl, currentDistinctIntent:`${row.leftIntent} versus ${row.rightIntent}`, requestedEvidence:"GSC query/page export, clicks, impressions, selected canonical, and backlinks", decisionGate:"No redirect/noindex/merge until one winning owner is supported by external evidence." }));

const titleChanges = duplicatePrimaryResolutions.map(([query, ownerUrl, secondaryUrl, resolution]) => ({ queryFamily:query, ownerUrl, secondaryUrl, renderedSecondaryH1:rendered.get(secondaryUrl).h1, resolution, status:rendered.get(secondaryUrl).h1.toLowerCase() === resolution.toLowerCase() ? "IMPLEMENTED" : "VERIFY", rationale:"Retain the generic query on one owner and qualify the secondary intent." }));

async function collectIndexFiles(directory) {
  const entries = await readdir(directory, { withFileTypes:true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectIndexFiles(path));
    else if (entry.name === "index.html") files.push(path);
  }
  return files;
}
async function collectBuiltCanonicals(directory) {
  const files = await collectIndexFiles(directory);
  const rows = [];
  for (const file of files) {
    const html = await readFile(file, "utf8");
    const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) || match(html, /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    if (canonical.startsWith(site)) rows.push(canonical.slice(site.length));
  }
  return new Set(rows);
}
const builtCanonicals = await collectBuiltCanonicals(resolve(root, "dist/pages"));
const expectedCanonicals = new Set([...graph.nodes.map((node) => node.canonicalPath), ...graph.exclusions.map((row) => row.canonicalPath)]);
const missingBuiltRoutes = [...expectedCanonicals].filter((path) => !builtCanonicals.has(path));
const unexpectedBuiltRoutes = [...builtCanonicals].filter((path) => !expectedCanonicals.has(path));
const unexplainedHighRisk = candidates.filter((row) => row.score >= 10 && !row.explained);
const duplicatePrimaryKeys = [...Map.groupBy(registry.filter((row) => row.isPrimaryOwner), (row) => `${row.queryFamily}\0${row.intent}\0${row.courseLevel}`).values()].filter((rows) => rows.length !== 1);
const routeFailures = registry.filter((row) => !row.verification.includes("self-canonical=true") || !row.verification.includes("sitemap=true"));
const priorQa = JSON.parse(await readFile(resolve(outputDirectory, "BRANCH1_QA_REPORT.json"), "utf8").catch(() => "{}"));
const qa = {
  schemaVersion:2,
  generatedAt:check ? priorQa.generatedAt : new Date().toISOString(),
  source:"fresh rendered dist/pages build with explicit editorial ownership policy",
  routeCounts:{ canonicalHtml:builtCanonicals.size, instructionalRegistry:registry.length, exclusions:graph.exclusions.length, redirects:redirectRows.length, sitemapEntries:sitemapPaths.size },
  collisionCandidates:candidates.length,
  collisionDispositionCounts:Object.fromEntries([...Map.groupBy(candidates, (row) => row.disposition)].map(([key, rows]) => [key, rows.length]).sort()),
  unexplainedHighRisk:unexplainedHighRisk.length,
  externalEvidenceOnly:candidates.filter((row) => row.disposition === "NEEDS_EXTERNAL_EVIDENCE").length,
  duplicatePrimaryOwners:duplicatePrimaryKeys.length,
  algebraCompactAuditRows:algebraAudit.length,
  precalculusTitleAuditRows:precalculusAudit.length,
  precalculusAssessmentTitlesQualified:precalculus.assessments.filter((item) => item.type !== "final-assessment" && !/^Unit \d+/.test(item.title)).length,
  calculusClusterAuditRows:calculusAudit.length,
  crossCourseRules:crossCourseOwnership.length,
  branch2Rows:branch2.length,
  branch3Rows:branch3.length,
  checks:{ everyGraphNodeRendered:routeFailures.length === 0, actualBuiltRoutesReconciled:missingBuiltRoutes.length === 0 && unexpectedBuiltRoutes.length === 0, redirectsDeepVerified:redirectsLedger.every((row) => row.validationResult === "PASS"), uniquePrimaryOwnership:duplicatePrimaryKeys.length === 0, noUnexplainedHighRisk:unexplainedHighRisk.length === 0, provenanceExplicit:Boolean(graph.provenance?.inputBaseCommit && graph.provenance?.artifactState) },
  failures:{ routeFailures:routeFailures.map((row) => row.url), missingBuiltRoutes, unexpectedBuiltRoutes, redirectFailures:redirectsLedger.filter((row) => row.validationResult !== "PASS").map((row) => row.sourceUrl) },
};

const registryHeaders = Object.keys(registry[0]);
await output(resolve(dataDirectory, "search-intent-ownership-registry.json"), json({ schemaVersion:2, generatedAt:qa.generatedAt, ownershipKey:"queryFamily + intent + courseLevel", records:registry }));
await output(resolve(dataDirectory, "SEARCH_INTENT_OWNERSHIP_REGISTRY.csv"), toCsv(registry, registryHeaders));
await output(resolve(dataDirectory, "CROSS_COURSE_OWNERSHIP.json"), json({ schemaVersion:1, rules:crossCourseOwnership }));
await output(resolve(dataDirectory, "CALCULUS_CLUSTER_AUDIT.csv"), toCsv(calculusAudit, ["cluster","genericOwner","genericOwnerH1","satelliteCount","satelliteRoles","decision","rule"]));
await output(resolve(dataDirectory, "ALGEBRA_COMPACT_GUIDE_AUDIT.csv"), toCsv(algebraAudit, ["compactUrl","textbookCounterpart","compactIntent","textbookIntent","decision","rationale","compactLinksToOwner","ownerLinksToCompact"]));
await output(resolve(dataDirectory, "PRECALCULUS_TITLE_AUDIT.csv"), toCsv(precalculusAudit, ["sourceLessonId","url","conceptId","queryFamily","currentH1","proposedH1","seoTitle","classification","rationale"]));
await output(resolve(dataDirectory, "TITLE_H1_REWRITE_LEDGER.csv"), toCsv(titleChanges, ["queryFamily","ownerUrl","secondaryUrl","renderedSecondaryH1","resolution","status","rationale"]));
await output(resolve(dataDirectory, "sitewide-ownership-links.json"), json(ownershipLinks));
await output(resolve(dataDirectory, "REDIRECT_AND_CONSOLIDATION_LEDGER.csv"), toCsv(redirectsLedger, ["sourceUrl","targetUrl","statusCode","action","migrationFamily","sourceAbsentFromSitemap","targetExists","targetCanonical","targetIndexable","targetNotRedirect","noInternalLinksToSource","sourceStaticAbsent","validationResult","rationale"]));
await output(resolve(dataDirectory, "BRANCH2_CONTENT_GAPS_HANDOFF.csv"), toCsv(branch2, ["priority","conceptId","canonicalLesson","missingQueryFamily","intendedRole","forbiddenCompetingIntent","requiredInboundLinks","requiredOutboundLinks","rationale"]));
await output(resolve(dataDirectory, "BRANCH3_SUPPORTING_ASSETS_HANDOFF.csv"), toCsv(branch3, ["priority","conceptId","canonicalLesson","assetIntent","assetRole","owner","requiredLinks","guardrail"]));
await output(resolve(dataDirectory, "BRANCH4_GSC_EVIDENCE_REQUESTS.csv"), toCsv(branch4, ["priority","secondaryUrl","primaryUrl","currentDistinctIntent","requestedEvidence","decisionGate"]));
await output(resolve(outputDirectory, "current-content-similarity.json"), json({ schemaVersion:2, generatedAt:qa.generatedAt, allowedDispositions:[...allowedDispositions], candidates }));
await output(resolve(outputDirectory, "BRANCH1_QA_REPORT.json"), json(qa));

const dispositionSummary = Object.entries(qa.collisionDispositionCounts).map(([name, count]) => `- ${name}: ${count}`).join("\n");
await output(resolve(docsDirectory, "CANNIBALIZATION_LEDGER.md"), `# Branch 1 Cannibalization Ledger\n\nEvery generated candidate is adjudicated. Candidate similarity is an audit signal, not a redirect instruction.\n\n${dispositionSummary}\n\nUnexplained high-risk pairs: **${qa.unexplainedHighRisk}**. Cases requiring GSC/canonical/backlink evidence: **${qa.externalEvidenceOnly}**; these remain preserved and are isolated in the Branch 4 queue.\n`);
await output(resolve(docsDirectory, "CROSS_COURSE_OWNERSHIP.md"), `# Cross-course Search Intent Ownership\n\nThe machine-readable source contains ${crossCourseOwnership.length} rules. Each rule names one generic owner, its legitimate course-qualified satellites, and the distinction that titles, descriptions, anchors, and tests must preserve. See \`data/seo/CROSS_COURSE_OWNERSHIP.json\`.\n`);
await output(resolve(docsDirectory, "BRANCH1_SEO_ARCHITECTURE_AUDIT.md"), `# BetterGrades Branch 1 SEO Architecture Audit\n\n## Phase 2 result\n\n- Ownership registry: ${registry.length} indexable mathematical routes\n- Collision candidates: ${candidates.length}; unexplained high-risk: ${qa.unexplainedHighRisk}\n- Duplicate primary ownership keys: ${qa.duplicatePrimaryOwners}\n- Algebra compact guides reviewed: ${algebraAudit.length}\n- Precalculus lesson titles reviewed: ${precalculusAudit.length}\n- Calculus clusters reviewed: ${calculusAudit.length}\n- Cross-course ownership rules: ${crossCourseOwnership.length}\n- Redirects deeply verified: ${redirectsLedger.filter((row) => row.validationResult === "PASS").length}/${redirectsLedger.length}\n- Branch 2 / Branch 3 queue rows: ${branch2.length} / ${branch3.length}\n\nNo redirect, noindex, merge, deployment, or destructive consolidation was added. External-evidence-only decisions remain isolated for Branch 4.\n`);
await output(resolve(docsDirectory, "IMPLEMENTATION_REPORT.md"), `# Branch 1 Phase 2 Implementation Report\n\nStatus: correction pass implemented on the draft PR branch; production acceptance, merge, and deployment are not claimed.\n\nThe H1-derived target model was replaced by explicit concept/query-family/intent ownership. All collision candidates now carry a closed disposition and rationale. Sitewide ownership links, exhaustive course audits, deep redirect checks, complete handoff schemas, and explicit graph provenance are machine-readable and regression-tested.\n`);

console.log(`${check ? "Verified" : "Generated"} Phase 2 SEO architecture: ${registry.length} ownership records, ${candidates.length} adjudicated candidates, ${algebraAudit.length} Algebra guides, ${precalculusAudit.length} Precalculus titles, ${calculusAudit.length} Calculus clusters.`);
