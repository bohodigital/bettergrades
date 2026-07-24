import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

const root = resolve(process.cwd(), "dist/pages");
const port = Number(process.env.PORT ?? 4173);
const redirects = new Map(
  (await readFile(resolve(root, "_redirects"), "utf8"))
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [from, to, status] = line.split(/\s+/);
      return [from, { to, status: Number(status) }];
    }),
);
const mime = new Map(Object.entries({
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
}));

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const redirect = redirects.get(pathname);
  if (redirect) {
    response.writeHead(redirect.status, { location: redirect.to });
    response.end();
    return;
  }
  let file = resolve(root, `.${pathname}`);
  if (!file.startsWith(root)) {
    response.writeHead(400).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
  } catch {
    if (!extname(file)) file = resolve(file, "index.html");
  }
  try {
    const body = await readFile(file);
    const headers = {
      "content-type": mime.get(extname(file)) ?? "application/octet-stream",
      "cache-control": "no-store",
    };
    if (extname(file) === ".pdf") {
      headers["content-disposition"] = "inline";
      headers["x-robots-tag"] = "noindex";
    }
    response.writeHead(200, headers);
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(await readFile(resolve(root, "404.html")));
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving BetterGrades Pages package at http://127.0.0.1:${port}`);
});
