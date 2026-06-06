import { defineConfig, devices } from '@playwright/test';

// Visual regression for Storybook stories. Serves the prebuilt ./storybook-static
// (run `npm run build-storybook` first) and screenshots each story canvas against
// committed baselines. Baselines are render-environment specific — regenerate them
// in the pinned Playwright Docker image (see docs/testing.md).
const PORT = 6099;

export default defineConfig({
  testDir: './visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // CI runs as root in a container, where the Chromium sandbox can't start.
    launchOptions: { chromiumSandbox: false },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run serve-storybook',
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
