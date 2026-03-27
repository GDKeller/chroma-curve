---
type: task
created: 2026-03-16
status: done
epic: EPIC-0005
priority: high
refs: [CQ-3, EX-6]
---

# Add clipboard error handling with user feedback

`useCopyToClipboard` calls `navigator.clipboard.writeText().then(...)` with no `.catch()`. If the clipboard API fails (permissions denied, non-HTTPS, browser restriction), the failure is silently swallowed with no user feedback.

## Requirements

- Add `.catch()` to the clipboard write promise
- On failure, provide user feedback (e.g., set a different state like `"error"` that the UI can show as "Failed to copy")
- Return an error state from the hook so consumers can react
- Consider fallback to `document.execCommand('copy')` for older browsers (optional, low priority)

## Files to modify

- `app/src/hooks/useCopyToClipboard.ts`
- Potentially `app/src/components/palette/CopyFeedback.tsx` (if adding error state UI)
- Potentially `app/src/components/export/ExportPreview.tsx` (if showing error state)
