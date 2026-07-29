import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("Cloudflare deployment stages only deployable Pages artifacts", async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "bettergrades-pages-upload-"));
  const source = path.join(temporaryRoot, "source");
  const staging = path.join(temporaryRoot, "staging");

  await mkdir(path.join(source, "assets"), { recursive: true });
  await mkdir(path.join(source, "ssr"), { recursive: true });
  await writeFile(path.join(source, "_worker.js"), "export default { fetch() {} };\n");
  await writeFile(path.join(source, "_routes.json"), '{"version":1}\n');
  await writeFile(path.join(source, "index.html"), "<!doctype html><title>Better Grades</title>\n");
  await writeFile(path.join(source, "assets", "app.js"), "export const ready = true;\n");
  await writeFile(path.join(source, "index.js"), "server-only render entry\n");
  await writeFile(path.join(source, "ssr", "index.js"), "server-only SSR chunk\n");
  await writeFile(path.join(source, "__vite_rsc_assets_manifest.js"), "server-only manifest\n");

  const repositoryRoot = new URL("..", import.meta.url).pathname;
  const wrapper = path.join(repositoryRoot, "tools", "deploy_cloudflare_pages.py");
  const probe = `
import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location("bettergrades_pages_deploy", ${JSON.stringify(wrapper)})
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

source = Path(${JSON.stringify(source)})
staging = Path(${JSON.stringify(staging)})
with module.staged_upload_directory(source, "abcdef1234567890", staging) as upload:
    result = {
        "worker": (upload / "_worker.js").is_file(),
        "route_config": (upload / "_routes.json").is_file(),
        "html": (upload / "index.html").is_file(),
        "client_asset": (upload / "assets" / "app.js").is_file(),
        "server_entry": (upload / "index.js").exists(),
        "ssr": (upload / "ssr").exists(),
        "server_manifest": (upload / "__vite_rsc_assets_manifest.js").exists(),
        "temporary": str(upload.parent),
    }
print(json.dumps(result))
print(json.dumps({"cleaned": not Path(result["temporary"]).exists()}))
`;
  const result = spawnSync("python3", ["-c", probe], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const [during, after] = result.stdout.trim().split("\n").map(JSON.parse);
  assert.deepEqual(during, {
    worker: true,
    route_config: true,
    html: true,
    client_asset: true,
    server_entry: false,
    ssr: false,
    server_manifest: false,
    temporary: during.temporary,
  });
  assert.equal(after.cleaned, true);
});
