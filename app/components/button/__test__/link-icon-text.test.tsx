import { faker } from '@faker-js/faker'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, vi, type Mock, expect } from 'vitest'
import { IconWithTextLink } from '~/components/button/link-icon-text'

vi.mock('@remix-run/react', async () => {
  const actual: Object = await vi.importActual('@remix-run/react')
  return { ...actual, useNavigation: vi.fn() }
})

const MockUseNavigation = useNavigation as Mock

beforeEach(() => {
  MockUseNavigation.mockReturnValue({ state: 'idle' })
})

test('renders a link', async () => {
  const id = faker.lorem.word()
  const text = faker.lorem.sentence()
  const href = faker.internet.url()

  render(
    <MemoryRouter>
      <IconWithTextLink id={id} href={href} text={text} Icon={XMarkIcon} />
    </MemoryRouter>
  )

  screen.getByTestId(`link-${id}`)
  screen.getByTestId(`link-icon-${id}`)

  const link = screen.getByText(text)
  expect(link).toHaveAttribute('href', href)
})

test('the button is disabled while the form is loading', () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const id = faker.lorem.word()
  render(
    <MemoryRouter>
      <IconWithTextLink id={id} href={faker.internet.url()} text={faker.lorem.sentence()} Icon={XMarkIcon} />
    </MemoryRouter>
  )
  expect(screen.getByTestId(`link-${id}`)).toHaveClass('pointer-events-none')
})

test('the button can have additional classes applied', () => {
  const id = faker.lorem.word()
  const className = faker.lorem.words(2)
  render(
    <MemoryRouter>
      <IconWithTextLink
        id={id}
        href={faker.internet.url()}
        text={faker.lorem.sentence()}
        Icon={XMarkIcon}
        className={className}
      />
    </MemoryRouter>
  )
  expect(screen.getByTestId(`link-${id}`)).toHaveClass(className)
})
