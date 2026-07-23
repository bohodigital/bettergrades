# BetterGrades Calculus Traffic Engine Release

- Branch: `feat/bettergrades-calculus-resource-engine-20260723`
- Base: accepted Release A production merge `b88496d53f73c0d23f5a890d07e1acfc38966b72`
- Revision: 2026-07-23

This release adds the resource contract, templates, static PDF pipeline, hubs, ten flagship clusters, worked problems, enriched glossary pages, promoted visuals, segmented sitemaps, internal-link graph, and privacy-respecting resource events.

It does not replace the course, article registry, assessments, glossary, search system, visual platform, analytics loaders, deployment wrapper, or Cloudflare project.

The verified Pages package contains 508 pre-rendered canonical HTML routes and 135 one-hop redirects. Its API-only production Worker measures 4,457,391 bytes raw and 913,115 bytes gzip, retaining the existing 2.75 MB compressed release gate with substantial headroom.

Production requires deterministic generation, lint, TypeScript, full tests, PDF/route/link/sitemap/visual/analytics/leak gates, responsive and print review, exact owner-only Sites preview approval, PR checks, merged-main rebuild, governed deployment, and live verification.

Rollback is the Release A immutable deployment or a governed redeploy of `b88496d53f73c0d23f5a890d07e1acfc38966b72`.
