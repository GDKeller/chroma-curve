---
type: note
created: 2026-03-16
---

# Comprehensive Project Review

Full codebase review covering code quality, UX/accessibility, and export system correctness. Performed 2026-03-16 on branch `feat/export-palette`.

---

## Code Quality

### High

| # | File | Line | Issue |
|---|------|------|-------|
| CQ-1 | `lib/palette.ts` | 9 | Division-by-zero guard on `getSaturation` is load-bearing but undocumented — if removed, `sMod=0` causes `Infinity` |
| CQ-2 | `About.tsx` | 39–71 | Module-level constant ordering creates fragile forward dependency (`buildStrips` declared before `BOUNDARY_SCALE`) |
| CQ-3 | `hooks/useCopyToClipboard.ts` | 9 | Unhandled clipboard API promise rejection — no `.catch()`, no user error feedback |

### Medium

| # | File | Line | Issue |
|---|------|------|-------|
| CQ-4 | `About.tsx` | 315 | `useCurvePickerVisuals` hook returns JSX — anti-pattern, should return data to components |
| CQ-5 | `SaturationCurve.tsx` + `EffectiveSaturation.tsx` | 11–15 | Duplicated chart constants and SVG infrastructure (~80 lines each) |
| CQ-6 | `PaletteGrid.tsx` + curve components | various | Toggle switch markup copy-pasted 6+ times — extract shared component |
| CQ-7 | `export/ExportDialog.tsx` | 15 | `formatPalette` runs on every render even when dialog is closed |
| CQ-8 | `About.tsx` | 128–295 | `ColorPickerPlane`: 1600 SVG rects + Framer Motion cells with no memoization, re-renders on drag |
| CQ-9 | `About.tsx` | 315–454 | `useCurvePickerVisuals`: 1600 picker cells computed without memoization |

### Low

| # | File | Line | Issue |
|---|------|------|-------|
| CQ-10 | `palette/PaletteGrid.tsx` | 10, 50 | Magic number `98` couples default swatch count to palette generation implicitly |
| CQ-11 | `palette/PaletteStrip.tsx` | 10 | Unnecessary `[...entries].reverse()` on every render |
| CQ-12 | `lib/palette.ts` | 34–35 | Overly complex double-round formula — outer `Math.round` is redundant |
| CQ-13 | `About.tsx` | 700, 760 | Empty `<div />` used as CSS grid spacers (violates CLAUDE.md guideline) |
| CQ-14 | `controls/SliderBase.tsx` | 10 | `React.CSSProperties` used without explicit `React` import |
| CQ-15 | `About.tsx` | 87, 88 | Array index used as key in `Strip` component maps |

---

## UX & Accessibility

### High

| # | File | Line | Issue |
|---|------|------|-------|
| UX-1 | `PaletteGrid.tsx`, `SaturationCurve.tsx`, `EffectiveSaturation.tsx` | various | Toggle switches (`role="switch"`) have no accessible name — `<span>` label not linked via `aria-labelledby` |
| UX-2 | `PaletteGrid.tsx`, `SaturationCurve.tsx`, `EffectiveSaturation.tsx` | various | Toggle switch hit area is 20×10px — below both 24px web and 44px mobile minimums |
| UX-3 | `About.tsx` | 611–629 | Hue gradient bar has no keyboard access — no `role="slider"`, no `tabIndex`, no arrow key handler |
| UX-4 | `About.tsx` | 571–582 | Hue preset buttons have no visible focus style for keyboard navigation |

### Medium

