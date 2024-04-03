import { type InputProps, Input as NextUiInput } from '@nextui-org/react'

import { useForm, useInputGroup } from '.'

function Input(props: Omit<InputProps, 'name' | 'id' | 'data-testid' | 'defaultValue' | 'error' | 'variant'>) {
  const { isLoading } = useForm()
  const { name, defaultValue, error } = useInputGroup()
  return (
    <NextUiInput
      {...props}
      id={name}
      name={name}
      data-testid={`input-${name}`}
      defaultValue={defaultValue || ''}
      isReadOnly={isLoading || props.isReadOnly}
      isInvalid={Boolean(error)}
      errorMessage={error}
      variant="bordered"
      labelPlacement="outside"
    />
  )
}
export { Input }
