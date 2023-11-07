import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import Scoreboards from '~/routes/dashboard.scoreboards.$gameId/route'

test('user can create a new game', async () => {
  const Component = createRemixStub([
    { path: '/', Component: Scoreboards, loader: () => json({ gameStatus: 'new', players: [] }) },
  ])
  render(<Component />)
  await screen.findByText(/add players/i)
  screen.getByText(/you can add up to 4 players/i)
})

test('user can play a game', async () => {
  const Component = createRemixStub([
    { path: '/', Component: Scoreboards, loader: () => json({ gameStatus: 'in-progress', players: [] }) },
  ])
  render(<Component />)
  await screen.findByText(/in progress/i)
})

test('user view a finished game', async () => {
  const Component = createRemixStub([
    { path: '/', Component: Scoreboards, loader: () => json({ gameStatus: 'finished', players: [] }) },
  ])
  render(<Component />)
  await screen.findByText(/finished/i)
})

test('user view a finished game', async () => {
  const Component = createRemixStub([
    { path: '/', Component: Scoreboards, loader: () => json({ gameStatus: 'error', players: [] }) },
  ])
  render(<Component />)
  await screen.findByText(/error/i)
})
