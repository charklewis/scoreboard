import { faker } from '@faker-js/faker'
import { useNavigation } from '@remix-run/react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { test, vi, type Mock, expect } from 'vitest'
import { Link } from '~/routes/dashboard.scoreboards/link'

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
      <Link id={id} href={href}>
        {text}
      </Link>
    </MemoryRouter>
  )

  screen.getByTestId(`link-${id}`)

  const link = screen.getByText(text)
  expect(link).toHaveAttribute('href', href)
})

test('the button is disabled while the form is loading', () => {
  MockUseNavigation.mockReturnValue({ state: 'loading' })
  const id = faker.lorem.word()
  const text = faker.lorem.sentence()
  render(
    <MemoryRouter>
      <Link id={id} href={faker.internet.url()}>
        {text}
      </Link>
    </MemoryRouter>
  )

  expect(screen.getByTestId(`link-${id}`)).toHaveClass('pointer-events-none')
})
