import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, type Mock } from 'vitest'
import { useForm } from '~/components/form/form'
import { Input } from '~/components/form/input'
import { useInputGroup } from '~/components/form/input-group'

vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false }) }))
vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

beforeEach(() => {
  (useForm as Mock).mockReturnValue({ isLoading: false })
})

test('renders an input', async () => {
  const name = faker.lorem.word()
  const value = faker.lorem.word()
  ;(useInputGroup as Mock).mockReturnValue({ name })
  const user = userEvent.setup()
  render(<Input />)
  await user.type(screen.getByTestId(`input-${name}`), value)
  expect(screen.getByTestId(`input-${name}`)).toHaveValue(value)
})

test('renders an input with placeholder text', () => {
  const name = faker.lorem.word()
  const value = faker.lorem.words(3)
  ;(useInputGroup as Mock).mockReturnValue({ name })
  render(<Input placeholder={value} />)
  screen.getByPlaceholderText(value)
})

test('renders an input different types', async () => {
  const name = faker.lorem.word()
  const email = faker.internet.email()
  ;(useInputGroup as Mock).mockReturnValue({ name })
  const user = userEvent.setup()
  render(<Input type="email" />)
  const input = screen.getByTestId(`input-${name}`)
  expect(input).toHaveAttribute('type', 'email')
  await user.type(input, email)
})

test('renders an input with default text', () => {
  const name = faker.lorem.word()
  const value = faker.lorem.words(3)
  ;(useInputGroup as Mock).mockReturnValue({ name, defaultValue: value })
  render(<Input />)
  screen.getByDisplayValue(value)
})

test('the input is disabled if the form is loading', () => {
  const name = faker.lorem.word()
  ;(useInputGroup as Mock).mockReturnValue({ name })
  ;(useForm as Mock).mockReturnValue({ isLoading: true })
  render(<Input />)
  const input = screen.getByTestId(`input-${name}`)
  expect(input).toHaveAttribute('readOnly', '')
})
