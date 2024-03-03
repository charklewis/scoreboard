import { type ComponentProps, type ReactNode } from 'react'
import { Label, Input, useInputGroup, ErrorMessage } from '.'

type Props = { label: ReactNode; input?: ComponentProps<typeof Input>; description?: string }

function DEPRECATED_TextField(props: Props) {
  const { name } = useInputGroup()

  return (
    <div data-testid={`DEPRECATED_TextField-${name}`}>
      <Label>{props.label}</Label>
      <div className="mt-2">
        <Input {...props.input} />
      </div>
      {props.description ? <p className="mt-2 text-sm text-neutral-500">{props.description}</p> : null}
      <ErrorMessage />
    </div>
  )
}

export { DEPRECATED_TextField }
