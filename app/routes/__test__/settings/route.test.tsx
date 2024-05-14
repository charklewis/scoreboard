import { type Mock, beforeEach, describe, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { screen } from '@testing-library/react'

import Settings, { action, loader } from '~/routes/settings/route'
import { authenticateOtp, getUserEmail, identity, sendOtp, updateEmail } from '~/services/identity.server'
import { createRequest, renderWithRouter } from '~/test-utils'

vi.mock('~/services/identity.server', () => ({
  identity: { isAuthenticated: vi.fn() },
  sendOtp: vi.fn(),
  authenticateOtp: vi.fn(),
  updateEmail: vi.fn(),
  getUserEmail: vi.fn(),
}))

const SendOtpMock = sendOtp as Mock
const AuthenticateOtpMock = authenticateOtp as Mock
const IsAuthenticatedMock = identity.isAuthenticated as Mock
const UpdateEmailMock = updateEmail as Mock
const GetUserEmailMock = getUserEmail as Mock

const path = '/settings'

describe('action', () => {
  beforeEach(() => {
    SendOtpMock.mockResolvedValue(faker.lorem.word())
    IsAuthenticatedMock.mockResolvedValue({ stytchId: faker.string.uuid() })
  })

  test("returns an error if the user isn't authenticated", async () => {
    const body = new URLSearchParams({})
    IsAuthenticatedMock.mockResolvedValue({})
    const request = createRequest({ method: 'POST', body })
    const response = await action(request).then((res) => res.json())
    expect(response).toEqual({ errors: { user: 'You must be logged in to perform this action' } })
  })

  describe('sendOtp', () => {
    const namedAction = '?/sendOtp'
    test('returns a method id and email', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const stytchId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      SendOtpMock.mockResolvedValue(methodId)
      IsAuthenticatedMock.mockResolvedValue({ stytchId })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(sendOtp).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({ methodId, email })
    })
    test('returns an error if email is not valid', async () => {
      const email = faker.lorem.word()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      SendOtpMock.mockResolvedValue(methodId)
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
    test('returns an error if email could not be verified', async () => {
      const email = faker.internet.email()
      const stytchId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      SendOtpMock.mockResolvedValue(false)
      IsAuthenticatedMock.mockResolvedValue({ stytchId })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(sendOtp).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({
        errors: { email: 'An error occured while updating your email, please try again later' },
      })
    })
    test('returns an error if the otp api fails', async () => {
      const email = faker.lorem.word()
      const body = new URLSearchParams({ email })
      SendOtpMock.mockRejectedValue('error')
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
  })

  describe('verifyOtp', () => {
    const namedAction = '?/verifyOtp'
    test('return success if the otp is verified ', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const stytchId = faker.string.uuid()
      AuthenticateOtpMock.mockResolvedValue(stytchId)
      UpdateEmailMock.mockResolvedValue(true)
      const body = new URLSearchParams({ email, methodId, code })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(authenticateOtp).toHaveBeenCalledWith({ methodId, code })
      expect(updateEmail).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({ success: true })
    })

    test('returns an error if the authentication is unsuccessful', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      AuthenticateOtpMock.mockResolvedValue(false)
      const body = new URLSearchParams({ email, methodId, code })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(authenticateOtp).toHaveBeenCalledWith({ methodId, code })
      expect(response).toEqual({ errors: { code: 'Your code was not valid' } })
    })

    test('returns an error if the updating the email was unsuccessful', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const stytchId = faker.string.uuid()
      AuthenticateOtpMock.mockResolvedValue(stytchId)
      UpdateEmailMock.mockResolvedValue(false)
      const body = new URLSearchParams({ email, methodId, code })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(authenticateOtp).toHaveBeenCalledWith({ methodId, code })
      expect(updateEmail).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({ errors: { code: 'We are having issues verifying your information' } })
    })

    test('returns an error if the authentication api is down', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      AuthenticateOtpMock.mockRejectedValue(false)
      const body = new URLSearchParams({ email, methodId, code })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { code: 'An error occured while verifying your one time code, please try again later' },
      })
    })

    test('returns an error if the update email api is down', async () => {
      const email = faker.internet.email()
      const methodId = faker.string.uuid()
      const code = faker.string.numeric(6)
      const stytchId = faker.string.uuid()
      AuthenticateOtpMock.mockResolvedValue(stytchId)
      UpdateEmailMock.mockRejectedValue(false)
      const body = new URLSearchParams({ email, methodId, code })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(authenticateOtp).toHaveBeenCalledWith({ methodId, code })
      expect(updateEmail).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({
        errors: { code: 'An error occured while verifying your one time code, please try again later' },
      })
    })
  })

  describe('resendOtp', () => {
    const namedAction = '?/resendOtp'
    test('returns a method id, email and date', async () => {
      const email = faker.internet.email()
      const stytchId = faker.string.uuid()
      const methodId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      IsAuthenticatedMock.mockResolvedValue({ stytchId })
      SendOtpMock.mockResolvedValue(methodId)
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(sendOtp).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({ sent: expect.any(String) })
    })
    test('returns an error if email is not valid', async () => {
      const email = faker.lorem.word()
      const body = new URLSearchParams({ email })
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({ errors: { email: 'An email is required' } })
    })
    test('returns an error if email could not be verified', async () => {
      const email = faker.internet.email()
      const stytchId = faker.string.uuid()
      const body = new URLSearchParams({ email })
      IsAuthenticatedMock.mockResolvedValue({ stytchId })
      SendOtpMock.mockResolvedValue(false)
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(sendOtp).toHaveBeenCalledWith({ stytchId, email })
      expect(response).toEqual({
        errors: { email: 'An error occured while resending a new code, please try again later' },
      })
    })
    test('returns an error if the otp api fails', async () => {
      const email = faker.internet.email()
      const body = new URLSearchParams({ email })
      SendOtpMock.mockRejectedValue(false)
      const request = createRequest({ method: 'POST', body, pathname: namedAction })
      const response = await action(request).then((res) => res.json())
      expect(response).toEqual({
        errors: { email: 'An email is required' },
      })
    })
  })
})

describe('loader', () => {
  test("returns user's email", async () => {
    const stytchId = faker.string.uuid()
    const email = faker.internet.email()
    IsAuthenticatedMock.mockResolvedValue({ stytchId })
    GetUserEmailMock.mockResolvedValue(email)
    const request = createRequest()
    const response = await loader(request).then((res) => res.json())
    expect(getUserEmail).toHaveBeenCalledWith(stytchId)
    expect(response).toEqual({ email })
  })
  test("returns 'unknown user' if there is user", async () => {
    IsAuthenticatedMock.mockResolvedValue({})
    const request = createRequest()
    const response = await loader(request).then((res) => res.json())
    expect(response).toEqual({ email: 'unknown user' })
  })
})

describe('component', () => {
  test('a user update their account settings', async () => {
    const routes = [{ path, element: <Settings /> }]
    renderWithRouter(routes)
    await screen.findByText(/settings/i)
    screen.getByText(/information/i)
    screen.getByText(/delete account/i, { selector: 'p' })
  })
})
