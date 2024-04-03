import { test, expect, vi, beforeEach, type Mock } from 'vitest'
import { useNavigation } from '@remix-run/react'
import { faker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import { act, render as renderRTL, screen } from '@testing-library/react'
import { type ComponentProps } from 'react'
import { Button } from '../button'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useNavigation: vi.fn() }
})

const useNavigationMock = useNavigation as Mock

const render = ({ ...props }: ComponentProps<typeof Button>) => {
  const routes = [{ path: '/', element: <Button {...props} /> }]
  const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
  return renderRTL(<RouterProvider router={router} />)
}

beforeEach(() => {
  useNavigationMock.mockReturnValue({ state: 'idle' })
})

test('renders a button', async () => {
  const id = faker.lorem.word()
  const text = faker.lorem.word()
  const onClick = vi.fn()
  const user = userEvent.setup()
  render({ id, text, onClick })
  await act(() => user.click(screen.getByTestId(`button-${id}`)))
  expect(onClick).toHaveBeenCalled()
})

test('the button is disabled if isDisabled is true', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.word()
  render({ id, text, isDisabled: true })
  const input = screen.getByTestId(`button-${id}`)
  expect(input).toBeDisabled()
})

test('the button is the navigation state is not idle', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.word()
  useNavigationMock.mockReturnValue({ state: 'loading' })
  render({ id, text })
  const input = screen.getByTestId(`button-${id}`)
  expect(input).toBeDisabled()
})
