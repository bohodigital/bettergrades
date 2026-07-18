# Unit 2A QA record

## Exact candidate

- Branch: `agent/bettergrades-unit-2a-v3`
- Initial implementation commit: `c5274b51c41065ce4b8a74f40d3331b288f1f815`
- Implementation and QA commit: `9886a22e0f548df9fbb88fb894c8b35777cff1c8`
- Implementation and QA tree: `d55057fef79961eda58fc1f5ca314394d202f0a9`
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
- Updated suite inventory: 175 tests. The only first-run failure was a test that inspected nonvisible RSC transport text; the assertion was narrowed to learner-visible text, and the complete 27-test rendered-page suite then passed.
- All 67 Unit 2A HTML pages: pass raw-TeX, math-error, missing-visual, unique-check, Lens, title, and status gates.
- Cumulative practice: 36 semantic exercises, 36 server-only answers, 36 attempt-gated reveals, and no answer payload in public indexes or unrelated client chunks.

## Pi validation

The initial implementation bundle SHA-256 was `be62e4d83164547a2cedb1e1065a14b7fed661371407be44b8bd848e6fe57f44`. It fast-forwarded only the isolated Pi worktree. Frozen install, supply-chain postinstalls, answer checks, visual checks, lint, typecheck, and build passed there. The initial unconstrained full test run caused severe but temporary ARM memory pressure during the exhaustive 67-page render sweep; the process exited without mutating the canonical checkout, and the Pi recovered to 7.2 GiB available memory with no test process left. A serial rerun passed the full Unit 2A sweep but the combined general render-test process later reached Node's 2 GiB heap ceiling. The release candidate therefore uses both `--test-concurrency=1` and a separate Unit 2A rendered-route test process; the exact Pi rerun remains mandatory.

## Browser and release gates

Local production-build browser QA passed the textbook-first map, 49-page sequence, eight section-specific Lens blocks, derivative detail exposition, one accessible BVLP graph, absence of redundant graph placeholders, quick-check wrong/correct/reveal states, all 36 cumulative-practice attempt gates, and Exam A's 14-item linked answer key. Light and dark themes rendered with the expected contrast tokens. The local static proxy was diagnostic only and is not accepted as Pages release evidence. Owner-only Sites evidence, exact merged tree, production deployment, and live-host verification remain pending.
