import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, vi, type Mock, expect } from 'vitest'
import { TextOnlyLink } from '~/components/button/link-text'

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
      <TextOnlyLink id={id} href={href} text={text} />
    </MemoryRouter>
  )

  screen.getByTestId(`link-${id}`)

  const link = screen.getByText(text)
  expect(link).toHaveAttribute('href', href)
})

test('renders a link with the primary variant', () => {
  const text = faker.lorem.sentence()
  render(
    <MemoryRouter>
      <TextOnlyLink id={faker.lorem.word()} href={faker.internet.url()} text={text} variant="primary" />
    </MemoryRouter>
  )
  expect(screen.getByText(text)).toHaveClass('text-green-600 hover:text-green-800')
})

test('renders a link with the secondary variant', () => {
  const text = faker.lorem.sentence()
  render(
    <MemoryRouter>
      <TextOnlyLink id={faker.lorem.word()} href={faker.internet.url()} text={text} variant="secondary" />
    </MemoryRouter>
  )
  expect(screen.getByText(text)).toHaveClass('hover:text-neutral-800')
})

test('renders a link with the danger variant', () => {
  const text = faker.lorem.sentence()
  render(
    <MemoryRouter>
      <TextOnlyLink id={faker.lorem.word()} href={faker.internet.url()} text={text} variant="danger" />
    </MemoryRouter>
  )
  expect(screen.getByText(text)).toHaveClass('text-red-600 hover:text-red-800')
})

test('the button is disabled while the form is loading', () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const id = faker.lorem.word()
  render(
    <MemoryRouter>
      <TextOnlyLink id={id} href={faker.internet.url()} text={faker.lorem.sentence()} />
    </MemoryRouter>
  )

  expect(screen.getByTestId(`link-${id}`)).toHaveClass('pointer-events-none')
})

test('the button can have additional classes applied', () => {
  const id = faker.lorem.word()
  const className = faker.lorem.words(2)
  render(
    <MemoryRouter>
      <TextOnlyLink id={id} href={faker.internet.url()} text={faker.lorem.sentence()} className={className} />
    </MemoryRouter>
  )
  expect(screen.getByTestId(`link-${id}`)).toHaveClass(className)
})
