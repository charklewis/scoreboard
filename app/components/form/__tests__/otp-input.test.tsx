import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, type Mock } from 'vitest'
import { useInputGroup } from '~/components/form/input-group'
import { OtpInput } from '~/components/form/otp-input'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

const UseInputGroupMock = useInputGroup as Mock

test('renders an input to enter a code', async () => {
  const name = faker.lorem.word()
  const code = faker.string.numeric(6)
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<OtpInput />)
  const input = screen.getByTestId(`input-${name}-0`)
  await user.type(input, code)
  ;[0, 1, 2, 3, 4, 5].forEach((index) => {
    expect(screen.getByTestId(`input-${name}-${index}`)).toHaveValue(code[index])
  })
})

test('renders a hidden input that has the value', async () => {
  const name = faker.lorem.word()
  const code = faker.string.numeric(6)
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<OtpInput />)
  const input = screen.getByTestId(`input-${name}-0`)
  await user.type(input, code)
  expect(screen.getByTestId(`input-hidden-${name}`)).toHaveValue(code)
})

test('user can paste a code', async () => {
  const name = faker.lorem.word()
  const code = faker.string.numeric(6)
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<OtpInput />)
  const input = screen.getByTestId(`input-${name}-0`)
  await user.click(input)
  await user.paste(code)
  expect(screen.getByTestId(`input-hidden-${name}`)).toHaveValue(code)
})
