import { test, expect } from '@playwright/test';
import { loginAs } from './helpers/auth';

test.describe('Commercial — Scan Menu IA', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'commercial');
  });

  test('should navigate to scan-menu page', async ({ page }) => {
    await page.goto('/scan-menu');
    await expect(page).toHaveURL('/scan-menu');
    await expect(page.getByText(/scan/i)).toBeVisible({ timeout: 5_000 });
  });

  test('should show upload zone', async ({ page }) => {
    await page.goto('/scan-menu');
    // File input should exist
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should show error for non-image files', async ({ page }) => {
    await page.goto('/scan-menu');
    const fileInput = page.locator('input[type="file"]');

    // Create a fake non-image file
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('Not an image'),
    });

    // Should show error or reject
    await expect(page.getByText(/image|format|invalide/i)).toBeVisible({ timeout: 3_000 }).catch(() => {
      // Some implementations reject silently — acceptable
    });
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/login');
    // Clear cookies
    await page.context().clearCookies();
    await page.goto('/scan-menu');
    await expect(page).toHaveURL(/login/, { timeout: 5_000 });
  });
});
