import { faker } from '@faker-js/faker'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi, type Mock } from 'vitest'
import { EmojiPicker } from '~/components/form/emoji-picker'
import { useInputGroup } from '~/components/form/input-group'
import { emoji } from '~/database/static'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

const UseInputGroupMock = useInputGroup as Mock

const emojies = Object.entries(emoji).map(([name, value]) => ({ name, value }))

test('renders emoji options to select an emoji', async () => {
  const name = faker.lorem.word()
  const emoji = faker.helpers.arrayElement(emojies)
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<EmojiPicker />)
  await act(() => user.click(screen.getByText(emoji.name)))
  expect(screen.getByTestId(`input-hidden-${name}`)).toHaveValue(emoji.name)
})

test('can pass an onChange function', async () => {
  const name = faker.lorem.word()
  const emoji = faker.helpers.arrayElement(emojies)
  const onChange = vi.fn()
  UseInputGroupMock.mockReturnValue({ name })
  const user = userEvent.setup()
  render(<EmojiPicker onChange={onChange} />)
  await act(() => user.click(screen.getByText(emoji.name)))
  expect(onChange).toHaveBeenCalledWith(emoji.name)
})

test('renders with a random emoji selected', async () => {
  const name = faker.lorem.word()
  UseInputGroupMock.mockReturnValue({ name })
  render(<EmojiPicker />)
  expect(screen.getByTestId(`input-hidden-${name}`)).not.toHaveValue('')
})
