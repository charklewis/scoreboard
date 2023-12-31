import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, test } from 'playwright/fixtures'

beforeEach(async ({ page }) => {
  await page.goto('/')
})

describe('desktop', () => {
  test('a user can login and logout', async ({ page, sandboxLogin, baseURL }) => {
    await sandboxLogin()

    await expect(page.getByTestId(/dashboard-content/i)).toBeVisible()
    await page.getByTestId(/link-logout/i).click()

    await page.waitForURL(`${baseURL}/login`)
  })
})

describe('mobile', () => {
  test('a user can login and logout', async ({ page, sandboxLogin, within, baseURL }) => {
    await sandboxLogin()

    await expect(page.getByTestId(/dashboard-content/i)).toBeVisible()

    await page.getByTestId(/button-sidebar-mobile/i).click()

    const sidebar = within(page.getByTestId(/navbar-mobile/i))
    await sidebar.getByTestId(/link-logout/i).click()

    await page.waitForURL(`${baseURL}/login`)
  })
})

test('a user resend a code', async ({ page }) => {
  await page.getByTestId(/input-email/i).fill('sandbox@stytch.com')
  await page.getByTestId(/button-sign-in/i).click()

  await page.getByTestId(/input-code-0/i).pressSequentially(faker.string.numeric(6))
  await page.getByTestId(/button-submit-otp/i).click()
  await expect(page.getByTestId(/error-message-code/i)).toHaveText(/your code was not valid/i)

  await page.getByTestId(/button-resend-otp/i).click()
  await expect(page.getByTestId(/resend-code-timestamp/i)).toHaveText(/sent:/i)
})
