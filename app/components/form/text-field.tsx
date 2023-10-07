import { type ComponentProps, type ReactNode } from 'react'
import { TextField as ReactAriaTextField, Text } from 'react-aria-components'
import { Label, Input, useInputGroup, ErrorMessage, useForm } from '.'

type Props = { label: ReactNode; input?: ComponentProps<typeof Input>; description?: string }

function TextField(props: Props) {
  const { isLoading } = useForm()
  const { name, error } = useInputGroup()

  return (
    <ReactAriaTextField data-testid={`textfield-${name}`} isInvalid={Boolean(error)} isReadOnly={isLoading}>
      <Label>{props.label}</Label>
      <div className="mt-2">
        <Input {...props.input} />
      </div>
      {props.description ? (
        <Text slot="description" className="mt-2 text-sm text-neutral-500">
          {props.description}
        </Text>
      ) : null}
      <ErrorMessage />
    </ReactAriaTextField>
  )
}

export { TextField }
