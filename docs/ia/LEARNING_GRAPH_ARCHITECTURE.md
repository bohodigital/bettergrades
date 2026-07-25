# BetterGrades learning graph architecture

The graph is a build-time relationship and findability layer. Existing course, article, assessment, glossary, and publishing registries remain authoritative for educational content.

Nodes use registry identities where available, not URLs: calculus route IDs, publishing resource IDs, assessment IDs, tool IDs, and explicit subject/course IDs. `canonicalPath` is mutable routing metadata. `formerPaths` preserve redirected discovery terms.

Every indexable audit route is either represented by one node or listed in `exclusions.json`. Policy, search, home, and directory shells are excluded instead of being assigned fake educational concepts.

Relationships carry source, confidence, editorial status, placement, anchor text, and reciprocity policy. Only `approved` and `existing` relationships are queryable by the public renderer. Provisional audit candidates are retained at `editorial-queue` placement.
