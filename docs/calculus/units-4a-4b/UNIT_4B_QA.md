# Unit 4B QA record

Status: release candidate prepared; production remains unchanged and approval-gated.

## Source and inventory

- Handoff archive and internal checksums validated from the preserved Pi intake
- Public route manifest SHA-256: `7e64f5016982e992fae843a87f1377c5ee6a6b693a1ea81724e73579daf68f3d`
- Routes: 31 total, 21 core
- Lesson checks: 20
- Assessment sets: 3, including two exams with separate complete answer keys
- Visuals: 20 total; 14 static-first and 6 Interactive 2D
- Renderer additions: none

## Automated gates

- Unit 4A and Unit 4B artifact/inventory tests: pass
- TypeScript with `tsc --noEmit`: pass
- Lint: pass
- Cloudflare Pages production build: pass
- Pages package inventory through Unit 4B: pass
- All Unit 4B routes rendered as clean textbook pages: pass
- Server-only no-JavaScript lesson and visual fallbacks: pass
- Legacy redirect behavior: pass
- Public-answer, source-path, raw-TeX, and executable-drawing leak checks: pass
- Unit 4A generated artifacts: byte-stable

The final full-suite result, private-preview browser review, exact commit/tree, preview version, and print review are recorded in the external approval packet and MCP because those values are produced after this in-tree record.

## Release boundary

An owner-only Sites preview may be created for review. Pushing, opening the separate release pull request, merging, and Cloudflare production promotion require the exact approval gate. No DNS, binding, billing, credential, ownership, or analytics change is part of this release.
