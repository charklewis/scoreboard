import { useInputGroup } from '.'

function ErrorMessage() {
  const { name, error } = useInputGroup()
  if (!error) {
    return null
  }

  return (
    <p className="mt-2 text-sm text-red-600" data-testid={`error-message-${name}`}>
      {error}
    </p>
  )
}

export { ErrorMessage }
