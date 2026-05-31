import { test, expect, type Page } from '@playwright/test';
import { gotoPage, topBarHeading } from './helpers';

// Section tabs live inside the page's own <nav aria-label="Settings sections">.
// Scoping here avoids the TopBar's "Notifications" bell button, which shares the
// accessible name with the Notifications section tab.
function sectionTab(page: Page, label: string) {
  return page
    .getByRole('navigation', { name: 'Settings sections' })
    .getByRole('button', { name: label, exact: true });
}

// Settings page behavior suite. Values are pinned to the deterministic mock at
// src/app/api/mock/settings/route.ts. Section tabs swap panels; Brand exposes a
// ToneSlider, Budget a tier picker, Notifications checkboxes; Integrations
// Connect/Revoke is wired to local state in this run.

test.describe('settings: shell + sections', () => {
  test('loads Settings with Integrations active by default', async ({
    page,
  }) => {
    await gotoPage(page, 'settings');

    await expect(topBarHeading(page)).toHaveText('Settings');
    await expect(page.locator('main h2')).toHaveText('Settings');

    // Integrations is the default section: its tab is current and the grid of
    // integration cards is on screen.
    await expect(sectionTab(page, 'Integrations')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      page.getByRole('heading', { name: 'Google Business' }),
    ).toBeVisible();
  });

  test('section tabs swap the visible panel', async ({ page }) => {
    await gotoPage(page, 'settings');

    // Brand: ToneSlider appears, Integrations grid is gone.
    await sectionTab(page, 'Brand').click();
    await expect(page.locator('[data-slot="tone-slider-input"]')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Google Business' }),
    ).toHaveCount(0);

    // Budget: tier buttons appear, ToneSlider is gone.
    await sectionTab(page, 'Budget').click();
    await expect(page.getByRole('button', { name: /Starter/ })).toBeVisible();
    await expect(page.locator('[data-slot="tone-slider-input"]')).toHaveCount(
      0,
    );

    // Notifications: checkboxes appear, tier buttons are gone.
    await sectionTab(page, 'Notifications').click();
    await expect(
      page.getByRole('checkbox', { name: /New reviews/ }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Starter/ })).toHaveCount(0);
  });
});

test.describe('settings: brand tone slider', () => {
  test('label tracks Formal / Balanced / Playful across the range', async ({
    page,
  }) => {
    await gotoPage(page, 'settings');
    await sectionTab(page, 'Brand').click();

    const slider = page.locator('[data-slot="tone-slider-input"]');
    const value = page.locator('[data-slot="tone-slider-value"]');

    // Seeded from the mock (tone: 62) -> middle stop.
    await expect(value).toHaveText('Balanced');

    await slider.fill('0');
    await expect(value).toHaveText('Formal');

    await slider.fill('100');
    await expect(value).toHaveText('Playful');

    await slider.fill('50');
    await expect(value).toHaveText('Balanced');
  });
});

test.describe('settings: budget tier picker', () => {
  test('selecting a tier sets aria-pressed and clears the others', async ({
    page,
  }) => {
    await gotoPage(page, 'settings');
    await sectionTab(page, 'Budget').click();

    const business = page.getByRole('button', { name: /Business/ });
    const starter = page.getByRole('button', { name: /Starter/ });
    const pro = page.getByRole('button', { name: /Pro/ });

    // Mock seeds selectedTierId: 'business'.
    await expect(business).toHaveAttribute('aria-pressed', 'true');
    await expect(starter).toHaveAttribute('aria-pressed', 'false');

    await starter.click();
    await expect(starter).toHaveAttribute('aria-pressed', 'true');
    await expect(business).toHaveAttribute('aria-pressed', 'false');
    await expect(pro).toHaveAttribute('aria-pressed', 'false');
  });
});

test.describe('settings: notification toggles', () => {
  test('toggling a checkbox flips its checked state', async ({ page }) => {
    await gotoPage(page, 'settings');
    await sectionTab(page, 'Notifications').click();

    // Mock seeds 'Weekly digest' (digest) enabled: false.
    const digest = page.getByRole('checkbox', { name: /Weekly digest/ });
    await expect(digest).not.toBeChecked();

    await digest.click();
    await expect(digest).toBeChecked();

    await digest.click();
    await expect(digest).not.toBeChecked();
  });
});

test.describe('settings: integration connect/revoke (wired)', () => {
  test('Revoke flips a connected card to Connect / Not linked and back', async ({
    page,
  }) => {
    await gotoPage(page, 'settings');

    // Google Business is connected in the mock -> shows Revoke + "Connected".
    const card = page
      .locator('[data-slot="panel"]')
      .filter({ has: page.getByRole('heading', { name: 'Google Business' }) });

    const toggle = card.getByRole('button');
    const status = card.locator('[data-slot="status-dot"]');

    await expect(toggle).toHaveText('Revoke');
    await expect(status).toContainText('Connected');

    // Revoke -> disconnects.
    await toggle.click();
    await expect(toggle).toHaveText('Connect');
    await expect(status).toContainText('Not linked');

    // Connect -> reverts to the seeded connected state.
    await toggle.click();
    await expect(toggle).toHaveText('Revoke');
    await expect(status).toContainText('Connected');
  });
});
