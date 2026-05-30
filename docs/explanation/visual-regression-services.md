# Explanation: visual regression services & trade-offs

> **Diátaxis: explanation.** Understanding-oriented. The landscape of visual
> regression options, what Chromatic does, and why this repo uses self-hosted
> Playwright for now. For setup steps see
> [Set up Chromatic](../how-to/set-up-chromatic.md) and
> [Update visual baselines](../how-to/update-visual-baselines.md).

## What "visual regression" means

Render a component/page, take a screenshot, and compare it pixel-by-pixel
against a previously accepted **baseline**. If pixels changed, flag it for a
human to accept (intended) or reject (a bug). It catches the things assertions
miss: a shifted button, a broken layout, a colour that regressed, a font that
failed to load.

## The two families

### Hosted services (render + store + review in the cloud)

You push your built Storybook (or screenshots); the service renders, stores
baselines, runs the diff on consistent infra, and gives you a review UI.

- **Chromatic** — built by the Storybook team; deepest Storybook integration.
- **Percy** (BrowserStack) — multi-framework, mature.
- **Argos CI** — Playwright/Cypress-friendly, good GitHub PR integration, generous free/OSS-friendly tier.
- **Lost Pixel (Platform)** — hosted tier on top of the OSS runner.

**Pros:** consistent rendering (their machines, not yours), no baseline files in
your repo, review/approve UI, cross-browser/viewport matrices, history.
**Cons:** third-party account + token (a secret), usage-based pricing
(snapshots), data leaves your infra.

### Self-hosted / open-source (you run it, baselines in git)

- **Playwright `toHaveScreenshot()`** — what this repo uses. Screenshot + diff
  built into the test runner we already have.
- **Loki** — Storybook-specific, renders stories in Docker and diffs.
- **reg-suit** + **storycap** — captures stories, stores baselines in your own
  S3/GCS, posts diff reports to PRs.
- **BackstopJS** — scenario/URL-driven, not Storybook-tied.
- **jest-image-snapshot** — pixel diffing primitive for custom setups.

**Pros:** free, no account/secret, data stays in your repo/infra, full control.
**Cons:** _you_ own rendering consistency. Fonts and anti-aliasing differ
between machines, so baselines must be generated in a fixed environment (a Docker
image); baseline PNGs live in git; no built-in review UI (the PR diff is it).

## What Chromatic specifically does

1. On each run it builds your Storybook and uploads it.
2. It renders **every story** in cloud browsers at configured viewports and
   captures a snapshot per story × browser × viewport.
3. It diffs each snapshot against the project's accepted baseline and surfaces
   only what changed in a web review UI.
4. You **accept** (snapshot becomes the new baseline) or **reject**. Accepting is
   how the baseline evolves — there are no baseline files in your repo.
5. It also hosts the published Storybook for each commit (handy for review) and
   can drive **TurboSnap** (only re-snapshot stories affected by a change) to cut
   snapshot usage.

The unit of billing is the **snapshot** (story × browser × viewport per run), so
cost scales with how many stories you have and how broad your matrix is.

## How they compare for this repo

|                         | Playwright (current)           | Chromatic                    | Percy / Argos                |
| ----------------------- | ------------------------------ | ---------------------------- | ---------------------------- |
| Cost                    | Free                           | Free tier, then per-snapshot | Free tier, then per-snapshot |
| External account/secret | No                             | Yes                          | Yes                          |
| Rendering consistency   | You pin a Docker image         | Handled                      | Handled                      |
| Baselines               | PNGs in git                    | Stored by service            | Stored by service            |
| Review/approve UI       | PR diff only                   | Rich UI                      | Rich UI                      |
| Cross-browser matrix    | DIY                            | Built-in                     | Built-in                     |
| Storybook integration   | Manual (we screenshot iframes) | Native                       | Good                         |

## Why we chose self-hosted Playwright (for now)

- **Already in the stack** — e2e uses Playwright; the visual job reuses it. No new
  vendor, no token, nothing to provision.
- **Self-contained CI** — keeps the pipeline green on a fresh repo with no
  external dependencies, matching the "set up the floor early" goal.
- **Free and private** — no per-snapshot billing; screenshots never leave CI.

The accepted trade-offs: we pin the Playwright Docker image so renders are
deterministic, baseline PNGs live in git, and "review" is reading the diff on the
failed CI run rather than a polished web UI.

## When to revisit a hosted service

Adopt Chromatic/Percy/Argos when any of these start to hurt:

- You want a **proper accept/reject review UI** for visual changes.
- You need a **cross-browser/viewport matrix** (Safari/Firefox/mobile).
- Baseline **PNGs in git** become noisy, or cross-environment flakiness grows.
- The component library grows and you want **TurboSnap**-style affected-only runs.

Migration is incremental: keep the Playwright job and add Chromatic alongside, or
replace the job once the hosted baseline is trusted. See
[Set up Chromatic](../how-to/set-up-chromatic.md).
