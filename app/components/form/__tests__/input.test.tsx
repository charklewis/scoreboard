import { type Mock, beforeEach, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '~/components/form/form'
import { Input } from '~/components/form/input'
import { useInputGroup } from '~/components/form/input-group'

vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false }) }))
vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

const UseInputGroupMock = useInputGroup as Mock
const UseFormMock = useForm as Mock

beforeEach(() => {
  UseFormMock.mockReturnValue({ isLoading: false })
})

test('renders an input', async () => {
  const name = faker.lorem.word()
  const value = faker.lorem.word()
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<Input />)
  await act(() => user.type(screen.getByTestId(`input-${name}`), value))
  expect(screen.getByTestId(`input-${name}`)).toHaveValue(value)
})

test('renders an input with placeholder text', () => {
  const name = faker.lorem.word()
  const value = faker.lorem.words(3)
  UseInputGroupMock.mockReturnValue({ name })
  render(<Input placeholder={value} />)
  screen.getByPlaceholderText(value)
})

test('renders an input different types', async () => {
  const name = faker.lorem.word()
  const email = faker.internet.email()
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<Input type="email" />)
  const input = screen.getByTestId(`input-${name}`)
  expect(input).toHaveAttribute('type', 'email')
  await act(() => user.type(input, email))
})

test('renders an input with default text', () => {
  const name = faker.lorem.word()
  const value = faker.lorem.words(3)
  UseInputGroupMock.mockReturnValue({ name, defaultValue: value })
  render(<Input />)
  screen.getByDisplayValue(value)
})

test('the input is disabled if the form is loading', () => {
  const name = faker.lorem.word()
  UseInputGroupMock.mockReturnValue({ name })
  UseFormMock.mockReturnValue({ isLoading: true })
  render(<Input />)
  const input = screen.getByTestId(`input-${name}`)
  expect(input).toHaveAttribute('readOnly', '')
})
