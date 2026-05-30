# ClientPulse frontend docs

These docs follow the [Diátaxis](https://diataxis.fr/) framework, which splits
documentation into four modes based on what you need _right now_:

| Mode              | When you reach for it                              | Folder                           |
| ----------------- | -------------------------------------------------- | -------------------------------- |
| **Tutorials**     | You're learning — take me through it step by step  | [`tutorials/`](./tutorials/)     |
| **How-to guides** | You have a task — show me the steps to get it done | [`how-to/`](./how-to/)           |
| **Reference**     | You need facts — commands, config, exact behaviour | [`reference/`](./reference/)     |
| **Explanation**   | You want understanding — why is it built this way  | [`explanation/`](./explanation/) |

## Start here

- New to the test setup? Begin with the tutorials:
  - [Write your first unit test](./tutorials/01-write-your-first-unit-test.md)
  - [Add a Storybook story](./tutorials/02-add-a-storybook-story.md)
- Need to get something done?
  - [Run the test suites](./how-to/run-the-test-suites.md)
  - [Update visual baselines](./how-to/update-visual-baselines.md)
  - [Set up Chromatic](./how-to/set-up-chromatic.md)
- Want the facts?
  - [Test commands](./reference/test-commands.md) · [CI pipeline](./reference/ci-pipeline.md) · [Coverage gates](./reference/coverage-gates.md)
- Want the _why_?
  - [Testing strategy](./explanation/testing-strategy.md)
  - [Visual regression: services & trade-offs](./explanation/visual-regression-services.md)

## The short version

The repo tests at four levels, each wired into CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)):

1. **Unit** — Vitest + React Testing Library (jsdom), with a coverage gate.
2. **Storybook** — every story's play function + axe-core a11y, in a real browser.
3. **E2E** — Playwright smoke tests against the production build.
4. **Visual** — Playwright screenshots of Storybook stories, diffed against baselines.

Visual regression is **self-hosted** (Playwright + Storybook) — no external
service. A hosted option (Chromatic) is documented but deferred; see
[Visual regression: services & trade-offs](./explanation/visual-regression-services.md).
