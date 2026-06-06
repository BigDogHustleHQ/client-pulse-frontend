import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const clerkMock = path.resolve(dirname, './mocks/clerk-nextjs.tsx');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      '@': path.resolve(dirname, '../src'),
      // Components pull Clerk hooks at module load; stub them so stories render
      // without a real Clerk session. Applies to both the Storybook build and
      // the Vitest browser test run.
      '@clerk/nextjs': clerkMock,
    };
    return viteConfig;
  },
};

export default config;
