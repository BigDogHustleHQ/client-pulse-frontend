import { test, expect } from '@playwright/test';
import {
  NAV,
  navLink,
  topBarHeading,
  gotoPage,
  trackConsoleErrors,
} from './helpers';

// Cross-cutting nav/shell contract. The SideNav + TopBar wrap every (app)
// route; this suite proves the active-route signalling (URL, TopBar label,
// aria-current) stays in lockstep as the owner clicks through the product,
// and that every route loads without console errors.
test.describe('navigation & shell', () => {
  test('SideNav exposes all 9 routes with Today active on /today', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    // The nav renders exactly the 9 product links (the logo is a separate
    // link whose accessible name is the brand, not a NAV label).
    for (const item of NAV) {
      await expect(navLink(page, item.label)).toBeVisible();
    }
    const navLinks = page.locator('[data-slot="side-nav"]').getByRole('link', {
      name: new RegExp(NAV.map((n) => n.label).join('|')),
    });
    await expect(navLinks).toHaveCount(NAV.length);

    // On /today, only the Today link is the current page.
    await expect(navLink(page, 'Today')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('clicking each nav item updates URL, TopBar label, and aria-current', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    for (const item of NAV) {
      await navLink(page, item.label).click();

      // URL reflects the target route.
      await expect(page).toHaveURL(new RegExp(`${item.href}$`));

      // TopBar <h1> mirrors the active label.
      await expect(topBarHeading(page)).toHaveText(item.label);

      // aria-current="page" is set on exactly the clicked link...
      await expect(navLink(page, item.label)).toHaveAttribute(
        'aria-current',
        'page',
      );

      // ...and cleared from every other nav link.
      for (const other of NAV) {
        if (other.slug === item.slug) continue;
        await expect(navLink(page, other.label)).not.toHaveAttribute(
          'aria-current',
          'page',
        );
      }
    }
  });

  test('all 9 routes load without console errors', async ({ page }) => {
    const errors = trackConsoleErrors(page);

    for (const item of NAV) {
      await gotoPage(page, item.slug);
    }

    // The only console noise under Turbopack dev over plain-HTTP localhost is a
    // resource the headless browser fails to fetch via an attempted HTTPS
    // upgrade (ERR_SSL_VERSION_OR_CIPHER_MISMATCH). It is an environment/dev-
    // server artifact, not app behavior, so we filter it out and assert no
    // real (app-originated) errors remain.
    const appErrors = errors.filter(
      (e) => !e.includes('ERR_SSL_VERSION_OR_CIPHER_MISMATCH'),
    );
    expect(appErrors).toEqual([]);
  });

  test('the logo links to /today', async ({ page }) => {
    await gotoPage(page, 'inbox');

    // The brand logo is the first link in the SideNav; its accessible name is
    // the brand text, distinct from the "Today" nav item.
    const logo = page
      .locator('[data-slot="side-nav"]')
      .getByRole('link', { name: 'ClientPulse' });
    await expect(logo).toHaveAttribute('href', '/today');

    await logo.click();
    await expect(page).toHaveURL(/\/today$/);
    await expect(topBarHeading(page)).toHaveText('Today');
  });
});
