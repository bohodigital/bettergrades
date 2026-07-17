# BVLP operations

## Routine build and validation

Work only in the durable isolated branch/worktree from the verified canonical
origin. Preserve unrelated work. Use the pinned pnpm/lockfile and existing
vinext/Pages pipeline. The minimum release candidate gates are frozen install,
lint, repository tests, production/Pages build, the focused visual tests in
[Testing](TESTING.md), the installed `verify:visuals` gate, Tectonic,
bundle/payload/asset and source/answer leak scans, documentation drift checks,
and real browser QA.

After each phase, update the changelog, dependency/architecture decisions,
phase ledger, commands/results/measurements, commit, limitations/deviations,
rollback, and next phase. Do not reconstruct evidence at the end.

## Runtime triage

Use exact source and immutable deployment identifiers. Inspect browser-visible
math/visuals, console/network, generated asset manifests, cache headers, and
route payloads; a successful build, deployment status, or HTTP 200 alone does
not prove health. Static SVG, caption, long description, and print mapping are
the safe baseline if optional interaction fails.

## Security and scope

Never print credentials. Use the approved secret-safe Pages wrapper and only the
credential class required for the authorized operation. Do not change DNS,
Cloudflare products/bindings, content/article/assessment/search/site-shell
systems, or add Unit 2A/public derivative work. Preserve evidence and stop on
source ambiguity, answer/source leaks, unsafe expressions, mathematical parity
failure, Compute Engine client leakage, inaccessible required interaction,
unresolved budget exceedance, or unmatchable production source.

Release and recovery procedures are in
[RELEASE_AND_ROLLBACK.md](RELEASE_AND_ROLLBACK.md); symptom triage is in
[TROUBLESHOOTING.md](TROUBLESHOOTING.md).
