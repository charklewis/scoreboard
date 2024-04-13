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

test('renders a button to end the game', async () => {
  const submit = vi.fn()
  ;(useFetcher as Mock).mockReturnValue({ submit })
  const roundId = faker.string.uuid()
  const { user } = renderWithRouter([{ path: '/', element: <EndGame roundId={roundId} /> }])
  await screen.findByTestId(/button-end-game/i)
  await act(() => user.click(screen.getByText(/finish game/i)))
  expect(submit).toHaveBeenCalled()
})
