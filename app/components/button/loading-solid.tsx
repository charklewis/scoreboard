import { useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { Button } from 'react-aria-components'
import { useForm } from '~/components/form'

function Spinner({ id, variant }: { id: string; variant: 'primary' | 'secondary' }) {
  return (
    <svg
      className={clsx('-ml-1 mr-3 h-5 w-5 animate-spin', variant === 'primary' ? 'text-white' : 'text-black')}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-testid={`button-spinner-${id}`}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function LoadingSolidButton({
  id,
  variant = 'primary',
  type = 'button',
  text,
  loadingText,
}: {
  id: string
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  text: string
  loadingText: string
}) {
  const { isLoading, action } = useForm()
  const { formAction } = useNavigation()
  const isWaiting = isLoading && action && formAction && formAction.includes(action)

  const primary = clsx(
    'flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 shadow-sm hover:bg-green-500',
    'text-sm font-semibold leading-6 text-white',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600',
    'disabled:opacity-50 disabled:hover:bg-green-600'
  )

  const secondary = clsx(
    'flex w-full justify-center rounded-md px-3 py-1.5 shadow-sm hover:bg-neutral-50',
    'text-sm font-semibold',
    'ring-1 ring-inset ring-neutral-300',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100',
    'disabled:opacity-50 disabled:hover:bg-white'
  )

  return (
    <Button
      id={`button-${id}`}
      type={type}
      isDisabled={isLoading}
      className={variant === 'primary' ? primary : secondary}
      data-testid={`button-${id}`}
    >
      {isWaiting ? <Spinner id={id} variant={variant} /> : null}
      {isWaiting ? loadingText : text}
    </Button>
  )
}

export { LoadingSolidButton }
