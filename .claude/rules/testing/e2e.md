---
paths:
  - 'e2e/**'
  - '**/playwright.config.ts'
---

# E2E tests

Playwright smoke tests against the production build, in `e2e/`:
`npm run test:e2e` (`playwright.config.ts` builds/serves the app).

- Boots with dummy Clerk keys — no real secrets.
- `NEXT_PUBLIC_E2E_BYPASS_CLERK=true` (build-time) skips Clerk's dev-browser
  handshake so pages render without a live backend. CI-only; never in prod.
- Run locally: `NEXT_PUBLIC_E2E_BYPASS_CLERK=true npm run build && npm run test:e2e`.
