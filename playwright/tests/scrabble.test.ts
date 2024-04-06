import { faker } from '@faker-js/faker'
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
  test('start a scrabble game', async ({ page }) => {
    const pages = new Page(page, 'desktop')
    await pages.scrabble.createNewGame()
    const firstPlayer = faker.person.fullName()
    const secondPlayer = faker.person.fullName()
    await pages.scrabble.createNewPlayers([firstPlayer, secondPlayer])
    await pages.scrabble.addPlayers([firstPlayer, secondPlayer])
    await pages.scrabble.startGame()
  })
})

describe('mobile', () => {
  test('start a scrabble game', async ({ page }) => {
    const pages = new Page(page, 'mobile')
    await pages.scrabble.createNewGame()
    const firstPlayer = faker.person.fullName()
    const secondPlayer = faker.person.fullName()
    await pages.scrabble.createNewPlayers([firstPlayer, secondPlayer])
    await pages.scrabble.addPlayers([firstPlayer, secondPlayer])
    await pages.scrabble.startGame()
  })
})
