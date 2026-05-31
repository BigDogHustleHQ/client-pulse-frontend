import { expect, type Page } from '@playwright/test';

// Single source of truth for the 9 product routes, mirroring
// src/components/shell/nav-config.ts. Kept here (not imported) so the e2e suite
// stays decoupled from app internals and asserts the user-visible contract.
export const NAV = [
  { slug: 'today', label: 'Today', href: '/today' },
  { slug: 'inbox', label: 'Inbox', href: '/inbox' },
  { slug: 'social', label: 'Social Studio', href: '/social' },
  { slug: 'reservations', label: 'Reservations', href: '/reservations' },
  { slug: 'workflows', label: 'Workflows', href: '/workflows' },
  { slug: 'vendors', label: 'Vendors', href: '/vendors' },
  { slug: 'website', label: 'Website Builder', href: '/website' },
  { slug: 'insights', label: 'Insights', href: '/insights' },
  { slug: 'settings', label: 'Settings', href: '/settings' },
] as const;

export type NavSlug = (typeof NAV)[number]['slug'];

/** The TopBar <h1> that shows the active page label. */
export function topBarHeading(page: Page) {
  return page.locator('[data-slot="top-bar"] h1');
}

/** A SideNav link by its visible label. */
export function navLink(page: Page, label: string) {
  return page
    .locator('[data-slot="side-nav"]')
    .getByRole('link', { name: label, exact: true });
}

/**
 * Navigate to a product route and wait until its content has rendered. Every
 * page renders a top-level <main> <h2> title only in its loaded state (the
 * shared PageLoading shows just a spinner), so a visible main heading is a
 * reliable "data resolved" signal. Returns once the page is interactive.
 */
export async function gotoPage(page: Page, slug: NavSlug) {
  const item = NAV.find((n) => n.slug === slug)!;
  await page.goto(item.href);
  await expect(topBarHeading(page)).toHaveText(item.label);
  await expect(page.locator('main h2').first()).toBeVisible();
}

/** Collect console errors for a page; call before navigation. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(String(err)));
  return errors;
}
