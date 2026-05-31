import { test, expect } from '@playwright/test';
import { gotoPage, topBarHeading, trackConsoleErrors } from './helpers';

// Reservations is a read-only analytics dashboard. Every value asserted here is
// deterministic — it comes straight from src/app/api/mock/reservations/route.ts.
// No AI lifecycle to wire; the "+ Add booking" / "Auto-fill from waitlist"
// buttons are intentional deferred placeholders and only need to render.
test.describe('reservations: read-only dashboard', () => {
  test('loads the title and narrative from the mock', async ({ page }) => {
    await gotoPage(page, 'reservations');

    await expect(topBarHeading(page)).toHaveText('Reservations');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Reservations' }),
    ).toBeVisible();
    await expect(
      page.getByText('86 covers booked tonight with 23 open slots.', {
        exact: false,
      }),
    ).toBeVisible();
  });

  test('renders the 4 KPI tiles with their mock values', async ({ page }) => {
    await gotoPage(page, 'reservations');

    const kpis = page.locator('[data-slot="kpi"]');
    await expect(kpis).toHaveCount(4);

    await expect(kpis.filter({ hasText: 'Booked' })).toContainText('86');
    await expect(kpis.filter({ hasText: 'Walk-ins' })).toContainText('14');
    await expect(kpis.filter({ hasText: 'No-show risk' })).toContainText('5');
    await expect(kpis.filter({ hasText: 'Open slots' })).toContainText('23');
  });

  test('renders the conversion funnel with all stage labels', async ({
    page,
  }) => {
    await gotoPage(page, 'reservations');

    const funnel = page.locator('[data-slot="conversion-funnel"]');
    await expect(funnel).toBeVisible();

    const stages = funnel.locator('[data-slot="funnel-stage"]');
    await expect(stages).toHaveCount(3);
    await expect(funnel).toContainText('Widget views');
    await expect(funnel).toContainText('Started booking');
    await expect(funnel).toContainText('Confirmed');
    // 4,820 widget views formatted with a thousands separator.
    await expect(funnel).toContainText('4,820');
  });

  test('renders the biggest-leak callout', async ({ page }) => {
    await gotoPage(page, 'reservations');

    // biggestLeakStage=2 → Started booking (980) → Confirmed (412): a
    // round(100 - 412/980*100) = 58% drop off.
    await expect(
      page.getByText('Biggest leak: Started booking → Confirmed: 58% drop off'),
    ).toBeVisible();
  });

  test('renders the channel-mix donut with legend and total', async ({
    page,
  }) => {
    await gotoPage(page, 'reservations');

    await expect(
      page.getByRole('heading', { name: 'Channel mix' }),
    ).toBeVisible();

    const donut = page.locator('[data-slot="donut"]');
    await expect(donut).toBeVisible();
    // Center total: channels sum to 46+31+23 = 100, formatted as a percentage.
    await expect(donut).toContainText('100%');

    const legend = donut.locator('[data-slot="donut-legend"]');
    await expect(legend).toContainText('Widget');
    await expect(legend).toContainText('Google');
    await expect(legend).toContainText('Phone');
  });

  test('renders the waitlist table with status pills', async ({ page }) => {
    await gotoPage(page, 'reservations');

    const table = page.locator('[data-slot="mini-table"]');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(4);

    // Party names from the mock waitlist.
    await expect(table).toContainText('Lee');
    await expect(table).toContainText('Ng');
    await expect(table).toContainText('Patel');
    await expect(table).toContainText('Diaz');

    // Status column rendered as Pills: Held, Sent, Held, Seated.
    const pills = table.locator('[data-slot="pill"]');
    await expect(pills).toHaveCount(4);
    await expect(pills.filter({ hasText: 'Held' })).toHaveCount(2);
    await expect(pills.filter({ hasText: 'Sent' })).toHaveCount(1);
    await expect(pills.filter({ hasText: 'Seated' })).toHaveCount(1);
  });

  test('renders the cohort retention grid', async ({ page }) => {
    await gotoPage(page, 'reservations');

    await expect(
      page.getByRole('heading', { name: 'Repeat bookings' }),
    ).toBeVisible();

    const grid = page.locator('[data-slot="cohort-grid"]');
    await expect(grid).toBeVisible();

    // Cohort labels and D30/D60/D90 period headers.
    await expect(grid).toContainText('Jan');
    await expect(grid).toContainText('Feb');
    await expect(grid).toContainText('Mar');
    await expect(grid).toContainText('D30');
    await expect(grid).toContainText('D60');
    await expect(grid).toContainText('D90');
    // A known retention cell value (Jan D30 = 62%).
    await expect(grid).toContainText('62%');
  });

  test('renders deferred placeholder actions and logs no console errors', async ({
    page,
  }) => {
    const errors = trackConsoleErrors(page);
    await gotoPage(page, 'reservations');

    // These are intentional deferred placeholders — assert they merely render.
    await expect(
      page.getByRole('button', { name: '+ Add booking' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Auto-fill from waitlist' }),
    ).toBeVisible();

    // Ignore environment-level resource load failures (e.g. external fonts
    // over SSL in the test sandbox); assert the page itself logs no errors.
    const appErrors = errors.filter(
      (e) => !e.includes('Failed to load resource'),
    );
    expect(appErrors).toEqual([]);
  });
});
