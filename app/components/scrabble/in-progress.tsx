import { useState } from 'react'
import { Tab, Tabs } from '@nextui-org/react'

import { useInteractionInFlight } from '~/components/useInteractionInFlight'

import { AddRound } from './add-round'
import { Dictionary } from './dictionary'
import { EndGame } from './end-game'
import { Round, type RoundType } from './round'

function InProgress({ rounds }: { rounds: RoundType[] }) {
  const isLoading = useInteractionInFlight()
  const [selectedRound, setSelectedRound] = useState(
    () => String(rounds.find((round) => round.roundCompleted === false)?.roundNumber) || '1'
  )

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-2 text-lg font-semibold capitalize leading-6" data-testid="rounds-title">
          Rounds
        </h1>
        <div className="flex gap-3">
          <Dictionary />
          <EndGame roundId={rounds.find((round) => String(round.roundNumber) === selectedRound)?.id} />
        </div>
      </div>
      <Tabs
        aria-label="rounds"
        data-testid="list-rounds"
        selectedKey={selectedRound}
        onSelectionChange={(value) => setSelectedRound(String(value))}
        items={rounds}
        isDisabled={isLoading}
        classNames={{ base: 'flex mb-6' }}
      >
        {(round) => (
          <Tab key={String(round.roundNumber)} title={round.roundNumber}>
            <Round round={round} />
          </Tab>
        )}
      </Tabs>
      <AddRound
        rounds={rounds.map((round) => round.id)}
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
      />
    </div>
  )
}

export { InProgress }
