import { json } from '@remix-run/node'
import { expect, test, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { act, screen } from '@testing-library/react'

import { renderWithRouter } from '~/test-utils'

import { Dictionary } from '../dictionary'

test('renders nothing if the modal is not open', async () => {
  renderWithRouter([{ path: '/', element: <Dictionary isOpen={false} onOpenChange={vi.fn()} /> }])
  expect(screen.queryByTestId(/modal-check-word/i)).not.toBeInTheDocument()
})

test('user can check if a word is valid', async () => {
  const word = faker.lorem.word()
  const meaning = faker.lorem.sentence()
  const score = faker.number.int()

  const loader = vi.fn().mockReturnValue(json({ success: true, meaning: [meaning], word, score }))
  const onOpenChange = vi.fn()

  const { user } = renderWithRouter([
    { path: '/', element: <Dictionary isOpen={true} onOpenChange={onOpenChange} /> },
    { path: '/scrabble', loader },
  ])

  await screen.findByTestId(/modal-check-word/i)

  await act(() => user.type(screen.getByPlaceholderText(/enter a word/i), word))
  await act(() => user.click(screen.getByTestId(/submit-check-word/i)))

  expect(await screen.findByTestId(/check-word-score/i)).toHaveTextContent(String(score))
  expect(screen.getByTestId(/check-word-meaning/i)).toHaveTextContent(meaning)
})

test('user can check if a word is invalid', async () => {
  const word = faker.lorem.word()

  const loader = vi.fn().mockReturnValue(json({ success: false, word }))
  const onOpenChange = vi.fn()

  const { user } = renderWithRouter([
    { path: '/', element: <Dictionary isOpen={true} onOpenChange={onOpenChange} /> },
    { path: '/scrabble', loader },
  ])

  await screen.findByTestId(/modal-check-word/i)

  await act(() => user.type(screen.getByPlaceholderText(/enter a word/i), word))
  await act(() => user.click(screen.getByTestId(/submit-check-word/i)))

  await screen.findByText(/this is not an official scrabble word/i)
})
