import { test, expect } from '@playwright/test';
import { gotoPage, topBarHeading } from './helpers';

// Website Builder behavior suite. All assertions are pinned to the deterministic
// mock at src/app/api/mock/website/route.ts. The page is read-only this run
// (ModeTabs flip local state; Generate toggles a local loading flag; Pick /
// Regenerate / Publish are deferred placeholders that merely render).
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

    // Clicking flips the page's local `generating` flag, so the Btn renders its
    // loading state: aria-busy + disabled (with a spinner).
    await generate.click();
    await expect(generate).toHaveAttribute('aria-busy', 'true');
    await expect(generate).toBeDisabled();
  });

  test('renders three variation previews from the mock', async ({ page }) => {
    await gotoPage(page, 'website');

    // Each variation Card embeds a SitePreview whose hero shows the brandName.
    await expect(page.getByText("Bella's", { exact: true })).toBeVisible();
    await expect(page.getByText("BELLA'S", { exact: true })).toBeVisible();
    await expect(page.getByText("bella's", { exact: true })).toBeVisible();

    // Three "Pick" buttons — one per variation Card.
    await expect(page.getByRole('button', { name: 'Pick' })).toHaveCount(3);
    // Three per-card Regenerate controls.
    await expect(
      page.getByRole('button', { name: 'Regenerate variation' }),
    ).toHaveCount(3);
  });

  test('deferred Pick / Regenerate / Publish render without errors', async ({
    page,
  }) => {
    // Track uncaught page/app errors only. Dev-server resource-load noise (e.g.
    // SSL cipher mismatches on external assets) is environment-level, not an app
    // fault, so we filter to genuine runtime exceptions.
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(String(err)));
    await gotoPage(page, 'website');

    // Publish CTA resolves the mock subdomain + domain.
    await expect(
      page.getByRole('button', { name: 'Publish → bella.vendrr.app' }),
    ).toBeVisible();
    // The "Generate 3 more" secondary action also renders.
    await expect(
      page.getByRole('button', { name: 'Generate 3 more' }),
    ).toBeVisible();

    // Deferred placeholders: clicking them must not throw.
    await page.getByRole('button', { name: 'Pick' }).first().click();
    await page
      .getByRole('button', { name: 'Regenerate variation' })
      .first()
      .click();
    await expect(
      page.getByRole('button', { name: 'Publish → bella.vendrr.app' }),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
