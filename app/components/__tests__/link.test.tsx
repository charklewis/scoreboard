import { render as renderRTL, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import { Link } from '../link'
import { faker } from '@faker-js/faker'
import { type ComponentProps } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

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
