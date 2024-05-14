import { useFetchers, useNavigation } from '@remix-run/react'
import { type ButtonProps, Button as NextUiButton } from '@nextui-org/react'

import { useForm } from '.'

function Button(
  props: Omit<ButtonProps, 'data-testid' | 'disableRipple' | 'children'> & {
    id: string
    text: string
    loadingText?: string
    isWaiting?: boolean
  }
) {
  const { isLoading, action } = useForm()
  const { formAction, state } = useNavigation()
  const fetchers = useFetchers()

  const isWaiting =
    fetchers.some((fetcher) => action && fetcher.formAction?.includes(action)) ||
    Boolean(isLoading && action && formAction && formAction.includes(action))

  const isDisabled = state !== 'idle' || props.isDisabled

  return (
    <NextUiButton
      {...props}
      isLoading={isWaiting}
      isDisabled={isDisabled}
      id={`button-${props.id}`}
      data-testid={`button-${props.id}`}
      disableRipple={true}
    >
      {isWaiting ? props.loadingText || '' : props.text}
    </NextUiButton>
  )
}

export { Button }
