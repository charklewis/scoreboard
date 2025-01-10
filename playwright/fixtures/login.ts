import { faker } from '@faker-js/faker'
import { type TestFixture, type PlaywrightTestArgs } from '@playwright/test'

type Fixture = {
	login: (options: Partial<{ sandbox: boolean }> | undefined) => Promise<string>
	logout: () => Promise<void>
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

const logout: TestFixture<Fixture['logout'], PlaywrightTestArgs> = async ({ page }, use) => {
	const logout: Fixture['logout'] = async () => {
		await page.goto('/sign-out')
		await page.waitForURL(/sign-in/i)
	}
	await use(logout)
}

const fixture = { login, logout }

export { fixture, type Fixture }
