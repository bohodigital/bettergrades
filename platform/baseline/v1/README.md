# BetterGrades golden baseline V1

golden-baseline.json was measured from production and the clean, reconciled
main/origin-main source commit recorded in its source block. It contains every
public route and redirect; all Limits routes, sequence entries, checks, semantic
nodes, graph IDs, and answer-key destinations; live discoverability metadata;
client JavaScript and CSS bundle sizes; the pinned print result; and eight
representative browser captures.

Rebuild the current source first, compile the print source with the accepted
Tectonic 0.16.9 binary and cache, then run:

    node tools/capture-platform-baseline.mjs \
      --commit COMMIT \
      --canonical-repo ABSOLUTE_CLEAN_MAIN_REPOSITORY \
      --tectonic-bin ABSOLUTE_TECTONIC_0_16_9_BINARY \
      --print-pdf ABSOLUTE_PDF_PATH \
      --print-log ABSOLUTE_TECTONIC_LOG_PATH

The capture first proves that the canonical repository is clean main/origin-main
at COMMIT, rejects any task-worktree change to public source inputs, rebuilds
Pages, and reruns the full TAP suite. It then aborts on unexpected route counts,
missing sitemap/canonical/robots
or analytics metadata, redirect mismatches, missing graph/check associations,
answer leakage, print evidence gaps, or screenshot failure. It never deploys or
changes production.

This is a historical baseline-capture tool, not the BVLP release verifier. Its
expected route, sitemap, check, and visual counts are deliberately frozen to the
accepted `eb665cef15c58592a7e99c979af6d04fbc823eea` snapshot. BVLP uses a
separate `verify:visuals` command whose expectations are derived from the
versioned visual registry and migration manifest rather than these constants.

Known baseline limitations retained for auditability are recorded in
`docs/visual-platform/integration-gate.md`. In particular, the snapshot does not
itself attest an immutable production deployment, browser console/network
health, route-level visual payloads, or a complete answer-value leak scan.
