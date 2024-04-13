import { useFetcher } from '@remix-run/react'
import { type Mock, expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import { AddRound } from '~/components/scrabble/add-round'
import { renderWithRouter } from '~/test-utils'

vi.mock('@remix-run/react', async (originalPackage) => {
  const actual: Object = await originalPackage()
  return { ...actual, useFetcher: vi.fn() }
})

test('renders a button to add a round', async () => {
  const submit = vi.fn()
  ;(useFetcher as Mock).mockReturnValue({ submit })

  const rounds = [faker.string.uuid()]
  const setSelectedRound = vi.fn()
  const { user } = renderWithRouter([
    { path: '/', element: <AddRound selectedRound="1" rounds={rounds} setSelectedRound={setSelectedRound} /> },
  ])
  await screen.findByTestId(/button-add-round/i)
  await act(() => user.click(screen.getByText(/next round/i)))
  expect(submit).toHaveBeenCalled()
})

test('updates the selected round when the button is clicked', async () => {
  (useFetcher as Mock).mockReturnValue({ submit: vi.fn(), data: true, state: 'idle' })

  const rounds = [faker.string.uuid(), faker.string.uuid()]
  const setSelectedRound = vi.fn()
  const { user } = renderWithRouter([
    {
      path: '/',
      element: <AddRound selectedRound="1" rounds={rounds} setSelectedRound={setSelectedRound} />,
    },
  ])
  await screen.findByTestId(/button-add-round/i)
  await act(() => user.click(screen.getByText(/next round/i)))
  expect(setSelectedRound).toHaveBeenCalledWith('2')
})
