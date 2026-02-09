import { test, expect } from '@playwright/test';

test('login page has title and login form', async ({ page }) => {
    await page.goto('/login');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/AuthFlow/);

    // Check for email and password inputs
    await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('********')).toBeVisible();

    // Check for login button
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
});

test('login with invalid credentials stays on page', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('name@example.com').fill('invalid@example.com');
    await page.getByPlaceholder('********').fill('wrongpassword');
    await page.getByRole('button', { name: /Sign in/i }).click();

    // Wait a bit for potential redirect or error
    await page.waitForTimeout(2000);

    // Verify we are still on login page
    await expect(page).toHaveURL(/.*login/);

    // Verify button is still there (meaning we didn't crash or redirect to 404)
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
});
