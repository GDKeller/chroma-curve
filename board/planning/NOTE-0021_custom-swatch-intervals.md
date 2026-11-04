---
type: note
status: inbox
created: 2026-03-30
---

# Custom swatch intervals and movable curve points

Add the ability to set the swatch interval distribution (e.g. "equal distance" vs weighted). Also add the ability to independently move individual swatches along the strip/curve — changing one swatch to another point on the curve without affecting others. The UX should feel like dragging a point along the curve line.

## Problem (expanded 2026-11-04)

The only way to pick swatches today is the swatch count. `sampleEntries()` in `PaletteGrid` spreads `count` swatches evenly across the `lMin..lMax` entries and rounds to the nearest integer L. That doesn't cover common real-world needs:

- **Round intervals.** "Values in 10s" (L0, L10, … L100) or 5s. Even count-based spacing only lands on round numbers for specific count/range pairs, e.g. count 11 over 0–100.
- **Hand-picked stops.** Non-equidistant sets like L15, L25, L55, L75, L85, e.g. extra resolution in the light end for UI backgrounds, sparse in the darks.
- **Matching an existing system.** Reproducing a brand's or framework's lightness stops.

## Suggested model: one list of L values, three ways to produce it

Have every mode output the same thing: a sorted, de-duplicated `swatchLs: number[]` (integer L, since `generateNeutrals` produces 1-step entries). The grid, `PaletteStrip` indicators (TASK-0132), chart dots (TASK-0117), Compare strips, and export all read that one list. This keeps a single source of truth and replaces the local `swatchCount` in `PaletteGrid`.

Split the current `swatches` select into a **spacing mode** plus a mode-specific control:

| Mode | Control | Produces |
|---|---|---|
| `count` (current) | count select (3, 4, 5, 8, 9 …, all) | evenly spaced across `lMin..lMax` |
| `interval` | step select (5, 10, 20, 25) + anchor | every Nth L, e.g. 0, 10, 20 … 100 |
| `custom` | editable list / strip handles | exactly the user's L values |

- In `interval` mode, show the resulting count read-only (e.g. "11 swatches") so the two concepts stay linked.
- Interval anchor: either align to absolute multiples of N (L10, L20 …) or start from `lMin`. Absolute multiples are probably the expected default: "values in 10s" means round numbers.

## Editing custom stops

Use the strip indicators from TASK-0132 as the editing surface (the idea from this request):

- **Drag** an indicator along the strip to move that swatch; snap to integer L, and hold Shift to snap to 5s.
- **Click empty strip space** to add a stop there; **drag off the strip** or press Delete/Backspace on a focused handle to remove one.
- **Keyboard:** handles are focusable (`role="slider"`, `aria-valuenow` = L); arrow keys ±1, Shift+arrow ±5. This is required, not optional, since dragging alone fails keyboard users.
- **Precise entry:** a text field accepting `15, 25, 55, 75, 85`, in a popover off the mode control. Pairs with TASK-0108's typed-input patterns.
- **Seamless switching:** dragging a handle while in `count` or `interval` mode switches to `custom`, seeded with the current positions, so the user never has to pick "custom" first.
- The original "drag a point along the curve" idea can reuse the same state: chart dots in swatch-only density (TASK-0117) become handles too. Ship the strip first; it's the simpler hit target.

## Open questions

- **Range interaction:** what happens to custom stops outside `lMin..lMax` when the range narrows: clamp, hide, or disable the range slider in custom mode? Hiding (and restoring on widen) is likely least destructive.
- **Labels:** custom stops naturally label by L (`grey-15`), but count/preset modes may label by index or Tailwind shade. Decide under TASK-0087.
- **Presets:** the Tailwind 11-shade preset (TASK-0089) and B/W bookends (TASK-0090) could both be expressed as `custom` lists. Treat presets as named seeds for `custom` rather than separate code paths.
- **Persistence:** custom lists are user work. Do they survive reload (localStorage) or travel in a share URL?
- **Minimum gap / limits:** allow two stops at adjacent L (L50, L51)? Cap on stop count?
- **Export order:** always sorted by L, regardless of the grid's `reverse` toggle?

## Suggested phasing

1. Lift swatch selection into `paletteStore` as `swatchLs` (TASK-0132/TASK-0117 need this anyway).
2. Add `interval` mode: cheap, covers "values in 10s/5s" without new interaction design.
3. Add `custom` mode with typed list entry.
4. Make TASK-0132's strip indicators draggable handles; then optionally chart-dot handles.

## Related

- TASK-0132 — strip swatch indicators (proposed editing surface)
- TASK-0117 — chart swatch-only density (consumes the same list)
- TASK-0131 — default swatch count to 9
- TASK-0087 / EPIC-0018 — label and count semantics
- TASK-0089 — Tailwind preset; TASK-0090 — B/W bookends
- TASK-0108 — typed input patterns
