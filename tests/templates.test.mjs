import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("textbook templates use one compact objective and put learning paths after exposition", async () => {
  for (const path of ["app/CalculusUnitPages.tsx", "app/LimitsUnitPages.tsx"]) {
    const text = await source(path);
    assert.match(text, /className="lesson-objective"/);
    assert.doesNotMatch(text, /className="limits-overview-guides"/);
    assert.ok(text.indexOf("<NodeChildren") < text.indexOf('variant="primary"'), `${path} must teach before showing supporting paths`);
  }
});

test("short-form articles teach before outline and supporting paths", async () => {
  const text = await source("app/LibraryPages.tsx");
  assert.ok(text.indexOf("<LatexArticleDocument") < text.indexOf('placement="article-intro"'));
  assert.ok(text.indexOf("<LatexArticleDocument") < text.indexOf("<details>"));
  assert.doesNotMatch(text, /articleUnit && <CalculusUnitNavigation/);
});

test("worked problems place the prompt and solution before resource framing", async () => {
  const text = await source("app/ResourcePages.tsx");
  assert.match(text, /const problemFirst = resource\.resourceType === "worked-problem"/);
  assert.ok(text.indexOf("{problemFirst && problemPreview}") < text.indexOf('className="resource-includes"'));
  assert.ok(text.indexOf("{problemFirst && workedSolutions}") < text.indexOf('className="resource-includes"'));
});

test("glossary definitions and page vocabulary are ordered for direct access", async () => {
  const resources = await source("app/ResourcePages.tsx");
  const shell = await source("app/BetterGradesApp.tsx");
  assert.ok(resources.indexOf('className="resource-explanation"') < resources.indexOf('className="resource-notation"'));
  assert.match(shell, /<main[^>]*>\{children\}<\/main><PageGlossaryTerms/);
});

test("keywords metadata is absent", async () => {
  assert.doesNotMatch(await source("app/layout.tsx"), /\bkeywords\s*:/);
});
