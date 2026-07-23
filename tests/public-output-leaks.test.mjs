import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("public-output leak scanner completed during the Pages build", async () => {
  const allowlist = JSON.parse(
    await readFile(new URL("../data/seo/public-output-leak-allowlist.json", import.meta.url), "utf8"),
  );
  assert.equal(allowlist.entries.length, 0, "every public-output exception requires an explicit reviewed entry");
  const geometricSeries = await readFile(
    new URL("../dist/pages/subjects/math/calculus/sequences-and-series/geometric-series/index.html", import.meta.url),
    "utf8",
  );
  const visibleText = geometricSeries
    .replace(/<(?:script|style|annotation)\b[^>]*>[\s\S]*?<\/(?:script|style|annotation)>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(geometricSeries, /Preserve the misconception control|described in (?:the lesson and )?storyboard/i);
  assert.doesNotMatch(visibleText, /\b(?:frac13|frac56|frac311|cdots|ldots)\b/i);
  assert.doesNotMatch(geometricSeries, /\/Users\/|\/srv\/local1\/|mankopoppi\.chatgpt\.site/i);
});
