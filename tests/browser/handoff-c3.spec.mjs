import { expect, test } from "@playwright/test";

test("textbook lesson reaches exposition through one compact objective", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/subjects/math/calculus/integrals/integration-by-parts/");
  await expect(page.locator(".lesson-position")).toBeVisible();
  await expect(page.locator(".lesson-objective")).toHaveCount(1);
  await expect(page.locator(".limits-editorial-intro")).toHaveCount(0);
  const order = await page.locator("main").evaluate((main) => {
    const node = main.querySelector(".limits-node");
    const path = main.querySelector(".lesson-companions-primary");
    return node && path ? node.compareDocumentPosition(path) : 0;
  });
  expect(order & 4).toBeTruthy();
  await page.screenshot({ path: "artifacts/browser/handoff-c3-textbook-desktop.png", fullPage: true });
});

test("short article content precedes supporting paths and its outline", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/subjects/math/calculus/integration-techniques/integration-by-parts-strategy/");
  const document = page.locator(".latex-article-document");
  const outline = page.locator(".latex-article-rail details");
  await expect(document).toBeVisible();
  await expect(outline).not.toHaveAttribute("open", "");
  const order = await page.locator("main").evaluate((main) => {
    const article = main.querySelector(".latex-article-document");
    const supporting = main.querySelector(".learning-path-links");
    const rail = main.querySelector(".latex-article-rail");
    return {
      supporting: article && supporting ? Boolean(article.compareDocumentPosition(supporting) & 4) : false,
      rail: article && rail ? Boolean(article.compareDocumentPosition(rail) & 4) : false,
    };
  });
  expect(order).toEqual({ supporting: true, rail: true });
  await page.screenshot({ path: "artifacts/browser/handoff-c3-article-desktop.png", fullPage: true });
});

test("worked problem begins with the problem and complete solution", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/subjects/math/calculus/worked-problems/limit-by-factoring/");
  const sequence = await page.locator(".resource-page > section").evaluateAll((sections) => sections.slice(0, 3).map((section) => section.className));
  expect(sequence[0]).toContain("resource-preview");
  expect(sequence[1]).toContain("resource-solutions");
  expect(sequence[2]).toContain("resource-includes");
  await page.screenshot({ path: "artifacts/browser/handoff-c3-worked-problem-mobile.png", fullPage: true });
});

test("glossary definition is first and optional vocabulary follows main content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/glossary/math/derivative/");
  const firstSection = page.locator(".resource-page > section").first();
  await expect(firstSection).toHaveClass(/resource-explanation/);
  const main = page.locator("main");
  const terms = page.locator(".page-terms");
  if (await terms.count()) {
    expect(await main.evaluate((element, other) => Boolean(element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_FOLLOWING), await terms.elementHandle())).toBe(true);
  }
  await page.screenshot({ path: "artifacts/browser/handoff-c3-glossary-mobile.png", fullPage: true });
});

test("tool interface remains in the first major content section", async ({ page }) => {
  await page.goto("/tools/math/calculus/integration-method-finder/");
  await expect(page.locator(".finder-tool")).toBeVisible();
  const toolTop = await page.locator(".finder-tool").evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  expect(toolTop).toBeLessThan(1300);
});
