import { expect, test } from "@playwright/test";

test("complete Algebra hub omits decorative artwork and exposes expandable fifteen-unit contents", async ({ page }) => {
  await page.goto("/subjects/math/algebra/");
  await expect(page.locator("h1")).toHaveText("Algebra: Quantities, Equations, and Structure");
  const units = page.locator(".algebra-course-unit");
  await expect(units).toHaveCount(15);
  await expect(page.locator(".algebra-course-art")).toHaveCount(0);
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

test("mobile Algebra contents keep every unit disclosure in bounds without decorative artwork", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/algebra/");
  await expect(page.locator(".algebra-course-art")).toHaveCount(0);
  const units = page.locator(".algebra-course-unit");
  await expect(units).toHaveCount(15);
  await units.last().locator("summary").click();
  await expect(units.last()).toHaveAttribute("open", "");
  await expect(units.last().locator('nav[aria-label="Unit A14 lessons"] a')).toHaveCount(7);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test("non-graph Algebra lesson omits its former instructional images", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  await expect(page.locator("h1")).toHaveText("Number lines and signed quantities");
  await expect(page.locator(".algebra-figure-sequence")).toHaveCount(0);
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(0);
  await expect(page.locator(".algebra-exercise-families article")).toHaveCount(20);
  await expect(page.locator("[data-check-id=a0-1-q20]")).toHaveCount(1);
});

test("static non-graph Algebra lesson ships no figure section or interactive slot", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/whole-number-operations-and-estimation/");
  await expect(page.locator(".algebra-figure-sequence")).toHaveCount(0);
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(0);
  await expect(page.locator(".bvlp-interactive-slot")).toHaveCount(0);
});

test("function-graph Algebra lesson keeps only its actual function graph", async ({ page }) => {
  await page.goto("/subjects/math/algebra/quadratic-functions/graphing-parabolas/");
  await expect(page.locator(".algebra-figure-sequence")).toHaveCount(1);
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(1);
  await expect(page.locator("[data-bvlp-visual=algebra-a9-2-v1]")).toHaveCount(1);
  await expect(page.locator("[data-bvlp-renderer=bg-interactive-2d]")).toHaveCount(1);
});

test("A0–A2 lessons organize authored practice into usable rounds with optional hints", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/algebra/linear-equations/multistep-linear-equations/");
  const practice = page.locator(".algebra-foundation-practice");
  await expect(practice.locator(".algebra-practice-group")).toHaveCount(4);
  await expect(practice.locator(".algebra-exercise-families article")).toHaveCount(20);
  await expect(page.locator(".algebra-authored-method li")).toHaveCount(4);
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

test("A3–A14 each render as complete, restrained textbook lessons", async ({ page }) => {
  const routes = [
    "/subjects/math/algebra/inequalities-absolute-value/inequalities-and-truth-sets/",
    "/subjects/math/algebra/linear-relationships/ratios-and-equivalent-ratios/",
    "/subjects/math/algebra/systems/systems-as-simultaneous-conditions/",
    "/subjects/math/algebra/exponents-roots/exponents-as-repeated-multiplication/",
    "/subjects/math/algebra/polynomial-operations/polynomial-vocabulary-and-evaluation/",
    "/subjects/math/algebra/factoring-quadratics/factoring-as-reverse-distribution-and-gcf/",
    "/subjects/math/algebra/quadratic-functions/quadratic-relations-and-three-useful-forms/",
    "/subjects/math/algebra/rational-expressions/rational-expressions-and-restrictions/",
    "/subjects/math/algebra/radicals-complex-numbers/general-nth-roots-and-principal-roots/",
    "/subjects/math/algebra/functions/relations-and-functions/",
    "/subjects/math/algebra/exponential-logarithmic/additive-versus-multiplicative-patterns/",
    "/subjects/math/algebra/precalculus-readiness/classifying-mathematical-objects/",
  ];

  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator(".algebra-lesson-exposition > div > p"), route).toHaveCount(10);
    await expect(page.locator(".algebra-authored-method li"), route).toHaveCount(3);
    await expect(page.locator(".algebra-worked-examples article"), route).toHaveCount(3);
    await expect(page.locator(".algebra-practice-group"), route).toHaveCount(4);
    await expect(page.locator(".algebra-exercise-families article"), route).toHaveCount(20);
    expect(await page.locator(".algebra-course-page .latex-inline").count(), route).toBeGreaterThan(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), route).toBe(true);
  }
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
  const check = page.locator("[data-check-id=a0-1-q20]");
  await expect(check.locator("summary")).toContainText("Attempt once");
  await check.locator("textarea").fill("The first error is treating subtraction of a negative as adding another negative. Rewrite −4 − (−9) as −4 + 9, which equals 5, and check that subtracting 9 returns −4.");
  await check.getByRole("button", { name: "Submit attempt" }).click();
  await expect(check.locator(".limits-check-feedback")).toContainText("open response");
  await expect(check.locator("summary")).toContainText("Compare with");
  await check.locator("summary").click();
  await expect(check.locator("details p")).toContainText("The response must address");
  await expect(check.locator("details p")).toContainText("Worked solution:");
});
