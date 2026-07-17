# Accessibility contract

Accessibility is validated scene data, not adapter decoration. Every public
visual requires a visible caption, learning purpose, semantic title, complete
long description, color-independent distinctions, static fallback, explicit
print fallback, and useful failure fallback.

## Author requirements

- Explain the mathematical relationship and conclusion, not only colors/shapes.
- Supply units, domains, open/closed status, asymptotes, panel order, and
  relationships among panels.
- Pair color with label, marker fill, shape, dash, texture, or position.
- Give every control an accessible name, bounds/state, step, units, current
  value, keyboard behavior, and deterministic reset.

## Renderer requirements

Static SVG exposes associated title/description and stable reading order.
Interactive points are focusable, bounded, arrow-key movable (or document an
equivalent), announce coordinates, and reset. Sliders implement ordinary
keyboard semantics. Focus indicators remain visible. Current values and state
changes are announced without flooding live regions. Touch and keyboard achieve
equivalent instructional outcomes. Canvas never replaces the semantic DOM.

Reduced motion disables or simplifies animation while preserving state and
meaning. Enhancement failure leaves the static figure, caption, and description.
Multi-panel figures label and order panels; data series name series/units,
summarize trends/key values, and add a table/equivalent when useful.

## Test procedure

1. Inspect semantic title/description/caption associations with JavaScript off.
2. Tab through every control; verify order, focus, operation, bounds, and reset.
3. Operate points/sliders with keyboard and confirm concise announcements.
4. Enable reduced motion and confirm no required meaning depends on animation.
5. Force adapter failure and confirm the static/failure fallback remains useful.
6. Review desktop/mobile zoom and reflow; confirm no clipped labels/controls.
7. Review grayscale/non-color distinctions and print output.
8. Perform a screen-reader pass covering figure entry, description, controls,
   state changes, panels, and exit; record browser/AT/version and findings.

Known limitations and exact audit results are recorded in
[QA_REPORT.md](QA_REPORT.md). Desktop/mobile fallback, long-description,
keyboard, focus-target, and overflow checks are complete; true JavaScript-off,
reduced-motion browser emulation, and a dedicated screen-reader pass are not
claimed. Any missing description, inaccessible required control, or Canvas-only
meaning blocks release.
