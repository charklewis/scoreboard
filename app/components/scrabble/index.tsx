import { Finished } from './finished'
import { InProgress } from './in-progress'
import { type RoundType } from './round'

function Scrabble({ rounds, isFinished }: { rounds: RoundType[]; isFinished: boolean }) {
  if (isFinished) {
    return <Finished rounds={rounds} />
  }
  return <InProgress rounds={rounds} />
}

export { Scrabble }
