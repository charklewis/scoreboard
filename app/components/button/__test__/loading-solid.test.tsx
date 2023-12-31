import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, type Mock, beforeEach } from 'vitest'
import { LoadingSolidButton } from '~/components/button/loading-solid'
import { useForm } from '~/components/form/form'

vi.mock('@remix-run/react', () => ({ useNavigation: vi.fn().mockReturnValue({ formAction: '' }) }))
vi.mock('~/components/form/form', () => ({ useForm: vi.fn().mockReturnValue({ isLoading: false, action: '' }) }))

const MockUseForm = useForm as Mock
const MockUseNavigation = useNavigation as Mock

beforeEach(() => {
  MockUseForm.mockReturnValue({ isLoading: false, action: '' })
  MockUseNavigation.mockReturnValue({ formAction: '' })
})

test('renders a button', async () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)
  const user = userEvent.setup()

  render(<LoadingSolidButton id={id} text={text} loadingText={loadingText} />)
  screen.getByTestId(`button-${id}`)
  await user.click(screen.getByText(text))
})

test('the button can be rendered as type submit', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingSolidButton id={id} type="submit" text={text} loadingText={loadingText} />)

  const button = screen.getByText(text)
  expect(button).toHaveAttribute('type', 'submit')
})

test('renders a button with the primary variant', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingSolidButton id={id} variant="primary" text={text} loadingText={loadingText} />)
  expect(screen.getByText(text)).toHaveClass('hover:bg-green-500 text-white')
})

test('renders a button with the secondary variant', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  render(<LoadingSolidButton id={id} variant="secondary" text={text} loadingText={loadingText} />)
  expect(screen.getByText(text)).toHaveClass('hover:bg-neutral-50')
})

test('displays loading text when the form is loading', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)
  const action = faker.lorem.word()

  MockUseForm.mockReturnValue({ isLoading: true, action })
  MockUseNavigation.mockReturnValue({ formAction: action })

  render(<LoadingSolidButton id={id} text={text} loadingText={loadingText} />)
  screen.getByText(loadingText)
  screen.getByTestId(`button-spinner-${id}`)
})

test('does not displays loading text if the action belongs to another form', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  MockUseForm.mockReturnValue({ isLoading: true })
  MockUseNavigation.mockReturnValue({ formAction: faker.lorem.word() })
  render(<LoadingSolidButton id={id} text={text} loadingText={loadingText} />)

  expect(screen.queryByText(loadingText)).not.toBeInTheDocument()
  expect(screen.queryByTestId(`button-spinner-${id}`)).not.toBeInTheDocument()
})

test('the button is disabled while the form is loading', () => {
  const id = faker.lorem.word()
  const text = faker.lorem.words(3)
  const loadingText = faker.lorem.words(5)

  MockUseForm.mockReturnValue({ isLoading: true })
  render(<LoadingSolidButton id={id} text={text} loadingText={loadingText} />)

  const button = screen.getByText(text)
  expect(button).toBeDisabled()
})
