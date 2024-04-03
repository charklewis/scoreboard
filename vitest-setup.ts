import { beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import '@testing-library/jest-dom/vitest'

//require for @headlessui/react Transition & Dialog
global.ResizeObserver = require('resize-observer-polyfill')

vi.mock('stytch', async () => {
  const Client = vi.fn()
  Client.prototype.otps = {
    authenticate: vi.fn().mockResolvedValue({ status_code: 200, user_id: faker.string.uuid() }),
    email: { loginOrCreate: vi.fn().mockResolvedValue({ status_code: 200, email_id: faker.string.uuid() }) },
  }
  return { Client }
})

beforeEach(() => {
  window['scrollTo'] = vi.fn() as any
})
