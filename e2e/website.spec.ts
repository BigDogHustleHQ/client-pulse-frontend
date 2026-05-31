import { test, expect } from '@playwright/test';
import { gotoPage, topBarHeading } from './helpers';

// Website Builder behavior suite. All assertions are pinned to the deterministic
// mock at src/app/api/mock/website/route.ts. The builder is now interactive:
// editing controls re-renders a live iframe preview, the device toggle changes
// the simulated viewport, picking a variation applies its preset to the
// preview, and Generate simulates client-side AI generation.
const PREVIEW_FRAME = '[data-slot="website-preview"] iframe';

test.describe('website builder', () => {
  test('loads the Website Builder shell', async ({ page }) => {
    await gotoPage(page, 'website');
    await expect(topBarHeading(page)).toHaveText('Website Builder');
    await expect(
      page.getByRole('heading', { level: 2, name: 'Website Builder' }),
    ).toBeVisible();
  });

  test('ModeTabs is a tablist and selection flips between tabs', async ({
    page,
  }) => {
    await gotoPage(page, 'website');

    const tablist = page.getByRole('tablist', { name: 'Builder mode' });
    await expect(tablist).toBeVisible();

    const aiTab = tablist.getByRole('tab', { name: 'AI-generated' });
    const templatesTab = tablist.getByRole('tab', { name: 'Templates' });
    await expect(tablist.getByRole('tab')).toHaveCount(3);

    // 'ai' is the active mode in the mock.
    await expect(aiTab).toHaveAttribute('aria-selected', 'true');
    await expect(templatesTab).toHaveAttribute('aria-selected', 'false');

    // Click a non-active tab: it becomes selected, the previous one deselects.
    await templatesTab.click();
    await expect(templatesTab).toHaveAttribute('aria-selected', 'true');
    await expect(aiTab).toHaveAttribute('aria-selected', 'false');
  });

  test('Generate 3 variations toggles a loading affordance', async ({
    page,
  }) => {
    await gotoPage(page, 'website');

    const generate = page.getByRole('button', {
      name: 'Generate 3 variations',
    });
    await expect(generate).toBeVisible();
    await expect(generate).toBeEnabled();

    // Clicking starts a simulated generation: the Btn renders its loading state
    // (aria-busy + disabled) until the timeout resolves and it re-enables.
    await generate.click();
    await expect(generate).toHaveAttribute('aria-busy', 'true');
    await expect(generate).toBeDisabled();
    await expect(generate).toBeEnabled({ timeout: 5000 });
  });

  test('renders three variation cards from the mock', async ({ page }) => {
    await gotoPage(page, 'website');

    // Each variation card shows its brand name in the thumbnail.
    await expect(page.getByText("Bella's", { exact: true })).toBeVisible();
    await expect(page.getByText("BELLA'S", { exact: true })).toBeVisible();
    await expect(page.getByText("bella's", { exact: true })).toBeVisible();

    await expect(page.locator('[data-slot="variation-card"]')).toHaveCount(3);
    // Three "Pick" buttons — one per variation Card.
    await expect(page.getByRole('button', { name: 'Pick' })).toHaveCount(3);
    // Three per-card Regenerate controls.
    await expect(
      page.getByRole('button', { name: 'Regenerate variation' }),
    ).toHaveCount(3);
  });

  test('renders the live preview iframe with the seeded config', async ({
    page,
  }) => {
    await gotoPage(page, 'website');

    const frame = page.frameLocator(PREVIEW_FRAME);
    await expect(
      frame.getByRole('heading', { level: 1, name: "Bella's Trattoria" }),
    ).toBeVisible();
    // Menu section content from the mock renders inside the preview.
    await expect(frame.getByText('Margherita').first()).toBeVisible();
  });

  test('editing the brand name updates the live preview', async ({ page }) => {
    await gotoPage(page, 'website');

    const brand = page.getByLabel('Brand name');
    await brand.fill('Casa Verde');

    const frame = page.frameLocator(PREVIEW_FRAME);
    await expect(
      frame.getByRole('heading', { level: 1, name: 'Casa Verde' }),
    ).toBeVisible();
  });

  test('toggling a section hides it from the preview', async ({ page }) => {
    await gotoPage(page, 'website');

    const frame = page.frameLocator(PREVIEW_FRAME);
    await expect(frame.getByText('Margherita').first()).toBeVisible();

    // The Menu section toggle in the controls panel.
    await page
      .locator('[data-slot="builder-controls"] [data-section="menu"]')
      .click();
    await expect(frame.getByText('Margherita')).toHaveCount(0);
  });

  test('device toggle changes the simulated preview width', async ({
    page,
  }) => {
    await gotoPage(page, 'website');

    const toggle = page.locator('[data-slot="device-toggle"]');
    await expect(toggle).toBeVisible();

    const preview = page.locator('[data-slot="website-preview"]');
    await expect(preview).toHaveAttribute('data-device', 'desktop');

    const iframe = page.locator(PREVIEW_FRAME);
    const desktopBox = await iframe.boundingBox();

    await toggle.getByRole('radio', { name: 'Mobile' }).click();
    await expect(preview).toHaveAttribute('data-device', 'mobile');

    const mobileBox = await iframe.boundingBox();
    expect(mobileBox!.width).toBeLessThan(desktopBox!.width);
  });

  test('picking a variation applies its preset to the live preview', async ({
    page,
  }) => {
    await gotoPage(page, 'website');

    // Variation B uses the dark "Modern" preset and an uppercase brand name.
    const cardB = page.locator('[data-slot="variation-card"]').nth(1);
    await cardB.getByRole('button', { name: 'Pick' }).click();

    // The picked card flips to its "Applied" state.
    await expect(cardB.getByRole('button', { name: 'Applied' })).toBeVisible();

    // The preview hero now reflects the applied brand name + tagline.
    const frame = page.frameLocator(PREVIEW_FRAME);
    await expect(
      frame.getByRole('heading', { level: 1, name: "BELLA'S" }),
    ).toBeVisible();
    await expect(page.getByLabel('Brand name')).toHaveValue("BELLA'S");
  });

  test('publish + secondary generate render without errors', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    await gotoPage(page, 'website');

    // Publish CTA resolves the mock subdomain + domain (rendered twice).
    await expect(
      page.getByRole('button', { name: 'Publish → bella.vendrr.app' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Generate 3 more' }),
    ).toBeVisible();

    // Publishing surfaces the published URL pill.
    await page
      .getByRole('button', { name: 'Publish → bella.vendrr.app' })
      .first()
      .click();
    await expect(page.getByText('Published → bella.vendrr.app')).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
