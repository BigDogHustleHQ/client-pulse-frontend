import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

// Dummy, correctly-formatted Clerk keys so the app boots in CI without real
// secrets. They point at a non-existent dev frontend API — Clerk's client
// script never loads, but every page still renders server-side, which is all
// the smoke suite needs. Real keys are never required for e2e.
const clerkEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk',
  CLERK_SECRET_KEY: 'sk_test_ZHVtbXlfc2VjcmV0X2tleV9mb3JfY2lfYnVpbGRzXw',
  // Skip Clerk's dev-browser handshake so pages render without a live backend.
  // This is inlined at BUILD time — build with it set:
  //   NEXT_PUBLIC_E2E_BYPASS_CLERK=true npm run build
  NEXT_PUBLIC_E2E_BYPASS_CLERK: 'true',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Assumes `next build` has already run (CI builds in a prior step).
    command: 'npm run start',
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...clerkEnv, PORT: String(PORT) },
  },
});
