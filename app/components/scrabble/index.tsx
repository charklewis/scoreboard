import { useState } from 'react'
import { Tab, Tabs } from '@nextui-org/react'

import { useInteractionInFlight } from '~/components/useInteractionInFlight'

import { AddRound } from './add-round'
import { EndGame } from './end-game'
import { Round, type RoundType } from './round'

function Scrabble({ rounds }: { rounds: RoundType[] }) {
  const isLoading = useInteractionInFlight()
  const [selectedRound, setSelectedRound] = useState(
    () => String(rounds.find((round) => round.roundCompleted === false)?.roundNumber) || '1'
  )

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="mb-2 text-lg font-semibold capitalize leading-6">Rounds</h1>
        <EndGame roundId={rounds.find((round) => String(round.roundNumber) === selectedRound)?.id} />
      </div>
      <Tabs
        aria-label="rounds"
        selectedKey={selectedRound}
        onSelectionChange={(value) => setSelectedRound(String(value))}
        items={rounds}
        isDisabled={isLoading}
        classNames={{ base: 'flex mb-6' }}
      >
        {(round) => (
          <Tab key={String(round.roundNumber)} title={round.roundNumber}>
            {/* <Divider className="my-4 mb-8" /> */}
            <Round round={round} />
          </Tab>
        )}
      </Tabs>
      <AddRound rounds={rounds} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
    </div>
  )
}

export { Scrabble }
