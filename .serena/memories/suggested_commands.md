# Suggested Commands

All commands run from the `app/` directory.

## Development
```bash
cd app && npm run dev      # Start Vite dev server
```

## Build
```bash
cd app && npm run build    # TypeScript check + Vite production build
```

## Preview
```bash
cd app && npm run preview  # Preview production build locally
```

## Linting
```bash
cd app && npm run lint     # ESLint (TS/TSX files)
```

## Formatting
```bash
cd app && npx prettier --check "src/**/*.{ts,tsx,css}"   # Check formatting
cd app && npx prettier --write "src/**/*.{ts,tsx,css}"   # Fix formatting
```

## System Utilities (macOS/Darwin)
```bash
git status / git log / git diff   # Version control
ls / find / grep                   # File system navigation
```

## Notes
- No test framework is currently configured
- The app directory contains the active React app; `src/` at root is the legacy vanilla version
