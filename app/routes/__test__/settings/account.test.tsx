import { json } from '@remix-run/node'
import { test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'
import { Account } from '~/routes/settings/account'
import { renderWithRouter } from '~/test-utils'

test('user can update their email', async () => {
  const currentEmail = faker.internet.email()
  const newEmail = faker.internet.email()
  const methodId = faker.string.uuid()
  const code = faker.string.numeric({ length: 6 })
  const action = vi
    .fn()
    .mockReturnValueOnce(json({ email: currentEmail, methodId }))
    .mockReturnValueOnce(json({ success: true }))
  const loader = vi.fn().mockReturnValue(null)
  const path = [{ path: '/', element: <Account email={currentEmail} />, action, loader }]
  const { user } = renderWithRouter(path)

  await screen.findByText(/information/i)
  screen.getByText(/updating your email will require you to verify this change/i)

  screen.getByDisplayValue(currentEmail)
  await act(() => user.clear(screen.getByLabelText(/email/i)))
  await act(() => user.type(screen.getByLabelText(/email/i), newEmail))
  await act(() => user.click(screen.getByText(/save/i)))

  screen.getByText(/enter your otp code/i)
  await act(() => user.type(screen.getByTestId('input-code-0'), code))
  await act(() => user.click(screen.getByText(/verify/i, { selector: 'button' })))

  screen.getByText(/success/i)
  screen.getByText(/your email verification is complete/i)

  await act(() => user.click(screen.getByText(/close/i)))

  screen.getByText(/information/i)
  screen.getByDisplayValue(newEmail)
})

test('user can resend a code when updating their email', async () => {
  const email = faker.internet.email()
  const methodId = faker.string.uuid()
  const sent = faker.date.recent()
  const action = vi.fn().mockReturnValueOnce(json({ email, methodId })).mockReturnValueOnce(json({ sent }))
  const loader = vi.fn().mockReturnValue(null)
  const path = [{ path: '/', element: <Account email={email} />, action, loader }]
  const { user } = renderWithRouter(path)

  await screen.findByText(/information/i)
  await act(() => user.click(screen.getByText(/save/i)))

  screen.getByText(/enter your otp code/i)
  await act(() => user.click(screen.getByText(/resend new code/i)))
  screen.getByText(`sent: ${new Date(sent).toLocaleString()}`, { exact: false })
})

test.todo('user can delete their account')
