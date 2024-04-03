import { faker } from '@faker-js/faker'
import { useActionData } from '@remix-run/react'
import { act, screen } from '@testing-library/react'
import { test, expect, vi, type Mock, beforeEach } from 'vitest'
import { SignIn } from '~/routes/login/sign-in'
import { renderWithRouter } from '~/test-utils'

vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useActionData: vi.fn() }
})

const MockUseActionData = useActionData as Mock
const path = '/login'

beforeEach(() => {
  MockUseActionData.mockReturnValue({})
})

test('a user can login using an email', async () => {
  const email = faker.internet.email()
  const action = vi.fn().mockReturnValue(null)
  const routes = [{ path, element: <SignIn />, action }]
  const { user } = renderWithRouter(routes)
  await screen.findByText(/sign in to your account/i)
  screen.getByTestId(/button-sign-in/i)
  await act(() => user.type(screen.getByLabelText(/email/i), email))
  await act(() => user.click(screen.getByText(/sign in/i, { selector: 'button' })))
  expect(action).toHaveBeenCalled()
})

test('a user can see errors related to the email input', async () => {
  const error = faker.lorem.words(5)
  MockUseActionData.mockReturnValue({ errors: { email: error } })
  const routes = [{ path, element: <SignIn /> }]
  renderWithRouter(routes)
  await screen.findByLabelText(/email/i)
  screen.getByText(error)
})

test('a user can see generic errors', async () => {
  const error = faker.lorem.words(5)
  MockUseActionData.mockReturnValue({ errors: { generic: error } })
  const routes = [{ path, element: <SignIn /> }]
  renderWithRouter(routes)
  await screen.findByLabelText(/email/i)
  screen.getByText(error)
})
