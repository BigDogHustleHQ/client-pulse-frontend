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

  test('clicking a notification navigates to its route and closes the menu', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const bell = page.getByRole('button', { name: 'Notifications' });
    await bell.click();

    const menu = page.locator('[data-slot="notifications-menu"]');
    await expect(menu).toBeVisible();

    // Click the review notification — should navigate to /inbox
    await menu.getByRole('menuitem', { name: 'New 4★ Google review' }).click();

    await expect(page).toHaveURL(/\/inbox/);
    // Menu is closed after navigation.
    await expect(menu).toHaveCount(0);
  });

  test('clicking a notification decrements the unread badge', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const bell = page.getByRole('button', { name: 'Notifications' });
    await expect(bell.locator('[data-slot="badge"]')).toHaveText('3');

    await bell.click();

    const menu = page.locator('[data-slot="notifications-menu"]');
    // Click "Reservation request" notification
    await menu.getByRole('menuitem', { name: 'Reservation request' }).click();

    // Badge should now show 2.
    await expect(bell.locator('[data-slot="badge"]')).toHaveText('2');
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

// SideNav collapse toggle contract (desktop only).
test.describe('shell: SideNav collapse toggle', () => {
  test('toggle collapses the sidebar to a rail and all links remain accessible', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const sidenav = page.locator('[data-slot="side-nav"]');
    await expect(sidenav).toBeVisible();

    // Sidebar starts expanded — visible label text for a nav link is present.
    const inboxLink = sidenav.getByRole('link', { name: 'Inbox', exact: true });
    await expect(inboxLink).toBeVisible();

    // Click the collapse toggle.
    const toggle = page.locator('[data-slot="sidenav-collapse"]');
    await expect(toggle).toBeVisible();
    await toggle.click();

    // After collapsing, the sidebar should be narrower.
    const box = await sidenav.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(64);

    // Links are still reachable by their accessible name (aria-label).
    await expect(inboxLink).toBeVisible();

    // Expand again.
    await toggle.click();
    const expandedBox = await sidenav.boundingBox();
    expect(expandedBox!.width).toBeGreaterThan(100);
  });
});
