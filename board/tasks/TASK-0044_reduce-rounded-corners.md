---
type: task
status: backlog
priority: 3
parent: NOTE-0017
created: 2026-04-01
---

# TASK-0044: Reduce or remove rounded corners

Audit all `rounded-*` Tailwind classes across the app and reduce or eliminate border-radius to match the instrument aesthetic (sharp, clinical, precise). The current values feel too soft.

## Scope

Components using rounded corners (all in `app/src/components/`):

### Controls
- **ToggleSwitch** — `rounded-full` on track and thumb (functional — keep for toggle pill shape)
- **SliderBase** — `rounded-full` on track, range, and thumb (functional — keep for slider shape)
- **SaturationSlider** — same as SliderBase
- **LightnessRange** — same as SliderBase
- **TargetSwatch** — `rounded-full` on swatch circle, `rounded-lg` on popover

### Export
- **ExportDialog** — `rounded-2xl` on dialog overlay, `rounded-lg` on trigger button
- **ExportPreview** — `rounded-lg` on code block, `rounded-md` on buttons
- **FormatSelector** — `rounded-lg` on tab container, `rounded-md` on tab items

### Palette
- **PaletteStrip** — `rounded-xl` on strip container
- **PaletteGrid** — `rounded-xl` on grid container
- **CopyFeedback** — `rounded-sm` on overlay

### Curves
- **ChartTabs** — `rounded-xs` on container, `rounded-sm` on color strips

### About
- **About** — `rounded-xl` on info bar, `rounded-lg` on comparison grid/popovers/nav links, `rounded-sm` on swatches/scrubber elements

## Guidelines

- **Keep `rounded-full`** on circular elements (toggle thumbs, slider thumbs/tracks, swatch circles) — these are functionally round
- **Reduce large radii** (`rounded-2xl`, `rounded-xl`, `rounded-lg`) to `rounded-sm` or `rounded-xs` — or remove entirely
- **Evaluate `rounded-md`** on buttons — consider `rounded-xs` or `rounded-none`
- Match the "instrument, not toy" design principle — no consumer-grade rounded-everything
