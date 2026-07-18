# Unit 2A QA record

## Exact candidate

- Branch: `agent/bettergrades-unit-2a-v3`
- Initial implementation commit: `c5274b51c41065ce4b8a74f40d3331b288f1f815`
- Implementation and QA commit: `9886a22e0f548df9fbb88fb894c8b35777cff1c8`
- Implementation and QA tree: `d55057fef79961eda58fc1f5ca314394d202f0a9`
- Pi-validated release candidate commit: `f3263e2e339c39733e72470107375acb93c49b7b`
- Pi-validated release candidate tree: `ed4365f904436cf2fe2105cee09ab430f723b09c`
- Visual-fidelity correction commit: `08205022b4ca0f67a620c4d116b2a53dd862b39a`
- Visual-fidelity correction tree: `e91d167dfeb8a2b3d883be32a5d361a3225ff894`
- Baseline: `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`

## Windows validation

- Frozen install: pass.
- Answer checks: 10 Limits reveal sets / 348 answers; 2 Limits exam keys / 32 answers.
- Visual checks: 13 Limits scenes; 27 Unit 2A scenes.
- Unit import: 67 routes, 49 core routes, 34 checks, 7 assessment sets, 27 visuals.
- Unit public-route SHA-256: `0e5d94136eb5dd161b7bec8002cebc58ce246823d64c7e4ec2633f7c3113592e`.
- ESLint: pass.
- TypeScript: pass.
- Vinext/Pages build: pass.
- Full suite before the new practice-reveal regression test: 174/174 pass.
- Updated suite: 175/175 pass in 151.3 seconds. The only first-run failure was a test that inspected nonvisible RSC transport text; the assertion was narrowed to learner-visible text, and the complete suite then passed.
- Post-Sites visual-fidelity suite: 175/175 pass in 164.9 seconds after replacing the generic Unit 2A diagram scaffolds and correcting all plotted derivative relationships.
- All 67 Unit 2A HTML pages: pass raw-TeX, math-error, missing-visual, unique-check, Lens, title, and status gates.
- Cumulative practice: 36 semantic exercises, 36 server-only answers, 36 attempt-gated reveals, and no answer payload in public indexes or unrelated client chunks.

## Pi validation

The initial implementation bundle SHA-256 was `be62e4d83164547a2cedb1e1065a14b7fed661371407be44b8bd848e6fe57f44`. It fast-forwarded only the isolated Pi worktree. Frozen install, supply-chain postinstalls, answer checks, visual checks, lint, typecheck, and build passed there. The initial unconstrained full test run caused severe but temporary ARM memory pressure during the exhaustive 67-page render sweep; the process exited without mutating the canonical checkout. A serial rerun passed the full Unit 2A sweep but the combined general render-test process later reached Node's 2 GiB heap ceiling. The corrected exact candidate uses both `--test-concurrency=1` and a separate Unit 2A rendered-route process. On the Pi it passed 175/175 tests in 130.2 seconds; afterward 6.9 GiB was available and swap use was zero. The isolated worktree was clean and canonical `main` remained `e85b9b80fdb77aaf5346c555a2c1378024fd33ca`.

## Browser and release gates

Local production-build browser QA passed the textbook-first map, 49-page sequence, eight section-specific Lens blocks, derivative detail exposition, quick-check wrong/correct/reveal states, all 36 cumulative-practice attempt gates, and Exam A's 14-item linked answer key. Light and dark themes rendered with the expected contrast tokens.

The first owner-only Sites candidate, version 22 at commit `ae0efbeed3857460a78d0a4e0ede1ab854b8dfff`, deployed successfully but was deliberately rejected during browser QA: its first derivative figure was a sparse generic three-annotation scaffold rather than the four-stage semantic diagram required by the authoring brief. The release remained private and canonical `main` remained untouched. The correction replaces generic graph data with exact functions, slopes, points, secants, tangents, inverse pairs, implicit curves, and local neighborhoods; replaces process scaffolds with labeled instructional diagrams; centers labels within bounded boxes; and retains the 27-scene, 26-static/1-interactive contract.

The corrected set was inspected in a 27-item browser contact grid. A real 390 by 844 browser viewport then confirmed the derivative lesson, Lens block, and revised four-stage visual have no horizontal overflow; the SVG rendered at 315 by 183 CSS pixels from its 960 by 558 source with complete intrinsic dimensions. The corrected exact owner-only Sites candidate, merged tree, Cloudflare deployment, and live-host verification remain pending.
