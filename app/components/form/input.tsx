import { type InputProps, Input as NextUiInput } from '@nextui-org/react'

import { ErrorMessage, useForm, useInputGroup } from '.'

function Input(props: Omit<InputProps, 'name' | 'id' | 'data-testid' | 'defaultValue' | 'error' | 'variant'>) {
  const { isLoading } = useForm()
  const { name, defaultValue } = useInputGroup()

  return (
    <>
      <NextUiInput
        {...props}
        id={name}
        name={name}
        data-testid={`input-${name}`}
        defaultValue={defaultValue !== null && defaultValue !== undefined ? defaultValue : ''}
        isReadOnly={isLoading || props.isReadOnly}
        variant="bordered"
        labelPlacement={props.labelPlacement || 'outside'}
      />
      <ErrorMessage />
    </>
  )
}
export { Input }
