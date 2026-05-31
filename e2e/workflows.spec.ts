import { test, expect, type Page } from '@playwright/test';
import { gotoPage, topBarHeading, trackConsoleErrors } from './helpers';

// Deterministic mock values from src/app/api/mock/workflows/route.ts.
const WORKFLOW_NAME = 'Weekend review responder';
const PROMPT =
  'When a 4★+ review comes in, draft a thank-you and send it if confidence > 85%.';
// The aiTokens array joined verbatim (MockAIProvider streams these; delay=24,
// web-first assertions auto-retry until the full text has accumulated).
const AI_RESPONSE =
  'Generated 6 nodes: a review trigger → AI draft → a confidence gate. ' +
  'High-confidence replies send automatically; the rest pause for your approval.';
// The mock graph has 5 canvas nodes; only the approval node carries a draft
// (which feeds the ApprovalBar — the bar shows only the actions, not the text).
const NODE_COUNT = 5;
// The 6 palette node labels.
const PALETTE_LABELS = [
  'Trigger',
  'AI draft',
  'Condition',
  'Approval',
  'Send',
  'Wait',
];

/** The ChatComposer in the "Describe a workflow" panel. */
function composer(page: Page) {
  return page.locator('[data-slot="chat-composer"]');
}

/**
 * The approval-gate canvas node card, identified by its (stable) title rather
 * than by the ApprovalBar — the bar is swapped out for a DraftStatus once the
 * draft is resolved, so a has-approval-bar filter would stop matching it.
 */
function approvalNode(page: Page) {
  return page
    .locator('[data-slot="workflow-node"]')
    .filter({ hasText: 'Approval gate' });
}

test.describe('Workflows page', () => {
  test('loads with the workflow name and Activate action', async ({ page }) => {
    await gotoPage(page, 'workflows');

    await expect(topBarHeading(page)).toHaveText('Workflows');
    await expect(
      page.getByRole('heading', { name: WORKFLOW_NAME }),
    ).toBeVisible();
    // Inactive mock → the activate button reads "Activate" (deferred placeholder).
    await expect(
      page.getByRole('button', { name: 'Activate', exact: true }),
    ).toBeVisible();
  });

  test('ChatComposer streams the AI graph summary after Send', async ({
    page,
  }) => {
    await gotoPage(page, 'workflows');

    const chat = composer(page);
    // defaultValue is the mock prompt, so Send is enabled immediately.
    await expect(chat.getByLabel('Prompt')).toHaveValue(PROMPT);

    await chat.getByRole('button', { name: 'Send' }).click();

    // Web-first assertion auto-retries while tokens stream in (delay=24).
    await expect(
      page.locator('[data-slot="chat-composer-response"]'),
    ).toContainText(AI_RESPONSE);
  });

  test('builder canvas renders every mock node', async ({ page }) => {
    await gotoPage(page, 'workflows');

    const nodes = page.locator('[data-slot="workflow-node"]');
    await expect(nodes).toHaveCount(NODE_COUNT);

    // The trigger and AI nodes render their titles on the canvas.
    await expect(nodes.filter({ hasText: 'New review' })).toHaveCount(1);
    await expect(nodes.filter({ hasText: 'AI draft' })).toHaveCount(1);
    await expect(nodes.filter({ hasText: 'Approval gate' })).toHaveCount(1);
  });

  test('approving the gate node shows the approved status, Undo restores it', async ({
    page,
  }) => {
    await gotoPage(page, 'workflows');

    const node = approvalNode(page);
    await expect(node).toHaveCount(1);
    // The gate node is the only one with an ApprovalBar; it carries the node copy.
    await expect(node).toContainText('Approval gate');

    await node.getByRole('button', { name: 'Approve' }).click();

    const status = node.locator(
      '[data-slot="draft-status"][data-resolution="approved"]',
    );
    await expect(status).toBeVisible();
    await expect(status).toContainText('Reply approved — queued to send');
    // The ApprovalBar is replaced while resolved.
    await expect(node.locator('[data-slot="approval-bar"]')).toHaveCount(0);

    await node.getByRole('button', { name: 'Undo' }).click();

    await expect(status).toHaveCount(0);
    await expect(node.getByRole('button', { name: 'Approve' })).toBeVisible();
  });

  test('palette renders all draggable node items', async ({ page }) => {
    await gotoPage(page, 'workflows');

    for (const label of PALETTE_LABELS) {
      // Each palette item exposes a "Drag <label>" handle and an "Add <label>"
      // affordance. The drag handle drives pointer dnd; the Add button is the
      // deterministic, touch-friendly path asserted in the test below.
      await expect(
        page.getByRole('button', { name: `Drag ${label}`, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: `Add ${label}`, exact: true }),
      ).toBeVisible();
    }
  });

  test('adding a palette node via the Add affordance grows the canvas by one', async ({
    page,
  }) => {
    await gotoPage(page, 'workflows');

    const nodes = page.locator('[data-slot="workflow-node"]');
    await expect(nodes).toHaveCount(NODE_COUNT);

    // Clicking the accessible "Add" control appends a new canvas node (no flaky
    // pointer-dnd needed). The added node carries the palette label as its title.
    await page.getByRole('button', { name: 'Add Wait', exact: true }).click();

    await expect(nodes).toHaveCount(NODE_COUNT + 1);
    await expect(nodes.filter({ hasText: 'Wait' })).toHaveCount(1);
  });

  test('adding the same palette node multiple times yields distinct nodes with no duplicate-key console errors', async ({
    page,
  }) => {
    // Collect console errors BEFORE navigating so we capture everything from
    // page load through all interactions.
    const errors = trackConsoleErrors(page);

    await gotoPage(page, 'workflows');

    const nodes = page.locator('[data-slot="workflow-node"]');
    await expect(nodes).toHaveCount(NODE_COUNT);

    // Click "Add Trigger" three times in a row — same palette item, same label.
    const addTrigger = page.getByRole('button', {
      name: 'Add Trigger',
      exact: true,
    });
    await addTrigger.click();
    await addTrigger.click();
    await addTrigger.click();

    // Canvas must grow by exactly 3 nodes (no deduplication / skips).
    await expect(nodes).toHaveCount(NODE_COUNT + 3);

    // All rendered [data-slot="workflow-node"] elements must have distinct React
    // keys — we verify this indirectly by checking no console error containing
    // "duplicate" or "key" was emitted (React logs "Each child in a list should
    // have a unique 'key'" / "Encountered two children with the same key").
    const dupErrors = errors.filter(
      (e) =>
        e.toLowerCase().includes('duplicate') ||
        (e.toLowerCase().includes('key') && e.toLowerCase().includes('child')),
    );
    expect(dupErrors).toHaveLength(0);
  });
});
