# CLAUDE.md

Guidance for Claude Code working in this repo.

**ClientPulse frontend** — an AI-driven operating system for local businesses
(restaurants, retail, service providers). Deployed to Vercel; the Railway
backend (WebSocket service, Workflow Engine, Integration Hub) is a separate repo.

Topic rules live in `.claude/rules/` and load automatically — `nextjs.md` and
`architecture.md` always-on; the `testing/` rules (unit, storybook, e2e, visual)
scope to their own file types. See also `docs/testing.md` and
`docs/visual-regression.md`.

## UI & component library

Use **shadcn/ui** as the _only_ UI component library — do not add another
(MUI, Chakra, Mantine, Ant, etc.). shadcn components are generated with the
`shadcn` CLI into `src/components/ui/` and are built on Radix primitives +
Tailwind. Compose and extend these rather than hand-rolling equivalents.

Pieces used alongside shadcn:

- **Radix UI** (`radix-ui`) — headless primitives that shadcn is built on.
- **Tailwind CSS v4** — all styling. **tw-animate-css** for enter/keyframe
  animations; variants via **class-variance-authority** (`cva`); merge classes
  with the `cn()` helper (**clsx** + **tailwind-merge**) from `@/lib/utils`.
- **lucide-react** — icons.
- **Recharts** — data viz (`src/components/charts/`).
- **dnd-kit** (`@dnd-kit/*`) — drag-and-drop (`src/components/dnd/`).
- In-house **primitives** (`src/components/primitives/`) and **AI surfaces**
  (`src/components/ai/`) compose the above — reuse them before adding a new dep.
- **Storybook** — every component is foldered with a story per variant + tests.

Exception: the auth forms (`src/components/features/auth/`) use a BEM SCSS
stylesheet (`src/styles/auth.scss`, imported in `app/layout.tsx`) for the
`.auth*` / `.login*` layouts. This is the only place SCSS is used — don't
expand it; all new UI should be Tailwind + shadcn.

@AGENTS.md
