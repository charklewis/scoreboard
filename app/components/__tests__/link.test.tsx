import { type ComponentProps } from 'react'
import { expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { render as renderRTL, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Link } from '../link'

const render = ({ ...props }: ComponentProps<typeof Link>) => {
  const routes = [{ path: '/', element: <Link {...props} /> }]
  const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
  return renderRTL(<RouterProvider router={router} />)
}

test('renders a link', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.word()
  const href = faker.internet.url()
  render({ id, text, href })
  const input = screen.getByTestId(`link-${id}`)
  expect(input).toHaveAttribute('href', href)
})
