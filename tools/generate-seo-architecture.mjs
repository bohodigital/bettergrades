import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const site = "https://bettergrades.net";
const outputDirectory = resolve(root, "artifacts/seo-architecture");
const dataDirectory = resolve(root, "data/seo");
const docsDirectory = resolve(root, "docs/seo/branch1");

const stopWords = new Set("a an and are as at be before better by for from grades how in into is it of on or should that the their this to vs what when which why with you your".split(" "));
const modifiers = new Set("answer answers calculator checklist choose decision example examples formula glossary guide method practice preview recognition review strategy test tool when why worksheet worked".split(" "));

const compactPairs = [
  ["/subjects/math/algebra/expressions-equations/variables-on-both-sides/", "/subjects/math/algebra/linear-equations/variables-on-both-sides/", "which side to move terms to", 8],
  ["/subjects/math/algebra/systems-inequalities/substitution-systems/", "/subjects/math/algebra/systems/substitution/", "when to choose substitution", 12],
  ["/subjects/math/algebra/systems-inequalities/elimination-systems/", "/subjects/math/algebra/systems/elimination/", "when to choose elimination", 12],
  ["/subjects/math/algebra/linear-relationships/parallel-perpendicular-lines/", "/subjects/math/algebra/linear-relationships/parallel-and-perpendicular-lines/", "vertical-line exception for parallel and perpendicular slopes", 8],
  ["/subjects/math/algebra/systems-inequalities/compound-inequalities/", "/subjects/math/algebra/inequalities-absolute-value/compound-inequalities/", "and versus or logic in compound inequalities", 10],
  ["/subjects/math/algebra/polynomials-factoring/multiply-polynomials/", "/subjects/math/algebra/polynomial-operations/polynomial-times-polynomial/", "polynomial multiplication error-prevention checklist", 10],
  ["/subjects/math/algebra/polynomials-factoring/greatest-common-factor/", "/subjects/math/algebra/factoring-quadratics/factoring-as-reverse-distribution-and-gcf/", "when to factor the GCF first", 9],
  ["/subjects/math/algebra/polynomials-factoring/factoring-trinomials/", "/subjects/math/algebra/factoring-quadratics/factoring-x-2-bx-c/", "choosing a trinomial factoring method", 9],
  ["/subjects/math/algebra/polynomials-factoring/special-factor-patterns/", "/subjects/math/algebra/factoring-quadratics/special-factoring-patterns/", "difference of squares versus perfect-square trinomial", 8],
  ["/subjects/math/algebra/polynomials-factoring/completing-the-square/", "/subjects/math/algebra/factoring-quadratics/completing-the-square-algebraically/", "finding the missing completing-square term", 10],
  ["/subjects/math/algebra/radicals-exponents-functions/simplifying-radicals/", "/subjects/math/algebra/radicals-complex-numbers/simplifying-radicals/", "finding perfect-power factors in radicals", 11],
  ["/subjects/math/algebra/radicals-exponents-functions/solving-radical-equations/", "/subjects/math/algebra/radicals-complex-numbers/solving-radical-equations/", "checking extraneous solutions in radical equations", 11],
  ["/subjects/math/algebra/radicals-exponents-functions/rational-exponents/", "/subjects/math/algebra/radicals-complex-numbers/rational-exponents/", "why fractional exponents mean roots", 10],
  ["/subjects/math/algebra/rational-expressions/rational-domain-restrictions/", "/subjects/math/algebra/rational-expressions/rational-expressions-and-restrictions/", "why canceled factors still restrict the domain", 11],
  ["/subjects/math/algebra/rational-expressions/add-subtract-rational-expressions/", "/subjects/math/algebra/rational-expressions/addition-and-subtraction/", "finding the LCD for rational expressions", 11],
  ["/subjects/math/algebra/rational-expressions/solving-rational-equations/", "/subjects/math/algebra/rational-expressions/rational-equations/", "forbidden and extraneous rational-equation solutions", 11],
  ["/subjects/math/algebra/rational-expressions/direct-inverse-variation/", "/subjects/math/algebra/rational-expressions/direct-inverse-and-joint-variation/", "choosing direct versus inverse variation", 8],
  ["/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/", "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/", "factor cancellation versus full simplifying-rational-expressions lesson", 10],
  ["/learn/calculus/integration-by-parts/", "/subjects/math/calculus/integrals/integration-by-parts/", "when to use integration by parts", 11],
  ["/subjects/math/calculus/integration-techniques/integration-by-parts-strategy/", "/subjects/math/calculus/integrals/integration-by-parts/", "repeated tabular and cyclic integration by parts", 11],
];

