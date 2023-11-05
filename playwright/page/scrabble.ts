import { type Page, expect } from '@playwright/test'

class Scrabble {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async createNewGame() {
    await this.page.getByTestId(/button-add-new-scoreboard/i).click()
    await this.page.getByTestId(/button-new-scoreboard-scrabble/i).click()
    await expect(this.page.getByText(/you can add up to 4 players/i)).toBeVisible()
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
      const options = this.page.getByTestId(/container-search-for-player-options/i)
      await options.getByText(player).click()
    }
  }

  async startGame() {
    await this.page.getByTestId(/button-start-game/i).click()
    this.page.getByText(/in progress/i)
  }
}

export { Scrabble }
