import { useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { useEffect } from 'react'
import { useForm } from '~/components/form'

function Spinner({ id }: { id: string }) {
  return (
    <svg
      className="h-5 w-5 animate-spin text-neutral-600"
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

function AddNewScoreboardButton({ id, text, closeMenu }: { id: string; text: string; closeMenu: Function }) {
  const { isLoading, action } = useForm()
  const { formAction, state } = useNavigation()
  const isWaiting = Boolean(isLoading && action && formAction && formAction.includes(action))

  useEffect(() => {
    if (!formAction || !action) return
    if (formAction.includes(action) && state === 'loading') {
      closeMenu()
    }
  }, [action, closeMenu, formAction, state])

  return (
    <button
      id={`button-new-scoreboard-${id}`}
      type="submit"
      disabled={isWaiting}
      data-testid={`button-new-scoreboard-${id}`}
      className={clsx(
        isLoading ? '' : 'text-neutral-900 hover:bg-neutral-100',
        'flex w-full items-center justify-between px-4 py-2 text-left text-sm text-neutral-700'
      )}
    >
      {text}
      {isWaiting ? <Spinner id={id} /> : null}
    </button>
  )
}

export { AddNewScoreboardButton }
