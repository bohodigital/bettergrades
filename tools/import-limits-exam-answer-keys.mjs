import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = resolve("content/limits-continuity/latex/appendices/answers.tex");
const outputPath = resolve("content/limits-continuity/exam-answer-keys.json");
const source = (await readFile(sourcePath, "utf8")).replace(/\r\n?/g, "\n");
const checkOnly = process.argv.includes("--check");

function extractKey(exam, expectedCount, nextHeading) {
  const heading = `Practice Examination ${exam} Solutions`;
  const marker = `\\section{${heading}}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing answer-key source heading: ${heading}`);
  const end = nextHeading ? source.indexOf(`\\section{${nextHeading}}`, start + marker.length) : source.length;
  if (end < 0) throw new Error(`Missing answer-key boundary after ${heading}`);
  const sectionSource = source.slice(start, end).trim();
  const enumerate = sectionSource.match(/\\begin\{enumerate\}\[[^\]]*\]([\s\S]*?)\\end\{enumerate\}/);
  if (!enumerate) throw new Error(`Missing enumerated answers under ${heading}`);
  const answers = enumerate[1]
    .split(/^\s*\\item\s+/m)
    .slice(1)
    .map((content, index) => ({ number: index + 1, content: content.trim() }));
  if (answers.length !== expectedCount) throw new Error(`${heading} has ${answers.length} answers; expected ${expectedCount}.`);
  if (answers.some((answer) => !answer.content || /\\item\b/.test(answer.content))) throw new Error(`${heading} contains an unparsed answer item.`);
  return {
    exam,
    sourceHeading: heading,
    sourceSha256: createHash("sha256").update(sectionSource).digest("hex"),
    answers,
  };
}

const payload = {
  schemaVersion: "1.0",
  sourceFile: "appendices/answers.tex",
  sourceSha256: createHash("sha256").update(source).digest("hex"),
  keys: [
    extractKey("A", 18, "Practice Examination B Solutions"),
    extractKey("B", 14),
  ],
};

const serialized = `${JSON.stringify(payload, null, 2)}\n`;
if (checkOnly) {
  const current = (await readFile(outputPath, "utf8")).replace(/\r\n?/g, "\n");
  if (current !== serialized) throw new Error(`${outputPath} is stale. Run the exam-key importer and commit the deterministic artifact.`);
  console.log(`Verified ${payload.keys.length} exam answer keys with ${payload.keys.reduce((total, key) => total + key.answers.length, 0)} source-traced answers.`);
} else {
  await writeFile(outputPath, serialized, "utf8");
  console.log(`Imported ${payload.keys.length} exam answer keys with ${payload.keys.reduce((total, key) => total + key.answers.length, 0)} answers to ${outputPath}.`);
}
