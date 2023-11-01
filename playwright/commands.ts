import { test as base } from '@playwright/test'
import { locatorFixtures, type LocatorFixtures } from '@playwright-testing-library/test/fixture.js'

const test = base.extend<LocatorFixtures>(locatorFixtures)

const { expect, describe, beforeEach } = test

export { expect, describe, beforeEach, test }
