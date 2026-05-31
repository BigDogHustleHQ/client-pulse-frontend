import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers';

// Desktop TopBar chrome contract (default 1280px viewport). The shell wraps
// every (app) route; here we prove the wider search field, the notifications
// dropdown (+ "Mark all as read"), and the profile dropdown (+ Settings) all
// work, and that the desktop SideNav rail stays visible at lg+.
test.describe('shell: TopBar chrome (desktop)', () => {
  test('the wider search field is visible in the TopBar', async ({ page }) => {
    await gotoPage(page, 'today');

    const search = page.locator('[data-slot="topbar-search"]');
    await expect(search).toBeVisible();
    // The desktop search is the wide variant (w-72), not the old icon button.
    const box = await search.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
  });

  test('the SideNav rail is visible at desktop width', async ({ page }) => {
    await gotoPage(page, 'today');
    await expect(page.locator('[data-slot="side-nav"]')).toBeVisible();
  });

  test('clicking the bell opens notifications with a sample item and "Mark all as read"', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    await page.getByRole('button', { name: 'Notifications' }).click();

    const menu = page.locator('[data-slot="notifications-menu"]');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText('Notifications');
    await expect(menu).toContainText('New 4★ Google review');
    await expect(
      menu.getByRole('menuitem', { name: 'Mark all as read' }),
    ).toBeVisible();
  });

  test('"Mark all as read" clears the notification badge count', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const bell = page.getByRole('button', { name: 'Notifications' });
    // The badge starts at 3 (NOTIFICATIONS.length) inside the bell button.
    await expect(bell.locator('[data-slot="badge"]')).toHaveText('3');

    await bell.click();
    await page
      .locator('[data-slot="notifications-menu"]')
      .getByRole('menuitem', { name: 'Mark all as read' })
      .click();

    // Badge is removed once unread hits 0.
    await expect(bell.locator('[data-slot="badge"]')).toHaveCount(0);
  });

  test('clicking the profile button opens the profile menu with a Settings item', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    await page.getByRole('button', { name: 'Account' }).click();

    const menu = page.locator('[data-slot="profile-menu"]');
    await expect(menu).toBeVisible();
    await expect(menu).toContainText("Bella's Bistro");

    const settings = menu.getByRole('menuitem', { name: 'Settings' });
    await expect(settings).toBeVisible();
    await expect(settings).toHaveAttribute('href', '/settings');

    await settings.click();
    await expect(page).toHaveURL(/\/settings$/);
  });
});
