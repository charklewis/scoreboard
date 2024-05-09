import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'blob' : 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: process.env.CI ? 'off' : 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', grepInvert: /mobile/, use: { ...devices['Desktop Chrome'] } },
    { name: 'safari', grepInvert: /desktop/, use: { ...devices['iPhone 14'] } },
  ],
})
