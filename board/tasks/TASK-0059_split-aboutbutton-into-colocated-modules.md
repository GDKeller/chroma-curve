---
type: task
status: backlog
priority: 1
parent: EPIC-0013
created: 2026-04-06
updated: 2026-10-20
---

# TASK-0059: Split AboutButton.tsx into colocated component modules

**Priority bumped from P3 to P1 (2026-04-09)** as a prerequisite for EPIC-0013 (Astro migration). Porting 12 modular files into a React island is significantly easier than porting one 1100-line monolith.

> **Refreshed 2026-10-20.** The component flatten in e3b8ab6 (2026-04-16) renamed `components/About.tsx` → `components/AboutButton/AboutButton.tsx` and established the one-directory-per-component convention (`ComponentName/ComponentName.tsx` + `index.ts` barrel). Paths and target structure below are updated to match. Re-parented from EPIC-0004 (done, archived) to EPIC-0013, which this task blocks via TASK-0065.

`AboutButton/AboutButton.tsx` is 1101 lines containing 11 React components (including the `AboutButton` root), 1 custom hook, ~15 constants, helper functions, and types in a single file. It is the reason `max-lines` in `app/eslint.config.js` is capped at 1100 (goal: 300). Split it into sibling modules inside the existing `AboutButton/` directory so the public surface (`index.ts` → `AboutButton`) is unchanged.

## Target structure

```
app/src/
  hooks/
    useCurvePickerData.ts
  components/
    AboutButton/
      index.ts            (unchanged — re-exports AboutButton)
      AboutButton.tsx     (slimmed to the dialog root)
      aboutConstants.ts
      Strip.tsx
      LightnessHeader.tsx
      ColorPickerPlane.tsx
      VisualPanel.tsx
      CurveGraph.tsx
      RotatedPicker.tsx
      Formula.tsx
      SolutionSection.tsx
      HuePicker.tsx
```

## `aboutConstants.ts`

All shared constants, types, and helpers:

- **Constants**: `DEFAULT_HUE`, `REF_SMOD`, `STRIP_STEPS`, `SAT_FOR_MID`, `SAT_FOR_EXTREMES`, `SAT_CURVED`, `LIGHTNESS_LABELS`, `BOUNDARY_SCALE`, `HUE_PRESETS`, `CURVE_SIZE`, `CURVE_RES`, `CURVE_CELL`, `SAT_GRID_LINES`, `CURVE_EDGE_MULT`, `CURVE_BSCALE`
- **Type**: `SwatchMark`
- **Interface**: `StripProps`
- **Helpers**: `markForMid`, `markForExtremes`, `markCurved`, `buildStrips`, `curveToX`, `curveToY`
- Animation timeline constants stay local to `ColorPickerPlane.tsx`

## `hooks/useCurvePickerData.ts`

Extracted hook (currently lines 369-403 of `AboutButton.tsx`). Imports curve constants from `../components/AboutButton/aboutConstants` and `getSaturation` from `../lib/palette`.

## Dependency graph

```
aboutConstants.ts  <-- leaf (imports only ../../lib/palette)
       |
       +---> Strip.tsx
       +---> LightnessHeader.tsx
       +---> ColorPickerPlane.tsx
       +---> VisualPanel.tsx
       |         |
       |         +---> CurveGraph.tsx
       |         +---> RotatedPicker.tsx
       +---> Formula.tsx
       +---> HuePicker.tsx
       +---> hooks/useCurvePickerData.ts
                  |
                  +---> SolutionSection.tsx
                              |
                              +---> AboutButton.tsx  <-- root export
```

## Implementation sequence

1. Create `AboutButton/aboutConstants.ts` — all constants, types, helpers
2. Create `hooks/useCurvePickerData.ts` — extracted hook
3. Create leaf components: `Strip`, `LightnessHeader`, `Formula`, `VisualPanel`, `ColorPickerPlane`, `HuePicker`
4. Create dependent components: `CurveGraph`, `RotatedPicker` (both use `VisualPanel`)
5. Create `SolutionSection.tsx`
6. Slim `AboutButton.tsx` down to the dialog root, importing the new siblings
7. Leave `index.ts` and `Header.tsx` untouched — `Header` already imports via the `../AboutButton` barrel
8. Run lint + build to verify
9. Ratchet `max-lines` in `app/eslint.config.js` down from 1100 toward its 300 goal, now that the largest file has shrunk

## Verification

- `npm run lint` — no errors
- `npm run build` — compiles cleanly
- Dev server: About dialog renders correctly with all strips, animations, hue picker, and responsive layout

## Files

- `app/src/components/AboutButton/AboutButton.tsx` (modified — slimmed to dialog root)
- `app/src/components/AboutButton/aboutConstants.ts` (new)
- `app/src/components/AboutButton/Strip.tsx` (new)
- `app/src/components/AboutButton/LightnessHeader.tsx` (new)
- `app/src/components/AboutButton/ColorPickerPlane.tsx` (new)
- `app/src/components/AboutButton/VisualPanel.tsx` (new)
- `app/src/components/AboutButton/CurveGraph.tsx` (new)
- `app/src/components/AboutButton/RotatedPicker.tsx` (new)
- `app/src/components/AboutButton/Formula.tsx` (new)
- `app/src/components/AboutButton/SolutionSection.tsx` (new)
- `app/src/components/AboutButton/HuePicker.tsx` (new)
- `app/src/hooks/useCurvePickerData.ts` (new)
- `app/eslint.config.js` (modified — lower `max-lines`)
