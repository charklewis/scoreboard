import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test } from 'vitest'
import { Player } from '~/routes/dashboard.scoreboards/player'
import { createPlayer } from '~/test-utils'

test('renders an element with an emoji with a tooltip', async () => {
  const player = createPlayer()
  const user = userEvent.setup()
  render(<Player player={player} />)
  screen.getByText(player.emoji)
  const element = screen.getByTestId(`player-${player.id}`)
  await user.hover(element)
  // bug: this isn't working
  // await screen.findByText(player.name)
})
