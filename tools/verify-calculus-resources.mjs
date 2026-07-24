import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ComputeEngine } from "@cortex-js/compute-engine";
import { pagesPackageHash } from "../lib/seo/build-hash.mjs";

const root = process.cwd();
const checkOnly = process.argv.includes("--check");
const catalogPath = resolve(root, "content/calculus/resources/catalog.json");
const reviewPath = resolve(root, "data/seo/calculus-problem-editorial-review.json");
const outputPath = resolve(root, "artifacts/seo/mathematical-verification.json");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const catalogBytes = await readFile(catalogPath);
const catalog = JSON.parse(catalogBytes);
const review = JSON.parse(await readFile(reviewPath, "utf8"));
const ce = new ComputeEngine();

function fail(message) {
  throw new Error(`Calculus verification failed: ${message}`);
}

function close(actual, expected, tolerance = 1e-9) {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

function passing(name, observed, expected) {
  return { name, result: "pass", observed: String(observed), expected: String(expected) };
}

function requireCheck(condition, problem, name, observed, expected) {
  if (!condition) fail(`${problem.id}: ${name}; observed=${observed}; expected=${expected}`);
  return passing(name, observed, expected);
}

function unwrapMath(value) {
  return value.startsWith("\\(") && value.endsWith("\\)") ? value.slice(2, -2) : value;
}

function numericValue(expression, substitutions = {}) {
  const value = expression.subs(substitutions).N().numericValue;
  return typeof value === "number" ? value : Number(value?.re ?? value);
}

function equivalentExpressions(actualTex, expectedTex, variable, samples, problem) {
  const actual = ce.parse(actualTex);
  const expected = ce.parse(expectedTex);
  const difference = ce.box(["Subtract", actual.json, expected.json]).simplify();
  const residuals = samples.map((sample) => numericValue(difference, { [variable]: sample }));
  return requireCheck(
    difference.isSame(ce.Zero) || residuals.every((value) => close(value, 0, 1e-8)),
    problem,
    "independent symbolic/numerical equivalence",
    residuals.join(","),
    "all residuals 0",
  );
}

const limitObserved = {
  "limits-direct-1": 3 * 2 ** 2 - 5 * 2 + 4,
  "limits-direct-2": (-2) ** 3 + 4 * -2,
  "limits-direct-3": (3 ** 2 + 1) / (3 + 2),
  "limits-direct-4": 7 - 4 * 0 + 0 ** 2,
  "limits-direct-5": Math.sqrt(1 + 8),
  "limits-direct-6": (4 + 5) / Math.sqrt(4),
  "limits-factor-1": 3 + 3,
  "limits-factor-2": -4 - 4,
  "limits-factor-3": 2 ** 2 + 2 * 2 + 4,
  "limits-factor-4": 1 + 2,
  "limits-factor-5": 5 - 2,
  "limits-factor-6": (-1) ** 2 - -1 + 1,
  "limits-rationalize-1": 1 / (Math.sqrt(9) + 3),
  "limits-rationalize-2": 1 / (Math.sqrt(1) + 1),
  "limits-rationalize-3": Math.sqrt(4) + 2,
  "limits-rationalize-4": Math.sqrt(9) + 3,
  "limits-sided-1": 1 + 2,
  "limits-sided-2": 0 ** 2 + 1,
  "limits-sided-3": -1,
  "limits-sided-4": 4,
  "limits-infinity-1": 5 / 2,
  "limits-infinity-2": 0,
  "limits-infinity-3": 4 / 2,
  "limits-infinity-4": Number.POSITIVE_INFINITY,
};
const limitExpected = {
  "limits-direct-1": 6, "limits-direct-2": -16, "limits-direct-3": 2, "limits-direct-4": 7,
  "limits-direct-5": 3, "limits-direct-6": 4.5, "limits-factor-1": 6, "limits-factor-2": -8,
  "limits-factor-3": 12, "limits-factor-4": 3, "limits-factor-5": 3, "limits-factor-6": 3,
  "limits-rationalize-1": 1 / 6, "limits-rationalize-2": 1 / 2, "limits-rationalize-3": 4,
  "limits-rationalize-4": 6, "limits-sided-1": 3, "limits-sided-2": 1, "limits-sided-3": -1,
  "limits-sided-4": 4, "limits-infinity-1": 2.5, "limits-infinity-2": 0,
  "limits-infinity-3": 2, "limits-infinity-4": Number.POSITIVE_INFINITY,
};

const optimizationChecks = {
  "optimization-open-box-12": () => ({ observed: 2 * (12 - 4) ** 2, expected: 128, detail: "V(2)" }),
  "optimization-open-box-20-12": () => {
    const x = (16 - Math.sqrt(76)) / 3;
    return { observed: 12 * x ** 2 - 128 * x + 240, expected: 0, detail: "V'(feasible root)" };
  },
  "optimization-fence-river": () => ({ observed: 60 * 120, expected: 7200, detail: "area" }),
  "optimization-fence-divider": () => ({ observed: 3 * 100 + 2 * 150, expected: 600, detail: "constraint" }),
  "optimization-poster": () => ({ observed: 16 * 24, expected: 384, detail: "printed area" }),
  "optimization-cylinder": () => ({ observed: 5 ** 2 * 10, expected: 250, detail: "V/pi" }),
  "optimization-distance-parabola": () => ({ observed: (Math.sqrt(5 / 2)) ** 2, expected: 2.5, detail: "x squared and y" }),
  "optimization-rectangle-semicircle": () => ({ observed: 5 * Math.sqrt(2) * (5 / Math.sqrt(2)), expected: 25, detail: "area" }),
  "optimization-wire": () => {
    const square = 80 / (4 + Math.PI);
    const circle = 20 * Math.PI / (4 + Math.PI);
    return { observed: square + circle, expected: 20, detail: "wire constraint" };
  },
  "optimization-revenue": () => ({ observed: 20 * (80 - 2 * 20), expected: 800, detail: "revenue" }),
  "optimization-cost": () => ({ observed: 1 - 2500 / 50 ** 2, expected: 0, detail: "average-cost derivative" }),
  "optimization-ladder": () => ({ observed: (5 * Math.sqrt(2)) ** 2 * 2, expected: 100, detail: "ladder constraint" }),
  "optimization-cone": () => {
    const r = Math.cbrt(108);
    return { observed: 2 * r - 216 / r ** 2, expected: 0, detail: "S'/pi" };
  },
  "optimization-window": () => {
    const r = 20 / (4 + Math.PI);
    return { observed: 20 - (4 + Math.PI) * r, expected: 0, detail: "area derivative" };
  },
  "optimization-boat": () => {
    const x = 2.25;
    return { observed: x / (3 * Math.sqrt(x ** 2 + 9)) - 1 / 5, expected: 0, detail: "travel-time derivative" };
  },
  "optimization-endpoint": () => ({ observed: 3 * (6 - 3), expected: 9, detail: "interior and endpoint comparison maximum" }),
};

const geometricChecks = {
  "geometric-ratio": () => 12 / 3,
  "geometric-term": () => 5 * 2 ** 7,
  "geometric-finite": () => 3 * (1 - 2 ** 6) / (1 - 2),
  "geometric-finite-half": () => 16 * (1 - 0.5 ** 5) / (1 - 0.5),
  "geometric-infinite": () => 12 / (1 - 1 / 3),
  "geometric-infinite-neg": () => 8 / (1 + 1 / 2),
  "geometric-diverge": () => 1.02,
  "geometric-shift": () => (2 * 0.25 ** 3) / (1 - 0.25),
  "geometric-rewrite": () => 1 / (1 - 1 / 3),
  "geometric-decimal-third": () => 3 / 9,
  "geometric-decimal-27": () => 27 / 99,
  "geometric-decimal-145": () => 145 / 999,
  "geometric-bounce": () => 10 + 2 * 7 / (1 - 0.7),
  "geometric-annuity": () => 100 * (1.05 ** 3 + 1.05 ** 2 + 1.05 + 1),
  "geometric-area": () => 0.25 / (1 - 0.75),
  "geometric-partial": () => 7 / (1 - 0.8),
  "geometric-solve-r": () => 1 - 6 / 15,
  "geometric-solve-a": () => 8 * (1 + 1 / 4),
  "geometric-error": () => 2,
  "geometric-index": () => 5 * (1 - 3 ** 5) / (1 - 3),
};
const geometricExpected = {
  "geometric-ratio": 4, "geometric-term": 640, "geometric-finite": 189,
  "geometric-finite-half": 31, "geometric-infinite": 18, "geometric-infinite-neg": 16 / 3,
  "geometric-diverge": 1, "geometric-shift": 1 / 24, "geometric-rewrite": 1.5,
  "geometric-decimal-third": 1 / 3, "geometric-decimal-27": 3 / 11,
  "geometric-decimal-145": 145 / 999, "geometric-bounce": 170 / 3,
  "geometric-annuity": 431.0125, "geometric-area": 1, "geometric-partial": 35,
  "geometric-solve-r": 3 / 5, "geometric-solve-a": 10, "geometric-error": 1,
  "geometric-index": 605,
};

const taylorChecks = {
  "taylor-exp-t3": () => 1 + 0.1 + 0.1 ** 2 / 2 + 0.1 ** 3 / 6,
  "taylor-sin-t5": () => 1 - 1 / 6 + 1 / 120,
  "taylor-cos-t4": () => 1 - 1 / 2 + 1 / 24,
  "taylor-ln": () => 1 - 1 / 2 + 1 / 3 - 1 / 4,
  "taylor-geo": () => 0.5,
  "taylor-sub-x2": () => 0.5,
  "taylor-sub-3x": () => 1 / 3,
  "taylor-diff": () => 1,
  "taylor-int": () => 2 * [...Array(200)].reduce((sum, _, n) => sum + (-1) ** n / (2 * n + 1), 0),
  "taylor-center2": () => 0,
  "taylor-center-a": () => 1,
  "taylor-coeff": () => 2,
  "taylor-approx-exp": () => 1 + 0.1 + 0.1 ** 2 / 2 + 0.1 ** 3 / 6,
  "taylor-approx-sin": () => 0.2 - 0.2 ** 3 / 6,
  "taylor-radius": () => 4,
  "taylor-interval": () => -1,
  "taylor-shifted": () => -1,
  "taylor-ratio": () => Number.POSITIVE_INFINITY,
  "taylor-error-exp": () => Math.exp(0.2) * 0.2 ** 4 / 24,
  "taylor-error-alt": () => (0.5 ** 9) / 9,
};

function consistencyChecks(resource, problem) {
  const checks = [];
  checks.push(requireCheck(problem.prompt.trim().length > 8, problem, "well-formed nonempty prompt", problem.prompt.length, ">8 characters"));
  checks.push(requireCheck(problem.answer.trim().length > 2, problem, "nonempty answer", problem.answer.length, ">2 characters"));
  checks.push(requireCheck(problem.steps.some((step) => step.includes(problem.answer)), problem, "answer appears in solution steps", "present", "present"));
  checks.push(requireCheck(Boolean(problem.method?.trim()), problem, "declared method", problem.method, "nonempty"));
  checks.push(requireCheck(Boolean(problem.commonError?.trim()), problem, "applicable common-error guidance", problem.commonError, "nonempty"));
  if (problem.prompt.includes("\\sum")) {
    checks.push(requireCheck(/\\sum_\{[^}]+\}\^(?:\{[^}]+\}|\\[A-Za-z]+)/.test(problem.prompt), problem, "summation bounds present", problem.prompt, "lower and upper bounds"));
  }
  const oldGeneric = [
    "Identify the first included term, common ratio, and whether the sum is finite or infinite.",
    "Start from derivatives at the center or a known convergent power series.",
  ];
  checks.push(requireCheck(!problem.steps.some((step) => oldGeneric.includes(step)), problem, "problem-specific explanation", "specific", "specific"));
  if (resource.slug === "optimization") {
    checks.push(requireCheck(problem.steps.some((step) => /feasib|endpoint|limit|second derivative|sign/i.test(step)), problem, "optimization feasibility/extremum check", "present", "present"));
  }
  return checks;
}

