import { expect, test } from "@playwright/test";

const routes = [
  ["/", "homepage"],
  ["/subjects/math/calculus/", "calculus landing"],
  ["/resources/", "resource library"],
  ["/subjects/math/calculus/limits-continuity/", "unit hub"],
  ["/subjects/math/calculus/limits-continuity/unit/limits/what-a-limit-means/", "long lesson"],
  ["/subjects/math/calculus/limits-continuity/limit-of-sin-x-over-x/", "concise article"],
  ["/subjects/math/calculus/worksheets/", "worksheets hub"],
  ["/subjects/math/calculus/worksheets/evaluating-limits/", "limits worksheet"],
  ["/subjects/math/calculus/worksheets/chain-rule/", "chain worksheet"],
  ["/subjects/math/calculus/formula-sheets/derivative-rules/", "formula sheet"],
  ["/subjects/math/calculus/practice-exams/calculus-1-final/", "calculus I final"],
  ["/subjects/math/calculus/practice-exams/calculus-2-final/", "calculus II final"],
  ["/subjects/math/calculus/worked-problems/limit-by-factoring/", "worked problem"],
  ["/subjects/math/calculus/visuals/convergence-tests-flowchart/", "visual page"],
  ["/glossary/math/derivative/", "enriched glossary"],
];

test("calculus starts collapsed and the top-level Resources tab exposes the complete library", async ({ page }) => {
  await page.goto("/subjects/math/calculus/");
  await expect(page.locator('.calculus-chapter[open]')).toHaveCount(0);
  await expect(page.locator('.desktop-nav > a[href="/resources/"]')).toHaveCount(1);
  await expect(page.locator('.mobile-menu nav > a[href="/resources/"]')).toHaveCount(1);

  await page.goto("/resources/");
  await expect(page.getByRole("heading", { level: 1, name: "Everything printable, visual, and worked through." })).toBeVisible();
  await expect(page.locator(".resource-library-card")).toHaveCount(63);
  await expect(page.locator(".resource-library-categories a")).toHaveCount(6);
  await expect(page.locator('.resource-library-downloads a[href$=".pdf"]')).toHaveCount(21);
});
const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["tablet", { width: 768, height: 1024 }],
  ["mobile", { width: 390, height: 844 }],
];

