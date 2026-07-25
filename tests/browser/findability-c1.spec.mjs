import { expect, test } from "@playwright/test";

async function clickWithoutNavigation(locator) {
  await locator.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true });
    element.click();
  });
}

test("visible search results preserve exact-match rank one", async ({ page }) => {
  const cases = [
    ["Mathematics variable and notation conventions", "/glossary/math/conventions/"],
    ["Calculus practice", "/practice/math/calculus/"],
    ["Washer method or shell method?", "/subjects/math/calculus/integration-applications/washer-vs-shell/"],
  ];
  for (const [query, route] of cases) {
    await page.goto(`/search/?q=${encodeURIComponent(query)}`);
    const first = page.locator(".site-search-result").first();
    await expect(first).toHaveAttribute("href", route);
    await expect(page.locator(".site-search-group > header h3")).toHaveText("Best matches");
  }
});

test("desktop navigation and learning-path clicks emit complete analytics dimensions", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push({ sink: "ga4", args });
    window.umami = { track: (event, data) => window.__events.push({ sink: "umami", args: ["event", event, data] }) };
  });
  const page = await context.newPage();

  await page.goto("/");
  await clickWithoutNavigation(page.locator('.desktop-nav > a[href="/resources/"]'));
  let events = await page.evaluate(() => window.__events);
  expect(events.find((item) => item.sink === "ga4" && item.args[1] === "navigation_destination_click")?.args[2]).toMatchObject({
    target_page_id: "/resources/",
    target_page_role: "navigation-destination",
    navigation_surface: "desktop-primary",
  });

  await page.goto("/subjects/math/calculus/derivative-applications/curve-sketching-from-derivatives/");
  const learningLink = page.locator('.learning-path-links a[href="/subjects/math/calculus/derivative-applications/advanced-notes/"]');
  await expect(learningLink).toBeVisible();
  await clickWithoutNavigation(learningLink);
  events = await page.evaluate(() => window.__events);
  const generic = events.find((item) => item.sink === "ga4" && item.args[1] === "learning_relationship_click");
  const specific = events.find((item) => item.sink === "ga4" && item.args[1] === "article_to_lesson_click");
  for (const event of [generic, specific]) {
    expect(event?.args[2]).toMatchObject({
      source_page_role: "method-guide",
      target_page_role: "textbook-lesson",
      placement: "article-footer",
      result_rank: 2,
    });
    expect(event?.args[2].source_page_id).toBeTruthy();
    expect(event?.args[2].target_page_id).toBeTruthy();
    expect(event?.args[2].relationship_type).toBeTruthy();
  }
  await context.close();
});
