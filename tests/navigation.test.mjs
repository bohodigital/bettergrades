import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

test("desktop and mobile navigation expose the four learner paths", async () => {
  const source = await readFile(resolve(root, "app/BetterGradesApp.tsx"), "utf8");
  for (const label of ["Learn", "Practice", "Resources", "Search"]) {
    assert.ok(source.split(`>${label}<`).length >= 3, `${label} is present in desktop and mobile navigation`);
  }
  for (const path of [
    "/subjects/math/algebra/",
    "/subjects/math/calculus/",
    "/subjects/",
    "/subjects/math/calculus/worksheets/",
    "/subjects/math/calculus/practice-exams/",
    "/subjects/math/calculus/worked-problems/",
    "/practice/",
    "/subjects/math/calculus/formula-sheets/",
    "/subjects/math/calculus/visuals/",
    "/glossary/math/",
    "/tools/",
    "/resources/",
    "/search/",
  ]) {
    assert.ok(source.split(`href="${path}"`).length >= 2, `${path} has desktop/mobile parity`);
  }
});
test("global navigation uses ordinary anchors and learner-facing language", async () => {
  const source = await readFile(resolve(root, "app/BetterGradesApp.tsx"), "utf8");
  assert.match(source, /<nav className="desktop-nav" aria-label="Primary">/);
  assert.match(source, /<nav aria-label="Mobile navigation">/);
  assert.doesNotMatch(source, /Content library|Publishing resources|Article archetypes|Learning registry/);
});

test("homepage starts with identity, search, three paths, and current subjects", async () => {
  const source = await readFile(resolve(root, "app/BetterGradesApp.tsx"), "utf8");
  const home = source.slice(source.indexOf("function HomePage()"), source.indexOf("function AnswerResult"));
  assert.match(home, /<h1>Better Grades<\/h1>/);
  assert.match(home, /Clear math lessons, practice, and references/);
  assert.match(home, /Find a topic, learn it fully, or practice the exact skill/);
  assert.ok(home.indexOf("<SearchBox large") < home.indexOf('"Learn", "Follow a complete course'));
  assert.equal((home.match(/className="path-row"/g) ?? []).length, 1, "the three choices share one mapped row template");
  assert.match(home, /<LibraryHomeSection \/>/);
});
