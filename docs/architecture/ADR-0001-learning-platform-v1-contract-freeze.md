# ADR-0001: Freeze the BetterGrades learning-platform V1 contracts

- Status: proposed for architecture review
- Contract version: 1.0.0
- Baseline source: eb665cef15c58592a7e99c979af6d04fbc823eea
- Work order: WO-2026-07-16-BETTERGRADES-PLATFORM-BASELINE-CONTRACTS-002

## Context

The accepted Limits site is working production software. Generic platform work
must preserve its public routes, sequence, checks, graphs, answer keys,
discoverability metadata, bundles, browser behavior, and print output. Earlier
planning selected a generic hierarchy, a semantic content model, strict
server/client boundaries, deterministic assessments, and a renderer adapter
boundary. Those choices need executable contracts before migration begins.

## Decision

Adopt strict, versioned TypeScript/Zod contracts for Course → Unit → Section →
Page, course sequence, semantic nodes, assessment inputs and results,
VisualSpec, provenance, release visibility, renderer capabilities, collision
policy, and performance budgets.

Three compilation products are distinct:

1. A compact global course index may expose titles, summaries, routes,
   visibility, sequence roles, and assessment response kinds.
2. Semantic page bodies are server-only.
3. Canonical assessment answers, variants, hints, rubrics, and worked feedback
   are server-only and must be scanned out of client/global artifacts.

Static SVG is the default visual product. The lightweight BetterGrades 2D
runtime is capped at 30 KiB gzip. JSXGraph and uPlot are isolated lazy adapters;
3D capability is reserved but unavailable in V1. Every visual requires a
caption, long description, reduced-motion behavior, and a static print
fallback. A missing capability or unknown construct rejects ingestion.
MathJSON is an allowlisted, complexity-bounded AST rather than an open object.
Visual expressions and numeric datasets are declared inside VisualSpec and all
layer references must resolve before ingestion.

Route and search collisions reject by default. Auto-suffixed slugs are
forbidden. Existing derivative-guide intents remain blocked until an explicit
editorial decision selects reuse, planned replacement, or genuine
differentiation.

corepack pnpm verify:textbook is the future single verification entry point.
Its manifest requires contract, ingestion, route, discoverability, rendering,
LaTeX, assessment, answer-leak, visual, graph, performance, hydration, browser,
accessibility, provenance, visibility, and print gates.
Budget accounting uses unique transitive initial JavaScript chunks under a cold
cache, first-request visualization runtime, and UTF-8 bytes in the initial RSC
flight payload. The contract exposes an evaluator for route and heavy-adapter
measurements.

## Consequences

- Current rendering and deployment remain unchanged.
- Subsequent work starts from an executable boundary rather than inferred data
  shapes.
- The new dedicated contract suite is intentionally RED at five named
  implementation gates. Existing public tests remain green.
- Ordinary clients do not need a full symbolic engine. LaTeX normalization and
  MathJSON production happen at build or server time.
- New content cannot be ingested until a renderer and assessment capability
  explicitly supports every construct it uses.

## Rejected alternatives

- Replacing the current registry or shell during the contract freeze: too much
  regression surface.
- A permissive passthrough node or raw-HTML/raw-LaTeX fallback: it hides
  ingestion defects and violates fail-closed migration gates.
- One combined public payload: it risks answer leakage and unnecessary client
  weight.
- Automatic duplicate-slug suffixes: they create accidental search
  cannibalization instead of an editorial decision.
