import { faker } from '@faker-js/faker'
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
    expect(this.page.getByText(/next round/i)).toBeVisible()
    expect(this.page.getByText(/finish game/i)).toBeVisible()
  }

  async getPlayerIds(players: string[]) {
    let ids = []
    for (const player of players) {
      const text = this.page.getByText(player)
      const parent = this.page.getByTestId(/round-player-/i).filter({ has: text })
      const testId = await parent.getAttribute('data-testid')
      if (testId) ids.push(testId.replace('round-player-', ''))
    }
    return ids
  }

  async playRounds(scores: Record<string, number>[]) {
    for (let i = 0; i < scores.length; i++) {
      expect(this.page.getByTestId(/list-rounds/).filter({ hasText: String(i + 1) })).toBeVisible()
      await this.checkCumulativeScores(scores, i)
      const round = [scores[i]]
      await this.playRound(round, i + 1)
      await this.waitForScoresToBeSaved()
      await this.page.getByTestId(/button-add-round/i).click()
    }
  }

  async playRound(players: Record<string, number>[], roundNumber: number) {
    const component = this.page.getByTestId(`form-round-${roundNumber}`)
    for (const player of players) {
      for (const [key, value] of Object.entries(player)) {
        await component.getByTestId(`input-${key}`).fill(String(value))
      }
    }
  }

  async checkCumulativeScores(scores: Record<string, number>[], currentRound: number) {
    const cumulativeScores = this.getCumulativeScores(scores, currentRound)
    for (const [player, score] of Object.entries(cumulativeScores)) {
      await this.page
        .getByTestId(`player-${player}-total-score`)
        .innerText()
        .then((text) => expect(text).toContain(String(score)))
    }
  }

  async waitForScoresToBeSaved() {
    await expect(this.page.getByText(/score saved/i)).toBeVisible()
    await expect(this.page.getByText(/score saved/i)).toHaveCount(0)
  }

  async finishGame() {
    await this.page.getByTestId(/button-end-game/i).click()
    await this.page.getByText(/finished/i)
  }

  generateScores(players: string[], numberOfRounds: number) {
    return Array.from({ length: numberOfRounds }, () =>
      players.reduce(
        (scores, player) => ({ ...scores, [player]: faker.number.int({ min: 0, max: 100 }) }),
        {} as Record<string, number>
      )
    )
  }

  getCumulativeScores(scores: Record<string, number>[], currentRound: number) {
    return scores
      .slice(0, currentRound)
      .reduce(
        (scores, round) =>
          Object.entries(round).reduce(
            (scores, [player, score]) => ({ ...scores, [player]: (scores[player] || 0) + score }),
            scores
          ),
        {} as Record<string, number>
      )
  }

  generateNumberOfRounds() {
    return faker.number.int({ min: 2, max: 3 })
  }

  generatePlayers() {
    return Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.person.fullName())
  }
}

export { Scrabble }
