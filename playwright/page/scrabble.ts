import { faker } from '@faker-js/faker'
import { type Page, expect } from '@playwright/test'
import { getOrdinalSuffix } from 'playwright/support/helpers'

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
      const gameId = this.page.url().split('scoreboards/')[1]
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
    await expect(this.page.getByText(/rounds/i)).toBeVisible()
    await expect(this.page.getByTestId(/button-game-options/i)).toBeVisible()
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

      if (i < scores.length - 1) {
        await this.page.getByTestId(/button-game-options/i).click()
        await this.page.getByTestId(/button-game-options-add-round/i).click()
      }
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

  async useWordChecker() {
    await this.page.getByTestId(/button-game-options/i).click()
    await this.page.getByTestId(/button-game-options-dictionary/i).click()
    await expect(this.page.getByTestId(/form-check-word/i)).toBeVisible()

    //check invalid word
    await this.page.getByTestId(/input-word/i).fill(faker.string.alpha())
    await this.page.getByTestId(/button-submit-check-word/i).click()
    await expect(this.page.getByText(/this is not an official scrabble word/i)).toBeVisible()

    //check valid word
    const word = {
      value: 'oxyphenbutazone',
      score: 41,
      meaning: 'a phenylbutazone derivative having antiinflammatory, analgesic, and antipyretic effects',
    }

    await this.page.getByTestId(/input-word/i).clear()
    await this.page.getByTestId(/input-word/i).fill(word.value)
    await this.page.getByTestId(/button-submit-check-word/i).click()
    await expect(this.page.getByTestId(/check-word-score/i)).toHaveText(String(word.score))
    await expect(this.page.getByTestId(/check-word-meaning/i)).toHaveText(word.meaning)

    //note: this should work, but a weird bug in some package is preventing it
    // await this.page.keyboard.press('Escape')
    //so for now, click outside the modal
    await this.page.mouse.click(0, 0)
  }

  async toggleShowScore(playerIds: string[]) {
    await this.page.getByTestId(/button-game-options/i).click()
    await this.page.getByTestId(/button-game-options-scores/i).click()
    await expect(this.page.getByTestId(/button-game-options/i)).toHaveCount(1)
    for (const id of playerIds) {
      await expect(this.page.getByTestId(`player-${id}-total-score`)).toHaveText(/score ∗∗∗/i)
    }
    await this.page.getByTestId(/button-game-options/i).click()
    await this.page.getByTestId(/button-game-options-scores/i).click()
    await expect(this.page.getByTestId(/button-game-options/i)).toHaveCount(1)
    for (const id of playerIds) {
      await expect(this.page.getByTestId(`player-${id}-total-score`)).toHaveText(/score \d+/i)
    }
  }

  async finishGame() {
    await this.page.getByTestId(/button-game-options/i).click()
    await this.page.getByTestId(/button-game-options-end-game/i).click()
    await this.page.getByTestId(/button-end-game/i).click()
    await expect(this.page.getByTestId(/rounds-title/i)).toBeVisible()
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

  async verifyGameResults(scores: Record<string, number>[], rounds: number) {
    const cumulativeScores = this.getCumulativeScores(scores, rounds)
    const sortedPlayers = Object.entries(cumulativeScores).sort((a, b) => b[1] - a[1])

    for (let i = 0; i < sortedPlayers.length; i++) {
      const [player, score] = sortedPlayers[i]
      const card = this.page.getByTestId(`scores-player-${player}`)
      const place = getOrdinalSuffix(i + 1)
      await expect(card).toContainText(`${place} place`)
      await expect(card.getByTestId(`scores-player-${player}-total-score`)).toContainText(String(score))
    }

    const table = this.page.getByTestId(/table-rounds/i)

    for (const round of scores) {
      for (const [player, score] of Object.entries(round)) {
        await expect(table.getByTestId(`table-rounds-cell-${player}-${score}`)).toContainText(String(score))
      }
    }
  }
}

export { Scrabble }
