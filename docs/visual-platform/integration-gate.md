# BVLP worker integration gate

## Controlling scope

This branch implements the infrastructure-only BetterGrades Visual Learning
Platform contract preserved at:

`/srv/local1/hub/ops/intake/work-orders/context-packets/WO-2026-07-16-BETTERGRADES-BVLP-OWNER-INSTRUCTIONS-VERBATIM.txt`

The verified SHA-256 of that byte-for-byte owner contract is
`7d12ebf341362801514cf0c221ca304bcdad7655e23150e9c9396f83fa1081e1`.
It prohibits Unit 2A content and a competing course, article, assessment,
search, or site-shell implementation lane.

## Source and merge evidence

- Canonical base: `eb665cef15c58592a7e99c979af6d04fbc823eea`
- Worker branch: `agent/bettergrades-platform-baseline-contracts-002`
- Worker commit: `4decc2528f473f579823b55041d903809faa7282`
- BVLP integration branch: `agent/bettergrades-bvlp-infrastructure-only-20260717`
- History-preserving merge: `2649ac0` (`Integrate reviewed BetterGrades baseline contracts work`)
- Durable Pi worktree: `/srv/local1/worktrees/bettergrades-bvlp-infrastructure-only-20260717`

The worker branch was clean and one commit ahead of the canonical base. Its
uncommitted diff was empty. `git diff --check`, object integrity, lint, the
existing production build, and all 67 pre-existing tests passed before merge.
The worker's isolated contract suite produced exactly its declared result: five
baseline/contract tests passed and five intentionally unimplemented broad
platform gates failed.

## Included worker artifacts

The complete worker commit remains in Git history so its attribution and review
trail are not lost. The reconciled BVLP tree retains:

- `platform/baseline/v1/golden-baseline.json` and its README;
- all eight hash-addressed desktop/mobile baseline screenshots;
- `tools/capture-platform-baseline.mjs` as a frozen historical recapture tool;
- Zod 4.4.3 and its lockfile resolution;
- the evidence that the accepted baseline contains 186 public routes, 130
  redirects, 73 Limits routes, 38 checks, 935 semantic nodes, 13 rendered
  visual IDs, 383 search records, and a 175-page print build.

The useful fail-closed schema, MathJSON-boundary, reference-integrity, renderer
capability, and performance-budget ideas were reviewed as input to the dedicated
BVLP contracts. They are not treated as authoritative until represented in the
visual-only schemas and tests required by the owner contract.

## Excluded controlling artifacts

The scope-reconciliation commit removes these files from the active tree while
preserving them in worker and merge history:

- `docs/architecture/ADR-0001-learning-platform-v1-contract-freeze.md`;
- `platform/contracts/v1/` in its worker-authored form;
- `tools/verify-textbook.mjs`;
- the `verify:textbook` and `test:platform-contracts` package scripts.

Those artifacts model a generic Course/Unit/Page registry, semantic ingestion,
assessment service, derivative intent policy, and Unit 2A fixtures. They are
valid planning history for the worker's broader parent program but conflict with
the controlling infrastructure-only BVLP contract. Their VisualSpec is also
incomplete for BVLP: it exposes renderer/vendor choice, omits CompiledScene and
adapter interfaces, lacks the required kind/layer/control/accessibility surface,
and does not implement deterministic cheapest-compatible renderer resolution.
The broad verifier is intentionally red; the owner contract requires a focused,
fully passing `verify:visuals` gate.

## Baseline limitations carried forward

The retained baseline is measured evidence, not deployment attestation. The
BVLP release must close these gaps:

- exact Sites version, immutable preview URL, Cloudflare Pages deployment, and
  rollback source are not attested by the baseline JSON;
- console, network, no-JavaScript, reduced-motion, and keyboard evidence is
  incomplete;
- route-level visual payload and hydration mapping is incomplete;
- ordinary lesson, quiz, and exam visual screenshots are not in the eight-image
  set;
- the capture tool freezes several accepted counts by design;
- short or generic assessment values excluded by the old leak scan need an
  explicit final answer-leak review;
- the baseline includes a public Compute Engine client chunk used by the
  existing Algebra checker; the BVLP compiler itself must remain build/server
  only and must not add Compute Engine to Limits visual routes.

## Gate result

The worker's meaningful evidence is integrated, its conflicting architecture is
excluded from the controlling tree with reasons, and the dedicated BVLP branch
is now the sole implementation base. Post-reconciliation validation and the
resulting commit SHA are recorded in the phase ledger before visual-platform
implementation begins.
