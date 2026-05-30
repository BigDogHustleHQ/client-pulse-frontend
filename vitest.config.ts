import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookNextJsPlugin } from '@storybook/nextjs-vite/vite-plugin';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const dotStorybook = fileURLToPath(new URL('./.storybook', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  test: {
    projects: [
      // Unit tests (jsdom) — migrated from Jest + React Testing Library.
      {
        plugins: [storybookNextJsPlugin()],
        resolve: {
          alias: {
            '@': srcDir,
          },
        },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          // Force these through Vite's transform so the Next react alias
          // resolves to a file (externalized ESM hits a directory import).
          server: {
            deps: {
              inline: ['zustand', '@tanstack/react-query'],
            },
          },
        },
      },
      // Storybook tests (real browser via Playwright) — runs every story's
      // play function and axe-core accessibility checks (see .storybook/vitest.setup.ts).
      {
        plugins: [
          storybookNextJsPlugin(),
          storybookTest({ configDir: dotStorybook }),
        ],
        resolve: {
          alias: {
            '@': srcDir,
          },
        },
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.d.ts',
        'src/proxy.ts',
      ],
      // Coverage gate (SID-62): 80% lines on components/, 90% on state/ (store/).
      thresholds: {
        'src/components/**': {
          lines: 80,
        },
        'src/store/**': {
          lines: 90,
        },
      },
    },
  },
});
