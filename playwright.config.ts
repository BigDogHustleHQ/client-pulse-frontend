import { defineConfig, devices } from '@playwright/test';

// E2E config for the ClientPulse frontend (Next.js 16 / Turbopack).
//
// The (app) pages and /api/mock/* are excluded from Clerk middleware during the
// mock phase (see src/proxy.ts), so e2e runs hit them directly with no auth.
// Jest is told to ignore this ./e2e dir (jest.config.ts testPathIgnorePatterns)
// because Jest's default testMatch would otherwise try to run *.spec.ts here.
const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // 'list' for live CLI feedback; HTML report written but never auto-opened
  // (auto-open would hang a non-interactive run).
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Reuse the already-running dev server locally; start a fresh one in CI.
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
