import { test, expect, type Page } from '@playwright/test';
import { gotoPage, topBarHeading } from './helpers';

// Deterministic mock values from src/app/api/mock/today/route.ts.
const GREETING = 'Good morning, Maria';
const ACTION_1_TITLE = 'Reply to a 4★ Google review';
const ACTION_1_DRAFT =
  "Hi Jordan, thanks for the kind words — sorry about Friday's wait. We've added weekend staff so your next visit is smoother. Hope to see you soon!";
const ACTION_2_TITLE = 'Slow Tuesday — promo draft';

/** The Nth AI action tile (0-based), scoped to its AIReplyDraft section. */
function tile(page: Page, n: number) {
  return page.locator('[data-slot="ai-reply-draft"]').nth(n);
}

test.describe('Today page', () => {
  test('loads with greeting and 4 KPIs including Covers today 142', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    await expect(topBarHeading(page)).toHaveText('Today');
    await expect(
      page.getByRole('heading', { name: new RegExp(GREETING) }),
    ).toBeVisible();

    const kpis = page.locator('[data-slot="kpi"]');
    await expect(kpis).toHaveCount(4);

    const covers = kpis.filter({ hasText: 'Covers today' });
    await expect(covers).toContainText('Covers today');
    await expect(covers).toContainText('142');
  });

  test('first AI action tile streams a draft and shows 94% confident', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const first = tile(page, 0);
    await expect(first).toContainText(ACTION_1_TITLE);
    await expect(
      first.locator('[data-slot="ai-reply-draft-confidence"]'),
    ).toHaveText('94% confident');
    // delay=0 → the streamed draft resolves to the full deterministic text.
    await expect(first.locator('[data-slot="ai-reply-draft-body"]')).toHaveText(
      ACTION_1_DRAFT,
    );
  });

  test('approving the first tile shows the approved draft status with the action title', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const first = tile(page, 0);
    await expect(first.locator('[data-slot="ai-reply-draft-body"]')).toHaveText(
      ACTION_1_DRAFT,
    );

    await first.getByRole('button', { name: 'Approve' }).click();

    const status = page.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toContainText('Reply approved — queued to send');
    // The resolved tile's panel keeps the action title. Target the innermost
    // panel wrapping the status (the outer "AI action tiles" panel also
    // contains it), identified by NOT carrying the section's head copy.
    const resolvedPanel = page
      .locator('[data-slot="panel"]')
      .filter({ has: status })
      .filter({ hasNot: page.getByText('Approve, edit, or skip') });
    await expect(resolvedPanel).toHaveCount(1);
    await expect(resolvedPanel).toContainText(ACTION_1_TITLE);
  });

  test('undo after approve returns the Approve button', async ({ page }) => {
    await gotoPage(page, 'today');

    const first = tile(page, 0);
    await expect(first.locator('[data-slot="ai-reply-draft-body"]')).toHaveText(
      ACTION_1_DRAFT,
    );

    await first.getByRole('button', { name: 'Approve' }).click();

    const status = page.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();

    await page.getByRole('button', { name: 'Undo' }).click();

    await expect(status).toHaveCount(0);
    // The ApprovalBar (and its Approve button) returns on the first tile.
    await expect(
      tile(page, 0).getByRole('button', { name: 'Approve' }),
    ).toBeVisible();
  });

  test('rejecting the second tile shows the rejected draft status', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const second = tile(page, 1);
    await expect(second).toContainText(ACTION_2_TITLE);

    await second.getByRole('button', { name: 'Reject' }).click();

    const status = page.locator(
      '[data-slot="draft-status"][data-resolution="rejected"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toContainText('Draft dismissed');
    // The first tile is untouched and still awaits sign-off.
    await expect(
      tile(page, 0).getByRole('button', { name: 'Approve' }),
    ).toBeVisible();
  });

  test('edit flow opens the editor and Cancel returns the approval bar', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    const first = tile(page, 0);
    await expect(first.locator('[data-slot="ai-reply-draft-body"]')).toHaveText(
      ACTION_1_DRAFT,
    );

    await first.getByRole('button', { name: 'Edit' }).click();

    const editor = first.locator('[data-slot="approval-bar-editor"]');
    await expect(editor).toBeVisible();
    await expect(editor).toHaveValue(ACTION_1_DRAFT);

    await first.getByRole('button', { name: 'Cancel' }).click();

    await expect(editor).toHaveCount(0);
    await expect(first.getByRole('button', { name: 'Approve' })).toBeVisible();
  });

  test('shortcut buttons navigate to their product routes', async ({
    page,
  }) => {
    await gotoPage(page, 'today');

    // "+ New post" → Social Studio.
    await page.getByRole('button', { name: '+ New post', exact: true }).click();
    await expect(page).toHaveURL(/\/social$/);
    await expect(topBarHeading(page)).toHaveText('Social Studio');

    // Back to Today, then "+ Reservation" → Reservations.
    await gotoPage(page, 'today');
    await page
      .getByRole('button', { name: '+ Reservation', exact: true })
      .click();
    await expect(page).toHaveURL(/\/reservations$/);
    await expect(topBarHeading(page)).toHaveText('Reservations');
  });
});
