import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import graph from "../data/learning-graph/graph.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");
const nodeByPath = new Map(graph.nodes.map((node) => [node.canonicalPath, node]));

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
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [headers, ...data] = rows;
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function csv(rows, headers) {
  const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => quote(row[header])).join(",")).join("\n")}\n`;
}

const articleCandidates = parseCsv(await readFile(resolve(root, "data/ia/article-lesson-candidates.csv"), "utf8"));
const articleQueue = articleCandidates.map((row) => ({
  articleId: nodeByPath.get(row.source_article)?.id ?? "",
  articlePath: row.source_article,
  articleRole: row.source_role,
  candidateLessonId: nodeByPath.get(row.candidate_lesson)?.id ?? "",
  candidateLessonPath: row.candidate_lesson,
  score: row.score,
  sharedConcepts: [row.shared_primary_concept, row.shared_secondary_concepts].filter(Boolean).join("|"),
  sharedSkills: row.shared_skills,
  contentSimilarity: row.main_content_similarity,
  intentSimilarity: row.search_intent_similarity,
  conflictFlag: "",
  recommendedDecision: row.recommended_relationship,
  recommendedPlacement: row.recommended_placement,
  recommendedAnchor: "Learn this fully",
  editorialDecision: "",
  editorialNotes: "",
}));
const articleHeaders = Object.keys(articleQueue[0]);
await writeFile(resolve(root, "data/ia/handoff-c2-article-lesson-review.csv"), csv(articleQueue, articleHeaders));

const companions = parseCsv(await readFile(resolve(root, "data/ia/lesson-companion-candidates.csv"), "utf8"));
const categoryFor = (role) => role === "worksheet" || role === "practice-exam" || role === "assessment" ? "practice" : role === "worked-problem" ? "worked-example" : role === "quick-answer" || role === "concept-explainer" || role === "method-guide" || role === "decision-guide" ? "quick-explanation" : role === "tool" || role === "visual-guide" ? "tool-or-visual" : "reference";
const best = new Map();
for (const row of companions) {
  const category = categoryFor(row.companion_role);
  const key = `${row.lesson}\0${category}`;
  const current = best.get(key);
  const score = String(row.confidence).startsWith("high") ? 3 : String(row.confidence).startsWith("medium") ? 2 : 1;
  if (!current || score > current.score) best.set(key, { row, score, category });
}
const companionQueue = [...best.values()].map(({ row, category }) => ({
  lessonId: nodeByPath.get(row.lesson)?.id ?? "",
  lessonPath: row.lesson,
  category,
  companionId: nodeByPath.get(row.companion)?.id ?? "",
  companionPath: row.companion,
  companionRole: row.companion_role,
  currentLinkExists: row.current_link_exists,
  confidence: row.confidence,
  recommendedDecision: "REVIEW",
  recommendedPlacement: category === "practice" ? "lesson-practice" : "lesson-footer",
  recommendedAnchor: category === "practice" ? "Practice this skill" : category === "worked-example" ? "See a worked example" : category === "reference" ? "Review the definition" : category === "tool-or-visual" ? "Use the tool or visual" : "See a clear explanation",
  editorialDecision: "",
  editorialNotes: "",
})).sort((a, b) => `${a.lessonPath}:${a.category}`.localeCompare(`${b.lessonPath}:${b.category}`));
await writeFile(resolve(root, "data/ia/handoff-c2-lesson-companion-review.csv"), csv(companionQueue, Object.keys(companionQueue[0])));

const conflicts = parseCsv(await readFile(resolve(root, "data/ia/search-intent-conflicts.csv"), "utf8")).map((row) => ({ ...row, editorialDecision: "", editorialNotes: "" }));
await writeFile(resolve(root, "data/ia/handoff-c3-intent-conflict-review.csv"), csv(conflicts, Object.keys(conflicts[0])));

const framing = parseCsv(await readFile(resolve(root, "data/ia/page-framing-audit.csv"), "utf8"));
const byRole = new Map();
for (const row of framing.sort((a, b) => Number(b.vertical_pixels_before_first_substantive_content) - Number(a.vertical_pixels_before_first_substantive_content))) {
  const selected = byRole.get(row.page_role) ?? [];
  if (selected.length < 3) { selected.push(row); byRole.set(row.page_role, selected); }
}
const templateQueue = [...byRole.values()].flat().map((row) => ({
  route: row.route,
  pageRole: row.page_role,
  verticalPixelsBeforeContent: row.vertical_pixels_before_first_substantive_content,
  wordsBeforeContent: row.words_before_first_substantive_content,
  navigationBlocksBeforeContent: row.navigation_blocks_before_content,
  recommendedReview: "Review representative template friction in Handoff 3",
  editorialDecision: "",
  editorialNotes: "",
}));
await writeFile(resolve(root, "data/ia/handoff-c3-template-friction-review.csv"), csv(templateQueue, Object.keys(templateQueue[0])));

console.log(JSON.stringify({
  articleLessonRows: articleQueue.length,
  lessonCompanionRows: companionQueue.length,
  intentConflictRows: conflicts.length,
  templateFrictionRows: templateQueue.length,
}));