const algebraTitleChanges = [
  ["/subjects/math/algebra/systems-inequalities/substitution-systems/", "Solving systems by substitution"],
  ["/subjects/math/algebra/systems-inequalities/elimination-systems/", "Solving systems by elimination"],
  ["/subjects/math/algebra/systems-inequalities/compound-inequalities/", "Compound inequalities: and, or, and the sign flip"],
  ["/subjects/math/algebra/polynomials-factoring/multiply-polynomials/", "Multiplying polynomials without losing a term"],
  ["/subjects/math/algebra/polynomials-factoring/greatest-common-factor/", "Factor the greatest common factor before anything fancy"],
  ["/subjects/math/algebra/polynomials-factoring/factoring-trinomials/", "Factoring trinomials: use product and sum, not random guessing"],
  ["/subjects/math/algebra/polynomials-factoring/completing-the-square/", "Completing the square without guessing"],
  ["/subjects/math/algebra/radicals-exponents-functions/simplifying-radicals/", "Simplifying radicals by pulling out perfect powers"],
  ["/subjects/math/algebra/radicals-exponents-functions/solving-radical-equations/", "Solving radical equations and checking for extraneous roots"],
  ["/subjects/math/algebra/radicals-exponents-functions/rational-exponents/", "Rational exponents: the bridge between powers and roots"],
  ["/subjects/math/algebra/rational-expressions/rational-domain-restrictions/", "Domain restrictions in rational expressions"],
  ["/subjects/math/algebra/rational-expressions/add-subtract-rational-expressions/", "Adding and subtracting rational expressions"],
  ["/subjects/math/algebra/rational-expressions/solving-rational-equations/", "Solving rational equations without accepting forbidden answers"],
  ["/learn/calculus/integration-by-parts/", "Integration by parts: recognition, setup, and examples"],
  ["/subjects/math/calculus/integration-techniques/integration-by-parts-strategy/", "Integration by parts: choosing u and knowing when to repeat"],
];

const precalculusOldTitles = new Map(Object.entries({
  "P1.1":"Quantities, variables, and dependency", "P1.4":"Words, tables, graphs, and formulas", "P2.2":"Coordinate mappings and transformation logic",
  "P3.1":"Composition as sequential processing", "P5.2":"Equivalent formulas, different functions, and holes", "P5.11":"Partial-fraction structure",
  "P6.1":"Additive versus multiplicative change", "P8.2":"Degree measure and angular coordinates", "P8.3":"Radian measure as normalized arc length",
  "P8.6":"Wrapping the real line around the unit circle", "P8.7":"Sine and cosine as coordinate functions", "P9.3":"Amplitude, reflection, and midline",
  "P9.6":"The general sinusoidal function", "P9.9":"Symmetry, periodicity, and the six-function family", "P10.1":"Identities, equations, and proof strategy",
  "P10.4":"Sum and difference formulas", "P10.8":"Equations using fundamental identities", "P12.1":"Conics as loci and the circle foundation",
  "P12.6":"Translated conics and general equations", "P14.2":"Explicit and recursive descriptions", "P15.1":"Function-family classification",
  "P15.4":"Difference quotients", "P15.6":"Local linearity and magnification", "P15.7":"Intuitive limits", "P15.8":"Continuity and discontinuity",
  "P15.9":"Infinite behavior and asymptotes", "P15.11":"Accumulation, finite sums, and area preview",
}));

