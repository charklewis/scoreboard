import { useNavigation } from '@remix-run/react'
import { type ReactNode } from 'react'
import { type LinkProps, Link as NextUiLink } from '@nextui-org/react'

function Link(props: Omit<LinkProps, 'data-testid' | 'children'> & { id: string; text: string | ReactNode }) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle' || props.isDisabled

  return (
    <NextUiLink {...props} isDisabled={isDisabled} id={`link-${props.id}`} data-testid={`link-${props.id}`}>
      {props.text}
    </NextUiLink>
  )
}

export { Link }
