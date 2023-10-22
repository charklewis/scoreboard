import { Link as RemixLink, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { type ReactNode } from 'react'

function Link({
  id,
  isSelected = false,
  href,
  children,
}: {
  id: string
  isSelected: boolean
  href: string
  children: ReactNode
}) {
  const navigation = useNavigation()

  const isDisabled = navigation.state !== 'idle'

  return (
    <RemixLink
      id={`link-${id}`}
      to={href}
      className={clsx(
        'my-1.5 block w-full rounded-md px-4 ',
        isDisabled ? 'pointer-events-none' : '',
        isSelected ? 'bg-green-500' : 'hover:bg-neutral-100'
      )}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      {children}
    </RemixLink>
  )
}

export { Link }
