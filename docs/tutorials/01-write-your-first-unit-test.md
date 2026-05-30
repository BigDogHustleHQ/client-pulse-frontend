# Tutorial: Write your first unit test

> **Diátaxis: tutorial.** A guided, learning-oriented walk-through. Follow it
> top to bottom; you'll end with a passing test and an understanding of the
> moving parts.

By the end you'll have written and run a Vitest + React Testing Library test
for a small component.

## Prerequisites

- Dependencies installed: `npm ci`
- Nothing else — unit tests run in jsdom, no browser needed.

## 1. Create a component

Create `src/components/ui/Greeting/Greeting.tsx`:

```tsx
export default function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}
```

## 2. Write the test next to it

Tests are **co-located** with their source. Create
`src/components/ui/Greeting/Greeting.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

describe('Greeting', () => {
  it('greets the person by name', () => {
    render(<Greeting name="Sam" />);
    expect(screen.getByText('Hello, Sam!')).toBeInTheDocument();
  });
});
```

Two things to notice:

- `describe`/`it`/`expect` are **globals** — no imports needed. This is
  configured in `vitest.config.ts` (`globals: true`) with types in
  `vitest.d.ts`.
- `toBeInTheDocument()` comes from `@testing-library/jest-dom`, loaded once in
  `vitest.setup.ts`.

## 3. Run it

```bash
npm test -- src/components/ui/Greeting/Greeting.test.tsx
```

You should see `1 passed`. Drop the path to run the whole unit suite:

```bash
npm test
```

## 4. See it in the coverage gate

`src/components/**` must keep **80% line coverage** (`src/store/**` needs 90%).
Check where you stand:

```bash
npm run test:coverage
```

If a component under those paths dips below its threshold, the command — and CI
— fail. See [Coverage gates](../reference/coverage-gates.md).

## What you learned

- Tests live beside the code as `*.test.tsx`.
- Globals + jest-dom matchers are pre-wired.
- Coverage on `components/` and `store/` is enforced.

**Next:** [Add a Storybook story](./02-add-a-storybook-story.md) to test the same
component visually and for accessibility.
