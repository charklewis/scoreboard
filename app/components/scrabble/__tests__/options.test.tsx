import { json } from '@remix-run/node'
import { expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import { InProgressContext } from '~/components/scrabble/in-progress-context'
import { Options } from '~/components/scrabble/options'
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
  roundCompleted = false,
} = {}) {
  return { id: faker.string.uuid(), roundNumber, roundCompleted, players }
}

test('user can open a dictionary', async () => {
  const round = createRound()
  const route = [
    {
      path: '/',
      element: <Options rounds={[round]} selectedRound={String(round.roundNumber)} setSelectedRound={vi.fn()} />,
    },
  ]
  const { user } = renderWithRouter(route)

  const button = await screen.findByText(/game options/i)
  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/dictionary/i)))
  await screen.findByTestId(/modal-check-word/i)
})

test('user can open a timer', async () => {
  const round = createRound()
  const route = [
    {
      path: '/',
      element: <Options rounds={[round]} selectedRound={String(round.roundNumber)} setSelectedRound={vi.fn()} />,
    },
  ]
  const { user } = renderWithRouter(route)

  const button = await screen.findByText(/game options/i)
  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/timer/i)))
  await screen.findByTestId(/modal-timer/i)
})

test('user can add a round', async () => {
  const round = createRound()
  const action = vi.fn().mockReturnValue(json({ success: true }))
  const setSelectedRound = vi.fn()
  const route = [
    {
      path: '/scrabble',
      element: (
        <Options
          rounds={[round, createRound()]}
          selectedRound={String(round.roundNumber)}
          setSelectedRound={setSelectedRound}
        />
      ),
      action,
    },
  ]
  const { user } = renderWithRouter(route)

  const button = await screen.findByText(/game options/i)
  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/add round/i)))
  expect(setSelectedRound).toHaveBeenCalled()
})

test('user can hide/show scores', async () => {
  const round = createRound()
  const route = [
    {
      path: '/',
      element: (
        <InProgressContext>
          <Options rounds={[round]} selectedRound={String(round.roundNumber)} setSelectedRound={vi.fn()} />
        </InProgressContext>
      ),
    },
  ]
  const { user } = renderWithRouter(route)

  const button = await screen.findByText(/game options/i)

  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/hide scores/i)))

  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/show scores/i)))
})

test('user can end the game', async () => {
  const round = createRound()
  const route = [
    {
      path: '/',
      element: <Options rounds={[round]} selectedRound={String(round.roundNumber)} setSelectedRound={vi.fn()} />,
    },
  ]
  const { user } = renderWithRouter(route)

  const button = await screen.findByText(/game options/i)
  await act(() => user.click(button))
  await act(() => user.click(screen.getByText(/end game/i)))
  await screen.findByTestId(/modal-end-game/i)
})
