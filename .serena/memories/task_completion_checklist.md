# Task Completion Checklist

When a coding task is completed, run the following checks:

1. **TypeScript check + Build**: `cd app && npm run build`
   - This runs `tsc -b` then `vite build`
   - Ensures no type errors and production build succeeds

2. **Lint**: `cd app && npm run lint`
   - ESLint check on all TS/TSX files

3. **Format check**: `cd app && npx prettier --check "src/**/*.{ts,tsx,css}"`
   - Verify Prettier formatting compliance

4. **No test suite currently** — no tests to run

5. **Ask user before committing** — never auto-commit
   - Use conventional commits format: `type(scope): description`
   - Single-line commit messages