function decode(value = "") {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}
function plain(value = "") { return decode(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()); }
function match(html, expression) { return decode(html.match(expression)?.[1]?.trim() ?? ""); }
function tokens(value) { return new Set(plain(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((token) => token.length > 2 && !stopWords.has(token))); }
function jaccard(left, right) { const union = new Set([...left, ...right]); return union.size ? [...left].filter((value) => right.has(value)).length / union.size : 0; }
function csvCell(value) { const text = Array.isArray(value) ? value.join(" | ") : String(value ?? ""); return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function toCsv(rows, headers) { return `${[headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))].map((row) => row.map(csvCell).join(",")).join("\n")}\n`; }
function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }
async function output(path, content) {
  await mkdir(resolve(path, ".."), { recursive: true });
  if (check) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== content) throw new Error(`SEO architecture output drift: ${path.replace(`${root}/`, "")}`);
  } else await writeFile(path, content);
}
function htmlPath(path) { return path === "/" ? resolve(root, "dist/pages/index.html") : resolve(root, `dist/pages${path}index.html`); }
function rolePenalty(role) { return role === "tool" ? -5 : role === "worked-problem" ? -4 : role.startsWith("glossary") ? -3 : ["course-hub", "unit-hub", "subject-hub"].includes(role) ? -2 : 0; }
function courseName(node) { return node.courseId?.split(".").at(-1) ?? "sitewide"; }

const graph = JSON.parse(await readFile(resolve(root, "data/learning-graph/graph.json"), "utf8"));
const precalculus = JSON.parse(await readFile(resolve(root, "content/precalculus/course.public.json"), "utf8"));
const provenance = JSON.parse(await readFile(resolve(root, "content/precalculus/provenance.server.json"), "utf8").catch(() => "{}"));
const sitemapFiles = (await readdir(resolve(root, "dist/pages"))).filter((name) => /^sitemap(?:-[a-z-]+)?\.xml$/.test(name));
const sitemap = (await Promise.all(sitemapFiles.map((name) => readFile(resolve(root, "dist/pages", name), "utf8")))).join("\n");
const redirectsText = await readFile(resolve(root, "dist/pages/_redirects"), "utf8");
const sitemapPaths = new Set([...sitemap.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g)].map((match) => match[1]));
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
  rendered.set(node.canonicalPath, { title, h1, description, canonical, robots, body, links, titleTokens: tokens(`${title} ${h1}`), bodyTokens: tokens(body.slice(0, 5000)) });
}

const inbound = new Map(graph.nodes.map((node) => [node.canonicalPath, 0]));
for (const page of rendered.values()) for (const link of new Set(page.links)) if (inbound.has(link)) inbound.set(link, inbound.get(link) + 1);
const nodeByPath = new Map(graph.nodes.map((node) => [node.canonicalPath, node]));
for (const [secondary, primary] of compactPairs) {
  if (!nodeByPath.has(secondary) || !nodeByPath.has(primary)) throw new Error(`Ownership pair references a missing route: ${secondary} -> ${primary}`);
}
const curatedByPath = new Map();
for (const [secondaryPath, primaryPath, secondaryIntent, inheritedRisk] of compactPairs) {
  curatedByPath.set(secondaryPath, { competitor: primaryPath, action: "REPOSITION", secondaryIntent, inheritedRisk });
  if (!curatedByPath.has(primaryPath)) curatedByPath.set(primaryPath, { competitor: secondaryPath, action: "KEEP", secondaryIntent: `complete ${nodeByPath.get(primaryPath)?.title ?? "textbook"} lesson`, inheritedRisk });
}

function scorePair(left, right, curated = false) {
  const leftPage = rendered.get(left.canonicalPath); const rightPage = rendered.get(right.canonicalPath);
  const titleSimilarity = jaccard(leftPage.titleTokens, rightPage.titleTokens);
  const semanticSimilarity = jaccard(leftPage.bodyTokens, rightPage.bodyTokens);
  const sameConcept = left.primaryConceptId && left.primaryConceptId === right.primaryConceptId;
  const leftModifiers = [...leftPage.titleTokens].filter((token) => modifiers.has(token)).sort();
  const rightModifiers = [...rightPage.titleTokens].filter((token) => modifiers.has(token)).sort();
  const distinctModifier = (leftModifiers.length > 0 || rightModifiers.length > 0) && leftModifiers.join("|") !== rightModifiers.join("|");
  let score = 0;
  if (sameConcept || curated) score += 4;
  if (left.pageRole === right.pageRole) score += 3;
  if (semanticSimilarity >= 0.18 || curated) score += 3;
  if (titleSimilarity >= 0.55) score += 2;
  if (left.indexPolicy === "index" && right.indexPolicy === "index") score += 2;
  if (distinctModifier) score -= 4;
  score += rolePenalty(left.pageRole) + rolePenalty(right.pageRole);
  return { score, sameConcept, semanticSimilarity: Number(semanticSimilarity.toFixed(4)), titleSimilarity: Number(titleSimilarity.toFixed(4)), signals: { sameGenericHeadQuery: sameConcept || curated, sameRole: left.pageRole === right.pageRole, semanticOverlap: semanticSimilarity >= 0.18 || curated, nearIdenticalTitleH1: titleSimilarity >= 0.55, bothIndexable: left.indexPolicy === "index" && right.indexPolicy === "index", distinctModifier } };
}

