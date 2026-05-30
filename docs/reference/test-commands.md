# Reference: test commands

> **Diátaxis: reference.** Dry facts. Every test-related npm script, what it
> runs, and where it's configured.

## npm scripts

| Script                       | Command                                                | Notes                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `npm run dev`                | `next dev`                                             | Dev server (Turbopack)                           |
| `npm run build`              | `next build`                                           | Production build                                 |
| `npm run start`              | `next start`                                           | Serve the production build                       |
| `npm run lint`               | `eslint`                                               | Flat config `eslint.config.mjs`                  |
| `npm run typecheck`          | `tsc --noEmit`                                         | Strict TS                                        |
| `npm run format`             | `prettier --write .`                                   | Write formatting                                 |
| `npm run format:check`       | `prettier --check .`                                   | Verify formatting (CI)                           |
| `npm test`                   | `vitest run --project=unit`                            | Unit tests (jsdom)                               |
| `npm run test:watch`         | `vitest --project=unit`                                | Unit watch mode                                  |
| `npm run test:coverage`      | `vitest run --project=unit --coverage`                 | Unit + coverage gate                             |
| `npm run test:storybook`     | `vitest run --project=storybook`                       | Stories: play fns + axe, real browser            |
| `npm run test:e2e`           | `playwright test`                                      | E2E smoke (`playwright.config.ts`)               |
| `npm run test:visual`        | `playwright test --config=playwright.visual.config.ts` | Visual diff vs baselines                         |
| `npm run test:visual:update` | `… --update-snapshots`                                 | Regenerate visual baselines                      |
| `npm run serve-storybook`    | `http-server storybook-static -p 6099 -s -c-1`         | Serve built Storybook (used by visual webServer) |
| `npm run storybook`          | `storybook dev -p 6006`                                | Storybook dev server                             |
| `npm run build-storybook`    | `storybook build`                                      | Static Storybook → `storybook-static/`           |

## Running a single test

```bash
npm test -- src/app/page.test.tsx                       # one unit file
npm run test:e2e -- -g "login page"                     # one e2e test by title
npm run test:storybook -- src/.../LoginForm.stories.tsx # one story file
```

## Configuration files

| File                                | Configures                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `vitest.config.ts`                  | Two Vitest projects: `unit` (jsdom) and `storybook` (browser); coverage gate |
| `vitest.setup.ts`                   | Loads `@testing-library/jest-dom` matchers                                   |
| `vitest.d.ts`                       | Vitest global + jest-dom matcher types                                       |
| `.storybook/main.ts`                | Stories glob, addons, framework, Clerk mock alias                            |
| `.storybook/preview.ts`             | `nextjs.appDirectory`, axe `a11y.test: 'error'`, disabled landmark rules     |
| `.storybook/vitest.setup.ts`        | Wires Storybook preview + a11y addon into the Vitest browser run             |
| `.storybook/mocks/clerk-nextjs.tsx` | Stub for `@clerk/nextjs` so stories render without a session                 |
| `playwright.config.ts`              | E2E project; starts the prod server with dummy Clerk keys                    |
| `playwright.visual.config.ts`       | Visual project; serves static Storybook, screenshot settings                 |
| `.husky/pre-commit`                 | Pre-commit: `lint-staged` + `typecheck`                                      |
| `.github/workflows/ci.yml`          | The CI jobs (see [CI pipeline](./ci-pipeline.md))                            |

## Relevant environment variables

| Variable                                                | Used by                       | Purpose                                                                                                                         |
| ------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_E2E_BYPASS_CLERK`                          | build + `proxy.ts`            | Skip Clerk's dev-browser handshake so e2e pages render without a live backend. Build-time inlined. **Never set in production.** |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | e2e                           | Dummy keys so the app boots; set in `playwright.config.ts` / the e2e CI job                                                     |
| `PW_EXECUTABLE_PATH`                                    | `playwright.visual.config.ts` | Point Playwright at a pre-installed Chromium in constrained/offline environments                                                |
| `HUSKY=0`                                               | CI visual job                 | Skip git-hook install inside the container                                                                                      |
