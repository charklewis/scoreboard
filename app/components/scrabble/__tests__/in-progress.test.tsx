import { expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen, within } from '@testing-library/react'

import { InProgress } from '~/components/scrabble/in-progress'
import { renderWithRouter } from '~/test-utils'

import { InProgressContext } from '../in-progress-context'

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
  roundCompleted = false,
} = {}) {
  return { id: faker.string.uuid(), roundNumber, roundCompleted, players }
}

test('renders the rounds for a scrabble game', async () => {
  const roundOne = createRound({ roundNumber: 1 })
  const roundTwo = createRound({ roundNumber: 2 })
  const roundThree = createRound({ roundNumber: 3 })
  const rounds = [roundOne, roundTwo, roundThree]
  const route = [{ path: '/scrabble', element: <InProgress rounds={rounds} /> }]
  const { user } = renderWithRouter(route)

  await screen.findByTestId(/rounds-title/i)
  screen.getByText(/finish game/i)
  screen.getByText(/add round/i)

  for (const round of rounds) {
    await act(() => user.click(screen.getByText(round.roundNumber)))
    const roundComponent = await screen.findByTestId(`form-round-${round.roundNumber}`)
    for (const player of round.players) {
      const playerComponent = within(roundComponent).getByTestId(`round-player-${player.id}`)
      within(playerComponent).getByText(player.name)
      within(playerComponent).getByDisplayValue(player.score)
      await act(() => user.type(within(playerComponent).getByLabelText(/score/i), faker.string.numeric()))
    }
  }
})

test("auto selects the first round that isn't complete", async () => {
  const roundOne = createRound({ roundNumber: 1, roundCompleted: true })
  const roundTwo = createRound({ roundNumber: 2 })
  const roundThree = createRound({ roundNumber: 3 })
  const rounds = [roundOne, roundTwo, roundThree]
  const route = [{ path: '/scrabble', element: <InProgress rounds={rounds} /> }]
  renderWithRouter(route)

  await screen.findByTestId(/rounds-title/i)

  screen.getByTestId(`form-round-${roundTwo.roundNumber}`)
})

test('user can hide the total scores', async () => {
  const round = createRound({ roundNumber: 1 })
  const route = [
    {
      path: '/scrabble',
      element: (
        <InProgressContext>
          <InProgress rounds={[round]} />
        </InProgressContext>
      ),
    },
  ]
  renderWithRouter(route)

  await screen.findByTestId(/rounds-title/i)

  for (const player of round.players) {
    expect(screen.getByTestId(`player-${player.id}-total-score`)).toHaveTextContent(`Score ${player.totalScore}`)
  }

  await act(() => screen.getByTestId(/switch-show-score/i).click())

  for (const player of round.players) {
    expect(screen.getByTestId(`player-${player.id}-total-score`)).toHaveTextContent('Score ∗∗∗')
  }
})