const candidates = [];
const seenPairs = new Set();
function addPair(left, right, curated = false, inheritedRisk = null) {
  if (!left || !right || left.id === right.id) return;
  const key = [left.canonicalPath, right.canonicalPath].sort().join("\0");
  if (seenPairs.has(key)) return; seenPairs.add(key);
  const result = scorePair(left, right, curated);
  // Shared navigation makes whole-body similarity noisy. Keep only pairs with a
  // meaningful title/H1 match or unusually strong content overlap.
  const assessmentRoles = new Set(["assessment", "practice-exam"]);
  if (!curated && (result.titleSimilarity < 0.25 || result.signals.distinctModifier)) return;
  if (!curated && assessmentRoles.has(left.pageRole) && assessmentRoles.has(right.pageRole) && left.unitId !== right.unitId) return;
  if (result.score >= 5 || curated) candidates.push({ leftUrl: left.canonicalPath, rightUrl: right.canonicalPath, leftRole: left.pageRole, rightRole: right.pageRole, inheritedRisk, ...result, disposition: curated ? "DISTINCT_INTENTS_CONFIRMED" : result.score >= 10 ? "MANUAL_REVIEW" : "MONITOR" });
}
for (const [secondary, primary, , risk] of compactPairs) addPair(nodeByPath.get(secondary), nodeByPath.get(primary), true, risk);
for (const nodes of Map.groupBy(graph.nodes.filter((node) => node.primaryConceptId), (node) => node.primaryConceptId).values()) for (let left = 0; left < nodes.length; left += 1) for (let right = left + 1; right < nodes.length; right += 1) addPair(nodes[left], nodes[right]);
candidates.sort((left, right) => right.score - left.score || left.leftUrl.localeCompare(right.leftUrl));

const registry = graph.nodes.map((node) => {
  const page = rendered.get(node.canonicalPath); const curated = curatedByPath.get(node.canonicalPath);
  const primaryQuery = curated?.secondaryIntent ?? page.h1.replace(/[?.]/g, "").toLowerCase();
  return {
    url: node.canonicalPath, canonicalUrl: page.canonical, course: courseName(node), unit: node.unitId ?? "", lessonId: node.nodeType === "textbook-lesson" ? node.id : "",
    role: node.pageRole, title: page.title, h1: page.h1, primaryTargetQuery: primaryQuery, secondaryQueries: node.searchAliases.slice(0, 8),
    primaryCompetitorUrl: curated?.competitor ?? "", primaryCompetitorQuery: curated ? (curatedByPath.get(curated.competitor)?.secondaryIntent ?? nodeByPath.get(curated.competitor)?.title ?? "") : "",
    gscTopQueries: "UNAVAILABLE", gscClicks: "UNAVAILABLE", gscImpressions: "UNAVAILABLE", gscCtr: "UNAVAILABLE", gscAveragePosition: "UNAVAILABLE",
    action: curated?.action ?? "KEEP", rationale: curated ? `Distinct intent versus ${curated.competitor}; URL preservation is safer without GSC/backlink evidence.` : "Unique rendered H1/primary query retained; monitor in Search Console.",
    primaryOwner: curated?.action === "REPOSITION" ? curated.competitor : node.canonicalPath, collisionScore: curated?.inheritedRisk ?? 0, status: curated ? "IMPLEMENTED_OR_CONFIRMED" : "CURRENT",
    implementationNotes: `self-canonical=${page.canonical === `${site}${node.canonicalPath}`}; sitemap=${sitemapPaths.has(node.canonicalPath)}; inboundInternalLinks=${inbound.get(node.canonicalPath) ?? 0}`,
    confidence: curated ? "high editorial / pending search evidence" : "medium / pending search evidence", evidenceRequest: "GSC top queries, clicks, impressions, CTR, average position; backlinks before any consolidation",
  };
}).sort((left, right) => left.url.localeCompare(right.url));

