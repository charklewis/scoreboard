import { type ReactNode } from 'react'
import { type LinkProps, Link as NextUiLink } from '@nextui-org/react'

function Link(props: Omit<LinkProps, 'data-testid' | 'children'> & { id: string; text: string | ReactNode }) {
  return (
    <NextUiLink {...props} isDisabled={props.isDisabled} id={`link-${props.id}`} data-testid={`link-${props.id}`}>
      {props.text}
    </NextUiLink>
  )
}

export { Link }
