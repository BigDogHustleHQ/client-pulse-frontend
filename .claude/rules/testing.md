# Testing

Four layers run in CI: `unit`, `storybook-test`, `e2e`, `visual`. Tests are
co-located (`*.test.tsx`, `*.stories.tsx`). Full guide: `docs/testing.md`.

- **Unit** — Vitest + RTL (jsdom). `npm test`. Coverage gate: 80% lines on
  `src/components/**`, 90% on `src/store/**`.
- **Storybook** — `*.stories.tsx`; each play fn + axe a11y in a real browser
  (`a11y.test: 'error'`). `npm run test:storybook`.
- **E2E** — Playwright against the prod build (`e2e/`). `npm run test:e2e`.
- **Visual** — Playwright screenshots of stories vs committed baselines
  (`visual/`). `npm run test:visual`. Regenerate baselines in the pinned
  Playwright Docker image; see `docs/visual-regression.md`.

Pre-commit (Husky + lint-staged) runs `eslint --fix`, `prettier`, `typecheck`.
Run `npm run <script>`; see `package.json` for the full list.
