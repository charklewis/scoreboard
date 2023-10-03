import { describe, test, expect, vi, type Mock } from 'vitest'
import { loader } from '~/routes/logout'
import { identity } from '~/services/identity.server'

vi.mock('~/services/identity.server', () => ({ identity: { logout: vi.fn() } }))

describe('loader', () => {
  test('the identity logout function is called', async () => {
    (identity.logout as Mock).mockResolvedValue(true)
    const response = await loader({
      request: new Request('http://test/logout'),
      params: {},
      context: {},
    })
    expect(identity.logout).toHaveBeenCalled()
    expect(response).toBe(true)
  })
  test('the identity logout function is not called if the user is on the login route', async () => {
    const response = await loader({
      request: new Request('http://test/login'),
      params: {},
      context: {},
    })
    expect(identity.logout).not.toHaveBeenCalled()
    expect(response).toBeNull()
  })
})
