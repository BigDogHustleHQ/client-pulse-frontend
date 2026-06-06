# Next.js 16 — read before writing code

This is **not** the Next.js in your training data. APIs, conventions, and file
structure changed. Before touching routing, caching, or middleware, read the
relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

Breaking changes from 15:

- **Turbopack is the default** for `next dev` and `next build` — no flag.
- **`next lint` is removed** — lint with `eslint`; `next build` no longer lints.
- **`next/config` is removed** — no `serverRuntimeConfig` / `publicRuntimeConfig`.
  Use `process.env`; prefix `NEXT_PUBLIC_` for client-accessible values.
- **`middleware.ts` → `proxy.ts`** — the middleware file convention changed.
- **`experimental.dynamicIO` → `cacheComponents`** (top-level in `next.config.ts`).
- **AMP is fully removed.**
- Slow client navigations need `unstable_instant` exported from the route, not
  just `Suspense`. See `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
