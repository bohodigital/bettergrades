# Algebra installation QA and acceptance contract

## Content inventory

- Exactly 15 units and 139 canonical lesson pages.
- Exactly 417 storyboard figure briefs, with no orphaned or duplicated stable IDs.
- Exactly 226 course routes in the installation inventory.
- Every lesson has outcomes, prerequisite routing, narrative exposition, figures, examples, exercises, misconceptions, checkpoint, exit check, and bridge.
- Every unit has a hub, review, practice set, mastery check, and mastery answer key.
- Exactly eight major investigation routes.
- One course diagnostic, one final exam, and one final answer key.

## Mathematical QA

- Every worked example is independently recalculated.
- Every generated problem family is property-tested across representative values and edge cases.
- Restrictions are preserved for rational, radical, and logarithmic expressions.
- Candidate solutions are checked in original equations when a nonreversible operation is used.
- Inequality endpoint and sign behavior is tested.
- Graphs agree with formulas, domains, intercepts, asymptotes, and stated units.
- Exact answers are preserved before approximation.

## Existing-site preservation

- Current canonical inventory remains intact unless a path is explicitly claimed in `route_registry.csv`.
- Existing compact Algebra guide children remain accessible and canonical.
- Existing Calculus rendered output, public checks, reveals, visuals, search, sitemap, and structured data are unchanged.
- The course root and two claimed topic roots retain their canonical URLs.

## Accessibility and visual QA

- Static fallback contains the complete instructional meaning.
- Captions, alt text, long descriptions, reading order, and non-color distinctions agree with the figure.
- Keyboard, focus order, announcements, reset, reduced motion, no-JS, and touch targets pass.
- Print output is grayscale-safe and does not clip labels or omit mathematical relationships.
- Every page is inspected at 320px mobile, standard mobile, tablet, and desktop widths.
- No horizontal overflow, label collisions, hidden controls, or content jumps.

## Performance and security

- Static routes load zero visualization runtime.
- Interactive routes load only the requested scene and least-cost renderer.
- No unit-wide or sitewide visual registry is serialized to the browser.
- Typical SVG remains below 50 KB; deviations are documented and reviewed.
- Compute Engine, source LaTeX, canonical answers, solution bodies, author notes, file paths, and secrets never enter public assets.
- All user input is bounded and parsed through allowlisted deterministic code.

## SEO, discovery, and route QA

- Every route has unique title, H1, description, canonical, index/follow, sitemap record, analytics, and structured data.
- Search returns the exact lesson for exact queries and distinguishes lessons from compact guides and practice.
- No two routes compete for the same primary intent without a documented role distinction.
- Previous/next course links and support-page return links are complete.
- Learning graph contains no orphaned core lesson, dead end, invalid ID, or accidental multiple `full_version_of` destination.

## Validation command families

The implementation may adjust exact script names as the course-unit importer is generalized, but the final branch must run at minimum:

```text
corepack pnpm install --frozen-lockfile
corepack pnpm run units:check
corepack pnpm run visuals:check
corepack pnpm run graph:check
corepack pnpm run resources:check
corepack pnpm run build:pages
corepack pnpm test
corepack pnpm run test:browser
corepack pnpm run test:rendered-dom
corepack pnpm run test:seo
corepack pnpm run test:pdf
```

Add dedicated Algebra inventory, route, mathematical, assessment, visual, search, no-leak, print, and preservation tests. Do not weaken an existing test merely because the new inventory makes an old hard-coded count inconvenient; update the invariant to the exact accepted combined inventory.

## Stop conditions

Stop and report rather than merging or deploying if:

- any current route changes unexpectedly;
- a canonical collision lacks an explicit route decision;
- a lesson is materially abbreviated from the storyboard;
- figures become generic placeholders;
- public payloads expose answers or sources;
- performance budgets are exceeded;
- the Pi cannot complete the serial validation suite within the approved resource budget;
- private-preview visuals differ materially from the owner-approved composition;
- owner approval has not been recorded for the exact preview commit.
