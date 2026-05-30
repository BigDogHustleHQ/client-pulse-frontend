import { test, expect } from '@playwright/test';

test.describe('ClientPulse shell', () => {
  test('root redirects to the login route', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders the sign-in form', async ({ page }) => {
    await page.goto('/login');

    await expect(
      page.getByRole('heading', { name: 'Welcome back' }),
    ).toBeVisible();
    await expect(page.getByLabel('Business Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Sign in to platform' }),
    ).toBeVisible();
  });

  test('registration page renders the sign-up form', async ({ page }) => {
    await page.goto('/registration');

    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
    await expect(page.getByLabel('First Name')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Create account' }),
    ).toBeVisible();
  });
});
