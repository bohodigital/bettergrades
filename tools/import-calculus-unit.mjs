import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseCalculusUnitPage } from "../lib/calculus/calculus-unit-core.mjs";

const root = resolve(import.meta.dirname, "..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1] ?? "unit-2a";
const checkOnly = process.argv.includes("--check");
const expectations = {
  "unit-2a": { routes: 67, core: 49, problems: 34, sets: 7, visuals: 27 },
  "unit-2b": { routes: 76, core: 57, problems: 22, sets: 8, visuals: 34 },
};
const expected = expectations[requested];
if (!expected) throw new Error(`Unknown calculus unit ${requested}.`);
const directory = resolve(root, "content/calculus/units", requested);

async function json(name) {
  return JSON.parse((await readFile(resolve(directory, name), "utf8")).replace(/^\uFEFF/, ""));
}

const [index, pages, publicProblems, serverProblems, publicSets, serverSets, visuals, provenance] = await Promise.all([
  json("unit-index.public.json"),
  json("pages.server.json"),
  json("assessments.public.json"),
  json("assessments.server.json"),
  json("assessment-sets.public.json"),
  json("assessment-sets.server.json"),
  json("visual-authoring-briefs.v3.json"),
  json("provenance.json"),
]);

function assertCount(label, actual, wanted) {
  if (actual !== wanted) throw new Error(`${requested} ${label}: expected ${wanted}; received ${actual}.`);
}
assertCount("routes", index.routes.length, expected.routes);
assertCount("page bodies", pages.pages.length, expected.routes);
assertCount("core routes", index.routes.filter((route) => route.is_core).length, expected.core);
assertCount("public checks", publicProblems.problems.length, expected.problems);
assertCount("server checks", serverProblems.problems.length, expected.problems);
assertCount("assessment sets", publicSets.assessments.length, expected.sets);
assertCount("server assessment sets", serverSets.assessments.length, expected.sets);
assertCount("visual briefs", visuals.visuals.length, expected.visuals);
assertCount("route provenance records", provenance.routes.length, expected.routes);

const pathForSlug = (slug) => `/${String(slug).replace(/^\/+|\/+$/g, "")}/`;
const pageByRouteId = new Map(pages.pages.map((page) => [page.route_id, page]));
const routeBySlug = new Map(index.routes.map((route) => [route.slug, route]));
const coreRoutes = index.routes.filter((route) => route.is_core).sort((a, b) => a.sequence_index - b.sequence_index);
const coreIndex = new Map(coreRoutes.map((route, position) => [route.route_id, position + 1]));

const sectionLabels = {
  "unit-2a": {
    "chapters/hub.tex": ["orientation", "Orientation and prerequisites"],
    "chapters/m01_foundations.tex": ["foundations", "Derivative meaning and foundations"],
    "chapters/m02_rules.tex": ["rules", "Core differentiation rules"],
    "chapters/m03_special_functions.tex": ["special-functions", "Trigonometric, exponential, and logarithmic functions"],
    "chapters/m04_chain_rule.tex": ["chain-rule", "The chain rule and compositions"],
    "chapters/m05_implicit_inverse_log.tex": ["implicit-inverse", "Implicit, inverse, and logarithmic differentiation"],
    "chapters/m06_higher_derivatives.tex": ["higher-derivatives", "Higher derivatives and complete strategy"],
    "chapters/m07_advanced.tex": ["advanced", "Optional advanced explorations"],
    "chapters/m08_review.tex": ["review", "Review, practice, exams, and reference"],
  },
  "unit-2b": {
    "chapters/hub.tex": ["orientation", "Orientation and the Unit 2A bridge"],
    "chapters/m01_interpretation_motion.tex": ["interpretation", "Interpretation, motion, and rates"],
    "chapters/m02_approximation.tex": ["approximation", "Local linearity, differentials, and Newton's method"],
    "chapters/m03_related_rates.tex": ["related-rates", "Related rates"],
    "chapters/m04_theorems_shape.tex": ["theorems-shape", "Theorems, extrema, and curve shape"],
    "chapters/m05_optimization.tex": ["optimization", "Optimization"],
    "chapters/m06_lhopital.tex": ["lhopital", "L'Hopital's Rule and indeterminate forms"],
    "chapters/m07_modeling_studio.tex": ["modeling", "Modeling studio"],
    "chapters/m08_advanced.tex": ["advanced", "Optional advanced explorations"],
    "chapters/m09_review.tex": ["review", "Review, practice, exams, and reference"],
  },
};

function parseAnswerKey(markdown, title) {
  const source = String(markdown ?? "").replace(/\r\n?/g, "\n");
  const parts = source.split(/^##\s+(\d+)\s*$/gm);
  const sections = [];
  for (let index = 1; index < parts.length; index += 2) sections.push({ number: Number(parts[index]), body: String(parts[index + 1] ?? "").trim() });
  if (!sections.length || sections.some((section) => !section.body)) throw new Error(`Answer key ${title} has missing numbered answers.`);
  return [
    { type: "heading", level: 2, text: title },
    { type: "paragraph", text: "Finish an honest attempt first, then compare one numbered response at a time and identify the first decision that changed your work." },
    ...sections.map((section) => ({
      type: "answer-key-item",
      title: `Problem ${section.number}`,
      answerNumber: section.number,
      children: [{ type: "paragraph", text: section.body }],
    })),
  ];
}

function normalizeRouteText(value) {
  return String(value)
    .replace(/``([^']+?)''/g, "“$1”")
    .replace(/``/g, "“")
    .replace(/''/g, "”")
    .replace(/\bChapter\b/gi, "Unit")
    .replace(/\s+/g, " ")
    .trim();
}

const compiledPages = pages.pages.map((page) => {
  const route = index.routes.find((candidate) => candidate.route_id === page.route_id);
  if (!route) throw new Error(`Page ${page.route_id} has no route.`);
  let nodes;
  try {
    nodes = page.source_format === "markdown"
      ? parseAnswerKey(page.source_markdown, page.title)
      : parseCalculusUnitPage(page.source_latex, { visualIds: route.visual_ids });
  } catch (error) {
    throw new Error(`${requested} ${route.url} (${page.source_file}): ${error instanceof Error ? error.message : String(error)}`);
  }
  const section = sectionLabels[requested][page.source_file] ?? ["support", "Supporting material"];
  return {
    routeId: page.route_id,
    nodes,
    sectionId: section[0],
    sectionTitle: section[1],
    compositionStatus: page.provenance.composition_status,
  };
});

const routes = index.routes.map((route) => {
  const page = pageByRouteId.get(route.route_id);
  if (!page) throw new Error(`Route ${route.route_id} has no server page.`);
  const section = sectionLabels[requested][page.source_file] ?? ["support", "Supporting material"];
  const description = normalizeRouteText(String(route.seo.meta_description).replace(/\.{3,}|…/g, "."));
  const related = [route.previous_core, route.next_core]
    .filter(Boolean)
    .map((slug) => routeBySlug.get(slug)?.url)
    .filter(Boolean);
  return {
    id: route.route_id,
    unitId: index.unit_id,
    path: route.url,
    slug: route.slug,
    title: normalizeRouteText(route.title),
    description,
    pageType: route.page_type.replaceAll("_", "-"),
    sequenceIndex: route.sequence_index,
    isCore: route.is_core,
    coreSequenceIndex: coreIndex.get(route.route_id) ?? null,
    sectionId: section[0],
    sectionTitle: section[1],
    breadcrumbs: route.breadcrumbs.map((crumb) => ({ name: normalizeRouteText(crumb.name), path: crumb.url })),
    previousPath: route.previous ? pathForSlug(route.previous) : null,
    nextPath: route.next ? pathForSlug(route.next) : null,
    previousCorePath: route.previous_core ? pathForSlug(route.previous_core) : null,
    nextCorePath: route.next_core ? pathForSlug(route.next_core) : null,
    visualIds: route.visual_ids,
    searchTerms: [normalizeRouteText(route.seo.primary_intent), normalizeRouteText(route.title), section[1], normalizeRouteText(index.short_title)],
    relatedPaths: related,
    indexable: route.seo.robots === "index, follow" && route.seo.sitemap === true,
    releaseState: "public",
  };
});

const output = {
  schemaVersion: 1,
  unit: {
    id: index.unit_id,
    code: index.unit_code,
    title: normalizeRouteText(index.title),
    shortTitle: normalizeRouteText(index.short_title),
    root: index.canonical_root,
    prerequisiteUnit: index.prerequisite_unit,
    nextUnit: index.next_unit,
    routeCount: routes.length,
    coreRouteCount: coreRoutes.length,
    problemCount: publicProblems.problems.length,
    assessmentSetCount: publicSets.assessments.length,
    visualCount: visuals.visuals.length,
  },
  routes,
};

const outputText = `${JSON.stringify(output, null, 2)}\n`;
const compiledText = `${JSON.stringify({ schemaVersion: 1, unitId: index.unit_id, pageCount: compiledPages.length, pages: compiledPages }, null, 2)}\n`;
const outputPath = resolve(directory, "routes.public.json");
const compiledPath = resolve(directory, "pages.compiled.server.json");

if (checkOnly) {
  const [currentOutput, currentCompiled] = await Promise.all([readFile(outputPath, "utf8"), readFile(compiledPath, "utf8")]);
  if (currentOutput.replace(/\r\n?/g, "\n") !== outputText) throw new Error(`${requested} routes.public.json is stale.`);
  if (currentCompiled.replace(/\r\n?/g, "\n") !== compiledText) throw new Error(`${requested} pages.compiled.server.json is stale.`);
} else {
  await Promise.all([writeFile(outputPath, outputText), writeFile(compiledPath, compiledText)]);
}

const publicText = `${outputText}\n${await readFile(resolve(directory, "assessments.public.json"), "utf8")}\n${await readFile(resolve(directory, "assessment-sets.public.json"), "utf8")}`;
for (const forbidden of ["canonical_answer", "worked_solution_latex", "source_file_server_only", "source_latex"]) {
  if (publicText.includes(`\"${forbidden}\"`)) throw new Error(`${requested} public artifacts leak ${forbidden}.`);
}
console.log(`${checkOnly ? "Verified" : "Imported"} ${requested}: ${routes.length} routes, ${coreRoutes.length} core routes, ${publicProblems.problems.length} checks, ${publicSets.assessments.length} assessment sets, ${visuals.visuals.length} visuals; public route SHA-256 ${createHash("sha256").update(outputText).digest("hex")}.`);
