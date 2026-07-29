import { expect, test } from "@playwright/test";

test("complete Algebra hub exposes its course portrait and expandable fifteen-unit contents", async ({ page }) => {
  await page.goto("/subjects/math/algebra/");
  await expect(page.locator("h1")).toHaveText("Algebra: Quantities, Equations, and Structure");
  const units = page.locator(".algebra-course-unit");
  await expect(units).toHaveCount(15);
  await expect(page.locator(".algebra-course-art img")).toBeVisible();
  await expect(page.locator(".algebra-course-art img")).toHaveAttribute("src", "/og-algebra.png");
  await expect(units.filter({ has: page.locator("summary") }).locator("summary")).toHaveCount(15);
  await expect(page.locator(".algebra-course-unit[open]")).toHaveCount(0);
  await units.first().locator("summary").click();
  await expect(units.first()).toHaveAttribute("open", "");
  await expect(units.first().locator('nav[aria-label="Unit A0 lessons"] a')).toHaveCount(10);
  await expect(units.first().locator(".algebra-course-support-links a")).toHaveCount(5);
  await expect(page.locator(".algebra-legacy-layer .limits-support-grid").first().locator("a")).toHaveCount(36);
  await expect(page.locator("main")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("mobile Algebra contents keep the course portrait and every unit disclosure in bounds", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/algebra/");
  await expect(page.locator(".algebra-course-art img")).toBeVisible();
  const units = page.locator(".algebra-course-unit");
  await expect(units).toHaveCount(15);
  await units.last().locator("summary").click();
  await expect(units.last()).toHaveAttribute("open", "");
  await expect(units.last().locator('nav[aria-label="Unit A14 lessons"] a')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("interactive Algebra lesson retains three BVLP fallbacks and hydrates only its requested scene", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  await expect(page.locator("h1")).toHaveText("Number lines and signed quantities");
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(3);
  await expect(page.locator("[data-static-fallback=retained] img")).toHaveCount(3);
  await expect(page.locator("[data-bvlp-renderer=bg-interactive-2d]")).toHaveCount(1);
  await expect(page.locator(".algebra-exercise-families article")).toHaveCount(16);
  await expect(page.locator("[data-check-id=a0-1-q16]")).toHaveCount(1);
});

test("static Algebra lesson ships no interactive slot", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/whole-number-operations-and-estimation/");
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(3);
  await expect(page.locator("[data-bvlp-renderer=static-svg]")).toHaveCount(3);
  await expect(page.locator(".bvlp-interactive-slot")).toHaveCount(0);
});

test("A0–A2 lessons organize authored practice into usable rounds with optional hints", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/algebra/linear-equations/multistep-linear-equations/");
  const practice = page.locator(".algebra-foundation-practice");
  await expect(practice.locator(".algebra-practice-group")).toHaveCount(4);
  await expect(practice.locator(".algebra-exercise-families article")).toHaveCount(16);
  await expect(practice.locator(".algebra-question-hint[open]")).toHaveCount(0);
  const firstHint = practice.locator(".algebra-question-hint").first();
  await firstHint.locator("summary").click();
  await expect(firstHint).toHaveAttribute("open", "");
  await expect(firstHint.locator("p")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("A0–A2 lessons render accessible KaTeX instead of plain Unicode lookalikes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/algebra/linear-equations/multistep-linear-equations/");
  const math = page.locator(".algebra-course-page .latex-inline");
  expect(await math.count()).toBeGreaterThanOrEqual(50);
  await expect(math.first().locator(".katex")).toHaveCount(1);
  await expect(math.first().locator(".katex-mathml math")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("the compact rational-expression guide remains canonical beside the distinct full-course lesson", async ({ page }) => {
  await page.goto("/subjects/math/algebra/rational-expressions/simplifying-rational-expressions/");
  await expect(page.locator("h1")).toContainText("Simplifying rational expressions by factors");
  await expect(page.locator(".algebra-course-page")).toHaveCount(0);
  await page.goto("/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/");
  await expect(page.locator("h1")).toHaveText("Simplifying rational expressions");
  await expect(page.locator("[data-unit-id=algebra-unit-a10]")).toHaveCount(1);
});

test("open-response checks stay locked until an attempt and then reveal the protected guide", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  const check = page.locator("[data-check-id=a0-1-q16]");
  await expect(check.locator("summary")).toContainText("Attempt once");
  await check.locator("textarea").fill("I would place the values on one number line, compare their positions, and verify the sign and distance from zero.");
  await check.getByRole("button", { name: "Submit attempt" }).click();
  await expect(check.locator(".limits-check-feedback")).toContainText("open response");
  await expect(check.locator("summary")).toContainText("Compare with");
  await check.locator("summary").click();
  await expect(check.locator("details p")).toContainText("The response must address");
  await expect(check.locator("details p")).toContainText("Worked solution:");
});
