import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookNextJsPlugin } from '@storybook/nextjs-vite/vite-plugin';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };
const dotStorybook = fileURLToPath(new URL('./.storybook', import.meta.url));

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      // Unit tests (jsdom). `inline` forces these through Vite so the Next
      // react alias resolves to a file (externalized ESM hits a dir import).
      {
        plugins: [storybookNextJsPlugin()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          // Inline all deps so Vite resolves the Next react alias to a file.
          // Externalized ESM (radix-ui / @floating-ui and their transitive
          // tree, used by the shadcn primitives) otherwise hits an unsupported
          // directory import of `next/dist/compiled/react`. `true` avoids
          // enumerating the whole dependency tree.
          server: { deps: { inline: true } },
        },
      },
      // Storybook tests in a real browser: each story's play fn + axe a11y.
      {
        plugins: [
          storybookNextJsPlugin(),
          storybookTest({ configDir: dotStorybook }),
        ],
        resolve: { alias },
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
    // Coverage gate (SID-62): 80% lines on components/, 90% on store/.
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
      thresholds: {
        'src/components/**': { lines: 80 },
        'src/store/**': { lines: 90 },
      },
    },
  },
});