for (const [viewportName, viewport] of viewports) {
  test(`${viewportName} route matrix renders one complete document without overflow`, async ({ browser }) => {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("requestfailed", (request) => {
      if (!/googletagmanager|analytics\.bohodigitalservices/.test(request.url())) failedRequests.push(`${request.method()} ${request.url()}`);
    });
    for (const [route, label] of routes) {
      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${label}: horizontal overflow`).toBeLessThanOrEqual(1);
      expect(await page.locator("body").innerText(), `${label}: body completeness`).not.toMatch(/Internal Server Error|resource limit|Preserve the misconception control/i);
    }
    if (viewportName === "mobile") {
      await page.goto("/");
      const menu = page.locator("details.mobile-menu");
      await menu.getByLabel("Open menu").click();
      await expect(menu).toHaveAttribute("open", "");
      await expect(menu.locator("nav")).toBeVisible();
    }
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    await context.close();
  });
}

test("JavaScript-disabled educational pages preserve static content and suppress controls", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const route of [
    "/subjects/math/calculus/limits-continuity/unit/limits/what-a-limit-means/",
    "/subjects/math/calculus/worksheets/evaluating-limits/",
    "/subjects/math/calculus/visuals/convergence-tests-flowchart/",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    expect((await page.locator("main").innerText()).length).toBeGreaterThan(500);
    await expect(page.locator('button:has-text("Check answer"):visible')).toHaveCount(0);
  }
  await context.close();
});

test("keyboard focus, dark mode, and print CSS remain usable", async ({ page }) => {
  await page.goto("/subjects/math/calculus/worksheets/evaluating-limits/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();
  const outline = await focused.evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");

  await page.evaluate(() => {
    localStorage.setItem("bg-theme", "dark");
    document.documentElement.dataset.theme = "dark";
  });
  expect(await page.locator("html").getAttribute("data-theme")).toBe("dark");
  const colors = await page.locator("body").evaluate((element) => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });
  expect(colors.color).not.toBe(colors.background);

  await page.emulateMedia({ media: "print" });
  const printOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(printOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "artifacts/browser/evaluating-limits-print.png", fullPage: true });
});

test("downloads, redirect, answer reveal, and practice controls work", async ({ page }) => {
  const redirect = await page.request.get("/topics/", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/subjects/");

  await page.goto("/subjects/math/calculus/worksheets/evaluating-limits/");
  const keyHref = await page.getByRole("link", { name: "Worked answer key PDF" }).getAttribute("href");
  const pdf = await page.request.get(keyHref);
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect(pdf.headers()["x-robots-tag"]).toBe("noindex");

  await page.getByRole("button", { name: "Start practice" }).click();
  await expect(page.getByRole("button", { name: "Mark complete" })).toBeVisible();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Completed on this page")).toBeVisible();

  await page.goto("/subjects/math/calculus/worked-problems/limit-by-factoring/");
  await expect(page.getByText("Answer:", { exact: true })).toBeVisible();
});

test("every resource analytics event fires through both sinks with safe dimensions and respects Do Not Track", async ({ browser }) => {
  test.setTimeout(75_000);
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push({ sink: "ga4", args });
    window.umami = { track: (event, data) => window.__events.push({ sink: "umami", args: ["event", event, data] }) };
    window.print = () => {};
  });
  const page = await context.newPage();
  const allEvents = [];
  const clickWithoutNavigation = async (locator) => {
    await locator.evaluate((element) => {
      element.addEventListener("click", (event) => event.preventDefault(), { once: true });
      element.click();
    });
  };
  const collect = async () => {
    await page.waitForTimeout(25);
    allEvents.push(...await page.evaluate(() => window.__events));
  };

  await page.goto("/subjects/math/calculus/worksheets/evaluating-limits/");
  await clickWithoutNavigation(page.getByRole("link", { name: "Student PDF" }));
  await clickWithoutNavigation(page.getByRole("link", { name: "Worked answer key PDF" }));
  await page.getByRole("button", { name: "Print HTML" }).click();
  await page.getByRole("button", { name: "Start practice" }).click();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await clickWithoutNavigation(page.locator(".resource-related a").first());
  await collect();

  await page.goto("/subjects/math/calculus/practice-exams/calculus-1-final/");
  await clickWithoutNavigation(page.getByRole("link", { name: "Student PDF" }));
  await page.getByRole("button", { name: "Start practice" }).click();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await collect();

  await page.goto("/subjects/math/calculus/formula-sheets/derivative-rules/");
  await clickWithoutNavigation(page.getByRole("link", { name: "Student PDF" }));
  await collect();

  await page.goto("/subjects/math/calculus/visuals/convergence-tests-flowchart/");
  await clickWithoutNavigation(page.getByRole("link", { name: "SVG" }));
  await collect();

  await page.goto("/subjects/math/calculus/worked-problems/limit-by-factoring/");
  await collect();

  await page.goto("/glossary/math/derivative/");
  await clickWithoutNavigation(page.locator(".resource-related a").first());
  await collect();

  await page.goto("/subjects/math/calculus/limits-continuity/unit/");
  await clickWithoutNavigation(page.locator(".contextual-resource-links a").first());
  await collect();

  const expectedEvents = [
    "resource_view", "resource_download", "worksheet_download", "answer_key_download", "practice_exam_download",
    "formula_sheet_download", "visual_download", "worksheet_print", "practice_start", "practice_complete",
    "exam_start", "exam_complete", "worked_solution_open", "resource_to_lesson_click",
    "lesson_to_resource_click", "glossary_to_lesson_click",
  ];
  for (const name of expectedEvents) {
    const ga4 = allEvents.filter((item) => item.args[1] === name && item.sink === "ga4");
    const umami = allEvents.filter((item) => item.args[1] === name && item.sink === "umami");
    expect(ga4.length, `${name}: GA4 count`).toBeGreaterThan(0);
    expect(umami.length, `${name}: Umami count`).toBe(ga4.length);
    for (let index = 0; index < ga4.length; index += 1) {
      expect(umami[index].args[2], `${name}: sink dimensions`).toEqual(ga4[index].args[2]);
    }
  }
  const data = allEvents.find((item) => item.args[1] === "resource_view").args[2];
  expect(data).toMatchObject({ resource_id: "calculus-resource-evaluating-limits", resource_type: "worksheet" });
  const allowedDimensions = new Set(["resource_id", "resource_type", "course", "unit", "topic", "difficulty", "file_type", "source_lesson"]);
  for (const event of allEvents.filter((item) => item.sink === "ga4")) {
    expect(Object.keys(event.args[2]).every((key) => allowedDimensions.has(key)), `${event.args[1]}: safe dimension names`).toBe(true);
  }
  expect(JSON.stringify(allEvents)).not.toMatch(/student_name|student_email|full_response|raw_work/i);
  await context.close();

  const dntContext = await browser.newContext();
  await dntContext.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "doNotTrack", { configurable: true, get: () => "1" });
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    window.umami = { track: (...args) => window.__events.push(args) };
  });
  const dntPage = await dntContext.newPage();
  await dntPage.goto("/subjects/math/calculus/worksheets/evaluating-limits/");
  await dntPage.waitForTimeout(250);
  expect(await dntPage.evaluate(() => window.__events)).toEqual([]);
  await dntContext.close();
});
