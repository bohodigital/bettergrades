import { expect, test } from "@playwright/test";

async function clickWithoutNavigation(locator) {
  await locator.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true });
    element.click();
  });
  await locator.evaluate(() => new Promise((resolve) => setTimeout(resolve, 25)));
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
    source_page_id: "route:/",
    source_page_role: "home",
    target_page_id: "resource-hub.math.resources",
    target_page_role: "resource-library",
    relationship_type: "navigation",
    placement: "desktop-primary",
    navigation_surface: "desktop-primary",
  });

  await page.goto("/search/?q=Calculus%20practice");
  await page.waitForTimeout(500);
  await clickWithoutNavigation(page.locator(".site-search-result").first());
  events = await page.evaluate(() => window.__events);
  expect(events.find((item) => item.sink === "ga4" && item.args[1] === "site_search_result_click")?.args[2]).toMatchObject({
    source_page_id: "route:/search/",
    source_page_role: "search",
    target_page_role: "assessment",
    relationship_type: "search_result",
    placement: "search-results",
    query: "Calculus practice",
    result_rank: 1,
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

test("real navigation stays immediate and replays delayed analytics identities", async ({ browser }) => {
  const events = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.exposeFunction("captureFindabilityEvent", (sink, args) => events.push({ sink, args }));
  await context.addInitScript(() => {
    window.gtag = (...args) => window.captureFindabilityEvent("ga4", args);
    window.umami = { track: (event, data) => window.captureFindabilityEvent("umami", ["event", event, data]) };
  });
  const page = await context.newPage();
  await page.route("**/assets/route-identities-*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_500));
    await route.continue();
  });

  await page.goto("/");
  await Promise.all([
    page.waitForURL("**/resources/"),
    page.locator('.desktop-nav > a[href="/resources/"]').click(),
  ]);
  await expect.poll(() => events.find((item) => item.sink === "ga4" && item.args[1] === "navigation_destination_click")?.args[2]).toMatchObject({
    source_page_role: "home",
    target_page_role: "resource-library",
  });
  await context.close();

  const searchEvents = [];
  const searchContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await searchContext.exposeFunction("captureFindabilityEvent", (sink, args) => searchEvents.push({ sink, args }));
  await searchContext.addInitScript(() => {
    window.gtag = (...args) => window.captureFindabilityEvent("ga4", args);
    window.umami = { track: (event, data) => window.captureFindabilityEvent("umami", ["event", event, data]) };
  });
  const searchPage = await searchContext.newPage();
  await searchPage.route("**/assets/route-identities-*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2_500));
    await route.continue();
  });
  await searchPage.goto("/search/?q=Calculus%20practice");
  await Promise.all([
    searchPage.waitForURL("**/practice/math/calculus/"),
    searchPage.locator(".site-search-result").first().click(),
  ]);
  await expect.poll(() => searchEvents.find((item) => item.sink === "ga4" && item.args[1] === "site_search_result_click")?.args[2]).toMatchObject({
    source_page_role: "search",
    target_page_role: "assessment",
    result_rank: 1,
  });
  await searchContext.close();

  let releaseIdentityRequest;
  const identityRequestGate = new Promise((resolve) => {
    releaseIdentityRequest = resolve;
  });
  const stalledContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const stalledPage = await stalledContext.newPage();
  await stalledPage.route("**/assets/route-identities-*.js", async (route) => {
    await identityRequestGate;
    await route.continue();
  });
  await stalledPage.goto("/");
  const navigationStartedAt = Date.now();
  await Promise.all([
    stalledPage.waitForURL("**/resources/"),
    stalledPage.locator('.desktop-nav > a[href="/resources/"]').click(),
  ]);
  expect(Date.now() - navigationStartedAt).toBeLessThan(1_000);
  releaseIdentityRequest();
  await stalledContext.close();
});
