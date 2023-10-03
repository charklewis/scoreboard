import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, type Mock } from 'vitest'
import { useInputGroup } from '~/components/form/input-group'
import { TextField } from '~/components/form/text-field'

vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false }) }))
vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

test('renders a label and input', async () => {
  const name = faker.lorem.word()
  const label = faker.lorem.words(2)
  const value = faker.lorem.words(3)
  ;(useInputGroup as Mock).mockReturnValue({ name })
  const user = userEvent.setup()
  render(<TextField label={label} />)

  screen.getByTestId(`input-${name}`)
  screen.getByTestId(`label-${name}`)

  await user.type(screen.getByLabelText(label), value)
  expect(screen.getByLabelText(label)).toHaveValue(value)
})

test('renders a description', async () => {
  const name = faker.lorem.word()
  const label = faker.lorem.words(2)
  const description = faker.lorem.words(5)
  ;(useInputGroup as Mock).mockReturnValue({ name })
  render(<TextField label={label} description={description} />)
  screen.getByText(description)
})

test('renders an error message', async () => {
  const name = faker.lorem.word()
  const label = faker.lorem.words(2)
  const error = faker.lorem.words(5)
  ;(useInputGroup as Mock).mockReturnValue({ name, error })
  render(<TextField label={label} />)
  screen.getByText(error)
})
