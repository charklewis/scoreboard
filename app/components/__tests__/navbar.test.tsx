import { expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import { Navbar } from '~/components/navbar'
import { renderWithRouter } from '~/test-utils'

const path = '/dashboard'

test('renders a navbar', async () => {
  renderWithRouter([{ path, element: <Navbar user={faker.internet.email()} /> }])
  await screen.findByText(/scoreboards/i)
  screen.getByTestId(/image-navbar-logo/i)
  screen.getByTestId(/button-navbar-new-game/i)
})

test('start a new game', async () => {
  const action = vi.fn().mockReturnValue(null)
  const { user } = renderWithRouter([
    { path, element: <Navbar user={faker.internet.email()} /> },
    { path: '/dashboard/scoreboards', action },
  ])
  await screen.findByText(/scoreboards/i)
  await act(() => user.click(screen.getByText(/new game/i)))
  await act(() => user.click(screen.getByText(/scrabble/i)))
  expect(action).toHaveBeenCalled()
})

test('can open the user profile', async () => {
  const email = faker.internet.email()
  const { user } = renderWithRouter([{ path, element: <Navbar user={email} /> }])
  await screen.findByText(/scoreboards/i)
  await act(() => user.click(screen.getByTestId('button-navbar-profile')))
  await screen.findByText(/settings/i)
  screen.getByText(email)
  screen.getByText(/log out/i)
})

test('can open and close the mobile menu', async () => {
  const { user } = renderWithRouter([{ path, element: <Navbar user={faker.internet.email()} /> }])
  await screen.findByText(/scoreboards/i)
  await act(() => user.click(screen.getByLabelText(/open menu/i)))
  await screen.findByTestId(/link-mobile-scoreboard/i)
  await act(() => user.click(screen.getByLabelText(/close menu/i)))
})
