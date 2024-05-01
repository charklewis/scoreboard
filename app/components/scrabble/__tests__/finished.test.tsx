import { test } from 'vitest'
import { faker } from '@faker-js/faker'
import { render, screen, within } from '@testing-library/react'

import { createPlayer, createRound } from '~/test-utils'

import { Finished } from '../finished'

test('displays the players and their scores', () => {
  const players = faker.helpers.multiple(createPlayer, { count: faker.number.int({ min: 2, max: 4 }) })
  const rounds = faker.helpers.multiple(() => createRound({ players }), {
    count: faker.number.int({ min: 2, max: 10 }),
  })

  render(<Finished rounds={rounds} />)

  screen.getByText(/scrabble/i)

  for (const player of players) {
    const card = screen.getByTestId(`scores-player-${player.id}`)
    within(card).getByText(player.emoji)
    within(card).getByText(player.name)
    within(card).getByText(/score/i)
  }

  if (players.length >= 2) {
    screen.getByText(/🥇/)
    screen.getByText(/1st place/i)
    screen.getByText(/🥈/)
    screen.getByText(/2nd place/i)
  }
  if (players.length >= 3) {
    screen.getByText(/🥉/)
    screen.getByText(/3rd place/i)
  }
  if (players.length >= 4) {
    screen.getByText(/4th place/i)
  }
})

test('displays the rounds with players as columns and their scores as rows', () => {
  const players = faker.helpers.multiple(createPlayer, { count: faker.number.int({ min: 2, max: 24 }) })
  const rounds = faker.helpers.multiple(
    () => createRound({ players: players.map((player) => ({ ...player, score: faker.number.int() })) }),
    { count: faker.number.int({ min: 2, max: 10 }) }
  )

  render(<Finished rounds={rounds} />)

  screen.getByText(/rounds/i)

  const table = screen.getByTestId('table-rounds')

  for (const player of players) {
    within(table).getByText(player.name)
  }

  for (const round of rounds) {
    for (const player of round.players) {
      within(table).getByText(player.score)
    }
  }
})

test('renders a message if there are no rounds', () => {
  render(<Finished rounds={[]} />)
  screen.getByText(/no rounds have been played/i)
})
