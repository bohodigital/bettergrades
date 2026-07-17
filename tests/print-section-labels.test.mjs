import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const printRoot = path.resolve("content/limits-continuity/latex");

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(fullPath);
    return /\.(?:sty|tex)$/.test(entry.name) ? [fullPath] : [];
  }));
  return nested.flat();
}

test("print source uses learner-visible Section wording without changing LaTeX chapter structure", async () => {
  const files = await sourceFiles(printRoot);
  assert.ok(files.length >= 30, "expected the complete modular and single-file print source");

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const learnerVisibleSource = source
      .replace(/\\chapter\*?/g, "")
      .replace(/\\(?:chaptername|thechapter)\b/g, "")
      .replace(/\{chapter\}|\[chapter\]/g, "")
      .replace(/chapters\//g, "")
      .replace(/chapter-answers/g, "");
    assert.doesNotMatch(learnerVisibleSource, /\bchapters?\b/i, path.relative(printRoot, file));
  }

  const style = await readFile(path.join(printRoot, "bettergrades-webtext.sty"), "utf8");
  assert.match(style, /\\renewcommand\{\\chaptername\}\{Section\}/);
  assert.match(style, /SECTION \\thechapter/);
  assert.match(style, /\\titleformat\{\\chapter\}/);
});
