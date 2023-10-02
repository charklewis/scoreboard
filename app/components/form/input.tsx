import classNames from 'classnames'
import { type ComponentProps } from 'react'
import { Input as ReactAriaInput } from 'react-aria-components'
import { useInputGroup } from '.'

type Props = Pick<ComponentProps<typeof ReactAriaInput>, 'placeholder' | 'type'>

function Input(props: Props) {
  const { name, defaultValue, error, formIsLoading } = useInputGroup()

  return (
    <ReactAriaInput
      className={classNames(
        'block w-full rounded-md border-0 px-1.5 py-1.5',
        'text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6',
        'ring-1 ring-inset focus:ring-2 focus:ring-inset',
        'read-only:bg-gray-50 read-only:text-gray-500 read-only:focus:ring-1 read-only:focus:ring-gray-200',
        error
          ? 'ring-red-400 placeholder:text-red-300 focus:ring-red-500'
          : 'ring-gray-300 placeholder:text-gray-400 focus:ring-green-600'
      )}
      defaultValue={defaultValue}
      id={name}
      name={name}
      data-testid={`input-${name}`}
      readOnly={formIsLoading}
      {...props}
    />
  )
}

export { Input }
