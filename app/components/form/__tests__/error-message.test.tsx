import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { expect, test, vi, type Mock } from 'vitest'
import { ErrorMessage } from '~/components/form/error-message'
import { useInputGroup } from '~/components/form/input-group'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

const UseInputGroupMock = useInputGroup as Mock

test("nothing is rendered when there's no error", () => {
  const name = faker.lorem.word()
  UseInputGroupMock.mockReturnValue({ name })
  const { container } = render(<ErrorMessage />)
  expect(container).toBeEmptyDOMElement()
})

test('error message is rendered', () => {
  const name = faker.lorem.word()
  const error = faker.lorem.words(3)
  UseInputGroupMock.mockReturnValue({ name, error })
  render(<ErrorMessage />)
  screen.getByTestId(`error-message-${name}`)
  screen.getByText(error)
})
