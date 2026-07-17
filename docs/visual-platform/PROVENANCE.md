# Provenance and evidence

## Authority

The controlling byte-for-byte owner contract is preserved on the Pi at
`/srv/local1/hub/ops/intake/work-orders/context-packets/WO-2026-07-16-BETTERGRADES-BVLP-OWNER-INSTRUCTIONS-VERBATIM.txt`
with SHA-256
`7d12ebf341362801514cf0c221ca304bcdad7655e23150e9c9396f83fa1081e1`.
Pi runtime, MCP coordination, and Git history respectively govern operational
state, intended work, and source lineage.

The reviewed baseline worker, integration merge, reconciliation, included and
excluded artifacts, validation, and rollback lineage are recorded in
[integration-gate.md](integration-gate.md) and
[phase-ledger.md](phase-ledger.md). Those files must be preserved.

## Evidence rules

Every claimed count, route, visual ID, bundle/payload/asset size, test result,
browser result, PDF checksum, source commit, preview/version/deployment, live
route, or renderer disposition must link to a reproducible command or durable
artifact from the exact commit. Mark unknown or not-yet-run values `pending`;
never turn a plan into a passing result.

Migration rows should connect old source/component/route to VisualSpec, generated
asset, renderer choice, screenshots, accessibility/print evidence, reviewer, and
commit. Generated assets should embed or map to compiler/schema version and
content hash without exposing private paths or author notes.

Public payloads and learner output must not expose this operational provenance,
source textbook PDFs, answer material, filesystem paths, credentials, or debug
notes. The final release report remains durable on the Pi/MCP and cites exact Git
and deployment identities.
