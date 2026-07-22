# Unit 4A release

Status: accepted and live-verified on 2026-07-21. Unit 4B may branch from this production main after the accompanying postmortem and plan revision are committed.

## Exact source lineage

- Candidate commit: `751e24e7230cb870ba1d692251fd75877e99fbdb`
- Candidate tree: `b3460d96a7e16f40dd9d580e8fa22180fad0ff66`
- Pull request: `https://github.com/bohodigital/bettergrades/pull/39`
- Merged production commit: `9af98dc2106fed1e36d2250f9ff7855f39e3d414`
- Merged production tree: `b3460d96a7e16f40dd9d580e8fa22180fad0ff66`
- Repository validation: two exact-head validation runs passed

The reviewed candidate and merged production source have the same Git tree. Canonical Pi `main` was rebuilt and passed 226 of 226 tests before deployment.

## Owner-only candidate

- URL: `https://better-grades.mankopoppi.chatgpt.site`
- Version: 39
- Source commit: `751e24e7230cb870ba1d692251fd75877e99fbdb`
- Access: custom one-owner allowlist with no workspace or tenant groups

The exact owner-only candidate passed desktop/mobile, JavaScript-disabled, interactive, print, accessibility, bundle, leak, and source checks before owner approval.

## Production deployment

- Project: `bettergrades`
- Production branch: `main`
- Deployed commit: `9af98dc2106fed1e36d2250f9ff7855f39e3d414`
- Immutable URL: `https://23816f0f.bettergrades-vhc.pages.dev`
- Pages URL: `https://bettergrades-vhc.pages.dev`
- Apex: `https://bettergrades.net`
- WWW: `https://www.bettergrades.net`

DNS, ownership, bindings, billing, credentials, and the deployment wrapper were unchanged.

## Live verification

All four deployment origins returned 200 for the Unit 4A map, representative lesson, robots, sitemap, and direct CSS asset. The deliberate missing route returned 404. The representative lesson retained its H1, complete server-rendered body, canonical URL, indexability, analytics, static SVGs, and baseline security headers.

Real-browser review at 1280 by 720 and 390 by 844 found no horizontal overflow or console error. Both lazy-loaded static lesson visuals loaded at 960 by 558. The mobile header, main content, lesson heading, course navigation, and loaded stylesheet remained present.

## Rollback

If a production regression is found, preserve the failing deployment evidence, revert merge commit `9af98dc2106fed1e36d2250f9ff7855f39e3d414` without rewriting history, rebuild the prior `main` tree at `3d80a2d134f717942ec71b90dd295e6773183e99`, and redeploy through the same wrapper. Then reverify all four origins, Units 1 through 3B, redirects, sitemap, robots, search, analytics, answer keys, APIs, and visual assets.
