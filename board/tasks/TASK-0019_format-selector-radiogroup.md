---
type: task
created: 2026-03-16
status: open
epic: EPIC-0005
priority: low
refs: [EX-7]
---

# Replace Tabs with radiogroup in FormatSelector

`FormatSelector` uses `@radix-ui/react-tabs` purely for the tab-bar UI with no `Tabs.Content` panels. This means `aria-controls` points to non-existent panel elements, producing incomplete ARIA semantics.

## Requirements

- Replace `Tabs.Root`/`Tabs.List`/`Tabs.Trigger` with a custom button group using `role="radiogroup"` and `role="radio"` on each option
- Or use `@radix-ui/react-toggle-group` which better fits the single-selection pattern
- Maintain the same visual appearance (pill buttons in a rounded container)
- Ensure `aria-checked` state is set correctly on the active option

## Files to modify

- `app/src/components/export/FormatSelector.tsx`
