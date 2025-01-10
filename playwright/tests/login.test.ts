import { test } from 'playwright/fixtures'

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:5173/sign-in')
})

test('a user can login and logout', async ({ login, logout }) => {
	const email = await login({ sandbox: true })
	// await verifyLogin(email)
	await logout()
})
