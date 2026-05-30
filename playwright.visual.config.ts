import { defineConfig, devices } from '@playwright/test';

// Visual regression for Storybook stories (Playwright + Storybook, self-hosted).
// Builds nothing itself — assumes `npm run build-storybook` has produced
// ./storybook-static — then serves it and screenshots each story's canvas.
//
// Baselines are committed PNGs (see ./visual/__screenshots__). They are
// render-environment specific, so generate/update them in the same environment
// CI uses — the official Playwright Docker image:
//
//   docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.60.0-noble \
//     bash -c "npm ci && npm run build-storybook && npm run test:visual:update"
//
// PW_EXECUTABLE_PATH lets constrained environments point at an already-present
// Chromium build (and tolerate a TLS-intercepting egress proxy); in CI it is
// unset and Playwright uses its managed browser over plain HTTP.
const PORT = Number(process.env.VISUAL_PORT ?? 6099);
const executablePath = process.env.PW_EXECUTABLE_PATH || undefined;
const localConstrained = Boolean(executablePath);

export default defineConfig({
  testDir: './visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Default snapshot location: visual/<spec>-snapshots/<name>-<project>-<platform>.png
  // Platform suffix matters — baselines must be generated on the CI platform.
  expect: {
    toHaveScreenshot: {
      // Small tolerance for sub-pixel anti-aliasing differences.
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ignoreHTTPSErrors: localConstrained || undefined,
    launchOptions: {
      // Disable the sandbox — CI runs inside a root Docker container.
      chromiumSandbox: false,
      ...(localConstrained
        ? {
            executablePath,
            args: [
              '--ignore-certificate-errors',
              '--disable-features=HttpsUpgrades,HttpsFirstBalancedModeAutoEnable,HttpsFirstModeV2',
            ],
          }
        : {}),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run serve-storybook',
    url: `http://127.0.0.1:${PORT}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
