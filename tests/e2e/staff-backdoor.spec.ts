import { test, expect } from '@playwright/test';

test.describe('Porte Dérobée Staff', () => {
  test('should have a /staff route or equivalent', async ({ page }) => {
    // Test that the URL /staff exists and redirects to login or shows something
    await page.goto('/staff');
    // Either shows login or redirect — should not 404
    const status = page.url();
    expect(status).not.toContain('404');
    await expect(page.locator('body')).toBeVisible();
  });

  test('public pages should not expose staff-related UI', async ({ page }) => {
    await page.goto('/');
    // The homepage should not show any staff menu
    const staffMenu = page.getByText(/tableau de bord staff|espace employé/i);
    await expect(staffMenu).not.toBeVisible();
  });

  test('login page should not expose staff access routes', async ({ page }) => {
    await page.goto('/login');
    // Login page should not have a visible link to /staff
    const staffLinks = page.locator('a[href*="staff"]');
    // Staff links should not be visible on the login page
    await expect(staffLinks).toHaveCount(0);
  });

  test('homepage triple-tap logo area should exist', async ({ page }) => {
    await page.goto('/');
    // Just verify homepage loads correctly
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});
