import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "refresh_cloudflare_seo_controls.py");

test("SEO cache maintenance remains fixed to BetterGrades control URLs", async () => {
  const source = await readFile(toolPath, "utf8");

  assert.match(
    source,
    /REFERENCE = "boho-digital-services\.cloudflare\.primary-management"/,
  );
  assert.match(source, /ZONE_NAME = "bettergrades\.net"/);
  assert.match(source, /DESIRED_BROWSER_CACHE_TTL = 0/);
  for (const pathName of [
    "/robots.txt",
    "/sitemap.xml",
    "/favicon.ico",
    "/favicon.svg",
    "/icon-192.png",
    "/icon-512.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
  ]) {
    assert.ok(source.includes(JSON.stringify(pathName)), `missing ${pathName}`);
  }

  assert.doesNotMatch(source, /purge_everything/);
  assert.doesNotMatch(source, /add_argument\("--(?:zone|url|host)/);
});
