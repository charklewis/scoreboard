import { type Page as PlaywrightPage } from '@playwright/test'
import { Scrabble } from './scrabble'

class Page {
  readonly scrabble: Scrabble

  constructor(page: PlaywrightPage, mode: 'mobile' | 'desktop') {
    this.scrabble = new Scrabble(page, mode)
  }
}

export { Page }
