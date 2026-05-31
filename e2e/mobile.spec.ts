import { test, expect } from '@playwright/test';
import { NAV, topBarHeading } from './helpers';

// Mobile shell contract (iPhone 12-ish viewport). Below lg the desktop SideNav
// rail collapses behind a hamburger that opens a left Sheet with the SAME 9
// nav links; tapping one navigates and closes the drawer. Every route must
// also lay out with no horizontal overflow at this width.
test.use({ viewport: { width: 390, height: 844 } });

test.describe('shell: mobile drawer', () => {
  test('hamburger opens the drawer with all 9 links; tapping Inbox navigates and closes it', async ({
    page,
  }) => {
    await page.goto('/today');
    await expect(topBarHeading(page)).toHaveText('Today');

    // Desktop rail is hidden below lg; the hamburger takes its place.
    await expect(page.locator('[data-slot="side-nav"]')).toBeHidden();
    const hamburger = page.getByRole('button', { name: 'Open navigation' });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    const drawer = page.locator('[data-slot="mobile-nav"]');
    await expect(drawer).toBeVisible();

    // The drawer mirrors the 9 product links exactly.
    for (const item of NAV) {
      await expect(
        drawer.getByRole('link', { name: item.label, exact: true }),
      ).toBeVisible();
    }
    await expect(drawer.getByRole('link')).toHaveCount(NAV.length);

    // Tapping Inbox navigates and dismisses the drawer.
    await drawer.getByRole('link', { name: 'Inbox', exact: true }).click();
    await expect(page).toHaveURL(/\/inbox$/);
    await expect(topBarHeading(page)).toHaveText('Inbox');
    await expect(page.locator('[data-slot="mobile-nav"]')).toHaveCount(0);
  });

  test('the /today KPI grid stacks to 2 columns at 390px', async ({ page }) => {
    await page.goto('/today');
    await expect(topBarHeading(page)).toHaveText('Today');

    // The KPI grid renders cols={4} but carries className="max-md:grid-cols-2",
    // which only wins now that Grid emits a static grid-cols-N class instead of
    // an always-overriding inline gridTemplateColumns style. At 390px (< md) the
    // max-md override applies, so the grid resolves to exactly 2 tracks.
    const kpiGrid = page
      .locator('[data-slot="grid"]')
      .filter({ has: page.locator('[data-slot="kpi"]') })
      .first();
    await expect(kpiGrid).toBeVisible();

    await expect
      .poll(() =>
        kpiGrid.evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(' ').length,
        ),
      )
      .toBe(2);
  });

  for (const item of NAV) {
    test(`${item.href} has no horizontal overflow at 390px`, async ({
      page,
    }) => {
      await page.goto(item.href);
      await expect(topBarHeading(page)).toHaveText(item.label);
      await expect(page.locator('main h2').first()).toBeVisible();

      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          ),
        )
        .toBeLessThanOrEqual(1);
    });
  }
});
