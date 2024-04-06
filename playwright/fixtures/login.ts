import { faker } from '@faker-js/faker'
import { type TestFixture, type PlaywrightTestArgs } from '@playwright/test'
import promiseRetry from 'promise-retry'
import { getOneTimeCodeEmail } from 'playwright/support'

type Fixture = {
  login: () => Promise<string>
  sandboxLogin: () => Promise<string>
  logout: () => Promise<void>
}

const login: TestFixture<Fixture['login'], PlaywrightTestArgs> = async ({ page }, use) => {
  const login = async () => {
    const emailId = faker.string.uuid()
    const email = `scoreboard.test.email+${emailId}@gmail.com`

    await page.getByTestId(/input-email/i).fill(email)
    await page.getByTestId(/button-sign-in/i).click()

    const code = await promiseRetry(
      async (retry) => {
        return getOneTimeCodeEmail(email)
          .then((code) => {
            if (code) return code
            throw new Error('no code')
          })
          .catch(retry)
      },
      { retries: 20 }
    )

    await page.getByTestId(/input-code-0/i).pressSequentially(code)
    await page.getByTestId(/button-submit-otp/i).click()
    await page.waitForURL(/dashboard/i)
    return email
  }
  await use(login)
}

const sandboxLogin: TestFixture<Fixture['sandboxLogin'], PlaywrightTestArgs> = async ({ page }, use) => {
  const login = async () => {
    const email = 'sandbox@stytch.com'
    const code = '000000'
    await page.getByTestId(/input-email/i).fill(email)
    await page.getByTestId(/button-sign-in/i).click()
    await page.getByTestId(/input-code-0/i).pressSequentially(code)
    await page.getByTestId(/button-submit-otp/i).click()
    return email
  }
  await use(login)
}

const logout: TestFixture<Fixture['logout'], PlaywrightTestArgs> = async ({ page }, use) => {
  const logout = async () => {
    await page.getByTestId(/button-navbar-profile/i).click()
    await page.getByTestId(/link-logout/i).click()
  }
  await use(logout)
}

const fixture = { login, sandboxLogin, logout }

export { fixture, type Fixture }
