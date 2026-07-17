# BetterGrades learning-platform contract V1

This directory freezes contract version 1.0.0; it does not replace the current
registry, rendering shell, assessment checks, or public routes.

The public-safe GlobalCourseIndexSchema contains discovery and sequencing data
only. ServerPageBodySchema owns semantic page bodies. ServerAssessmentBankSchema
owns canonical answers, accepted variants, hints, and worked feedback. Compilers
must reject unknown object keys, semantic node types, VisualSpec scene/layer types,
unavailable renderer capabilities, route collisions, and unsupported assessment
forms. Silent omission and raw-source fallback are contract violations.

Run corepack pnpm test:platform-contracts to validate the contract and observe
the five intentional RED implementation gates. Run corepack pnpm
verify:textbook -- --plan to list the eventual sitewide gates. The default
corepack pnpm verify:textbook remains failing until subsequent work orders
implement every required gate.
