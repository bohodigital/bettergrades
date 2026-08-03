import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


const source = await readFile(new URL("../tools/provision_precalculus_solutions.py", import.meta.url), "utf8");

test("Precalculus provisioning wrapper is fixed to one protected Cloudflare boundary", () => {
  assert.match(source, /REFERENCE = "boho-digital-services\.cloudflare\.primary-management"/);
  assert.match(source, /PROJECT = "bettergrades"/);
  assert.match(source, /BINDING = "PRECALCULUS_SOLUTIONS"/);
  assert.match(source, /NAMESPACE_TITLE = "bettergrades-precalculus-solutions-production"/);
  assert.match(source, /EXPECTED_RECORD_COUNT = 2_454/);
  assert.match(source, /choices=\("status", "provision"\)/);
  assert.doesNotMatch(source, /add_argument\("--(?:project|binding|namespace|reference|token)/);
});

test("Precalculus provisioning preserves other KV bindings and verifies both environments", () => {
  assert.match(source, /bindings = binding_map\(project_record, environment\)/);
  assert.match(source, /bindings\[BINDING\] = \{"namespace_id": namespace_id\}/);
  assert.match(source, /for environment in \("preview", "production"\)/);
  assert.match(source, /if actual_keys != expected_keys:/);
  assert.match(source, /if not all\(bindings\.values\(\)\):/);
});

test("Precalculus provisioning keeps credentials and answer values out of output and Git", () => {
  assert.match(source, /stdout=subprocess\.PIPE/);
  assert.match(source, /result\.stdout = ""/);
  assert.match(source, /token = ""/);
  assert.doesNotMatch(source, /print\([^\n]*(?:api_token|records|expected_keys|actual_keys)/i);
  assert.doesNotMatch(source, /write_text|write_bytes|NamedTemporaryFile/);
});
