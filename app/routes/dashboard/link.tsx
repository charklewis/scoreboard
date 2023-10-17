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

function LinkWithIcon({
  id,
  className,
  text,
  href,
  Icon,
}: {
  id: string
  text: string
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

  return (
    <RemixLink
      {...linkProps}
      id={`link-${id}`}
      ref={ref}
      to={href}
      className={classNames(
        current ? 'bg-neutral-50 text-green-600' : 'text-neutral-700 ',
        'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
        isDisabled ? 'pointer-events-none opacity-50' : 'hover:bg-neutral-50 hover:text-green-600',
        className
      )}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      <Icon
        className={classNames(
          current ? 'text-green-600' : 'text-neutral-400 ',
          'h-6 w-6 shrink-0',
          isDisabled ? '' : 'group-hover:text-green-600'
        )}
        data-testid={`link-icon-${id}`}
        aria-hidden="true"
      />
      {text}
    </RemixLink>
  )
}

export { LinkWithIcon }
