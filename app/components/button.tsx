import { useNavigation } from '@remix-run/react'
import { type ButtonProps, Button as NextUiButton } from '@nextui-org/react'
import { type ReactNode } from 'react'

function Button(
  props: Omit<ButtonProps, 'data-testid' | 'disableRipple' | 'children'> & { id: string; text: string | ReactNode }
) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle' || props.isDisabled

  return (
    <NextUiButton
      {...props}
      isDisabled={isDisabled}
      id={`button-${props.id}`}
      onClick={(event) => {
        isDisabled ? event.preventDefault() : props.onClick?.(event)
      }}
      data-testid={`button-${props.id}`}
      disableRipple={true}
    >
      {props.text}
    </NextUiButton>
  )
}

export { Button }
