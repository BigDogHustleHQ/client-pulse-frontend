import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

// Dummy Clerk keys so the app boots without real secrets. NEXT_PUBLIC_E2E_BYPASS_CLERK
// skips Clerk's dev-browser handshake (inlined at build time, so the build must set
// it too — the CI e2e job does). See docs/testing.md.
const clerkEnv = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk',
  CLERK_SECRET_KEY: 'sk_test_ZHVtbXlfc2VjcmV0X2tleV9mb3JfY2lfYnVpbGRzXw',
  NEXT_PUBLIC_E2E_BYPASS_CLERK: 'true',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run start',
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { ...clerkEnv, PORT: String(PORT) },
  },
});
