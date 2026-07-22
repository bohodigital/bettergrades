# Unit 4B release candidate

Status: prepared for owner-only preview and exact-tree approval. Not deployed to production.

## Source lineage

- Base production commit: `9af98dc2106fed1e36d2250f9ff7855f39e3d414`
- Base production tree: `b3460d96a7e16f40dd9d580e8fa22180fad0ff66`
- Candidate branch: `agent/bettergrades-unit-4b-v3`
- Canonical worktree: `/srv/local1/worktrees/bettergrades-unit-4b-v3`
- Intake: `/srv/local1/runtime/bettergrades/intake/units-4a-4b-v3/`

The exact candidate commit and tree are intentionally recorded in the external approval packet and MCP after the commit exists; an in-tree document cannot truthfully name its own final commit.

## Scope

The candidate publishes the 31-route Unit 4B textbook at `/subjects/math/calculus/power-series-and-taylor-series/`, connects it to Unit 4A, registers search/SEO/navigation/practice delivery, adds attempt-gated server assessment handling, and compiles 20 accessible visuals through the existing BVLP system. It adds no service, database, dependency, binding, renderer, or provider.

## Release sequence

1. Commit the clean candidate on the Pi branch.
2. Build and verify the exact committed tree.
3. Publish an owner-only Sites preview from that exact tree.
4. Complete desktop, mobile, dark-mode, keyboard, interactive, no-JavaScript, print, console, accessibility, redirect, and leak review.
5. Stop for exact preview/commit/tree approval.
6. After approval, push the branch and open the separate Unit 4B pull request.
7. Merge and promote to Cloudflare production only after the later production approval gate.

## Rollback

Before merge, delete the private preview and close the unmerged pull request. After merge, revert the Unit 4B merge without rewriting history. After production promotion, restore immutable Unit 4A deployment `23816f0f.bettergrades-vhc.pages.dev`, verify all origins and Units 1 through 4A, then revert the Unit 4B merge so Git and production converge.
