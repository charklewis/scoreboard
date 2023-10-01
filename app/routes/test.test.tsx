import { render, screen } from '@testing-library/react'
import { expect, test } from 'bun:test'
import { Button } from './button'

test('this test passes', () => {
  expect(true).toBe(true)
})

test('button loads', () => {
  render(<Button />)
  screen.getByText(/click me/i)
})
