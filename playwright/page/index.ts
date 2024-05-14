import { type Page as PlaywrightPage } from '@playwright/test'
import { Scrabble } from './scrabble'
import { Settings } from './settings'

class Page {
  readonly scrabble: Scrabble
  readonly settings: Settings

  constructor(page: PlaywrightPage, mode: 'mobile' | 'desktop') {
    this.scrabble = new Scrabble(page, mode)
    this.settings = new Settings(page, mode)
  }
}

export { Page }
