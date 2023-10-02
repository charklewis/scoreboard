import { type ComponentProps } from 'react'
import { TextField as ReactAriaTextField, Text } from 'react-aria-components'
import { Label, Input, useInputGroup, ErrorMessage, useForm } from '.'

type Props = { label: ComponentProps<typeof Label>; input: ComponentProps<typeof Input>; description?: string }

function TextField(props: Props) {
  const { isLoading } = useForm()
  const { name, error } = useInputGroup()

  return (
    <ReactAriaTextField data-testid={`textfield-${name}`} isInvalid={Boolean(error)} isReadOnly={isLoading}>
      <Label {...props.label} />
      <div className="mt-2">
        <Input {...props.input} />
      </div>
      {props.description ? (
        <Text slot="description" className="mt-2 text-sm text-gray-500">
          {props.description}
        </Text>
      ) : null}
      <ErrorMessage />
    </ReactAriaTextField>
  )
}

export { TextField }
