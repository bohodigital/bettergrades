import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { createServer } from "vite";

const root = new URL("../../../../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const vite = await createServer({ configFile: false, root: root.pathname, server: { middlewareMode: true }, appType: "custom" });
const contracts = await vite.ssrLoadModule("/platform/contracts/v1/index.ts");

after(async () => vite.close());

test("v1 authored and compiled examples satisfy the versioned Zod contracts", async () => {
  const fixtures = await readJson("platform/contracts/v1/fixtures.json");
  assert.doesNotThrow(() => contracts.AuthoredCoursePackageSchema.parse(fixtures.authored));
  assert.doesNotThrow(() => contracts.GlobalCourseIndexSchema.parse(fixtures.globalIndex));
  assert.doesNotThrow(() => contracts.ServerPageBodySchema.parse(fixtures.serverPageBody));
  assert.doesNotThrow(() => contracts.ServerAssessmentBankSchema.parse({
    ...fixtures.serverAssessmentBank,
    assessments: fixtures.authored.assessments,
  }));
  assert.throws(() => contracts.GlobalCourseIndexSchema.parse({
    ...fixtures.globalIndex,
    pageBodies: [fixtures.serverPageBody],
  }));
  assert.throws(() => contracts.GlobalCourseIndexSchema.parse({
    ...fixtures.globalIndex,
    assessments: [{ ...fixtures.globalIndex.assessments[0], answer: fixtures.authored.assessments[0].answer }],
  }));
});

test("unsupported semantic and visual constructs fail closed", async () => {
  const fixtures = await readJson("platform/contracts/v1/fixtures.json");
  assert.throws(() => contracts.SemanticNodeSchema.parse({ ...fixtures.authored.pages[0].body[0], type: "raw-html" }));
  assert.throws(() => contracts.VisualSpecSchema.parse({ ...fixtures.authored.visuals[0], sceneKind: "unregistered-dimensional-scene" }));
  assert.throws(() => contracts.MathJsonSchema.parse({ operation: "execute", value: "arbitrary" }));
  assert.throws(() => contracts.MathJsonSchema.parse(["UnregisteredFunction", "x"]));
  assert.throws(() => contracts.MathJsonSchema.parse(["Divide", "x"]));
  assert.throws(() => contracts.MathJsonSchema.parse(["Rational", 1, 0]));
  assert.throws(() => contracts.VisualSpecSchema.parse({
    ...fixtures.authored.visuals[0],
    layers: [{ id: "curve", kind: "curve", expressionRef: "missing", domain: [0, 1], samples: 100 }],
  }));
  assert.throws(() => contracts.VisualSpecSchema.parse({
    ...fixtures.authored.visuals[0],
    layers: [
      ...fixtures.authored.visuals[0].layers,
      { id: "region", kind: "region", boundaryRefs: ["missing-boundary"] },
    ],
  }));
  assert.throws(() => contracts.VisualSpecSchema.parse({
    ...fixtures.authored.visuals[0],
    datasets: [{ id: "samples", columns: { x: [0, 1], y: [1, 2] } }],
    layers: [{ id: "series", kind: "dataset", dataRef: "samples", xField: "x", yField: "missing-column" }],
  }));
  const renderers = await readJson("platform/contracts/v1/renderer-capabilities.json");
  assert.throws(() => contracts.assertVisualSpecSupported({
    ...fixtures.authored.visuals[0],
    sceneKind: "surface-3d",
    rendererCapability: "future-3d",
  }, renderers));
});

test("hierarchy, sequence, canonical, body, and accepted-variant integrity fail closed", async () => {
  const fixtures = await readJson("platform/contracts/v1/fixtures.json");
  const wrongParent = structuredClone(fixtures.authored);
  wrongParent.course.units[0].courseId = "different-course";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(wrongParent));

  const missingSequencePage = structuredClone(fixtures.authored);
  missingSequencePage.course.units[0].sequence.entries[0].pageId = "missing-page";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(missingSequencePage));

  const wrongCanonical = structuredClone(fixtures.authored);
  wrongCanonical.course.units[0].sections[0].pages[0].metadata.canonicalRoute = "/courses/calculus/wrong/";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(wrongCanonical));

  const wrongBodyRef = structuredClone(fixtures.authored);
  wrongBodyRef.course.units[0].sections[0].pages[0].bodyRef = "server:pages/wrong-page";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(wrongBodyRef));

  const wrongAssessmentBankRef = structuredClone(fixtures.authored);
  wrongAssessmentBankRef.course.units[0].sections[0].pages[0].assessmentBankRef = "server:assessments/wrong-page";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(wrongAssessmentBankRef));

  const staleAssessmentBankRef = structuredClone(fixtures.authored);
  staleAssessmentBankRef.pages[0].assessmentIds = [];
  staleAssessmentBankRef.assessments = [];
  staleAssessmentBankRef.course.units[0].sections[0].pages[0].assessmentBankRef = "server:assessments/wrong-page";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(staleAssessmentBankRef));
  delete staleAssessmentBankRef.course.units[0].sections[0].pages[0].assessmentBankRef;
  assert.doesNotThrow(() => contracts.AuthoredCoursePackageSchema.parse(staleAssessmentBankRef));

  const duplicateBody = structuredClone(fixtures.authored);
  duplicateBody.pages.push(structuredClone(duplicateBody.pages[0]));
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(duplicateBody));

  const unresolvedSemanticVisual = structuredClone(fixtures.authored);
  unresolvedSemanticVisual.pages[0].body[1].visualId = "missing-visual";
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(unresolvedSemanticVisual));

  const orphanVisual = structuredClone(fixtures.authored);
  orphanVisual.visuals.push({ ...structuredClone(orphanVisual.visuals[0]), id: "orphan-visual" });
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(orphanVisual));

  const orphanAssessment = structuredClone(fixtures.authored);
  orphanAssessment.assessments.push({ ...structuredClone(orphanAssessment.assessments[0]), id: "orphan-assessment" });
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(orphanAssessment));

  const wrongVariant = structuredClone(fixtures.authored);
  wrongVariant.assessments[0].acceptedVariants.push({ kind: "multiple-choice", optionId: "wrong" });
  assert.throws(() => contracts.AuthoredCoursePackageSchema.parse(wrongVariant));

  const collisions = await readJson("platform/contracts/v1/route-collision-policy.json");
  assert.throws(() => contracts.assertNoRouteOrIntentCollisions([
    { route: "/courses/../admin/", intent: "invalid-route" },
  ], [], collisions));
});

