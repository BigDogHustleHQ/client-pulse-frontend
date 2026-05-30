# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # start dev server (Turbopack, default in v16)
npm run build            # production build
npm run start            # start production server
npm run lint             # run ESLint directly (next lint no longer exists in v16)
npm run typecheck        # tsc --noEmit
npm run format           # format all files with Prettier
npm run format:check     # check formatting without writing
npm test                 # Vitest unit tests (jsdom)
npm run test:watch       # unit tests in watch mode
npm run test:coverage    # unit tests with coverage gate
npm run test:storybook   # run every story (play fns + axe) in a real browser
npm run test:e2e         # Playwright e2e smoke tests against the prod build
npm run storybook        # start Storybook dev server on :6006
npm run build-storybook  # build static Storybook
npm run chromatic        # publish Storybook to Chromatic (needs project token)
```

### Testing layout

- **Unit (Vitest + React Testing Library):** co-located `*.test.{ts,tsx}` next to source. Run one file: `npm test -- src/app/page.test.tsx`. Config is `vitest.config.ts`, which defines two projects — `unit` (jsdom) and `storybook` (browser). `npm test` targets `--project=unit`.
- **Coverage gate:** 80% lines on `src/components/**`, 90% on `src/store/**` (enforced in `vitest.config.ts`).
- **Storybook (`*.stories.tsx`, co-located):** the `@storybook/addon-vitest` project runs each story's play function and axe-core accessibility checks in headless Chromium. `a11y.test` is set to `error`, so any violation fails CI.
- **E2E (Playwright):** specs live in `e2e/`. `playwright.config.ts` builds and serves the app with dummy Clerk keys — no real secrets needed.
- **Pre-commit:** Husky runs `lint-staged` (eslint --fix + prettier) and `npm run typecheck`.
- **CI:** `.github/workflows/ci.yml` runs `unit`, `storybook-test`, and `e2e` on every PR, plus a `chromatic` visual-baseline job (needs the `CHROMATIC_PROJECT_TOKEN` repo secret).

## This is Next.js 16 — read before writing code

Next.js 16 has breaking changes from 15. Before touching routing, caching, or middleware, read the relevant guide in `node_modules/next/dist/docs/`. Key differences:

- **Turbopack is the default** for both `next dev` and `next build` — no flag needed.
- **`next lint` is removed.** Linting is now `eslint` (already in `package.json`). `next build` no longer runs lint.
- **`next/config` is removed.** No `serverRuntimeConfig` / `publicRuntimeConfig`. Use `process.env` in Server Components; prefix with `NEXT_PUBLIC_` for client-accessible values.
- **`middleware.ts` is renamed to `proxy.ts`** — the middleware file convention changed.
- **`experimental.dynamicIO` is renamed to `cacheComponents`** (top-level in `next.config.ts`).
- **AMP is fully removed.**
- For slow client-side navigations, `Suspense` alone is not enough — you must also export `unstable_instant` from the route. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.

## Architecture

App Router only (`src/app/`). No Pages Router.

```
src/
  app/
    layout.tsx      # root layout — Geist Sans + Geist Mono fonts, global CSS
    page.tsx        # root route
    globals.css     # Tailwind base styles
```

Path alias `@/*` maps to `src/*`.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5** — strict mode enabled
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **ESLint 9** flat config (`eslint.config.mjs`) — `eslint-config-next` core-web-vitals + TypeScript rules + `eslint-config-prettier`
- **Prettier** — single quotes, 2-space tabs (`.prettierrc`)
- **Vitest 4** + **React Testing Library** — `vitest.config.ts` (`unit` jsdom project + `storybook` browser project via `@storybook/nextjs-vite`); `vitest.setup.ts` loads `@testing-library/jest-dom`
- **Storybook 10** (`@storybook/nextjs-vite`) with **addon-a11y** (axe-core) and **addon-vitest** for story tests
- **Playwright** for e2e (`e2e/`, `playwright.config.ts`)
- **Chromatic** for visual regression baselines
- **Husky** + **lint-staged** pre-commit hooks (lint + typecheck)

## This project

ClientPulse frontend — an AI-driven operating system for local businesses (restaurants, retail, service providers). Deployed to Vercel. The Railway backend (WebSocket service, Workflow Engine, Integration Hub) is a separate repository.
