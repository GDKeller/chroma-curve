---
type: task
created: 2026-03-16
status: open
epic: EPIC-0001
priority: high
refs: [UX-1, UX-2, CQ-6]
---

# Extract shared ToggleSwitch component with proper ARIA and hit area

The custom toggle switch (`<button role="switch">`) is copy-pasted 6+ times across `PaletteGrid.tsx`, `SaturationCurve.tsx`, and `EffectiveSaturation.tsx`. None have accessible names and the hit area (20×10px) is below the 24px minimum.

## Requirements

- Create `components/controls/ToggleSwitch.tsx` accepting `label`, `checked`, `onChange` props
- Link label text via `aria-labelledby` or use a proper `<label>` with `htmlFor`
- Increase hit area to at least 24×24px (44px preferred for mobile) using padding or transparent overlay
- Replace all 6+ inline toggle instances with the shared component
- Ensure keyboard operation (Space/Enter to toggle)

## Files to modify

- `app/src/components/controls/ToggleSwitch.tsx` (new)
- `app/src/components/palette/PaletteGrid.tsx`
- `app/src/components/curves/SaturationCurve.tsx`
- `app/src/components/curves/EffectiveSaturation.tsx`
