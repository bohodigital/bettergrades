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
  await clickWithoutNavigation(page.locator('.desktop-nav > a[href="/search/"]'));
  let events = await page.evaluate(() => window.__events);
  expect(events.find((item) => item.sink === "ga4" && item.args[1] === "navigation_destination_click")?.args[2]).toMatchObject({
    source_page_id: "route:/",
    source_page_role: "home",
    target_page_id: "route:/search/",
    target_page_role: "search",
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
    target_page_role: "directory",
    relationship_type: "search_result",
    placement: "search-results",
    query: "Calculus practice",
    result_rank: 1,
  });

  await page.goto("/learn/calculus/integration-by-parts/");
  const learningLink = page.locator('.learning-path-primary a[href="/subjects/math/calculus/integrals/integration-by-parts/"]');
  await expect(learningLink).toBeVisible();
  await clickWithoutNavigation(learningLink);
  events = await page.evaluate(() => window.__events);
  const generic = events.find((item) => item.sink === "ga4" && item.args[1] === "learning_relationship_click");
  const specific = events.find((item) => item.sink === "ga4" && item.args[1] === "article_to_lesson_click");
  for (const event of [generic, specific]) {
    expect(event?.args[2]).toMatchObject({
      source_page_role: "method-guide",
      target_page_role: "textbook-lesson",
      placement: "article-intro",
      navigation_surface: "article-learning-path",
      result_rank: 1,
      course: "course.math.calculus",
      unit: "unit.calculus.3a",
      topic: "topic.math.integration-by-parts",
    });
    expect(event?.args[2].source_page_id).toBeTruthy();
    expect(event?.args[2].target_page_id).toBeTruthy();
    expect(event?.args[2].relationship_type).toBeTruthy();
  }

  await page.goto("/subjects/math/calculus/integrals/integration-by-parts/");
  const lessonCompanion = page.locator('.lesson-companions a[href="/subjects/math/calculus/worksheets/integration-by-parts/"]');
  await expect(lessonCompanion).toBeVisible();
  await clickWithoutNavigation(lessonCompanion);
  events = await page.evaluate(() => window.__events);
  for (const sink of ["ga4", "umami"]) {
    const lessonEvents = events.filter((item) => item.sink === sink && item.args[1] === "lesson_to_practice_click");
    expect(lessonEvents).toHaveLength(1);
    expect(lessonEvents[0].args[2]).toMatchObject({
      source_page_role: "textbook-lesson",
      target_page_role: "worksheet",
      relationship_type: "practices",
      placement: "lesson-intro",
      navigation_surface: "lesson-companion",
      course: "course.math.calculus",
      unit: "unit.calculus.3a",
      topic: "topic.math.integration-by-parts",
    });
  }

  await page.goto("/subjects/math/calculus/integration-techniques/");
  await clickWithoutNavigation(page.locator('.topic-article-list a[href="/subjects/math/calculus/integration-techniques/integration-by-parts-strategy/"]'));
  events = await page.evaluate(() => window.__events);
  for (const sink of ["ga4", "umami"]) {
    const topicEvents = events.filter((item) => item.sink === sink && item.args[1] === "topic_hub_destination_click");
    expect(topicEvents).toHaveLength(1);
    expect(topicEvents[0].args[2]).toMatchObject({
      relationship_type: "hub_destination",
      placement: "topic-hub-listing",
      navigation_surface: "topic-hub",
      course: "course.math.calculus",
      unit: "not-applicable",
      topic: "topic.math.integration-techniques",
    });
    expect(topicEvents[0].args[2].source_page_id).toBeTruthy();
    expect(topicEvents[0].args[2].source_page_role).toBeTruthy();
    expect(topicEvents[0].args[2].target_page_id).toBeTruthy();
    expect(topicEvents[0].args[2].target_page_role).toBeTruthy();
  }

  await page.goto("/subjects/math/calculus/worked-problems/limit-by-factoring/");
  await clickWithoutNavigation(page.locator(".resource-related a").first());
  events = await page.evaluate(() => window.__events);
  for (const sink of ["ga4", "umami"]) {
    const workedEvents = events.filter((item) => item.sink === sink && item.args[1] === "worked_problem_to_lesson_click");
    expect(workedEvents).toHaveLength(1);
    expect(workedEvents[0].args[2]).toMatchObject({
      source_page_role: "worked-problem",
      relationship_type: "full_version_of",
      placement: "resource-footer",
      navigation_surface: "worked-problem",
      course: "Calculus I",
      unit: "Unit 1",
      topic: "limits",
    });
    expect(workedEvents[0].args[2].source_page_id).toBeTruthy();
    expect(workedEvents[0].args[2].target_page_id).toBeTruthy();
    expect(workedEvents[0].args[2].target_page_role).toBeTruthy();
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
    page.waitForURL("**/search/"),
    page.locator('.desktop-nav > a[href="/search/"]').click(),
  ]);
  await expect.poll(() => events.find((item) => item.sink === "ga4" && item.args[1] === "navigation_destination_click")?.args[2]).toMatchObject({
    source_page_role: "home",
    target_page_role: "search",
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
    target_page_role: "directory",
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
    stalledPage.waitForURL("**/search/"),
    stalledPage.locator('.desktop-nav > a[href="/search/"]').click(),
  ]);
  expect(Date.now() - navigationStartedAt).toBeLessThan(1_000);
  releaseIdentityRequest();
  await stalledContext.close();
});
