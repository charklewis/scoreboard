import { afterEach, beforeEach, test, vi } from 'vitest'
import { act, screen } from '@testing-library/react'

import { Timer } from '~/components/scrabble/timer'
import { renderWithRouter } from '~/test-utils'

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  vi.useRealTimers()
})

test('user can start a timer', async () => {
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(async () => {})

  const route = [{ path: '/', element: <Timer isOpen onOpenChange={vi.fn()} /> }]
  const { user } = renderWithRouter(route)

  await screen.findByTestId(/modal-timer/i)

  await act(() => user.click(screen.getByText(/start/i)))
  screen.getByText(/03:00/i)

  await act(() => vi.advanceTimersByTime(90000))
  screen.getByText(/01:30/i)

  await act(() => vi.advanceTimersByTime(90000))
  screen.getByText(/finished/i)

  await act(() => user.click(screen.getByText(/reset/i)))
  screen.getByText(/03:00/i)
})

test('user can pause and continue the timer', async () => {
  vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(async () => {})

  const route = [{ path: '/', element: <Timer isOpen onOpenChange={vi.fn()} /> }]
  const { user } = renderWithRouter(route)

  await screen.findByTestId(/modal-timer/i)

  await act(() => user.click(screen.getByText(/start/i)))
  screen.getByText(/03:00/i)

  await act(() => vi.advanceTimersByTime(1000))
  screen.getByText(/02:59/i)

  await act(() => user.click(screen.getByText(/pause/i)))

  await act(() => vi.advanceTimersByTime(1000))
  screen.getByText(/02:59/i)
  await act(() => vi.advanceTimersByTime(1000))
  screen.getByText(/02:59/i)

  await act(() => user.click(screen.getByText(/continue/i)))
  await act(() => vi.advanceTimersByTime(1000))
  screen.getByText(/02:58/i)
  await act(() => vi.advanceTimersByTime(1000))
  screen.getByText(/02:57/i)
})
