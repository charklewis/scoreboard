import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { expect, test, vi, type Mock } from 'vitest'
import { ErrorMessage } from '~/components/form/error-message'
import { useInputGroup } from '~/components/form/input-group'

vi.mock('~/components/form/input-group', () => ({ useInputGroup: vi.fn() }))

// function render() {
//   const id = faker.lorem.word()
//   const name = faker.lorem.word()
//   const router = createMemoryRouter([
//     {
//       path: '/',
//       element: (
//         <Form id={id}>
//           <InputGroup name={name}>
//             <ErrorMessage />
//           </InputGroup>
//         </Form>
//       ),
//     },
//   ])

//   const view = renderRtl(<RouterProvider router={router} />)
//   return { id, name, ...view }
// }

test("nothing is rendered when there's no error", () => {
  const name = faker.lorem.word()
  ;(useInputGroup as Mock).mockReturnValue({ name })
  const { container } = render(<ErrorMessage />)
  expect(container).toBeEmptyDOMElement()
})

test('error message is rendered', () => {
  const name = faker.lorem.word()
  const error = faker.lorem.words(3)
  ;(useInputGroup as Mock).mockReturnValue({ name, error })
  render(<ErrorMessage />)
  screen.getByTestId(`error-message-${name}`)
  screen.getByText(error)
})
