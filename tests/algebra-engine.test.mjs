import assert from "node:assert/strict";
import test from "node:test";
import { ComputeEngine } from "@cortex-js/compute-engine";
import { hasNumericCounterexample } from "../lib/algebra-equivalence.mjs";
import { algebraCheckerHref, algebraPracticeProblems, looksLikeAlgebraExpression } from "../lib/algebra-practice.mjs";

test("stored algebra answers parse without errors and compare equal", () => {
  const engine = new ComputeEngine();
  for (const problem of algebraPracticeProblems) {
    const answer = engine.parse(problem.answerLatex);
    assert.equal(answer.errors.length, 0, problem.id);
    assert.equal(answer.isEqual(engine.parse(problem.answerLatex)), true, problem.id);
  }
});

test("the checker accepts materially different equivalent forms", () => {
  const engine = new ComputeEngine();
  const pairs = [
    [String.raw`(x+5)(2x-3)`, String.raw`2x^2+7x-15`],
    [String.raw`6x^2+11x+3`, String.raw`(3x+1)(2x+3)`],
    [String.raw`x^2+4x+4x+16`, String.raw`x^2+8x+16`],
    [String.raw`9x^4x^3`, String.raw`9x^7`],
  ];
  for (const [submitted, expected] of pairs) assert.equal(engine.parse(submitted).isEqual(engine.parse(expected)), true, submitted);
});

test("clearly wrong algebra answers compare false", () => {
  const engine = new ComputeEngine();
  assert.equal(hasNumericCounterexample(engine.parse(String.raw`2x^2+8x-15`), engine.parse(String.raw`2x^2+7x-15`)), true);
  assert.equal(hasNumericCounterexample(engine.parse(String.raw`9x^6`), engine.parse(String.raw`9x^7`)), true);
  assert.equal(hasNumericCounterexample(engine.parse(String.raw`(x+5)(2x-3)`), engine.parse(String.raw`2x^2+7x-15`)), false);
});

test("search recognizes expression-shaped queries and preserves them in the tool link", () => {
  assert.equal(looksLikeAlgebraExpression("(2x-3)(x+5)"), true);
  assert.equal(looksLikeAlgebraExpression("simplify 4x^2 + 2x"), true);
  assert.equal(looksLikeAlgebraExpression("integration by parts"), false);
  assert.equal(algebraCheckerHref("(2x-3)(x+5)"), "/tools/math/algebra/expression-checker/?expression=(2x-3)(x%2B5)");
});
