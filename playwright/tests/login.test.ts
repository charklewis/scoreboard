import { faker } from '@faker-js/faker'
import { test } from 'playwright/commands'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('desktop', () => {
  test('a user can login and logout', async ({ page }) => {
    await page.getByTestId(/input-email/i).fill('sandbox@stytch.com')
    await page.getByTestId(/button-sign-in/i).click()

    await page.getByTestId(/input-code-0/i).pressSequentially('000000')
    await page.getByTestId(/button-submit-otp/i).click()

    await test.expect(page.getByTestId(/dashboard-content/i)).toBeVisible()
    await page.getByTestId(/link-logout/i).click()
  })
})

test.describe('mobile', () => {
  test('a user can login and logout', async ({ page, within }) => {
    await page.getByTestId(/input-email/i).fill('sandbox@stytch.com')
    await page.getByTestId(/button-sign-in/i).click()

    await page.getByTestId(/input-code-0/i).pressSequentially('000000')
    await page.getByTestId(/button-submit-otp/i).click()

    await test.expect(page.getByTestId(/dashboard-content/i)).toBeVisible()

    await page.getByTestId(/button-sidebar-mobile/i).click()

    const sidebar = within(page.getByTestId(/navbar-mobile/i))
    await sidebar.getByTestId(/link-logout/i).click()
  })
})

test('a user resend a code', async ({ page }) => {
  await page.getByTestId(/input-email/i).fill('sandbox@stytch.com')
  await page.getByTestId(/button-sign-in/i).click()

  await page.getByTestId(/input-code-0/i).pressSequentially(faker.string.numeric(6))
  await page.getByTestId(/button-submit-otp/i).click()
  await test.expect(page.getByTestId(/error-message-code/i)).toHaveText(/your code was not valid/i)

  await page.getByTestId(/button-resend-otp/i).click()
  await test.expect(page.getByTestId(/resend-code-timestamp/i)).toHaveText(/sent:/i)
})
