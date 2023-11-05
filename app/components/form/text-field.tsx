import { type ComponentProps, type ReactNode } from 'react'
import { Label, Input, useInputGroup, ErrorMessage } from '.'

type Props = { label: ReactNode; input?: ComponentProps<typeof Input>; description?: string }

function TextField(props: Props) {
  const { name } = useInputGroup()

  return (
    <div data-testid={`textfield-${name}`}>
      <Label>{props.label}</Label>
      <div className="mt-2">
        <Input {...props.input} />
      </div>
      {props.description ? <p className="mt-2 text-sm text-neutral-500">{props.description}</p> : null}
      <ErrorMessage />
    </div>
  )
}

export { TextField }
