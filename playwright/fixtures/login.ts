import { faker } from '@faker-js/faker'
import { type TestFixture, type PlaywrightTestArgs, expect } from '@playwright/test'

type Fixture = {
  login: (options: Partial<{ sandbox: boolean }> | undefined) => Promise<string>
}

const SANDBOX_EMAIL = 'sandbox@stytch.com'

const generateEmail = () => {
  const emailId = faker.string.nanoid()
  return `scoreboard.test.email+${emailId}@gmail.com`
}

const login: TestFixture<Fixture['login'], PlaywrightTestArgs> = async ({ page }, use) => {
  const login: Fixture['login'] = async ({ sandbox } = {}) => {
    const email = sandbox ? SANDBOX_EMAIL : generateEmail()

    await page.getByLabel(/email/i).fill(email)
    await page.getByText(/continue/i).click()

    const code = sandbox ? '000000' : '123456'

    await page.getByTestId(/input-code/i).pressSequentially(code)
    await page.getByText(/verify code/i).click()
    await page.waitForURL(/dashboard/i)
    return email
  }
  await use(login)
}

const fixture = { login }

export { fixture, type Fixture }
