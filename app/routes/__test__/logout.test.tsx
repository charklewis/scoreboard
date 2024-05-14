import { type Mock, describe, expect, test, vi } from 'vitest'

import { loader } from '~/routes/logout'
import { identity } from '~/services/identity.server'
import { createRequest } from '~/test-utils'

vi.mock('~/services/identity.server', () => ({ identity: { logout: vi.fn() } }))

const LogoutMock = identity.logout as Mock

describe('loader', () => {
  test('the identity logout function is called', async () => {
    LogoutMock.mockResolvedValue(true)
    const request = createRequest({ pathname: '/logout' })
    const response = await loader(request)
    expect(identity.logout).toHaveBeenCalled()
    expect(response).toBe(true)
  })
  test('the identity logout function is not called if the user is on the login route', async () => {
    const request = createRequest({ pathname: '/login' })
    const response = await loader(request)
    expect(identity.logout).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})
