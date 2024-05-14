import { json } from '@remix-run/node'
import { type Mock, describe, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import Dashboard, { loader } from '~/routes/dashboard/route'
import { getUserEmail, identity } from '~/services/identity.server'
import { createRequest, renderWithRouter } from '~/test-utils'

vi.mock('~/services/identity.server', () => ({
  identity: { isAuthenticated: vi.fn() },
  getUserEmail: vi.fn(),
}))

const IsAuthenticatedMock = identity.isAuthenticated as Mock
const GetUserEmailMock = getUserEmail as Mock

describe('loader', () => {
  test('redirects to scoreboards if the path is dashboard', async () => {
    const request = createRequest({ pathname: 'dashboard' })
    const response = await loader(request)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/dashboard/scoreboards')
  })

  test('redirects to scoreboards if the path is dashboard (trailing slash)', async () => {
    const request = createRequest({ pathname: 'dashboard/' })
    const response = await loader(request)
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/dashboard/scoreboards')
  })

  test('returns the user email if the user is authenticated', async () => {
    const request = createRequest()
    const email = faker.internet.email()
    IsAuthenticatedMock.mockResolvedValue({ stytchId: faker.string.uuid() })
    GetUserEmailMock.mockResolvedValue(email)
    const response = await loader(request).then((res) => res.json())
    expect(response).toEqual({ email })
  })
})

describe('component', () => {
  test('renders a navbar', async () => {
    const email = faker.internet.email()
    const routes = [{ path: '/dashboard', element: <Dashboard />, loader: vi.fn().mockReturnValue(json({ email })) }]
    const { user } = renderWithRouter(routes)
    await screen.findByText(/scoreboard/i)
    await act(() => user.click(screen.getByTestId('button-navbar-profile')))
    await screen.findByText(email)
  })
})
