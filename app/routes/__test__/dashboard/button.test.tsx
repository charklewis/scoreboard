import { faker } from '@faker-js/faker'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, vi, type Mock, expect, beforeEach } from 'vitest'
import { Button } from '~/routes/dashboard/button'

vi.mock('@remix-run/react', () => ({ useNavigation: vi.fn() }))

const MockUseNavigation = useNavigation as Mock

beforeEach(() => {
  MockUseNavigation.mockReturnValue({ state: 'idle' })
})

test('renders a button', async () => {
  const id = faker.lorem.word()
  const description = faker.lorem.sentence()
  const onClick = vi.fn()
  const user = userEvent.setup()

  render(<Button id={id} description={description} onClick={onClick} Icon={XMarkIcon} />)

  //check icon rendered
  screen.getByText(description)
  screen.getByTestId(`button-icon-${id}`)

  const button = screen.getByTestId(`button-${id}`)
  expect(button).toHaveAttribute('type', 'button')
  await user.click(button)
  expect(onClick).toHaveBeenCalled()
})

test('the button is disabled while the form is loading', () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const id = faker.lorem.word()
  render(<Button id={id} description={faker.lorem.sentence()} onClick={vi.fn()} Icon={XMarkIcon} />)

  expect(screen.getByTestId(`button-${id}`)).toBeDisabled()
})

test('the button can have additional classes applied', () => {
  const id = faker.lorem.word()
  const className = faker.lorem.words(2)

  render(
    <Button id={id} description={faker.lorem.sentence()} onClick={vi.fn()} Icon={XMarkIcon} className={className} />
  )

  expect(screen.getByTestId(`button-${id}`)).toHaveClass(className)
})
