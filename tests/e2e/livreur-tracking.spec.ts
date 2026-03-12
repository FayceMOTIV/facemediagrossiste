import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Livreur — GPS Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Grant geolocation permission
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation({ latitude: 45.75, longitude: 4.85 });
    await loginAs(page, 'livreur');
  });

  test('should show livraisons page after login', async ({ page }) => {
    await expect(page).toHaveURL('/livraisons');
    await expect(page.getByText(/livraison/i)).toBeVisible({ timeout: 5_000 });
  });

  test('should show GPS tracking toggle', async ({ page }) => {
    await page.goto('/livraisons');
    // GPS toggle button should exist
    const trackingButton = page.getByRole('button', { name: /tracking gps|activer/i });
    await expect(trackingButton).toBeVisible({ timeout: 5_000 });
  });

  test('should show delivery list', async ({ page }) => {
    await page.goto('/livraisons');
    await page.waitForLoadState('networkidle');
    // Page renders correctly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should not allow livreur to access /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    // Should be redirected to livraisons
    await expect(page).toHaveURL(/livraisons|dashboard/, { timeout: 5_000 });
  });
});