test("performance budgets, renderer capabilities, and collision policy are executable", async () => {
  const budgets = await readJson("platform/contracts/v1/performance-budgets.json");
  const renderers = await readJson("platform/contracts/v1/renderer-capabilities.json");
  const collisions = await readJson("platform/contracts/v1/route-collision-policy.json");
  const verification = await readJson("platform/contracts/v1/verification-plan.json");
  const implementation = await readJson("platform/contracts/v1/implementation-status.json");
  assert.doesNotThrow(() => contracts.PerformanceBudgetManifestSchema.parse(budgets));
  assert.doesNotThrow(() => contracts.RendererCapabilityManifestSchema.parse(renderers));
  assert.doesNotThrow(() => contracts.RouteCollisionPolicySchema.parse(collisions));
  assert.doesNotThrow(() => contracts.VerificationPlanSchema.parse(verification));
  assert.doesNotThrow(() => contracts.ImplementationStatusSchema.parse(implementation));
  assert.equal(new Set(verification.gates.map((gate) => gate.id)).size, verification.gates.length);
  const withinBudget = {
    route: "/courses/calculus/unit-2a/lesson/",
    category: "lightweightInteractive",
    routeJsGzipBytes: 200000,
    visualizationRuntimeGzipBytes: 30000,
    hydrationBytes: 20000,
    heavyAdapters: [],
  };
  assert.doesNotThrow(() => contracts.assertRoutePerformanceWithinBudget(withinBudget, budgets));
  assert.throws(() => contracts.assertRoutePerformanceWithinBudget({ ...withinBudget, visualizationRuntimeGzipBytes: 30721 }, budgets));
  assert.throws(() => contracts.assertRoutePerformanceWithinBudget({
    ...withinBudget,
    heavyAdapters: [{ capabilityId: "jsxgraph", gzipBytes: 100000, initialRequest: true, isolatedChunk: true }],
  }, budgets));
  const routing = await vite.ssrLoadModule("/lib/registry/routing.ts");
  for (const decision of collisions.existingIntentDecisions) {
    for (const route of decision.existingRoutes) assert.ok(routing.publicRoutes.includes(route), route);
  }
  assert.throws(() => contracts.assertNoRouteOrIntentCollisions([
    { route: "/courses/calculus/unit-2a/chain-rule/", intent: "chain-rule" },
  ], routing.publicRoutes, collisions));
  assert.throws(() => contracts.assertNoRouteOrIntentCollisions([
    { route: "/courses/calculus/unit-2a/new-lesson/", intent: "new-lesson" },
    { route: "/courses/calculus/unit-2a/new-lesson/", intent: "different-lesson" },
  ], routing.publicRoutes, collisions));
});

