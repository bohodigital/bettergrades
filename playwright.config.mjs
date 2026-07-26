import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: "./artifacts/browser/playwright-output",
  reporter: [["line"], ["json", { outputFile: "artifacts/browser/playwright-results.json" }]],
  timeout: 45_000,
  expect: { timeout: 8_000 },
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4183",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node tools/serve-pages-preview.mjs",
    url: "http://127.0.0.1:4183/",
    reuseExistingServer: false,
    timeout: 30_000,
    env: { PORT: "4183" },
  },
});
