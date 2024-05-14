import { expect, type Page } from '@playwright/test'

class Settings {
  readonly page: Page
  readonly mode: 'mobile' | 'desktop'

  constructor(page: Page, mode: 'mobile' | 'desktop') {
    this.page = page
    this.mode = mode
  }

  async goToSettings() {
    await this.page.getByTestId(/button-navbar-profile/i).click()
    await this.page.getByTestId(/link-settings/i).click()
    await this.page.waitForURL(`**/settings`)
  }

  async verifyAccountEmail(email: string) {
    await expect(this.page.getByTestId(/input-email/i)).toHaveValue(email)
    await this.page.getByTestId(/button-navbar-profile/i).click()
    await expect(this.page.getByTestId(/navbar-text-email/i)).toHaveText(email)
    await this.page.getByTestId(/button-navbar-profile/i).click()
  }

  async updateEmail(email: string) {
    await this.page.getByTestId(/input-email/i).clear()
    await this.page.getByTestId(/input-email/i).fill(email)
    await this.page.getByTestId(/button-save-email/i).click()
  }

  async verifyNewEmail(code: string, email: string) {
    const modal = this.page.getByTestId(/modal-check-word/i)
    await expect(modal).toBeVisible()

    await this.page.getByTestId(/input-code-0/i).pressSequentially(code)
    await this.page.getByTestId(/button-submit-otp/i).click()

    const successMessage = this.page.getByText(/your email verification is complete/i)
    await expect(successMessage).toBeVisible()
    await expect(this.page.getByText(email)).toBeVisible()

    await this.page.getByTestId(/button-close-update-email/i).click()
    await expect(modal).not.toBeVisible()
  }
}

export { Settings }
