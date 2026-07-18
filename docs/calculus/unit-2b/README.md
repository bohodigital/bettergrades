# Calculus Unit 2B release dossier

This directory records the implementation, validation, print, release, and rollback evidence for **Calculus I Unit 2B: Applications of Derivatives**. Unit 2B is an additive release from the accepted Unit 2A production baseline `1c5415113141e570f336c06210a8ff94cfee6d7f`.

The release does not replace the existing site shell, Limits unit, Unit 2A, search, assessment boundary, BVLP core, Cloudflare project, deployment wrapper, or analytics and SEO controls. It adds no database migration, Cloudflare binding, CDN, runtime LLM, external service, or dependency.

Evidence files:

- `IMPLEMENTATION.md` — architecture, content, visuals, assessment, and security decisions.
- `QA_RECORD.md` — deterministic and browser-visible gates.
- `PRINT_REPORT.md` — source print artifact inspection and Pi compilation gate.
- `ROLLBACK.md` — source and deployment rollback without history rewriting or DNS changes.
- `release-evidence.json` — machine-readable candidate and release identity. Fields remain `null` until the corresponding event is verified.

The authoritative public route is `/subjects/math/calculus/derivative-applications/`. It must lead with the complete nine-section unit map. Explorations and application articles follow the map as textbook enrichments rather than displacing the core sequence.
