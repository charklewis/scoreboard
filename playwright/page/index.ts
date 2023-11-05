import { type Page as PlaywrightPage } from '@playwright/test'
import { Scrabble } from './scrabble'

class Page {
  readonly scrabble: Scrabble

  constructor(page: PlaywrightPage) {
    this.scrabble = new Scrabble(page)
  }
}

export { Page }
