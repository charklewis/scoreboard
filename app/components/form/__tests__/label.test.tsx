import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { test, vi, type Mock } from 'vitest'
import { useInputGroup } from '~/components/form/input-group'
import { Label } from '~/components/form/label'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

test('label is rendered', () => {
  const name = faker.lorem.word()
  const text = faker.lorem.words(2)
  ;(useInputGroup as Mock).mockReturnValue({ name })
  render(<Label>{text}</Label>)
  screen.getByTestId(`label-${name}`)
  screen.getByText(text)
})
