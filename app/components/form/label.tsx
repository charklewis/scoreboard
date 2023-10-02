import { type ReactNode } from 'react'
import { Label as ReactAriaLabel } from 'react-aria-components'
import { useInputGroup } from '.'

function Label({ children }: { children: ReactNode }) {
  const { name } = useInputGroup()

  return (
    <ReactAriaLabel
      className="block text-sm font-medium leading-6 text-gray-900"
      htmlFor={name}
      data-testid={`label-${name}`}
    >
      {children}
    </ReactAriaLabel>
  )
}

export { Label }
