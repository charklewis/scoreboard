import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL: process.env.BASE_URL || 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', grepInvert: /mobile/, use: { ...devices['Desktop Chrome'] } },
    { name: 'safari', grepInvert: /desktop/, use: { ...devices['iPhone 14'] } },
  ],
})
