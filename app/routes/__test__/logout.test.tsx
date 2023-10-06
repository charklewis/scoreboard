import { describe, test, expect, vi, type Mock } from 'vitest'
import { loader } from '~/routes/logout'
import { identity } from '~/services/identity.server'

vi.mock('~/services/identity.server', () => ({ identity: { logout: vi.fn() } }))

const LogoutMock = identity.logout as Mock

function createRequest(route: string) {
  return {
    request: new Request(`http://test${route}`),
    params: {},
    context: {},
  }
}

describe('loader', () => {
  test('the identity logout function is called', async () => {
    LogoutMock.mockResolvedValue(true)
    const request = createRequest('/logout')
    const response = await loader(request)
    expect(identity.logout).toHaveBeenCalled()
    expect(response).toBe(true)
  })
  test('the identity logout function is not called if the user is on the login route', async () => {
    const request = createRequest('/login')
    const response = await loader(request)
    expect(identity.logout).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})
