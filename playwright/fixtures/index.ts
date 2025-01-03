import { test as base } from '@playwright/test'
import { fixture as login, type Fixture as Login } from './login'

const test = base.extend<Login>({ ...login })

export { test }
