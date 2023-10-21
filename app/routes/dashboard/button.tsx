import { useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { type ForwardRefExoticComponent, type RefAttributes, type MouseEventHandler } from 'react'

//note: this is from @heroicons/react
type Icon = ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined
    titleId?: string | undefined
  } & RefAttributes<SVGSVGElement>
>

function Button({
  id,
  className,
  description,
  onClick,
  Icon,
}: {
  id: string
  description: string
  className?: string
  onClick: MouseEventHandler<HTMLButtonElement>
  Icon: Icon
}) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'
  return (
    <button
      id={`button-${id}`}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      data-testid={`button-${id}`}
      className={clsx('rounded-md p-2.5 text-neutral-900', isDisabled ? '' : 'hover:bg-neutral-500/5', className)}
    >
      <span className="sr-only">{description}</span>
      <Icon className="h-5 w-5" data-testid={`button-icon-${id}`} aria-hidden="true" />
    </button>
  )
}

export { Button }
