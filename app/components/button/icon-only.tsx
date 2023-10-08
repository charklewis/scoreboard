import { useNavigation } from '@remix-run/react'
import classNames from 'classnames'
import { type ForwardRefExoticComponent, type RefAttributes } from 'react'
import { Button, type PressEvent } from 'react-aria-components'

//note: this is from @heroicons/react
type Icon = ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string | undefined
    titleId?: string | undefined
  } & RefAttributes<SVGSVGElement>
>

function IconOnlyButton({
  id,
  className,
  description,
  onClick,
  Icon,
}: {
  id: string
  description: string
  className?: string
  onClick: (e: PressEvent) => void
  Icon: Icon
}) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'
  return (
    <Button
      id={`button-${id}`}
      type="button"
      onPress={onClick}
      isDisabled={isDisabled}
      data-testid={`button-${id}`}
      className={classNames('rounded-md p-2.5 text-neutral-900', isDisabled ? '' : 'hover:bg-neutral-500/5', className)}
    >
      <span className="sr-only">{description}</span>
      <Icon className="h-5 w-5" data-testid={`button-icon-${id}`} aria-hidden="true" />
    </Button>
  )
}

export { IconOnlyButton }
