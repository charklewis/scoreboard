import { describe, test } from 'vitest'
import { screen } from '@testing-library/react'

import Dashboard from '~/routes/dashboard/route'
import { renderWithRouter } from '~/test-utils'

const path = '/dashboard'

describe('loader', () => {
  test.todo('redirects to scoreboards if the path is empty')
})

describe('component', () => {
  test('renders a navbar', async () => {
    const routes = [{ path, element: <Dashboard /> }]
    renderWithRouter(routes)
    await screen.findByText(/scoreboard/i)
    screen.getByLabelText(/open/i)
  })
})
