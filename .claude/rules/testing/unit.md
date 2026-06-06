---
paths:
  - '**/*.test.{ts,tsx}'
  - '**/vitest.config.ts'
  - '**/vitest.setup.ts'
---

# Unit tests

Vitest + React Testing Library (jsdom), co-located as `*.test.{ts,tsx}`.

- `npm test` runs the `unit` project; `npm run test:coverage` adds the gate.
- Coverage gate: 80% lines on `src/components/**`, 90% on `src/store/**`.
- Globals are on (no importing `describe`/`it`/`expect`); jest-dom matchers
  load via `vitest.setup.ts`.
- Mock Clerk and other server deps — unit tests never hit the network.
