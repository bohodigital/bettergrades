import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  compareAlgebraExpressions as compareThroughApi,
  evaluateAlgebraExpression as evaluateThroughApi,
  normalizeCalculatorInput,
  parseVariableAssignments,
  simplifyAlgebraExpression as simplifyThroughApi,
} from "../lib/algebra-calculator.mjs";
import {
  compareAlgebraExpressions as compareOnServer,
  evaluateAlgebraExpression as evaluateOnServer,
  simplifyAlgebraExpression as simplifyOnServer,
} from "../lib/algebra-calculator.server.mjs";
import { algebraCheckerHref, algebraPracticeProblems, looksLikeAlgebraExpression } from "../lib/algebra-practice.mjs";
import { compareLimitAnswer } from "../lib/calculus/limits-unit-checker.server.mjs";

test("stored algebra answers parse without errors and compare equal on the server", async () => {
  for (const problem of algebraPracticeProblems) {
    const result = await compareOnServer(problem.answerLatex, problem.answerLatex);
    assert.equal(result.status, "correct", problem.id);
  }
});

test("the server checker accepts materially different equivalent forms", async () => {
  const pairs = [
    [String.raw`(x+5)(2x-3)`, String.raw`2x^2+7x-15`],
    [String.raw`6x^2+11x+3`, String.raw`(3x+1)(2x+3)`],
    [String.raw`x^2+4x+4x+16`, String.raw`x^2+8x+16`],
    [String.raw`9x^4x^3`, String.raw`9x^7`],
  ];
  for (const [submitted, expected] of pairs) {
    assert.equal((await compareOnServer(submitted, expected)).status, "correct", submitted);
  }
});

test("the server checker rejects clearly wrong algebra answers", async () => {
  assert.equal((await compareOnServer(String.raw`2x^2+8x-15`, String.raw`2x^2+7x-15`)).status, "incorrect");
  assert.equal((await compareOnServer(String.raw`9x^6`, String.raw`9x^7`)).status, "incorrect");
  assert.equal((await compareOnServer(String.raw`(x+5)(2x-3)`, String.raw`2x^2+7x-15`)).status, "correct");
});

test("search recognizes expression-shaped queries and preserves them in the tool link", () => {
  assert.equal(looksLikeAlgebraExpression("(2x-3)(x+5)"), true);
  assert.equal(looksLikeAlgebraExpression("simplify 4x^2 + 2x"), true);
  assert.equal(looksLikeAlgebraExpression("integration by parts"), false);
  assert.equal(algebraCheckerHref("(2x-3)(x+5)"), "/tools/math/algebra/expression-checker/?expression=(2x-3)(x%2B5)");
});

test("keyboard input normalization and assignment validation remain client-safe", () => {
  assert.equal(normalizeCalculatorInput("simplify: (x + 2) × (x − 2)"), "(x + 2) * (x - 2)");
  assert.deepEqual(parseVariableAssignments("x=2, y=-3.5"), { assignments: { x: 2, y: -3.5 } });
  assert.match(parseVariableAssignments("x=1/2").error, /finite decimal or integer/);
  assert.match(parseVariableAssignments(`x=${"1".repeat(81)}`).error, /no more than 80 characters/);
});

test("server calculator operations retain simplify, compare, and evaluate behavior", async () => {
  const simplified = await simplifyOnServer("4x^2-3x+5x^2+2x");
  assert.equal(simplified.status, "simplified");
  assert.equal(simplified.latex, "9x^2-x");

  assert.equal((await compareOnServer("(x+5)(2x-3)", "2x^2+7x-15")).status, "correct");
  assert.equal((await compareOnServer("(x+5)(2x-3)", "2x^2+8x-15")).status, "incorrect");

  const evaluated = await evaluateOnServer("x^2+2x-3", "x=4");
  assert.equal(evaluated.status, "evaluated");
  assert.equal(evaluated.latex, "21");

  const missing = await evaluateOnServer("x+y", "x=2");
  assert.equal(missing.status, "error");
  assert.match(missing.message, /Assign y/);
});

test("Limits server grading preserves symbolic equivalence without exposing the engine to clients", async () => {
  const result = await compareLimitAnswer({
    id: "synthetic-boundary-check",
    answerType: "expression",
    canonicalAnswer: "x+x",
  }, "2x");
  assert.equal(result.status, "correct");
});

test("client operations use one bounded same-origin POST and preserve result shapes", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const payload = JSON.parse(init.body);
    const result = payload.action === "simplify"
      ? { status: "simplified", title: "Here is the simplified form", message: "Processed.", latex: "9x^2-x", normalizedLatex: payload.expression }
      : payload.action === "compare"
        ? { status: "correct", title: "These are equivalent", message: "Processed.", latex: payload.comparison, normalizedLatex: payload.expression }
        : { status: "evaluated", title: "Value calculated", message: "Processed.", latex: "21", normalizedLatex: payload.expression };
    return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
  };
  try {
    assert.equal((await simplifyThroughApi("4x^2-3x+5x^2+2x")).status, "simplified");
    assert.equal((await compareThroughApi("(x+5)(2x-3)", "2x^2+7x-15")).status, "correct");
    assert.equal((await evaluateThroughApi("x^2+2x-3", "x=4")).status, "evaluated");
    assert.equal(calls.length, 3);
    for (const call of calls) {
      assert.equal(call.url, "/api/algebra");
      assert.equal(call.init.method, "POST");
      assert.equal(call.init.mode, "same-origin");
      assert.equal(call.init.credentials, "same-origin");
      assert.equal(call.init.cache, "no-store");
    }
    assert.deepEqual(JSON.parse(calls[0].init.body), { action: "simplify", expression: "4x^2-3x+5x^2+2x" });
    assert.deepEqual(JSON.parse(calls[1].init.body), { action: "compare", expression: "(x+5)(2x-3)", comparison: "2x^2+7x-15" });
    assert.deepEqual(JSON.parse(calls[2].init.body), { action: "evaluate", expression: "x^2+2x-3", assignments: "x=4" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("client rejects over-limit input before making a request", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("fetch should not run");
  };
  try {
    assert.equal((await simplifyThroughApi("x".repeat(241))).status, "error");
    assert.equal((await compareThroughApi("x", " ")).status, "error");
    assert.equal((await evaluateThroughApi("x", `x=${"1".repeat(81)}`)).status, "error");
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("public client import graph cannot reach the symbolic engine or server modules", async () => {
  const [clientWrapper, component, limitsCore, limitsIndex, serverCalculator, algebraRoute, limitsRoute] = await Promise.all([
    readFile(new URL("../lib/algebra-calculator.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/AlgebraExpressionChecker.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/calculus/limits-unit-core.mjs", import.meta.url), "utf8"),
    readFile(new URL("../lib/calculus/limits-unit-index.mjs", import.meta.url), "utf8"),
    readFile(new URL("../lib/algebra-calculator.server.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/api/algebra/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/limits-check/route.ts", import.meta.url), "utf8"),
  ]);

  for (const source of [clientWrapper, component, limitsCore, limitsIndex]) {
    assert.doesNotMatch(source, /@cortex-js\/compute-engine|algebra-calculator\.server|limits-unit-checker\.server/);
  }
  assert.match(serverCalculator, /@cortex-js\/compute-engine/);
  assert.match(algebraRoute, /algebra-calculator\.server\.mjs/);
  assert.match(limitsRoute, /limits-unit-checker\.server\.mjs/);
  assert.doesNotMatch(limitsCore, /compareLimitAnswer|compareAlgebraExpressions/);
});
