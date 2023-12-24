import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type Mock, beforeEach, vi, test, expect } from 'vitest'
import { type Player as PlayerType } from '~/routes/dashboard.scoreboards.$gameId/api.server'
import { Player } from '~/routes/dashboard.scoreboards.$gameId/new-game/player'
import { createPlayer } from '~/test-utils'

vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useNavigation: vi.fn() }
})

const MockUseNavigation = useNavigation as Mock

beforeEach(() => {
  MockUseNavigation.mockReturnValue({ state: 'idle' })
})

test('renders a player', () => {
  const player = createPlayer() as PlayerType
  render(<Player player={player} index={faker.number.int()} removePlayer={vi.fn()} />)
  screen.getByText(player.name)
  screen.getByText(player.emoji)
})

test('can remove a player', async () => {
  const player = createPlayer() as PlayerType
  const removePlayer = vi.fn()
  const user = userEvent.setup()
  render(<Player player={player} index={faker.number.int()} removePlayer={removePlayer} />)
  await user.click(screen.getByTestId(`button-remove-player-${player.id}`))
  expect(removePlayer).toHaveBeenCalledWith(player.id)
})
