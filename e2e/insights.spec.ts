import { test, expect } from '@playwright/test';
import { gotoPage, topBarHeading, trackConsoleErrors } from './helpers';

// Insights is a read-only AI synthesis dashboard. All values are deterministic
// from src/app/api/mock/insights/route.ts, so we assert exact mock strings.
test.describe('insights: read-only dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, 'insights');
  });

  test('loads the Insights shell and period', async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await expect(topBarHeading(page)).toHaveText('Insights');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Insights' }),
    ).toBeVisible();
    await expect(page.getByText('Period: Last 30 days')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('executive summary narrative and highlight pills render', async ({
    page,
  }) => {
    const summary = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Executive summary' });
    await expect(
      summary.getByText('Cross-module synthesis · Opus 4.7'),
    ).toBeVisible();
    await expect(
      summary.getByText(
        'Revenue is up 11% MoM, driven by dinner covers. Your no-show rate beats the local median. Watch lunch traffic — down 6% and trailing two nearby competitors.',
      ),
    ).toBeVisible();

    const pills = summary.locator('[data-slot="pill"]');
    await expect(pills).toHaveCount(5);
    await expect(pills.nth(0)).toHaveText('Dinner covers +11%');
    await expect(pills.nth(1)).toHaveText('No-shows beat median');
    await expect(pills.nth(2)).toHaveText('Strong repeat rate');
    await expect(pills.nth(3)).toHaveText('Lunch traffic -6%');
    await expect(pills.nth(4)).toHaveText('Trailing on pasta price');
  });

  test('customer growth sparkline, counts and LTV KPI render', async ({
    page,
  }) => {
    const growth = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Customer growth' });
    await expect(growth.locator('[data-slot="sparkline"]')).toBeVisible();
    await expect(growth.getByText('312', { exact: true })).toBeVisible();
    await expect(growth.getByText('New customers')).toBeVisible();
    await expect(growth.getByText('58%', { exact: true })).toBeVisible();
    await expect(growth.getByText('Repeat rate')).toBeVisible();

    const ltv = growth.locator('[data-slot="kpi"]');
    await expect(ltv).toContainText('Lifetime value');
    await expect(ltv).toContainText('$214');
    await expect(ltv).toContainText('+9%');
    await expect(ltv).toContainText('vs last period');
  });

  test('pros and cons lists render', async ({ page }) => {
    const prosCons = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Pros & cons' });
    const pills = prosCons.locator('[data-slot="pill"]');
    await expect(pills).toHaveCount(4);
    await expect(pills.nth(0)).toHaveText('Strong repeat rate');
    await expect(pills.nth(1)).toHaveText('High review score');
    await expect(pills.nth(2)).toHaveText('Lunch underperforming');
    await expect(pills.nth(3)).toHaveText('Slow Friday service');
  });

  test('competitive pricing mini-table renders rows with delta pills', async ({
    page,
  }) => {
    const pricing = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Competitive pricing' });
    const table = pricing.locator('[data-slot="mini-table"]');
    await expect(table).toBeVisible();

    // Header row
    await expect(table.locator('thead')).toContainText('Item');
    await expect(table.locator('thead')).toContainText('You');
    await expect(table.locator('thead')).toContainText('Mkt');

    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);

    const burrata = rows.filter({ hasText: 'Burrata' });
    await expect(burrata).toContainText('$14');
    await expect(burrata).toContainText('$16');
    await expect(burrata.locator('[data-slot="pill"]')).toHaveText('-12%');

    const pasta = rows.filter({ hasText: 'Pasta' });
    await expect(pasta).toContainText('$22');
    await expect(pasta).toContainText('$20');
    await expect(pasta.locator('[data-slot="pill"]')).toHaveText('+10%');

    const wine = rows.filter({ hasText: 'Wine glass' });
    await expect(wine.locator('[data-slot="pill"]')).toHaveText('-15%');

    const tiramisu = rows.filter({ hasText: 'Tiramisu' });
    await expect(tiramisu.locator('[data-slot="pill"]')).toHaveText('0%');
  });

  test('drop-off conversion funnel renders stages and biggest leak', async ({
    page,
  }) => {
    const dropOff = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Drop-off points' });
    const funnel = dropOff.locator('[data-slot="conversion-funnel"]');
    await expect(funnel).toBeVisible();

    const stages = funnel.locator('[data-slot="funnel-stage"]');
    await expect(stages).toHaveCount(4);
    await expect(stages.nth(0)).toContainText('Site visit');
    await expect(stages.nth(0)).toContainText('4,200');
    await expect(stages.nth(1)).toContainText('Menu view');
    await expect(stages.nth(1)).toContainText('2,680');
    await expect(stages.nth(2)).toContainText('Book started');
    await expect(stages.nth(2)).toContainText('910');
    await expect(stages.nth(3)).toContainText('Confirmed');
    await expect(stages.nth(3)).toContainText('742');

    await expect(
      dropOff.getByText('Biggest leak at Menu → Book'),
    ).toBeVisible();
  });

  test('recommendations list renders three rows with actions', async ({
    page,
  }) => {
    const recs = page
      .locator('[data-slot="panel"]')
      .filter({ hasText: 'Recommendations' });
    await expect(recs.getByText('Generated by Opus 4.7')).toBeVisible();

    await expect(
      recs.getByText(
        'Launch a weekday lunch promo to recover the 6% midday dip.',
      ),
    ).toBeVisible();
    await expect(
      recs.getByText(
        'Nudge 86 lapsed regulars with a personalized comeback offer.',
      ),
    ).toBeVisible();
    await expect(
      recs.getByText(
        'Revisit pasta pricing — you sit 10% above the local market.',
      ),
    ).toBeVisible();

    await expect(
      recs.getByRole('button', { name: 'Create workflow' }),
    ).toBeVisible();
    await expect(
      recs.getByRole('button', { name: 'Draft campaign' }),
    ).toBeVisible();
    await expect(
      recs.getByRole('button', { name: 'Review pricing' }),
    ).toBeVisible();
  });
});
