import { useFetchers, useNavigation } from '@remix-run/react'

function useInteractionInFlight() {
  const { state } = useNavigation()
  const fetchers = useFetchers()

  if (!fetchers || !state) return false

  return state !== 'idle' || fetchers.some(({ state }) => state !== 'idle')
}

export { useInteractionInFlight }
