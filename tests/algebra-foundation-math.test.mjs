import assert from "node:assert/strict";
import test from "node:test";

import katex from "katex";

import course from "../content/algebra/course.public.json" with { type: "json" };
import { foundationMathFragments, foundationTextToLatex } from "../lib/algebra/foundation-math.mjs";
import { FOUNDATION_PROFILES } from "../tools/algebra-foundations/index.mjs";

function mathTex(value) {
  return foundationMathFragments(value)
    .filter((fragment) => fragment.kind === "math")
    .map((fragment) => fragment.tex);
}

test("foundation prose becomes real LaTeX fragments without consuming surrounding prose", () => {
  assert.deepEqual(mathTex("Solve x/3 + 1/4 = 5/6."), [String.raw`\frac{x}{3} + \frac{1}{4} = \frac{5}{6}`]);
  assert.deepEqual(mathTex("Evaluate (−3)²."), ["(-3)^{2}"]);
  assert.deepEqual(mathTex("Write 3.08·10⁻⁴ in standard notation."), [String.raw`3.08\cdot 10^{-4}`]);
  assert.deepEqual(mathTex("Which of {−2, 0, 2} solve x² = 4?"), [String.raw`\{-2, 0, 2\}`, "x^{2} = 4"]);
  assert.equal(foundationMathFragments("Explain the operation in words.").length, 1);
  assert.deepEqual(foundationMathFragments("Explain the operation in words.")[0], { kind: "text", value: "Explain the operation in words." });
  assert.deepEqual(foundationMathFragments("Record a concise operation history."), [{ kind: "text", value: "Record a concise operation history." }]);
  assert.deepEqual(mathTex("Compare a − b with b − a."), ["a - b", "b - a"]);
  assert.deepEqual(
    mathTex("In x(x + 2)/x, x can cancel when x ≠ 0."),
    [String.raw`\frac{x(x + 2)}{x}, x`, String.raw`x \ne  0`],
  );
  assert.deepEqual(
    mathTex("In (x + 2)/x, no x factor spans the sum x + 2."),
    [String.raw`\frac{x + 2}{x},`, "x", "x + 2"],
  );
});

test("fractions use a textbook fraction bar for simple, signed, grouped, and complex quotients", () => {
  const cases = new Map([
    ["x/3", String.raw`\frac{x}{3}`],
    ["x/−4", String.raw`\frac{x}{-4}`],
    ["1/2bh", String.raw`\frac{1}{2}bh`],
    ["a³/a³", String.raw`\frac{a^{3}}{a^{3}}`],
    ["(x+1)/(x−2)", String.raw`\frac{x+1}{x-2}`],
    ["(x−3)(x+3)/(x−3)", String.raw`\frac{(x-3)(x+3)}{x-3}`],
    ["(1/2 + 1/3)/(5/6)", String.raw`\frac{\frac{1}{2} + \frac{1}{3}}{\frac{5}{6}}`],
    ["x/(1/(xy))", String.raw`\frac{x}{\frac{1}{xy}}`],
    ["kg·m²/s²", String.raw`\frac{kg\cdot m^{2}}{s^{2}}`],
  ]);
  for (const [source, expected] of cases) {
    assert.equal(foundationTextToLatex(source), expected, source);
  }
});

test("every detected A0–A2 expression is valid strict KaTeX", () => {
  const strings = [];
  const visit = (value) => {
    if (typeof value === "string") strings.push(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit(FOUNDATION_PROFILES);

  let expressionCount = 0;
  for (const value of strings) {
    for (const fragment of foundationMathFragments(value)) {
      if (fragment.kind !== "math") continue;
      expressionCount += 1;
      assert.equal(
        fragment.tex.includes("/"),
        false,
        `${JSON.stringify(value)} retained slash notation in ${JSON.stringify(fragment.tex)}`,
      );
      assert.doesNotThrow(
        () => katex.renderToString(fragment.tex, { throwOnError: true, strict: "error" }),
        `${JSON.stringify(value)} produced invalid TeX ${JSON.stringify(fragment.tex)}`,
      );
    }
  }
  assert.ok(expressionCount >= 3_900, `expected comprehensive math coverage, received ${expressionCount}`);
});

test("every detected A3–A14 textbook expression is valid strict KaTeX", () => {
  const lessons = course.pages
    .filter((page) => page.lesson && /^A(?:[3-9]|1[0-4])\./.test(page.lesson.id))
    .map((page) => page.lesson);
  let expressionCount = 0;

  const visit = (value, lessonId) => {
    if (typeof value === "string") {
      for (const fragment of foundationMathFragments(value)) {
        if (fragment.kind !== "math") continue;
        expressionCount += 1;
        assert.equal(
          fragment.tex.includes("/"),
          false,
          `${lessonId}: ${JSON.stringify(value)} retained slash notation in ${JSON.stringify(fragment.tex)}`,
        );
        assert.doesNotThrow(
          () => katex.renderToString(fragment.tex, { throwOnError: true, strict: "error" }),
          `${lessonId}: ${JSON.stringify(value)} produced invalid TeX ${JSON.stringify(fragment.tex)}`,
        );
      }
      return;
    }
    if (Array.isArray(value)) value.forEach((entry) => visit(entry, lessonId));
    else if (value && typeof value === "object") Object.values(value).forEach((entry) => visit(entry, lessonId));
  };

  for (const lesson of lessons) {
    visit([
      lesson.opening,
      lesson.prerequisiteChecks,
      lesson.exposition,
      lesson.method,
      lesson.definitions,
      lesson.examples,
      lesson.misconceptions,
      lesson.checkpoint,
      lesson.practiceQuestions.map(({ prompt, hint }) => ({ prompt, hint })),
      lesson.exitCheck,
      lesson.takeaway,
    ], lesson.id);
  }

  assert.ok(expressionCount >= 7_000, `expected comprehensive textbook math coverage, received ${expressionCount}`);
});
