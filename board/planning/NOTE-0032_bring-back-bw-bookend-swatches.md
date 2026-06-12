---
type: note
status: inbox
created: 2026-04-17
---

# Bring back "show black and white swatches" option

We used to have a "B/W swatches" toggle that prepended pure white (L=100) and appended pure black (L=0) to the generated palette as bookends. It was removed in commit `320c440` ("feat(palette): add lightness range slider with lock, replace B/W toggle") and replaced by the dual-thumb lightness range slider.

## Why bring it back

The range slider is strictly more flexible, but it doesn't cleanly reproduce the old behavior. Users wanted pure #000 and #FFF as framing anchors alongside a chromatic palette — not to drag L bounds all the way to 0/100, which:

- Still produces **colored** endpoints (the saturation curve pushes nonzero chroma at near-black and near-white).
- Makes the chromatic interior narrower — you lose resolution in the useful midtones.
- Requires two separate drags; it's not a one-click affordance.

A dedicated B/W toggle gives a different output shape: a fully chromatic scale at its current bounds, *flanked* by true neutral anchors. That's genuinely useful for:

- Tailwind-style scales where `white` (#fff) and `black` (#000) sit outside the numbered shades.
- Design tokens that want explicit neutral endpoints regardless of hue/sat settings.
- Exports where the consumer expects `white`/`black` as named tokens.

## Design questions to think through

- **Count semantics**: If the user has "swatches = 8" and toggles B/W on, does the grid show 8 or 10 total? (The old behavior added 2 extras; modern counts like Tailwind-11 already include `50`/`950`, so the answer depends on whether B/W is bookends *outside* or labels replacing the endpoints.)
- **Interaction with lightness range**: What if the user has set L bounds to e.g. 10–90? Do the B/W bookends still appear (as true 0/100) regardless of the current range? Probably yes — that's the whole point — but worth confirming.
- **Interaction with Tailwind-11 preset (NOTE-0031)**: The Tailwind scale's `50` and `950` aren't pure white/black. So B/W-on-top-of-Tailwind would give 13 swatches: `white, 50, 100, ..., 950, black`. Acceptable? Or mutually exclusive?
- **Export labeling**: Bookend swatches should export as `white` / `black` (or `0` / `100`), not be shoved into the numeric sequence. The old code had a `label` field per entry — use that.
- **Placement in UI**: Before it was a small toggle in the ControlBar alongside layout/swatches. Options:
  - Tiny toggle next to the swatch-count select (original pattern).
  - Part of a "scale options" group if Tailwind preset lands.
  - Inside the layout popover, de-emphasized.
- **Naming**: "Show black and white," "Include B/W anchors," "Add endpoints"? Old name was fine but terse.
- **Default state**: Off (current behavior) or on-by-default for new users? Probably off — additive feature, don't change defaults.

## Related

- NOTE-0007 (Named swatches) — B/W anchors are a special case of named-scale support.
- NOTE-0021 (Custom swatch intervals) — if users can define arbitrary scales, "B/W bookends" is a special case.
- NOTE-0031 (Tailwind 11-swatch preset) — decide whether B/W stacks with Tailwind or is mutually exclusive.

## References

- Feature introduced: commit `4024721` ("feat(palette): add layout options, B/W swatches, and improve grid defaults")
- Feature removed: commit `320c440` ("feat(palette): add lightness range slider with lock, replace B/W toggle")
