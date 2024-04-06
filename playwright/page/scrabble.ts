import { type Page, expect } from '@playwright/test'

class Scrabble {
  readonly page: Page
  readonly mode: 'mobile' | 'desktop'

  constructor(page: Page, mode: 'mobile' | 'desktop') {
    this.page = page
    this.mode = mode
  }

  async createNewGame() {
    await this.page.getByTestId(/button-navbar-new-game/i).click()
    await this.page.getByTestId(/button-navbar-new-game-scrabble/i).click()
    await this.page.waitForURL(/scoreboards\/[A-Za-z0-9]+/i)
    if (this.mode === 'mobile') {
      const gameId = await this.page.url().split('scoreboards/')[1]
      await this.page.getByTestId(`link-${gameId}`).click()
    }
    await expect(this.page.getByText(/you can add up to 4 players/i)).toBeVisible()
    await this.page.getByText(/^add players$/i).click()
  }

  async createNewPlayers(players: string[]) {
    for (const player of players) {
      await this.page.getByTestId(/button-create-new-player/i).click()
      await this.page.getByTestId(/input-name/i).fill(player)
      await this.page.getByTestId(/button-submit-create-new-player/i).click()
    }
  }

  async addPlayers(players: string[]) {
    for (const player of players) {
      await this.page.getByTestId(/input-search-for-player/i).fill(player)
      const options = await this.page.$$('li')
      for (const option of options) {
        const optionText = await option.innerText()
        if (optionText.includes(player)) {
          await option.click()
          break
        }
      }
    }
  }

  async startGame() {
    await this.page.getByTestId(/button-start-game/i).click()
    await this.page.getByText(/in progress/i)
  }
}

export { Scrabble }