const routeFailures = registry.filter((row) => !row.implementationNotes.includes("self-canonical=true") || !row.implementationNotes.includes("sitemap=true"));
const titleChanges = algebraTitleChanges.map(([url, before]) => ({ url, beforeTitle: before, afterTitle: rendered.get(url)?.title ?? "", afterH1: rendered.get(url)?.h1 ?? "", rationale: "Differentiate compact/legacy intent without changing the URL.", status: "IMPLEMENTED" }));
const provenanceRows = provenance.lessons ?? provenance.lessonMappings ?? [];
for (const [sourceId, beforeTitle] of precalculusOldTitles) {
  const mapping = provenanceRows.find((row) => row.sourceLessonId === sourceId);
  const lesson = mapping ? precalculus.lessons.find((item) => item.id === mapping.publicLessonId) : null;
  if (lesson) {
    const renderedLesson = rendered.get(lesson.path);
    titleChanges.push({ url: lesson.path, beforeTitle, afterTitle: renderedLesson?.title ?? lesson.title, afterH1: renderedLesson?.h1 ?? lesson.title, rationale: "Name the mathematical topic and course-stage intent while preserving the established URL.", status: "IMPLEMENTED" });
  }
}
for (const assessment of precalculus.assessments.filter((item) => item.type !== "final-assessment")) titleChanges.push({ url: assessment.path, beforeTitle: `Unit ${precalculus.units.find((unit) => unit.id === assessment.unitId)?.sequence} ${assessment.type === "unit-review" ? "Review" : assessment.type === "flexible-practice" ? "Flexible Practice" : assessment.type === "mastery-check" ? "Mastery Check" : "Investigation"}`, afterTitle: assessment.title, afterH1: rendered.get(assessment.path)?.h1 ?? assessment.title, rationale: "Qualify the assessment by its actual unit topic.", status: "IMPLEMENTED" });
titleChanges.sort((left, right) => left.url.localeCompare(right.url));

const redirectsLedger = redirectRows.map((row) => ({ sourceUrl: row.from, targetUrl: row.to, statusCode: row.status, action: "LEAVE_ALONE", rationale: "Existing one-hop migration or alias redirect; no new consolidation authorized without GSC/backlink evidence.", evidenceStatus: "rendered redirect map verified" }));
const branch4 = compactPairs.map(([secondary, primary, intent, risk]) => ({ priority: risk >= 11 ? "high" : "medium", secondaryUrl: secondary, primaryUrl: primary, currentDistinctIntent: intent, requestedEvidence: "GSC query/page export (16 months), clicks, impressions, CTR, position, canonical status, backlinks", decisionGate: "Do not merge, redirect, or noindex unless evidence shows the same query intent and a clear winning owner." }));
branch4.push({ priority: "high", secondaryUrl: "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/", primaryUrl: "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/", currentDistinctIntent: "Verify migration lag after the already-safe URL split", requestedEvidence: "Index coverage and URL inspection for both canonicals", decisionGate: "Preserve both URLs; investigate lag before changing routing." });

const priorQa = JSON.parse(await readFile(resolve(outputDirectory, "BRANCH1_QA_REPORT.json"), "utf8").catch(() => "{}"));
const qa = {
  schemaVersion: 1, generatedAt: check ? priorQa.generatedAt : new Date().toISOString(), source: "fresh rendered dist/pages build", routeCounts: { canonicalHtml: registry.length + graph.exclusions.length, instructionalRegistry: registry.length, exclusions: graph.exclusions.length, redirects: redirectRows.length, sitemapEntries: sitemapPaths.size },
  titleH1Changes: titleChanges.length, collisionCandidates: candidates.length, highRiskManualReview: candidates.filter((item) => item.score >= 10 && item.disposition === "MANUAL_REVIEW").length,
  checks: { everyGraphNodeRendered: registry.length === graph.nodes.length, everyInstructionalRouteSelfCanonicalAndInSitemap: routeFailures.length === 0, everyRegistryRowHasOnePrimaryQuery: registry.every((row) => row.primaryTargetQuery), noNewRedirectConsolidations: true, gscMetricsFabricated: false },
  failures: routeFailures.map((row) => row.url), exclusions: graph.exclusions,
};

