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

  test('"+ Add vendor" opens a dialog, submitting adds a card to the Leads lane', async ({
    page,
  }) => {
    const lanes = page.locator('[data-slot="dropzone"]');
    const leads = lanes.filter({ hasText: 'Leads' }).first();

    // The Leads lane seeds two cards from the mock (Burrata Co., Fresh Bros).
    const leadsCards = leads.locator('[data-slot="draggable"]');
    await expect(leadsCards).toHaveCount(2);

    // The "+ Add vendor" button opens the dialog (deferred placeholder no more).
    await page.getByRole('button', { name: '+ Add vendor' }).click();

    const dialog = page.locator('[data-slot="dialog-content"]');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: 'Add vendor' }),
    ).toBeVisible();

    // Fill the required name (POC/price optional) and submit via the footer.
    const NEW_VENDOR = 'Meadow Dairy';
    await dialog.getByLabel('Vendor name').fill(NEW_VENDOR);
    await dialog.getByRole('button', { name: 'Add vendor' }).click();

    // The dialog closes and a new card appears immediately in the Leads lane,
    // bumping its count from 2 to 3.
    await expect(dialog).toBeHidden();
    await expect(leadsCards).toHaveCount(3);
    await expect(leads.getByText(NEW_VENDOR, { exact: true })).toBeVisible();

    // The new card is draggable: it exposes the same drag handle contract as
    // the seeded cards, and (being a `leads` card) a "Draft email" button.
    const newCard = leads
      .locator('[data-slot="draggable"]', { hasText: NEW_VENDOR })
      .first();
    await expect(
      newCard.getByRole('button', { name: `Drag ${NEW_VENDOR}` }),
    ).toBeVisible();
    await expect(
      newCard.getByRole('button', { name: 'Draft email' }),
    ).toBeVisible();
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

  test('keyboard dnd: card moves to another lane and appears there', async ({
    page,
  }) => {
    const lanes = page.locator('[data-slot="dropzone"]');
    const leadsLane = lanes.filter({ hasText: 'Leads' }).first();
    const contactedLane = lanes.filter({ hasText: 'Contacted' }).first();

    // Mock seeds Leads with 2 cards, Contacted with 1.
    await expect(leadsLane.locator('[data-slot="draggable"]')).toHaveCount(2);
    await expect(contactedLane.locator('[data-slot="draggable"]')).toHaveCount(
      1,
    );

    // Lift Fresh Bros (second Leads card) and move it right into Contacted.
    const handle = page.getByRole('button', { name: 'Drag Fresh Bros' });
    await handle.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');

    // Total card count must be unchanged (6).
    const cards = page.locator('[data-slot="draggable"]');
    await expect(cards).toHaveCount(6);
    // Fresh Bros must now be visible inside the Contacted lane.
    await expect(
      contactedLane.getByText('Fresh Bros', { exact: true }),
    ).toBeVisible();
  });

  test('keyboard dnd: moving the only card out of a lane leaves the lane empty but visible', async ({
    page,
  }) => {
    const lanes = page.locator('[data-slot="dropzone"]');
    const contactedLane = lanes.filter({ hasText: 'Contacted' }).first();

    // Mock seeds Contacted with exactly 1 card (Valley Farm).
    await expect(contactedLane.locator('[data-slot="draggable"]')).toHaveCount(
      1,
    );

    // Keyboard-lift Valley Farm and move it right into the Quoted lane.
    const handle = page.getByRole('button', { name: 'Drag Valley Farm' });
    await handle.focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');

    // Total card count must be unchanged (6).
    const cards = page.locator('[data-slot="draggable"]');
    await expect(cards).toHaveCount(6);

    // Contacted lane is now empty — the dropzone element must still exist so
    // future drops can target it.
    await expect(contactedLane.locator('[data-slot="draggable"]')).toHaveCount(
      0,
    );
    await expect(contactedLane).toBeVisible();
    // The lane header label is still rendered.
    await expect(contactedLane.getByText('Contacted')).toBeVisible();
  });
});
