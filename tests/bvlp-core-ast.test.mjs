import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAst, evaluateNumericAst } from "../lib/visualization/ast/evaluate.ts";
import { AstValidationError, validateNumericAst } from "../lib/visualization/ast/schema.ts";
import {
  ExpressionCompileError,
  createBuildOnlyLatexCompiler,
} from "../lib/visualization/ast/mathjson-boundary.server.ts";
import { compileVisualSpec } from "../lib/visualization/compiler/index.ts";
import { cloneFixture, makeVisualSpec } from "../lib/visualization/testkit/index.ts";

test("allowlisted AST evaluates arithmetic, safe functions, comparisons, and piecewise", () => {
  const polynomial = {
    type: "add",
    left: { type: "power", left: { type: "variable", name: "x" }, right: { type: "number", value: 2 } },
    right: { type: "number", value: 1 },
  };
  assert.equal(evaluateNumericAst(polynomial, { x: 3 }), 10);
  assert.equal(evaluateAst({ type: "lt", left: { type: "variable", name: "x" }, right: { type: "number", value: 0 } }, { x: -1 }), true);
  const piecewise = {
    type: "piecewise",
    branches: [{
      when: { type: "lt", left: { type: "variable", name: "x" }, right: { type: "number", value: 0 } },
      then: { type: "negate", operand: { type: "variable", name: "x" } },
    }],
    otherwise: { type: "variable", name: "x" },
  };
  assert.equal(evaluateNumericAst(piecewise, { x: -4 }), 4);
  assert.equal(evaluateNumericAst(piecewise, { x: 3 }), 3);
});

test("AST validation rejects unknown nodes, fields, and variables", () => {
  assert.throws(() => validateNumericAst({ type: "call", name: "alert" }), AstValidationError);
  assert.throws(() => validateNumericAst({ type: "number", value: 1, executable: true }), AstValidationError);
  assert.throws(
    () => validateNumericAst({ type: "variable", name: "secret" }, { allowedVariables: ["x"] }),
    (error) => error instanceof AstValidationError && error.code === "unknown-variable",
  );
});

test("AST depth, node, and operation budgets fail closed", () => {
  let deep = { type: "variable", name: "x" };
  for (let index = 0; index < 10; index += 1) deep = { type: "negate", operand: deep };
  assert.throws(() => validateNumericAst(deep, { maxDepth: 5 }), /depth/);
  assert.throws(() => validateNumericAst(deep, { maxNodes: 5 }), /nodes/);
  assert.throws(() => evaluateNumericAst(deep, { x: 1 }, { maxOperations: 4 }), /operations/);
});

test("build-only MathJSON boundary normalizes allowlisted CortexJS output", () => {
  const compiler = createBuildOnlyLatexCompiler(
    { parseLatexToMathJson: () => ["Add", ["Power", "x", 2], 1] },
    { allowedVariables: ["x"] },
  );
  const ast = compiler({
    route: "/limits/",
    sourceFile: "content/limits.ts",
    visualId: "limit-graph",
    layerId: "curve",
    expressionLatex: "x^2+1",
  });
  assert.equal(evaluateNumericAst(ast, { x: 2 }), 5);
});

test("build-only boundary rejects unknown operators and reports complete source context", () => {
  const compiler = createBuildOnlyLatexCompiler(
    { parseLatexToMathJson: () => ["Fetch", "https://example.invalid"] },
    { allowedVariables: ["x"] },
  );
  assert.throws(
    () => compiler({ route: "/limits/", sourceFile: "content/limits.ts", visualId: "limit-graph", layerId: "curve", expressionLatex: "bad" }),
    (error) => error instanceof ExpressionCompileError &&
      error.code === "unknown-operator" &&
      /route=\/limits\//.test(error.message) &&
      /content\/limits\.ts/.test(error.message) &&
      /limit-graph/.test(error.message) &&
      /curve/.test(error.message),
  );
});

test("compiler requires the explicit build-only callback for authored LaTeX and removes source LaTeX from scenes", () => {
  const spec = cloneFixture(makeVisualSpec());
  spec.layers[0].geometry.expression = { format: "latex", expressionLatex: "x^2" };
  assert.throws(() => compileVisualSpec(spec), /build-only CortexJS\/MathJSON/);

  const compileLatex = createBuildOnlyLatexCompiler(
    { parseLatexToMathJson: () => ["Power", "x", 2] },
    { allowedVariables: ["x", "y"] },
  );
  const scene = compileVisualSpec(spec, { compileLatex });
  assert.equal(scene.layers[0].geometry.expression.expressionLatex, undefined);
  assert.equal(scene.layers[0].geometry.expression.type, "power");
  assert.equal(JSON.stringify(scene).includes("x^2"), false);
});
