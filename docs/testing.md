# Testing

Four layers, all wired into CI (`.github/workflows/ci.yml`):

| Layer         | What it checks                                | Tool                           |
| ------------- | --------------------------------------------- | ------------------------------ |
| **unit**      | Logic, components, store (jsdom)              | Vitest + React Testing Library |
| **storybook** | Each story renders, interacts, passes a11y    | Storybook + addon-vitest + axe |
| **e2e**       | Real pages load and route                     | Playwright                     |
| **visual**    | Stories haven't changed visually unexpectedly | Playwright screenshots         |

Tests are co-located with source (`*.test.tsx`, `*.stories.tsx`). Visual specs
live in `visual/`, e2e specs in `e2e/`.

## Commands

```bash
npm test                    # unit tests (jsdom)
npm run test:watch          # unit, watch mode
npm run test:coverage       # unit + coverage gate
npm run test:storybook      # stories: play fns + axe (needs a browser)
npm run test:e2e            # e2e smoke against the prod build
npm run test:visual         # visual diff vs committed baselines
npm run test:visual:update  # regenerate visual baselines
npm run storybook           # Storybook dev server on :6006

npm test -- src/app/page.test.tsx   # single unit file
```

A browser is needed for `test:storybook`, `test:e2e`, and `test:visual`:

```bash
npx playwright install chromium chromium-headless-shell
```

## Coverage gate

Per-path line thresholds (in `vitest.config.ts`): **80%** on
`src/components/**`, **90%** on `src/store/**`. A drop below either fails
`test:coverage` and the `unit` CI job. Tests, stories, `*.d.ts`, and
`src/proxy.ts` are excluded from coverage.

## Accessibility

`a11y.test: 'error'` in `.storybook/preview.ts` fails the build on any axe
violation. The layout-only rules `region` and `landmark-one-main` are disabled
(false positives for isolated components); everything else, including
colour-contrast, runs.

## Clerk in tests

Clerk needs no live backend in tests:

- **unit / storybook** — mocked (`vi.mock`; a Vite alias to
  `.storybook/mocks/clerk-nextjs.tsx`).
- **e2e** — the app boots for real, so a build-time flag
  `NEXT_PUBLIC_E2E_BYPASS_CLERK=true` skips Clerk's dev-browser handshake (which
  would otherwise redirect every navigation to an unreachable frontend API). The
  flag is CI-only — never set it in production.

To run e2e locally:

```bash
NEXT_PUBLIC_E2E_BYPASS_CLERK=true npm run build
npm run test:e2e
```

## Visual regression

`visual/storybook.visual.spec.ts` screenshots story canvases and diffs them
against PNG baselines in `visual/*-snapshots/`.

**Screenshots differ across OS/fonts/browser versions**, so always generate
baselines in the same image CI uses — the pinned Playwright Docker image:

```bash
docker run --rm -v "$PWD":/work -w /work \
  mcr.microsoft.com/playwright:v1.60.0-noble \
  bash -c "npm ci && npm run build-storybook && npm run test:visual:update"
git add visual/**/*-snapshots/ && git commit -m "test(visual): update baselines"
```

No Docker? The `visual` CI job is self-bootstrapping: on a branch with no
committed baselines it generates them, uploads the **`visual-snapshots`**
artifact, and passes. Download that artifact, commit
`visual/**/*-snapshots/`, and the job becomes a blocking pixel-diff gate.

Add a story to the visual suite by appending its id (`title` slug + `--export`,
e.g. `auth-loginform--default`) to the `stories` array in the spec, then
regenerate baselines.

Why self-hosted Playwright instead of a service like Chromatic — and how to
switch — is in [visual-regression.md](./visual-regression.md).

## CI

`unit`, `storybook-test`, `e2e`, and `visual` run on every PR. The `visual` job
runs inside `mcr.microsoft.com/playwright:v1.60.0-noble` so the browser matches
the baselines. Pre-commit (Husky + lint-staged) runs `eslint --fix`, `prettier`,
and `typecheck`; bypass in an emergency with `git commit --no-verify` (CI still
enforces everything).

Recommended branch protection: require `unit`, `storybook-test`, `e2e`. Make
`visual` required only after baselines are committed.
