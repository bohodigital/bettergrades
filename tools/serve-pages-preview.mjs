import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { getAlgebraAssessmentRubric } from "../lib/algebra/algebra-course.server.mjs";

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

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("Request body is too large.");
  }
  return JSON.parse(body);
}

createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (request.method === "POST" && (pathname === "/api/algebra-course-check" || pathname === "/api/algebra-course-reveal")) {
    try {
      const body = await readJsonBody(request);
      const id = typeof body.id === "string" ? body.id : "";
      const rubric = id && id.length <= 160 ? getAlgebraAssessmentRubric(id) : null;
      if (!rubric) {
        sendJson(response, 404, { error: "That Algebra assessment item is not available." });
        return;
      }
      if (pathname.endsWith("-check")) {
        const answer = typeof body.answer === "string" ? body.answer : "";
        if (!answer.trim()) {
          sendJson(response, 200, { status: "empty", feedback: "Write a method, partial setup, or explanation before requesting feedback." });
          return;
        }
        sendJson(response, 200, {
          status: "uncertain",
          feedback: "This source prompt is open response, so BetterGrades will not pretend one wording is machine-provable. Your attempt is recorded locally; open the supplied rubric and compare the method, restrictions, units, and check.",
        });
        return;
      }
      const attempt = typeof body.attempt === "string" ? body.attempt : "";
      if (!attempt.trim()) {
        sendJson(response, 400, { error: "Write a real attempt before opening the response guide." });
        return;
      }
      sendJson(response, 200, { rubric });
    } catch {
      sendJson(response, 400, { error: "Send a valid JSON request body." });
    }
    return;
  }
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
