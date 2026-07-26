import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const duplicateThreshold = 0.72;
const instructionalRoles = new Set(["answer", "quick-answer", "concept-explainer", "method-guide", "decision-guide"]);
const primaryRoles = new Set(["textbook-lesson", "course-hub", "topic-hub", "unit-hub"]);

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
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...data] = rows;
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toCsv(rows, headers) {
  return `${[headers, ...rows.map((row) => headers.map((header) => row[header] ?? ""))]
    .map((row) => row.map(csvCell).join(","))
    .join("\n")}\n`;
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function writeOrCheck(path, content) {
  if (check) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== content) throw new Error(`Handoff C2 relationship output drift: ${path.replace(`${root}/`, "")}`);
  } else await writeFile(path, content);
}

const graph = JSON.parse(await readFile(resolve(root, "data/learning-graph/graph.json"), "utf8"));
const reviewRows = parseCsv(await readFile(resolve(root, "data/ia/handoff-c2-article-lesson-review.csv"), "utf8"));
const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
const rowsBySource = Map.groupBy(reviewRows, (row) => row.articleId);
const decisions = [];
const approved = [];
const deferred = [];

for (const source of graph.nodes.filter((node) => node.nodeType === "article").sort((left, right) => left.canonicalPath.localeCompare(right.canonicalPath))) {
  const candidates = rowsBySource.get(source.id) ?? [];
  const evaluated = candidates.map((row) => {
    const target = nodeById.get(row.candidateLessonId);
    const sharedSkillIds = target ? source.skillIds.filter((id) => target.skillIds.includes(id)) : [];
    const conditions = {
      samePrimaryConcept: Boolean(source.primaryConceptId && source.primaryConceptId === target?.primaryConceptId),
      exactSharedSkill: sharedSkillIds.length > 0,
      complementaryRoles: instructionalRoles.has(source.pageRole) && target?.pageRole === "textbook-lesson",
      canonicalIndexableTarget: target?.status === "published" && target?.indexPolicy === "index" && target.formerPaths.length === 0,
      exactLessonTarget: target?.nodeType === "textbook-lesson" && target?.pageRole === "textbook-lesson",
      belowDuplicateThreshold: Number(row.contentSimilarity) < duplicateThreshold,
      noConflictFlag: !row.conflictFlag,
      distinctIntentSurface: source.canonicalPath !== target?.canonicalPath && source.shortTitle !== target?.shortTitle,
    };
    return { row, target, sharedSkillIds, conditions, eligible: Object.values(conditions).every(Boolean) };
  });
  const highestScore = evaluated.length ? Math.max(...evaluated.map((candidate) => Number(candidate.row.score))) : null;
  const highest = highestScore === null ? [] : evaluated.filter((candidate) => Number(candidate.row.score) === highestScore);
  const exact = highest.length === 1 && highest[0].eligible ? highest[0] : null;

  let decision = "NO_EXACT_TEXTBOOK_MATCH";
  let deferReason = "";
  if (primaryRoles.has(source.pageRole)) {
    decision = "ARTICLE_IS_PRIMARY_DESTINATION";
    deferReason = "The audited source is already a primary lesson or hub, not a short-form companion.";
  } else if (!instructionalRoles.has(source.pageRole)) {
    decision = "CONSOLIDATION_DEFERRED";
    deferReason = `Source role ${source.pageRole} requires editorial role correction before relationship approval.`;
  } else if (exact) {
    decision = "EXACT_TEXTBOOK_MATCH";
  } else if (highest.length > 1) {
    decision = "INTENT_CONFLICT_DEFERRED";
    deferReason = "Multiple equally ranked eligible lessons require editorial intent adjudication.";
  } else if (candidates.some((row) => row.conflictFlag)) {
    decision = "INTENT_CONFLICT_DEFERRED";
    deferReason = "The audit marked an unresolved intent conflict.";
  } else {
    const failing = evaluated.flatMap((candidate) => Object.entries(candidate.conditions).filter(([, passes]) => !passes).map(([name]) => name));
    deferReason = failing.length ? `No candidate passed every exactness condition: ${Array.from(new Set(failing)).sort().join(", ")}.` : "No exact textbook lesson candidate exists.";
  }

  const target = exact?.target;
  const record = {
    sourceId: source.id,
    sourcePath: source.canonicalPath,
    decision,
    targetId: target?.id ?? "",
    targetPath: target?.canonicalPath ?? "",
    relationshipType: target ? "full_version_of" : "",
    placement: target ? "article-intro" : "",
    anchorText: target ? target.shortTitle : "",
    approvalBasis: target
      ? `Exact primary concept ${source.primaryConceptId}; shared skill ${exact.sharedSkillIds[0]}; complementary short-form and textbook roles; unique highest eligible candidate; canonical published index target; similarity ${exact.row.contentSimilarity} below ${duplicateThreshold}.`
      : "",
    confidence: target ? "high" : "",
    deferReason,
  };
  decisions.push(record);
  if (target) approved.push(record);
  else deferred.push({ ...record, candidatesReviewed: candidates.length });
}

