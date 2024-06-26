import { useState } from 'react'
import { Tab, Tabs } from '@nextui-org/react'

import { useInteractionInFlight } from '~/components/useInteractionInFlight'

import { Options } from './options'
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
        <div className="flex items-center justify-center gap-3">
          <Options rounds={rounds} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
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
    </div>
  )
}

export { InProgress }
