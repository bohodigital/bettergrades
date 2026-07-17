# No-JavaScript, reduced-motion, and keyboard behavior

## No JavaScript

The route-integration contract requires server HTML to contain the complete
static SVG, semantic title, visible caption, long description, and print
relationship before any client code. No spinner or activation gate may conceal
core instruction. With JavaScript disabled, every public visual must remain
understandable; only optional exploration may be unavailable. Rendered-HTML and
Pages-package tests now verify this fallback contract across current Limits
routes. The in-app browser could not truly disable JavaScript, so direct
no-JavaScript browser emulation is not claimed.

## Reduced motion

Read `prefers-reduced-motion` before automatic animation. Disable autoplay and
continuous transitions or replace them with instant/step controls. Do not remove
states, traces, values, or explanations. A learner may manually step through the
same instructional states. Changes to the preference during a session should be
handled without leaking animation frames/listeners.

## Keyboard

Use native controls when possible. Tab order follows the visual/control reading
order. Focus is visible and never trapped. The accepted range and step helpers
support arrow/page/home/end behavior within declared bounds; the accepted plot
has named zoom/reset controls and keyboard zoom/reset shortcuts. A future
draggable-point or play/pause implementation must add documented keyboard
operation, bounds, announcements, and reset before claiming those capabilities.

## Failure behavior and QA

If a chunk, observer, Worker, adapter, or Canvas path fails, leave static content
unchanged and expose a concise non-disruptive failure message for optional
interaction. Test all three modes on representative desktop/mobile Limits
routes, record browser/viewport/expected/actual/console/network/overflow/
interaction/accessibility results, and capture screenshots. Focused phase 4
tests cover bounded keyboard helpers, reduced-motion detection, observer cleanup,
and visible failure/fallback ownership. The exact candidate was inspected at
desktop and mobile widths: all four interactive scenes enhanced over retained
fallbacks, epsilon-delta keyboard input updated accessible state, 44-pixel
mobile targets were present, and no horizontal overflow occurred. The browser
API did not support reduced-motion emulation, so `matchMedia` runtime tests and
the CSS media query are the recorded evidence. A dedicated screen-reader pass
remains unperformed. See [QA_REPORT.md](QA_REPORT.md) for exact results and
limitations.
