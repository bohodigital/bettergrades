# BetterGrades navigation overhaul

## Outcome

This candidate replaces the flat calculus directory with a chapter-first course navigator while preserving every canonical lesson, practice, answer-key, and article route. It also adds a sitewide Learn menu so learners can reach a course, calculus chapter, practice area, tool, or search without first returning to the home page.

The calculus labeling contract is:

- Chapter 1: Limits and Continuity, labeled Unit 1.
- Chapter 2: Derivatives, composed of Unit 2A (foundations and techniques) and Unit 2B (applications and modeling).
- Chapter 3: Integrals, composed of Unit 3A (foundations and techniques) and Unit 3B (applications and modeling).
- Chapter 4: Sequences and Series.

The A/B labels identify parts of one chapter. They are not presented as separate chapters.

## Implementation

`CalculusCourseNavigation` renders an accessible native-details chapter accordion on the calculus hub. Each chapter opens into its unit map and section links. Unit 2A and 2B appear together inside Chapter 2; Unit 3A and 3B appear together inside Chapter 3.

`CalculusUnitNavigation` keeps the existing direct A/B switcher, adds a return to the full calculus map, and adds an expandable section directory spanning both halves of the current chapter. Focused derivative and integral articles inherit the matching chapter navigation, including the 2B and 3B article collections.

The global header now has:

- a desktop Learn mega-menu with courses, calculus chapters, search, and calculus practice;
- a nested mobile Learn accordion with the same information architecture;
- persistent direct links to Practice, Tools, Glossary, and Search;
- active-state styling without changing canonical routes.

Native `details` and `summary` elements provide keyboard operation and usable server-rendered fallbacks without adding a JavaScript menu dependency.

## Validation contract

The release candidate must pass:

- answer-corpus and exam-key integrity checks;
- visual authoring, compilation, leak, and artifact checks;
- production build, TypeScript, lint, and the full Node test suite;
- Pages packaging on the Pi runtime;
- route checks for the calculus hub and all Unit 2A, 2B, 3A, and 3B roots;
- desktop and mobile browser checks for menu expansion, chapter expansion, direct A/B movement, overflow, focus behavior, and console errors;
- indexability, canonical metadata, analytics, brand identity, and existing answer-reveal checks.

## Release gate

This is a review candidate. The exact commit is first deployed to the owner-only Sites project. Cloudflare production remains unchanged until the owner approves that exact preview. After approval, the same commit is merged through the canonical Pi repository and published with the governed Cloudflare release runbook.

## Rollback

Before production, rollback is deletion or abandonment of the private Sites preview and review branch; production is unaffected. After production, restore the prior recorded Cloudflare deployment and revert the navigation commit on canonical `main`, then rerun route and browser verification.
