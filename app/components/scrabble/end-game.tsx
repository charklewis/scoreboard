import { useFetcher } from '@remix-run/react'

import { Button } from '~/components/button'

function EndGame({ roundId }: { roundId?: string }) {
  const fetcher = useFetcher()

  const onClick = () => {
    if (!roundId) return
    fetcher.submit({ roundId }, { action: '?/finishGame', method: 'POST' })
  }

  return <Button id="end-game" color="success" text="Finish game" variant="flat" onClick={onClick} />
}

export { EndGame }
