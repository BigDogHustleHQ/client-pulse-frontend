# Tutorial: Add a Storybook story

> **Diátaxis: tutorial.** Learning-oriented. You'll add a story and watch it be
> tested — for behaviour and accessibility — automatically.

A `*.stories.tsx` file is both living documentation _and_ a test: the Storybook
Vitest project runs each story's `play` function and axe-core accessibility
checks in a real browser.

## Prerequisites

- `npm ci`
- The component from [the unit-test tutorial](./01-write-your-first-unit-test.md)
  (`Greeting`), or any component of your own.

## 1. Create the story

Co-locate it: `src/components/ui/Greeting/Greeting.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import Greeting from './Greeting';

const meta = {
  title: 'UI/Greeting',
  component: Greeting,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Greeting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Sam' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Hello, Sam!')).toBeInTheDocument();
  },
};
```

## 2. See it in Storybook

```bash
npm run storybook
```

Open <http://localhost:6006>. Your story appears under **UI → Greeting**. The
**Accessibility** tab shows the live axe-core report.

## 3. Run it as a test

This is the same thing CI's `storybook-test` job runs:

```bash
npm run test:storybook
```

It launches headless Chromium, runs every `play` function, and runs axe. If a
story has an accessibility violation, the run **fails** — `a11y.test` is set to
`error` in `.storybook/preview.ts`.

> Components render in isolation, so the layout-level `region` and
> `landmark-one-main` axe rules are disabled (they'd be false positives). Every
> other WCAG A/AA rule — including colour-contrast — stays on.

## 4. (Optional) capture it visually

If you want pixel-level regression coverage too, add the story id to
`visual/storybook.visual.spec.ts` and follow
[Update visual baselines](../how-to/update-visual-baselines.md).

## What you learned

- Stories are co-located and double as behaviour + a11y tests.
- `npm run test:storybook` is the local mirror of CI.
- Accessibility violations fail the build by design.

**Next:** [Run the test suites](../how-to/run-the-test-suites.md) for the full
command set.
