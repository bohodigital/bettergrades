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
