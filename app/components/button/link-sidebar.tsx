import { useLink } from '@react-aria/link'
import { Link as RemixLink, useNavigation } from '@remix-run/react'
import classNames from 'classnames'
import { useRef, type ReactNode } from 'react'

function SidebarLink({ id, href, children }: { id: string; href: string; children: ReactNode }) {
  const navigation = useNavigation()
  const ref = useRef(null)
  const isDisabled = navigation.state !== 'idle'
  const { linkProps } = useLink({ href, isDisabled }, ref)

  const primary = classNames(
    'rounded-md px-4 my-1.5 w-full block ',
    isDisabled ? 'opacity-50 pointer-events-none' : 'hover:bg-neutral-100'
  )

  return (
    <RemixLink
      {...linkProps}
      id={`link-${id}`}
      ref={ref}
      to={href}
      className={primary}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      {children}
    </RemixLink>
  )
}

export { SidebarLink }
