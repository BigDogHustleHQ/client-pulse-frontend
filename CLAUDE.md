# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # start dev server (Turbopack, default in v16)
npm run build            # production build
npm run start            # start production server
npm run lint             # run ESLint directly (next lint no longer exists in v16)
npm run format           # format all files with Prettier
npm run format:check     # check formatting without writing
npm test                 # run all tests
npm run test:watch       # run tests in watch mode
npm run test:coverage    # run tests with coverage report
```

Tests are co-located next to their source files (e.g. `src/app/page.test.tsx`). To run a single test file: `npm test -- src/app/page.test.tsx`.

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
- **Jest 30** + **React Testing Library** — `jest.config.ts` uses `next/jest` transformer; `jest.setup.ts` loads `@testing-library/jest-dom`

## This project

ClientPulse frontend — an AI-driven operating system for local businesses (restaurants, retail, service providers). Deployed to Vercel. The Railway backend (WebSocket service, Workflow Engine, Integration Hub) is a separate repository.
