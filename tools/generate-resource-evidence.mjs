import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pagesPackageHash } from "../lib/seo/build-hash.mjs";
import {
  flagshipResources,
  enrichedGlossaryResources,
  promotedVisualPages,
  publishedResourcePages,
  resourceHubs,
} from "../lib/resources/catalog.mjs";

const root = process.cwd();
const artifactRoot = resolve(root, "artifacts/seo");
const dataRoot = resolve(root, "data/seo");
const docsRoot = resolve(root, "docs/seo");
await Promise.all([mkdir(artifactRoot, { recursive: true }), mkdir(dataRoot, { recursive: true }), mkdir(docsRoot, { recursive: true })]);
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();
const buildHash = await pagesPackageHash(resolve(root, "dist", "pages"));
const generatedAt = new Date().toISOString();

const hubFor = (resource) => resource.resourceType === "worked-problem"
  ? "/subjects/math/calculus/worked-problems/"
  : resource.resourceType === "visual-guide"
    ? "/subjects/math/calculus/visuals/"
    : resource.resourceType === "practice-exam"
      ? "/subjects/math/calculus/practice-exams/"
      : resource.resourceType === "formula-sheet"
        ? "/subjects/math/calculus/formula-sheets/"
        : resource.resourceType === "glossary-term"
          ? "/glossary/math/"
          : "/subjects/math/calculus/worksheets/";

const edges = [];
for (const resource of publishedResourcePages) {
  edges.push({ from: resource.canonicalPath, to: hubFor(resource), linkType: "parent-hub", contextual: false });
  for (const to of resource.relatedLessons) edges.push({ from: resource.canonicalPath, to, linkType: "resource-to-lesson", contextual: true });
  for (const to of resource.relatedArticles) edges.push({ from: resource.canonicalPath, to, linkType: "resource-to-article", contextual: true });
  for (const id of resource.relatedResources) {
    const related = publishedResourcePages.find((candidate) => candidate.id === id);
    if (related) edges.push({ from: resource.canonicalPath, to: related.canonicalPath, linkType: "resource-relationship", contextual: true });
  }
  for (const term of resource.relatedGlossaryTerms) edges.push({ from: resource.canonicalPath, to: enrichedGlossaryResources.some((item) => item.glossaryTermId === term) ? `/glossary/math/${term}/` : `/glossary/math/#${term}`, linkType: "resource-to-glossary", contextual: true });
  for (const from of resource.sourceLessons) edges.push({ from, to: resource.canonicalPath, linkType: "lesson-to-resource", contextual: true });
}
for (const hub of resourceHubs) {
  for (const resource of publishedResourcePages.filter((candidate) => hubFor(candidate) === hub.path)) {
    edges.push({ from: hub.path, to: resource.canonicalPath, linkType: "hub-listing", contextual: false });
  }
}
for (const resource of enrichedGlossaryResources) {
  edges.push({ from: "/glossary/math/", to: resource.canonicalPath, linkType: "hub-listing", contextual: false });
}

const nodes = [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))].sort();
const indexable = new Set(publishedResourcePages.map((resource) => resource.canonicalPath));
const incoming = new Map(nodes.map((node) => [node, edges.filter((edge) => edge.to === node).length]));
const orphanResources = [...indexable].filter((path) => (incoming.get(path) ?? 0) === 0);
if (orphanResources.length) throw new Error(`Indexable resource orphans: ${orphanResources.join(", ")}`);

const graph = {
  schemaVersion: 2,
  generatedAt,
  environment: "local-candidate",
  sourceCommit,
  sourceTree,
  buildHash,
  nodeCount: nodes.length,
  edgeCount: edges.length,
  contextualEdgeCount: edges.filter((edge) => edge.contextual).length,
  failureCount: orphanResources.length,
  orphanIndexableResources: orphanResources,
  nodes: nodes.map((path) => ({ path, incoming: incoming.get(path) ?? 0, outgoing: edges.filter((edge) => edge.from === path).length, indexableResource: indexable.has(path) })),
  edges,
  pass: orphanResources.length === 0,
};
await writeFile(resolve(artifactRoot, "internal-link-graph.json"), `${JSON.stringify(graph, null, 2)}\n`, "utf8");
await writeFile(resolve(artifactRoot, "internal-link-graph.csv"), `from,to,link_type,contextual\n${edges.map((edge) => [edge.from, edge.to, edge.linkType, edge.contextual].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n")}\n`, "utf8");

