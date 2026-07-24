import assert from "node:assert/strict";
import test from "node:test";
import {
  contentFingerprint,
  duplicateAnalysis,
  substantiveMainText,
  substantiveSimilarity,
} from "../lib/seo/content-fingerprint.mjs";

const shell = (body, title = "Page") => `<!doctype html><html><head><title>${title}</title><script>self.__next_f=[]</script></head><body><header>Repeated header</header><nav>Repeated navigation</nav><main><div class="breadcrumbs">Home / Glossary</div>${body}</main><footer>Repeated footer</footer></body></html>`;

test("substantive fingerprints distinguish the three glossary fixtures", () => {
  const pages = [
    { path: "/glossary/", html: shell("<h1>Better Grades glossaries</h1><p>Browse subject-specific definitions and symbols.</p>") },
    { path: "/glossary/math/", html: shell("<h1>Mathematics glossary</h1><p>Look up calculus notation, terms, and examples.</p>") },
    { path: "/glossary/math/conventions/", html: shell("<h1>Mathematics notation conventions</h1><p>Variables, naming rules, and notation conventions used throughout mathematics.</p>") },
  ].map((page) => {
    const mainText = substantiveMainText(page.html);
    return { ...page, mainText, mainTextFingerprint: contentFingerprint(mainText) };
  });
  assert.equal(new Set(pages.map((page) => page.mainTextFingerprint)).size, 3);
  assert.deepEqual(duplicateAnalysis(pages).exact, []);
});

test("substantive fingerprints ignore shell and detect exact duplicates", () => {
  const pages = [
    { path: "/a/", html: shell("<article><h1>Derivative rule</h1><p>Multiply by the inner derivative.</p>", "A") },
    { path: "/b/", html: shell("<article><h1>Derivative rule</h1><p>Multiply by the inner derivative.</p>", "B") },
  ].map((page) => {
    const mainText = substantiveMainText(page.html);
    return { ...page, mainText, mainTextFingerprint: contentFingerprint(mainText) };
  });
  assert.equal(duplicateAnalysis(pages).exact.length, 1);
});

test("near-duplicate similarity detects substantive rewrites but rejects unrelated pages", () => {
  const base = substantiveMainText(shell("<h1>Power series endpoints</h1><p>Test the left endpoint and right endpoint separately because the ratio test is inconclusive at the boundary. Record convergence or divergence for each endpoint.</p>"));
  const near = substantiveMainText(shell("<h1>Power series endpoints</h1><p>Test the left endpoint and right endpoint separately because the ratio test is inconclusive at the boundary. Then record convergence or divergence for each endpoint.</p>"));
  const unrelated = substantiveMainText(shell("<h1>Optimization</h1><p>Build a feasible objective and compare interior critical points with boundary values.</p>"));
  assert.ok(substantiveSimilarity(base, near) >= 0.8);
  assert.ok(substantiveSimilarity(base, unrelated) < 0.2);
  const pages = [base, near, unrelated].map((mainText, index) => ({ path: `/${index}/`, mainText, mainTextFingerprint: contentFingerprint(mainText) }));
  assert.equal(duplicateAnalysis(pages, 0.8).near.length, 1);
});
