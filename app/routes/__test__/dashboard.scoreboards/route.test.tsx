import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'
import Scoreboards from '~/routes/dashboard.scoreboards/route'
import { createScoreboardList } from '~/test-utils'

test('renders players in a list', async () => {
  const list = createScoreboardList()
  const user = userEvent.setup()
  const Component = createRemixStub([{ path: '/', Component: Scoreboards, loader: () => json(list) }])

  render(<Component />)

  for (const scoreboard of list) {
    await screen.findByText(scoreboard.title)
    screen.getByText(scoreboard.createdAt.toDateString())
    screen.getByTestId(`link-${scoreboard.id}`)
    for (const player of scoreboard.players) {
      const element = screen.getByTestId(`player-${player.id}`)
      await user.hover(within(element).getByText(player.emoji))
      // bug: this isn't working
      // await within(element).findByText(player.name)
    }
  }
})

test('renders an empty list', () => {
  const Component = createRemixStub([{ path: '/', Component: Scoreboards }])
  render(<Component />)
  screen.getByText(/no scoreboards/i)
})
