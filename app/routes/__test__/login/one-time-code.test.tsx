import { faker } from '@faker-js/faker'
import { useActionData } from '@remix-run/react'
import { screen } from '@testing-library/react'
import { test, expect, vi, type Mock, beforeEach } from 'vitest'
import { OneTimeCode } from '~/routes/login/one-time-code'
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

test('a user can verify their otp', async () => {
  const methodId = faker.string.uuid()
  const email = faker.internet.email()
  const code = faker.string.numeric(6)
  MockUseActionData.mockReturnValue({ methodId, email })
  const { action, user } = renderWithRouter(<OneTimeCode />, path)
  screen.getByText(/enter your otp code/i)
  await user.type(screen.getByTestId('input-code-0'), code)
  await user.click(screen.getByText(/verify/i))
  expect(action).toHaveBeenCalled()
})

test('a user can have their otp code resent', async () => {
  const methodId = faker.string.uuid()
  const email = faker.internet.email()
  MockUseActionData.mockReturnValue({ methodId, email })
  const { action, user } = renderWithRouter(<OneTimeCode />, path)
  screen.getByText(/enter your otp code/i)
  await user.click(screen.getByText(/resend new code/i))
  expect(action).toHaveBeenCalled()
})

test('if a code is resent the sent date is displayed', async () => {
  const methodId = faker.string.uuid()
  const email = faker.internet.email()
  const sent = faker.date.recent().toISOString()
  MockUseActionData.mockReturnValue({ methodId, email, sent })
  renderWithRouter(<OneTimeCode />, path)
  screen.getByText(/enter your otp code/i)
  screen.getByText(`Sent: ${new Date(sent).toLocaleString()}`)
})

test('a user can see errors related to the otp input', async () => {
  const methodId = faker.string.uuid()
  const email = faker.internet.email()
  const error = faker.lorem.words(5)
  MockUseActionData.mockReturnValue({ methodId, email, errors: { code: error } })
  renderWithRouter(<OneTimeCode />, path)
  screen.getByText(/enter your otp code/i)
  screen.getByText(error)
})
