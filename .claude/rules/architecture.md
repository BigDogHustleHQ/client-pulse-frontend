# Architecture & stack

App Router only (`src/app/`) — no Pages Router. Path alias `@/*` → `src/*`.

```
src/
  app/        # routes; layout.tsx (Geist fonts, global CSS), page.tsx, globals.css
  components/ # React components
  store/      # Zustand state
```

Stack:

- **Next.js 16** (App Router) + **React 19**
- **TypeScript 5**, strict
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **ESLint 9** flat config (`eslint.config.mjs`) + **Prettier** (`.prettierrc`:
  single quotes, 2-space, semicolons, trailing commas)
- **Zustand** for state, **@tanstack/react-query** for server state, **Clerk** for auth
