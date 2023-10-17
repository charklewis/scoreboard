import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

function renderWithRouter(element: ReactNode, path: string) {
  const user = userEvent.setup()
  const action = vi.fn().mockReturnValue(null)
  const routes = [{ path, element, action }]
  const route = createMemoryRouter(routes, { initialEntries: [path] })
  const view = render(<RouterProvider router={route} />)
  return { ...view, user, action }
}

const createPlayer = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  background: faker.color.rgb(),
  emoji: faker.internet.emoji(),
})

const createScoreboard = () => ({
  id: faker.string.uuid(),
  title: faker.lorem.word(),
  createdAt: faker.date.past(),
  players: Array(faker.number.int({ min: 2, max: 6 }))
    .fill(0)
    .map(() => createPlayer()),
})

const createScoreboardList = () =>
  Array(faker.number.int({ min: 1, max: 15 }))
    .fill(0)
    .map(() => createScoreboard())

export { renderWithRouter, createPlayer, createScoreboard, createScoreboardList }
