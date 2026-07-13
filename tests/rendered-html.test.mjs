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
  assert.match(html, /Search 60 guides/);
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
  assert.match(algebraHtml, /30(?:<!-- -->)? full guides/);
});

test("library archetype renders a full worked article", async () => {
  const response = await render("/subjects/math/calculus/limits-continuity/limit-of-sin-x-over-x/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Why is the limit of sin x over x equal to 1/);
  assert.match(html, /Worked example/);
  assert.match(html, /Common mistakes/);
  assert.match(html, /class="katex-display"/);
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
  assert.match(sitemapBody, /\/practice\/math\/calculus\/exams\/calculus-foundations\//);
  assert.match(sitemapBody, /\/tools\/math\/algebra\/expression-checker\//);
  assert.doesNotMatch(sitemapBody, /\/search\//);
});

test("all 60 registry articles render and include KaTeX", async () => {
  const sitemap = await render("/sitemap.xml");
  const sitemapBody = await sitemap.text();
  const paths = [...sitemapBody.matchAll(/<loc>https:\/\/bettergrades\.net(\/subjects\/math\/(?:algebra|calculus)\/[^<]+\/[^<]+\/)<\/loc>/g)].map((match) => match[1]);
  assert.equal(paths.length, 60);

  for (const path of paths) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /class="katex-display"/, path);
    assert.match(html, /Worked example/, path);
  }
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
