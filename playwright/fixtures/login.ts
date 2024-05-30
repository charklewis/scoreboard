import { faker } from '@faker-js/faker'
import { type TestFixture, type PlaywrightTestArgs, expect } from '@playwright/test'
import promiseRetry from 'promise-retry'
import { getOneTimeCodeFromGmail } from 'playwright/support'

type Fixture = {
  login: () => Promise<string>
  sandboxLogin: () => Promise<string>
  verifyLogin: (email: string) => Promise<void>
  logout: () => Promise<void>
  createEmail: () => string
  getOneTimeCode: (email: string) => Promise<string>
}

const SANDBOX_EMAIL = 'sandbox@stytch.com'

const generateEmail = () => {
  const emailId = faker.string.nanoid()
  return `scoreboard.test.email+${emailId}@gmail.com`
}

const fetchOneTimeCode = async (email: string) => {
  return promiseRetry(
    async (retry) => {
      return getOneTimeCodeFromGmail(email)
        .then((code) => {
          if (code) return code
          throw new Error('no code')
        })
        .catch(retry)
    },
    { retries: 20 }
  )
}

const createEmail: TestFixture<Fixture['createEmail'], PlaywrightTestArgs> = async ({}, use) => {
  await use(generateEmail)
}

const getOneTimeCode: TestFixture<Fixture['getOneTimeCode'], PlaywrightTestArgs> = async ({}, use) => {
  await use(fetchOneTimeCode)
}

const login: TestFixture<Fixture['login'], PlaywrightTestArgs> = async ({ page }, use) => {
  const login = async () => {
    const email = generateEmail()

    await page.getByTestId(/input-email/i).fill(email)
    await page.getByTestId(/button-sign-in/i).click()

    const code = await fetchOneTimeCode(email)

    await page.getByTestId(/input-code-0/i).pressSequentially(code)
    await page.getByTestId(/button-submit-otp/i).click()
    await page.waitForURL(/dashboard/i)
    return email
  }
  await use(login)
}

const sandboxLogin: TestFixture<Fixture['sandboxLogin'], PlaywrightTestArgs> = async ({ page }, use) => {
  const login = async () => {
    const email = SANDBOX_EMAIL
    const code = '000000'
    await page.getByTestId(/input-email/i).fill(email)
    await page.getByTestId(/button-sign-in/i).click()
    await page.getByTestId(/input-code-0/i).pressSequentially(code)
    await page.getByTestId(/button-submit-otp/i).click()
    return email
  }
  await use(login)
}

const verifyLogin: TestFixture<Fixture['verifyLogin'], PlaywrightTestArgs> = async ({ page }, use) => {
  const verifyLogin = async (email: string) => {
    await expect(page.getByTestId(/dashboard-content/i)).toBeVisible()
    await page.getByTestId(/button-navbar-profile/i).click()
    const user = email === SANDBOX_EMAIL ? 'User' : email
    await expect(page.getByText(user)).toBeVisible()
    await page.getByTestId(/button-navbar-profile/i).click()
    await expect(page.getByText(user)).not.toBeVisible()
  }
  await use(verifyLogin)
}

const logout: TestFixture<Fixture['logout'], PlaywrightTestArgs> = async ({ page }, use) => {
  const logout = async () => {
    await page.getByTestId(/button-navbar-profile/i).click()
    await page.getByTestId(/link-logout/i).click()
  }
  await use(logout)
}

const fixture = { login, sandboxLogin, verifyLogin, logout, createEmail, getOneTimeCode }

export { fixture, type Fixture }