| # | File | Line | Issue |
|---|------|------|-------|
| UX-5 | `PaletteGrid.tsx` | 71–95 | `<label>` wrapper text at `text-white/20` (~1.4:1 contrast) fails WCAG AA |
| UX-6 | Multiple (`Header.tsx`, `PaletteGrid.tsx`, `SaturationCurve.tsx`, `About.tsx`) | various | Functional text at `text-white/20` to `text-white/40` fails WCAG AA contrast (1.4:1 – 2.5:1 vs required 4.5:1) |
| UX-7 | `ColorSwatch.tsx` | 26–28 | Compact mode renders labels at 9px/7px — below legibility threshold |
| UX-8 | `AppShell.tsx` | 6 | No `<main>` landmark — screen readers cannot skip to content |
| UX-9 | `PaletteStrip.tsx` | 10–17 | Color strip has no `aria-hidden` (decorative) or `role="img"` with label (informative) |
| UX-10 | `ExportPreview.tsx` | 17–30 | Copy/Download buttons lack `aria-label` describing the action target |
| UX-11 | `CopyFeedback.tsx`, `ExportDialog.tsx`, `About.tsx` | various | Framer Motion animations not suppressed under `prefers-reduced-motion` — CSS rule doesn't affect JS-driven transitions |

### Low

| # | File | Line | Issue |
|---|------|------|-------|
| UX-12 | `ExportDialog.tsx`, `About.tsx` | 39, 678 | Dialogs missing `Dialog.Description` / `aria-describedby` |
| UX-13 | `FormatSelector.tsx` | 49, 66 | Two tab groups lack distinguishing `aria-label` |
| UX-14 | `ControlBar.tsx` | 7 | Sticky control bar has no landmark role |
| UX-15 | `SaturationCurve.tsx`, `EffectiveSaturation.tsx` | SVG elements | SVG charts have `role="img"` + `aria-label` but no `<title>` element |
| UX-16 | `About.tsx` | 709–714 | Hue popover trigger button has no `aria-label` |

---

## Export System

### Medium

| # | File | Line | Issue |
|---|------|------|-------|
| EX-1 | `lib/export.ts` | 17–18 | HCL `c2` (chroma channel) not guarded for NaN like hue is — inconsistent pattern |

### Low

| # | File | Line | Issue |
|---|------|------|-------|
| EX-2 | `lib/export.ts` | 116–117 | GPL format: `c.rgb()` returns floats — `String(r)` on a float breaks column alignment. Needs `Math.round()` |
| EX-3 | `lib/export.ts` | 77–82 | TW v3 output has over-indented inner lines (cosmetic, 10-space indent vs expected 6) |
| EX-4 | `lib/export.ts` | 74, 94, 103 | Hard-coded `"grey-"` prefix strip tightly couples to `generateNeutrals` label format |
| EX-5 | `lib/export.ts` | 148 | Generic `text/plain` MIME type for all downloads — more specific types would improve browser behavior |
| EX-6 | `hooks/useCopyToClipboard.ts` | 9 | No `.catch()` on clipboard write — silent failure on permission denied (same as CQ-3) |
| EX-7 | `export/FormatSelector.tsx` | 45–73 | `Tabs.Root` without `Tabs.Content` — ARIA `aria-controls` points to non-existent panels. Consider `role="radiogroup"` |

---

## Summary

| Category | High | Medium | Low | Total |
|----------|------|--------|-----|-------|
| Code Quality | 3 | 6 | 6 | 15 |
| UX / A11y | 4 | 7 | 5 | 16 |
| Export System | 0 | 1 | 6 | 7 |
| **Total** | **7** | **14** | **17** | **38** |

### Recommended Priority Actions

1. **Fix clipboard error handling** (CQ-3 / EX-6) — affects both palette copy and export copy
2. **Add accessible names to toggle switches** (UX-1) — screen readers get no label
3. **Increase toggle switch hit area** (UX-2) — currently 20×10px
4. **Add keyboard access to hue gradient bar** (UX-3) — completely inaccessible to keyboard users
5. **Fix WCAG contrast on functional labels** (UX-5, UX-6) — raise from `white/20` to at least `white/60`
6. **Memoize heavy SVG generation in About.tsx** (CQ-8, CQ-9) — 3200+ elements recomputed on drag
7. **Extract shared toggle switch component** (CQ-6) — 6+ duplicated instances
8. **Fix GPL float RGB values** (EX-2) — concrete data correctness bug
