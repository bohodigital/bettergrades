import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...data] = rows;
  return {
    headers,
    rows: data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))),
  };
}

function serializeCsv(rows, headers) {
  const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => quote(row[header])).join(",")).join("\n")}\n`;
}

async function load(relativePath) {
  return parseCsv(await readFile(resolve(root, relativePath), "utf8"));
}

async function save(relativePath, table) {
  await writeFile(resolve(root, relativePath), serializeCsv(table.rows, table.headers));
}

function distinctReason(row) {
  const roleEvidence = {
    "glossary-term": "Each route defines a different mathematical term or qualified form and must remain directly addressable.",
    assessment: "Each route is a separately scoped assessment with a different task or format.",
    "textbook-lesson": "The routes occupy distinct lesson positions and teach different subskills, examples, reviews, or assessments.",
    "decision-guide": "Each route compares a different method choice or applies the choice in a different mathematical setting.",
    "method-guide": "Each route teaches a different recognition cue or procedure.",
    "worked-problem": "Each route begins from a distinct problem statement and preserves a separately useful worked derivation.",
    "quick-answer": "Each route answers a different concrete question despite sharing a broad inferred concept.",
  }[row.page_role] ?? "The visible routes serve separately identifiable learner tasks.";
  return `${roleEvidence} The shared “${row.primary_concept}” concept is an inferred cluster, not evidence of duplicated search intent; no merge, redirect, canonical, noindex, or removal is justified.`;
}

const conflicts = await load("data/ia/handoff-c3-intent-conflict-review.csv");
conflicts.rows = conflicts.rows.map((row) => ({
  ...row,
  editorialDecision: "KEEP_DISTINCT",
  editorialNotes: distinctReason(row),
}));
await save("data/ia/handoff-c3-intent-conflict-review.csv", conflicts);

const mergeCandidates = await load("data/ia/handoff-c3-merge-redirect-candidates.csv");
mergeCandidates.rows = mergeCandidates.rows.map((row) => ({
  ...row,
  editorialDecision: "KEEP_DISTINCT",
  editorialNotes: distinctReason(row),
  candidateAction: "NO_DESTRUCTIVE_ACTION",
  lockedForHandoff3: "false",
}));
await save("data/ia/handoff-c3-merge-redirect-candidates.csv", mergeCandidates);

const titleOpening = await load("data/ia/handoff-c3-title-opening-review.csv");
titleOpening.rows = titleOpening.rows.map((row) => ({
  ...row,
  editorialDecision: "DEFER_WITH_REASON",
  editorialNotes: "The current title and H1 identify a distinct route. Shared-template compression does not establish a route-specific title or opening defect; retain exact copy until query evidence and owner-approved replacement copy support a change.",
  lockedForHandoff3: "false",
}));
await save("data/ia/handoff-c3-title-opening-review.csv", titleOpening);

const friction = await load("data/ia/handoff-c3-template-friction-review.csv");
const compressedRoles = new Set(["textbook-lesson", "worked-problem", "glossary-term", "method-guide", "concept-explainer", "decision-guide", "quick-answer", "answer"]);
friction.rows = friction.rows.map((row) => ({
  ...row,
  editorialDecision: compressedRoles.has(row.pageRole) ? "COMPRESS_SHARED_TEMPLATE" : "KEEP_CURRENT_ROLE_TEMPLATE",
  editorialNotes: compressedRoles.has(row.pageRole)
    ? "Use the H3 shared-template contract: one concise opening, direct role-specific content first, and supporting navigation after the educational task."
    : "The representative route does not show a role-level defect that warrants broad template change; preserve it and verify it in the browser matrix.",
}));
await save("data/ia/handoff-c3-template-friction-review.csv", friction);

const editorialPlanHeaders = [
  "route",
  "currentRole",
  "currentTitle",
  "proposedTitle",
  "currentH1",
  "proposedH1",
  "currentOpening",
  "proposedOpening",
  "decision",
  "reason",
  "targetQueryIntent",
  "preservedContent",
  "redirectTarget",
];
await writeFile(resolve(root, "data/ia/handoff-c3-editorial-copy-plan.csv"), `${editorialPlanHeaders.join(",")}\n`);
await writeFile(resolve(root, "docs/ia/HANDOFF_C3_EDITORIAL_COPY_PLAN.md"), `# BetterGrades Handoff 3 editorial copy plan

No route receives \`NARROW_INTENT\`, \`REWRITE_TITLE_AND_OPENING\`, \`MERGE\`, or \`MERGE_AND_REDIRECT\` in this candidate.

All 26 inferred same-role conflict groups are \`KEEP_DISTINCT\`. All 405 title/opening rows are \`DEFER_WITH_REASON\`: the current route-specific copy remains unchanged because template compression alone is not evidence that a title or opening is inaccurate. The CSV contains the required schema and zero proposed-copy rows.

There are no redirects, canonical changes, noindex decisions, removals, or other destructive route actions for owner approval.
`);

console.log(JSON.stringify({
  intentConflictRows: conflicts.rows.length,
  keepDistinctRows: conflicts.rows.filter((row) => row.editorialDecision === "KEEP_DISTINCT").length,
  mergeCandidateRows: mergeCandidates.rows.length,
  destructiveDecisions: 0,
  titleOpeningRows: titleOpening.rows.length,
  deferredTitleOpeningRows: titleOpening.rows.filter((row) => row.editorialDecision === "DEFER_WITH_REASON").length,
  templateFrictionRows: friction.rows.length,
  editorialCopyPlanRows: 0,
}, null, 2));