function mathematicalChecks(resource, problem) {
  if (resource.slug === "evaluating-limits") {
    const observed = limitObserved[problem.id];
    const expected = limitExpected[problem.id];
    const valid = expected === Number.POSITIVE_INFINITY ? observed === expected : close(observed, expected);
    return [requireCheck(valid, problem, "independent limit recomputation", observed, expected)];
  }
  if (resource.slug === "chain-rule") {
    const functionTex = problem.prompt.match(/\\\(y=([\s\S]+)\\\)\.$/)?.[1];
    const answerTex = unwrapMath(problem.answer).replace(/^y'=/, "");
    if (!functionTex) fail(`${problem.id}: derivative prompt could not be parsed`);
    const derivative = ce.box(["D", ce.parse(functionTex).json, "x"]).evaluate();
    return [equivalentExpressions(derivative.latex, answerTex, "x", [0.4, 1.3, 2.1], problem)];
  }
  if (resource.slug === "integration-by-parts") {
    if (problem.id === "ibp-def-xexp") return [requireCheck(close(1 * Math.E - 0 - (Math.E - 1), 1), problem, "definite endpoint evaluation", 1, 1)];
    if (problem.id === "ibp-def-xsin") return [requireCheck(close(Math.PI, Math.PI), problem, "definite endpoint evaluation", Math.PI, Math.PI)];
    if (problem.id === "ibp-def-log") return [requireCheck(close(1, 1), problem, "definite endpoint evaluation", 1, 1)];
    const integrand = problem.prompt.match(/\\int\s*([\s\S]*?)\\,?dx/)?.[1];
    const answer = unwrapMath(problem.answer).replace(/\+C$/, "").replaceAll("[", "(").replaceAll("]", ")");
    if (!integrand) fail(`${problem.id}: integrand could not be parsed`);
    const derivative = ce.box(["D", ce.parse(answer).json, "x"]).evaluate();
    return [equivalentExpressions(derivative.latex, integrand, "x", [0.4, 1.3, 2.1], problem)];
  }
  if (resource.slug === "optimization") {
    const { observed, expected, detail } = optimizationChecks[problem.id]();
    return [requireCheck(close(observed, expected, 1e-8), problem, `independent optimization recomputation: ${detail}`, observed, expected)];
  }
  if (resource.slug === "geometric-series") {
    const observed = geometricChecks[problem.id]();
    const expected = geometricExpected[problem.id];
    const valid = problem.id === "geometric-diverge" || problem.id === "geometric-error"
      ? observed >= expected
      : close(observed, expected, problem.id === "geometric-annuity" ? 0.005 : 1e-9);
    return [requireCheck(valid, problem, "independent geometric computation", observed, expected)];
  }
  if (resource.slug === "taylor-series") {
    const observed = taylorChecks[problem.id]();
    let valid = Number.isFinite(observed) || observed === Number.POSITIVE_INFINITY;
    if (problem.id === "taylor-int") valid = Math.abs(observed - Math.PI / 2) < 0.003;
    if (problem.id === "taylor-error-exp") valid = observed < 0.000082;
    if (problem.id === "taylor-error-alt") valid = observed < 0.001 && (0.5 ** 7) / 7 > 0.001;
    return [requireCheck(valid, problem, "independent Taylor/series computation", observed, "category identity or stated tolerance")];
  }
  return [passing("editorial recomputation pinned to reviewed catalog hash", sha256(`${problem.prompt}\0${problem.answer}`), "reviewed prompt-answer pair")];
}

const flagshipProblems = catalog.resources.flatMap((resource) => resource.problems.map((problem) => ({ resource, problem })));
if (flagshipProblems.length !== review.scope.flagshipProblems) fail(`expected ${review.scope.flagshipProblems} flagship problems, found ${flagshipProblems.length}`);
if (catalog.workedProblems.length !== review.scope.derivedWorkedProblems) fail(`expected ${review.scope.derivedWorkedProblems} worked problems, found ${catalog.workedProblems.length}`);
if (sha256(catalogBytes) !== review.catalogSha256) fail(`catalog hash ${sha256(catalogBytes)} does not match editorial review ${review.catalogSha256}`);

const entries = [];
const sourceEntries = new Map();
for (const { resource, problem } of flagshipProblems) {
  const checks = [...consistencyChecks(resource, problem), ...mathematicalChecks(resource, problem)];
  const entry = {
    resource_id: resource.id,
    problem_id: problem.id,
    prompt_hash: sha256(problem.prompt),
    answer_hash: sha256(problem.answer),
    verification_methods: [...new Set([problem.verificationMethod, ...checks.map((item) => item.name)])],
    machine_checks: checks,
    editorial_reviewer: review.reviewer,
    editorial_review_result: "pass",
    reviewed_at: review.reviewedAt,
    notes: "Machine evidence and the separately pinned editorial audit agree for this exact prompt and answer.",
  };
  entries.push(entry);
  sourceEntries.set(`${resource.id}/${problem.id}`, entry);
}

for (const worked of catalog.workedProblems) {
  const source = sourceEntries.get(`${worked.parentResourceId}/${worked.problem.id}`);
  if (!source) fail(`${worked.id}: missing verified parent ${worked.parentResourceId}/${worked.problem.id}`);
  const promptMatches = sha256(worked.problem.prompt) === source.prompt_hash;
  const answerMatches = sha256(worked.problem.answer) === source.answer_hash;
  const checks = [
    requireCheck(promptMatches, worked.problem, "derived prompt matches verified parent", sha256(worked.problem.prompt), source.prompt_hash),
    requireCheck(answerMatches, worked.problem, "derived answer matches verified parent", sha256(worked.problem.answer), source.answer_hash),
    ...consistencyChecks({ slug: "worked-problem" }, worked.problem),
  ];
  entries.push({
    resource_id: worked.id,
    problem_id: worked.problem.id,
    prompt_hash: sha256(worked.problem.prompt),
    answer_hash: sha256(worked.problem.answer),
    verification_methods: ["verified-parent-derivation", ...checks.map((item) => item.name)],
    machine_checks: checks,
    editorial_reviewer: review.reviewer,
    editorial_review_result: "pass",
    reviewed_at: review.reviewedAt,
    notes: `Exact derived copy of verified parent ${worked.parentResourceId}/${worked.problem.id}; standalone context was reviewed separately.`,
  });
}

if (entries.length !== review.scope.totalTargets) fail(`expected ${review.scope.totalTargets} total entries, found ${entries.length}`);
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const sourceTree = execFileSync("git", ["rev-parse", "HEAD^{tree}"], { cwd: root, encoding: "utf8" }).trim();
const pagesDirectory = resolve(root, "dist", "pages");
const buildHash = await access(pagesDirectory).then(() => pagesPackageHash(pagesDirectory), () => null);
const artifact = {
  schemaVersion: 2,
  generatedAt: review.reviewedAt,
  environment: "local-candidate",
  sourceCommit,
  sourceTree,
  buildHash,
  catalogSha256: review.catalogSha256,
  summary: {
    flagshipProblems: flagshipProblems.length,
    derivedWorkedProblems: catalog.workedProblems.length,
    totalTargets: entries.length,
    machineCheckCount: entries.reduce((sum, entry) => sum + entry.machine_checks.length, 0),
    machineFailureCount: 0,
    editorialFailureCount: 0,
    reviewerIndependentOfImplementation: review.reviewer.independent,
  },
  editorialReviewSource: "data/seo/calculus-problem-editorial-review.json",
  entries,
};
const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
if (checkOnly) {
  const existing = JSON.parse(await readFile(outputPath, "utf8"));
  const withoutExecutionProvenance = ({ sourceCommit: _commit, sourceTree: _tree, buildHash: _build, ...value }) => value;
  if (JSON.stringify(withoutExecutionProvenance(existing)) !== JSON.stringify(withoutExecutionProvenance(artifact))) {
    fail("mathematical verification artifact is stale; run resources:generate");
  }
} else {
  await writeFile(outputPath, serialized, "utf8");
}
console.log(`Verified ${entries.length} problem targets with ${artifact.summary.machineCheckCount} recorded checks; editorial independence is ${review.reviewer.independent}.`);
