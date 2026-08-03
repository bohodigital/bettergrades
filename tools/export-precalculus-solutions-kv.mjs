import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

import solutions from "../content/precalculus/solutions.server.json" with { type: "json" };

const root = resolve(import.meta.dirname, "..");
const outputArgument = process.argv.find((argument) => argument.startsWith("--output="));
if (!outputArgument) throw new Error("Pass --output=/absolute/protected/runtime/path.json.");
const output = resolve(outputArgument.slice("--output=".length));
if (!isAbsolute(outputArgument.slice("--output=".length))) throw new Error("The protected KV export path must be absolute.");
const projectRelative = relative(root, output);
if (!projectRelative.startsWith("..") || projectRelative === "") throw new Error("Protected answer exports must remain outside the source repository.");

const records = solutions.solutions.map((record) => ({
  key: record.id,
  value: JSON.stringify(record),
}));
if (records.length !== 1_914 || new Set(records.map((record) => record.key)).size !== records.length) {
  throw new Error("The protected Precalculus KV export must contain exactly 1,914 unique records.");
}
await mkdir(resolve(output, ".."), { recursive: true, mode: 0o700 });
await writeFile(output, `${JSON.stringify(records)}\n`, { encoding: "utf8", mode: 0o600 });
console.log(`Exported ${records.length} protected Precalculus records outside the repository.`);