test("the frozen golden baseline satisfies its machine-readable contract", async () => {
  const baseline = await readJson("platform/baseline/v1/golden-baseline.json");
  assert.doesNotThrow(() => contracts.GoldenBaselineSchema.parse(baseline));
  assert.equal(baseline.source.commit, "eb665cef15c58592a7e99c979af6d04fbc823eea");
  assert.equal(baseline.routes.public.length, 186);
  assert.equal(new Set(baseline.routes.public.map((record) => record.route)).size, 186);
  assert.equal(baseline.routes.redirects.length, 130);
  assert.equal(baseline.limits.routes.length, 73);
  assert.equal(new Set(baseline.limits.routes).size, 73);
  assert.equal(baseline.limits.importedRoutes.length, 71);
  assert.equal(baseline.limits.coreSequence.length, 47);
  assert.equal(baseline.limits.supportSequence.length, 26);
  assert.equal(baseline.limits.checks.length, 38);
  assert.equal(baseline.limits.semanticNodes.length, 935);
  assert.equal(baseline.limits.graphIds.length, 13);
  assert.deepEqual(baseline.limits.answerKeyRoutes.map((key) => key.answerCount), [18, 14]);
  assert.equal(baseline.discoverability.registryCount, 186);
  assert.equal(baseline.discoverability.searchRecordCount, 383);
  assert.equal(baseline.discoverability.searchRecords.length, 383);
  assert.equal(new Set(baseline.discoverability.searchRecords.map((record) => record.id)).size, 383);
  assert.equal(baseline.discoverability.sitemap.count, 186);
  assert.equal(baseline.assets.answerLeakScan.forbiddenMatches, 0);
  assert.ok(baseline.assets.answerLeakScan.secretValuesScanned > 0);
  assert.equal(baseline.print.pages, 175);
  assert.equal(baseline.screenshots.length, 8);
  assert.equal(baseline.verification.existingTestCount, 67);
  for (const record of baseline.routes.public) {
    assert.equal(new URL(record.canonical).pathname, record.route);
    assert.equal(record.robots.toLowerCase(), "index, follow");
    assert.equal(record.analytics, true);
    assert.equal(record.sitemap, true);
  }
});

for (const gate of ["generic-registry-loader", "semantic-ingestion", "assessment-service", "visual-renderers", "textbook-verifier"]) {
  test(`future implementation gate is complete: ${gate}`, async () => {
    const status = await readJson("platform/contracts/v1/implementation-status.json");
    assert.equal(status.gates[gate], "implemented", `${gate} remains intentionally unimplemented after the contract-freeze work order`);
  });
}
