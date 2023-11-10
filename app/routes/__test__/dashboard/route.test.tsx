import { screen, within } from '@testing-library/react'
import { test, expect, describe } from 'vitest'
import Dashboard from '~/routes/dashboard/route'
import { renderWithRouter } from '~/test-utils'

const path = '/dashboard'

describe('loader', () => {
  test.todo('redirects to scoreboards if the path is empty')
})

describe('component', () => {
  test('renders a mobile view of the sidebar', async () => {
    const { user } = renderWithRouter(<Dashboard />, path)
    const button = await screen.findByTestId(/button-sidebar-mobile/i)
    await user.click(button)
    within(screen.getByTestId(/navbar-mobile/i)).getByText(/scoreboards/i)

    await user.click(screen.getByTestId(/button-sidebar-mobile-close/i))
    expect(screen.queryByTestId(/navbar-mobile/i)).not.toBeInTheDocument()
  })

  test('renders a desktop view of the sidebar', async () => {
    const { user } = renderWithRouter(<Dashboard />, path)
    const container = await screen.findByTestId(/navbar-desktop/i)
    within(container).getByText(/scoreboards/i)

    await user.click(screen.getByTestId(/button-sidebar-desktop/i))
    expect(screen.getByTestId(/navbar-desktop/i)).not.toHaveClass('xl:fixed')
  })
})
