---
type: task
status: backlog
priority: 1
created: 2026-04-06
parent: EPIC-0013
blocked_by: TASK-0047
---

# TASK-0048: Migrate main.tsx entry point to SSG

Replace `createRoot` in `main.tsx` with the `vite-react-ssg` entry point. Define the single route (`/`) and preserve the existing `StrictMode` and `MotionConfig` wrappers.
