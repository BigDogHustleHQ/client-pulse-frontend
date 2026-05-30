---
paths:
  - 'visual/**'
  - '**/playwright.visual.config.ts'
---

# Visual regression tests

Playwright screenshots of Storybook stories vs committed baselines, in
`visual/`: `npm run test:visual`. Self-hosted (no Chromatic).

- Baselines are render-environment specific. Regenerate them in the pinned
  Playwright Docker image, never on your laptop:
  `npm run test:visual:update` inside `mcr.microsoft.com/playwright:v1.60.0-noble`.
- Add a story by appending its id (`title` slug + `--export`) to the `stories`
  array in `visual/storybook.visual.spec.ts`, then regenerate baselines.
- Full rationale + Chromatic-switch guide: `docs/visual-regression.md`.
