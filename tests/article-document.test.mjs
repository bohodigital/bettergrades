import assert from "node:assert/strict";
import test from "node:test";
import {
  articleToLatexSource,
  markdownToLatexArticle,
  parseLatexArticle,
  toStandaloneLatex,
  validateLatexArticle,
} from "../lib/article-document-core.mjs";

const legacyArticle = {
  slug: "test-article",
  formula: String.raw`x^2-1=(x-1)(x+1)`,
  immediate: { label: "Pattern", tex: String.raw`a^2-b^2=(a-b)(a+b)`, text: "Look for two squares separated by subtraction." },
  sections: [
    { heading: "See the structure", paragraphs: ["Both terms must be perfect squares.", "The middle sign must be subtraction."], tex: String.raw`9x^2-16=(3x)^2-4^2` },
  ],
  example: {
    heading: "Factor a difference of squares",
    prompt: "Factor 9x² − 16.",
    steps: [{ tex: String.raw`9x^2-16=(3x-4)(3x+4)`, note: "Apply the pattern once." }],
    result: String.raw`\boxed{(3x-4)(3x+4)}`,
  },
  mistakes: ["Using the pattern on a sum of squares."],
  takeaways: ["Identify the two square roots first."],
};

test("legacy registry articles compile to the canonical LaTeX document", () => {
  const source = articleToLatexSource(legacyArticle);
  assert.deepEqual(validateLatexArticle(source), { valid: true, errors: [] });
  assert.match(source, /\\begin\{bgarticle\}/);
  assert.match(source, /\\section\{Worked example\}/);
  assert.match(source, /\\begin\{bgexample\}/);
  assert.match(source, /\\section\{Common mistakes\}/);
  const nodes = parseLatexArticle(source);
  assert.ok(nodes.some((node) => node.type === "math" && node.tex.includes("x^2-1")));
  assert.ok(nodes.some((node) => node.type === "box" && node.kind === "example"));
});

test("simple Markdown compiles to the same canonical LaTeX subset", () => {
  const source = markdownToLatexArticle(String.raw`---
title: Test
---
# Test
$$
x^2=4
$$
> [!NOTE] Start here
> Check $x=2$ in the original equation.
## Solve it
Use **inverse operations** carefully.
- Keep both sides equal.
- Check the result.
`);
  assert.deepEqual(validateLatexArticle(source), { valid: true, errors: [] });
  assert.match(source, /\\begin\{bgbox\}\{Start here\}/);
  assert.ok(source.includes(String.raw`Check \(x=2\) in the original equation`));
  assert.match(source, /\\textbf\{inverse operations\}/);
  assert.equal(parseLatexArticle(source).filter((node) => node.type === "section").length, 1);
});

test("canonical article bodies export as standalone XeLaTeX documents", () => {
  const source = articleToLatexSource(legacyArticle);
  const standalone = toStandaloneLatex({ title: "Difference of squares & checks", source });
  assert.match(standalone, /\\documentclass\[11pt\]\{article\}/);
  assert.match(standalone, /\\newtcolorbox\{bgexample\}/);
  assert.match(standalone, /\\title\{Difference of squares \\& checks\}/);
  assert.match(standalone, /\\end\{document\}/);
});

test("unsupported environments fail validation", () => {
  const validation = validateLatexArticle(String.raw`\begin{bgarticle}
\begin{table}
bad
\end{table}
\section{One}
\[x=1\]
\end{bgarticle}`);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.includes("Unsupported environment: table")));
});
