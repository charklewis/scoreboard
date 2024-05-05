import { Finished } from './finished'
import { InProgress } from './in-progress'
import { InProgressContext } from './in-progress-context'
import { type RoundType } from './round'

function Scrabble({ rounds, isFinished }: { rounds: RoundType[]; isFinished: boolean }) {
  if (isFinished) {
    return <Finished rounds={rounds} />
  }
  return (
    <InProgressContext>
      <InProgress rounds={rounds} />
    </InProgressContext>
  )
}

export { Scrabble }
