import { test as base } from '@playwright/test'
import {
  locatorFixtures as fixtures,
  LocatorFixtures as TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture.js'

const test = base.extend<TestingLibraryFixtures>(fixtures)

export { test }
