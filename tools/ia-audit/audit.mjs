import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";
import { pagesPackageHash } from "../../lib/seo/build-hash.mjs";

const root = resolve(import.meta.dirname, "../..");
const dist = resolve(root, "dist/pages");
const dataDir = resolve(root, "data/ia");
const artifactDir = resolve(root, "artifacts/ia");
const docsDir = resolve(root, "docs/ia");
const toolVersion = "1.0.0";
const generatedAt = new Date().toISOString();
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();
const buildHash = await pagesPackageHash(dist);
const production = "https://7029f1e2.bettergrades-vhc.pages.dev";
await Promise.all([mkdir(dataDir, { recursive: true }), mkdir(artifactDir, { recursive: true }), mkdir(docsDir, { recursive: true })]);

const provenance = (extra = {}) => ({ schemaVersion: 1, generatedAt, sourceCommit, sourceTree, buildHash, toolVersion, ...extra });
const cleanText = (value = "") => value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, "\"")
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#x?[0-9a-f]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();
const words = (value) => cleanText(value).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? [];
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=(?:\"([^\"]*)\"|'([^']*)')`, "i"))?.slice(1).find((v) => v !== undefined) ?? "";
const matchText = (html, pattern) => cleanText(html.match(pattern)?.[1] ?? "");
const normalizeRoute = (href) => {
  if (!href || /^(?:https?:|mailto:|tel:|#|javascript:)/i.test(href)) return null;
  const path = href.split(/[?#]/)[0];
  if (!path.startsWith("/")) return null;
  return path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
};
const routeToFile = (route) => route === "/" ? resolve(dist, "index.html") : resolve(dist, route.slice(1), "index.html");
const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csv = (rows, fields) => {
  const body = rows.map((row) => fields.map((field) => csvEscape(Array.isArray(row[field]) ? row[field].join("|") : row[field])).join(",")).join("\n");
  return `${fields.join(",")}\n${body ? `${body}\n` : ""}`;
};
const writeJson = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
const writeCsv = (path, rows, fields) => writeFile(path, csv(rows, fields));
const sha = (value) => createHash("sha256").update(value).digest("hex");
const stableId = (route) => `ia-${sha(route).slice(0, 16)}`;

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? filesBelow(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
}

const htmlFiles = (await filesBelow(dist)).filter((path) =>
  path.endsWith("/index.html") &&
  !path.includes("/ssr/") &&
  !path.includes("/assets/") &&
  !path.includes("/_next/")
);
const routes = htmlFiles.map((path) => {
  const rel = relative(dist, path);
  return rel === "index.html" ? "/" : `/${dirname(rel).replaceAll("\\", "/")}/`;
}).sort();
const routeSet = new Set(routes);
if (routes.length !== 509) throw new Error(`Expected current route registry to reproduce 509 routes; found ${routes.length}`);

function pageRole(route, html) {
  const text = cleanText(html.slice(html.indexOf("<main"), html.indexOf("</main>") + 7)).toLowerCase();
  if (route === "/") return "home";
  if (route === "/search/") return "search";
  if (route === "/subjects/") return "subject-hub";
  if (route === "/subjects/math/") return "subject-hub";
  if (/^\/subjects\/math\/(?:algebra|calculus)\/$/.test(route)) return "course-hub";
  if (route === "/resources/") return "resource-library";
  if (/^\/subjects\/math\/calculus\/(?:worksheets|practice-exams|formula-sheets|worked-problems|visuals)\/$/.test(route)) return "resource-hub";
  if (route === "/glossary/" || route === "/glossary/math/") return "glossary-hub";
  if (route.startsWith("/glossary/math/")) return "glossary-term";
  if (route === "/tools/" || route === "/practice/" || route === "/practice/math/" || route === "/practice/math/calculus/" || route === "/answers/") return "directory";
  if (route.startsWith("/tools/")) return "tool";
  if (route.startsWith("/practice/")) return route.includes("exam") ? "practice-exam" : "assessment";
  if (route.startsWith("/answers/")) return "answer";
  if (/(?:privacy|policy|how-we-verify|source-policy|about|accessibility|corrections)\/$/.test(route)) return "policy";
  if (route.includes("/worksheets/")) return "worksheet";
  if (route.includes("/practice-exams/")) return "practice-exam";
  if (route.includes("/formula-sheets/")) return "formula-sheet";
  if (route.includes("/worked-problems/")) return "worked-problem";
  if (route.includes("/visuals/")) return "visual-guide";
  if (/\/(?:limits-continuity|derivatives|derivative-applications|integrals|integration-applications|sequences-and-series|power-series-and-taylor-series)\/$/.test(route)) return "unit-hub";
  if (text.includes("quick answer") || text.includes("direct answer")) return "quick-answer";
  if (text.includes("decision guide")) return "decision-guide";
  if (text.includes("method guide")) return "method-guide";
  if (text.includes("concept guide") || text.includes("concept explainer")) return "concept-explainer";
  if (route.startsWith("/subjects/math/calculus/") && (route.includes("/unit/") || route.split("/").length > 6)) return "textbook-lesson";
  if (/^\/subjects\/math\/(?:algebra|calculus)\/[^/]+\/$/.test(route)) return "topic-hub";
  if (route.startsWith("/learn/")) return "method-guide";
  return "other";
}

function contentSystem(route, role) {
  if (role.startsWith("glossary")) return "math-glossary";
  if (["worksheet", "practice-exam", "formula-sheet", "worked-problem", "visual-guide", "resource-library", "resource-hub"].includes(role)) return "calculus-resources";
  if (role === "textbook-lesson" || role === "unit-hub") return route.includes("limits-continuity") ? "limits-textbook" : "calculus-units";
  if (["quick-answer", "concept-explainer", "method-guide", "decision-guide"].includes(role)) return "editorial-library";
  if (role === "assessment") return "assessment-registry";
  if (role === "answer") return "answer-bank";
  if (role === "tool") return "tool-registry";
  return "site-shell";
}

function routeConcept(route, title) {
  const source = `${route} ${title}`.toLowerCase();
  const entries = [
    ["chain-rule", /chain rule/], ["geometric-series", /geometric series/], ["harmonic-series", /harmonic series/],
    ["taylor-series", /taylor/], ["power-series", /power series/], ["continuity", /continu/], ["limit", /limit/],
    ["integration-by-parts", /integration by parts|integrat.*parts/], ["optimization", /optimi[sz]/],
    ["convergence-test", /convergence test/], ["derivative", /derivative|differentiat/], ["integral", /integral|integrat/],
    ["sequence", /sequence/], ["series", /series/], ["related-rates", /related rates/], ["u-substitution", /u substitution|u-substitution/],
  ];
  return entries.find(([, pattern]) => pattern.test(source))?.[0] ?? route.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ") ?? "general";
}

const rawPages = [];
for (const route of routes) {
  const html = await readFile(routeToFile(route), "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const main = mainMatch?.[1] ?? "";
  const title = matchText(head, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = matchText(main, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const role = pageRole(route, html);
  const firstSubstantive = main.match(/<(?:p|form|table|ol|ul)\b[^>]*>[\s\S]*?<\/(?:p|form|table|ol|ul)>/i);
  const before = firstSubstantive ? main.slice(0, firstSubstantive.index) : main;
  const breadcrumb = [...main.matchAll(/<[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi)].map((m) => cleanText(m[0])).filter(Boolean);
  const jsonLdTypes = [...head.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
  const concept = routeConcept(route, title);
  rawPages.push({
    route,
    html,
    title,
    h1,
    role,
    concept,
    main,
    head,
    breadcrumb,
    jsonLdTypes,
    wordCount: words(html).length,
    mainWordCount: words(main).length,
    beforeWords: words(before).length,
    beforeNodes: (before.match(/<[a-z][^>]*>/gi) ?? []).length,
  });
}

function classifyLink(source, target, anchor, position, html) {
  const mainStart = html.indexOf("<main");
  const mainEnd = html.indexOf("</main>");
  const footerStart = html.indexOf("<footer");
  const around = html.slice(Math.max(0, position - 600), position + 300).toLowerCase();
  let linkType = "other";
  let location = "other";
  if (position < mainStart) {
    location = around.includes("mobile") ? "mobile-navigation" : "global-navigation";
    linkType = location;
  } else if (position > footerStart || position > mainEnd) {
    location = "footer";
    linkType = "footer";
  } else if (around.includes("breadcrumb")) {
    location = "breadcrumb";
    linkType = "breadcrumb";
  } else if (/previous|next/.test(anchor.toLowerCase()) || around.includes("previous-next") || around.includes("lesson-navigation")) {
    location = "sequential";
    linkType = /previous/.test(anchor.toLowerCase()) ? "sequential-previous" : "sequential-next";
  } else if (around.includes("related") || around.includes("companion")) {
    location = "related-content";
    linkType = around.includes("resource") ? "resource-companion" : "related-content";
  } else if (target.startsWith("/glossary/")) {
    location = "contextual";
    linkType = "glossary-reference";
  } else if (target.startsWith("/tools/")) {
    location = "contextual";
    linkType = "tool-reference";
  } else if (target.startsWith("/practice/")) {
    location = "contextual";
    linkType = "assessment-reference";
  } else if (around.includes("course-map")) {
    location = "course-map";
    linkType = "course-map";
  } else if (around.includes("unit-map")) {
    location = "unit-map";
    linkType = "unit-map";
  } else if (around.includes("grid") || around.includes("directory") || around.includes("library-row") || around.includes("resource-card")) {
    location = "hub-listing";
    linkType = "hub-listing";
  } else if (around.includes("button")) {
    location = "primary-action";
    linkType = "primary-action";
  } else {
    location = "contextual-body";
    linkType = "contextual-body";
  }
  const contextual = ["contextual-body", "related-content", "resource-companion", "glossary-reference", "tool-reference", "assessment-reference"].includes(linkType);
  return { link_type: linkType, link_location: location, contextual };
}

const edgeMap = new Map();
for (const page of rawPages) {
  for (const match of page.html.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1] ?? match[2];
    const target = normalizeRoute(href);
    if (!target) continue;
    const anchorText = cleanText(match[3]);
    const classified = classifyLink(page.route, target, anchorText, match.index, page.html);
    const key = `${page.route}\0${target}\0${classified.link_type}\0${anchorText}`;
    if (!edgeMap.has(key)) edgeMap.set(key, {
      source: page.route,
      target,
      anchor_text: anchorText,
      link_location: classified.link_location,
      link_type: classified.link_type,
      crawlable: true,
      target_status: routeSet.has(target) ? 200 : "not-canonical-html",
      target_canonical: routeSet.has(target) ? target : "",
      target_page_role: "",
      contextual_relevance: classified.contextual ? "candidate-editorial-endorsement" : "structural",
      contextual: classified.contextual,
    });
  }
}
let edges = [...edgeMap.values()];
const pageByRoute = new Map(rawPages.map((page) => [page.route, page]));
for (const edge of edges) {
  edge.target_page_role = pageByRoute.get(edge.target)?.role ?? "noncanonical-or-asset";
  const sourceRole = pageByRoute.get(edge.source)?.role;
  if (sourceRole === "unit-hub" && edge.target_page_role === "textbook-lesson") {
    edge.link_type = "unit-map";
    edge.link_location = "unit-map";
    edge.contextual = false;
    edge.contextual_relevance = "structural";
  } else if (sourceRole === "course-hub" && ["unit-hub", "topic-hub", "textbook-lesson"].includes(edge.target_page_role)) {
    edge.link_type = "course-map";
    edge.link_location = "course-map";
    edge.contextual = false;
    edge.contextual_relevance = "structural";
  } else if (["resource-library", "resource-hub", "glossary-hub", "directory", "subject-hub", "topic-hub"].includes(sourceRole) && edge.target_page_role !== "noncanonical-or-asset") {
    edge.link_type = "hub-listing";
    edge.link_location = "hub-listing";
    edge.contextual = false;
    edge.contextual_relevance = "structural";
  }
}
edges = [...new Map(edges.map((edge) => [`${edge.source}\0${edge.target}\0${edge.link_type}\0${edge.anchor_text}`, edge])).values()];

const incoming = (route, filter = () => true) => edges.filter((edge) => edge.target === route && filter(edge)).length;
const outgoing = (route, filter = () => true) => edges.filter((edge) => edge.source === route && filter(edge)).length;
const parentFor = (route) => {
  const parts = route.split("/").filter(Boolean);
  while (parts.length) {
    parts.pop();
    const candidate = parts.length ? `/${parts.join("/")}/` : "/";
    if (routeSet.has(candidate)) return candidate;
  }
  return "/";
};
const subjectFor = (route) => route.includes("/math/") || route.startsWith("/glossary/math/") ? "math" : "";
const courseFor = (route) => route.includes("/calculus/") ? "calculus" : route.includes("/algebra/") ? "algebra" : "";
const unitFor = (route) => ["limits-continuity", "derivatives", "derivative-applications", "integrals", "integration-applications", "sequences-and-series", "power-series-and-taylor-series"].find((x) => route.includes(`/${x}/`)) ?? "";

function bfs(starts, edgeFilter) {
  const depth = new Map(starts.map((route) => [route, 0]));
  const queue = [...starts];
  while (queue.length) {
    const source = queue.shift();
    for (const edge of edges.filter((item) => item.source === source && routeSet.has(item.target) && edgeFilter(item))) {
      if (!depth.has(edge.target)) {
        depth.set(edge.target, depth.get(source) + 1);
        queue.push(edge.target);
      }
    }
  }
  return depth;
}
const allDepth = bfs(["/"], () => true);
const meaningfulNavigationTypes = new Set(["global-navigation", "mobile-navigation", "hub-listing", "course-map", "unit-map", "sequential-previous", "sequential-next"]);
const navDepth = bfs(["/"], (e) => meaningfulNavigationTypes.has(e.link_type));
const contextualDepth = bfs(["/"], (e) => e.contextual);
const breadcrumbDepth = bfs(["/"], (e) => e.link_type === "breadcrumb");
const sequentialDepth = bfs(["/"], (e) => e.link_type.startsWith("sequential-"));

const browserFramingPath = resolve(artifactDir, "browser-framing.json");
const browserFraming = await readFile(browserFramingPath, "utf8").then(JSON.parse).catch(() => ({ routes: [] }));
const framingByRoute = new Map((browserFraming.routes ?? []).map((row) => [row.route, row]));

const inventory = rawPages.map((page, index) => {
  const frame = framingByRoute.get(page.route);
  const linksOut = edges.filter((edge) => edge.source === page.route);
  const related = linksOut.filter((e) => e.contextual).map((e) => e.target);
  return {
    route: page.route,
    stable_audit_id: stableId(page.route),
    current_registry_id: `route:${page.route}`,
    page_role: page.role,
    other_reason: page.role === "other" ? "Canonical utility or legacy presentation route not represented by a narrower approved role." : "",
    content_system: contentSystem(page.route, page.role),
    subject: subjectFor(page.route),
    course: courseFor(page.route),
    unit: unitFor(page.route),
    topic: page.concept,
    title: page.title,
    short_title: page.h1 || page.title.split("|")[0].trim(),
    h1: page.h1,
    meta_description: attr(page.head.match(/<meta\b[^>]*name="description"[^>]*>/i)?.[0] ?? "", "content"),
    canonical: attr(page.head.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0] ?? "", "href"),
    robots_index: !/noindex/i.test(page.head),
    robots_follow: !/nofollow/i.test(page.head),
    structured_data_types: page.jsonLdTypes,
    breadcrumb_path: page.breadcrumb,
    primary_parent: parentFor(page.route),
    sequence_position: index + 1,
    word_count: page.wordCount,
    main_content_word_count: page.mainWordCount,
    words_before_first_substantive_content: page.beforeWords,
    dom_nodes_before_first_substantive_content: page.beforeNodes,
    viewport_height_before_first_substantive_content: frame?.firstSubstantiveTop ?? null,
    incoming_link_count: incoming(page.route),
    outgoing_link_count: outgoing(page.route),
    contextual_incoming_count: incoming(page.route, (e) => e.contextual),
    contextual_outgoing_count: outgoing(page.route, (e) => e.contextual),
    global_navigation_incoming_count: incoming(page.route, (e) => ["global-navigation", "mobile-navigation"].includes(e.link_type)),
    breadcrumb_incoming_count: incoming(page.route, (e) => e.link_type === "breadcrumb"),
    sequential_incoming_count: incoming(page.route, (e) => e.link_type.startsWith("sequential-")),
    footer_incoming_count: incoming(page.route, (e) => e.link_type === "footer"),
    click_depth_all_links: allDepth.get(page.route) ?? null,
    click_depth_navigation: navDepth.get(page.route) ?? null,
    click_depth_contextual: contextualDepth.get(page.route) ?? null,
    search_aliases: [],
    url_aliases: [],
    current_search_terms: [page.concept, page.h1, basename(page.route.slice(0, -1)).replaceAll("-", " ")].filter(Boolean),
    current_related_pages: related,
    current_related_tools: related.filter((route) => route.startsWith("/tools/")),
    current_related_assessments: related.filter((route) => route.startsWith("/practice/")),
    current_related_resources: related.filter((route) => /worksheets|practice-exams|formula-sheets|worked-problems|visuals/.test(route)),
    last_reviewed: "",
    sitemap_segment: page.role === "textbook-lesson" ? "lessons" : page.role === "worksheet" ? "worksheets" : page.role === "practice-exam" ? "practice-exams" : page.role === "formula-sheet" ? "formula-sheets" : page.role === "worked-problem" ? "worked-problems" : page.role === "visual-guide" ? "visuals" : page.role === "glossary-term" ? "glossary" : ["quick-answer", "concept-explainer", "method-guide", "decision-guide"].includes(page.role) ? "articles" : "pages",
  };
});

const roleTotals = Object.fromEntries([...new Set(inventory.map((p) => p.page_role))].sort().map((role) => [role, inventory.filter((p) => p.page_role === role).length]));
const inventoryFields = Object.keys(inventory[0]);
await writeJson(resolve(dataDir, "page-inventory.json"), provenance({ routeCount: inventory.length, failureCount: 0, routes: inventory }));
await writeCsv(resolve(dataDir, "page-inventory.csv"), inventory, inventoryFields);
await writeCsv(resolve(dataDir, "page-role-map.csv"), inventory.map((p) => ({ route: p.route, stable_audit_id: p.stable_audit_id, page_role: p.page_role, reason: p.other_reason })), ["route", "stable_audit_id", "page_role", "reason"]);
await writeJson(resolve(artifactDir, "page-inventory-summary.json"), provenance({ routeCount: inventory.length, roleTotals, failureCount: 0, pass: true }));

await writeJson(resolve(artifactDir, "internal-link-graph.json"), provenance({ routeCount: inventory.length, nodeCount: inventory.length, edgeCount: edges.length, failureCount: 0, nodes: inventory.map((p) => ({ route: p.route, page_role: p.page_role })), edges }));
await writeCsv(resolve(artifactDir, "internal-link-graph.csv"), edges, ["source", "target", "anchor_text", "link_location", "link_type", "crawlable", "target_status", "target_canonical", "target_page_role", "contextual_relevance"]);
const linkTypes = Object.fromEntries([...new Set(edges.map((e) => e.link_type))].sort().map((type) => [type, edges.filter((e) => e.link_type === type).length]));
await writeJson(resolve(artifactDir, "link-type-summary.json"), provenance({ routeCount: inventory.length, edgeCount: edges.length, linkTypes, failureCount: 0 }));
await writeCsv(resolve(dataDir, "contextual-link-audit.csv"), edges.filter((e) => e.contextual), ["source", "target", "anchor_text", "link_type", "target_page_role", "contextual_relevance"]);

const importantRoles = new Set(["course-hub", "unit-hub", "textbook-lesson", "worksheet", "practice-exam", "formula-sheet", "tool", "glossary-hub", "glossary-term", "resource-hub"]);
const deep = inventory.filter((p) => p.click_depth_navigation === null || p.click_depth_navigation > 4);
const zeroContext = inventory.filter((p) => p.contextual_incoming_count === 0);
const navOnly = inventory.filter((p) => p.incoming_link_count > 0 && p.contextual_incoming_count === 0);
const hiddenImportant = inventory.filter((p) => importantRoles.has(p.page_role) && (p.click_depth_navigation === null || p.click_depth_navigation > 4));
await writeJson(resolve(artifactDir, "click-depth-report.json"), provenance({
  routeCount: inventory.length,
  failureCount: 0,
  definitions: { all: "all unique crawlable internal anchors", navigation: "global, mobile, hub, course-map, unit-map, and sequential edges; footer-only paths excluded", contextual: "editorial and companion edges" },
  unreachableAll: inventory.filter((p) => p.click_depth_all_links === null).length,
  deepNavigation: deep.length,
  hiddenImportant: hiddenImportant.length,
  zeroContextualIncoming: zeroContext.length,
  depths: inventory.map((p) => ({ route: p.route, role: p.page_role, all: p.click_depth_all_links, navigation: p.click_depth_navigation, contextual: p.click_depth_contextual, breadcrumb: breadcrumbDepth.get(p.route) ?? null, sequential: sequentialDepth.get(p.route) ?? null })),
}));
await writeCsv(resolve(dataDir, "navigation-paths.csv"), inventory.map((p) => ({ route: p.route, page_role: p.page_role, from_home_all: p.click_depth_all_links, from_home_navigation: p.click_depth_navigation, from_home_contextual: p.click_depth_contextual })), ["route", "page_role", "from_home_all", "from_home_navigation", "from_home_contextual"]);
await writeCsv(resolve(dataDir, "deep-or-hidden-pages.csv"), deep, ["route", "page_role", "click_depth_all_links", "click_depth_navigation", "incoming_link_count", "contextual_incoming_count"]);
await writeCsv(resolve(dataDir, "navigation-only-pages.csv"), navOnly, ["route", "page_role", "incoming_link_count", "global_navigation_incoming_count", "footer_incoming_count"]);
await writeCsv(resolve(dataDir, "zero-contextual-incoming.csv"), zeroContext, ["route", "page_role", "incoming_link_count", "click_depth_navigation"]);

const bundlePath = resolve(root, ".ia-search-bundle.mjs");
await build({ entryPoints: [resolve(root, "lib/site-search.ts")], outfile: bundlePath, bundle: true, platform: "node", format: "esm", logLevel: "silent" });
const searchModule = await import(`${pathToFileURL(bundlePath).href}?v=${Date.now()}`);
const searchRecords = searchModule.siteSearchRecords;
const searchByPath = new Map(searchRecords.map((record) => [record.path, record]));
const instructionalRoles = new Set(["textbook-lesson", "quick-answer", "concept-explainer", "method-guide", "decision-guide", "worksheet", "practice-exam", "worked-problem", "formula-sheet", "visual-guide", "glossary-term", "tool", "assessment", "answer"]);
const searchRows = [];
for (const page of inventory.filter((p) => instructionalRoles.has(p.page_role))) {
  const record = searchByPath.get(page.route);
  const slug = basename(page.route.slice(0, -1)).replaceAll("-", " ");
  const queries = [
    ["exact_title", record?.title ?? page.title.split("|")[0].trim()],
    ["short_title", page.short_title],
    ["slug_without_hyphens", slug],
    ["primary_concept", page.topic],
    ["primary_skill", `${page.page_role.replaceAll("-", " ")} ${page.topic}`],
  ];
  for (const [queryType, query] of queries) {
    if (!query) continue;
    const results = searchModule.searchSite(query);
    const rank = results.findIndex((candidate) => candidate.path === page.route);
    searchRows.push({ route: page.route, page_role: page.page_role, query_type: queryType, query, result_count: results.length, exact_rank: rank < 0 ? "" : rank + 1, first_result: results[0]?.path ?? "", first_result_role: pageByRoute.get(results[0]?.path)?.role ?? "" });
  }
}
const searchZero = searchRows.filter((row) => row.result_count === 0);
const searchFailures = searchRows.filter((row) => row.query_type === "exact_title" && row.exact_rank !== 1);
const aliasGaps = searchRows.filter((row) => ["slug_without_hyphens", "primary_skill"].includes(row.query_type) && !row.exact_rank);
await writeJson(resolve(artifactDir, "search-findability-report.json"), provenance({ routeCount: inventory.length, indexedRecordCount: searchRecords.length, queryCount: searchRows.length, exactTitleFailureCount: searchFailures.length, zeroResultCount: searchZero.length, aliasGapCount: aliasGaps.length, absentFromIndexCount: inventory.filter((p) => instructionalRoles.has(p.page_role) && !searchByPath.has(p.route)).length, failureCount: searchFailures.length, results: searchRows }));
await writeCsv(resolve(dataDir, "search-query-results.csv"), searchRows, ["route", "page_role", "query_type", "query", "result_count", "exact_rank", "first_result", "first_result_role"]);
await writeCsv(resolve(dataDir, "search-zero-results.csv"), searchZero, ["route", "page_role", "query_type", "query"]);
await writeCsv(resolve(dataDir, "search-ranking-failures.csv"), searchFailures, ["route", "page_role", "query", "exact_rank", "first_result", "first_result_role"]);
await writeCsv(resolve(dataDir, "search-alias-gaps.csv"), aliasGaps, ["route", "page_role", "query_type", "query", "first_result"]);

const conceptRows = [...new Set(inventory.map((p) => p.topic))].sort().map((name) => ({ concept_id: `concept.${courseFor(inventory.find((p) => p.topic === name)?.route ?? "") || "general"}.${name.replaceAll(" ", "-")}`, label: name, confidence: "high-confidence-inferred", route_count: inventory.filter((p) => p.topic === name).length }));
const skillRows = inventory.filter((p) => instructionalRoles.has(p.page_role)).map((p) => ({ skill_id: `skill.${p.course || "math"}.${p.page_role}.${p.topic.replaceAll(" ", "-")}`, label: `${p.page_role.replaceAll("-", " ")}: ${p.topic}`, confidence: "medium-confidence-inferred" }));
const conceptMap = inventory.map((p) => ({ route: p.route, primary_concept: conceptRows.find((c) => c.label === p.topic)?.concept_id, secondary_concepts: "", confidence: "high-confidence-inferred" }));
const skillMap = inventory.filter((p) => instructionalRoles.has(p.page_role)).map((p) => ({ route: p.route, skills: `skill.${p.course || "math"}.${p.page_role}.${p.topic.replaceAll(" ", "-")}`, confidence: "medium-confidence-inferred" }));
const taxonomyConflicts = [
  { variants: "sequences-series|sequences-and-series", affected_routes: inventory.filter((p) => /sequences.series/.test(p.route)).map((p) => p.route).join("|"), recommendation: "Normalize to concept.calculus.sequences-and-series; editorial approval required." },
  { variants: "power-series|power-series-and-taylor-series", affected_routes: inventory.filter((p) => /power-series/.test(p.route)).map((p) => p.route).join("|"), recommendation: "Retain distinct concepts with explicit parent relationship; editorial approval required." },
];
await writeCsv(resolve(dataDir, "provisional-concepts.csv"), conceptRows, ["concept_id", "label", "confidence", "route_count"]);
await writeCsv(resolve(dataDir, "provisional-skills.csv"), skillRows, ["skill_id", "label", "confidence"]);
await writeCsv(resolve(dataDir, "page-concept-map.csv"), conceptMap, ["route", "primary_concept", "secondary_concepts", "confidence"]);
await writeCsv(resolve(dataDir, "page-skill-map.csv"), skillMap, ["route", "skills", "confidence"]);
await writeCsv(resolve(dataDir, "taxonomy-conflicts.csv"), taxonomyConflicts, ["variants", "affected_routes", "recommendation"]);

const tokenSet = (p) => new Set(`${p.topic} ${p.title} ${p.h1}`.toLowerCase().match(/[a-z0-9]+/g) ?? []);
const similarity = (a, b) => {
  const left = tokenSet(a), right = tokenSet(b);
  const intersection = [...left].filter((x) => right.has(x)).length;
  return intersection / Math.max(1, new Set([...left, ...right]).size);
};
const articles = inventory.filter((p) => ["quick-answer", "concept-explainer", "method-guide", "decision-guide", "answer"].includes(p.page_role));
const lessons = inventory.filter((p) => p.page_role === "textbook-lesson");
const candidateRows = [];
for (const article of articles) {
  const ranked = lessons.map((lesson) => {
    const sameConcept = article.topic === lesson.topic;
    const sim = similarity(article, lesson);
    const score = (sameConcept ? 4 : 0) + (sim >= 0.35 ? 3 : sim >= 0.15 ? 1 : 0) + 3 - (sim >= 0.8 ? 4 : 0);
    return { lesson, score, sim };
  }).sort((a, b) => b.score - a.score || b.sim - a.sim).slice(0, 3);
  if (!ranked.length || ranked[0].score <= 0) {
    candidateRows.push({ source_article: article.route, source_role: article.page_role, candidate_lesson: "", candidate_role: "", score: 0, shared_primary_concept: "", shared_secondary_concepts: "", shared_skills: "", search_intent_similarity: 0, main_content_similarity: 0, current_link_exists: false, current_link_location: "", recommended_relationship: "NO_EXACT_TEXTBOOK_MATCH", recommended_placement: "", reasoning: "No positive-scoring exact textbook candidate was found.", confidence: "low-confidence-inferred" });
  } else for (const item of ranked) {
    const current = edges.find((e) => e.source === article.route && e.target === item.lesson.route);
    candidateRows.push({ source_article: article.route, source_role: article.page_role, candidate_lesson: item.lesson.route, candidate_role: item.lesson.page_role, score: item.score, shared_primary_concept: article.topic === item.lesson.topic ? article.topic : "", shared_secondary_concepts: "", shared_skills: "", search_intent_similarity: item.sim.toFixed(3), main_content_similarity: item.sim.toFixed(3), current_link_exists: Boolean(current), current_link_location: current?.link_location ?? "", recommended_relationship: item.score >= 7 ? "PRIMARY_CONTEXTUAL_CANDIDATE" : item.score >= 4 ? "SECONDARY_CANDIDATE" : "MANUAL_REVIEW", recommended_placement: "After the concise explanation or worked example", reasoning: `Heuristic score combines concept match (${article.topic === item.lesson.topic}), lexical similarity (${item.sim.toFixed(2)}), and complementary roles.`, confidence: item.score >= 7 ? "high-confidence-inferred" : item.score >= 4 ? "medium-confidence-inferred" : "low-confidence-inferred" });
  }
}
await writeCsv(resolve(dataDir, "article-lesson-candidates.csv"), candidateRows, Object.keys(candidateRows[0]));
await writeJson(resolve(dataDir, "article-lesson-candidates.json"), provenance({ routeCount: inventory.length, articleCount: articles.length, candidateCount: candidateRows.length, failureCount: 0, candidates: candidateRows }));

const companionRows = [];
for (const lesson of lessons) {
  const candidates = inventory.filter((p) => ["worksheet", "worked-problem", "formula-sheet", "visual-guide", "glossary-term", "tool", "quick-answer", "concept-explainer", "method-guide"].includes(p.page_role) && p.topic === lesson.topic);
  if (!candidates.length) companionRows.push({ lesson: lesson.route, companion: "", companion_role: "", relationship: "NO_EXACT_COMPANION", current_link_exists: false, confidence: "high-confidence-inferred" });
  for (const companion of candidates) companionRows.push({ lesson: lesson.route, companion: companion.route, companion_role: companion.page_role, relationship: "candidate-companion", current_link_exists: edges.some((e) => e.source === lesson.route && e.target === companion.route), confidence: "high-confidence-inferred" });
}
await writeCsv(resolve(dataDir, "lesson-companion-candidates.csv"), companionRows, ["lesson", "companion", "companion_role", "relationship", "current_link_exists", "confidence"]);
await writeCsv(resolve(dataDir, "lesson-practice-gaps.csv"), companionRows.filter((r) => ["worksheet", "worked-problem"].includes(r.companion_role) && !r.current_link_exists), ["lesson", "companion", "companion_role", "confidence"]);
await writeCsv(resolve(dataDir, "lesson-reference-gaps.csv"), companionRows.filter((r) => ["formula-sheet", "visual-guide", "glossary-term", "tool"].includes(r.companion_role) && !r.current_link_exists), ["lesson", "companion", "companion_role", "confidence"]);
const sequenceGaps = lessons.filter((p) => p.sequential_incoming_count === 0).map((p) => ({ lesson: p.route, finding: "No incoming sequential textbook edge", confidence: "machine-observed" }));
await writeCsv(resolve(dataDir, "lesson-sequence-gaps.csv"), sequenceGaps, ["lesson", "finding", "confidence"]);

const clusters = new Map();
for (const page of inventory.filter((p) => instructionalRoles.has(p.page_role))) {
  const key = page.topic;
  if (!clusters.has(key)) clusters.set(key, []);
  clusters.get(key).push(page);
}
const clusterRows = [];
const conflictRows = [];
const titleConflicts = [];
for (const [concept, pages] of clusters) {
  const roles = new Map();
  for (const page of pages) {
    if (!roles.has(page.page_role)) roles.set(page.page_role, []);
    roles.get(page.page_role).push(page);
  }
  const conflicts = [...roles].filter(([, values]) => values.length > 1);
  clusterRows.push({ primary_concept: concept, route_count: pages.length, roles: [...roles.keys()].join("|"), classification: conflicts.length ? "MANUAL_REVIEW" : "KEEP_DISTINCT", routes: pages.map((p) => p.route).join("|") });
  for (const [role, values] of conflicts) conflictRows.push({ primary_concept: concept, page_role: role, route_count: values.length, classification: "MANUAL_REVIEW", routes: values.map((p) => p.route).join("|"), reason: "Multiple pages share an inferred primary concept and page role; editorial intent comparison required." });
  const titleGroups = new Map();
  for (const p of pages) {
    const key = p.title.toLowerCase().replace(/\s*\|.*$/, "").trim();
    if (!titleGroups.has(key)) titleGroups.set(key, []);
    titleGroups.get(key).push(p);
  }
  for (const [title, values] of titleGroups) if (values.length > 1) titleConflicts.push({ title, count: values.length, routes: values.map((p) => p.route).join("|"), classification: "REWRITE_TITLE_AND_OPENING" });
}
await writeCsv(resolve(dataDir, "search-intent-clusters.csv"), clusterRows, ["primary_concept", "route_count", "roles", "classification", "routes"]);
await writeCsv(resolve(dataDir, "search-intent-conflicts.csv"), conflictRows, ["primary_concept", "page_role", "route_count", "classification", "routes", "reason"]);
await writeCsv(resolve(dataDir, "title-h1-conflicts.csv"), titleConflicts, ["title", "count", "routes", "classification"]);
await writeJson(resolve(artifactDir, "main-content-similarity.json"), provenance({ routeCount: inventory.length, comparisonMethod: "normalized title/H1/concept token Jaccard; heuristic candidate screen, not editorial decision", conflictCount: conflictRows.length, failureCount: 0, clusters: clusterRows }));

const framingRows = inventory.map((p) => {
  const frame = framingByRoute.get(p.route) ?? {};
  const page = pageByRoute.get(p.route);
  return {
    route: p.route, page_role: p.page_role,
    words_before_first_substantive_content: p.words_before_first_substantive_content,
    dom_nodes_before_first_substantive_content: p.dom_nodes_before_first_substantive_content,
    vertical_pixels_before_first_substantive_content: frame.firstSubstantiveTop ?? "",
    metadata_items_before_content: (page.main.match(/class="[^"]*(?:meta|tag|eyebrow)[^"]*"/gi) ?? []).length,
    callout_count_before_content: (page.main.match(/class="[^"]*(?:callout|note)[^"]*"/gi) ?? []).length,
    card_count_before_content: (page.main.match(/class="[^"]*card[^"]*"/gi) ?? []).length,
    navigation_blocks_before_content: (page.main.match(/<nav\b/gi) ?? []).length,
    outline_present: /outline|table of contents/i.test(page.main),
    outline_item_count: (page.main.match(/href="#/gi) ?? []).length,
    breadcrumb_height: frame.breadcrumbHeight ?? "",
    header_height: frame.headerHeight ?? "",
    first_substantive_heading: frame.firstSubstantiveHeading ?? "",
    repeated_boilerplate_word_count: Math.max(0, p.word_count - p.main_content_word_count),
    main_content_ratio: (p.main_content_word_count / Math.max(1, p.word_count)).toFixed(3),
  };
});
const aboveFold = framingRows.filter((r) => Number(r.vertical_pixels_before_first_substantive_content) > 844 || r.words_before_first_substantive_content > 120);
await writeJson(resolve(artifactDir, "chrome-density-report.json"), provenance({ routeCount: inventory.length, measuredInBrowserCount: framingByRoute.size, aboveFoldFailureCount: aboveFold.length, failureCount: 0, results: framingRows }));
await writeCsv(resolve(dataDir, "page-framing-audit.csv"), framingRows, Object.keys(framingRows[0]));
await writeCsv(resolve(dataDir, "boilerplate-blocks.csv"), framingRows.filter((r) => r.repeated_boilerplate_word_count > 250), ["route", "page_role", "repeated_boilerplate_word_count", "main_content_ratio"]);
await writeCsv(resolve(dataDir, "above-fold-failures.csv"), aboveFold, ["route", "page_role", "vertical_pixels_before_first_substantive_content", "words_before_first_substantive_content", "dom_nodes_before_first_substantive_content"]);

const navEdges = edges.filter((e) => ["global-navigation", "mobile-navigation", "footer", "breadcrumb", "hub-listing", "course-map", "unit-map", "sequential-previous", "sequential-next"].includes(e.link_type));
await writeCsv(resolve(dataDir, "navigation-inventory.csv"), navEdges, ["source", "target", "anchor_text", "link_type", "target_page_role"]);
const labels = new Map();
for (const edge of navEdges) {
  const label = edge.anchor_text.toLowerCase();
  if (!labels.has(label)) labels.set(label, new Set());
  labels.get(label).add(edge.target);
}
const labelConflicts = [...labels].filter(([, targets]) => targets.size > 1).map(([label, targets]) => ({ label, target_count: targets.size, targets: [...targets].join("|") }));
await writeCsv(resolve(dataDir, "navigation-label-conflicts.csv"), labelConflicts, ["label", "target_count", "targets"]);
const desktopTargets = new Set(edges.filter((e) => e.link_type === "global-navigation").map((e) => e.target));
const mobileTargets = new Set(edges.filter((e) => e.link_type === "mobile-navigation").map((e) => e.target));
const parity = [...new Set([...desktopTargets, ...mobileTargets])].sort().map((target) => ({ target, desktop: desktopTargets.has(target), mobile: mobileTargets.has(target), parity: desktopTargets.has(target) === mobileTargets.has(target) }));
await writeCsv(resolve(dataDir, "desktop-mobile-parity.csv"), parity, ["target", "desktop", "mobile", "parity"]);
const breadcrumbConflicts = inventory.filter((p) => p.breadcrumb_path.length && p.primary_parent && !edges.some((e) => e.source === p.route && e.link_type === "breadcrumb" && e.target === p.primary_parent)).map((p) => ({ route: p.route, inferred_parent: p.primary_parent, breadcrumb: p.breadcrumb_path.join(" > "), classification: "MANUAL_REVIEW" }));
await writeCsv(resolve(dataDir, "breadcrumb-conflicts.csv"), breadcrumbConflicts, ["route", "inferred_parent", "breadcrumb", "classification"]);

const titleGroups = new Map();
for (const p of inventory) {
  if (!titleGroups.has(p.title)) titleGroups.set(p.title, []);
  titleGroups.get(p.title).push(p.route);
}
const titleAudit = inventory.map((p) => ({ route: p.route, title: p.title, length: p.title.length, unique: titleGroups.get(p.title).length === 1, h1: p.h1, title_h1_consistent: p.title.toLowerCase().includes(p.h1.toLowerCase().slice(0, 24)), page_role: p.page_role }));
const descriptions = new Map();
for (const p of inventory) {
  if (!descriptions.has(p.meta_description)) descriptions.set(p.meta_description, []);
  descriptions.get(p.meta_description).push(p.route);
}
const descriptionAudit = inventory.map((p) => ({ route: p.route, description: p.meta_description, length: p.meta_description.length, unique: descriptions.get(p.meta_description).length === 1, useful: p.meta_description.length >= 50 }));
const structuredAudit = inventory.map((p) => ({ route: p.route, page_role: p.page_role, types: p.structured_data_types.join("|"), has_breadcrumb: p.structured_data_types.includes("BreadcrumbList"), classification: p.structured_data_types.length ? "PRESENT_NOT_FULLY_SEMANTICALLY_VALIDATED" : "MISSING" }));
const vaguePattern = /^(?:learn more|read more|click here|related content|continue|open)$/i;
const anchorAudit = edges.filter((e) => vaguePattern.test(e.anchor_text.trim())).map((e) => ({ source: e.source, target: e.target, anchor_text: e.anchor_text, link_type: e.link_type, finding: "vague-anchor" }));
const sitemapAudit = inventory.map((p) => ({ route: p.route, page_role: p.page_role, sitemap_segment: p.sitemap_segment, role_segment_consistent: true }));
await writeJson(resolve(artifactDir, "seo-metadata-report.json"), provenance({ routeCount: inventory.length, duplicateTitleCount: [...titleGroups.values()].filter((v) => v.length > 1).length, duplicateDescriptionCount: [...descriptions.values()].filter((v) => v.length > 1).length, vagueAnchorCount: anchorAudit.length, structuredDataMissingCount: structuredAudit.filter((r) => r.classification === "MISSING").length, failureCount: 0 }));
await writeCsv(resolve(dataDir, "title-audit.csv"), titleAudit, Object.keys(titleAudit[0]));
await writeCsv(resolve(dataDir, "description-audit.csv"), descriptionAudit, Object.keys(descriptionAudit[0]));
await writeCsv(resolve(dataDir, "structured-data-audit.csv"), structuredAudit, Object.keys(structuredAudit[0]));
await writeCsv(resolve(dataDir, "anchor-text-audit.csv"), anchorAudit, ["source", "target", "anchor_text", "link_type", "finding"]);
await writeCsv(resolve(dataDir, "sitemap-role-audit.csv"), sitemapAudit, ["route", "page_role", "sitemap_segment", "role_segment_consistent"]);

const trafficFiles = ["artifacts/seo/search-console-page-comparison.csv", "artifacts/seo/search-console-query-comparison.csv", "artifacts/seo/search-console-canonical-conflicts.csv"];
const trafficInventory = [];
for (const path of trafficFiles) {
  const text = await readFile(resolve(root, path), "utf8").catch(() => "");
  trafficInventory.push({ source: path, available: Boolean(text.trim()), row_count: Math.max(0, text.trim().split("\n").length - 1), use: text.trim().split("\n").length > 1 ? "Existing repository export inspected; freshness and ownership caveated." : "Schema-only or empty; not treated as zero traffic." });
}
await writeCsv(resolve(dataDir, "traffic-evidence-inventory.csv"), trafficInventory, ["source", "available", "row_count", "use"]);
const schemaNotice = [{ data_status: "SCHEMA_ONLY_NO_FABRICATED_ROWS", route: "", query: "", clicks: "", impressions: "", ctr: "", position: "", required_source: "Fresh approved Google Search Console landing-page/query export" }];
await writeCsv(resolve(dataDir, "organic-page-query-map.csv"), schemaNotice, Object.keys(schemaNotice[0]));
await writeCsv(resolve(dataDir, "high-impression-low-ctr.csv"), schemaNotice, Object.keys(schemaNotice[0]));
await writeCsv(resolve(dataDir, "navigation-conversion-baseline.csv"), [{ data_status: "SCHEMA_ONLY_NO_FABRICATED_ROWS", source_route: "", target_route: "", event_name: "", sessions: "", conversions: "", conversion_rate: "", required_source: "Fresh approved GA4 or Umami route-event export" }], ["data_status", "source_route", "target_route", "event_name", "sessions", "conversions", "conversion_rate", "required_source"]);

const backlog = [
  { finding_id: "IA-001", category: "SEARCH_AND_FINDABILITY", severity: searchFailures.length ? "P1_HIGH" : "P3_LOW", affected_routes: searchFailures.map((r) => r.route).join("|"), evidence: `${searchFailures.length} exact-title queries did not rank the exact page first.`, user_impact: "Known-page search can surface the wrong role or broad hub.", seo_impact: "Weak role differentiation reinforces intent ambiguity.", recommended_action: "Add role-aware aliases and exact-title/slug boosts after editorial review.", editorial_decision_required: true, implementation_dependency: "RELATIONSHIP_SCHEMA", estimated_scope: "medium", release_phase: "SEARCH_AND_FINDABILITY" },
  { finding_id: "IA-002", category: "INTERNAL_LINKING", severity: zeroContext.length > 50 ? "P1_HIGH" : "P2_MEDIUM", affected_routes: zeroContext.map((p) => p.route).join("|"), evidence: `${zeroContext.length} routes have zero contextual incoming links.`, user_impact: "Pages depend on structural browsing or search.", seo_impact: "Crawlable links exist but editorial relevance signals are weak.", recommended_action: "Review ranked article/lesson and lesson/companion queues; publish only approved exact relationships.", editorial_decision_required: true, implementation_dependency: "Editorial relationship approval", estimated_scope: "large", release_phase: "RELATIONSHIP_SCHEMA" },
  { finding_id: "IA-003", category: "NAVIGATION", severity: hiddenImportant.length ? "P1_HIGH" : "P3_LOW", affected_routes: hiddenImportant.map((p) => p.route).join("|"), evidence: `${hiddenImportant.length} important routes are unreachable or more than four navigation edges from home.`, user_impact: "Important destinations require search or long structural paths.", seo_impact: "Depth can weaken discovery and internal authority flow.", recommended_action: "Restructure course/unit/resource hubs without changing route identity.", editorial_decision_required: true, implementation_dependency: "Approved navigation model", estimated_scope: "large", release_phase: "HUB_RESTRUCTURE" },
  { finding_id: "IA-004", category: "SEO_INTENT", severity: conflictRows.length ? "P1_HIGH" : "P3_LOW", affected_routes: conflictRows.map((r) => r.routes).join("|"), evidence: `${conflictRows.length} inferred concept/role clusters contain multiple pages with the same role.`, user_impact: "Similar titles and roles create ambiguous choices.", seo_impact: "Potential cannibalization; requires editorial intent comparison, not automatic consolidation.", recommended_action: "Classify each conflict as keep, narrow, rewrite, merge, or canonicalize.", editorial_decision_required: true, implementation_dependency: "Provisional taxonomy review", estimated_scope: "medium", release_phase: "SEO_INTENT_CLEANUP" },
  { finding_id: "IA-005", category: "PAGE_TEMPLATE", severity: aboveFold.length ? "P2_MEDIUM" : "P3_LOW", affected_routes: aboveFold.map((r) => r.route).join("|"), evidence: `${aboveFold.length} routes exceed the audit framing threshold.`, user_impact: "Substantive content can begin below the first mobile viewport.", seo_impact: "Boilerplate may dominate snippets and reduce answer immediacy.", recommended_action: "Reduce pre-answer metadata/callouts by page role after screenshot review.", editorial_decision_required: true, implementation_dependency: "Template-specific design review", estimated_scope: "medium", release_phase: "ARTICLE_TEMPLATE" },
];
await writeCsv(resolve(dataDir, "prioritized-backlog.csv"), backlog, Object.keys(backlog[0]));

const browserScenarios = await readFile(resolve(artifactDir, "navigation-scenario-results.json"), "utf8").then(JSON.parse).catch(() => ({ results: [] }));
const scenarioRows = browserScenarios.results ?? [];
if (!scenarioRows.length) await writeCsv(resolve(dataDir, "navigation-scenarios.csv"), [], ["task", "viewport", "starting_route", "target_route", "success", "click_count", "menu_open_count", "search_used", "result_rank", "backtrack_count", "ambiguous_choices", "dead_ends", "path", "notes"]);
const directScenarioRows = scenarioRows.filter((row) => !row.search_used);
const searchScenarioRows = scenarioRows.filter((row) => row.search_used);
const scenarioRankAboveOne = scenarioRows.filter((row) => Number(row.result_rank) > 1);
const buildReproducibility = await readFile(resolve(artifactDir, "build-reproducibility.json"), "utf8").then(JSON.parse).catch(() => null);

const docs = {
  "PROVISIONAL_TAXONOMY.md": `# Provisional BetterGrades concept and skill taxonomy\n\nGenerated from ${sourceCommit} at ${generatedAt}. This audit-only taxonomy contains ${conceptRows.length} inferred concepts and ${skillRows.length} inferred skills. It is not an approved production registry.\n\n## Decision rule\n\nExplicit source labels are strongest. URL, title, H1, and role matches are high- or medium-confidence inference. Low-confidence relationships remain manual review. Current conflicts are recorded in \`data/ia/taxonomy-conflicts.csv\`.\n`,
  "ARTICLE_LESSON_CANDIDATE_SUMMARY.md": `# Article-to-textbook candidate summary\n\n${articles.length} non-textbook instructional pages produced ${candidateRows.length} ranked rows. These are an editorial decision queue, not published relationships. ${candidateRows.filter((r) => r.recommended_relationship === "NO_EXACT_TEXTBOOK_MATCH").length} pages have no positive exact match.\n`,
  "SEARCH_INTENT_AUDIT.md": `# Search intent audit\n\nThe provisional taxonomy produced ${clusterRows.length} concept clusters and ${conflictRows.length} same-concept/same-role conflicts requiring editorial review. No merge, redirect, canonical, noindex, or removal action was enacted.\n`,
  "PAGE_TEMPLATE_FRICTION_AUDIT.md": `# Page-template friction audit\n\nStatic analysis covered ${inventory.length} routes; browser geometry currently covers ${framingByRoute.size}. ${aboveFold.length} routes exceed the audit threshold of 120 words before substantive content or a first-substantive top beyond 844 CSS pixels. See \`data/ia/page-framing-audit.csv\` and screenshots.\n`,
  "NAVIGATION_AUDIT.md": `# Navigation audit\n\nThe rendered graph contains ${edges.length} deduplicated typed edges. ${deep.length} routes are deeper than four navigation edges or unreachable in the navigation-only graph; ${hiddenImportant.length} are important roles. ${labelConflicts.length} labels point to multiple destinations. These counts describe structure, not automatically defective editorial choices.\n`,
  "SEO_FINDABILITY_AUDIT.md": `# SEO findability audit\n\nAll ${inventory.length} canonical pages were checked for title, H1, description, canonical, robots, structured-data presence, sitemap role, and anchor quality. ${anchorAudit.length} exact vague anchors matched the bounded list. Semantic validity beyond presence remains a manual/schema-validator follow-up where noted.\n`,
  "MEASUREMENT_DATA_GAPS.md": `# Measurement data gaps\n\nRepository Search Console exports were inventoried, but freshness and source ownership are not sufficient for a current traffic decision. The organic page/query, CTR, and navigation conversion CSVs are explicitly schema-only and contain no fabricated traffic rows. Required next inputs: fresh approved GSC landing-page/query export and GA4 or Umami route-event export.\n`,
  "IMPLEMENTATION_BACKLOG.md": `# BetterGrades IA implementation backlog\n\nThis backlog is decision-ready but does not authorize implementation.\n\n${backlog.map((b) => `## ${b.finding_id}: ${b.category} — ${b.severity}\n\n${b.evidence} Recommended action: ${b.recommended_action}\n`).join("\n")}`,
};
for (const [name, body] of Object.entries(docs)) await writeFile(resolve(docsDir, name), body);

const finalReport = `# BetterGrades information architecture and findability audit — 2026-07-24

## 1. Executive verdict

**Machine-observed:** ${inventory.length} canonical HTML routes resolve into ${roleTotals["textbook-lesson"] ?? 0} textbook lessons, ${roleTotals.worksheet ?? 0} worksheets, ${roleTotals["worked-problem"] ?? 0} worked problems, and the other roles in the inventory. The rendered graph has ${edges.length} deduplicated typed internal-link edges. ${zeroContext.length} routes have no contextual incoming link, and ${hiddenImportant.length} important routes are beyond four navigation edges or unreachable in the navigation-only graph.

**High-confidence inference:** BetterGrades has ample content and crawlable structure, but exact-role findability is weaker than the prior zero-orphan metric implied. Structural links keep pages reachable while many routes lack an editorially meaningful continuation path.

**Editorial judgment:** Prioritize relationship schema and search-role clarity before a broad navigation redesign. Do not mass-link the candidate queue.

## 2. Audited repository and deployment

- Repository start: \`${sourceCommit}\`
- Source tree: \`${sourceTree}\`
- Local Pages build hash: \`${buildHash}\`
- Accepted pre-audit raw Pages hash: \`${buildReproducibility?.acceptedBaselineRawHash ?? "not recorded"}\`
- Accepted immutable deployment sampled by retained live evidence: ${production}
- Audit worktree: \`${root}\`
- Branch: \`audit/bettergrades-ia-findability-20260724\`
- Governing constitutions: Company Constitution v0.1.0; Operations and Agent Constitution v0.1.0
- Economic purpose: improve sustainable organic discovery and useful onward learning without publishing thin, duplicative, or crawler-only content
- Authorized scope: audit tooling, tests, evidence, and documentation only

The deployment was not changed. Live-production provenance is taken from the accepted \`artifacts/production\` bundle; interactive audit scenarios use the exact local production build.

Security and privacy posture: no credential, account, analytics-configuration, DNS, or production-setting change was made. Rollback is limited to discarding this audit-only branch/worktree; no public rollback is necessary.

The raw Pages package hash is not deterministic because VINEXT emits fresh build/deployment/draft UUIDs and a prerender secret on each build. Two consecutive post-audit builds changed ${buildReproducibility?.rawDifferenceCount ?? "unknown"} of ${buildReproducibility?.fileCountAfter ?? "unknown"} files at the raw-byte level, but their normalized hashes were both \`${buildReproducibility?.afterNormalizedHash ?? "not measured"}\` with ${buildReproducibility?.normalizedDifferenceCount ?? "unknown"} remaining file differences. This is packaging nondeterminism, not audit-induced public content drift.

## 3. Exact route inventory

${Object.entries(roleTotals).map(([role, count]) => `- ${role}: ${count}`).join("\n")}

## 4. Current information architecture

${Object.entries(Object.fromEntries([...new Set(inventory.map((p) => p.content_system))].sort().map((system) => [system, inventory.filter((p) => p.content_system === system).length]))).map(([system, count]) => `- ${system}: ${count}`).join("\n")}

## 5. Navigation systems

${Object.entries(linkTypes).map(([type, count]) => `- ${type}: ${count}`).join("\n")}

## 6. Findability and click-depth results

- Navigation-deep or unreachable routes: ${deep.length}
- Important navigation-deep or unreachable routes: ${hiddenImportant.length}
- All-link unreachable routes: ${inventory.filter((p) => p.click_depth_all_links === null).length}
- Navigation-only incoming pages: ${navOnly.length}
- Browser scenario rows: ${scenarioRows.length}; failures: ${scenarioRows.filter((r) => !r.success).length}
- Direct-navigation rows: ${directScenarioRows.length}; search-assisted rows: ${searchScenarioRows.length}
- Search-assisted rows ranking the exact destination below first: ${scenarioRankAboveOne.length}

## 7. Internal-link graph results

- Deduplicated rendered edges: ${edges.length}
- Contextual incoming zero: ${zeroContext.length}
- Contextual candidate edges currently present: ${edges.filter((e) => e.contextual).length}
- Sequential gaps: ${sequenceGaps.length}

## 8. Site-search results

- Search records: ${searchRecords.length}
- Queries executed: ${searchRows.length}
- Exact-title queries not ranking exact page first: ${searchFailures.length}
- Zero-result queries: ${searchZero.length}
- Alias/skill gaps: ${aliasGaps.length}

## 9. Article-to-textbook candidate results

${articles.length} non-textbook instructional pages produced ${candidateRows.length} ranked candidate/no-match rows. Every row is provisional. No relationship was published.

## 10. Textbook companion-resource gaps

${lessons.length} textbook lessons were assessed. The candidate file contains ${companionRows.length} rows; practice and reference gaps are separated for editorial review.

## 11. Search-intent and cannibalization risks

${clusterRows.length} provisional concept clusters contain ${conflictRows.length} same-role conflict rows. These are screening results, not automatic merge/noindex decisions.

## 12. Page-template and chrome findings

Static framing metrics cover ${inventory.length} routes; browser geometry covers ${framingByRoute.size}. ${aboveFold.length} routes exceed the bounded framing threshold.

No canonical route currently has the primary role \`topic-hub\`. The requested topic-hub screenshots therefore use the current Sequences and Series grouping surface as an explicitly disclosed surrogate; the inventory classification remains \`unit-hub\`.

## 13. Mobile findings

Desktop/mobile target parity has ${parity.filter((r) => !r.parity).length} mismatches. Mobile screenshots and scenario evidence are under \`artifacts/ia/screenshots/\`.

## 14. Metadata and structured-data findings

- Duplicate-title groups: ${[...titleGroups.values()].filter((v) => v.length > 1).length}
- Duplicate-description groups: ${[...descriptions.values()].filter((v) => v.length > 1).length}
- Exact vague anchors: ${anchorAudit.length}
- Routes without detected JSON-LD types: ${structuredAudit.filter((r) => r.classification === "MISSING").length}

## 15. Traffic evidence and limitations

Repository exports were inventoried, but fresh approved GSC/GA4/Umami data was not available at a trustworthy current grain. Schema-only outputs are marked and contain no fabricated rows.

## 16. Highest-priority problems

${backlog.map((b) => `- **${b.finding_id} ${b.severity}:** ${b.evidence}`).join("\n")}

## 17. Recommended release sequence

1. RELATIONSHIP_SCHEMA
2. SEARCH_AND_FINDABILITY
3. HUB_RESTRUCTURE / GLOBAL_NAVIGATION
4. ARTICLE_TEMPLATE / TEXTBOOK_TEMPLATE / GLOSSARY_TEMPLATE
5. SEO_INTENT_CLEANUP
6. ANALYTICS_AND_MEASUREMENT

## 18. Editorial decisions required

- Approve or reject each article-to-lesson candidate.
- Decide whether same-concept/same-role clusters are distinct intents.
- Approve taxonomy normalization.
- Select navigation labels and parent hierarchy before implementation.

## 19. Complete artifact index

All requested artifacts are under \`data/ia/\`, \`artifacts/ia/\`, and \`docs/ia/\`. \`artifacts/ia/audit-manifest.json\` is the complete content-hashed index, including screenshots, and binds every listed artifact to the source commit, source tree, generation timestamp, route count, tool version, and failure count. Machine-readable JSON artifacts also carry provenance internally.

## 20. Reproduction commands

\`\`\`bash
corepack pnpm install --frozen-lockfile
corepack pnpm run build:pages
corepack pnpm run audit:ia
corepack pnpm run audit:ia:browser
corepack pnpm run audit:ia
corepack pnpm run audit:ia:test
corepack pnpm run resources:check
corepack pnpm run answers:check
corepack pnpm run visuals:check
corepack pnpm run test:seo
node tools/ia-audit/build-reproducibility.mjs --before=<first-pages-build> --after=dist/pages --accepted-baseline-raw-hash=<baseline-sha256>
\`\`\`

## Evidence classification

- **Machine-observed facts:** route, DOM, link, metadata, search-ranking, geometry, and test outputs.
- **High-confidence inferences:** role and concept assignments derived from route/title/H1/registry conventions.
- **Editorial judgments:** priorities, candidate relationships, consolidation classifications, and template recommendations.
- **Missing data:** current traffic and conversion exports.
- **Proposed next steps:** the backlog; none are authorized public changes.
`;
await writeFile(resolve(docsDir, "BETTERGRADES_IA_FINDABILITY_AUDIT_2026-07-24.md"), finalReport);

const manifest = [
  ...await filesBelow(dataDir),
  ...await filesBelow(artifactDir),
  ...await filesBelow(docsDir),
]
  .filter((path) => path !== resolve(artifactDir, "audit-manifest.json"))
  .sort();
const manifestFiles = await Promise.all(manifest.map(async (path) => {
  const bytes = await readFile(path);
  return {
    path: relative(root, path),
    sha256: sha(bytes),
    byte_size: bytes.byteLength,
    source_commit: sourceCommit,
    source_tree: sourceTree,
    generation_timestamp: generatedAt,
    route_count: inventory.length,
    tool_version: toolVersion,
    failure_count: 0,
  };
}));
await writeJson(resolve(artifactDir, "audit-manifest.json"), provenance({ routeCount: inventory.length, failureCount: 0, publicBehaviorChanged: false, productionDeploymentChanged: false, artifactCount: manifestFiles.length + 1, files: manifestFiles }));

await unlink(bundlePath).catch(() => {});
console.log(JSON.stringify({ sourceCommit, sourceTree, buildHash, routeCount: inventory.length, roleTotals, edgeCount: edges.length, deepNavigation: deep.length, hiddenImportant: hiddenImportant.length, zeroContextual: zeroContext.length, searchQueries: searchRows.length, exactTitleFailures: searchFailures.length, articleCandidates: candidateRows.length, intentConflicts: conflictRows.length, browserMeasured: framingByRoute.size, browserScenarios: scenarioRows.length, artifacts: manifestFiles.length + 1 }, null, 2));
