---
type: note
status: processed
created: 2026-04-01
---

# Dynamic favicon browser compatibility

The dynamic favicon (generated from the current palette) works in Firefox-based browsers (confirmed in Zen) but does not work in Chrome or Safari.

## Observed behavior

- **Firefox/Zen**: Favicon updates dynamically when hue is changed. Works as expected.
- **Chrome**: Static blue favicon persists. Changing hue has no effect on the favicon.
- **Safari**: Same as Chrome — static favicon only, no dynamic updates.

## Unknown

No theories yet on root cause. May be related to how Chrome/Safari handle dynamic `<link rel="icon">` updates, caching behavior, or data URI limitations.
