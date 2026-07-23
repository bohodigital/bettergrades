import { readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist", "pages");
const allowlist = JSON.parse(await readFile(resolve(root, "data", "seo", "public-output-leak-allowlist.json"), "utf8"));
const allowlisted = new Set(allowlist.entries.map((entry) => `${entry.path}\0${entry.pattern}`));

const patterns = [
  ["preserve-misconception-control", /Preserve the misconception control/gi],
  ["storyboard-directive", /described in (?:the lesson and )?storyboard/gi],
  ["implementation-note", /\bimplementation note\b/gi],
  ["author-instruction", /\bauthor instruction\b/gi],
  ["developer-note", /\bdeveloper note\b/gi],
  ["todo", /\bTODO\b/g],
  ["fixme", /\bFIXME\b/g],
  ["malformed-frac13", /\bfrac13\b/gi],
  ["malformed-frac56", /\bfrac56\b/gi],
  ["malformed-frac311", /\bfrac311\b/gi],
  ["malformed-cdots", /\bcdots\b/gi],
  ["malformed-ldots", /\bldots\b/gi],
  ["local-path", /(?:\/Users\/|\/srv\/local1\/|\/home\/bohopi\/)/gi],
  ["private-preview", /https?:\/\/[^\s"'<>]*mankopoppi\.chatgpt\.site/gi],
];
const textExtensions = new Set([".html", ".svg", ".xml", ".txt", ".json", ""]);
const skippedNames = new Set(["_worker.js", "index.js"]);
const visibleTextPatterns = new Set([
  "malformed-frac13",
  "malformed-frac56",
  "malformed-frac311",
  "malformed-cdots",
  "malformed-ldots",
]);

async function filesUnder(directory) {
  const outputFiles = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) outputFiles.push(...await filesUnder(path));
    else outputFiles.push(path);
  }
  return outputFiles;
}

const findings = [];
for (const path of await filesUnder(output)) {
  if (skippedNames.has(path.split("/").at(-1))) continue;
  if (!textExtensions.has(extname(path))) continue;
  const projectPath = relative(root, path);
  const source = await readFile(path, "utf8");
  const visibleSource = extname(path) === ".html"
    ? source
      .replace(/<(?:script|style|annotation)\b[^>]*>[\s\S]*?<\/(?:script|style|annotation)>/gi, " ")
      .replace(/<[^>]+>/g, " ")
    : source;
  for (const [id, pattern] of patterns) {
    const scanSource = visibleTextPatterns.has(id) ? visibleSource : source;
    for (const match of scanSource.matchAll(pattern)) {
      if (allowlisted.has(`${projectPath}\0${id}`)) continue;
      findings.push({ path: projectPath, pattern: id, excerpt: match[0].slice(0, 160) });
    }
  }
}

if (findings.length) {
  throw new Error(`Public-output leak scan failed:\n${findings.slice(0, 50).map((finding) => `${finding.path}: ${finding.pattern}: ${finding.excerpt}`).join("\n")}`);
}
console.log(`Verified public output against ${patterns.length} leak patterns and ${allowlist.entries.length} reviewed allowlist entries.`);
