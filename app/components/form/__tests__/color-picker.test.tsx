import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, type Mock } from 'vitest'
import { useInputGroup } from '~/components/form/input-group'
import { ColorPicker } from '~/components/form/color-picker'
import { color } from '~/database/static'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

const UseInputGroupMock = useInputGroup as Mock

const colors = Object.entries(color).map(([name, value]) => ({ name, ...value }))

test('renders color options to select a color', async () => {
  const name = faker.lorem.word()
  const color = faker.helpers.arrayElement(colors)
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<ColorPicker />)
  await user.click(screen.getByText(color.name))
  expect(screen.getByTestId(`input-hidden-${name}`)).toHaveValue(color.name)
})

test('can pass an onChange function', async () => {
  const name = faker.lorem.word()
  const color = faker.helpers.arrayElement(colors)
  const onChange = vi.fn()
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<ColorPicker onChange={onChange} />)
  await user.click(screen.getByText(color.name))
  expect(onChange).toHaveBeenCalledWith(color.name)
})

test('renders with a random color selected', async () => {
  const name = faker.lorem.word()
  UseInputGroupMock.mockReturnValue({ name })
  render(<ColorPicker />)
  expect(screen.getByTestId(`input-hidden-${name}`)).not.toHaveValue('')
})
