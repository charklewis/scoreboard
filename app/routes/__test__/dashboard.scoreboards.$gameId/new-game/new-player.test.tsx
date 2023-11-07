import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { CreateNewPlayer } from '~/routes/dashboard.scoreboards.$gameId/new-game/new-player'
import { renderWithRouter } from '~/test-utils'

const path = `/dashboard/scoreboard/${faker.string.uuid()}`

test('user can create a new player', async () => {
  const name = faker.person.fullName()
  const { user, action } = renderWithRouter(<CreateNewPlayer />, path)
  await user.click(screen.getByText(/create new player/i))
  screen.getByTestId(/modal-new-player/i)
  screen.getByText(/this player will be available for all games/i)
  await user.type(screen.getByTestId(/input-name/i), name)
  await user.click(screen.getByText(/add player/i))
  expect(action).toHaveBeenCalled()
})
