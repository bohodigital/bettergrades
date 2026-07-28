import { expect, test } from "@playwright/test";

test("complete Algebra hub exposes all fifteen units and preserves the quick-guide layer", async ({ page }) => {
  await page.goto("/subjects/math/algebra/");
  await expect(page.locator("h1")).toHaveText("Algebra: Quantities, Equations, and Structure");
  await expect(page.locator(".algebra-course-map .limits-chapter")).toHaveCount(15);
  await expect(page.locator(".algebra-legacy-layer .limits-support-grid").first().locator("a")).toHaveCount(36);
  await expect(page.locator("main")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("interactive Algebra lesson retains three BVLP fallbacks and hydrates only its requested scene", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  await expect(page.locator("h1")).toHaveText("Number lines and signed quantities");
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(3);
  await expect(page.locator("[data-static-fallback=retained] img")).toHaveCount(3);
  await expect(page.locator("[data-bvlp-renderer=bg-interactive-2d]")).toHaveCount(1);
  await expect(page.locator(".algebra-exercise-families article")).toHaveCount(5);
  await expect(page.locator("[data-check-id=lesson-a0-1-checkpoint]")).toHaveCount(1);
});

test("static Algebra lesson ships no interactive slot", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/whole-number-operations-and-estimation/");
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(3);
  await expect(page.locator("[data-bvlp-renderer=static-svg]")).toHaveCount(3);
  await expect(page.locator(".bvlp-interactive-slot")).toHaveCount(0);
});

test("the compact rational-expression guide remains canonical beside the distinct full-course lesson", async ({ page }) => {
  await page.goto("/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/");
  await expect(page.locator("h1")).toContainText("Simplifying rational expressions by factors");
  await expect(page.locator(".algebra-course-page")).toHaveCount(0);
  await page.goto("/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/");
  await expect(page.locator("h1")).toHaveText("Simplifying rational expressions");
  await expect(page.locator("[data-unit-id=algebra-unit-a10]")).toHaveCount(1);
});

test("open-response checks stay locked until an attempt and reveal only a rubric", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  const check = page.locator("[data-check-id=lesson-a0-1-checkpoint]");
  await expect(check.locator("summary")).toContainText("Attempt once");
  await check.locator("textarea").fill("I would place the values on one number line, compare their positions, and verify the sign and distance from zero.");
  await check.getByRole("button", { name: "Submit attempt" }).click();
  await expect(check.locator(".limits-check-feedback")).toContainText("open response");
  await expect(check.locator("summary")).toContainText("Compare with");
  await check.locator("summary").click();
  await expect(check.locator("details p")).toContainText("A strong response demonstrates");
});
