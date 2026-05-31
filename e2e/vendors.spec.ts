import { test, expect } from '@playwright/test';
import { gotoPage } from './helpers';

// Vendors is wired with the AI approve/reject lifecycle (AIReplyDraft +
// DraftStatus) on the cold-email Panel. All assertion values below are pinned
// to the deterministic mock at src/app/api/mock/vendors/route.ts:
//   - 4 kanban lanes: Leads / Contacted / Quoted / Signed
//   - `leads` cards expose a "Draft email" button, others a "Call tips" button
//   - selecting a vendor templates the draft body around "we run a 90-seat
//     bistro" and switches the PanelHead description to "Outreach for <name>"
// The mock streams at delay=0, so the final draft text is present immediately.

// Templated draft for Burrata Co. (lane "leads", poc "Sam Ortiz"). The vendor
// name itself ends in "." so the template's joining "." yields "Co.." here.
const BURRATA_DRAFT =
  'Hi Sam Ortiz, we run a 90-seat bistro and would love a wholesale quote from Burrata Co.. Could we set up a quick call this week? Thanks — Maria';

// Templated draft for Valley Farm (lane "contacted", poc "Sam Reyes").
const VALLEY_DRAFT =
  'Hi Sam Reyes, we run a 90-seat bistro and would love a wholesale quote from Valley Farm. Could we set up a quick call this week? Thanks — Maria';

test.describe('Vendors', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPage(page, 'vendors');
  });

  test('loads the Vendors board with four kanban lanes', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 2, name: 'Vendors' }),
    ).toBeVisible();

    const lanes = page.locator('[data-slot="dropzone"]');
    await expect(lanes).toHaveCount(4);

    // Each lane renders its label from the mock.
    for (const label of ['Leads', 'Contacted', 'Quoted', 'Signed']) {
      await expect(lanes.filter({ hasText: label }).first()).toBeVisible();
    }

    // A representative vendor card from the mock is present on the board.
    await expect(page.getByText('Burrata Co.', { exact: true })).toBeVisible();
  });

  test('selecting a vendor tailors the cold-email draft', async ({ page }) => {
    const panel = page
      .locator('[data-slot="panel"]', { hasText: 'Cold-email draft' })
      .first();
    const body = panel.locator('[data-slot="ai-reply-draft-body"]');

    // Default (no vendor selected) shows the prompt-to-pick description.
    await expect(
      panel.getByText('Pick a vendor card to tailor the outreach'),
    ).toBeVisible();

    // Pick a "leads" vendor via its "Draft email" button.
    const burrata = page
      .locator('[data-slot="draggable"]', { hasText: 'Burrata Co.' })
      .first();
    await burrata.getByRole('button', { name: 'Draft email' }).click();

    // PanelHead description and the AIReplyDraft body both retarget.
    await expect(panel.getByText('Outreach for Burrata Co.')).toBeVisible();
    await expect(body).toHaveText(BURRATA_DRAFT);
    await expect(body).toContainText('we run a 90-seat bistro');

    // The AIReplyDraft title also retargets to the selected vendor: its heading
    // carries the vendor name from the mock (route.ts -> "Burrata Co.").
    const draft = panel.locator('[data-slot="ai-reply-draft"]');
    await expect(
      draft.getByRole('heading', { name: 'Cold email — Burrata Co.' }),
    ).toBeVisible();

    // Pick a non-"leads" vendor via its "Call tips" button -> draft updates.
    const valley = page
      .locator('[data-slot="draggable"]', { hasText: 'Valley Farm' })
      .first();
    await valley.getByRole('button', { name: 'Call tips' }).click();

    await expect(panel.getByText('Outreach for Valley Farm')).toBeVisible();
    await expect(body).toHaveText(VALLEY_DRAFT);
  });

  test('Approve -> DraftStatus approved appears, Undo restores the draft', async ({
    page,
  }) => {
    // Select a vendor so the draft is concretely templated, then approve.
    const burrata = page
      .locator('[data-slot="draggable"]', { hasText: 'Burrata Co.' })
      .first();
    await burrata.getByRole('button', { name: 'Draft email' }).click();

    const draft = page.locator('[data-slot="ai-reply-draft"]');
    await expect(draft).toBeVisible();
    await expect(draft.locator('[data-slot="ai-reply-draft-body"]')).toHaveText(
      BURRATA_DRAFT,
    );

    await draft.getByRole('button', { name: 'Approve' }).click();

    const status = page.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toContainText('Reply approved — queued to send');
    // The editable draft is replaced by the resolved status.
    await expect(draft).toBeHidden();

    // Undo reverses the decision and brings the approvable draft back.
    await status.getByRole('button', { name: 'Undo' }).click();
    await expect(status).toBeHidden();
    await expect(draft).toBeVisible();
    await expect(draft.getByRole('button', { name: 'Approve' })).toBeVisible();
  });

  test('keyboard dnd: drag handle is focusable and the board stays consistent', async ({
    page,
  }) => {
    const lanes = page.locator('[data-slot="dropzone"]');
    await expect(lanes).toHaveCount(4);

    // Total card count across all lanes (6 mock vendors) is an invariant a
    // move must preserve.
    const cards = page.locator('[data-slot="draggable"]');
    await expect(cards).toHaveCount(6);

    // The drag handle is a focusable button with the documented aria-label.
    const handle = page.getByRole('button', { name: 'Drag Burrata Co.' });
    await expect(handle).toBeVisible();
    await handle.focus();
    await expect(handle).toBeFocused();

    // Keyboard dnd via dnd-kit's KeyboardSensor: lift, move, drop. This is the
    // deterministic path (no pointer timing). After the gesture the board must
    // still render all four lanes and all six cards — total count is invariant
    // regardless of which lane the card landed in.
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');

    await expect(lanes).toHaveCount(4);
    await expect(cards).toHaveCount(6);
    await expect(page.getByText('Burrata Co.', { exact: true })).toBeVisible();
  });
});
