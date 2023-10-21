import { Link as RemixLink, useNavigation, useLocation } from '@remix-run/react'
import { clsx } from 'clsx'
import { type ForwardRefExoticComponent, type RefAttributes } from 'react'

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
  const isDisabled = navigation.state !== 'idle'
  const current = location.pathname.includes(href)

  return (
    <RemixLink
      id={`link-${id}`}
      to={href}
      className={clsx(
        current ? 'bg-neutral-50 text-green-600' : 'text-neutral-700 ',
        'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
        isDisabled ? 'pointer-events-none' : 'hover:bg-neutral-50 hover:text-green-600',
        className
      )}
      onClick={(event) => (isDisabled ? event.preventDefault() : null)}
      data-testid={`link-${id}`}
    >
      <Icon
        className={clsx(
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
