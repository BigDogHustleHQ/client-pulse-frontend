import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import '../src/styles/auth.scss';

const preview: Preview = {
  parameters: {
    // Components use the App Router (`next/navigation`); without this the
    // router context isn't mounted and stories throw "expected app router
    // to be mounted".
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Fail the test run on any axe-core violation (SID-62: zero violations
    // on shipped components). Runs as part of every story in the Vitest job.
    a11y: {
      test: 'error',
      config: {
        rules: [
          // Components render in isolation (no page-level landmarks), so these
          // best-practice rules are false positives here. All WCAG A/AA rules,
          // including color-contrast, stay enabled.
          { id: 'region', enabled: false },
          { id: 'landmark-one-main', enabled: false },
        ],
      },
    },
  },
};

export default preview;
