import { expect, test } from "@playwright/test";
import course from "../../content/precalculus/course.public.json" with { type: "json" };

const routes = [
  ["course-hub", "/subjects/math/precalculus/"],
  ...course.units.map((unit) => [`unit-${unit.sequence}-hub`, unit.root]),
  ["lesson", "/subjects/math/precalculus/angles-radians-and-the-unit-circle/directed-rotation-and-coterminal-angles/"],
  ...course.units[0].assessments.map((assessment) => [assessment.type, assessment.path]),
  ["final-assessment", "/subjects/math/precalculus/final-assessment/"],
];
const viewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];

for (const javaScriptEnabled of [true, false]) {
  for (const viewport of viewports) {
    test(`Precalculus course, all unit hubs, and a lesson pass at ${viewport.width}px with JavaScript ${javaScriptEnabled ? "on" : "off"}`, async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled, viewport });
      const page = await context.newPage();
      for (const [role, route] of routes) {
        const response = await page.goto(route, { waitUntil: "load" });
        expect(response?.status(), `${role} ${viewport.width}px`).toBe(200);
        await expect(page.locator("h1"), `${role} ${viewport.width}px`).toHaveCount(1);
        await expect(page.locator("main"), `${role} ${viewport.width}px`).toHaveCount(1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), `${role} ${viewport.width}px overflow`).toBeLessThanOrEqual(1);
        expect((await page.locator("main").innerText()).length, `${role} ${viewport.width}px content`).toBeGreaterThan(500);
        if (!javaScriptEnabled && (role === "lesson" || role.includes("review") || role.includes("practice") || role.includes("mastery") || role.includes("investigation") || role === "final-assessment")) {
          await expect(page.locator(".precalculus-attempt form")).toHaveCount(0);
          expect(await page.locator(".precalculus-attempt .limits-check-prompt").count()).toBeGreaterThan(0);
        }
      }
      await context.close();
    });
  }
}

test("Precalculus lesson preserves keyboard focus, dark mode, reduced motion, and print", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark", reducedMotion: "reduce" });
  await context.addInitScript(() => localStorage.setItem("bg-theme", "dark"));
  const page = await context.newPage();
  await page.goto(routes[2][1], { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  expect(await page.locator(":focus").evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await page.emulateMedia({ media: "print" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await context.close();
});
