---
type: task
created: 2026-03-16
status: done
epic: EPIC-0001
priority: 2
refs: [UX-11]
---

# Suppress Framer Motion animations under prefers-reduced-motion

The CSS `prefers-reduced-motion` rule in `index.css` correctly handles CSS transitions but does not affect Framer Motion's JS-driven animations. Dialogs, copy feedback, and About modal animations still play for users who prefer reduced motion.

## Requirements

- Use Framer Motion's `useReducedMotion()` hook or `MotionConfig` provider
- Option A (preferred): Wrap app in `<MotionConfig reducedMotion="user">` in `main.tsx` — Framer Motion will automatically respect the OS preference
- Option B: Use `useReducedMotion()` in each animated component and conditionally set `transition={{ duration: 0 }}`
- Verify: `ExportDialog.tsx`, `About.tsx` (dialog + ColorPickerPlane animations), `CopyFeedback.tsx`

## Files to modify

- `app/src/main.tsx` (if using MotionConfig approach)
- Or individual component files
