import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';
import '../src/styles/auth.scss';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    nextjs: {
      // Mount the Next.js App Router context so components using
      // next/navigation hooks (useRouter, etc.) render in Storybook.
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Fail the test run on any axe-core violation (SID-62: zero violations on
    // shipped components). Runs as part of every story in the Vitest job.
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
  globalTypes: {
    theme: {
      description: 'ClientPulse color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? 'light';
      return (
        <div
          className={`${theme === 'dark' ? 'dark ' : ''}bg-background text-foreground font-sans`}
          style={{ padding: '2.5rem', minWidth: '32rem' }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
