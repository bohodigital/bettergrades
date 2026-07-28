import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(root, "artifacts/algebra-remediation/contact-sheets");
const evidencePath = resolve(root, "artifacts/algebra-remediation/visual-review.json");
const course = JSON.parse(await readFile(resolve(root, "content/algebra/course.public.json"), "utf8"));

await mkdir(outputDirectory, { recursive: true });
const entries = [];
for (const unit of course.units) {
  const runtime = JSON.parse(await readFile(
    resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`, "public-runtime-scenes.server.json"),
    "utf8",
  ));
  const semantics = JSON.parse(await readFile(
    resolve(root, "content/algebra/units", `unit-${unit.code.toLowerCase()}`, "visual-semantic-manifests.v1.json"),
    "utf8",
  ));
  const semanticById = new Map(semantics.manifests.map((manifest) => [`algebra-${manifest.id.toLowerCase().replaceAll(".", "-")}`, manifest]));
  const inputs = runtime.scenes.map((scene) => resolve(root, "public", scene.staticAsset.path.slice(1)));
  const contactSheet = resolve(outputDirectory, `unit-${unit.code.toLowerCase()}.png`);
  execFileSync("magick", [
    "montage",
    ...inputs,
    "-thumbnail", "320x180",
    "-tile", "4x",
    "-geometry", "320x180+12+34",
    "-background", "#071827",
    "-fill", "#f4ead8",
    "-stroke", "none",
    "-pointsize", "12",
    "-set", "label", "%t",
    contactSheet,
  ], { cwd: root, stdio: "inherit" });
  for (const scene of runtime.scenes) {
    const semantic = semanticById.get(scene.id);
    entries.push({
      unitCode: unit.code,
      visualId: scene.id,
      route: semantic?.route,
      learningClaim: semantic?.learningClaim,
      assetPath: scene.staticAsset.path,
      sha256: scene.staticAsset.sha256,
      bytes: scene.staticAsset.bytes,
      semanticAssertions: semantic?.assertions.length ?? 0,
      automatedStatus: semantic && scene.staticAsset.bytes < 50_000 ? "pass" : "fail",
      contactSheet: `artifacts/algebra-remediation/contact-sheets/unit-${unit.code.toLowerCase()}.png`,
      reviewStatus: "contact-sheet-generated",
      reviewerNote: "",
    });
  }
}

const evidence = {
  schemaVersion: 1,
  generatedAt: "2026-07-28",
  visualCount: entries.length,
  unitCount: course.units.length,
  interactiveCount: course.counts.interactiveFigures,
  automatedPassCount: entries.filter((entry) => entry.automatedStatus === "pass").length,
  reviewStatus: "contact-sheets-generated-for-complete-review",
  entries,
};
await mkdir(resolve(evidencePath, ".."), { recursive: true });
await writeFile(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(`Generated ${course.units.length} contact sheets covering ${entries.length} Algebra visuals.`);
