import { useLink } from '@react-aria/link'
import { Link as RemixLink, useNavigation } from '@remix-run/react'
import classNames from 'classnames'
import { useRef } from 'react'

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
  const ref = useRef(null)
  const isDisabled = navigation.state !== 'idle'
  const { linkProps } = useLink({ href, isDisabled }, ref)

  const primary = classNames(
    'rounded-md px-3 py-1.5 text-green-600',
    'text-sm font-semibold',
    isDisabled ? 'opacity-50' : 'hover:text-green-800',
    className
  )

  const secondary = classNames(
    'rounded-md px-3 py-1.5',
    'text-sm font-semibold',
    isDisabled ? 'opacity-50' : 'hover:text-neutral-800',
    className
  )

  const danger = classNames(
    'rounded-md px-3 py-1.5 text-red-600',
    'text-sm font-semibold',
    isDisabled ? 'opacity-50' : 'hover:text-red-800',
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
      {...linkProps}
      id={`link-${id}`}
      ref={ref}
      to={href}
      className={getClassName()}
      data-testid={`button-${id}`}
    >
      {text}
    </RemixLink>
  )
}

export { TextOnlyLink }
