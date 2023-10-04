import { faker } from '@faker-js/faker'
import { redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, type Mock, beforeEach } from 'vitest'
import Login, { action } from '~/routes/login'
import { loginWithOtp, identity } from '~/services/identity.server'

vi.mock('~/services/identity.server', () => ({ identity: { authenticate: vi.fn() }, loginWithOtp: vi.fn() }))
vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useActionData: vi.fn() }
})

const LoginWithOtpMock = loginWithOtp as Mock
const AuthenticateMock = identity.authenticate as Mock
const MockUseActionData = useActionData as Mock

function createRequest(body: URLSearchParams, namedAction: string) {
  return {
    request: new Request(`http://test/login${namedAction}`, { method: 'POST', body: body }),
    params: {},
    context: {},
  }
}

function renderWithRouter(element: ReactNode) {
  const action = vi.fn().mockReturnValue(null)
  const routes = [{ path: '/login', element, action }]
  const route = createMemoryRouter(routes, { initialEntries: ['/login'] })
  const view = render(<RouterProvider router={route} />)
  return { ...view, action }
}

describe('action', () => {
  beforeEach(() => {
    LoginWithOtpMock.mockResolvedValue(faker.lorem.word())
  })

  describe('sendOtp', () => {
    const namedAction = '?/sendOtp'
    test('returns a method id and email', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(methodId)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(loginWithOtp).toHaveBeenCalledWith(email)
      expect(response).toEqual({ methodId, email })
    })
    test('returns an error if email is not valid', async () => {
      const email = faker.lorem.word()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(methodId)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
    test('returns an error if email could not be verified', async () => {
      const email = faker.internet.email()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(false)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(loginWithOtp).toHaveBeenCalledWith(email)
      expect(response).toEqual({
        errors: { email: 'An error occured while verifying your email, please try again later' },
      })
    })
    test('returns an error if the otp api fails', async () => {
      const email = faker.lorem.word()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockRejectedValue('error')
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
  })

  describe('verifyOtp', () => {
    const namedAction = '?/verifyOtp'
    test('throws an error of type response if the authentication is successful', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const body = new URLSearchParams({ email, methodId, code })
      const response = redirect('/dashboard')
      AuthenticateMock.mockRejectedValue(response)
      const request = createRequest(body, namedAction)
      //we can't check for the exact error because it's a Response object
      await expect(() => action(request)).rejects.toThrowError()
    })

    test('returns an error if the authentication is unsuccessful', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const body = new URLSearchParams({ email, methodId, code })
      const message = faker.lorem.word()
      const error = new Error(message, { cause: `${methodId}:${email}` })
      AuthenticateMock.mockRejectedValue(error)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({ methodId, email, errors: { code: message } })
    })

    test('returns an error if the authentication api is down', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const body = new URLSearchParams({ email, methodId, code })
      AuthenticateMock.mockRejectedValue(false)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({ errors: { generic: 'Our system appears to be down, please try again later' } })
    })
  })

  describe('resendOtp', () => {
    const namedAction = '?/resendOtp'
    test('returns a method id, email and date', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(methodId)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(loginWithOtp).toHaveBeenCalledWith(email)
      expect(response).toEqual({ methodId, email, sent: expect.any(String) })
    })
    test('returns an error if email is not valid', async () => {
      const email = faker.lorem.word()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(methodId)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
    test('returns an error if email could not be verified', async () => {
      const email = faker.internet.email()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockResolvedValue(false)
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(loginWithOtp).toHaveBeenCalledWith(email)
      expect(response).toEqual({
        errors: { email: 'An error occured while resending a new code, please try again later' },
      })
    })
    test('returns an error if the otp api fails', async () => {
      const email = faker.lorem.word()
      const body = new URLSearchParams({ email })
      LoginWithOtpMock.mockRejectedValue('error')
      const request = createRequest(body, namedAction)
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
  })
})

describe('component', () => {
  beforeEach(() => {
    MockUseActionData.mockReturnValue({})
  })

  describe('Sign in', () => {
    test('a user can login using an email', async () => {
      const user = userEvent.setup()
      const email = faker.internet.email()
      const { action } = renderWithRouter(<Login />)
      screen.getByText(/sign in to your account/i)
      await user.type(screen.getByLabelText(/email/i), email)
      await user.click(screen.getByText(/sign in/i, { selector: 'button' }))
      expect(action).toHaveBeenCalled()
    })

    test('a user can see errors related to the email input', () => {
      const error = faker.lorem.words(5)
      MockUseActionData.mockReturnValue({ errors: { email: error } })
      renderWithRouter(<Login />)
      screen.getByLabelText(/email/i)
      screen.getByText(error)
    })

    test('a user can see generic errors', () => {
      const error = faker.lorem.words(5)
      MockUseActionData.mockReturnValue({ errors: { generic: error } })
      renderWithRouter(<Login />)
      screen.getByLabelText(/email/i)
      screen.getByText(error)
    })
  })

  describe('Verify otp', () => {
    test('a user can verify their otp', async () => {
      const user = userEvent.setup()
      const methodId = faker.string.uuid()
      const email = faker.internet.email()
      const code = faker.string.numeric(6)
      MockUseActionData.mockReturnValue({ methodId, email })
      const { action } = renderWithRouter(<Login />)
      screen.getByText(/enter your otp code/i)
      await user.type(screen.getByTestId('input-code-0'), code)
      await user.click(screen.getByText(/verify/i))
      expect(action).toHaveBeenCalled()
    })

    test('a user can have their otp code resent', async () => {
      const user = userEvent.setup()
      const methodId = faker.string.uuid()
      const email = faker.internet.email()
      MockUseActionData.mockReturnValue({ methodId, email })
      const { action } = renderWithRouter(<Login />)
      screen.getByText(/enter your otp code/i)
      await user.click(screen.getByText(/resend new code/i))
      expect(action).toHaveBeenCalled()
    })

    test('if a code is resent the sent date is displayed', async () => {
      const methodId = faker.string.uuid()
      const email = faker.internet.email()
      const sent = faker.date.recent().toISOString()
      MockUseActionData.mockReturnValue({ methodId, email, sent })
      renderWithRouter(<Login />)
      screen.getByText(/enter your otp code/i)
      screen.getByText(`Sent: ${new Date(sent).toLocaleString()}`)
    })

    test('a user can see errors related to the otp input', async () => {
      const methodId = faker.string.uuid()
      const email = faker.internet.email()
      const error = faker.lorem.words(5)
      MockUseActionData.mockReturnValue({ methodId, email, errors: { code: error } })
      renderWithRouter(<Login />)
      screen.getByText(/enter your otp code/i)
      screen.getByText(error)
    })
  })
})
