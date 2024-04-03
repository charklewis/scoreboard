import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { act, render as renderRTL, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, type Mock } from 'vitest'
import { useForm } from '~/components/form/form'
import { Button } from '~/components/form/button'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { type ComponentProps } from 'react'

vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false }) }))
vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useNavigation: vi.fn() }
})

const useNavigationMock = useNavigation as Mock
const UseFormMock = useForm as Mock

beforeEach(() => {
  UseFormMock.mockReturnValue({ isLoading: false })
  useNavigationMock.mockReturnValue({ formAction: '', state: 'idle' })
})

const render = ({ ...props }: ComponentProps<typeof Button>) => {
  const routes = [{ path: '/', element: <Button {...props} /> }]
  const router = createMemoryRouter(routes, { initialEntries: ['/'], initialIndex: 0 })
  return renderRTL(<RouterProvider router={router} />)
}

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
  useNavigationMock.mockReturnValue({ formAction: '', state: 'loading' })
  render({ id, text })
  const input = screen.getByTestId(`button-${id}`)
  expect(input).toBeDisabled()
})

test('loading text will show is the form is loading', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.word()
  const loadingText = faker.lorem.word(2)
  const action = faker.lorem.word()
  UseFormMock.mockReturnValue({ isLoading: true, action })
  useNavigationMock.mockReturnValue({ formAction: action, state: 'submitting' })
  render({ id, text, loadingText })
  const input = screen.getByText(loadingText)
  expect(input).toHaveAttribute('data-loading', 'true')
})
