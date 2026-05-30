---
paths:
  - '**/*.stories.{ts,tsx}'
  - '.storybook/**'
---

# Storybook tests

Co-located `*.stories.tsx`. Each story's play function and axe-core a11y check
run in a real browser via `@storybook/addon-vitest`: `npm run test:storybook`.

- `a11y.test: 'error'` (`.storybook/preview.ts`) — any axe violation fails CI.
  `region` and `landmark-one-main` are disabled (false positives for isolated
  components); colour-contrast and the rest stay on.
- Clerk is stubbed via a Vite alias to `.storybook/mocks/clerk-nextjs.tsx`.
- `nextjs.appDirectory: true` is set so `next/navigation` works in stories.
