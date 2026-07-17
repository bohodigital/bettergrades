import assert from "node:assert/strict";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("algebra-api", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

function workerRequest(worker, body, headers = { "content-type": "application/json" }, pathname = "/api/algebra") {
  return worker.fetch(new Request(`http://localhost${pathname}`, {
    method: "POST",
    headers,
    body,
  }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("algebra API rejects malformed, unknown, and over-limit requests", async () => {
  const worker = await loadWorker();
  assert.equal((await workerRequest(worker, "not-json")).status, 400);
  assert.equal((await workerRequest(worker, "[]")).status, 400);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "solve", expression: "x" }))).status, 400);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "simplify", expression: "x", extra: true }))).status, 400);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "simplify", expression: "x" }), { "content-type": "text/plain" })).status, 415);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "simplify", expression: "x".repeat(241) }))).status, 413);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "evaluate", expression: "x", assignments: `x=${"1".repeat(81)}` }))).status, 413);
  assert.equal((await workerRequest(worker, JSON.stringify({ action: "simplify", expression: "x" }), { "content-type": "application/json", "content-length": "2049" })).status, 413);
});

test("algebra API preserves simplify, compare, and evaluate result shapes", async () => {
  const worker = await loadWorker();
  const simplify = await workerRequest(worker, JSON.stringify({ action: "simplify", expression: "4x^2-3x+5x^2+2x" }));
  assert.equal(simplify.status, 200);
  assert.match(simplify.headers.get("cache-control"), /no-store/);
  const simplified = await simplify.json();
  assert.equal(simplified.status, "simplified");
  assert.equal(simplified.title, "Here is the simplified form");
  assert.match(simplified.message, /bounded Better Grades calculator service/);
  assert.equal(simplified.latex, "9x^2-x");
  assert.equal(typeof simplified.normalizedLatex, "string");

  const compare = await workerRequest(worker, JSON.stringify({ action: "compare", expression: "(x+5)(2x-3)", comparison: "2x^2+7x-15" }));
  assert.equal(compare.status, 200);
  assert.equal((await compare.json()).status, "correct");

  const evaluate = await workerRequest(worker, JSON.stringify({ action: "evaluate", expression: "x^2+2x-3", assignments: "x=4" }));
  assert.equal(evaluate.status, 200);
  const evaluated = await evaluate.json();
  assert.equal(evaluated.status, "evaluated");
  assert.equal(evaluated.latex, "21");
});

test("Limits expression grading reaches the same server-only equivalence boundary", async () => {
  const worker = await loadWorker();
  const response = await workerRequest(worker, JSON.stringify({
    id: "epsilon-linear-q1",
    answer: "epsilon / 3",
  }), { "content-type": "application/json" }, "/api/limits-check");
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "correct");
});
