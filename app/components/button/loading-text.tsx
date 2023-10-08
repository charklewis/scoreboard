import { useNavigation } from '@remix-run/react'
import classNames from 'classnames'
import { Button } from 'react-aria-components'
import { useForm } from '~/components/form'

function Spinner({ id }: { id: string }) {
  return (
    <svg
      className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
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

function LoadingTextButton({
  id,
  variant = 'primary',
  type = 'button',
  text,
  loadingText,
}: {
  id: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary'
  text: string
  loadingText: string
}) {
  const { isLoading, action } = useForm()
  const { formAction } = useNavigation()
  const isWaiting = isLoading && action && formAction && formAction.includes(action)

  const primary = classNames('flex w-full justify-center rounded-md px-3 py-1.5 hover:text-green-800')

  const secondary = classNames(
    'flex w-full justify-center rounded-md px-3 py-1.5 hover:text-neutral-800',
    'text-sm font-semibold',
    'disabled:opacity-50 disabled:hover:text-black'
  )

  return (
    <Button
      id={`button-${id}`}
      type={type}
      isDisabled={isLoading}
      className={variant === 'primary' ? primary : secondary}
      data-testid={`button-${id}`}
    >
      {isWaiting ? <Spinner id={id} /> : null}
      {isWaiting ? loadingText : text}
    </Button>
  )
}

export { LoadingTextButton }
