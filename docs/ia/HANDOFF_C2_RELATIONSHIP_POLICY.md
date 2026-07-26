# Handoff C2 relationship policy

## Purpose

A public learning relationship exists only to help a learner perform a specific next action. Shared words, a shared course, or a broad topic resemblance are not sufficient.

The accepted Handoff 1 production baseline is merge commit `bf5751658b0b86fae1a777f9147788161ac18085`, tree `a562b9fd9cc40fef34f8cac49c695dd4993d1c7a`, deployed immutably at `https://d40825cc.bettergrades-vhc.pages.dev`.

## Article decisions

Every instructional article receives exactly one decision:

- `EXACT_TEXTBOOK_MATCH`: one exact, indexable textbook lesson shares the primary concept and at least one instructional skill; the lesson is the fuller destination and the article keeps a distinct short-form purpose.
- `MULTI_LESSON_SEQUENCE`: the article genuinely spans a narrow ordered sequence and one lesson is insufficient.
- `NO_EXACT_TEXTBOOK_MATCH`: no candidate satisfies the exact concept, skill, role, and destination tests.
- `ARTICLE_IS_PRIMARY_DESTINATION`: the audited “article” row is itself a primary lesson or hub and must not point to another lesson as a supposed fuller version.
- `INTENT_CONFLICT_DEFERRED`: multiple equal candidates, role conflict, or unresolved query intent makes publication unsafe.
- `CONSOLIDATION_DEFERRED`: near-duplicate scope requires an editorial consolidation decision.

An automatic approval requires all of the following:

1. exact same `primaryConceptId`;
2. at least one identical `skillId`;
3. complementary article and textbook-lesson roles;
4. a published, canonical, indexable target;
5. an exact lesson target, never a course or unit hub;
6. content similarity below the `0.72` duplicate-review threshold;
7. no conflict flag;
8. one uniquely highest eligible candidate;
9. a distinct source and target title and canonical path.

Scores rank review candidates but never establish approval by themselves. Any failed condition keeps the relationship out of public HTML and records the reason in the deferred map.

## Public placement

An approved article-to-lesson match may render one compact primary action after the article’s immediate answer or introductory paragraph:

> Learn this in the full course
> Exact lesson title
> A short statement of what the lesson adds.

The article footer may contain at most three different secondary actions. It must not repeat the primary lesson.

A textbook lesson may show one exact practice action near its objective. Its ending keeps the ordered next lesson primary and may add at most three distinct companions: practice, quick explanation, and one worked example, reference, visual, or tool. A lesson does not need a companion in every category.

## Editorial and rendering rules

- Only `existing` and `approved` relationships may render.
- `provisional`, `rejected`, and `not-required` relationships never render.
- At most one primary and three secondary links appear at one placement.
- Anchors name the destination or learner action; “Learn more” is forbidden.
- Reciprocal links are not automatic.
- Deferred rows remain durable input to Handoff 3.
- Generation is deterministic and a check run must reproduce byte-identical outputs.
