import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = resolve("content/limits-continuity/latex/appendices/answers.tex");
const outputPath = resolve("content/limits-continuity/exercise-answers.json");
const checkOnly = process.argv.includes("--check");
// Git may materialize the LaTeX source with CRLF on Windows and LF on Linux.
// Canonicalize line endings before parsing or hashing so one committed artifact
// is reproducible in every supported build environment.
const source = (await readFile(sourcePath, "utf8")).replace(/\r\n?/g, "\n");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function sliceBetween(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing answer source marker: ${startMarker}`);
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : source.length;
  if (end < 0) throw new Error(`Missing answer source boundary after: ${startMarker}`);
  return source.slice(start, end).trim();
}

function parseAnswers(sourceSlug, label, sectionSource, expectedCount) {
  const enumerate = sectionSource.match(/\\begin\{enumerate\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{enumerate\}/);
  if (!enumerate) throw new Error(`${label} is missing its enumerated answer list.`);
  const answers = enumerate[1]
    .split(/^\s*\\item\s+/m)
    .slice(1)
    .map((content, index) => ({ number: index + 1, content: content.trim() }));
  if (answers.length !== expectedCount) {
    throw new Error(`${label} has ${answers.length} answers; expected ${expectedCount}.`);
  }
  if (answers.some((answer) => !answer.content || /\\item\b/.test(answer.content))) {
    throw new Error(`${label} contains an empty or unparsed answer item.`);
  }
  return [sourceSlug, {
    label,
    sourceSha256: sha256(sectionSource),
    answers,
  }];
}

const sectionExerciseBlock = sliceBetween(
  "\\section{Section Exercise Answers}",
  "\\section{Cumulative Review Answers}",
);

function sectionExerciseAnswers(number, sourceSlug, expectedCount) {
  const marker = `\\subsection*{Section ${number}}`;
  const nextMarker = number < 6 ? `\\subsection*{Section ${number + 1}}` : undefined;
  const start = sectionExerciseBlock.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${marker}.`);
  const end = nextMarker ? sectionExerciseBlock.indexOf(nextMarker, start + marker.length) : sectionExerciseBlock.length;
  if (end < 0) throw new Error(`Missing boundary after ${marker}.`);
  return parseAnswers(sourceSlug, `Section ${number} exercise answers`, sectionExerciseBlock.slice(start, end).trim(), expectedCount);
}

const entries = [
  parseAnswers(
    "calculus/limits/prerequisite-diagnostic",
    "Prerequisite diagnostic answers",
    sliceBetween("\\section{Diagnostic Answers and Skill Map}", "\\section{Section Exercise Answers}"),
    20,
  ),
  sectionExerciseAnswers(1, "calculus/limits/meaning-practice", 42),
  sectionExerciseAnswers(2, "calculus/limits/finite-limits-practice", 58),
  sectionExerciseAnswers(3, "calculus/limits/trig-limits-practice", 38),
  sectionExerciseAnswers(4, "calculus/limits/infinite-behavior-practice", 40),
  sectionExerciseAnswers(5, "calculus/continuity/continuity-practice", 48),
  sectionExerciseAnswers(6, "calculus/limits/epsilon-delta-practice", 18),
  parseAnswers(
    "calculus/limits/cumulative-practice",
    "Cumulative review answers",
    sliceBetween("\\section{Cumulative Review Answers}", "\\section{Practice Examination A Solutions}"),
    52,
  ),
  parseAnswers(
    "calculus/limits/practice-exam-a",
    "Practice Examination A solutions",
    sliceBetween("\\section{Practice Examination A Solutions}", "\\section{Practice Examination B Solutions}"),
    18,
  ),
  parseAnswers(
    "calculus/limits/practice-exam-b",
    "Practice Examination B solutions",
    sliceBetween("\\section{Practice Examination B Solutions}", undefined),
    14,
  ),
];

const payload = {
  schemaVersion: "1.0",
  sourceFile: "appendices/answers.tex",
  sourceSha256: sha256(source),
  routes: Object.fromEntries(entries),
};

const serialized = `${JSON.stringify(payload, null, 2)}\n`;
if (checkOnly) {
  const current = (await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n");
  if (current !== serialized) throw new Error(`${outputPath} is stale. Run the answer importer and commit the deterministic artifact.`);
  console.log(`Verified ${entries.length} route answer sets and ${entries.reduce((total, [, route]) => total + route.answers.length, 0)} source-traced answers.`);
} else {
  await writeFile(outputPath, serialized, "utf8");
  console.log(`Imported ${entries.length} route answer sets with ${entries.reduce((total, [, route]) => total + route.answers.length, 0)} answers to ${outputPath}.`);
}
