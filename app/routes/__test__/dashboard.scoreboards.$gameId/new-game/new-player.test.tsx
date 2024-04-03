import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import { CreateNewPlayer } from '~/routes/dashboard.scoreboards.$gameId/new-game/new-player'
import { renderWithRouter } from '~/test-utils'

const path = `/dashboard/scoreboard/${faker.string.uuid()}`

test('user can create a new player', async () => {
  const name = faker.person.fullName()
  const action = vi.fn().mockReturnValue(null)
  const routes = [{ path, element: <CreateNewPlayer />, action }]
  const { user } = renderWithRouter(routes)

  const button = await screen.findByTestId(/button-create-new-player/i)
  await act(() => user.click(button))

  await screen.findByText(/create new player/i, { selector: 'header' })

  await act(() => user.type(screen.getByTestId(/input-name/i), name))
  await act(() => user.click(screen.getByText(/add player/i)))
  expect(action).toHaveBeenCalled()
})
