import assert from "node:assert/strict";
import test from "node:test";

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

test("server-renders the Better Grades homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Free math help that gets to the point/);
  assert.match(html, /Search the problem/);
  assert.match(html, /Search (?:<!-- -->)?72(?:<!-- -->)? guides/);
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
  assert.match(html, /One connected path/);
  assert.match(html, /Limits &amp; Continuity/);
  assert.match(html, /Sequences &amp; Series/);

  const algebra = await render("/subjects/math/algebra/");
  assert.equal(algebra.status, 200);
  const algebraHtml = await algebra.text();
  assert.match(algebraHtml, /Algebra/);
  assert.match(algebraHtml, /Expressions &amp; Equations/);
  assert.match(algebraHtml, /Polynomials &amp; Factoring/);
  assert.match(algebraHtml, /36(?:<!-- -->)? full guides/);
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
    assert.match(html, /Course progress/, path);
    assert.match(html, /Source &amp; rights/, path);
    assert.doesNotMatch(html, /\\begin\{|&lt;script|javascript:/, path);
    assert.doesNotMatch(html, /class="katex-error"/, path);
    assert.match(html, /aria-label="Vocabulary on this page"/, path);
  }
});

test("robots and sitemap metadata routes are indexable and complete", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(robots.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robotsBody = await robots.text();
  assert.match(robotsBody, /Disallow: \/search\//);
  assert.match(robotsBody, /Sitemap: https:\/\/bettergrades\.net\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml\b/i);
  const sitemapBody = await sitemap.text();
  assert.match(sitemapBody, /<urlset\b/);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/limit-of-sin-x-over-x\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/sequences-series\/taylor-series-remainder\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/polynomials-factoring\/factoring-trinomials\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/radicals-exponents-functions\/inverse-functions-vs-reciprocals\//);
  assert.match(sitemapBody, /\/subjects\/math\/algebra\/expressions-equations\/evaluating-expressions-by-substitution\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/sequences-series\/ratio-test-vs-root-test\//);
  assert.match(sitemapBody, /\/practice\/math\/calculus\/exams\/calculus-foundations\//);
  assert.match(sitemapBody, /\/tools\/math\/algebra\/expression-checker\//);
  assert.match(sitemapBody, /\/glossary\/math\//);
  assert.match(sitemapBody, /\/glossary\/math\/conventions\//);
  assert.match(sitemapBody, /\/subjects\/math\/calculus\/limits-continuity\/unit\/limits\/what-a-limit-means\//);
  assert.doesNotMatch(sitemapBody, /\/search\//);
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

test("all 72 registry articles render and include KaTeX", async () => {
  const sitemap = await render("/sitemap.xml");
  const sitemapBody = await sitemap.text();
  const paths = [...sitemapBody.matchAll(/<loc>https:\/\/bettergrades\.net(\/subjects\/math\/(?:algebra|calculus)\/[^<]+\/[^<]+\/)<\/loc>/g)]
    .map((match) => match[1])
    .filter((path) => path.split("/").filter(Boolean).length === 5 && !path.includes("/unit/"));
  assert.equal(paths.length, 72);

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
  assert.match(html, /72(?:<!-- -->)? complete guides/);
  assert.match(html, /\d+(?:<!-- -->)? visual definitions/);
  assert.match(html, /Filter by course/);
  assert.match(html, /Filter by resource type/);
  assert.match(html, /Guides and direct answers/);
  assert.match(html, /Tools and practice/);
  assert.match(html, /Terms, symbols, and notation/);
  assert.match(html, />Glossary</);
  assert.match(html, /Algebra Expression Checker/);
  assert.match(html, /Calculus foundations practice exam/);
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
  assert.match(html, /Runs in your browser/);
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
