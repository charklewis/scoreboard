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

export { renderWithRouter }
