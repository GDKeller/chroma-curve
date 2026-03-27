---
type: task
created: 2026-03-16
status: done
epic: EPIC-0001
priority: high
refs: [UX-4]
---

# Add visible focus styles to hue preset buttons

Hue preset color buttons in `About.tsx` (lines 571–582) have no `focus-visible` ring. Keyboard users get no visual feedback when tabbing through presets.

## Requirements

- Add `focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(0_0%_10%)]` to each preset button
- Also add to the reset button (line 584–607)

## Files to modify

- `app/src/components/About.tsx`
