import type { Page } from '@playwright/test';

export const TEST_CREDENTIALS = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@test.distram.fr',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'TestAdmin123!',
  },
  commercial: {
    email: process.env.E2E_COMMERCIAL_EMAIL ?? 'commercial@test.distram.fr',
    password: process.env.E2E_COMMERCIAL_PASSWORD ?? 'TestCommercial123!',
  },
  livreur: {
    email: process.env.E2E_LIVREUR_EMAIL ?? 'livreur@test.distram.fr',
    password: process.env.E2E_LIVREUR_PASSWORD ?? 'TestLivreur123!',
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL ?? 'manager@test.distram.fr',
    password: process.env.E2E_MANAGER_PASSWORD ?? 'TestManager123!',
  },
} as const;

export async function loginAs(page: Page, role: keyof typeof TEST_CREDENTIALS): Promise<void> {
  const creds = TEST_CREDENTIALS[role];
  await page.goto('/login');
  await page.fill('input[type="email"]', creds.email);
  await page.fill('input[type="password"]', creds.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|livraisons|commandes)/, { timeout: 10_000 });
}

export async function logout(page: Page): Promise<void> {
  // Find and click logout button
  const logoutButton = page.getByRole('button', { name: /déconnexion|logout/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
  await page.waitForURL('/login', { timeout: 5_000 });
}
