import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseCalculusUnitPage } from "../lib/calculus/calculus-unit-core.mjs";

const root = resolve(import.meta.dirname, "..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1] ?? "unit-2a";
const checkOnly = process.argv.includes("--check");
const definitions = {
  "unit-2a": { routes: 67, core: 49, problems: 34, sets: 7, visuals: 27, format: "legacy" },
  "unit-2b": { routes: 76, core: 57, problems: 22, sets: 8, visuals: 34, format: "legacy" },
  "unit-3a": {
    routes: 36, core: 30, problems: 28, sets: 2, visuals: 11, format: "normalized-handoff",
    shortTitle: "Integral Foundations and Techniques",
    prerequisiteUnit: "calc-1-unit-2b-derivative-applications",
    nextUnit: { unit_id: "calc-1-unit-3b-integration-applications", title: "Unit 3B: Applications of Integration", route: "/subjects/math/calculus/integration-applications/", link_when_public_only: true },
  },
  "unit-3b": {
    routes: 25, core: 18, problems: 16, sets: 2, visuals: 9, format: "normalized-handoff",
    shortTitle: "Applications of Integration",
    prerequisiteUnit: "calc-1-unit-3a-integral-foundations-techniques",
    nextUnit: null,
  },
  "unit-4a": {
    routes: 34, core: 23, problems: 22, sets: 3, visuals: 18, provenance: 104, format: "normalized-handoff",
    shortTitle: "Sequences and Infinite Series",
    prerequisiteUnit: "calc-1-unit-3b-integration-applications",
    nextUnit: null,
  },
};
const expected = definitions[requested];
if (!expected) throw new Error(`Unknown calculus unit ${requested}.`);
const directory = resolve(root, "content/calculus/units", requested);
const sourceDirectory = expected.format === "normalized-handoff" ? resolve(directory, "handoff") : directory;

async function json(name, base = sourceDirectory) {
  return JSON.parse((await readFile(resolve(base, name), "utf8")).replace(/^\uFEFF/, ""));
}

async function optionalJson(name, fallback, base = directory) {
  try {
    return await json(name, base);
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") return fallback;
    throw error;
  }
}

const [index, pages, publicInput, serverInput, publicSetInput, serverSetInput, visuals, provenance, exerciseAnswers] = await Promise.all([
  json("unit-index.public.json"),
  json("pages.server.json"),
  json("assessments.public.json"),
  json("assessments.server.json"),
  json("assessment-sets.public.json"),
  json("assessment-sets.server.json"),
  json("visual-authoring-briefs.v3.json"),
  json("provenance.json"),
  optionalJson("exercise-answers.server.json", { schemaVersion: 1, unitId: null, routes: [] }),
]);

const handoff = expected.format === "normalized-handoff";
const sourceRoutes = index.routes;
const sourcePages = pages.pages;
const sourceProblemsPublic = publicInput.problems ?? publicInput.assessments;
const sourceProblemsServer = serverInput.problems ?? serverInput.assessments;
const sourceSetsPublic = publicSetInput.assessments ?? publicSetInput.assessment_sets;
const sourceSetsServer = serverSetInput.assessments ?? serverSetInput.assessment_sets;
const sourceVisuals = visuals.visuals ?? visuals.visual_briefs;
const sourceProvenance = provenance.routes ?? provenance.records;
const unitId = index.unit_id;
const unitCode = index.unit_code ?? index.display_code;
const canonicalRoot = index.canonical_root;

const visualIdsByRouteId = new Map();
if (handoff) {
  for (const visual of sourceVisuals) {
    const routeId = visual.route_id;
    if (!routeId) throw new Error(`${requested} visual ${visual.visual_id ?? "without ID"} has no route ID.`);
    const visualId = String(visual.visual_id).toLowerCase();
    const routeVisuals = visualIdsByRouteId.get(routeId) ?? [];
    if (routeVisuals.includes(visualId)) throw new Error(`${requested} route ${routeId} repeats visual ${visualId}.`);
    routeVisuals.push(visualId);
    visualIdsByRouteId.set(routeId, routeVisuals);
  }
}

function visualIdsFor(route) {
  if (!handoff) return Array.isArray(route.visual_ids) ? route.visual_ids : [];
  const declared = Array.isArray(route.visual_ids) ? route.visual_ids.map((visualId) => String(visualId).toLowerCase()) : [];
  const authored = visualIdsByRouteId.get(route.route_id) ?? [];
  return [...new Set([...declared, ...authored])];
}

function assertCount(label, actual, wanted) {
  if (actual !== wanted) throw new Error(`${requested} ${label}: expected ${wanted}; received ${actual}.`);
}
assertCount("routes", sourceRoutes.length, expected.routes);
assertCount("page bodies", sourcePages.length, expected.routes);
assertCount("core routes", sourceRoutes.filter((route) => route.is_core).length, expected.core);
assertCount("public checks", sourceProblemsPublic.length, expected.problems);
assertCount("server checks", sourceProblemsServer.length, expected.problems);
assertCount("assessment sets", sourceSetsPublic.length, expected.sets);
assertCount("server assessment sets", sourceSetsServer.length, expected.sets);
assertCount("visual briefs", sourceVisuals.length, expected.visuals);
if (handoff) assertCount("provenance records", sourceProvenance.length, expected.provenance ?? expected.routes + expected.problems + expected.visuals);
else assertCount("route provenance records", sourceProvenance.length, expected.routes);

if (exerciseAnswers.routes.length) {
  if (exerciseAnswers.unitId !== unitId) throw new Error(`${requested} exercise-answer unit ID does not match the normalized unit.`);
  if (new Set(exerciseAnswers.routes.map((route) => route.routeId)).size !== exerciseAnswers.routes.length) throw new Error(`${requested} has duplicate exercise-answer route IDs.`);
  for (const answerRoute of exerciseAnswers.routes) {
    if (!sourceRoutes.some((route) => route.route_id === answerRoute.routeId)) throw new Error(`${requested} exercise answers reference unknown route ${answerRoute.routeId}.`);
    if (!Array.isArray(answerRoute.answers) || !answerRoute.answers.length || answerRoute.answers.some((answer) => !String(answer.response ?? "").trim())) throw new Error(`${answerRoute.routeId} has an empty exercise answer.`);
  }
}

const pathForSlug = (slug) => `/${String(slug).replace(/^\/+|\/+$/g, "")}/`;
const routeBySlug = new Map(sourceRoutes.map((route) => [route.slug, route]));
const pageByRouteId = new Map(sourcePages.map((page) => [page.route_id ?? page.slug, page]));
const coreRoutes = sourceRoutes.filter((route) => route.is_core).sort((a, b) => a.sequence_index - b.sequence_index);
const coreIndex = new Map(coreRoutes.map((route, position) => [route.route_id, position + 1]));

const legacySections = {
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

function sectionFor(route, page) {
  if (!handoff) return legacySections[requested][page.source_file] ?? ["support", "Supporting material"];
  const sequence = route.sequence_index;
  if (requested === "unit-3a") {
    if (sequence === 1) return ["orientation", "Orientation and integral roadmap"];
    if (sequence <= 6) return ["antiderivatives-change", "Antiderivatives and accumulated change"];
    if (sequence <= 12) return ["riemann-definite", "Riemann sums and the definite integral"];
    if (sequence <= 17) return ["fundamental-theorem", "The Fundamental Theorem of Calculus"];
    if (sequence <= 25) return ["techniques", "Computing integrals"];
    if (sequence <= 29) return ["numerical-improper", "Numerical and improper integration"];
    return ["review", "Review, practice, exams, and answer keys"];
  }
  if (requested === "unit-4a") {
    if (sequence === 1) return ["orientation", "Orientation and the convergence roadmap"];
    if (sequence <= 7) return ["sequences", "Sequences and their limits"];
    if (sequence <= 12) return ["series-foundations", "Infinite series and foundational examples"];
    if (sequence <= 16) return ["positive-series-tests", "Positive-series tests and error estimates"];
    if (sequence <= 21) return ["signed-and-absolute-tests", "Alternating, absolute, ratio, and root tests"];
    if (sequence <= 23) return ["strategy-and-tails", "Test selection and the Cauchy tail idea"];
    return ["review", "Review, practice, exams, and answer keys"];
  }
  if (sequence === 1) return ["orientation", "Orientation and applications roadmap"];
  if (sequence <= 7) return ["area-volume", "Area and volume"];
  if (sequence <= 11) return ["length-mass", "Length, surface, mass, and balance"];
  if (sequence <= 18) return ["quantitative-applications", "Physics and quantitative applications"];
  return ["review", "Review, practice, exams, and answer keys"];
}

function normalizeRouteText(value) {
  return String(value ?? "")
    .replace(/``([^']+?)''/g, "“$1”")
    .replace(/``/g, "“")
    .replace(/''/g, "”")
    .replace(/\bChapter\b/gi, "Section")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionFor(route) {
  const raw = normalizeRouteText(route.seo?.meta_description ?? route.meta_description).replace(/\.{3,}|…/g, ".");
  if (requested === "unit-4a") return raw;
  if (requested === "unit-3b" && route.page_type === "hub") return "Learn applications of integration through area, volume, length, mass, work, fluids, marginal quantities, probability, worked examples, visual reasoning, practice, and published exam keys.";
  if (requested === "unit-3b" && route.route_id.endsWith("/common-errors")) return "Identify and repair common integration-application errors involving slice orientation, radii, bounds, density, depth, units, and interpretation.";
  if (!handoff || route.page_type === "hub") return raw;
  if (route.page_type === "lesson" || /\b(?:BetterGrad|calcul|calcu|pract|practi|integ|applic|displac)\.$/i.test(raw)) {
    return `Learn ${normalizeRouteText(route.title)} through clear explanation, worked examples, visual reasoning, checks, and connected integral-calculus practice.`;
  }
  const finalWord = raw.match(/([A-Za-z]+)\.$/)?.[1] ?? "";
  if (raw.length < 150 || finalWord.length >= 6) return raw;
  return `Learn ${normalizeRouteText(route.title)} through clear explanation, worked examples, visual reasoning, checks, and connected integral-calculus practice.`;
}

function breadcrumbsFor(route) {
  if (Array.isArray(route.breadcrumbs) && route.breadcrumbs.every((crumb) => crumb && typeof crumb === "object")) {
    return route.breadcrumbs.map((crumb) => ({ name: normalizeRouteText(crumb.name), path: crumb.url }));
  }
  const unitName = normalizeRouteText(index.title);
  const crumbs = [
    { name: "Mathematics", path: "/subjects/math/" },
    { name: "Calculus", path: "/subjects/math/calculus/" },
    { name: unitName, path: canonicalRoot },
  ];
  if (route.url !== canonicalRoot) crumbs.push({ name: normalizeRouteText(route.title), path: route.url });
  return crumbs;
}

function injectExerciseSolutions(nodes, answerRoute) {
  const cursor = { value: 0 };
  function visit(items) {
    const result = [];
    for (const node of items) {
      const current = node.children ? { ...node, children: visit(node.children) } : node;
      result.push(current);
      if (node.type !== "exercise") continue;
      const answer = answerRoute.answers[cursor.value++];
      if (!answer) throw new Error(`${answerRoute.routeId} has fewer supplied answers than exercises.`);
      result.push({ type: "solution", title: `Exercise ${cursor.value} answer`, children: parseCalculusUnitPage(answer.response) });
    }
    return result;
  }
  const result = visit(nodes);
  if (cursor.value !== answerRoute.answers.length) throw new Error(`${answerRoute.routeId} has ${cursor.value} exercises but ${answerRoute.answers.length} supplied answers.`);
  return result;
}

const unit3bExercisePrompts = new Map(Object.entries({
  "subjects/math/calculus/integration-applications/physics-application-studio": [
    "A particle has velocity \\(v(t)=(t-1)(t-3)\\) for \\(0\\le t\\le4\\). Find its displacement and total distance traveled, and explain how the sign changes affect the two totals.",
    "A spring requires \\(12\\,\\mathrm{N}\\) of force at an extension of \\(0.06\\,\\mathrm{m}\\). Find the work required to stretch it from \\(0.10\\,\\mathrm{m}\\) to \\(0.25\\,\\mathrm{m}\\) beyond equilibrium.",
    "A rectangular tank is \\(4\\,\\mathrm{m}\\) long, \\(3\\,\\mathrm{m}\\) wide, and \\(2\\,\\mathrm{m}\\) deep. It is full of water, which is pumped to an outlet \\(1\\,\\mathrm{m}\\) above the top. Using water weight density \\(9800\\,\\mathrm{N/m^3}\\), set up and evaluate the work.",
    "A triangular vertical plate has a \\(4\\,\\mathrm{m}\\) top edge at the water surface and a vertex \\(3\\,\\mathrm{m}\\) below the surface. Using water weight density \\(9800\\,\\mathrm{N/m^3}\\), find the hydrostatic force.",
    "A rod occupies \\(0\\le x\\le L\\) and has linear density \\(\\lambda(x)=a+bx\\), where \\(a,b,L>0\\). Find its mass, first moment about the origin, and center of mass.",
    "Force-position data are \\(F(0)=5\\), \\(F(1)=7\\), \\(F(2)=8\\), \\(F(3)=10\\), and \\(F(4)=14\\) newtons. Estimate the work from \\(x=0\\) to \\(x=4\\) meters with the Trapezoidal Rule and state the units.",
  ],
  "subjects/math/calculus/integration-applications/review": [
    "Find the area between \\(y=2x\\) and \\(y=x^2\\) on \\(0\\le x\\le2\\) using vertical slices.",
    "Set up and evaluate the same area between \\(y=2x\\) and \\(y=x^2\\) using horizontal slices.",
    "For the region between \\(y=2x\\) and \\(y=x^2\\) on \\(0\\le x\\le2\\), find the volume about the \\(x\\)-axis with washers and the volume about the \\(y\\)-axis with shells. Compare how radius and height are defined.",
    "The base is the region under \\(y=\\sqrt{4-x^2}\\) above the \\(x\\)-axis for \\(-2\\le x\\le2\\). Cross-sections perpendicular to the \\(x\\)-axis are semicircles whose diameters lie in the base. Find the volume.",
    "Find the arc length of \\(y=2x+1\\) on \\([0,3]\\), then verify the result with the distance formula between the endpoints.",
    "A rod occupies \\([0,3]\\) and has density \\(\\lambda(x)=2+x\\). Find its mass and center of mass.",
    "A spring has constant \\(k=200\\,\\mathrm{N/m}\\). Find the work required to stretch it from \\(0.10\\,\\mathrm{m}\\) to \\(0.30\\,\\mathrm{m}\\) beyond equilibrium.",
    "A full conical tank is \\(4\\,\\mathrm{m}\\) high with top radius \\(2\\,\\mathrm{m}\\). Water is pumped to an outlet \\(1\\,\\mathrm{m}\\) above the top. Set up and evaluate the work using \\(9800\\,\\mathrm{N/m^3}\\).",
    "A vertical rectangular plate is \\(2\\,\\mathrm{m}\\) wide and extends from the water surface to a depth of \\(3\\,\\mathrm{m}\\). Find the hydrostatic force using \\(9800\\,\\mathrm{N/m^3}\\).",
    "Marginal cost is \\(C'(q)=20+0.04q\\) dollars per unit and \\(C(100)=5000\\). Find \\(C(200)\\) and identify the accumulated added cost.",
  ],
  "subjects/math/calculus/integration-applications/cumulative-practice": [
    "Find the area enclosed by \\(y=x^2\\) and \\(y=2x+3\\).",
    "Rotate that same enclosed region about the horizontal line \\(y=-1\\). Set up and evaluate the washer integral.",
    "Rotate that same enclosed region about the vertical line \\(x=-2\\). Set up and evaluate the shell integral.",
    "The base is the region enclosed by \\(y=x^2\\) and \\(y=2x+3\\). Cross-sections perpendicular to the \\(x\\)-axis are squares. Find the volume.",
    "Find the arc length of \\(y=x^{3/2}\\) on \\([0,4/9]\\).",
    "A rod occupies \\([0,1]\\) and has density \\(\\lambda(x)=1+x^2\\). Find its mass and center of mass.",
    "A spring has constant \\(k=200\\,\\mathrm{N/m}\\). Find the work required to stretch it from \\(0.10\\,\\mathrm{m}\\) to \\(0.30\\,\\mathrm{m}\\) beyond equilibrium.",
    "A \\(4\\,\\mathrm{m}\\)-long triangular trough has ends \\(2\\,\\mathrm{m}\\) deep and \\(3\\,\\mathrm{m}\\) wide at the top. It is full of water. Set up and evaluate the work to pump the water to the top edge using \\(9800\\,\\mathrm{N/m^3}\\).",
    "A triangular vertical gate has a \\(4\\,\\mathrm{m}\\) top edge at the water surface and a vertex \\(3\\,\\mathrm{m}\\) below. Find the hydrostatic force using \\(9800\\,\\mathrm{N/m^3}\\).",
    "Marginal cost is \\(C'(q)=15+0.02q\\) dollars per unit and fixed cost is \\(C(0)=2000\\). Find \\(C(300)\\).",
    "A probability density has the form \\(p(x)=kx\\) on \\([0,2]\\). Find \\(k\\), verify normalization, and compute \\(E[X]\\).",
  ],
}));

function applyExercisePromptOverrides(nodes, routeId) {
  const prompts = unit3bExercisePrompts.get(routeId);
  if (!prompts) return nodes;
  const cursor = { value: 0 };
  function visit(items) {
    return items.map((node) => {
      if (node.type === "exercise") {
        const prompt = prompts[cursor.value++];
        if (!prompt) throw new Error(`${routeId} has more exercises than authored prompts.`);
        return { ...node, children: [{ type: "paragraph", text: prompt }] };
      }
      return node.children ? { ...node, children: visit(node.children) } : node;
    });
  }
  const result = visit(nodes);
  if (cursor.value !== prompts.length) throw new Error(`${routeId} has ${cursor.value} exercises but ${prompts.length} authored prompts.`);
  return result;
}

function removeResidualListSource(nodes) {
  return nodes.map((node) => ({
    ...node,
    ...(node.text ? {
      text: node.text
        .replace(/\\item(?:\[([^\]]+)\])?/g, (_, label) => label ? ` • ${label}: ` : " • ")
        .replace(/\band two practice exams\b/gi, "practice exams and published answer keys")
        .replace(/\s+/g, " ")
        .trim(),
    } : {}),
    ...(node.children ? { children: removeResidualListSource(node.children) } : {}),
  }));
}

function parseMarkdownAnswerKey(markdown, title) {
  const source = String(markdown ?? "").replace(/\r\n?/g, "\n");
  const parts = source.split(/^##\s+(\d+)\s*$/gm);
  const sections = [];
  for (let index = 1; index < parts.length; index += 2) sections.push({ number: Number(parts[index]), body: String(parts[index + 1] ?? "").trim() });
  if (!sections.length || sections.some((section) => !section.body)) throw new Error(`Answer key ${title} has missing numbered answers.`);
  return [
    { type: "heading", level: 2, text: title },
    { type: "paragraph", text: "Finish an honest attempt first, then compare one numbered response at a time and identify the first decision that changed your work." },
    ...sections.map((section) => ({ type: "answer-key-item", title: `Problem ${section.number}`, answerNumber: section.number, children: [{ type: "paragraph", text: section.body }] })),
  ];
}

function answerKeyNodes(route, title) {
  const publicSet = sourceSetsPublic.find((set) => set.answer_key_route === route.slug);
  const serverSet = sourceSetsServer.find((set) => set.assessment_set_id === publicSet?.assessment_set_id);
  if (!publicSet || !serverSet || publicSet.items.length !== serverSet.items.length) throw new Error(`${route.url} has no complete server-only answer-key set.`);
  return [
    { type: "heading", level: 2, text: title },
    { type: "paragraph", text: "Finish an honest attempt first. Then compare one numbered response at a time, locate the first line where your reasoning diverged, and retry without the key open." },
    ...serverSet.items.map((item, index) => ({
      type: "answer-key-item",
      title: `Problem ${index + 1}`,
      answerNumber: index + 1,
      children: parseCalculusUnitPage(item.model_solution_latex),
    })),
  ];
}

const compiledPages = sourcePages.map((page) => {
  const route = routeBySlug.get(page.slug) ?? sourceRoutes.find((candidate) => candidate.route_id === page.route_id);
  if (!route) throw new Error(`Page ${page.route_id ?? page.slug} has no route.`);
  const exerciseAnswerRoute = exerciseAnswers.routes.find((candidate) => candidate.routeId === route.route_id);
  let nodes;
  try {
    if (handoff && route.page_type === "answer-key") nodes = answerKeyNodes(route, page.title);
    else if (!handoff && page.source_format === "markdown") nodes = parseMarkdownAnswerKey(page.source_markdown, page.title);
    else {
      nodes = parseCalculusUnitPage(page.source_latex ?? page.body_latex, {
        visualIds: visualIdsFor(route),
        enumerateAsExercises: ["diagnostic", "exam", "practice"].includes(route.page_type),
      });
      if (handoff) nodes = removeResidualListSource(nodes);
      if (requested === "unit-3b") nodes = applyExercisePromptOverrides(nodes, route.route_id);
      if (exerciseAnswerRoute) nodes = injectExerciseSolutions(nodes, exerciseAnswerRoute);
    }
  } catch (error) {
    throw new Error(`${requested} ${route.url} (${page.source_file ?? page.slug}): ${error instanceof Error ? error.message : String(error)}`);
  }
  const section = sectionFor(route, page);
  const provenanceRecord = sourceProvenance.find((record) => record.route_id === route.route_id || (record.object_type === "route" && record.object_id === route.route_id));
  return {
    routeId: route.route_id,
    nodes,
    sectionId: section[0],
    sectionTitle: section[1],
    compositionStatus: page.provenance?.composition_status ?? `${provenanceRecord?.status ?? "BetterGrades-original"}; no direct adaptation declared in the verified handoff.`,
  };
});

const routes = sourceRoutes.map((route) => {
  const page = pageByRouteId.get(route.route_id) ?? pageByRouteId.get(route.slug);
  if (!page) throw new Error(`Route ${route.route_id} has no server page.`);
  const section = sectionFor(route, page);
  const related = [route.previous_core, route.next_core].filter(Boolean).map((slug) => routeBySlug.get(slug)?.url).filter(Boolean);
  return {
    id: route.route_id,
    unitId,
    path: route.url,
    slug: route.slug,
    title: normalizeRouteText(route.title),
    description: descriptionFor(route),
    pageType: route.page_type.replaceAll("_", "-"),
    sequenceIndex: route.sequence_index,
    isCore: route.is_core,
    coreSequenceIndex: coreIndex.get(route.route_id) ?? null,
    sectionId: section[0],
    sectionTitle: section[1],
    breadcrumbs: breadcrumbsFor(route),
    previousPath: route.previous ? pathForSlug(route.previous) : null,
    nextPath: route.next ? pathForSlug(route.next) : null,
    previousCorePath: route.previous_core ? pathForSlug(route.previous_core) : null,
    nextCorePath: route.next_core ? pathForSlug(route.next_core) : null,
    visualIds: visualIdsFor(route),
    searchTerms: [normalizeRouteText(route.seo?.primary_intent ?? route.primary_query), normalizeRouteText(route.title), section[1], expected.shortTitle ?? normalizeRouteText(index.short_title)],
    relatedPaths: related,
    indexable: handoff ? true : route.seo.robots === "index, follow" && route.seo.sitemap === true,
    releaseState: "public",
  };
});

const validatorToAnswerType = {
  "decimal-tolerance": "decimal",
  "exact-integer": "integer",
  "exact-rational": "rational",
  "multiple-choice": "multiple_choice",
  "required-integral-setup": "integral_setup",
  "symbolic-equivalence": "symbolic_expression",
};

function assessmentOverride(problemId) {
  if (requested !== "unit-3a" || problemId !== "u3a-rate-total-01") return null;
  return {
    public: {
      input_type: "expression",
      prompt_latex: "Water enters a tank at the rate \\(r(t)=3t\\) liters per minute for \\(0\\le t\\le4\\). Write a definite integral that gives the total volume delivered; do not evaluate it.",
    },
    server: {
      canonical_answer: "\\int_0^4 (3t)\\,dt",
      accepted_answers: ["3\\int_0^4 (t)\\,dt"],
      validator: "required-integral-setup",
      equivalence_policy: "equivalent-integral-structure",
      hint_latex: "Accumulated volume is the integral of the rate over the full time interval.",
      solution_latex: "\\[V=\\int_0^4 3t\\,dt.\\] The integrand has units liters per minute and \\(dt\\) has units minutes, so the integral gives liters.",
    },
  };
}

function normalizedAssessments() {
  if (!handoff) return { publicProblems: publicInput, serverProblems: serverInput, publicSets: publicSetInput, serverSets: serverSetInput };
  const serverById = new Map(sourceProblemsServer.map((problem) => [problem.assessment_id, problem]));
  const publicProblems = {
    schema_version: index.schema_version,
    unit_id: unitId,
    problem_count: sourceProblemsPublic.length,
    problems: sourceProblemsPublic.map((problem) => {
      const sourceSecret = serverById.get(problem.assessment_id);
      if (!sourceSecret) throw new Error(`${problem.assessment_id} has no server assessment.`);
      const override = assessmentOverride(problem.assessment_id);
      const publicProblem = { ...problem, ...override?.public };
      const secret = { ...sourceSecret, ...override?.server };
      return {
        problem_id: problem.assessment_id,
        unit_id: unitId,
        page_slug: problem.route_id,
        prompt_latex: publicProblem.prompt_latex,
        answer_type: validatorToAnswerType[secret.validator] ?? publicProblem.input_type.replaceAll("-", "_"),
        choices: problem.choices ?? [],
        hints: problem.has_hint && secret.hint_latex ? [secret.hint_latex] : [],
        difficulty: "course-practice",
        topics: [problem.route_id.split("/").at(-1)],
        skills: [secret.equivalence_policy],
        provenance: { composition_status: "BetterGrades-original verified handoff composition; source references remain rights-separated." },
      };
    }),
  };
  const serverProblems = {
    schema_version: index.schema_version,
    unit_id: unitId,
    problem_count: sourceProblemsServer.length,
    problems: sourceProblemsServer.map((sourceProblem) => {
      const problem = { ...sourceProblem, ...assessmentOverride(sourceProblem.assessment_id)?.server };
      return {
      problem_id: problem.assessment_id,
      canonical_answer: problem.canonical_answer,
      accepted_answers: problem.accepted_answers,
      normalization: problem.validator,
      validator: problem.validator,
      equivalence_policy: problem.equivalence_policy,
      tolerance: problem.tolerance,
      worked_solution_latex: problem.solution_latex,
      feedback: {
        correct: "Correct. Verify the structure, notation, units, and interpretation before moving on.",
        incorrect: requested === "unit-4a"
          ? "Recheck the sequence or series structure, theorem hypotheses, convergence logic, and algebra."
          : "Recheck the integral model, method, algebra, bounds, constant of integration, and units.",
        uncertain: "The bounded checker could not prove equivalence. Compare the mathematical structure or reveal the worked solution.",
      },
    };
    }),
  };
  const serverSetsById = new Map(sourceSetsServer.map((set) => [set.assessment_set_id, set]));
  const publicSets = {
    schema_version: index.schema_version,
    unit_id: unitId,
    assessments: sourceSetsPublic.map((set) => ({
      assessment_id: `${unitId}:${set.assessment_set_id}`,
      unit_id: unitId,
      route: set.route_id,
      kind: "practice_exam",
      title: set.title,
      grading_mode: "attempt_then_reveal",
      answer_key_route: set.answer_key_route,
      items: set.items.map((item) => ({ item_id: item.item_id, prompt_latex: item.prompt_latex, answer_type: "manual_rubric" })),
    })),
  };
  const serverSets = {
    schema_version: index.schema_version,
    unit_id: unitId,
    assessments: sourceSetsPublic.map((set) => {
      const secret = serverSetsById.get(set.assessment_set_id);
      if (!secret || secret.items.length !== set.items.length) throw new Error(`${set.assessment_set_id} has no complete server answer corpus.`);
      return {
        assessment_id: `${unitId}:${set.assessment_set_id}`,
        items: secret.items.map((item) => ({ item_id: item.item_id, model_response: item.model_solution_latex, rubric: { required_concepts: [], model_response: item.model_solution_latex } })),
      };
    }),
  };
  return { publicProblems, serverProblems, publicSets, serverSets };
}

const normalized = normalizedAssessments();
const output = {
  schemaVersion: 1,
  unit: {
    id: unitId,
    code: unitCode,
    title: normalizeRouteText(index.title),
    shortTitle: expected.shortTitle ?? normalizeRouteText(index.short_title),
    root: canonicalRoot,
    prerequisiteUnit: expected.prerequisiteUnit ?? index.prerequisite_unit,
    nextUnit: expected.nextUnit ?? index.next_unit,
    routeCount: routes.length,
    coreRouteCount: coreRoutes.length,
    problemCount: normalized.publicProblems.problems.length,
    assessmentSetCount: normalized.publicSets.assessments.length,
    visualCount: sourceVisuals.length,
  },
  routes,
};

const files = new Map([
  ["routes.public.json", `${JSON.stringify(output, null, 2)}\n`],
  ["pages.compiled.server.json", `${JSON.stringify({ schemaVersion: 1, unitId, pageCount: compiledPages.length, pages: compiledPages }, null, 2)}\n`],
]);
if (handoff) {
  files.set("assessments.public.json", `${JSON.stringify(normalized.publicProblems, null, 2)}\n`);
  files.set("assessments.server.json", `${JSON.stringify(normalized.serverProblems, null, 2)}\n`);
  files.set("assessment-sets.public.json", `${JSON.stringify(normalized.publicSets, null, 2)}\n`);
  files.set("assessment-sets.server.json", `${JSON.stringify(normalized.serverSets, null, 2)}\n`);
}

if (checkOnly) {
  for (const [name, wanted] of files) {
    const current = (await readFile(resolve(directory, name), "utf8")).replace(/\r\n?/g, "\n");
    if (current !== wanted) throw new Error(`${requested} ${name} is stale.`);
  }
} else {
  await Promise.all([...files].map(([name, text]) => writeFile(resolve(directory, name), text, "utf8")));
}

const publicText = `${files.get("routes.public.json")}\n${handoff ? files.get("assessments.public.json") : await readFile(resolve(directory, "assessments.public.json"), "utf8")}\n${handoff ? files.get("assessment-sets.public.json") : await readFile(resolve(directory, "assessment-sets.public.json"), "utf8")}`;
for (const forbidden of ["canonical_answer", "worked_solution_latex", "model_solution_latex", "source_file_server_only", "source_latex"]) {
  if (publicText.includes(`\"${forbidden}\"`)) throw new Error(`${requested} public artifacts leak ${forbidden}.`);
}
console.log(`${checkOnly ? "Verified" : "Imported"} ${requested}: ${routes.length} routes, ${coreRoutes.length} core routes, ${normalized.publicProblems.problems.length} checks, ${normalized.publicSets.assessments.length} assessment sets, ${sourceVisuals.length} visuals; public route SHA-256 ${createHash("sha256").update(files.get("routes.public.json")).digest("hex")}.`);
