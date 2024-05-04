import { useFetcher } from '@remix-run/react'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { Button } from '~/components/button'

function AddRound({
  rounds,
  selectedRound,
  setSelectedRound,
}: {
  rounds: string[]
  selectedRound: string
  setSelectedRound: Dispatch<SetStateAction<string>>
}) {
  const [updateRound, setUpdateRound] = useState(false)
  const fetcher = useFetcher<{ success: boolean }>()

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== 'idle' || !updateRound) return
    const roundAdded = fetcher.data
    if (!roundAdded) return
    const numberOfRounds = String(rounds.length)
    if (selectedRound !== numberOfRounds) {
      setSelectedRound(numberOfRounds)
      setUpdateRound(false)
    }
  }, [fetcher.data, fetcher.state, rounds.length, selectedRound, setSelectedRound, updateRound])

  const onClick = () => {
    const roundId = rounds.at(-1)
    if (!roundId) return
    fetcher.submit({ roundId }, { action: '?/addRound', method: 'POST' })
    setUpdateRound(true)
  }

  return <Button id="add-round" color="primary" text="Next Round" onClick={onClick} className="mt-8 w-full lg:w-auto" />
}

export { AddRound }
