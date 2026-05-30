# Reference: coverage gates

> **Diátaxis: reference.** Exact thresholds and how they're enforced. Configured
> in [`vitest.config.ts`](../../vitest.config.ts).

## Thresholds

| Path                | Metric | Threshold |
| ------------------- | ------ | --------- |
| `src/components/**` | lines  | **80%**   |
| `src/store/**`      | lines  | **90%**   |

These are **per-path** thresholds (Vitest glob thresholds), not a global number.
A drop below either fails `npm run test:coverage` and the `unit` CI job.

## What counts

Coverage is collected from `src/**/*.{ts,tsx}` (v8 provider) with these
excluded:

- `src/**/*.test.{ts,tsx}` — tests themselves
- `src/**/*.stories.{ts,tsx}` — stories
- `src/**/*.d.ts` — type declarations
- `src/proxy.ts` — middleware (exercised by e2e, not unit)

Files outside the gated globs (e.g. `src/app/**`, `src/providers/**`) are still
reported but not gated.

## Running it

```bash
npm run test:coverage
```

The terminal prints a per-file table; an HTML report is written to `coverage/`
(git-ignored). On failure you'll see a line like:

```
ERROR: Coverage for lines (78%) does not meet "src/components/**" threshold (80%)
```

## Adjusting the gate

Edit `coverage.thresholds` in `vitest.config.ts`. Prefer raising thresholds over
lowering them; if you must exclude a file from coverage, add it to
`coverage.exclude` with a comment explaining why.
