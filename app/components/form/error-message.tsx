import { Text } from 'react-aria-components'
import { useInputGroup } from '.'

function ErrorMessage() {
  const { name, error } = useInputGroup()
  if (!error) {
    return null
  }
  return (
    <Text slot="errorMessage" className="mt-2 text-sm text-red-600" data-testid={`error-message-${name}`}>
      {error}
    </Text>
  )
}

export { ErrorMessage }
