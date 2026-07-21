# Unit 4A QA record

## Completed before Pi synchronization

- Archive checksum, ZIP safety, internal checksums, and handoff validator: pass
- Representative source PDF render inspection, including dense visual and exam pages: pass
- Import/check: 34 routes, 23 core routes, 22 checks, 3 assessment sets, 18 visuals
- Visual author/check: 11 static and 7 interactive definitions
- Visual compile/check: 18 scenes with SVG fallbacks
- TypeScript: pass
- Focused lint: pass
- Vinext production build: pass
- Dedicated data/security tests: pass
- All 34 Unit 4A server-rendered routes: HTTP 200, clean math markup, canonical metadata, no missing visual/equation alerts
- Legacy collision redirects and retained deep dives: pass in Worker tests

## Environment qualification

The Windows sandbox can build `dist/client` and `dist/server`, but its local `vinext start` path does not supply Cloudflare's `ASSETS` binding, so client-module hydration is not accepted as validated there. The Windows Pages prebundle also cannot traverse the sandbox boundary. Both checks must pass in the canonical Pi worktree or hosted private candidate before release.

## Remaining release gates

- Pi full suite and Pages package
- Pi or hosted browser hydration, interactive controls, keyboard, mobile/tablet/desktop, and console checks
- Print-to-PDF validation
- Owner-only Sites candidate from the exact validated source
- Pull request review, merge, Cloudflare production release, and live canary
