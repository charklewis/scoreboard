import { test } from 'playwright/fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/sign-in')
})

test('a user can login and logout', async ({ login }) => {
  const email = await login({ sandbox: true })

  //verify login
  // await verifyLogin(email)
  // await logout()
  // await page.waitForURL(`${baseURL}/login`)
})
