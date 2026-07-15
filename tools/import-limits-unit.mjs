import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { canonicalLimitsUnitPath, parseLimitsUnitPage, validateLimitsUnitPayload } from "../lib/calculus/limits-unit-core.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const sourceRoot = argument("--source");
const outputPath = argument("--output") ?? "content/limits-continuity/unit.json";
if (!sourceRoot) throw new Error("Usage: node tools/import-limits-unit.mjs --source <safe-extracted-root> [--output <unit.json>]");

const root = resolve(sourceRoot);
const manifestPath = resolve(root, "03_WEB_EXPORTS/web_manifest.json");
const checksPath = resolve(root, "03_WEB_EXPORTS/interactive_checks.json");
const pagesRoot = resolve(root, "03_WEB_EXPORTS/extracted_pages");
const [manifestSource, checksSource] = await Promise.all([readFile(manifestPath, "utf8"), readFile(checksPath, "utf8")]);
const manifest = JSON.parse(manifestSource);
const checksDocument = JSON.parse(checksSource);

if (manifest.version !== "3.0") throw new Error(`Expected v3.0 web manifest, received ${manifest.version}.`);
if (manifest.routes?.length !== 71) throw new Error(`Expected 71 manifest routes, received ${manifest.routes?.length}.`);
if (checksDocument.checks?.length !== 38) throw new Error(`Expected 38 interactive checks, received ${checksDocument.checks?.length}.`);

const pageEntries = await Promise.all(manifest.routes.map(async (route) => {
  const sourceFile = `${route.slug.replaceAll("/", "__")}.tex`;
  const source = await readFile(resolve(pagesRoot, sourceFile), "utf8");
  return {
    sourceSlug: route.slug,
    sourceFile,
    sha256: createHash("sha256").update(source).digest("hex"),
    source,
    nodes: parseLimitsUnitPage(source),
  };
}));

const routes = manifest.routes.map((route) => ({
  sourceSlug: route.slug,
  sourceCanonicalPath: route.canonical_path,
  path: canonicalLimitsUnitPath(route.slug),
  title: route.seo_title,
  h1: route.title,
  description: route.meta_description,
  pageType: route.type,
  primaryQuery: route.primary_query,
  sourceFile: `${route.slug.replaceAll("/", "__")}.tex`,
  sequenceIndex: route.sequence_index,
  breadcrumbs: ["Subjects", "Mathematics", "Calculus", ...route.breadcrumbs.slice(1)],
  indexable: Boolean(route.indexable),
  schemaTypes: route.schema_types,
  checkIds: route.interactive_checks,
  relatedResources: route.related_resources,
  isCoreSequence: Boolean(route.is_core_sequence),
  coreSequenceIndex: route.core_sequence_index,
  previousCoreSlug: route.previous_core_slug,
  nextCoreSlug: route.next_core_slug,
  returnToSequenceSlug: route.return_to_sequence_slug,
  supportCluster: route.support_cluster,
  supportKind: route.support_kind,
}));

const checks = checksDocument.checks.map((check) => ({
  id: check.id,
  routeSlug: check.route_slug,
  mode: check.mode,
  answerType: check.answer_type,
  canonicalAnswer: check.canonical_answer,
  promptLatex: check.prompt_latex,
  hintLatex: check.hint_latex,
  workedFeedbackLatex: check.worked_feedback_latex,
  attemptRequiredBeforeReveal: Boolean(check.attempt_required_before_reveal),
}));

const excludedArchiveMembers = [
  "01_FINAL_DELIVERABLES/student_textbook.pdf",
  "01_FINAL_DELIVERABLES/editorial_web_boundary_textbook.pdf",
  "02_MODULAR_SOURCE/main.pdf",
  "02_MODULAR_SOURCE/main_editorial.pdf",
  "02_MODULAR_SOURCE/bettergrades_limits_continuity_webtext_v3_singlefile.pdf",
  "04_SOURCE_MATERIAL/active_calculus_single_2e.pdf",
  "04_SOURCE_MATERIAL/calculus_made_easy.pdf",
  "04_SOURCE_MATERIAL/granville_elements_calculus.pdf",
  "04_SOURCE_MATERIAL/greenhill_differential_integral_calculus.pdf",
  "04_SOURCE_MATERIAL/vector_calculus_shaw.pdf",
  "02_MODULAR_SOURCE/tools/split_webpages.py",
  "05_TOOLING/bg_v3_build.py",
  "05_TOOLING/update_core_nav.py",
  "05_TOOLING/split_webpages.py",
  "06_ARCHIVES/webtext_v3_source.zip",
  "06_ARCHIVES/calculus_source_pack.zip",
];

const payload = {
  schemaVersion: "1.0",
  unit: { id: "calculus-limits-continuity-unit-1", title: manifest.course, routeCount: routes.length, coreRouteCount: 47, supportingRouteCount: 24, checkCount: checks.length },
  source: {
    archiveName: "bettergrades_limits_continuity_complete_handoff_v3.zip",
    archiveSha256: "24e5cf5ca36d9756dc5fb9b799be1dc1c480891ef6046039440cd9b5e8b926f1",
    archiveEntryCount: 231,
    declaredPayloadFileCount: 212,
    selectivelyExtractedFileCount: 198,
    internallyVerifiedFileCount: 195,
    excludedArchiveMembers,
    provenance: {
      status: "bettergrades-original",
      activeCalculusAdaptedMaterial: false,
      sourceCategories: ["bettergrades-original", "cc-by-sa-reference-only", "public-domain-reference-only"],
      note: "The exposition is original. No Active Calculus exercise is reproduced verbatim. Public-domain examples were modernized and recomposed when used as inspiration.",
    },
  },
  routes,
  checks,
  pages: pageEntries,
};

const errors = validateLimitsUnitPayload(payload);
if (errors.length) throw new Error(`Limits unit import rejected:\n- ${errors.join("\n- ")}`);
await mkdir(dirname(resolve(outputPath)), { recursive: true });
await writeFile(resolve(outputPath), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Imported ${routes.length} routes, ${pageEntries.length} pages, and ${checks.length} checks to ${resolve(outputPath)}.`);
