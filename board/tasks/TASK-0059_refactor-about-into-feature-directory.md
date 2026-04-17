---
type: task
status: backlog
priority: 1
epic: EPIC-0004
created: 2026-04-06
updated: 2026-04-09
---

# TASK-0059: Refactor About.tsx into `about/` feature directory

**Priority bumped from P3 to P1 (2026-04-09)** as a prerequisite for EPIC-0013 (Astro migration). Porting 12 modular files into a React island is significantly easier than porting one 912-line monolith.

`About.tsx` is 912 lines containing 10 React components, 1 custom hook, ~15 constants, helper functions, and types in a single file. Extract into an `about/` feature subdirectory following the project's one-component-per-file convention.

## Target structure

```
app/src/
  hooks/
    useCurvePickerData.ts
  components/
    about/
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
      AboutButton.tsx
```

## `aboutConstants.ts`

All shared constants, types, and helpers:

- **Constants**: `DEFAULT_HUE`, `REF_SMOD`, `STRIP_STEPS`, `SAT_FOR_MID`, `SAT_FOR_EXTREMES`, `SAT_CURVED`, `LIGHTNESS_LABELS`, `BOUNDARY_SCALE`, `HUE_PRESETS`, `CURVE_SIZE`, `CURVE_RES`, `CURVE_CELL`, `SAT_GRID_LINES`, `CURVE_EDGE_MULT`, `CURVE_BSCALE`
- **Type**: `SwatchMark`
- **Interface**: `StripProps`
- **Helpers**: `markForMid`, `markForExtremes`, `markCurved`, `buildStrips`, `curveToX`, `curveToY`
- Animation timeline constants stay local to `ColorPickerPlane.tsx`

## `hooks/useCurvePickerData.ts`

Extracted hook (lines 321-352). Imports curve constants from `../components/about/aboutConstants` and `getSaturation` from `../lib/palette`.

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

1. Create `about/aboutConstants.ts` — all constants, types, helpers
2. Create `hooks/useCurvePickerData.ts` — extracted hook
3. Create leaf components: `Strip`, `LightnessHeader`, `Formula`, `VisualPanel`, `ColorPickerPlane`, `HuePicker`
4. Create dependent components: `CurveGraph`, `RotatedPicker` (both use `VisualPanel`)
5. Create `SolutionSection.tsx`
6. Create `AboutButton.tsx`
7. Update `Header.tsx` import: `"./About"` to `"./about/AboutButton"`
8. Delete original `About.tsx`
9. Run lint + build to verify

## Verification

- `npm run lint` — no errors
- `npm run build` — compiles cleanly
- Dev server: About dialog renders correctly with all strips, animations, hue picker, and responsive layout

## Files

- `app/src/components/About.tsx` (deleted)
- `app/src/components/about/aboutConstants.ts` (new)
- `app/src/components/about/Strip.tsx` (new)
- `app/src/components/about/LightnessHeader.tsx` (new)
- `app/src/components/about/ColorPickerPlane.tsx` (new)
- `app/src/components/about/VisualPanel.tsx` (new)
- `app/src/components/about/CurveGraph.tsx` (new)
- `app/src/components/about/RotatedPicker.tsx` (new)
- `app/src/components/about/Formula.tsx` (new)
- `app/src/components/about/SolutionSection.tsx` (new)
- `app/src/components/about/HuePicker.tsx` (new)
- `app/src/components/about/AboutButton.tsx` (new)
- `app/src/hooks/useCurvePickerData.ts` (new)
- `app/src/components/Header.tsx` (modified)
