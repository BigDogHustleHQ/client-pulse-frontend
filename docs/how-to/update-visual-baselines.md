# How to update visual baselines

> **Diátaxis: how-to.** Task-oriented. For background on why visual testing is
> self-hosted, see
> [Visual regression: services & trade-offs](../explanation/visual-regression-services.md).

Visual tests (`visual/storybook.visual.spec.ts`) screenshot Storybook stories
and compare them against committed PNG baselines in
`visual/storybook.visual.spec.ts-snapshots/`.

## The golden rule

**Screenshots differ across operating systems, fonts, and browser versions.**
A baseline made on your laptop will not match CI. Always generate/update
baselines in the **same environment CI uses**: the pinned Playwright Docker
image.

## Update baselines (the correct way)

After an _intended_ visual change (or to create the first baselines):

```bash
docker run --rm -v "$PWD":/work -w /work \
  mcr.microsoft.com/playwright:v1.60.0-noble \
  bash -c "npm ci && npm run build-storybook && npm run test:visual:update"
```

Then review and commit the changed PNGs:

```bash
git add visual/**/*-snapshots/
git commit -m "test(visual): update baselines for <what changed>"
```

## Don't have Docker? Let CI generate them

The `visual` CI job is **self-bootstrapping**:

1. On a branch with no committed baselines, it generates them, uploads them as
   the **`visual-snapshots`** artifact, and passes.
2. Download that artifact from the GitHub Actions run, unzip it into the repo,
   and commit `visual/**/*-snapshots/`.
3. From then on the job runs as a **blocking gate** — any unexpected pixel diff
   fails the PR.

## Quick local check (same OS only)

If you just want to see the mechanism work locally, you can compare on your own
machine (results won't match CI, so don't commit these):

```bash
npm run build-storybook
npm run test:visual:update   # writes local baselines
npm run test:visual          # should pass against them
```

## Adding a new story to the visual suite

Edit the `stories` array in `visual/storybook.visual.spec.ts` with the story id
(`title` slug + `--export`, e.g. `auth-loginform--default`), then regenerate
baselines using the Docker command above.

## Tuning sensitivity

`playwright.visual.config.ts` sets `maxDiffPixelRatio: 0.01` and
`animations: 'disabled'`. Raise the ratio if anti-aliasing causes flaky diffs;
lower it for stricter matching.
