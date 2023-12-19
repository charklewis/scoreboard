import { faker } from '@faker-js/faker'
import { screen, within } from '@testing-library/react'
import { vi, test, expect } from 'vitest'
import { NewGame } from '~/routes/dashboard.scoreboards.$gameId/new-game'
import { createPlayer, renderWithRouter } from '~/test-utils'

const path = `/dashboard/scoreboards/${faker.string.uuid()}/new-game`

test('a user can create a game', async () => {
  const playerA = createPlayer()
  const playerB = createPlayer()
  const players = [createPlayer(), playerA, createPlayer(), playerB]
  const loader = vi.fn().mockReturnValue({ players })
  const { user, action } = renderWithRouter(<NewGame />, path, loader)

  await screen.findByText(/add players/i)
  await screen.findByText(/you can add up to 4 players/i)

  await user.type(screen.getByTestId(/input-search-for-player/i), playerA.name)
  await user.click(within(screen.getByTestId(/container-search-for-player-options/i)).getByText(playerA.name))

  await user.type(screen.getByTestId(/input-search-for-player/i), playerB.name)
  await user.click(within(screen.getByTestId(/container-search-for-player-options/i)).getByText(playerB.name))

  await user.click(screen.getByTestId(/button-start-game/i))

  expect(action).toHaveBeenCalled()
})

test('a user can add and remove a player', async () => {
  const playerA = createPlayer()
  const playerB = createPlayer()
  const players = [createPlayer(), playerA, createPlayer(), createPlayer(), playerB, createPlayer()]
  const loader = vi.fn().mockReturnValue({ players })
  const { user } = renderWithRouter(<NewGame />, path, loader)

  await screen.findByText(/add players/i)

  await user.type(screen.getByTestId(/input-search-for-player/i), playerA.name)
  await user.click(within(screen.getByTestId(/container-search-for-player-options/i)).getByText(playerA.name))

  await user.type(screen.getByTestId(/input-search-for-player/i), playerB.name)
  await user.click(within(screen.getByTestId(/container-search-for-player-options/i)).getByText(playerB.name))

  await user.click(screen.getByTestId(`button-remove-player-${playerA.id}`))

  const playerList = screen.getByTestId(/container-selected-players/i)

  within(playerList).getByText(playerB.name)
  expect(within(playerList).queryByText(playerA.name)).not.toBeInTheDocument()
})

test.todo('a user can drag the order of a player')
