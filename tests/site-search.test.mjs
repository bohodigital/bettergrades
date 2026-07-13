import assert from "node:assert/strict";
import test from "node:test";

import { isExpressionOnlyQuery, normalizeSearchText, rankSearchRecords } from "../lib/site-search-core.mjs";

const records = [
  {
    id: "factoring-guide",
    kind: "guide",
    title: "Factoring trinomials",
    description: "Factor a quadratic trinomial with a repeatable product-and-sum method.",
    domainName: "Algebra",
    topicName: "Polynomials & Factoring",
    label: "Method guide",
    keywords: ["factorization", "quadratic", "trinomial"],
    priority: 70,
  },
  {
    id: "line-topic",
    kind: "topic",
    title: "Linear equations and inequalities",
    description: "Graph lines, find slope, and solve linear inequalities.",
    domainName: "Algebra",
    topicName: "Linear equations",
    label: "Topic map",
    keywords: ["line", "slope", "graph"],
    priority: 80,
  },
  {
    id: "algebra-tool",
    kind: "tool",
    title: "Algebra Expression Checker",
    description: "Simplify and compare algebraic expressions in the browser.",
    domainName: "Algebra",
    label: "Interactive tool",
    keywords: ["calculator", "checker", "simplify", "evaluate"],
    priority: 95,
  },
  {
    id: "integration-practice",
    kind: "practice",
    title: "Integration method selection",
    description: "Practice choosing an integration method before doing the algebra.",
    domainName: "Calculus",
    topicName: "Integration Techniques",
    label: "Quiz",
    keywords: ["practice", "quiz", "integral", "test"],
    priority: 90,
  },
];

test("normalization makes punctuation and case irrelevant", () => {
  assert.equal(normalizeSearchText("  Factor-a TRINOMIAL! "), "factor a trinomial");
});

test("expression-only input is reserved for the expression checker", () => {
  assert.equal(isExpressionOnlyQuery("(2x-3)(x+5)"), true);
  assert.equal(isExpressionOnlyQuery(String.raw`\frac{x^2-1}{x-1}`), true);
  assert.deepEqual(rankSearchRecords(records, "(2x-3)(x+5)"), []);
  assert.equal(isExpressionOnlyQuery("d/dx"), false);
  assert.equal(isExpressionOnlyQuery("dy/dx"), false);
  assert.equal(isExpressionOnlyQuery("f'(x)"), false);
});

test("prose search ranks the best matching resource type", () => {
  assert.equal(rankSearchRecords(records, "factor a trinomial")[0]?.id, "factoring-guide");
  assert.equal(rankSearchRecords(records, "algebra calculator")[0]?.id, "algebra-tool");
  assert.equal(rankSearchRecords(records, "practice integration")[0]?.id, "integration-practice");
});

test("unrelated prose does not leak into results", () => {
  assert.deepEqual(rankSearchRecords(records, "photosynthesis chlorophyll"), []);
});
