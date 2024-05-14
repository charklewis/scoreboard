import { test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen, within } from '@testing-library/react'

import { Round } from '~/components/scrabble/round'
import { renderWithRouter } from '~/test-utils'

function createPlayer({ score = 0, totalScore = 0 } = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    background: faker.color.human(),
    emoji: faker.internet.emoji(),
    score,
    totalScore,
  }
}

function createRound({
  roundNumber = 1,
  players = faker.helpers.uniqueArray(createPlayer, faker.number.int({ min: 1, max: 5 })),
} = {}) {
  return { id: faker.string.uuid(), roundNumber, roundCompleted: false, players }
}

test('renders the players and score for a round', async () => {
  const round = createRound()
  const { user } = renderWithRouter([{ path: '/', element: <Round round={round} /> }])

  await screen.findByTestId(`form-round-${round.roundNumber}`)

  for (const player of round.players) {
    const container = screen.getByTestId(`round-player-${player.id}`)
    within(container).getByText(player.name)
    within(container).getByTestId(`player-${player.id}`)
    const score = faker.string.numeric()
    const input = within(container).getByTestId(`input-${player.id}`)
    await act(() => user.type(input, score))
  }
})

test('renders the current score and total score for each player', async () => {
  const players = [
    createPlayer({ score: faker.number.int(), totalScore: faker.number.int() }),
    createPlayer({ score: faker.number.int(), totalScore: faker.number.int() }),
  ]
  const round = createRound({ players })
  renderWithRouter([{ path: '/', element: <Round round={round} /> }])

  await screen.findByTestId(`form-round-${round.roundNumber}`)

  for (const player of round.players) {
    const container = screen.getByTestId(`round-player-${player.id}`)
    within(container).getByDisplayValue(player.score)
    within(container).getByText(`score ${player.totalScore}`, { exact: false })
  }
})

test('shows a toast when the score is saved', async () => {
  const round = createRound()
  const action = vi.fn().mockReturnValue({ success: true })
  const { user } = renderWithRouter([{ path: '/', element: <Round round={round} />, action }])

  await screen.findByTestId(`form-round-${round.roundNumber}`)

  const player = round.players[0]

  const container = screen.getByTestId(`round-player-${player.id}`)
  const score = faker.number.int()
  const input = within(container).getByTestId(`input-${player.id}`)
  await act(() => user.type(input, String(score)))

  await screen.findByText(/score saved/i)
})

test('shows a toast when there is an error saving the score', async () => {
  const round = createRound()
  const error = faker.lorem.sentence({ min: 2, max: 3 })
  const action = vi.fn().mockReturnValue({ error })
  const { user } = renderWithRouter([{ path: '/', element: <Round round={round} />, action }])

  await screen.findByTestId(`form-round-${round.roundNumber}`)

  const player = round.players[0]

  const container = screen.getByTestId(`round-player-${player.id}`)
  const score = faker.number.int()
  const input = within(container).getByTestId(`input-${player.id}`)
  await act(() => user.type(input, String(score)))

  await screen.findByText(error)
})
