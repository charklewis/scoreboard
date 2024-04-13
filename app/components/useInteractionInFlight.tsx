import { useFetchers, useNavigation } from '@remix-run/react'

function useInteractionInFlight() {
  const { state } = useNavigation()
  const fetchers = useFetchers()

  return state !== 'idle' || fetchers.some(({ state }) => state !== 'idle')
}

export { useInteractionInFlight }
