import { useFetcher } from '@remix-run/react'
import { type Mock, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import { EndGame } from '~/components/scrabble/end-game'
import { renderWithRouter } from '~/test-utils'

vi.mock('@remix-run/react', async (originalPackage) => {
  const actual: Object = await originalPackage()
  return { ...actual, useFetcher: vi.fn() }
})

test('renders nothing if the modal is not open', async () => {
  renderWithRouter([{ path: '/', element: <EndGame isOpen={false} onOpenChange={vi.fn()} /> }])
  expect(screen.queryByTestId(/modal-end-game/i)).not.toBeInTheDocument()
})

test('renders a button to end the game', async () => {
  const submit = vi.fn()
  ;(useFetcher as Mock).mockReturnValue({ submit })
  const roundId = faker.string.uuid()
  const onOpenChange = vi.fn()
  const { user } = renderWithRouter([
    { path: '/', element: <EndGame roundId={roundId} isOpen={true} onOpenChange={onOpenChange} /> },
  ])
  await screen.findByTestId(/modal-end-game/i)
  screen.getByText(/are you sure you want to end the game/i)
  await act(() => user.click(screen.getByText(/end game/i)))
  expect(submit).toHaveBeenCalled()
})

test('renders a button to go back', async () => {
  const roundId = faker.string.uuid()
  const onOpenChange = vi.fn()
  const { user } = renderWithRouter([
    { path: '/', element: <EndGame roundId={roundId} isOpen={true} onOpenChange={onOpenChange} /> },
  ])
  await screen.findByTestId(/modal-end-game/i)

  await act(() => user.click(screen.getByText(/go back/i)))
  expect(onOpenChange).toHaveBeenCalled()
})
