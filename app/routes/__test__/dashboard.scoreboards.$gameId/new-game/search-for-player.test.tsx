import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { screen, within } from '@testing-library/react'
import { test, vi, type Mock } from 'vitest'
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
  const { user } = renderWithRouter(<SearchForPlayer playerLimitReached={false} addPlayer={addPlayer} />, path, loader)
  await screen.findByText(/search for a player to add to the game/i)
  await user.type(screen.getByTestId(/input-search-for-player/i), player.name)
  const options = screen.getByTestId(/container-search-for-player-options/i)
  await user.click(within(options).getByText(player.name))
  expect(addPlayer).toHaveBeenCalledWith(player)
})

test('the input will be disabled there are no players', async () => {
  const loader = vi.fn().mockReturnValue({ players: [] })
  renderWithRouter(<SearchForPlayer playerLimitReached={false} addPlayer={vi.fn()} />, path, loader)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toHaveProperty('readOnly', true)
})

test('the input will be disabled the player limit is reached ', async () => {
  const players = [createPlayer(), createPlayer()]
  const loader = vi.fn().mockReturnValue({ players })
  renderWithRouter(<SearchForPlayer playerLimitReached={true} addPlayer={vi.fn()} />, path, loader)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toHaveProperty('readOnly', true)
})

test('the input will be disabled if navigation state is not idle', async () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const loader = vi.fn().mockReturnValue({ players: [createPlayer(), createPlayer()] })
  renderWithRouter(<SearchForPlayer playerLimitReached={false} addPlayer={vi.fn()} />, path, loader)
  const input = await screen.findByTestId(/input-search-for-player/i)
  expect(input).toHaveProperty('readOnly', true)
})
