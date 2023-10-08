import { screen, within } from '@testing-library/react'
import { test, expect } from 'vitest'
import Dashboard from '~/routes/dashboard/route'
import { renderWithRouter } from '~/test-utils'

const path = '/dashboard'

test('renders a mobile view of the sidebar', async () => {
  const { user } = renderWithRouter(<Dashboard />, path)

  await user.click(screen.getByTestId(/button-sidebar-mobile/i))
  within(screen.getByTestId(/navbar-mobile/i)).getByText(/scoreboards/i)

  await user.click(screen.getByTestId(/button-sidebar-mobile-close/i))
  expect(screen.queryByTestId(/navbar-mobile/i)).not.toBeInTheDocument()
})

test('renders a desktop view of the sidebar', async () => {
  const { user } = renderWithRouter(<Dashboard />, path)

  within(screen.getByTestId(/navbar-desktop/i)).getByText(/scoreboards/i)

  await user.click(screen.getByTestId(/button-sidebar-desktop/i))
  expect(screen.getByTestId(/navbar-desktop/i)).not.toHaveClass('xl:fixed')
})
