# Findability validation

`graph:generate` deterministically rebuilds nodes and relationships. `graph:check` fails on generated drift, duplicate IDs or paths, missing relationship endpoints, invalid types, or provisional relationships assigned a public placement.

`test:findability` verifies complete route mapping/exclusion, provisional separation, critical parent anchors, and the four-link display limit. `test:search` verifies exact-title precedence and audited aliases.

The IA audit rebuilds rendered routes and typed anchors, then computes breadth-first depth from `/`. Meaningful navigation includes global/mobile navigation, hubs, course maps, unit maps, and sequential links; it excludes footer-only, redirect, search-only, and JavaScript-only paths. Important roles must be at depth four or less.
