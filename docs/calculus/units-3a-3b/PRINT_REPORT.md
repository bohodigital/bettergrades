# Print report

## Unit 3A candidate

- Learner-visible headings use `Section`; source LaTeX chapter structure is not rewritten.
- Every BVLP scene has a print-safe static SVG fallback.
- Interactive controls are enhancement-only and do not own the mathematical explanation.
- Tables and visual fallbacks have bounded narrow-screen and print styles.
- Raw TikZ, PGFPlots, and unsupported LaTeX are rejected by import and rendering tests.
- The source handoff's student and editorial PDFs are not copied into the site or deployment package.

The rendered-site suite verifies clean semantic output and print CSS invariants. Hosted print-preview sampling and any browser-specific discrepancy are recorded in the unit QA/release report.
