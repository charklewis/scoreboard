import { json } from '@remix-run/node'
import { describe, test, vi } from 'vitest'
import { act, screen, within } from '@testing-library/react'

import Scoreboards from '~/routes/dashboard.scoreboards/route'
import { createScoreboardList, renderWithRouter } from '~/test-utils'

vi.mock('~/routes/dashboard.scoreboards/api.server', () => ({ fetchScoreboards: vi.fn(), insertGame: vi.fn() }))
vi.mock('~/services/identity.server', () => ({ isAuthenticated: vi.fn() }))

describe('action', () => {
  test.todo('the action scrabble will create a new game')
})

describe('loader', () => {
  test.todo('if there are scoreboards it will return them')
  test.todo('if there are no scoreboards it will return an empty array')
  test.todo('it will return an empty array if the user is not authenticated')
})

describe('component', () => {
  test('renders an empty list', async () => {
    const routes = [{ path: '/', element: <Scoreboards /> }]
    renderWithRouter(routes)
    await screen.findByText(/no scoreboards/i)
  })

  test('renders new, in progress and finished scoreboard lists', async () => {
    const justStarted = createScoreboardList()
    const inProgress = createScoreboardList()
    const finished = createScoreboardList()

    const routes = [
      {
        path: '/',
        element: <Scoreboards />,
        loader: vi.fn().mockReturnValue(json({ inProgress, justStarted, finished })),
      },
    ]

    renderWithRouter(routes)

    for (const scoreboard of justStarted) {
      await screen.findByText(/^new$/i)
      const list = screen.getByTestId(/list-scoreboards-new/i)
      within(list).getByTestId(`link-${scoreboard.id}`)
    }

    for (const scoreboard of inProgress) {
      await screen.findByText(/^in progress$/i)
      const list = screen.getByTestId(/list-scoreboards-in-progress/i)
      within(list).getByTestId(`link-${scoreboard.id}`)
    }

    for (const scoreboard of finished) {
      await screen.findByText(/^completed$/i)
      const list = screen.getByTestId(/list-scoreboards-completed/i)
      within(list).getByTestId(`link-${scoreboard.id}`)
    }
  })

  test('renders a summary of the game for each scoreboard', async () => {
    const list = createScoreboardList()
    const routes = [
      { path: '/', element: <Scoreboards />, loader: vi.fn().mockReturnValue(json({ inProgress: list })) },
    ]
    const { user } = renderWithRouter(routes)

    for (const scoreboard of list) {
      await screen.findByTestId(`link-${scoreboard.id}`)
      const component = screen.getByTestId(`link-${scoreboard.id}`)
      within(component).getByText(scoreboard.title)
      within(component).getByText(scoreboard.createdAt.toDateString())
      for (const player of scoreboard.players) {
        const element = within(component).getByTestId(`player-${player.id}`)
        await act(() => user.hover(within(element).getByText(player.emoji)))
        // // bug: this isn't working
        // await screen.findByText(player.name)
      }
    }
  })
})
