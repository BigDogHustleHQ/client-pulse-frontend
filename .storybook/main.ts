import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const clerkMock = fileURLToPath(
  new URL('./mocks/clerk-nextjs.tsx', import.meta.url),
);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      // Components pull Clerk hooks at module load; stub them so stories render
      // without a real Clerk session. Applies to both the Storybook build and
      // the Vitest browser test run.
      '@clerk/nextjs': clerkMock,
    };
    return viteConfig;
  },
};

export default config;
