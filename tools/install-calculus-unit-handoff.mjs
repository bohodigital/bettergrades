import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const requested = process.argv.find((argument) => argument.startsWith("--unit="))?.split("=")[1];
const sourceArgument = process.argv.find((argument) => argument.startsWith("--source="))?.slice("--source=".length);
const checkOnly = process.argv.includes("--check");
if (!requested || !["unit-3a", "unit-3b"].includes(requested)) throw new Error("Pass --unit=unit-3a or --unit=unit-3b.");
if (!sourceArgument) throw new Error("Pass --source=<absolute handoff unit directory>.");

const source = resolve(sourceArgument);
const destination = resolve(root, "content/calculus/units", requested, "handoff");
const required = [
  "assessment-sets.public.json",
  "assessment-sets.server.json",
  "assessments.public.json",
  "assessments.server.json",
  "pages.server.json",
  "provenance.json",
  "renderer-plan.json",
  "unit-index.public.json",
  "visual-authoring-briefs.v3.json",
];

const records = [];
for (const name of required) {
  const bytes = await readFile(resolve(source, name));
  JSON.parse(bytes.toString("utf8").replace(/^\uFEFF/, ""));
  records.push({ name, bytes, sha256: createHash("sha256").update(bytes).digest("hex") });
}

const manifest = `${JSON.stringify({
  schemaVersion: 1,
  unit: requested,
  sourceDirectoryName: basename(source),
  files: records.map(({ name, bytes, sha256 }) => ({ name, bytes: bytes.byteLength, sha256 })),
}, null, 2)}\n`;

if (checkOnly) {
  for (const record of records) {
    const installed = await readFile(resolve(destination, record.name));
    const installedSha = createHash("sha256").update(installed).digest("hex");
    if (installedSha !== record.sha256) throw new Error(`${requested} installed ${record.name} differs from the verified handoff source.`);
  }
  const currentManifest = (await readFile(resolve(destination, "handoff-manifest.json"), "utf8")).replace(/\r\n?/g, "\n");
  if (currentManifest !== manifest) throw new Error(`${requested} handoff manifest is stale.`);
} else {
  await mkdir(destination, { recursive: true });
  for (const record of records) await copyFile(resolve(source, record.name), resolve(destination, record.name));
  await writeFile(resolve(destination, "handoff-manifest.json"), manifest, "utf8");
}

console.log(`${checkOnly ? "Verified" : "Installed"} ${records.length} exact ${requested} handoff artifacts in ${destination}.`);
