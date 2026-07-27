import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted;
    } else if (character === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = "";
    } else cell += character;
  }
  const [headers, ...data] = rows;
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

const validDecisions = new Set(["KEEP_DISTINCT", "NARROW_INTENT", "REWRITE_TITLE_AND_OPENING", "MERGE", "MERGE_AND_REDIRECT", "CANONICALIZE", "NOINDEX", "REMOVE", "DEFER_WITH_REASON"]);
const destructive = new Set(["MERGE", "MERGE_AND_REDIRECT", "CANONICALIZE", "NOINDEX", "REMOVE"]);

test("all 26 same-role conflict groups have valid, reasoned decisions", async () => {
  const rows = parseCsv(await readFile(new URL("../data/ia/handoff-c3-intent-conflict-review.csv", import.meta.url), "utf8"));
  assert.equal(rows.length, 26);
  for (const row of rows) {
    assert.ok(validDecisions.has(row.editorialDecision), `${row.primary_concept}/${row.page_role} lacks a valid decision`);
    assert.ok(row.editorialNotes.length >= 80, `${row.primary_concept}/${row.page_role} lacks a substantive reason`);
    if (destructive.has(row.editorialDecision)) assert.match(row.editorialNotes, /redirect|canonical|preserv|rationale/i);
  }
});

test("candidate applies no destructive route decision", async () => {
  const rows = parseCsv(await readFile(new URL("../data/ia/handoff-c3-merge-redirect-candidates.csv", import.meta.url), "utf8"));
  assert.equal(rows.length, 26);
  assert.deepEqual([...new Set(rows.map((row) => row.editorialDecision))], ["KEEP_DISTINCT"]);
  assert.ok(rows.every((row) => row.candidateAction === "NO_DESTRUCTIVE_ACTION"));
});

test("title and opening queue is fully dispositioned without unapproved copy", async () => {
  const rows = parseCsv(await readFile(new URL("../data/ia/handoff-c3-title-opening-review.csv", import.meta.url), "utf8"));
  assert.equal(rows.length, 405);
  assert.ok(rows.every((row) => row.editorialDecision === "DEFER_WITH_REASON" && row.editorialNotes.length > 80));
  const plan = parseCsv(await readFile(new URL("../data/ia/handoff-c3-editorial-copy-plan.csv", import.meta.url), "utf8"));
  assert.equal(plan.length, 0);
});
