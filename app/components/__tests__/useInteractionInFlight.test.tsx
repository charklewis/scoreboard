import { useFetchers, useNavigation } from '@remix-run/react'
import { type Mock, expect, test, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import { useInteractionInFlight } from '~/components/useInteractionInFlight'

vi.mock('@remix-run/react', () => ({ useFetchers: vi.fn(), useNavigation: vi.fn() }))

test('returns false if there is no interactions', () => {
  (useFetchers as Mock).mockReturnValue([])
  ;(useNavigation as Mock).mockReturnValue({ state: 'idle' })

  const { result } = renderHook(() => useInteractionInFlight())
  expect(result.current).toBe(false)
})

test('returns false if the interactions are idle', () => {
  (useFetchers as Mock).mockReturnValue([{ state: 'idle' }])
  ;(useNavigation as Mock).mockReturnValue({ state: 'idle' })

  const { result } = renderHook(() => useInteractionInFlight())
  expect(result.current).toBe(false)
})

test('returns true if there is a navigation event', () => {
  (useFetchers as Mock).mockReturnValue([])
  ;(useNavigation as Mock).mockReturnValue({ state: 'loading' })

  const { result } = renderHook(() => useInteractionInFlight())
  expect(result.current).toBe(true)
})

test('returns true if a fetcher loading', () => {
  (useFetchers as Mock).mockReturnValue([{ state: 'loading' }])
  ;(useNavigation as Mock).mockReturnValue({})

  const { result } = renderHook(() => useInteractionInFlight())
  expect(result.current).toBe(true)
})

test('returns true if there is at least one fetcher loading', () => {
  (useFetchers as Mock).mockReturnValue([{ state: 'idle' }, { state: 'loading' }, { state: 'idle' }])
  ;(useNavigation as Mock).mockReturnValue({})

  const { result } = renderHook(() => useInteractionInFlight())
  expect(result.current).toBe(true)
})
