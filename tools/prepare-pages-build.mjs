import { access, cp, mkdir, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build as esbuildBuild } from "esbuild";

const root = process.cwd();
const client = resolve(root, "dist", "client");
const server = resolve(root, "dist", "server");
const output = resolve(root, "dist", "pages");
const serverEntry = resolve(server, "index.js");
const workerEntry = resolve(output, "_worker.js");
const bundledWorkerEntry = resolve(output, "_worker.prebundle.js");
const registryEntry = resolve(root, "dist", ".registry-build.mjs");

async function requirePath(path, label) {
  try {
    await access(path);
  } catch {
    throw new Error(`${label} is missing at ${path}`);
  }
}

await requirePath(client, "vinext client output");
await requirePath(serverEntry, "vinext Worker entry");

await esbuildBuild({
  stdin: {
    contents: 'export { publicRoutes, redirects } from "./lib/registry/routing.ts";',
    resolveDir: root,
    sourcefile: "registry-build-entry.mts",
  },
  outfile: registryEntry,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
  logLevel: "warning",
});
const registry = await import(`${pathToFileURL(registryEntry).href}?build=${Date.now()}`);
const publicRoutes = registry.publicRoutes;
const redirects = registry.redirects;
await rm(registryEntry, { force: true });

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
await esbuildBuild({
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

// Pre-render every indexable educational document once at build time. These
// files bypass the Worker in production, so ordinary crawling is static,
// constant-time delivery rather than repeated course-registry evaluation.
const serverWorkerUrl = pathToFileURL(serverEntry);
serverWorkerUrl.searchParams.set("static-render", `${Date.now()}`);
const { default: serverWorker } = await import(serverWorkerUrl.href);
const renderEnv = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const renderContext = { waitUntil() {}, passThroughOnException() {} };
async function render(path) {
  return serverWorker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    renderEnv,
    renderContext,
  );
}
for (const route of publicRoutes) {
  const response = await render(route);
  if (response.status !== 200) throw new Error(`Static render failed for ${route}: ${response.status}`);
  const destination = route === "/" ? resolve(output, "index.html") : resolve(output, route.slice(1), "index.html");
  await mkdir(resolve(destination, ".."), { recursive: true });
  await writeFile(destination, await response.text(), "utf8");
}
for (const route of ["/robots.txt", "/sitemap.xml"]) {
  const response = await render(route);
  if (response.status !== 200) throw new Error(`Static metadata render failed for ${route}: ${response.status}`);
  await writeFile(resolve(output, route.slice(1)), await response.text(), "utf8");
}
const notFoundResponse = await render("/definitely-not-a-page/");
if (notFoundResponse.status !== 404) throw new Error(`Static 404 render returned ${notFoundResponse.status}`);
await writeFile(resolve(output, "404.html"), await notFoundResponse.text(), "utf8");
await writeFile(
  resolve(output, "_redirects"),
  `${redirects.map(({ from, to, status }) => `${from} ${to} ${status}`).join("\n")}\n`,
  "utf8",
);

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
      include: ["/api/*", "/_vinext/image"],
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
console.log(`Pre-rendered ${publicRoutes.length} canonical HTML routes and ${redirects.length} one-hop redirects.`);
