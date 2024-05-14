import { beforeEach, expect, test } from 'playwright/fixtures'
import { Page } from 'playwright/page'

test.describe.configure({ mode: 'parallel' })

beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('a user can update their email', async ({ page, login, createEmail, getOneTimeCode }) => {
  const email = await login()
  const pages = new Page(page, 'desktop') // or 'mobile' does not matter
  await pages.settings.goToSettings()
  await pages.settings.verifyAccountEmail(email)

  const newEmail = createEmail()
  await pages.settings.updateEmail(newEmail)
  const code = await getOneTimeCode(newEmail)
  await pages.settings.verifyNewEmail(code, newEmail)
  await pages.settings.verifyAccountEmail(newEmail)
})
