import { Link as RemixLink, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'

function TextOnlyLink({
  id,
  variant = 'primary',
  href,
  text,
  className,
}: {
  id: string
  variant?: 'primary' | 'secondary' | 'danger'
  href: string
  text: string
  className?: string
}) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'

  const primary = clsx(
    'rounded-md px-3 py-1.5 text-green-600',
    'text-sm font-semibold',
    isDisabled ? 'pointer-events-none' : 'hover:text-green-800',
    className
  )

  const secondary = clsx(
    'rounded-md px-3 py-1.5',
    'text-sm font-semibold',
    isDisabled ? 'pointer-events-none' : 'hover:text-neutral-800',
    className
  )

  const danger = clsx(
    'rounded-md px-3 py-1.5 text-red-600',
    'text-sm font-semibold',
    isDisabled ? 'pointer-events-none' : 'hover:text-red-800',
    className
  )

  const getClassName = () => {
    if (variant === 'secondary') {
      return secondary
    }
    if (variant === 'danger') {
      return danger
    }
    return primary
  }

  return (
    <RemixLink
      id={`link-${id}`}
      to={href}
      className={getClassName()}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      {text}
    </RemixLink>
  )
}

export { TextOnlyLink }
