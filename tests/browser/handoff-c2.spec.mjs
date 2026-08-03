import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/search/",
  "/subjects/math/algebra/",
  "/subjects/math/calculus/",
  "/subjects/math/calculus/integrals/",
  "/subjects/math/calculus/integration-techniques/",
  "/practice/",
  "/resources/",
  "/learn/calculus/integration-by-parts/",
  "/subjects/math/calculus/integrals/integration-by-parts/",
  "/subjects/math/calculus/worksheets/chain-rule/",
  "/subjects/math/calculus/worked-problems/absolute-versus-conditional-convergence/",
  "/glossary/math/antiderivative/",
  "/tools/math/calculus/integration-method-finder/",
];

test("desktop navigation and homepage follow the C2 learner hierarchy", async ({ page }) => {
  const expectedCourseHrefs = [
    "/subjects/math/algebra/",
    "/subjects/math/precalculus/",
    "/subjects/math/calculus/",
  ];
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Better Grades");
  await expect(page.locator(".hero .search-box")).toBeVisible();
  await expect(page.locator(".paths .path-row")).toHaveCount(3);
  await expect(page.locator(".course-home-card")).toHaveCount(expectedCourseHrefs.length);
  expect((await page.locator(".course-home-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("href")))).sort())
    .toEqual([...expectedCourseHrefs].sort());
  await expect(page.locator(".desktop-nav > details > summary")).toHaveText([/Learn/, /Practice/, /Resources/]);
  await expect(page.locator('.desktop-nav > a[href="/search/"]')).toBeVisible();
  await page.screenshot({ path: "artifacts/browser/handoff-c2-home-desktop.png", fullPage: true });
});

test("tablet and mobile navigation preserve substantive parity without overflow", async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto("/");
    await page.locator(".mobile-menu > summary").click();
    await expect(page.locator('.mobile-menu a[href="/search/"]')).toBeVisible();
    for (const label of ["Learn", "Practice", "Resources"]) await expect(page.locator(".mobile-course-menu > summary", { hasText: label })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: `artifacts/browser/handoff-c2-home-${viewport.width}.png`, fullPage: true });
    await context.close();
  }
});

test("representative C2 surfaces have one main, one h1, no overflow, and no console errors", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !/googletagmanager|analytics\.bohodigitalservices/.test(message.text())) consoleErrors.push(message.text());
  });
  for (const route of representativeRoutes) {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main"), route).toHaveCount(1);
    await expect(page.locator("h1"), route).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
  expect(consoleErrors).toEqual([]);
});

test("no-JavaScript navigation remains crawlable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  for (const href of ["/search/", "/subjects/math/algebra/", "/subjects/math/calculus/", "/practice/", "/resources/"]) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
  }
  await context.close();
});

test("keyboard, dark mode, print, filters, and Do Not Track remain functional", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => localStorage.setItem("bg-theme", "dark"));
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator(".desktop-learn-menu").first().locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator('.desktop-learn-panel a[href="/subjects/math/calculus/"]').first()).toBeVisible();
  await page.goto("/resources/");
  await page.locator('.resource-library-filters select').first().selectOption({ label: "Calculus I" });
  await expect(page.locator(".resource-library-filters strong")).toContainText("of");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".resource-library-filters")).toBeHidden();
  await context.close();

  const dntContext = await browser.newContext();
  await dntContext.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "doNotTrack", { configurable: true, get: () => "1" });
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    window.umami = { track: (...args) => window.__events.push(args) };
  });
  const dntPage = await dntContext.newPage();
  await dntPage.goto("/");
  await dntPage.locator('.desktop-nav > a[href="/search/"]').click();
  expect(await dntPage.evaluate(() => window.__events)).toEqual([]);
  await dntContext.close();
});
