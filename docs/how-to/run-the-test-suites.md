# How to run the test suites

> **Diátaxis: how-to.** Task-oriented steps for someone who already knows the
> setup. For the _why_, see [Testing strategy](../explanation/testing-strategy.md).

## Everything, the way CI runs it

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test:coverage      # unit tests + coverage gate
npm run test:storybook     # stories: play fns + axe (needs a browser)
npm run build && NEXT_PUBLIC_E2E_BYPASS_CLERK=true npm run test:e2e
```

## Unit tests (Vitest, jsdom)

```bash
npm test                   # run once
npm run test:watch         # watch mode
npm run test:coverage      # with the coverage gate
npm test -- src/app/page.test.tsx   # a single file
```

## Storybook tests (play functions + axe, real browser)

```bash
npx playwright install chromium chromium-headless-shell   # one-time
npm run test:storybook
```

## End-to-end (Playwright against the production build)

E2E needs a build made with the Clerk handshake bypassed (see
[CI pipeline](../reference/ci-pipeline.md) for why):

```bash
npx playwright install chromium chromium-headless-shell   # one-time
NEXT_PUBLIC_E2E_BYPASS_CLERK=true npm run build
npm run test:e2e
```

`playwright.config.ts` starts the server for you (`npm run start` on port 3100)
with dummy Clerk keys.

## Visual regression (Playwright screenshots of Storybook)

```bash
npm run build-storybook
npm run test:visual          # compare against committed baselines
npm run test:visual:update   # regenerate baselines after an intended change
```

⚠️ Baselines are render-environment specific — generate them in the same image
CI uses. See [Update visual baselines](./update-visual-baselines.md).

## Pre-commit

Husky runs `lint-staged` (eslint --fix + prettier) and `npm run typecheck` on
every commit. To bypass in an emergency: `git commit --no-verify` (CI will still
enforce everything).
