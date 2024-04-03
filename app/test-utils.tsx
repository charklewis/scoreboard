import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { type Mock, vi } from 'vitest'

type Route = {
  path: string
  element?: ReactNode
  action?: Mock<any, any>
  loader?: Mock<any, any>
}

function renderWithRouter(routeList: Route[]) {
  const user = userEvent.setup()
  const routes = routeList.map(({ path, element, action, loader }) => ({
    path,
    element: element ?? null,
    action: action ?? vi.fn().mockReturnValue(null),
    loader: loader ?? vi.fn().mockReturnValue(null),
  }))
  const route = createMemoryRouter(routes, { initialEntries: [routes[0].path || '/'] })
  const view = render(<RouterProvider router={route} />)
  return { ...view, user, routes }
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
  createdAt: faker.date.past({ years: 5 }),
  players: Array(faker.number.int({ min: 2, max: 6 }))
    .fill(0)
    .map(() => createPlayer()),
})

const createScoreboardList = () =>
  Array(faker.number.int({ min: 1, max: 15 }))
    .fill(0)
    .map(() => createScoreboard())

export { renderWithRouter, createPlayer, createScoreboard, createScoreboardList }
