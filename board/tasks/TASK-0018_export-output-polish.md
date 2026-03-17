---
type: task
created: 2026-03-16
status: done
epic: EPIC-0005
priority: low
refs: [EX-3, EX-4, EX-5]
---

# Polish export output formatting

Minor cosmetic and robustness improvements to export output.

## Items

1. **EX-3** TW v3 output: `JSON.stringify` with 4-space indent + 6-space prefix produces over-indented inner lines. Fix the indentation math so inner lines align naturally at 6 spaces.
2. **EX-4** Hard-coded `"grey-"` prefix strip (`e.label.replace("grey-", "")`) in TW v3, JS, and JSON formatters. Extract a helper or derive the numeric key from `e.lightness` instead.
3. **EX-5** Generic `text/plain` MIME type for all downloads. Use `text/css` for CSS/SCSS, `application/json` for JSON, `text/javascript` for JS/TS.

## Files to modify

- `app/src/lib/export.ts`
