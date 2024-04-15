import { beforeEach, describe, test } from 'playwright/fixtures'
import { Page } from 'playwright/page'

beforeEach(async ({ page, login }, testInfo) => {
  //note: find a way todo this on the login fixture
  testInfo.setTimeout(testInfo.timeout + 30000)
  await page.goto('/')
  await login()
  await page.waitForURL(/scoreboards/i)
})

describe('desktop', () => {
  test('play a scrabble game', async ({ page }) => {
    const pages = new Page(page, 'desktop')
    await pages.scrabble.createNewGame()
    const players = pages.scrabble.generatePlayers()
    await pages.scrabble.createNewPlayers(players)
    await pages.scrabble.addPlayers(players)
    await pages.scrabble.startGame()
    const playerIds = await pages.scrabble.getPlayerIds(players)
    const rounds = pages.scrabble.generateNumberOfRounds()
    const scores = await pages.scrabble.generateScores(playerIds, rounds)
    await pages.scrabble.playRounds(scores)
    await pages.scrabble.finishGame()
  })
})

describe('mobile', () => {
  test('play a scrabble game', async ({ page }) => {
    const pages = new Page(page, 'mobile')
    await pages.scrabble.createNewGame()
    const players = pages.scrabble.generatePlayers()
    await pages.scrabble.createNewPlayers(players)
    await pages.scrabble.addPlayers(players)
    await pages.scrabble.startGame()
    const playerIds = await pages.scrabble.getPlayerIds(players)
    const rounds = pages.scrabble.generateNumberOfRounds()
    const scores = await pages.scrabble.generateScores(playerIds, rounds)
    await pages.scrabble.playRounds(scores)
    await pages.scrabble.finishGame()
  })
})
