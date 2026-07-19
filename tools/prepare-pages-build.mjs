import { access, cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const client = resolve(root, "dist", "client");
const server = resolve(root, "dist", "server");
const output = resolve(root, "dist", "pages");
const serverEntry = resolve(server, "index.js");
const workerEntry = resolve(output, "_worker.js");
const bundledWorkerEntry = resolve(output, "_worker.prebundle.js");

async function requirePath(path, label) {
  try {
    await access(path);
  } catch {
    throw new Error(`${label} is missing at ${path}`);
  }
}

await requirePath(client, "vinext client output");
await requirePath(serverEntry, "vinext Worker entry");

// The Cloudflare Vite plugin writes a local deploy redirect to the Worker
// configuration. Pages must discover the root wrangler.jsonc instead.
await rm(resolve(root, ".wrangler", "deploy"), { recursive: true, force: true });
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(client, output, { recursive: true });
await cp(server, output, { recursive: true });
await cp(serverEntry, workerEntry);
await rm(resolve(output, "wrangler.json"), { force: true });

// Pages' `no_bundle` release mode must receive one self-contained Worker.
// vinext intentionally emits a module graph (the RSC assets manifest plus the
// SSR renderer), so prebundle that graph here instead of asking Wrangler to
// rebuild it with different defaults during production upload.
await build({
  entryPoints: [workerEntry],
  outfile: bundledWorkerEntry,
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2022",
  external: ["node:*"],
  minify: true,
  legalComments: "eof",
  logLevel: "warning",
});

const bundledWorkerSource = await readFile(bundledWorkerEntry, "utf8");
for (const localImport of [
  /(?:from\s*|import\s*\()\s*["']\.\//,
  /(?:from\s*|import\s*\()\s*["']\.\.\//,
]) {
  if (localImport.test(bundledWorkerSource)) {
    throw new Error("Pages Worker prebundle still contains a local module import");
  }
}
await rename(bundledWorkerEntry, workerEntry);

await writeFile(
  resolve(output, ".assetsignore"),
  [
    "_worker.js",
    "index.js",
    "ssr/**",
    "__vite_rsc_assets_manifest.js",
    ".vite/**",
    "image-config.json",
    "vinext-externals.json",
    "vinext-server.json",
    "",
  ].join("\n"),
  "utf8",
);

await writeFile(
  resolve(output, "_routes.json"),
  `${JSON.stringify(
    {
      version: 1,
      include: ["/*"],
      exclude: [
        "/assets/*",
        "/visuals/*",
        "/og.png",
        "/favicon.ico",
        "/favicon.svg",
        "/icon-192.png",
        "/icon-512.png",
        "/apple-touch-icon.png",
        "/site.webmanifest",
      ],
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const workerSource = bundledWorkerSource;
if (!workerSource.includes("env.ASSETS") && !workerSource.includes("ASSETS.fetch")) {
  throw new Error("Pages Worker does not reference the required ASSETS binding");
}

const entries = await readdir(output);
if (!entries.includes("assets") || !entries.includes("_worker.js")) {
  throw new Error("Pages package is missing assets or _worker.js");
}

console.log(`Prepared Cloudflare Pages advanced-worker package at ${output}`);
