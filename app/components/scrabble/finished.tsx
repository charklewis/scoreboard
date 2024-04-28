import { useMemo, useState } from 'react'
import { Avatar, Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Button } from '~/components/button'
import { getOrdinalSuffix } from '~/components/helpers'
import { calculatePlayerScores } from './helpers'
import { type RoundType } from './round'

function Finished({ rounds }: { rounds: RoundType[] }) {
  const [showRounds, setShowRounds] = useState(false)
  const players = useMemo(() => calculatePlayerScores(rounds), [rounds])

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold capitalize leading-6" data-testid="rounds-title">
        Scrabble
      </h1>
      <ul className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {players.map((player, index) => (
          <Card key={player.id} data-testid={`round-player-${player.id}`}>
            <CardHeader className="justify-between">
              <div className="flex gap-3">
                <Avatar
                  showFallback
                  size="lg"
                  className={player.background}
                  fallback={
                    <div className="text-4xl" data-testid={`player-${player.id}`}>
                      {player.emoji}
                    </div>
                  }
                />
                <div className="flex flex-col">
                  <p className="text-md">{player.name}</p>
                  <p className="text-small text-default-500" data-testid={`player-${player.id}-total-score`}>
                    Score {player.score}
                  </p>
                </div>
              </div>
              {index === 0 ? <span className="mr-2">🏆</span> : null}
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="font-semibold">
                {index + 1}
                {getOrdinalSuffix(index + 1)} place
              </p>
            </CardBody>
          </Card>
        ))}
      </ul>

      <div className="flex justify-center">
        {/* todo: this should have a chevron up and down ("see all rounds" then "hide") */}
        <Button id="all-rounds" text="See All Rounds" size="sm" onPress={() => setShowRounds((value) => !value)} />
      </div>

      {showRounds ? <p>rounds!</p> : null}

      {/* if showRounds then render a table showing the rounds (player as column with rounds as rows)
      https://nextui.org/docs/components/table */}
    </div>
  )
}

export { Finished }
