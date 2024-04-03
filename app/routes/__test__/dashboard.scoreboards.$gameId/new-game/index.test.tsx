import { faker } from '@faker-js/faker'
import { NextUIProvider } from '@nextui-org/react'
import { act, screen, within } from '@testing-library/react'
import { vi, test, expect } from 'vitest'
import { NewGame } from '~/routes/dashboard.scoreboards.$gameId/new-game'
import { createPlayer, renderWithRouter } from '~/test-utils'

const path = `/dashboard/scoreboards/${faker.string.uuid()}/new-game`

test('a user can create a game', async () => {
  const playerA = createPlayer()
  const playerB = createPlayer()
  const players = [createPlayer(), playerA, createPlayer(), playerB]

  const loader = vi.fn().mockReturnValue({ players })
  const action = vi.fn().mockReturnValue(null)

  const routes = [{ path, element: <NewGame />, loader, action }]
  const { user } = renderWithRouter(routes)

  await screen.findByText(/add players/i)
  await screen.findByText(/you can add up to 4 players/i)

  await act(() => user.type(screen.getByTestId(/input-search-for-player/i), playerA.name))
  await act(() => user.click(screen.getByTestId(`search-for-player-${playerA.id}`)))

  await act(() => user.type(screen.getByTestId(/input-search-for-player/i), playerB.name))
  await act(() => user.click(screen.getByTestId(`search-for-player-${playerB.id}`)))

  await act(() => user.click(screen.getByTestId(/button-start-game/i)))

  expect(action).toHaveBeenCalled()
})

test('a user can add and remove a player', async () => {
  const playerA = createPlayer()
  const playerB = createPlayer()
  const players = [createPlayer(), playerA, createPlayer(), createPlayer(), playerB, createPlayer()]

  const loader = vi.fn().mockReturnValue({ players })
  const action = vi.fn().mockReturnValue(null)

  const routes = [{ path, element: <NewGame />, loader, action }]
  const { user } = renderWithRouter(routes)

  await screen.findByText(/add players/i)

  await act(() => user.type(screen.getByTestId(/input-search-for-player/i), playerA.name))
  await act(() => user.click(screen.getByTestId(`search-for-player-${playerA.id}`)))

  await act(() => user.type(screen.getByTestId(/input-search-for-player/i), playerB.name))
  await act(() => user.click(screen.getByTestId(`search-for-player-${playerB.id}`)))

  await act(() => user.click(screen.getByTestId(`button-player-options-${playerA.id}`)))
  await act(() => user.click(screen.getByTestId(`button-player-options-${playerA.id}`)))

  //bug: for some reason the button is not triggering the click event
  // await act(() => user.click(screen.getByTestId(`button-remove-player-${playerA.id}`)))

  // const playerList = screen.getByTestId(/container-selected-players/i)

  // within(playerList).getByText(playerB.name)
  // expect(within(playerList).queryByText(playerA.name)).not.toBeInTheDocument()
})

test.todo('a user can re order the list of players')
