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

Source, compiled-scene, and server-render accessibility contracts pass. Desktop browser QA confirmed bounded Lens blocks, no horizontal overflow, labeled form controls, live attempt feedback, complete static visual descriptions, and working light/dark themes. A separate in-app browser tab provided a real 390 by 844 viewport: the Unit 2A derivative lesson reported a 375-pixel body, 375-pixel document width, a 301-pixel Lens block with 299-pixel scroll width, and a centered 315 by 183 visual with no positive horizontal overflow. Keyboard focus semantics are covered by native elements and source tests; the in-app browser's synthetic Tab command did not advance focus reliably and is not treated as positive evidence.
