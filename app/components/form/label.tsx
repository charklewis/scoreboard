import { type ReactNode } from 'react'
import { useInputGroup } from '.'

function Label({ children }: { children: ReactNode }) {
  const { name } = useInputGroup()

  return (
    <label
      className="block text-sm font-medium leading-6 text-neutral-900"
      htmlFor={name}
      data-testid={`label-${name}`}
    >
      {children}
    </label>
  )
}

export { Label }
