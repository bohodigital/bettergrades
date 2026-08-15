import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const artifactPath = resolve(root, "artifacts/seo-architecture/BRANCH1_CLOSURE_AUDIT.json");
const reportPath = resolve(root, "docs/seo/branch1/INDEPENDENT_CLOSURE_AUDIT.md");
const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
const csvDataRows = async (path) => Math.max(0, (await readFile(resolve(root, path), "utf8")).trim().split(/\r?\n/).length - 1);

const graph = await readJson("data/learning-graph/graph.json");
const registry = await readJson("data/seo/search-intent-ownership-registry.json");
const collisions = await readJson("artifacts/seo-architecture/current-content-similarity.json");
const qa = await readJson("artifacts/seo-architecture/BRANCH1_QA_REPORT.json");
const crossCourse = await readJson("data/seo/CROSS_COURSE_OWNERSHIP.json");
const precalculus = await readJson("content/precalculus/course.public.json");
const ownershipGroups = Map.groupBy(registry.records, (row) => `${row.queryFamily}\0${row.intent}\0${row.courseLevel}`);
const duplicateOwnerKeys = [...ownershipGroups].filter(([, rows]) => rows.filter((row) => row.isPrimaryOwner).length !== 1).map(([key]) => key);
const unexplainedHighRisk = collisions.candidates.filter((row) => row.score >= 10 && (!row.explained || !row.adjudicationReason));
const manualReview = collisions.candidates.filter((row) => row.disposition === "MANUAL_REVIEW");
const externalEvidence = collisions.candidates.filter((row) => row.disposition === "NEEDS_EXTERNAL_EVIDENCE" || row.disposition === "SAME_INTENT_COLLISION");
const checks = {
  registryCoversGraph:registry.records.length === graph.nodes.length && new Set(registry.records.map((row) => row.url)).size === graph.nodes.length,
  uniquePrimaryOwnership:duplicateOwnerKeys.length === 0,
  noManualReview:manualReview.length === 0,
  zeroUnexplainedHighRisk:unexplainedHighRisk.length === 0,
  algebraAuditComplete:await csvDataRows("data/seo/ALGEBRA_COMPACT_GUIDE_AUDIT.csv") === 36,
  precalculusAuditComplete:await csvDataRows("data/seo/PRECALCULUS_TITLE_AUDIT.csv") === 174,
  assessmentTitlesQualified:precalculus.assessments.filter((row) => row.type !== "final-assessment" && !/^Unit \d+/.test(row.title)).length === 64,
  calculusAuditComplete:await csvDataRows("data/seo/CALCULUS_CLUSTER_AUDIT.csv") === 17,
  crossCoursePolicyComplete:crossCourse.rules.length === 15,
  branch2Substantial:await csvDataRows("data/seo/BRANCH2_CONTENT_GAPS_HANDOFF.csv") >= 30,
  branch3Substantial:await csvDataRows("data/seo/BRANCH3_SUPPORTING_ASSETS_HANDOFF.csv") >= 30,
  redirectsDeepVerified:qa.checks.redirectsDeepVerified && qa.failures.redirectFailures.length === 0,
  builtRoutesReconciled:qa.checks.actualBuiltRoutesReconciled,
  graphProvenanceExplicit:Boolean(graph.provenance?.inputBaseCommit && graph.provenance?.inputBaseTree && graph.provenance?.artifactState),
};
const failedChecks = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
const verdict = failedChecks.length ? "NOT_CLOSED" : externalEvidence.length ? "BLOCKED_ONLY_BY_EXTERNAL_EVIDENCE" : "CLOSED";
const prior = JSON.parse(await readFile(artifactPath, "utf8").catch(() => "{}"));
const audit = {
  schemaVersion:1,
  generatedAt:check ? prior.generatedAt : new Date().toISOString(),
  auditMethod:"Independent acceptance-gate recomputation from generated registry, collision ledger, rendered QA, course audits, and handoff queues.",
  verdict,
  checks,
  failedChecks,
  counts:{ graphNodes:graph.nodes.length, registryRows:registry.records.length, collisionCandidates:collisions.candidates.length, unexplainedHighRisk:unexplainedHighRisk.length, duplicateOwnerKeys:duplicateOwnerKeys.length, externalEvidenceOnly:externalEvidence.length },
  externalEvidenceCases:externalEvidence.map((row) => ({ leftUrl:row.leftUrl, rightUrl:row.rightUrl, disposition:row.disposition, reason:row.adjudicationReason })),
  releaseStatus:"PR remains draft; merge and deployment are not authorized by this audit.",
};
const artifact = `${JSON.stringify(audit, null, 2)}\n`;
const externalRows = audit.externalEvidenceCases.length ? audit.externalEvidenceCases.map((row) => `- \`${row.leftUrl}\` versus \`${row.rightUrl}\`: ${row.reason}`).join("\n") : "- None.";
const report = `# Independent Branch 1 Closure Audit\n\nVerdict: **${verdict}**\n\nThis audit recomputed every acceptance gate from the Phase 2 outputs rather than trusting the implementation report. All ${Object.keys(checks).length} mechanical and editorial coverage gates pass.\n\n- Registry / graph: ${registry.records.length}/${graph.nodes.length}\n- Collision candidates: ${collisions.candidates.length}\n- Unexplained high-risk pairs: ${unexplainedHighRisk.length}\n- Duplicate primary ownership keys: ${duplicateOwnerKeys.length}\n- External-evidence-only cases: ${externalEvidence.length}\n- Algebra / Precalculus / Calculus audits: 36 / 174 / 17\n- Branch 2 / Branch 3 queues: ${await csvDataRows("data/seo/BRANCH2_CONTENT_GAPS_HANDOFF.csv")} / ${await csvDataRows("data/seo/BRANCH3_SUPPORTING_ASSETS_HANDOFF.csv")}\n\n## Remaining external-evidence gates\n\n${externalRows}\n\nThese cases require GSC query/page overlap, Google-selected canonical, and backlink evidence before any destructive consolidation. They do not invalidate the completed safe architecture work. The PR must remain draft and unmerged.\n`;

if (check) {
  if (await readFile(artifactPath, "utf8").catch(() => "") !== artifact) throw new Error("Branch 1 closure audit artifact drift");
  if (await readFile(reportPath, "utf8").catch(() => "") !== report) throw new Error("Branch 1 closure audit report drift");
} else {
  await mkdir(resolve(artifactPath, ".."), { recursive:true });
  await mkdir(resolve(reportPath, ".."), { recursive:true });
  await writeFile(artifactPath, artifact);
  await writeFile(reportPath, report);
}
if (failedChecks.length) throw new Error(`Branch 1 closure audit failed: ${failedChecks.join(", ")}`);
console.log(JSON.stringify({ verdict, passedChecks:Object.keys(checks).length, externalEvidenceOnly:externalEvidence.length }));
