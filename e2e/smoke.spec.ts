import { test, expect } from '@playwright/test';
import { NAV, topBarHeading } from './helpers';

// Harness sanity check: every product route loads, renders its TopBar label,
// and clears the loading spinner. Proves the webServer + baseURL wiring works
// before the behavior suites run.
test.describe('smoke: all routes render', () => {
  for (const item of NAV) {
    test(`${item.href} renders the ${item.label} shell`, async ({ page }) => {
      await page.goto(item.href);
      await expect(topBarHeading(page)).toHaveText(item.label);
      await expect(page.locator('main h2').first()).toBeVisible();
      await expect(page.locator('[data-slot="side-nav"]')).toBeVisible();
    });
  }
});
