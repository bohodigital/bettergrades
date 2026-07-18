# Unit 2A accessibility report

## Structural controls

- One semantic H1 per route.
- Breadcrumb, primary, course-sequence, and answer-key navigation landmarks.
- Real buttons, links, labels, inputs, radios, textareas, progress elements, details, summaries, tables, captions, headings, and live regions.
- Every non-hub page has a visible Section overview and Reading lens.
- Choice labels are clickable and keyboard-operable.
- Attempt and checker feedback uses `aria-live`.
- Tables sit in bounded horizontal wrappers on narrow screens.

## Visual controls

- Every BVLP scene has alt text, a long description, explicit reading order, a static fallback, and color-independent cues.
- SVGs contain no scripts, event handlers, `foreignObject`, or raw source commands.
- Visuals and Lens blocks use responsive grids that collapse to one column on narrow viewports.
- Print representations are grayscale-safe and keep the complete instructional meaning.

## Motion and JavaScript

- Static SVG meaning is present before optional enhancement.
- Reduced-motion preference is read without starting animation.
- Interactive controls are bounded and keyboard-addressable.
- JavaScript-disabled pages retain prose, equations, captions, long descriptions, and static visuals; grading and reveals correctly remain unavailable without client execution.

## Test status

Source, compiled-scene, and server-render accessibility contracts pass. Desktop browser QA confirmed bounded Lens blocks, no horizontal overflow, labeled form controls, live attempt feedback, complete static visual descriptions, and working light/dark themes. The Browser viewport override did not change the in-app browser's reported 1280-pixel viewport, so narrow-screen behavior remains supported by the explicit responsive/print source tests and must be rechecked against the owner-only Sites candidate or live host with an independently responsive browser before release closeout. Keyboard focus semantics are covered by native elements and source tests; the in-app browser's synthetic Tab command did not advance focus reliably and is not treated as positive evidence.
