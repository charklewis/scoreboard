import { faker } from '@faker-js/faker'
import { redirect } from '@remix-run/node'
import { describe, test, expect, vi, type Mock, beforeEach } from 'vitest'
import { action } from '~/routes/login'
import { loginWithOtp, identity } from '~/services/identity.server'

vi.mock('~/services/identity.server', () => ({ identity: { authenticate: vi.fn() }, loginWithOtp: vi.fn() }))

const LoginWithOtpMock = loginWithOtp as Mock
const AuthenticateMock = identity.authenticate as Mock

function createRequest(body: URLSearchParams, namedAction: string) {
  return {
    request: new Request(`http://test/login${namedAction}`, { method: 'POST', body: body }),
    params: {},
    context: {},
  }
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
