import { Link as RemixLink, useNavigation } from '@remix-run/react'
import { type ReactNode } from 'react'
import { cn } from '@nextui-org/react'

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
      className={cn(
        'my-1.5 block w-full rounded-md px-4 ',
        isDisabled ? 'pointer-events-none' : '',
        isSelected ? 'dark:bg-neutral-900 lg:bg-neutral-200' : 'dark:hover:bg-neutral-800  lg:hover:bg-neutral-100'
      )}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      {children}
    </RemixLink>
  )
}

export { Link }
