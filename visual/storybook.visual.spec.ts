import { test, expect, type Page } from '@playwright/test';

// Story IDs to snapshot. Keep in sync with the *.stories.tsx titles/exports:
// title 'Auth/LoginForm' -> 'auth-loginform', export Default -> '--default'.
const stories = [
  'auth-loginform--default',
  'auth-loginform--password-visible',
  'auth-registrationform--default',
];

async function gotoStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  // Storybook signals a finished render on the root element.
  await page.waitForSelector('#storybook-root', { state: 'attached' });
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
  // Settle fonts/icons so screenshots are stable.
  await page.evaluate(() => document.fonts.ready);
}

for (const id of stories) {
  test(`visual: ${id}`, async ({ page }) => {
    await gotoStory(page, id);
    await expect(page.locator('#storybook-root')).toHaveScreenshot(`${id}.png`);
  });
}
