import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/subjects/math/algebra/",
  "/subjects/math/algebra/arithmetic-readiness/",
  "/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/",
  "/subjects/math/algebra/polynomials-factoring/factoring-trinomials/",
  "/subjects/math/algebra/rational-expressions/simplifying-rational-expressions-course/",
  "/subjects/math/algebra/precalculus-readiness/",
];

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobile", { width: 390, height: 844 }],
  ["small-mobile", { width: 320, height: 700 }],
];

const interactiveRoutes = [
  "/subjects/math/algebra/inequalities-absolute-value/absolute-value-as-distance/",
  "/subjects/math/algebra/linear-relationships/slope-from-graphs-and-tables/",
  "/subjects/math/algebra/linear-relationships/parallel-and-perpendicular-lines/",
  "/subjects/math/algebra/exponents-roots/power-function-preview/",
  "/subjects/math/algebra/quadratic-functions/graphing-parabolas/",
  "/subjects/math/algebra/quadratic-functions/vertex-form-and-transformations/",
  "/subjects/math/algebra/functions/range-and-graph-behavior/",
  "/subjects/math/algebra/exponential-logarithmic/exponential-functions/",
];

for (const [name, viewport] of viewports) {
  test(`remediated Algebra surfaces are complete and bounded at ${name}`, async ({ browser }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !/googletagmanager|analytics\.bohodigitalservices/.test(message.text())) consoleErrors.push(message.text());
    });
    for (const route of representativeRoutes) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main"), route).toHaveCount(1);
      await expect(page.locator("h1"), route).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(1);
      expect(await page.locator("main").innerText(), route).not.toMatch(/blueprint|authoring|placeholder|undefined/i);
    }
    expect(consoleErrors).toEqual([]);
    await context.close();
  });
}

test("Algebra lessons remain substantive without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  await expect(page.locator(".algebra-figure-sequence")).toHaveCount(0);
  await expect(page.locator("[data-bvlp-visual]")).toHaveCount(0);
  await expect(page.locator(".algebra-exercise-families article")).toHaveCount(20);
  expect((await page.locator("main").innerText()).length).toBeGreaterThan(5_000);
  await context.close();
});

test("Algebra lesson print layout remains bounded after non-graph figures are removed", async ({ page }) => {
  await page.goto("/subjects/math/algebra/arithmetic-readiness/number-lines-and-signed-quantities/");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".algebra-figure-sequence")).toHaveCount(0);
  await expect(page.locator("[data-static-fallback=retained] img")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("all eight retained function-graph interactives respond to keyboard input", async ({ page }) => {
  for (const route of interactiveRoutes) {
    await page.goto(route);
    const renderer = page.locator('[data-bvlp-renderer="bg-interactive-2d"]');
    await expect(renderer, route).toHaveCount(1);
    await renderer.scrollIntoViewIfNeeded();
    const control = renderer.locator('input[type="range"]');
    const output = renderer.locator('output[aria-label$="current value"]');
    await expect(control, route).toHaveCount(1);
    await expect(output, route).toHaveCount(1);
    const before = await output.innerText();
    await control.press("ArrowRight");
    await expect(output, route).not.toHaveText(before);
  }
});
