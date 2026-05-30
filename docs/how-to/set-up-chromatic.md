# How to set up Chromatic

> **Diátaxis: how-to.** Task-oriented steps to adopt Chromatic _if and when_ you
> want a hosted visual-review service. For what Chromatic is and how it compares
> to the self-hosted Playwright setup we currently use, read
> [Visual regression: services & trade-offs](../explanation/visual-regression-services.md).

**Status in this repo:** not installed. Visual regression is currently
self-hosted (Playwright + Storybook). This guide adds Chromatic _alongside or
instead of_ that.

## What you get

Chromatic builds your Storybook in the cloud, screenshots every story across
browsers/viewports, and diffs them against an accepted **baseline**. Changes are
surfaced in a review UI where a human accepts or rejects them; accepted snapshots
become the new baseline. It also hosts your published Storybook per-commit.

## 1. Create a Chromatic project

1. Sign in at <https://www.chromatic.com> with GitHub.
2. **Add project** → choose `BigDogHustleHQ/client-pulse-frontend`.
3. Copy the **project token** it shows (looks like `chpt_xxxxxxxxxxxx`).

## 2. Store the token as a GitHub secret

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

- **Name:** `CHROMATIC_PROJECT_TOKEN`
- **Value:** the token from step 1

The token is a write credential — keep it in Actions secrets, never in the repo.

## 3. Add the dependency and script

```bash
npm install -D chromatic
```

```jsonc
// package.json → "scripts"
"chromatic": "chromatic --exit-zero-on-changes"
```

`--exit-zero-on-changes` means "visual changes don't fail the job" — Chromatic's
review UI is the gate instead of CI. Drop the flag if you want CI to go red on
any unreviewed change.

## 4. Add a CI job

Add to `.github/workflows/ci.yml`. Chromatic needs full git history for
baselining, hence `fetch-depth: 0`:

```yaml
chromatic:
  name: chromatic
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        fetch-depth: 0
    - uses: actions/setup-node@v4
      with:
        node-version-file: .nvmrc
        cache: npm
    - run: npm ci
    - uses: chromaui/action@latest
      with:
        projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
        exitZeroOnChanges: true
```

> Tip: if the secret may be missing (e.g. on forks), guard the publish step with
> `if: ${{ env.CHROMATIC_PROJECT_TOKEN != '' }}` and an `env:` mapping so the job
> stays green until the token is configured.

## 5. Capture the baseline

Push the branch and open a PR. The first Chromatic run records the baseline
("the empty shell"). Every later PR diffs against it; review changes at
chromatic.com.

## Cost

Chromatic has a free tier billed by **snapshots** (stories × browsers ×
viewports per run). This repo has ~5 stories, so usage is tiny. Confirm current
limits at <https://www.chromatic.com/pricing>.

## If you'd rather not use a hosted service

Stick with the built-in Playwright visual job — see
[Update visual baselines](./update-visual-baselines.md). The
[services comparison](../explanation/visual-regression-services.md) lays out the
trade-offs.
