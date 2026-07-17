# Adversarial architecture review

- Work order: WO-2026-07-16-BETTERGRADES-PLATFORM-BASELINE-CONTRACTS-002
- Reviewer posture: fresh-context architecture reviewer covering code, test, and performance
- Review cycles: initial issues-only pass plus two bounded reconciliation passes
- Cross-model review: skipped because this is a non-interactive work-order fulfilment run

## Claim blocks

### Clean baseline provenance

- Claim: the freeze represents clean canonical main/origin-main at
  eb665cef15c58592a7e99c979af6d04fbc823eea and current apex behavior.
- Boundary: it does not claim that the apex URL is an immutable deployment URL.
- Evidence: golden-baseline source/verification blocks, clean canonical repository
  checks, public-source input diff, fresh Pages build, 67-test TAP hash, live crawl.

### Strict hierarchy and server boundaries

- Claim: invalid parent IDs, duplicate IDs/routes/bodies, incomplete or incorrect
  sequence entries, canonical mismatches, invalid visibility escalation, unresolved
  page/visual/assessment references, and mismatched answer variants fail parsing.
- Boundary: loaders and services are future implementation gates.
- Evidence: CourseSchema/AuthoredCoursePackageSchema refinements and adversarial tests.

### Fail-closed mathematics and visuals

- Claim: MathJSON uses an allowlisted, depth/node/arity-bounded AST; VisualSpec
  expressions and datasets are strict and every layer reference resolves.
- Boundary: renderer implementations remain planned; reserved 3D fails capability
  validation.
- Evidence: MathJsonSchema, VisualSpecSchema, capability validator, negative tests.

### Answer isolation

- Claim: current client JavaScript/CSS and compact global artifacts contain none
  of four forbidden server field names or 41 distinctive server-only values.
- Boundary: 21 too-short values, three values already present in approved public
  check payloads, and two generic infinity tokens are explicitly counted rather
  than treated as reliable canaries.
- Evidence: golden-baseline answerLeakScan plus existing global-index boundary tests.

### Complete behavior inventory

- Claim: all 383 normalized search records and every complete public/server check
  contract have stable hashes in addition to the full route/node/graph inventory.
- Boundary: hashes detect change; source payloads remain in their owning files.
- Evidence: golden-baseline discoverability.searchRecords and limits.checks.

### Executable performance contract

- Claim: budget accounting defines cold-cache gzip route JavaScript, first-request
  visualization runtime, initial RSC hydration bytes, and isolated heavy adapters;
  an evaluator rejects size, hydration, initial-load, and isolation violations.
- Boundary: route-level browser transfer and hydration capture is intentionally the
  planned bundle-budgets/hydration-budgets verifier gate, not asserted as current.
- Evidence: performance-budgets.json, RoutePerformanceMeasurementSchema, evaluator
  pass/fail fixtures.

## Findings and reconciliation

1. High — baseline provenance was caller-asserted. Fixed by proving canonical
   clean main/origin-main, diffing every public source input against the commit,
   rebuilding Pages, rerunning all 67 tests, hashing both logs, verifying Tectonic
   0.16.9, and parsing fatal print errors.
2. High — hierarchy and package integrity were structural only. Fixed with strict
   normalized routes and cross-record refinements for parents, sequence, canonical,
   visibility, uniqueness, bodies, visuals, assessments, variants, and options.
3. High — arbitrary MathJSON and unresolved visual references parsed. Fixed with
   a bounded operator allowlist and strict expression/dataset registries.
4. High — answer scan checked only two property names. Fixed with four field
   canaries, exact distinctive-value scanning, public/global targets, and explicit
   collision accounting.
5. Medium — only search counts and partial checks were frozen. Fixed with 383
   per-record hashes and complete public/server check hashes.
6. Medium — budgets lacked accounting and evaluation. Fixed with exact accounting
   semantics and executable positive/negative measurements. Real route transfer and
   hydration collection remains a named future verifier gate.
7. High — server body/bank references, semantic visual references, and orphan
   visuals/assessments could still disagree while their individual IDs parsed.
   Fixed by binding manifest references to canonical server namespaces, requiring
   semantic visual use to equal the page declaration, and rejecting every orphan.
8. High — allowlisted MathJSON operators did not yet enforce operand shape, while
   visual regions and dataset axes could name unresolved fields. Fixed with
   operator-specific arity and rational-number rules, two-pass layer-reference
   validation, and dataset-column resolution. Negative regression cases exercise
   each repaired boundary.
9. High — an unassessed page could retain an unchecked assessment-bank reference.
   Fixed by requiring assessmentBankRef to be canonical when assessments exist and
   absent otherwise, with rejecting and accepting regression cases.

## Residual risks

- The live crawl is bound to the current apex, not an immutable deployment URL.
  The source, local build, tests, metadata, routes, assets, and screenshots agree
  with the accepted baseline, but the hosting platform does not expose a commit
  attestation through the apex response.
- Current project-wide tsc --noEmit has pre-existing failures in unchanged app and
  library files. Lint, production build, and all 67 existing tests pass; the new
  contract module adds no TypeScript diagnostic.
- Print output has nonfatal box/package warnings recorded verbatim in the manifest.
