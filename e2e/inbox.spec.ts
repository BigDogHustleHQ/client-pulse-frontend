import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers';

// Inbox is already wired (Thread + ToneSlider + AIReplyDraft + DraftStatus).
// All assertion values below are pinned to the deterministic mock at
// src/app/api/mock/inbox/route.ts (confidence 0.78, threshold 0.8, Google
// channel selected). We only assert real, observable behavior.

const DRAFT_TEXT =
  "Hi Jordan, thanks for the kind words — sorry about Friday's wait. We've added staff for weekends so your next visit is smoother. Hope to see you again soon!";

test.describe('Inbox', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, 'inbox');
  });

  test('loads and renders the channels MiniTable', async ({ page }) => {
    const channels = page
      .locator('[data-slot="panel"]', { hasText: 'Channels' })
      .first();
    await expect(channels).toBeVisible();

    const table = channels.locator('[data-slot="mini-table"]');
    await expect(table).toBeVisible();

    // Every mock channel row is present with its label + count.
    await expect(table.getByText('All', { exact: true })).toBeVisible();
    await expect(table.getByText('Google', { exact: true })).toBeVisible();
    await expect(table.getByText('Yelp', { exact: true })).toBeVisible();
    await expect(table.getByText('IG DMs', { exact: true })).toBeVisible();
    await expect(table.getByText('SMS', { exact: true })).toBeVisible();
    await expect(table.getByText('Email', { exact: true })).toBeVisible();
    await expect(table.getByText('42', { exact: true })).toBeVisible();
    await expect(table.getByText('12', { exact: true })).toBeVisible();
  });

  test('ToneSlider maps value to Professional / Friendly / Casual', async ({
    page,
  }) => {
    const input = page.locator('[data-slot="tone-slider-input"]');
    const value = page.locator('[data-slot="tone-slider-value"]');

    // Default mock value is 50 -> the middle stop, "Friendly".
    await expect(value).toHaveText('Friendly');
    await expect(input).toHaveAttribute('aria-valuetext', 'Friendly');

    // Min end of the range -> first stop.
    await input.fill('0');
    await expect(value).toHaveText('Professional');
    await expect(input).toHaveAttribute('aria-valuetext', 'Professional');

    // Max end of the range -> last stop.
    await input.fill('100');
    await expect(value).toHaveText('Casual');
    await expect(input).toHaveAttribute('aria-valuetext', 'Casual');

    // Back to the middle -> "Friendly".
    await input.fill('50');
    await expect(value).toHaveText('Friendly');
    await expect(input).toHaveAttribute('aria-valuetext', 'Friendly');
  });

  test('AIReplyDraft Edit -> type -> Save updates the body', async ({
    page,
  }) => {
    const draft = page.locator('[data-slot="ai-reply-draft"]');
    const body = draft.locator('[data-slot="ai-reply-draft-body"]');

    // Mock streams at delay=0, so the final draft text is present immediately.
    await expect(body).toHaveText(DRAFT_TEXT);

    // Enter edit mode -> the editor textarea appears.
    await draft.getByRole('button', { name: 'Edit' }).click();
    const editor = draft.locator('[data-slot="approval-bar-editor"]');
    await expect(editor).toBeVisible();
    await expect(editor).toHaveValue(DRAFT_TEXT);

    const edited = 'Thanks so much, Jordan — see you next Friday!';
    await editor.fill(edited);
    await draft.getByRole('button', { name: 'Save' }).click();

    // Editor closes and the body reflects the saved edit.
    await expect(editor).toBeHidden();
    await expect(body).toHaveText(edited);
  });

  test('Approve -> DraftStatus approved appears, Undo restores the draft', async ({
    page,
  }) => {
    const draft = page.locator('[data-slot="ai-reply-draft"]');
    await expect(draft).toBeVisible();

    await draft.getByRole('button', { name: 'Approve' }).click();

    const status = page.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toContainText('Reply approved — queued to send');
    // The editable draft is replaced by the resolved status.
    await expect(draft).toBeHidden();

    // Undo reverses the decision and brings the draft back.
    await status.getByRole('button', { name: 'Undo' }).click();
    await expect(status).toBeHidden();
    await expect(draft).toBeVisible();
    await expect(draft.getByRole('button', { name: 'Approve' })).toBeVisible();
  });

  test('renders the confidence pill and the below-threshold note', async ({
    page,
  }) => {
    // Confidence pill on the draft itself (mock confidence = 0.78 -> 78%).
    const draft = page.locator('[data-slot="ai-reply-draft"]');
    await expect(
      draft.locator('[data-slot="ai-reply-draft-confidence"]'),
    ).toHaveText('78% confident');

    // 0.78 < 0.8 threshold -> the threshold panel shows the owner-review note.
    await expect(
      page.getByText(
        'Below the 80% threshold — this draft needs owner review before it can be sent.',
      ),
    ).toBeVisible();
  });
});
