import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { act, screen } from '@testing-library/react'
import { test, vi, type Mock, expect, beforeEach } from 'vitest'
import { SearchForPlayer } from '~/routes/dashboard.scoreboards.$gameId/new-game/search-for-player'
import { createPlayer, renderWithRouter } from '~/test-utils'

vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useNavigation: vi.fn() }
})

const path = `/dashboard/scoreboards/${faker.string.uuid()}`
const MockUseNavigation = useNavigation as Mock

beforeEach(() => {
  MockUseNavigation.mockReturnValue({ state: 'idle' })
})

test('a user can search for a player', async () => {
  const player = createPlayer()
  const players = [createPlayer(), player, createPlayer()]
  const addPlayer = vi.fn()
  const loader = vi.fn().mockReturnValue({ players })
  const element = <SearchForPlayer playerLimitReached={false} addPlayer={addPlayer} selectedPlayers={[]} />
  const routes = [{ path, element, loader }]
  const { user } = renderWithRouter(routes)
  await screen.findByPlaceholderText(/search for a player to add to the game/i)
  await act(() => user.type(screen.getByTestId(/input-search-for-player/i), player.name))
  await act(() => user.click(screen.getByTestId(`search-for-player-${player.id}`)))
  expect(addPlayer).toHaveBeenCalledWith(player)
})

test('the input will be disabled there are no players', async () => {
  const loader = vi.fn().mockReturnValue({ players: [] })
  const element = <SearchForPlayer playerLimitReached={false} addPlayer={vi.fn()} selectedPlayers={[]} />
  const routes = [{ path, element, loader }]
  renderWithRouter(routes)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toBeDisabled()
})

test('the input will be disabled the player limit is reached ', async () => {
  const players = [createPlayer(), createPlayer()]
  const loader = vi.fn().mockReturnValue({ players })
  const element = <SearchForPlayer playerLimitReached={true} addPlayer={vi.fn()} selectedPlayers={[]} />
  const routes = [{ path, element, loader }]
  renderWithRouter(routes)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toBeDisabled()
})

test('the input will be disabled if navigation state is not idle', async () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const loader = vi.fn().mockReturnValue({ players: [createPlayer(), createPlayer()] })
  const element = <SearchForPlayer playerLimitReached={true} addPlayer={vi.fn()} selectedPlayers={[]} />
  const routes = [{ path, element, loader }]
  renderWithRouter(routes)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toBeDisabled()
})

test('selected players do not show up as options', async () => {
  const playerA = createPlayer()
  const playerB = createPlayer()
  const playerC = createPlayer()
  const players = [playerA, playerB, playerC]
  const addPlayer = vi.fn()
  const loader = vi.fn().mockReturnValue({ players })
  const selectedPlayers = [playerB.id]
  const element = <SearchForPlayer playerLimitReached={false} addPlayer={addPlayer} selectedPlayers={selectedPlayers} />
  const routes = [{ path, element, loader }]
  const { user } = renderWithRouter(routes)
  await screen.findByPlaceholderText(/search for a player to add to the game/i)
  await act(() => user.click(screen.getByTestId(/input-search-for-player/i)))
  screen.getByTestId(`search-for-player-${playerA.id}`)
  screen.getByTestId(`search-for-player-${playerC.id}`)
  expect(screen.queryByText(playerB.name)).not.toBeInTheDocument()
})
