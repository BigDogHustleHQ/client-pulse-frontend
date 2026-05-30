# Explanation: testing strategy

> **Diátaxis: explanation.** Understanding-oriented. The reasoning behind the
> test setup — no step-by-step here.

## The shape: a pyramid, not an ice-cream cone

We lean on many fast, cheap tests and fewer slow, broad ones:

```
        /\        visual  — a few story screenshots (slowest, most brittle)
       /  \       e2e     — a handful of smoke flows in a real browser
      /----\      storybook — every component story: behaviour + a11y
     /------\     unit    — the bulk: logic, components, store (jsdom, milliseconds)
```

Each layer answers a different question, so they complement rather than
duplicate each other:

| Layer     | Question it answers                                   | Tool                           |
| --------- | ----------------------------------------------------- | ------------------------------ |
| Unit      | Does this function/component behave correctly?        | Vitest + RTL (jsdom)           |
| Storybook | Does this component render, interact, and meet a11y?  | Storybook + addon-vitest + axe |
| E2E       | Do the real pages load and route end to end?          | Playwright                     |
| Visual    | Did anything change _visually_ that we didn't intend? | Playwright screenshots         |

## Why set this up on a near-empty repo

Wiring CI when there are five files is minutes of work; retrofitting it onto 200
files is painful and the gaps never get backfilled. Establishing the gate now
means every future change is linted, type-checked, tested, and covered before
merge — the cost is paid once.

## Why these tools

- **Vitest over Jest** — shares Vite's transform pipeline, so unit tests and the
  Storybook browser tests run through one toolchain and one config file.
- **Storybook + addon-vitest + addon-a11y** — stories are written once and reused
  as behaviour tests _and_ accessibility tests. `a11y.test: 'error'` turns
  accessibility from a nice-to-have into a build gate. This already paid off: it
  caught a real colour-contrast failure on the auth links during setup.
- **Playwright for e2e** — runs the actual production build in a real browser, so
  routing, middleware, and SSR are exercised, not mocked.
- **Playwright for visual** — reuses the browser we already have; baselines live
  in git; no third-party account. See
  [Visual regression: services & trade-offs](./visual-regression-services.md).

## Accessibility as a first-class gate

Components render in isolation in Storybook, so two layout-level axe rules
(`region`, `landmark-one-main`) are disabled — they assume a full page and would
be false positives. Everything else, including colour-contrast, runs and fails
the build on violation. The goal is **zero violations on shipped components**.

## Handling third-party auth (Clerk) in tests

Clerk is the one dependency that resists testing without a live backend:

- **Unit/Storybook:** Clerk is mocked (`vi.mock` in unit tests; a Vite alias to
  `.storybook/mocks/clerk-nextjs.tsx` in Storybook), so components render with no
  network.
- **E2E:** the app actually boots, so a build-time flag
  (`NEXT_PUBLIC_E2E_BYPASS_CLERK`) skips Clerk's dev-browser handshake, which
  otherwise redirects every navigation to an unreachable frontend API. The flag
  is CI-only and never set in production.

## What we deliberately deferred

External/hosted services (e.g. Chromatic for visual review) are documented but
not adopted, to keep CI self-contained and free of external accounts and
secrets. The door is open — see [Set up Chromatic](../how-to/set-up-chromatic.md).
