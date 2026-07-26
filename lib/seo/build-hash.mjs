import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries
    .filter((entry) => entry.name !== ".DS_Store")
    .map((entry) => entry.isDirectory() ? filesBelow(join(directory, entry.name)) : [join(directory, entry.name)]));
  return files.flat();
}

export function normalizeBuildSpecificBytes(path, bytes) {
  if (!/\.(?:html|js|json)$/.test(path)) return bytes;
  return Buffer.from(bytes.toString()
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "<BUILD_UUID>")
    .replace(/("prerenderSecret"\s*:\s*")[0-9a-f]{64}(")/gi, "$1<PRERENDER_SECRET>$2"));
}

export async function pagesPackageHash(directory) {
  const digest = createHash("sha256");
  for (const path of (await filesBelow(directory)).sort()) {
    digest.update(relative(directory, path));
    digest.update("\0");
    digest.update(await readFile(path));
    digest.update("\0");
  }
  return digest.digest("hex");
}

export async function normalizedPagesPackageHash(directory) {
  const digest = createHash("sha256");
  for (const path of (await filesBelow(directory)).sort()) {
    digest.update(relative(directory, path));
    digest.update("\0");
    digest.update(normalizeBuildSpecificBytes(path, await readFile(path)));
    digest.update("\0");
  }
  return digest.digest("hex");
}
