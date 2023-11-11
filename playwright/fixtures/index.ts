import { test as base } from '@playwright/test'
import { locatorFixtures, type LocatorFixtures } from '@playwright-testing-library/test/fixture.js'
import { fixture as login, type Fixture as Login } from './login'

const test = base.extend<Login & LocatorFixtures>({ ...login, ...locatorFixtures })

const { expect, describe, beforeEach, beforeAll } = test

export { expect, describe, beforeEach, beforeAll, test }
