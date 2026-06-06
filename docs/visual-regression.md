# Visual regression: why Playwright, and how to switch to Chromatic

Visual regression renders a story, screenshots it, and diffs against an accepted
**baseline** — catching what assertions miss (a shifted button, broken layout,
regressed colour, a font that failed to load).

This repo does it **self-hosted with Playwright** (`playwright.visual.config.ts`,
`visual/`). For how to run and update baselines, see [testing.md](./testing.md).

## Self-hosted vs hosted

|                         | Playwright (current)      | Chromatic / Percy / Argos    |
| ----------------------- | ------------------------- | ---------------------------- |
| Cost                    | Free                      | Free tier, then per-snapshot |
| External account/secret | No                        | Yes                          |
| Rendering consistency   | You pin a Docker image    | Handled for you              |
| Baselines               | PNGs in git               | Stored by the service        |
| Review UI               | The PR diff / CI artifact | Rich accept/reject UI        |
| Cross-browser matrix    | DIY                       | Built-in                     |

We chose Playwright because it's already in the stack (e2e uses it), needs no
account or secret, and keeps CI self-contained and free. The trade-off: we pin a
Docker image for deterministic renders, baseline PNGs live in git, and "review"
is reading the diff rather than a polished UI.

**Revisit a hosted service when** you want a real accept/reject review UI, need a
cross-browser/viewport matrix, or baseline PNGs in git get noisy.

## What Chromatic does

Builds your Storybook in the cloud, screenshots every story across
browsers/viewports, and diffs against the accepted baseline. You accept or reject
changes in its web UI; accepted snapshots become the new baseline (none live in
your repo). It also hosts a published Storybook per commit and can use
**TurboSnap** to only re-snapshot affected stories. Billing is per **snapshot**
(story × browser × viewport per run) — tiny for this repo's handful of stories.
Current limits: <https://www.chromatic.com/pricing>.

## How to set up Chromatic

1. Sign in at <https://www.chromatic.com> with GitHub, **Add project** →
   `BigDogHustleHQ/client-pulse-frontend`, copy the **project token**.
2. Repo → **Settings → Secrets and variables → Actions** → add
   `CHROMATIC_PROJECT_TOKEN` with that value.
3. `npm install -D chromatic`
4. Add a CI job (Chromatic needs full history, hence `fetch-depth: 0`):

   ```yaml
   chromatic:
     name: chromatic
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
         with: { fetch-depth: 0 }
       - uses: actions/setup-node@v4
         with: { node-version-file: .nvmrc, cache: npm }
       - run: npm ci
       - uses: chromaui/action@latest
         with:
           projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
           exitZeroOnChanges: true
   ```

   `exitZeroOnChanges: true` means visual changes don't fail CI — Chromatic's UI
   is the gate. Drop it to make CI red on any unreviewed change.

5. Push a PR; the first run captures the baseline. You can then add Chromatic
   alongside the Playwright job, or remove the Playwright `visual` job once you
   trust the hosted baseline.
