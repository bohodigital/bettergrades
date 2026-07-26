import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { limitsUnitRoutes } from "../lib/calculus/limits-unit-index.mjs";
import { calculusUnitRoutes } from "../lib/calculus/calculus-units-index.mjs";
import { publishedResourcePages } from "../lib/resources/catalog.mjs";

const expectedLimitsVisuals = [
  ["secant-tangent", "/subjects/math/calculus/limits-continuity/unit/limits/why-limits-matter/"],
  ["removable-hole", "/subjects/math/calculus/limits-continuity/unit/limits/limit-at-a-hole/"],
  ["limit-versus-value", "/subjects/math/calculus/limits-continuity/unit/limits/function-value-vs-limit/"],
  ["jump-discontinuity", "/subjects/math/calculus/limits-continuity/unit/limits/one-sided-limits/"],
  ["rapid-oscillation", "/subjects/math/calculus/limits-continuity/unit/limits/when-a-limit-does-not-exist/"],
  ["squeeze-bounds", "/subjects/math/calculus/limits-continuity/unit/limits/squeeze-theorem/"],
  ["unit-circle-squeeze", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["sine-over-x", "/subjects/math/calculus/limits-continuity/unit/limits/sin-x-over-x-proof/"],
  ["vertical-asymptotes", "/subjects/math/calculus/limits-continuity/unit/limits/infinite-limits/"],
  ["horizontal-asymptote", "/subjects/math/calculus/limits-continuity/unit/limits/limits-at-infinity/"],
  ["discontinuity-gallery", "/subjects/math/calculus/limits-continuity/unit/continuity/types-of-discontinuity/"],
  ["ivt-root", "/subjects/math/calculus/limits-continuity/unit/continuity/intermediate-value-theorem/"],
  ["epsilon-delta-window", "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/"],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function createRenderer() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-route-audit`);
  const { default: worker } = await import(workerUrl.href);
  return (path = "/") => worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<annotation\b[\s\S]*?<\/annotation>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function instructionalVisibleText(html) {
  return visibleText(
    html
      .replace(/<header class="site-header">[\s\S]*?<\/header>/i, " ")
      .replace(/<footer class="site-footer">[\s\S]*?<\/footer>/i, " "),
  );
}

test("server-renders the Better Grades homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Clear math lessons, practice, and references/);
  assert.match(html, /Find a topic, learn it fully, or practice the exact skill/);
  assert.match(html, /Search guides/);
  assert.match(html, /New in the library/);
  assert.match(html, /Fresh explanations, ready to use/);
  assert.match(html, /Algebra/);
  assert.match(html, /Calculus/);
  assert.match(html, /No account required/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|taking shape/i);
});

test("server-renders the canonical sec-cubed answer", async () => {
  const response = await render("/answers/calculus/integral-of-sec-cubed/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /What is the integral of sec³x/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /application\/x-tex/);
  assert.match(html, /\\frac12\\sec x\\tan x/);
  assert.match(html, /Integration by parts/);
  assert.match(html, /Verified/);
});

test("unknown routes use the custom 404", async () => {
  const response = await render("/definitely-not-a-page/");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /Wrong turn\. Useful recovery/);
});

test("subject and course hubs expose the organized math library", async () => {
  const subjects = await render("/subjects/");
  assert.equal(subjects.status, 200);
  assert.match(await subjects.text(), /Free help, organized like a course/);
  const response = await render("/subjects/math/calculus/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Calculus course navigator/);
  assert.match(html, /One course\. Clear chapters\./);
  assert.match(html, /data-chapter="1"/);
  assert.match(html, /data-chapter="2"[\s\S]*Unit 2A[\s\S]*Unit 2B/);
  assert.match(html, /data-chapter="3"[\s\S]*Unit 3A[\s\S]*Unit 3B/);
  assert.match(html, /data-chapter="4"[\s\S]*Sequences and Series/);
  assert.doesNotMatch(html, /data-chapter="1" open/);
  assert.match(html, /Support the course without losing the sequence/);
  assert.match(html, /href="\/resources\/"[\s\S]*Browse the complete library/);
  assert.doesNotMatch(html, /Applications of Derivatives[\s\S]*Open topic/);

  const algebra = await render("/subjects/math/algebra/");
  assert.equal(algebra.status, 200);
  const algebraHtml = await algebra.text();
  assert.match(algebraHtml, /Algebra/);
  assert.match(algebraHtml, /Expressions &amp; Equations/);
  assert.match(algebraHtml, /Polynomials &amp; Factoring/);
  assert.match(algebraHtml, /Open the first published guide/);
});

test("sitewide navigation exposes learner paths globally and course hierarchy locally", async () => {
  const response = await render("/subjects/math/calculus/derivative-applications/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /class="desktop-learn-menu"/);
  assert.match(html, /class="mobile-course-menu"/);
  assert.match(html, />Learn <span/);
  assert.match(html, />Practice <span/);
  assert.match(html, />Resources <span/);
  assert.match(html, /href="\/search\/"[^>]*>Search/);
  assert.match(html, /Unit 2B: Applications of Derivatives/);
  assert.match(html, /Core textbook path/);
  assert.match(visibleText(html), /The complete Unit 2B path/);
  assert.match(html, /href="\/subjects\/math\/calculus\/derivatives\/"/);
  assert.match(visibleText(html), /Review Unit 2A foundations/);
});

test("the top-level resource library links every published resource and document", async () => {
  const response = await render("/resources/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Everything printable, visual, and worked through/);
  assert.match(html, /63<\/b> published resources/);
  for (const resource of publishedResourcePages) {
    assert.match(html, new RegExp(`href="${resource.canonicalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), resource.id);
    if (resource.studentPdf) assert.match(html, new RegExp(`href="${resource.studentPdf.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), `${resource.id}: student PDF`);
    if (resource.answerKeyPdf) assert.match(html, new RegExp(`href="${resource.answerKeyPdf.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), `${resource.id}: answer key`);
    if (resource.primaryVisual) {
      assert.match(html, new RegExp(`href="\\/visuals\\/resources\\/${resource.primaryVisual}\\.svg"`), `${resource.id}: SVG`);
      assert.match(html, new RegExp(`href="\\/visuals\\/resources\\/${resource.primaryVisual}\\.png"`), `${resource.id}: PNG`);
    }
  }
});

test("derivative and integral unit maps remain inter-navigable", async () => {
  for (const [path, unit, counterpart] of [
    ["/subjects/math/calculus/derivatives/", "2A", "/subjects/math/calculus/derivative-applications/"],
    ["/subjects/math/calculus/derivative-applications/", "2B", "/subjects/math/calculus/derivatives/"],
    ["/subjects/math/calculus/integrals/", "3A", "/subjects/math/calculus/integration-applications/"],
    ["/subjects/math/calculus/integration-applications/", "3B", "/subjects/math/calculus/integrals/"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(`Unit ${unit}`), path);
    assert.match(visibleText(html), new RegExp(`The complete Unit ${unit} path`), path);
    assert.match(html, new RegExp(`href="${counterpart.replaceAll("/", "\\/")}"`), path);
  }
});

test("library archetype renders a full worked article", async () => {
  const response = await render("/subjects/math/calculus/limits-continuity/limit-of-sin-x-over-x/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Why is the limit of sin x over x equal to 1/);
  assert.match(html, /Worked example/);
  assert.match(html, /Common mistakes/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /data-article-format="latex-document"/);
  assert.match(html, /LaTeX article/);
  assert.doesNotMatch(html, /class="(?:worked-example|library-immediate|article-action-band)/);
  assert.doesNotMatch(html, /\\begin\{bgarticle\}/);
  assert.match(html, /Put it to work/);
  assert.match(html, /Topic map/);
  assert.match(html, /Practice/);
});

test("new Algebra articles render complete LaTeX-first lessons", async () => {
  const response = await render("/subjects/math/algebra/polynomials-factoring/factoring-trinomials/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Factoring trinomials/);
  assert.match(html, /Worked example/);
  assert.match(html, /Common mistakes/);
  assert.match(html, /class="katex-display"/);
  assert.match(html, /application\/x-tex/);
});

test("limits unit lesson, quiz, practice, and exam routes server-render in the existing shell", async () => {
  for (const [path, expected] of [
    ["/subjects/math/calculus/limits-continuity/unit/limits/what-a-limit-means/", /What a Limit Means/],
    ["/subjects/math/calculus/limits-continuity/unit/limits/meaning-concept-quiz/", /Limit Meaning Concept Quiz/],
    ["/subjects/math/calculus/limits-continuity/unit/limits/meaning-practice/", /Limit Meaning Practice/],
    ["/subjects/math/calculus/limits-continuity/unit/limits/practice-exam-a/", /Practice Examination A/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, expected, path);
    assert.match(html, /Limits and Continuity/, path);
    assert.match(html, /class="lesson-position"/, path);
    assert.match(html, /Lesson objective/, path);
    assert.match(html, /Source &amp; rights/, path);
    assert.doesNotMatch(visibleText(html), /\\begin\{|&lt;script|javascript:/, path);
    assert.doesNotMatch(html, /\\lessonobjective\b/, path);
    assert.doesNotMatch(html, /class="katex-error"/, path);
    assert.match(html, /aria-label="Vocabulary on this page"/, path);
  }
});

test("Limits overviews, visual study stops, and exercise answer reveals render as textbook structure", async () => {
  const practicePath = "/subjects/math/calculus/limits-continuity/unit/limits/meaning-practice/";
  const response = await render(practicePath);
  const html = await response.text();
  assert.equal(response.status, 200, practicePath);
  assert.match(html, /Lesson objective/);
  assert.match(html, /Section 1: What a limit means/);
  assert.match(html, /class="lesson-objective"/);
  assert.match(html, /class="lesson-position"/);
  assert.match(html, /class="lesson-guidance"/);
  assert.match(html, /Common trap/);
  assert.match(html, /Check yourself/);
  assert.doesNotMatch(html, /Section overview|limits-overview-guides|limits-editorial-intro/);
  assert.match(html, /Visual study stop/);
  assert.match(html, /data-bvlp-visual="jump-discontinuity"/);
  assert.equal((html.match(/data-exercise-number=/g) ?? []).length, 42);
  assert.equal((html.match(/class="limits-exercise-answer"/g) ?? []).length, 42);
  assert.equal((html.match(/<summary>Show answer<\/summary>/g) ?? []).length, 42);
  assert.doesNotMatch(visibleText(html), /\\[A-Za-z]+|\\[()]/, practicePath);

  const formalPath = "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-introduction/";
  const formalResponse = await render(formalPath);
  const formalHtml = await formalResponse.text();
  assert.equal(formalResponse.status, 200, formalPath);
  assert.match(formalHtml, /data-bvlp-visual="epsilon-delta-window"/);
  assert.match(formalHtml, /vertical epsilon band/);
  assert.doesNotMatch(visibleText(formalHtml), /\\[A-Za-z]+|\\[()]/, formalPath);
});

test("practice exams publish complete, prominent answer keys", async () => {
  for (const [exam, count] of [["a", 18], ["b", 14]]) {
    const examPath = `/subjects/math/calculus/limits-continuity/unit/limits/practice-exam-${exam}/`;
    const keyPath = `${examPath}answer-key/`;
    const examResponse = await render(examPath);
    const examHtml = await examResponse.text();
    assert.equal(examResponse.status, 200, examPath);
    assert.match(examHtml, new RegExp(`href="${keyPath.replaceAll("/", "\\/")}"`), examPath);
    assert.match(examHtml, /View the complete answer key/, examPath);

    const keyResponse = await render(keyPath);
    const keyHtml = await keyResponse.text();
    assert.equal(keyResponse.status, 200, keyPath);
    assert.match(keyHtml, new RegExp(`Practice Exam ${exam.toUpperCase()} Answer Key`), keyPath);
    assert.equal((keyHtml.match(/data-answer-number=/g) ?? []).length, count, keyPath);
    assert.match(keyHtml, /Source &amp; rights/, keyPath);
    assert.match(keyHtml, /appendices\/answers\.tex/, keyPath);
    assert.doesNotMatch(visibleText(keyHtml), /\\[A-Za-z]+|\\[()]/, keyPath);
    assert.doesNotMatch(keyHtml, /class="katex-error"/, keyPath);
  }
});

test("all 13 Limits visuals server-render exact accessible static fallbacks without sensitive payloads", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../content/visualizations/limits-continuity/compiled-scenes.v1.json", import.meta.url), "utf8"),
  );
  assert.equal(manifest.sceneCount, 13);
  assert.deepEqual(
    manifest.scenes.map(({ id, route }) => [id, route]),
    expectedLimitsVisuals,
  );

  const scenesByRoute = new Map();
  for (const scene of manifest.scenes) {
    const routeScenes = scenesByRoute.get(scene.route) ?? [];
    routeScenes.push(scene);
    scenesByRoute.set(scene.route, routeScenes);
  }

  for (const [path, scenes] of scenesByRoute) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const renderedIds = [...html.matchAll(/data-bvlp-visual="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(renderedIds, scenes.map(({ id }) => id), `${path} exact visual inventory`);
    assert.equal((html.match(/data-static-fallback="retained"/g) ?? []).length, scenes.length, path);
    assert.equal((html.match(/class="bvlp-long-description"/g) ?? []).length, scenes.length, path);
    assert.equal((html.match(/Read this graph as text/g) ?? []).length, scenes.length, path);

    for (const scene of scenes) {
      const descriptionId = `bvlp-description-${scene.id}`;
      assert.match(html, new RegExp(`data-bvlp-visual="${escapeRegExp(scene.id)}"`), scene.id);
      assert.match(html, new RegExp(`data-bvlp-renderer="${escapeRegExp(scene.selectedRenderer)}"`), scene.id);
      assert.match(html, new RegExp(`src="${escapeRegExp(scene.staticAsset.path)}"`), scene.id);
      assert.match(html, new RegExp(`aria-describedby="${escapeRegExp(descriptionId)}"`), scene.id);
      assert.match(html, new RegExp(`<details class="bvlp-long-description" id="${escapeRegExp(descriptionId)}">`), scene.id);
    }

    assert.doesNotMatch(html, /<canvas\b|limits-graph-canvas|data-graph-id=/, path);
    assert.doesNotMatch(html, /canonicalAnswer|workedFeedbackLatex|@cortex-js\/compute-engine|\bComputeEngine\b/, path);
    assert.doesNotMatch(html, /expressionLatex|class="katex-error"/, path);
    assert.doesNotMatch(
      visibleText(html),
      /\\(?:begin|end|addplot|draw|node|caption|centering|varepsilon|epsilon|delta|frac|sqrt)\b|\$[^$]{1,100}\$|textwidth|axis cs:/,
      path,
    );
  }

  const boundedResponse = await render("/subjects/math/calculus/limits-continuity/unit/limits/limit-at-a-hole/");
  const boundedHtml = await boundedResponse.text();
  assert.equal(boundedResponse.status, 200);
  assert.match(boundedHtml, /class="limits-table-wrap"/);
  assert.match(boundedHtml, /<table>/);
  assert.match(boundedHtml, /<caption class="sr-only">Reference table<\/caption>/);
  assert.match(boundedHtml, /Read the graph/);
  assert.match(boundedHtml, /nearby outputs approach/);
  assert.doesNotMatch(boundedHtml, /class="limits-graph-spec"|Graph specification source|Accessible graph specification details/);
});

test("every Limits unit route renders without visible source commands or math errors", async () => {
  const sourceCommand = /\\[A-Za-z]+|\\[()[\]{}]|\$[^$]{1,100}\$|textwidth|axis cs:/;

  for (const route of limitsUnitRoutes) {
    const response = await render(route.path);
    assert.equal(response.status, 200, route.path);
    const html = await response.text();
    assert.doesNotMatch(visibleText(html), sourceCommand, route.path);
    assert.doesNotMatch(instructionalVisibleText(html), /\bChapter(?:s)?\b|\bchapter(?:s)?\b/, route.path);
    assert.doesNotMatch(html, /class="katex-error"/, route.path);
  }
});

test("epsilon-delta routes render semantic titles, epsilon notation, and piecewise functions without raw TeX", async () => {
  for (const path of [
    "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-introduction/",
    "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-linear/",
    "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-quadratic/",
    "/subjects/math/calculus/limits-continuity/unit/limits/epsilon-delta-graph/",
    "/subjects/math/calculus/limits-continuity/unit/limits/disprove-limit-epsilon-delta/",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /class="katex/, path);
    assert.doesNotMatch(visibleText(html), /\\[A-Za-z]+|\\[()]/, path);
    assert.doesNotMatch(html, /class="katex-error"/, path);
  }
});

test("the Limits topic leads with the complete textbook map before extra articles", async () => {
  const response = await render("/subjects/math/calculus/limits-continuity/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The complete textbook path/);
  assert.match(html, /Start here: orientation/);
  assert.match(html, /Formal limits/);
  assert.doesNotMatch(visibleText(html), /\b(?:core pages|connected sections|interactive checks|practice and reference extras)\b/i);
  assert.match(html, /Exam answer keys/);
  assert.match(html, /Practice Exam A Answer Key/);
  assert.match(html, /Practice Exam B Answer Key/);
  assert.doesNotMatch(instructionalVisibleText(html), /\bChapter(?:s)?\b|\bchapter(?:s)?\b/);
  assert.match(html, /Deep dives and extra articles/);
  assert.ok(html.indexOf("The complete textbook path") < html.indexOf("Deep dives and extra articles"));
  assert.match(html, /Why is the limit of sin x over x equal to 1/);
});

test("course and search directories avoid inventory marketing counts outside the glossary", async () => {
  const inventoryCount = /\b\d+(?:[–-]\d+)?\s+(?:topics|pages|guides|resources|checks|questions|visuals|study hours|useful matches|visual definitions)\b/i;
  for (const path of ["/subjects/", "/subjects/math/", "/subjects/math/calculus/", "/subjects/math/algebra/", "/practice/math/calculus/", "/search/", "/subjects/math/calculus/limits-continuity/", "/subjects/math/calculus/derivatives/", "/subjects/math/calculus/derivative-applications/"]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.doesNotMatch(visibleText(await response.text()), inventoryCount, path);
  }
  const glossary = await render("/glossary/math/");
  assert.equal(glossary.status, 200);
  assert.match(visibleText(await glossary.text()), /\b\d+\s+(?:terms and notations|entries)\b/i);
});

test("robots and sitemap metadata routes are indexable and complete", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain\b/i);
  assert.match(robots.headers.get("cache-control") ?? "", /no-cache/i);
  const robotsBody = await robots.text();
  assert.doesNotMatch(robotsBody, /Disallow:/);
  assert.match(robotsBody, /Sitemap: https:\/\/bettergrades\.net\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml\b/i);
  assert.match(sitemap.headers.get("cache-control") ?? "", /no-cache/i);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /<urlset\b/);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/limit-of-sin-x-over-x\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/power-series-and-taylor-series\/taylor-remainder-theorem\//);
  assert.doesNotMatch(sitemapBody, /\/subjects\/math\/calculus\/sequences-series\/taylor-series-remainder\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/polynomials-factoring\/factoring-trinomials\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/radicals-exponents-functions\/inverse-functions-vs-reciprocals\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/expressions-equations\/evaluating-expressions-by-substitution\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/sequences-series\/ratio-test-vs-root-test\//);
  assert.match(sitemapBody, /\/practice\/math\/calculus\/exams\/calculus-foundations\//);
  assert.match(sitemapBody, /\/tools\/math\/algebra\/expression-checker\//);
  assert.match(sitemapBody, /\/glossary\/math\//);
  assert.match(sitemapBody, /\/glossary\/math\/conventions\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/unit\/limits\/what-a-limit-means\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/unit\/limits\/practice-exam-a\/answer-key\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/unit\/limits\/practice-exam-b\/answer-key\//);
  assert.match(sitemapBody, /\/search\//);
});

test("all registered pages are indexable and inherit search, canonical, and analytics tags", async () => {
  const routingSource = await readFile(new URL("../lib/registry/routing.ts", import.meta.url), "utf8");
  assert.doesNotMatch(routingSource, /indexable:\s*false/);
  const renderRoute = await createRenderer();
  const sitemapResponse = await renderRoute("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200);
  const paths = Array.from(
    sitemap.matchAll(/<loc>https:\/\/bettergrades\.net([^<]+)<\/loc>/g),
    (match) => match[1],
  );
  assert.ok(paths.length >= 300, `expected the complete public route inventory, received ${paths.length}`);
  assert.equal(new Set(paths).size, paths.length, "sitemap paths must be unique");
  for (const path of paths) {
    const response = await renderRoute(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.doesNotMatch(html, /noindex/i, path);
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="index, follow"/i, path);
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="https://bettergrades\\.net${path.replaceAll("/", "\\/")}"`, "i"), path);
    assert.match(html, /analytics\.bohodigitalservices\.com\/script\.js/, path);
    assert.match(html, /data-website-id="7810f828-f3f0-4296-95e3-e01e8c37f234"/, path);
    const gaScripts = html.match(/<script[^>]+data-bettergrades-ga4="G-9X96S9GZQ2"[^>]*>[\s\S]*?<\/script>/g) ?? [];
    assert.equal(gaScripts.length, 1, path);
    const gaScript = gaScripts[0];
    assert.equal((gaScript.match(/googletagmanager\.com\/gtag\/js\?id=G-9X96S9GZQ2/g) ?? []).length, 1, path);
    assert.equal((gaScript.match(/gtag\('config','G-9X96S9GZQ2'/g) ?? []).length, 1, path);
    assert.match(gaScript, /"bettergrades\.net":true,"www\.bettergrades\.net":true/, path);
    assert.match(gaScript, /navigator\.doNotTrack==='1'/, path);
    assert.match(gaScript, /allow_google_signals:false/, path);
    assert.match(gaScript, /allow_ad_personalization_signals:false/, path);
    assert.match(html, /<title>[^<]+<\/title>/, path);
    assert.match(html, /<meta[^>]+name="description"[^>]+content="[^"]+"/i, path);
  }
});

test("privacy notice accurately discloses both analytics systems and their limits", async () => {
  const response = await render("/privacy/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /self-hosted Umami and Google Analytics 4/);
  assert.match(html, /Google signals and advertising-personalization signals are disabled/);
  assert.match(html, /Browser Do Not Track settings and content blockers may limit collection/);
  assert.doesNotMatch(html, /no accounts, public results, comments, tracking pixels/i);
});

test("the greater-or-equal brand mark supplies Google search identity signals", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /<link[^>]+rel="icon"[^>]+href="https:\/\/bettergrades\.net\/favicon\.ico"/i);
  assert.match(html, /<link[^>]+rel="manifest"[^>]+href="https:\/\/bettergrades\.net\/site\.webmanifest"/i);
  assert.match(html, /<link[^>]+rel="apple-touch-icon"[^>]+href="https:\/\/bettergrades\.net\/apple-touch-icon\.png"/i);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"logo":\{"@type":"ImageObject","url":"https:\/\/bettergrades\.net\/icon-512\.png"/);
  assert.match(html, /"@type":"WebSite"/);
});

test("math glossary and conventions render as first-class indexed pages", async () => {
  const glossary = await render("/glossary/math/");
  assert.equal(glossary.status, 200);
  const glossaryHtml = await glossary.text();
  assert.match(glossaryHtml, /\d+(?:<!-- -->)? terms and notations/);
  assert.match(glossaryHtml, /Derivative notations/);
  assert.match(glossaryHtml, /id="derivative-notations"/);
  assert.match(glossaryHtml, /\\frac d\{dx\}/);
  assert.match(glossaryHtml, /Search terms and symbols/);

  const conventions = await render("/glossary/math/conventions/");
  assert.equal(conventions.status, 200);
  const conventionsHtml = await conventions.text();
  assert.match(conventionsHtml, /Lowercase is the rule/);
  assert.match(conventionsHtml, /Every capital needs a job/);
  assert.match(conventionsHtml, /Similar marks, different information/);
  assert.match(conventionsHtml, /What the build rejects/);
});

test("all registry articles not superseded by a released unit render in their original document format", async () => {
  const sitemap = await render("/sitemap.xml");
  const sitemapBody = await sitemap.text();
  const unitPaths = new Set(calculusUnitRoutes.map((route) => route.path));
  const resourcePaths = new Set(publishedResourcePages.map((resource) => resource.canonicalPath));
  const paths = [...sitemapBody.matchAll(/<loc>https:\/\/bettergrades\.net(\/subjects\/math\/(?:algebra|calculus)\/[^<]+\/[^<]+\/)<\/loc>/g)]
    .map((match) => match[1])
    .filter((path) => path.split("/").filter(Boolean).length === 5 && !path.includes("/unit/") && !unitPaths.has(path) && !resourcePaths.has(path));
  assert.equal(paths.length, new Set(paths).size);
  assert.ok(paths.length > 50, "the existing library must remain substantially intact");

  for (const path of paths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /class="katex-display"/, path);
    assert.match(html, /Worked example/, path);
    assert.match(html, /data-article-format="latex-document"/, path);
    assert.doesNotMatch(html, /class="(?:worked-example|library-immediate|article-action-band)/, path);
    assert.match(html, />Vocab</, path);
    assert.match(html, /class="page-term-chip"/, path);
    assert.match(html, /Learn more/, path);
  }
});

test("vocabulary chips appear only on instructional detail pages", async () => {
  const includedPaths = [
    "/answers/calculus/integral-of-sec-cubed/",
    "/learn/calculus/integration-by-parts/",
    "/tools/math/algebra/expression-checker/",
    "/tools/math/calculus/integration-method-finder/",
    "/practice/math/calculus/quizzes/integration-method-selection/",
    "/practice/math/calculus/diagnostics/calculus-readiness/",
    "/practice/math/calculus/exams/calculus-foundations/",
    "/practice/math/calculus/challenges/integration-bee/",
  ];

  for (const path of includedPaths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /aria-label="Vocabulary on this page"/, path);
    assert.match(html, />Vocab</, path);
    assert.match(html, /class="page-term-chip"/, path);
  }

  const excludedPaths = [
    "/",
    "/search/",
    "/subjects/",
    "/subjects/math/",
    "/subjects/math/algebra/",
    "/subjects/math/calculus/",
    "/subjects/math/algebra/polynomials-factoring/",
    "/subjects/math/calculus/integration-techniques/",
    "/answers/",
    "/practice/",
    "/practice/math/",
    "/practice/math/calculus/",
    "/tools/",
    "/glossary/",
    "/glossary/math/",
    "/glossary/math/conventions/",
    "/about/",
    "/not-a-real-route/",
  ];

  for (const path of excludedPaths) {
    const response = await render(path);
    const html = await response.text();
    assert.doesNotMatch(html, /class="page-terms"/, path);
    assert.doesNotMatch(html, /aria-label="Vocabulary on this page"/, path);
  }
});

test("topic pages organize content by purpose and connect tools and practice", async () => {
  const algebra = await render("/subjects/math/algebra/polynomials-factoring/");
  assert.equal(algebra.status, 200);
  const algebraHtml = await algebra.text();
  assert.match(algebraHtml, /Understand the idea/);
  assert.match(algebraHtml, /Work the method/);
  assert.match(algebraHtml, /Choose a strategy/);
  assert.match(algebraHtml, /Use (?:<!-- -->)?Algebra Expression Checker/);

  const calculus = await render("/subjects/math/calculus/integration-techniques/");
  assert.equal(calculus.status, 200);
  const calculusHtml = await calculus.text();
  assert.match(calculusHtml, /Use (?:<!-- -->)?Integration Method Finder/);
  assert.match(calculusHtml, /Practice this topic/);
});

test("search is one typed index across content, tools, and practice", async () => {
  const response = await render("/search/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Search Better Grades/);
  assert.match(html, /Organized by resource type/);
  assert.match(html, /visual definitions/);
  assert.match(html, /Filter by course/);
  assert.match(html, /Filter by resource type/);
  assert.match(html, /Guides and direct answers/);
  assert.match(html, /Tools and practice/);
  assert.match(html, /Terms, symbols, and notation/);
  assert.match(html, />Glossary</);
  assert.match(html, /Algebra Expression Checker/);
  assert.match(html, /kind-practice|Practice exam|Diagnostic|Quick quiz/);
});

test("practice is a central category with all four assessment formats", async () => {
  const response = await render("/practice/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Quick quiz/);
  assert.match(html, /Practice exam/);
  assert.match(html, /Diagnostic/);
  assert.match(html, /Challenge/);
  assert.match(html, /Calculus foundations practice exam/);
});

test("algebra expression checker is a registered browser-side tool", async () => {
  const response = await render("/tools/math/algebra/expression-checker/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Type it messy/);
  assert.match(html, /Practice answer/);
  assert.match(html, /Simplify/);
  assert.match(html, /Compare/);
  assert.match(html, /Evaluate/);
  assert.match(html, /Bounded first-party request/);
  assert.match(html, /Keyboard or LaTeX/);
  assert.match(html, /Factor completely/);
  assert.match(html, /id="algebra-expression"/);
  assert.doesNotMatch(html, /Loading the math keyboard|mathfield-host|expression-mathfield/);
});

test("legacy content paths redirect to registry canonicals", async () => {
  const response = await render("/library/limits-continuity/limit-of-sin-x-over-x/");
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location")).pathname, "/subjects/math/calculus/limits-continuity/limit-of-sin-x-over-x/");
});

test("Worker responses include baseline security headers", async () => {
  const response = await render();
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("permissions-policy"), "camera=(), microphone=(), geolocation=()");
});
test("limits check endpoint bounds input and gates deterministic reveal", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("api", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const request = (body) => worker.fetch(new Request("http://localhost/api/limits-check", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
  assert.equal((await request({ id: "not-a-check", answer: "1" })).status, 404);
  assert.equal((await request({ id: "limit-continuous-01", action: "reveal", answer: "" })).status, 400);
  const incorrect = await request({ id: "limit-continuous-01", answer: "9" });
  assert.equal(incorrect.status, 200);
  assert.equal((await incorrect.json()).status, "incorrect");
  const correct = await request({ id: "limit-continuous-01", answer: "10" });
  assert.equal(correct.status, 200);
  assert.equal((await correct.json()).status, "correct");
  const reveal = await request({ id: "limit-continuous-01", action: "reveal", answer: "10" });
  assert.equal(reveal.status, 200);
  assert.equal((await reveal.json()).revealAllowed, true);
  assert.equal((await request({ id: "limit-continuous-01", answer: "x".repeat(2001) })).status, 413);
});
