import { test, expect } from 'playwright/fixtures'

test('website loads', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('/login')
  await expect(page.getByText(/Sign in to your account/i)).toBeVisible()
})
