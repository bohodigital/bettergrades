import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const toolPath = path.join(repoRoot, "tools", "refresh_cloudflare_seo_controls.py");

test("SEO cache maintenance remains fixed to BetterGrades control documents", async () => {
  const source = await readFile(toolPath, "utf8");

  assert.match(
    source,
    /REFERENCE = "boho-digital-services\.cloudflare\.primary-management"/,
  );
  assert.match(source, /ZONE_NAME = "bettergrades\.net"/);
  assert.match(source, /CACHE_PHASE = "http_request_cache_settings"/);
  assert.match(
    source,
    /CACHE_RULE_REF = "bettergrades_seo_control_documents_bypass_cache"/,
  );
  for (const pathName of ["/robots.txt", "/sitemap.xml"]) {
    assert.ok(source.includes(JSON.stringify(pathName)), `missing ${pathName}`);
  }

  assert.match(source, /"action_parameters": \{"cache": False\}/);
  assert.doesNotMatch(source, /purge_everything/);
  assert.doesNotMatch(source, /settings\/browser_cache_ttl/);
  assert.doesNotMatch(source, /\/purge_cache/);
  assert.doesNotMatch(source, /add_argument\("--(?:zone|url|host)/);
});
