import { json } from '@remix-run/node'
import { describe, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'

import Scoreboards from '~/routes/dashboard.scoreboards.$gameId/route'
import { renderWithRouter } from '~/test-utils'

const path = `/dashboard/scoreboards/${faker.string.uuid()}`

vi.mock('~/services/identity.server', () => ({ isAuthenticated: vi.fn() }))
vi.mock('~/routes/dashboard.scoreboards.$gameId/api.server', () => ({
  fetchScoreboardAndPlayers: vi.fn(),
  insertPlayer: vi.fn(),
  startGame: vi.fn(),
}))

describe('action', () => {
  test.todo('the action createNewPlayer will insert a new player')
})

describe('loader', () => {
  test.todo('if there are players it will return them along with the game status')
  test.todo('it will return an empty array for players and a status of error if the user is not authenticated')
})

describe('component', () => {
  test('user can create a new game', async () => {
    const loader = vi.fn().mockReturnValue(json({ gameStatus: 'new', players: [] }))
    const routes = [{ path, element: <Scoreboards />, loader }]
    renderWithRouter(routes)
    await screen.findByText(/add players/i)
    screen.getByText(/you can add up to 4 players/i)
  })

  test('user can play a game', async () => {
    const loader = vi.fn().mockReturnValue(json({ gameStatus: 'in-progress', players: [] }))
    const routes = [{ path, element: <Scoreboards />, loader }]
    renderWithRouter(routes)
    await screen.findByText(/game type not supported/i)
  })

  test('user view a finished game', async () => {
    const loader = vi.fn().mockReturnValue(json({ gameType: 'scrabble', gameStatus: 'finished', players: [] }))
    const routes = [{ path, element: <Scoreboards />, loader }]
    renderWithRouter(routes)
    await screen.findByTestId(/rounds-title/i)
  })

  test('user will receive an error', async () => {
    const loader = vi.fn().mockReturnValue(json({ gameType: 'scrabble', gameStatus: 'error', players: [] }))
    const routes = [{ path, element: <Scoreboards />, loader }]
    renderWithRouter(routes)
    await screen.findByText(/error/i)
  })
})
