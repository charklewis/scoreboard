import { useLink } from '@react-aria/link'
import { Link as RemixLink, useNavigation, useLocation } from '@remix-run/react'
import classNames from 'classnames'
import { type ForwardRefExoticComponent, type RefAttributes, useRef } from 'react'

//note: this is from @heroicons/react
type Icon = ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined
    titleId?: string | undefined
  } & RefAttributes<SVGSVGElement>
>

function IconWithTextLink({
  id,
  variant = 'primary',
  className,
  text,
  href,
  Icon,
}: {
  id: string
  text: string
  variant?: 'primary'
  className?: string
  href: string
  Icon: Icon
}) {
  const navigation = useNavigation()
  const location = useLocation()
  const ref = useRef(null)
  const isDisabled = navigation.state !== 'idle'
  const { linkProps } = useLink({ href, isDisabled }, ref)
  const current = location.pathname.includes(href)

  const primaryLink = classNames(
    current ? 'bg-neutral-50 text-green-600' : 'text-neutral-700 hover:bg-neutral-50 hover:text-green-600',
    'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
    className
  )

  const primaryIcon = classNames(
    current ? 'text-green-600' : 'text-neutral-400 group-hover:text-green-600',
    'h-6 w-6 shrink-0'
  )

  return (
    <RemixLink
      {...linkProps}
      id={`link-${id}`}
      ref={ref}
      to={href}
      className={primaryLink}
      data-testid={`button-${id}`}
    >
      <Icon className={primaryIcon} aria-hidden="true" />
      {text}
    </RemixLink>
  )
}

export { IconWithTextLink }
