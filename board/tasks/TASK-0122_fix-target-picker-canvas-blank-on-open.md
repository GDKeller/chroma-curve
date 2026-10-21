---
type: task
status: backlog
priority: 1
created: 2026-10-20
parent: EPIC-0014
---

# TASK-0122: Fix target picker canvas rendering blank when popover opens

Clicking the target swatch opens the popover, but the hue × saturation picker canvas is an empty dark square. It only appears after you click inside the area where it should be.

## Reproduce

1. Open the app (reproduces on the live site, which matches `main`).
2. Click the target swatch next to the Hue slider.
3. **Actual:** the popover shows "Hue / Sat" readouts and the color input, but the 200×200 canvas above them is blank.
4. **Expected:** the full hue/saturation gradient with the crosshair at the current position, on first paint.

It happens on **every** open, not just the first, because the popover content unmounts when it closes.

## Impact

- The picker looks broken on every open.
- The only way to reveal it destroys state. Mouse-down on the canvas calls `pickFromCoords()`, which runs `clearTarget()` and sets hue/saturation to the clicked point. Arrow keys on the focused canvas do the same. **A user with an active target color can't see the picker without wiping their target.**

## Root cause

`TargetSwatch/TargetSwatch.tsx`:

- The canvas lives inside `<Popover.Portal><Popover.Content>` (lines ~321–337). Radix unmounts that content while the popover is closed.
- Drawing happens in an effect keyed only on `drawPicker`, which changes only when `hue` / `saturation` change (lines ~193–195):
  ```ts
  useEffect(() => {
    if (canvasRef.current) drawPicker(canvasRef.current);
  }, [drawPicker]);
  ```
- When the popover opens, the canvas mounts but `drawPicker` hasn't changed, so the effect doesn't re-run and nothing is drawn. Clicking the canvas changes hue/saturation, which changes `drawPicker`, so the effect fires and the canvas finally paints.

**Regression from 7dc1bed (2026-04-17, "fix stale crosshair" — a PR #5 review fix).** The original implementation (ab4cb01) used a callback ref that drew whenever the canvas attached (`canvasRef.current = canvas; if (canvas) drawPicker(canvas);`). 7dc1bed swapped it for `useRef` + the effect above, which fixed the crosshair-update case but lost draw-on-mount. It has been live since the Apr 17 deploy.

## Fix options

1. **Recommended: extract the canvas into its own component** (e.g. `HueSatPicker.tsx` inside `TargetSwatch/`), with its own `useEffect` that draws on mount and whenever `hue` / `saturation` change. Mounting now coincides with the popover opening, so both cases are covered without extra state. It's also the natural home for TASK-0112 (Pointer Events), and it shrinks `TargetSwatch.tsx`.
2. **Restore a memoized callback ref** that draws on attach (`useCallback((node) => { canvasRef.current = node; if (node) drawPicker(node); }, [drawPicker])`), alongside or instead of the effect. Before choosing this, confirm what "stale crosshair" bug 7dc1bed was fixing so it doesn't come back.
3. **Controlled `open` state** on `Popover.Root`, with `open` added to the draw effect's dependencies.

Avoid `forceMount`. Keeping a hidden canvas mounted just to work around the lifecycle adds visibility/focus handling for no benefit.

**Optional, while here:** the gradient never depends on hue/saturation, only the crosshair does. Building the 200×200 `ImageData` once (memo or module-level) and redrawing just the crosshair avoids a 40k-pixel loop on every drag tick.

## Acceptance

- The canvas is fully rendered on first paint in each of these cases:
  - first open
  - reopen
  - reopen after hue/saturation were changed via the sliders while the popover was closed
  - reopen with an active target
- The crosshair still tracks changes while the popover is open, from the sliders, canvas drag, arrow keys, and applying a target via the input. This was the case 7dc1bed fixed.
- Opening the popover never changes hue, saturation, or the target.

## Verification

There's no test runner in the project, so verify in the browser (Playwright works). After opening the popover, sample the canvas without interacting with it:

```js
const c = document.querySelector('[role=dialog] canvas, [data-radix-popper-content-wrapper] canvas');
c.getContext('2d').getImageData(100, 100, 1, 1).data[3]; // expect 255, not 0
```

Repeat after closing and reopening, and after moving the Hue slider while closed.

`.screenshots/mono-2-popover.png` (captured 2026-10-20 on the live site) shows the blank canvas, and `mono-3-target-active.png` shows it painted after a target was applied, which changed hue/saturation and so triggered a draw.

## Related

- TASK-0112: Pointer Events / touch for the same canvas (do both in the extracted component)
- TASK-0111: target-color a11y gaps (the canvas's keyboard and focus behavior)
- TASK-0110: tokenize the canvas crosshair `rgba(0,0,0,0.4)` stroke