const headers = ["sourceId", "sourcePath", "decision", "targetId", "targetPath", "relationshipType", "placement", "anchorText", "approvalBasis", "confidence", "deferReason"];
await writeOrCheck(resolve(root, "data/ia/handoff-c2-approved-article-lesson-map.json"), stableJson(approved));
await writeOrCheck(resolve(root, "data/ia/handoff-c2-deferred-article-lesson-map.json"), stableJson(deferred));
await writeOrCheck(resolve(root, "data/ia/handoff-c2-article-decisions.csv"), toCsv(decisions, headers));

const companionRows = parseCsv(await readFile(resolve(root, "data/ia/handoff-c2-lesson-companion-review.csv"), "utf8"));
const companionByLessonAndCategory = new Map(companionRows.map((row) => [`${row.lessonId}\0${row.category}`, row]));
const companionCategories = ["practice", "quick-explanation", "worked-example", "reference", "tool-or-visual"];
const exactCompanionPairs = new Set([
  "/subjects/math/calculus/derivative-applications/anatomy-of-optimization/\0/subjects/math/calculus/worksheets/optimization/",
  "/subjects/math/calculus/derivative-applications/anatomy-of-optimization/\0/subjects/math/calculus/derivative-applications/optimization/",
  "/subjects/math/calculus/derivative-applications/anatomy-of-optimization/\0/subjects/math/calculus/worked-problems/fencing-optimization/",
  "/subjects/math/calculus/derivative-applications/anatomy-of-optimization/\0/glossary/math/optimization/",
  "/subjects/math/calculus/derivative-applications/curve-sketching/\0/subjects/math/calculus/derivative-applications/curve-sketching-from-derivatives/",
  "/subjects/math/calculus/derivatives/chain-rule-basic/\0/subjects/math/calculus/worksheets/chain-rule/",
  "/subjects/math/calculus/integrals/average-value-of-a-function/\0/subjects/math/calculus/integration-applications/average-value-of-a-function/",
  "/subjects/math/calculus/integrals/integration-by-parts/\0/subjects/math/calculus/worksheets/integration-by-parts/",
  "/subjects/math/calculus/integrals/integration-by-parts/\0/learn/calculus/integration-by-parts/",
  "/subjects/math/calculus/integrals/integration-by-parts/\0/subjects/math/calculus/worked-problems/integration-by-parts-log-x/",
  "/subjects/math/calculus/integrals/integration-by-parts/\0/glossary/math/integration-by-parts/",
  "/subjects/math/calculus/limits-continuity/unit/continuity/continuity-at-a-point/\0/subjects/math/calculus/limits-continuity/continuity-at-a-point/",
  "/subjects/math/calculus/limits-continuity/unit/continuity/continuity-at-a-point/\0/glossary/math/continuity/",
  "/subjects/math/calculus/power-series-and-taylor-series/taylor-series-centered-at-a/\0/subjects/math/calculus/worksheets/taylor-series/",
  "/subjects/math/calculus/sequences-and-series/geometric-series/\0/subjects/math/calculus/worksheets/geometric-series/",
  "/subjects/math/calculus/sequences-and-series/geometric-series/\0/subjects/math/calculus/worked-problems/shifted-geometric-series/",
  "/subjects/math/calculus/sequences-and-series/geometric-series/\0/glossary/math/geometric-series/",
]);
const categoryRelationship = {
  "practice": "practices",
  "quick-explanation": "explains",
  "worked-example": "explains",
  "reference": "references",
  "tool-or-visual": "visualizes",
};
const categoryAnchor = {
  "practice": "Practice this skill",
  "quick-explanation": "See a quick explanation",
  "worked-example": "See a worked example",
  "reference": "Review the definition",
  "tool-or-visual": "Use the tool or visual",
};
const lessonDecisions = [];
const approvedLessonCompanions = [];
const deferredLessonCompanions = [];
for (const lesson of graph.nodes.filter((node) => node.nodeType === "textbook-lesson").sort((left, right) => left.canonicalPath.localeCompare(right.canonicalPath))) {
  for (const category of companionCategories) {
    const row = companionByLessonAndCategory.get(`${lesson.id}\0${category}`);
    const target = row ? nodeById.get(row.companionId) : undefined;
    const pairKey = target ? `${lesson.canonicalPath}\0${target.canonicalPath}` : "";
    const approvedPair = Boolean(target && exactCompanionPairs.has(pairKey));
    const record = {
      lessonId: lesson.id,
      lessonPath: lesson.canonicalPath,
      category,
      decision: approvedPair ? "APPROVED_EXACT_COMPANION" : row ? "DEFERRED_EDITORIAL_REVIEW" : "NO_CANDIDATE",
      targetId: approvedPair ? target.id : "",
      targetPath: approvedPair ? target.canonicalPath : "",
      relationshipType: approvedPair ? categoryRelationship[category] : "",
      placement: approvedPair ? category === "practice" ? "lesson-intro" : "lesson-footer" : "",
      anchorText: approvedPair ? categoryAnchor[category] : "",
      approvalBasis: approvedPair ? "Manually adjudicated exact concept and instructional skill; complementary role; canonical published destination; one selected companion in this category." : "",
      confidence: approvedPair ? "high" : "",
      deferReason: approvedPair ? "" : row ? "Candidate remains provisional because broad inferred concept/skill overlap does not prove an exact learner action." : "No candidate was produced for this lesson and role.",
    };
    lessonDecisions.push(record);
    if (approvedPair) approvedLessonCompanions.push(record);
    else deferredLessonCompanions.push(record);
  }
}
const lessonHeaders = ["lessonId", "lessonPath", "category", "decision", "targetId", "targetPath", "relationshipType", "placement", "anchorText", "approvalBasis", "confidence", "deferReason"];
await writeOrCheck(resolve(root, "data/ia/handoff-c2-approved-lesson-companion-map.json"), stableJson(approvedLessonCompanions));
await writeOrCheck(resolve(root, "data/ia/handoff-c2-deferred-lesson-companion-map.json"), stableJson(deferredLessonCompanions));
await writeOrCheck(resolve(root, "data/ia/handoff-c2-lesson-companion-decisions.csv"), toCsv(lessonDecisions, lessonHeaders));

console.log(JSON.stringify({
  articles: decisions.length,
  approved: approved.length,
  deferred: deferred.length,
  exactTextbookMatches: decisions.filter((row) => row.decision === "EXACT_TEXTBOOK_MATCH").length,
  lessonRoleEvaluations: lessonDecisions.length,
  approvedLessonCompanions: approvedLessonCompanions.length,
  deferredLessonCompanions: deferredLessonCompanions.length,
  mode: check ? "check" : "generate",
}));
