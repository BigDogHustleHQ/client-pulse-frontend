# Reference: CI pipeline

> **Diátaxis: reference.** What runs in CI, in what environment, and what makes
> it pass or fail. Source: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

CI runs on every pull request and on pushes to `main`. Four jobs run in
parallel.

## `unit`

- **Runner:** `ubuntu-latest`, Node from `.nvmrc`.
- **Steps:** `npm ci` → `lint` → `typecheck` → `format:check` → `test:coverage`.
- **Fails when:** lint/type/format errors, a failing unit test, or coverage
  below the gate (see [Coverage gates](./coverage-gates.md)).

## `storybook-test`

- **Runner:** `ubuntu-latest`; installs `chromium` + `chromium-headless-shell`.
- **Steps:** `npm ci` → `playwright install` → `test:storybook`.
- **What it does:** runs every story's `play` function and axe-core checks in
  headless Chromium via `@storybook/addon-vitest`.
- **Fails when:** a play assertion fails or axe reports any violation
  (`a11y.test: 'error'`).

## `e2e`

- **Runner:** `ubuntu-latest`; installs `chromium` + `chromium-headless-shell`.
- **Env:** dummy Clerk keys + `NEXT_PUBLIC_E2E_BYPASS_CLERK=true`.
- **Steps:** `npm ci` → `playwright install` → `build` → `test:e2e` → upload
  `playwright-report` artifact.
- **Why the bypass:** a dev Clerk instance redirects every browser navigation to
  its frontend-API "dev-browser handshake", which can't complete without a live
  backend, so pages never render. The build-time flag (`src/proxy.ts`) lets
  requests through. It is set **only** in this job.
- **Fails when:** a smoke assertion fails.

## `visual`

- **Runner:** `ubuntu-latest` inside the pinned
  `mcr.microsoft.com/playwright:v1.60.0-noble` container (browser matches the
  baselines). `HUSKY=0`.
- **Steps:** `npm ci` → `build-storybook` → baseline check → run → upload
  `visual-snapshots` artifact.
- **Self-bootstrapping behaviour:**
  - **No committed baselines:** generates them (`test:visual:update`), uploads
    the artifact, and **passes** (a `::notice::` tells you to commit them).
  - **Baselines committed:** runs `test:visual` as a **blocking gate** — any
    unexpected pixel diff fails the PR.
- See [Update visual baselines](../how-to/update-visual-baselines.md).

## Concurrency

In-flight runs for the same ref are cancelled when a new commit is pushed
(`concurrency` block), so only the latest commit's CI matters.

## Branch protection (recommended)

Mark `unit`, `storybook-test`, and `e2e` as required status checks. Make
`visual` required only **after** baselines are committed (until then it
intentionally passes without gating).
