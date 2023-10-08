import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import { expect, test, vi, beforeEach, type Mock } from 'vitest'
import { LoadingTextButton } from '~/components/button/loading-text'
import { useForm } from '~/components/form/form'

vi.mock('@remix-run/react', () => ({ useNavigation: vi.fn().mockReturnValue({ formAction: '' }) }))
vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false, action: '' }) }))

beforeEach(() => {
  (useForm as Mock).mockReturnValue({ isLoading: false, action: '' })
  ;(useNavigation as Mock).mockReturnValue({ formAction: '' })
})

test('renders a button', async () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)
  const user = userEvent.setup()

  render(<LoadingTextButton id={id} text={text} loadingText={loadingText} />)
  screen.getByTestId(`button-${id}`)
  await user.click(screen.getByText(text))
})

test('the button can be rendered as type submit', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingTextButton id={id} type="submit" text={text} loadingText={loadingText} />)

  const button = screen.getByText(text)
  expect(button).toHaveAttribute('type', 'submit')
})

test('renders a button with the primary variant', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingTextButton id={id} variant="primary" text={text} loadingText={loadingText} />)
  expect(screen.getByText(text)).toHaveClass('hover:text-green-800')
})

test('renders a button with the secondary variant', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingTextButton id={id} variant="secondary" text={text} loadingText={loadingText} />)
  expect(screen.getByText(text)).toHaveClass('hover:text-neutral-800')
})

test('displays loading text when the form is loading', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)
  const action = faker.lorem.word()

  ;(useForm as Mock).mockReturnValue({ isLoading: true, action })
  ;(useNavigation as Mock).mockReturnValue({ formAction: action })

  render(<LoadingTextButton id={id} text={text} loadingText={loadingText} />)
  screen.getByText(loadingText)
  screen.getByTestId(`button-spinner-${id}`)
})

test('does not displays loading text if the action belongs to another form', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  ;(useForm as Mock).mockReturnValue({ isLoading: true })
  ;(useNavigation as Mock).mockReturnValue({ formAction: faker.lorem.word() })
  render(<LoadingTextButton id={id} text={text} loadingText={loadingText} />)

  expect(screen.queryByText(loadingText)).not.toBeInTheDocument()
  expect(screen.queryByTestId(`button-spinner-${id}`)).not.toBeInTheDocument()
})

test('the button is disabled while the form is loading', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  ;(useForm as Mock).mockReturnValue({ isLoading: true })
  render(<LoadingTextButton id={id} text={text} loadingText={loadingText} />)

  const button = screen.getByText(text)
  expect(button).toBeDisabled()
})
