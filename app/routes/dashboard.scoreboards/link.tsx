import { useLink } from '@react-aria/link'
import { Link as RemixLink, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { useRef, type ReactNode } from 'react'

function Link({ id, href, children }: { id: string; href: string; children: ReactNode }) {
  const navigation = useNavigation()
  const ref = useRef(null)
  const isDisabled = navigation.state !== 'idle'
  const { linkProps } = useLink({ href, isDisabled }, ref)

  return (
    <RemixLink
      {...linkProps}
      id={`link-${id}`}
      ref={ref}
      to={href}
      className={clsx(
        'my-1.5 block w-full rounded-md px-4 ',
        isDisabled ? 'pointer-events-none opacity-50' : 'hover:bg-neutral-100'
      )}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      {children}
    </RemixLink>
  )
}

export { Link }