const planRows = [
  "resource_id,resource_type,course,unit,canonical_path,problem_count,status,student_pdf,answer_key_pdf,primary_visual",
  ...[...flagshipResources, ...promotedVisualPages].map((resource) => [
    resource.id, resource.resourceType, resource.course, resource.unit, resource.canonicalPath,
    resource.problemCount, resource.status, resource.studentPdf ?? "", resource.answerKeyPdf ?? "", resource.primaryVisual ?? "",
  ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")),
];
await writeFile(resolve(dataRoot, "calculus-resource-expansion-plan.csv"), `${planRows.join("\n")}\n`, "utf8");

const sitemapFiles = [
  "sitemap-lessons.xml", "sitemap-articles.xml", "sitemap-unit-hubs.xml", "sitemap-worksheets.xml",
  "sitemap-practice-exams.xml", "sitemap-formula-sheets.xml", "sitemap-worked-problems.xml",
  "sitemap-visuals.xml", "sitemap-glossary.xml", "sitemap-pages.xml", "sitemap-images.xml",
];
const sitemapEvidence = [];
for (const file of sitemapFiles) {
  const xml = await readFile(resolve(root, "dist/pages", file), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  sitemapEvidence.push({
    file,
    urlCount: urls.length,
    canonicalHostOnly: urls.every((url) => url.startsWith("https://bettergrades.net/")),
    unique: new Set(urls).size === urls.length,
    hasPreviewHost: urls.some((url) => /chatgpt\.site|pages\.dev/.test(url)),
    validRoot: file === "sitemap-images.xml" ? /<urlset[^>]+xmlns:image=/.test(xml) : /<urlset /.test(xml),
  });
}
const sitemapFailures = sitemapEvidence.flatMap((sitemap) => [
  ...(!sitemap.canonicalHostOnly ? [`${sitemap.file}: noncanonical-host`] : []),
  ...(!sitemap.unique ? [`${sitemap.file}: duplicate-url`] : []),
  ...(sitemap.hasPreviewHost ? [`${sitemap.file}: preview-host`] : []),
  ...(!sitemap.validRoot ? [`${sitemap.file}: invalid-root`] : []),
]);
await writeFile(resolve(artifactRoot, "sitemap-verification.json"), `${JSON.stringify({
  schemaVersion: 2,
  generatedAt,
  environment: "local-candidate",
  sourceCommit,
  sourceTree,
  buildHash,
  sitemapCount: sitemapEvidence.length,
  urlCount: sitemapEvidence.reduce((sum, sitemap) => sum + sitemap.urlCount, 0),
  failureCount: sitemapFailures.length,
  failures: sitemapFailures,
  sitemaps: sitemapEvidence,
  pass: sitemapFailures.length === 0,
}, null, 2)}\n`, "utf8");

await writeFile(resolve(docsRoot, "INTERNAL_LINKING_REPORT.md"), `# BetterGrades Internal Linking Report

Release B generates a typed relationship graph rather than inferring editorial relevance from global navigation.

- Published resource pages: ${publishedResourcePages.length}
- Graph nodes: ${graph.nodeCount}
- Graph edges: ${graph.edgeCount}
- Contextual edges: ${graph.contextualEdgeCount}
- Indexable resource orphans: ${orphanResources.length}

Every published resource links to its parent hub, relevant lessons and articles, glossary concepts, and related resources. Source unit maps link back to their companion resources. Global and hub listings remain classified separately from contextual body relationships.

Evidence: \`artifacts/seo/internal-link-graph.json\` and \`artifacts/seo/internal-link-graph.csv\`.
`, "utf8");

console.log(`Generated resource evidence for ${publishedResourcePages.length} pages, ${graph.edgeCount} links, and ${sitemapEvidence.length} segmented sitemaps.`);
