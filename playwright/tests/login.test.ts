import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, test } from 'playwright/fixtures'

test.describe.configure({ mode: 'parallel' })

beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('a user can login and logout', async ({ page, sandboxLogin, logout, verifyLogin, baseURL }) => {
  const email = await sandboxLogin()
  await verifyLogin(email)
  await logout()
  await page.waitForURL(`${baseURL}/login`)
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