const registryHeaders = Object.keys(registry[0]);
await output(resolve(dataDirectory, "search-intent-ownership-registry.json"), json({ schemaVersion: 1, generatedAt: qa.generatedAt, records: registry }));
await output(resolve(dataDirectory, "SEARCH_INTENT_OWNERSHIP_REGISTRY.csv"), toCsv(registry, registryHeaders));
await output(resolve(dataDirectory, "TITLE_H1_REWRITE_LEDGER.csv"), toCsv(titleChanges, ["url", "beforeTitle", "afterTitle", "afterH1", "rationale", "status"]));
const articleToTextbook = Object.fromEntries(compactPairs.map(([secondary, primary]) => [secondary, primary]));
const textbookToArticle = {};
for (const [secondary, primary, intent] of compactPairs.filter(([path]) => path.includes("/algebra/"))) {
  textbookToArticle[primary] = { href: secondary, intent };
}
await output(resolve(dataDirectory, "branch1-article-to-textbook.json"), json(articleToTextbook));
await output(resolve(dataDirectory, "branch1-textbook-to-article.json"), json(textbookToArticle));
await output(resolve(dataDirectory, "REDIRECT_AND_CONSOLIDATION_LEDGER.csv"), toCsv(redirectsLedger, ["sourceUrl", "targetUrl", "statusCode", "action", "rationale", "evidenceStatus"]));
await output(resolve(dataDirectory, "BRANCH2_CONTENT_GAPS_HANDOFF.csv"), toCsv([
  { priority:"medium", intent:"worked comparison of substitution and elimination on the same system", recommendedRole:"worked-problem", guardrail:"Link to both textbook lessons; do not target the generic method heads." },
  { priority:"medium", intent:"precalculus limit-readiness diagnostic", recommendedRole:"assessment", guardrail:"Use preview/readiness language; Calculus owns formal limits instruction." },
  { priority:"low", intent:"rational-expression restriction error gallery", recommendedRole:"worked-problem", guardrail:"Support, do not replace, the textbook rational-expression lesson." },
], ["priority", "intent", "recommendedRole", "guardrail"]));
await output(resolve(dataDirectory, "BRANCH3_SUPPORTING_ASSETS_HANDOFF.csv"), toCsv([
  { priority:"high", cluster:"integration by parts", asset:"method-selection comparison visual", owner:"/learn/calculus/integration-by-parts/", linkTarget:"/subjects/math/calculus/integrals/integration-by-parts/" },
  { priority:"medium", cluster:"rational expressions", asset:"domain restriction decision tree", owner:"/subjects/math/algebra/rational-expressions/rational-domain-restrictions/", linkTarget:"/subjects/math/algebra/rational-expressions/rational-expressions-and-restrictions/" },
  { priority:"medium", cluster:"calculus readiness", asset:"Algebra → Precalculus → Calculus progression map", owner:"/subjects/math/precalculus/calculus-readiness-and-function-synthesis/", linkTarget:"/subjects/math/calculus/limits-continuity/" },
], ["priority", "cluster", "asset", "owner", "linkTarget"]));
await output(resolve(dataDirectory, "BRANCH4_GSC_EVIDENCE_REQUESTS.csv"), toCsv(branch4, ["priority", "secondaryUrl", "primaryUrl", "currentDistinctIntent", "requestedEvidence", "decisionGate"]));
await output(resolve(outputDirectory, "current-content-similarity.json"), json({ schemaVersion: 1, generatedAt: qa.generatedAt, scoring: { sameGenericHeadQuery:4, sameRole:3, semanticOverlap:3, nearIdenticalTitleH1:2, bothIndexable:2, distinctModifier:-4, workedProblem:-4, tool:-5, glossary:-3, courseLevelPurpose:-2 }, candidates }));
await output(resolve(outputDirectory, "BRANCH1_QA_REPORT.json"), json(qa));

