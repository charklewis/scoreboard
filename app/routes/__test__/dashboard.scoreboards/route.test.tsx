import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, describe, vi } from 'vitest'
import Scoreboards from '~/routes/dashboard.scoreboards/route'
import { createScoreboardList, renderWithRouter } from '~/test-utils'

vi.mock('~/routes/dashboard.scoreboards/api.server', () => ({ fetchScoreboards: vi.fn(), insertGame: vi.fn() }))

describe('action', () => {
  test.todo('the action scrabble will create a new game')
})

describe('loader', () => {
  test.todo('if there are scoreboards it will return them')
  test.todo('if there are no scoreboards it will return an empty array')
  test.todo('it will return an empty array if the user is not authenticated')
})

describe('component', () => {
  test('renders players in a list', async () => {
    const list = createScoreboardList()
    const routes = [{ path: '/', element: <Scoreboards />, loader: vi.fn().mockReturnValue(json(list)) }]
    renderWithRouter(routes)

    for (const scoreboard of list) {
      await screen.findByText(scoreboard.title)
      screen.getByText(scoreboard.createdAt.toDateString())
      screen.getByTestId(`link-${scoreboard.id}`)
      //note: commented out until change to new DB
      // for (const player of scoreboard.players) {
      //   screen.getByTestId(`player-${player.id}`)
      //   const element = screen.getByTestId(`player-${player.id}`)
      //   await user.hover(within(element).getByText(player.emoji))
      //   // bug: this isn't working
      //   // await within(element).findByText(player.name)
      // }
    }
  })

  test('renders an empty list', async () => {
    const routes = [{ path: '/', element: <Scoreboards /> }]
    renderWithRouter(routes)
    await screen.findByText(/no scoreboards/i)
  })
})
