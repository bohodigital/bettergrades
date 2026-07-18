# Normalized v3 intake report

## Sources

- Owner archive: `bettergrades_calculus_units_2a_2b_normalized_complete_handoff_v3.zip`
- Archive SHA-256: `e641e8ea951006e81548eaca12749675a0d6aa38f5a5ff689c641c295e9443e7`
- Owner program SHA-256: `3ffef61ddc2b6f3cd67127555ac2e3470cd3d41637436f80e5ea6be7646fc469`
- Durable Pi extraction: `/srv/local1/runtime/bettergrades/handoff/units-2a-2b-v3/extracted/bettergrades_calculus_units_2a_2b_normalized_handoff_v3`
- Preserved owner instructions: `/srv/local1/hub/ops/intake/work-orders/context-packets/WO-2026-07-17-BETTERGRADES-CALCULUS-UNITS-2A-2B-V3-001-OWNER-INSTRUCTIONS-VERBATIM.txt`

The archive checksum, internal checksums, normalized line-ending expectations, and schema validators passed before import. Source archives, PDFs, and LaTeX projects remain in the durable intake area; they are not shipped as browser assets.

## Declared inventories

| Unit | Route intents | Core sequence | Checks | Assessment sets | Visual briefs |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2A | 67 | 49 | 34 | 7 | 27 |
| 2B | 76 | 57 | 22 | 8 | 34 |

Unit 2A is the active release. Unit 2B remains intake-only until the Unit 2A production postmortem and revised plan are complete.

## Normalization decisions

- All generated comparisons normalize CRLF and CR to LF before hashing, so Windows and Pi checks produce the same answer.
- Learner-visible `Chapter` terminology is normalized to `Section` or `Unit` without changing the preserved print source structure.
- TeX quotation marks and truncated SEO punctuation are normalized before route metadata is emitted.
- Escaped percent signs are retained as learner math; only unescaped TeX comments are removed.
- Unsupported semantic environments fail with unit, route, and source-file context. They are never silently dropped.

## Stop-condition review

No archive-integrity, route-collision, unsupported-environment, answer-leak, renderer-capability, or rights ambiguity stop condition was triggered for Unit 2A. The provenance declaration remains an owner/editor review statement and is not upgraded into a stronger legal conclusion.
