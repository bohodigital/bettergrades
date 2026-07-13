import assert from "node:assert/strict";
import test from "node:test";

import {
  getMathGlossaryTerm,
  latexCommandGlossaryMap,
  mathGlossaryCategories,
  mathGlossaryTerms,
  searchMathGlossary,
  uppercaseVariableConventions,
  validateMathGlossary,
  validateMathNotation,
} from "../lib/glossary/math/registry.mjs";
import { pageTermSummaries } from "../lib/glossary/math/page-artifact.mjs";
import { mathGlossarySearchTerms } from "../lib/glossary/math/search-artifact.mjs";
import { allPageTermIds } from "../lib/glossary/page-profiles.mjs";

test("math glossary is large, visual, categorized, and internally valid", () => {
  assert.ok(mathGlossaryTerms.length >= 150);
  assert.deepEqual(validateMathGlossary(), []);
  assert.equal(new Set(mathGlossaryTerms.map((term) => term.id)).size, mathGlossaryTerms.length);
  assert.ok(mathGlossaryTerms.every((term) => term.definition && term.shortDefinition && term.visuals.length));
  assert.ok(mathGlossaryTerms.every((term) => mathGlossaryCategories.some((category) => category.id === term.categoryId)));
});

test("generated search and contextual artifacts stay synchronized", () => {
  assert.equal(mathGlossarySearchTerms.length, mathGlossaryTerms.length);
  assert.deepEqual(Object.keys(pageTermSummaries).sort(), [...allPageTermIds].sort());
  assert.ok(mathGlossarySearchTerms.every((term) => getMathGlossaryTerm(term.id)?.shortDefinition === term.shortDefinition));
  assert.ok(Object.values(pageTermSummaries).every((term) => term.visuals.length > 0));
});

test("derivative notation has distinct visual explanations", () => {
  const derivative = getMathGlossaryTerm("derivative-notations");
  assert.ok(derivative);
  assert.ok(derivative.visuals.some((visual) => visual.tex.includes(String.raw`\frac d{dx}`)));
  assert.ok(derivative.visuals.some((visual) => visual.tex.includes(String.raw`\frac{dy}{dx}`)));
  assert.ok(derivative.visuals.some((visual) => visual.tex.includes("f'(x)")));
  assert.ok(derivative.visuals.some((visual) => visual.tex.includes(String.raw`\dot f`)));
});

test("glossary search accepts names, abbreviations, and crude notation", () => {
  assert.ok(searchMathGlossary("d/dx", { limit: 8 }).some((term) => term.id === "derivative-operator" || term.id === "derivative-notations"));
  assert.ok(searchMathGlossary("MVT", { limit: 8 }).some((term) => term.id === "mean-value-theorem"));
  assert.equal(searchMathGlossary("denominator", { limit: 1 })[0]?.id, "denominator");
});

test("every mapped LaTeX command resolves to a real glossary entry", () => {
  for (const [command, termId] of Object.entries(latexCommandGlossaryMap)) {
    assert.ok(command.length > 0);
    assert.ok(getMathGlossaryTerm(termId), `${command} -> ${termId}`);
  }
});

test("notation policy documents allowed capitals and rejects unknown syntax", () => {
  for (const letter of ["A", "C", "F", "I", "L", "M", "P", "Q", "R", "S", "V", "W"]) assert.ok(uppercaseVariableConventions[letter]);
  assert.deepEqual(validateMathNotation(String.raw`A=\int_a^b f(x)\,dx`), { unknownCommands: [], undocumentedUppercase: [] });
  assert.deepEqual(validateMathNotation(String.raw`X=\foobar{x}`), { unknownCommands: ["foobar"], undocumentedUppercase: ["X"] });
});
