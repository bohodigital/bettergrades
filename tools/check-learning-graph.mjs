import graph from "../data/learning-graph/graph.json" with { type: "json" };
import concepts from "../data/learning-graph/concepts.json" with { type: "json" };
import skills from "../data/learning-graph/skills.json" with { type: "json" };
import inventory from "../data/ia/page-inventory.json" with { type: "json" };
import algebraCourse from "../content/algebra/course.public.json" with { type: "json" };
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { rm } from "node:fs/promises";

const root = resolve(import.meta.dirname, "..");
const output = resolve(tmpdir(), `bettergrades-learning-graph-check-${process.pid}.mjs`);
await build({
  entryPoints: [resolve(root, "lib/learning-graph/validate.ts")],
  outfile: output,
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "silent",
});
try {
  const { validateLearningGraph } = await import(`${pathToFileURL(output).href}?v=${Date.now()}`);
  const errors = validateLearningGraph(graph);
  const conceptIds = new Set(concepts.map((item) => item.id));
  const skillIds = new Set(skills.map((item) => item.id));
  const canonicalRoutes = new Set([
    ...inventory.routes.map((route) => route.route),
    ...algebraCourse.routes.map((route) => route.path),
  ]);
  const coveredRoutes = new Set([...graph.nodes.map((node) => node.canonicalPath), ...graph.exclusions.map((item) => item.canonicalPath)]);
  for (const node of graph.nodes) {
    if (!canonicalRoutes.has(node.canonicalPath)) errors.push(`Graph node has no canonical route: ${node.id} (${node.canonicalPath})`);
    for (const conceptId of [node.primaryConceptId, ...node.secondaryConceptIds].filter(Boolean)) {
      if (!conceptIds.has(conceptId)) errors.push(`Missing concept taxonomy entry on ${node.id}: ${conceptId}`);
    }
    for (const skillId of node.skillIds) {
      if (!skillIds.has(skillId)) errors.push(`Missing skill taxonomy entry on ${node.id}: ${skillId}`);
    }
  }
  for (const route of canonicalRoutes) {
    if (!coveredRoutes.has(route)) errors.push(`Canonical route is neither mapped nor excluded: ${route}`);
  }
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ pass: true, nodes: graph.nodes.length, relationships: graph.relationships.length }));
  }
} finally {
  await rm(output, { force: true });
}
