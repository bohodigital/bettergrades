import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "data/learning-graph");
const check = process.argv.includes("--check");
const tempBundle = resolve(tmpdir(), `bettergrades-learning-graph-${process.pid}.mjs`);
const sourceCommitArg = process.argv.find((arg) => arg.startsWith("--source-commit="))?.split("=", 2)[1];
const sourceTreeArg = process.argv.find((arg) => arg.startsWith("--source-tree="))?.split("=", 2)[1];

function git(...args) {
  return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [headers, ...data] = rows;
  return data.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function writeOrCheck(path, value) {
  const next = stableJson(value);
  if (check) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== next) throw new Error(`Generated learning graph drift: ${path.replace(`${root}/`, "")}`);
    return;
  }
  await writeFile(path, next);
}

await build({
  entryPoints: [resolve(root, "lib/learning-graph/adapters.ts")],
  outfile: tempBundle,
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "silent",
});

try {
  const { adaptCurrentRegistries } = await import(`${pathToFileURL(tempBundle).href}?v=${Date.now()}`);
  const committedGraph = check
    ? JSON.parse(await readFile(resolve(outDir, "graph.json"), "utf8"))
    : null;
  const sourceCommit = sourceCommitArg ?? committedGraph?.sourceCommit ?? git("rev-parse", "HEAD");
  const sourceTree = sourceTreeArg ?? committedGraph?.sourceTree ?? git("rev-parse", `${sourceCommit}^{tree}`);
  if (git("rev-parse", `${sourceCommit}^{tree}`) !== sourceTree) {
    throw new Error(`Learning graph source binding mismatch: ${sourceCommit} does not resolve to ${sourceTree}`);
  }
  const graph = adaptCurrentRegistries(sourceCommit, sourceTree);
  const nodeByPath = new Map(graph.nodes.map((node) => [node.canonicalPath, node]));
  const provisional = [];
  const candidateSources = [
    {
      file: "data/ia/article-lesson-candidates.csv",
      source: "source_article",
      target: "candidate_lesson",
      type: "full_version_of",
      anchor: "Learn this fully",
    },
    {
      file: "data/ia/lesson-companion-candidates.csv",
      source: "lesson",
      target: "companion",
      type: "references",
      anchor: "Review this companion",
    },
  ];
  for (const candidateSource of candidateSources) {
    const rows = parseCsv(await readFile(resolve(root, candidateSource.file), "utf8"));
    for (const row of rows) {
      const source = nodeByPath.get(row[candidateSource.source]);
      const target = nodeByPath.get(row[candidateSource.target]);
      if (!source || !target || source.id === target.id) continue;
      provisional.push({
        sourceId: source.id,
        targetId: target.id,
        type: candidateSource.type,
        confidence: String(row.confidence ?? "").startsWith("high") ? "high" : String(row.confidence ?? "").startsWith("low") ? "low" : "medium",
        source: candidateSource.file,
        editorialStatus: "provisional",
        placement: "editorial-queue",
        anchorText: candidateSource.anchor,
        reciprocalRequired: false,
      });
    }
  }
  graph.relationships = [...graph.relationships, ...provisional].sort((a, b) => `${a.sourceId}:${a.targetId}:${a.type}:${a.editorialStatus}`.localeCompare(`${b.sourceId}:${b.targetId}:${b.type}:${b.editorialStatus}`));
  const concepts = Array.from(new Set(graph.nodes.flatMap((node) => [node.primaryConceptId, ...node.secondaryConceptIds]).filter(Boolean))).sort().map((id) => ({ id }));
  const skills = Array.from(new Set(graph.nodes.flatMap((node) => node.skillIds))).sort().map((id) => ({ id }));
  const publicRelationships = graph.relationships.filter((relationship) => ["approved", "existing"].includes(relationship.editorialStatus));
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const publicTargetTypes = new Set(["textbook-lesson", "worksheet", "practice-exam", "worked-problem", "formula-sheet", "visual-guide", "glossary-term", "tool", "assessment"]);
  const relationshipPriority = { full_version_of: 100, practices: 90, assesses: 80, references: 70, visualizes: 60, uses_tool: 50, explains: 40, follows: 30 };
  const publicArticleDestinations = Object.fromEntries(
    graph.nodes
      .filter((node) => node.nodeType === "article")
      .map((source) => {
        const seen = new Set();
        const destinations = publicRelationships
          .filter((relationship) => relationship.sourceId === source.id)
          .filter((relationship) => {
            const target = nodeById.get(relationship.targetId);
            return target && publicTargetTypes.has(target.nodeType);
          })
          .sort((left, right) => {
            const leftTarget = nodeById.get(left.targetId);
            const rightTarget = nodeById.get(right.targetId);
            const score = (relationship, target) =>
              (relationshipPriority[relationship.type] ?? 0)
              + target.skillIds.filter((id) => source.skillIds.includes(id)).length * 10
              + (target.primaryConceptId && target.primaryConceptId === source.primaryConceptId ? 5 : 0)
              + (target.unitId && target.unitId === source.unitId ? 4 : 0);
            return score(right, rightTarget) - score(left, leftTarget)
              || `${left.targetId}:${left.type}`.localeCompare(`${right.targetId}:${right.type}`);
          })
          .flatMap((relationship) => {
            const target = nodeById.get(relationship.targetId);
            if (!target || seen.has(target.id)) return [];
            seen.add(target.id);
            return [{
              relationship: {
                sourceId: relationship.sourceId,
                sourceRole: source.pageRole,
                targetId: relationship.targetId,
                type: relationship.type,
              },
              target: {
                id: target.id,
                canonicalPath: target.canonicalPath,
                pageRole: target.pageRole,
                shortTitle: target.shortTitle,
              },
            }];
          })
          .slice(0, 2);
        return [source.canonicalPath, destinations];
      }),
  );
  await mkdir(outDir, { recursive: true });
  await writeOrCheck(resolve(outDir, "graph.json"), graph);
  await writeOrCheck(resolve(outDir, "nodes.json"), graph.nodes);
  await writeOrCheck(resolve(outDir, "relationships.json"), graph.relationships);
  await writeOrCheck(resolve(outDir, "concepts.json"), concepts);
  await writeOrCheck(resolve(outDir, "skills.json"), skills);
  await writeOrCheck(resolve(outDir, "exclusions.json"), graph.exclusions);
  await writeOrCheck(resolve(outDir, "public-article-destinations.json"), publicArticleDestinations);
  console.log(JSON.stringify({
    nodes: graph.nodes.length,
    relationships: graph.relationships.length,
    publicRelationships: graph.relationships.filter((relationship) => ["approved", "existing"].includes(relationship.editorialStatus)).length,
    provisionalRelationships: graph.relationships.filter((relationship) => relationship.editorialStatus === "provisional").length,
    exclusions: graph.exclusions.length,
    mode: check ? "check" : "generate",
  }));
} finally {
  await rm(tempBundle, { force: true });
}
