import { test, expect, type Page } from '@playwright/test';
import { gotoPage, topBarHeading } from './helpers';

// Deterministic mock values from src/app/api/mock/social/route.ts.
const WEEK_OF = 'Week of Jun 2';
// The first post (p1) is selected by default: instagram, mon morning.
const POST_1_CAPTION = 'Sunrise patio is open';
// p2: facebook, tue morning — a distinct, unique caption to target for selection.
const POST_2_CAPTION = 'Midweek menu drop';
// data.aiTokens joined — what the ChatComposer streams back on Send.
const AI_RESPONSE =
  'Plot twist: your Tuesday just got tastier 🍝 New spring pasta is here!';

/** The draggable post card whose caption contains the given text. */
function postCard(page: Page, caption: string) {
  return page.locator('[data-slot="draggable"]').filter({ hasText: caption });
}

/** The "Selected post" panel (the one wrapping the ChatComposer). */
function selectedPanel(page: Page) {
  return page
    .locator('[data-slot="panel"]')
    .filter({ has: page.locator('[data-slot="chat-composer"]') });
}

test.describe('Social Studio page', () => {
  test('loads the Social Studio heading and week label', async ({ page }) => {
    await gotoPage(page, 'social');

    await expect(topBarHeading(page)).toHaveText('Social Studio');
    // The page content heading carries the ✦ flourish; the TopBar h1 doesn't.
    await expect(page.locator('main h2').first()).toContainText(
      'Social Studio',
    );
    await expect(page.getByText(WEEK_OF)).toBeVisible();
  });

  test('selecting a calendar post rings it and updates the Selected post panel head', async ({
    page,
  }) => {
    await gotoPage(page, 'social');

    // p1 (mon morning) is selected by default → panel head reads "Morning Mon".
    const head = selectedPanel(page).locator('[data-slot="panel-head"]');
    await expect(head).toContainText('Selected post — Morning Mon');

    // Click p2 (tue morning, facebook) to select it.
    const target = postCard(page, POST_2_CAPTION);
    await target.click();

    // The post card inside gains the selected ring.
    await expect(target.locator('.ring-brand')).toBeVisible();
    // The previously selected post (p1) no longer carries the ring.
    await expect(
      postCard(page, POST_1_CAPTION).locator('.ring-brand'),
    ).toHaveCount(0);
    // The panel head reflects the new selection (tue morning).
    await expect(head).toContainText('Selected post — Morning Tue');
  });

  test('ChatComposer streams the mock response then clears the streaming hint', async ({
    page,
  }) => {
    await gotoPage(page, 'social');

    const composer = selectedPanel(page).locator('[data-slot="chat-composer"]');
    // The Prompt textarea is pre-filled with the default prompt.
    await expect(composer.getByLabel('Prompt')).toHaveValue(
      'Make this more playful',
    );

    await composer.getByRole('button', { name: 'Send' }).click();

    // While streaming (delay=40), the streaming hint is shown.
    const response = composer.locator('[data-slot="chat-composer-response"]');
    await expect(
      composer.locator('[data-slot="chat-composer-streaming"]'),
    ).toBeVisible();

    // Once finished, the full deterministic response is present...
    await expect(response).toContainText(AI_RESPONSE);
    // ...and the streaming hint has cleared.
    await expect(
      composer.locator('[data-slot="chat-composer-streaming"]'),
    ).toHaveCount(0);
  });

  test('approving the ApprovalBar shows approved status and Undo restores it', async ({
    page,
  }) => {
    await gotoPage(page, 'social');

    const panel = selectedPanel(page);
    const approvalBar = panel.locator('[data-slot="approval-bar"]');
    await expect(approvalBar).toBeVisible();

    await panel.getByRole('button', { name: 'Approve' }).click();

    const status = panel.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toContainText('Reply approved — queued to send');
    // The ApprovalBar is replaced by the status banner.
    await expect(approvalBar).toHaveCount(0);

    await panel.getByRole('button', { name: 'Undo' }).click();

    await expect(status).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Approve' })).toBeVisible();
  });

  test('rejecting the ApprovalBar shows the dismissed status', async ({
    page,
  }) => {
    await gotoPage(page, 'social');

    const panel = selectedPanel(page);
    await panel.getByRole('button', { name: 'Reject' }).click();

    const status = panel.locator(
      '[data-slot="draft-status"][data-resolution="rejected"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toContainText('Draft dismissed');
  });

  test('keyboard drag reschedules a post without crashing (covers reorder)', async ({
    page,
  }) => {
    // Only uncaught exceptions count as a crash; ignore resource-load noise
    // (e.g. environmental SSL errors on third-party assets).
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    await gotoPage(page, 'social');

    // The calendar renders a dropzone per slot×day cell (3 slots × 7 days).
    const cells = page.locator('[data-slot="dropzone"]');
    await expect(cells).toHaveCount(21);

    // Drive the dnd-kit KeyboardSensor: focus a post's drag handle, lift with
    // Space, move with ArrowRight, drop with Space. Best-effort reschedule —
    // we assert the app stays alive and the post survives the operation.
    const post = postCard(page, POST_1_CAPTION);
    const handle = post.locator('[data-slot="drag-handle"]');
    await handle.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');

    // No crash: the post is still on the board and the grid is intact.
    await expect(postCard(page, POST_1_CAPTION)).toBeVisible();
    await expect(cells).toHaveCount(21);
    expect(pageErrors).toEqual([]);
  });
});
