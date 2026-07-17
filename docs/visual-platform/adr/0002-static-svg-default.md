# ADR 0002: Static SVG first, progressive enhancement second

- Status: accepted by owner contract

## Context

Most instructional figures do not need live manipulation. JavaScript-first
visuals weaken no-JS, accessibility, print, performance, snapshot, and failure
behavior.

## Decision

Every public visual has a complete deterministic static fallback, normally
build-generated SVG. It is server-visible immediately with caption and long
description. Optional interaction enhances near viewport or explicit activation
without meaningful layout shift; failure leaves SVG intact. Static SVG is the
resolver default and decorative interaction is rejected.

## Consequences

Static routes require zero visual JavaScript and preserve print/search/no-JS.
Interactive authors must design both semantic static meaning and optional
controls. Some scenes need deliberate static summaries, but may not hide core
instruction behind a spinner or Canvas.

## Rejected alternatives

Client-only Canvas, always-on heavyweight graph libraries, screenshots without
semantics, and interaction by default.