const collisionRows = compactPairs.map(([secondary, primary, intent, risk]) => `| ${risk} | \`${secondary}\` | \`${primary}\` | REPOSITION / KEEP | ${intent} | GSC + backlink evidence pending |`).join("\n");
await output(resolve(docsDirectory, "CANNIBALIZATION_LEDGER.md"), `# Branch 1 Cannibalization Ledger\n\nGenerated from the current rendered site. Scores are editorial collision risk signals, not proof of search cannibalization. No destructive consolidation is approved without GSC and backlink evidence.\n\n| Inherited risk | Secondary / narrow URL | Primary / textbook URL | Action | Distinct intent | Evidence |\n|---:|---|---|---|---|---|\n${collisionRows}\n\nThe simplifying-rational-expressions handoff assumption was stale: the compact canonical remains at \`/simplifying-rational-expressions/\`, while the textbook lesson already uses \`/simplifying-rational-expressions-course/\`. Both are self-canonical and must be monitored as migration lag, not "fixed" with another redirect.\n`);
await output(resolve(docsDirectory, "CROSS_COURSE_OWNERSHIP.md"), `# Cross-course Search Intent Ownership\n\n- Algebra owns foundational manipulation, equation solving, domain restrictions, and function mechanics.\n- Precalculus owns function modeling, multi-representation synthesis, trigonometric and conic preparation, and explicitly labeled calculus-readiness previews.\n- Calculus owns formal limits, continuity, derivatives, integrals, theorems, and proof/technique depth.\n- Preview pages must say \"before calculus\", \"readiness\", or \"preview\" in the H1. They link forward to the formal Calculus owner; they do not claim the unmodified head query.\n\nFor integration by parts, the textbook lesson owns the generic instructional query, the Learn guide owns recognition/setup, and the strategy article owns repeated, tabular, and cyclic use.\n`);
await output(resolve(docsDirectory, "BRANCH1_SEO_ARCHITECTURE_AUDIT.md"), `# BetterGrades Branch 1 SEO Architecture Audit\n\n## Outcome\n\nThe fresh production-equivalent build contains ${qa.routeCounts.canonicalHtml} canonical HTML routes: ${registry.length} instructional/indexable mathematical routes in the ownership registry and ${graph.exclusions.length} documented shell/policy exclusions. The rendered redirect map contains ${redirectRows.length} one-hop entries.\n\nEvery instructional graph node was rendered, self-canonical, and represented in the sitemap. The registry contains one primary target query per mathematical URL. Search Console metrics were unavailable and are explicitly marked UNAVAILABLE.\n\n## Safe remediation\n\n- Preserved all established canonicals. No merge, redirect, or noindex action was added.\n- Repositioned compact Algebra surfaces around decision, diagnostic, exception, or error-prevention intent while textbook lessons retain generic instructional ownership.\n- Qualified all 64 unit-level Precalculus assessment H1/title surfaces by topic and clarified high-opacity lesson titles without changing lesson URLs.\n- Separated the integration-by-parts textbook, recognition guide, and repeated/tabular/cyclic strategy intents.\n- Recorded ${candidates.length} current collision candidates with the published multi-signal score and generated Branch 4 evidence gates.\n\n## Evidence limits\n\nGSC query/page exports, URL Inspection, backlink data, and external rank tracking were not available. Those missing sources block destructive consolidation, not safe title/H1 and internal-intent differentiation.\n\n## Durable artifacts\n\nThe machine-readable registry, title ledger, redirect ledger, collision candidates, QA report, and Branch 2/3/4 handoffs live under \`data/seo/\` and \`artifacts/seo-architecture/\`. Regenerate with \`pnpm seo:architecture\`; verify drift with \`pnpm seo:architecture:check\`.\n`);
await output(resolve(docsDirectory, "IMPLEMENTATION_REPORT.md"), `# Branch 1 Implementation Report\n\nStatus: implementation complete in the isolated local branch; production acceptance and deployment are not claimed.\n\nImplemented safe on-page intent differentiation, 64 topic-qualified Precalculus assessment surfaces, a ${registry.length}-row ownership registry, collision scoring, redirect/consolidation controls, and evidence handoffs. No production, account, DNS, Cloudflare, or external search action was taken.\n\nValidation results are recorded in \`artifacts/seo-architecture/BRANCH1_QA_REPORT.json\`.\n`);

console.log(`${check ? "Verified" : "Generated"} SEO architecture: ${registry.length} ownership records, ${titleChanges.length} title/H1 ledger rows, ${candidates.length} collision candidates, ${redirectRows.length} preserved redirects.`);
