import { screen } from '@testing-library/react'
import { test, vi, expect } from 'vitest'
import { Desktop, Mobile } from '~/routes/dashboard/navbar'
import { renderWithRouter } from '~/test-utils'

const path = '/dashboard'

test('the mobile view renders the navbar', async () => {
  const onClose = vi.fn()
  const { user } = renderWithRouter(<Mobile show={true} onClose={onClose} />, path)
  await screen.findByText(/scoreboards/i)
  screen.getByText(/settings/i)
  screen.getByText(/logout/i)

  const closeButton = screen.getByTestId(/button-sidebar-mobile-close/i)
  await user.click(closeButton)
  expect(onClose).toHaveBeenCalled()
})

test('the mobile view can be hidden', () => {
  const { container } = renderWithRouter(<Mobile show={false} onClose={vi.fn()} />, path)
  expect(container).toBeEmptyDOMElement()
})

test('the desktop view renders the navbar', async () => {
  renderWithRouter(<Desktop show={true} />, path)
  await screen.findByText(/scoreboards/i)
  screen.getByText(/settings/i)
  screen.getByText(/logout/i)
})

test('the desktop view can be hidden', async () => {
  renderWithRouter(<Desktop show={false} />, path)
  const navbar = await screen.findByTestId(/navbar-desktop/i)
  expect(navbar).not.toHaveClass('xl:fixed')
})
