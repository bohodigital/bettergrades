import assert from "node:assert/strict";
import test from "node:test";

import katex from "katex";

import { foundationMathFragments } from "../lib/algebra/foundation-math.mjs";
import { A0_PROFILES } from "../tools/algebra-foundations/a0.mjs";
import { A1_PROFILES } from "../tools/algebra-foundations/a1.mjs";
import { A2_PROFILES } from "../tools/algebra-foundations/a2.mjs";

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
});

test("every detected A0–A2 expression is valid strict KaTeX", () => {
  const strings = [];
  const visit = (value) => {
    if (typeof value === "string") strings.push(value);
    else if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === "object") Object.values(value).forEach(visit);
  };
  visit({ A0_PROFILES, A1_PROFILES, A2_PROFILES });

  let expressionCount = 0;
  for (const value of strings) {
    for (const fragment of foundationMathFragments(value)) {
      if (fragment.kind !== "math") continue;
      expressionCount += 1;
      assert.doesNotThrow(
        () => katex.renderToString(fragment.tex, { throwOnError: true, strict: "error" }),
        `${JSON.stringify(value)} produced invalid TeX ${JSON.stringify(fragment.tex)}`,
      );
    }
  }
  assert.ok(expressionCount >= 2_700, `expected comprehensive math coverage, received ${expressionCount}`);
});
