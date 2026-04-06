---
type: task
created: 2026-03-16
status: done
epic: EPIC-0001
priority: 2
refs: [UX-10, UX-12, UX-13, UX-15, UX-16]
---

# Add missing aria-labels, descriptions, and SVG titles

Several interactive elements and dialogs lack accessible labels or descriptions.

## Requirements

- `ExportPreview.tsx`: Add `aria-label="Copy palette code"` and `aria-label="Download palette file"` to buttons
- `ExportDialog.tsx`: Add `<Dialog.Description className="sr-only">Export palette in various formats</Dialog.Description>`
- `About.tsx`: Add `<Dialog.Description className="sr-only">` to About dialog; add `aria-label="Change reference hue"` to popover trigger button (line 709)
- `FormatSelector.tsx`: Add `aria-label="Export format"` and `aria-label="Color space"` to each `Tabs.List`
- `SaturationCurve.tsx` + `EffectiveSaturation.tsx`: Add `<title>` element as first child of `<svg>`, linked via `aria-labelledby`

## Files to modify

- `app/src/components/export/ExportPreview.tsx`
- `app/src/components/export/ExportDialog.tsx`
- `app/src/components/export/FormatSelector.tsx`
- `app/src/components/About.tsx`
- `app/src/components/curves/SaturationCurve.tsx`
- `app/src/components/curves/EffectiveSaturation.tsx`
