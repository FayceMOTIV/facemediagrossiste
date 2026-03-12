import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Manager — Access Control & Employee Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'manager');
  });

  test('should access dashboard', async ({ page }) => {
    await expect(page).toHaveURL('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should access equipe page', async ({ page }) => {
    await page.goto('/equipe');
    await expect(page).toHaveURL('/equipe');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/équipe|team/i)).toBeVisible({ timeout: 5_000 });
  });

  test('should access supervision page', async ({ page }) => {
    await page.goto('/supervision');
    await expect(page).toHaveURL('/supervision');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should block unauthenticated access to all protected routes', async ({ page }) => {
    // Clear auth
    await page.context().clearCookies();

    const protectedRoutes = ['/dashboard', '/clients', '/commandes', '/equipe', '/supervision'];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/login/, { timeout: 5_000 });
    }
  });
});
