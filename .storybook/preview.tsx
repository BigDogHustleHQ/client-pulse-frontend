import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

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
    a11y: {
      test: 'todo',
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
