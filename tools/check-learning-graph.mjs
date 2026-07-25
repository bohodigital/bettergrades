import graph from "../data/learning-graph/graph.json" with { type: "json" };
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
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({ pass: true, nodes: graph.nodes.length, relationships: graph.relationships.length }));
  }
} finally {
  await rm(output, { force: true });
}
