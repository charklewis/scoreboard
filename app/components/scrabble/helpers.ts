import { type RoundType } from './round'

interface Player {
  score: number
  id: string
  name: string
  background: string
  emoji: string
}

function calculatePlayerScores(rounds: RoundType[]) {
  function calculatePlayerScore(acc: Record<string, Player>, player: Player) {
    return {
      ...acc,
      [player.id]: {
        score: (acc[player.id]?.score || 0) + player.score,
        id: player.id,
        name: player.name,
        background: player.background,
        emoji: player.emoji,
      },
    }
  }

  function calculateRoundScores(acc: Record<string, Player>, round: RoundType) {
    return round.players.reduce(calculatePlayerScore, acc)
  }

  const scores = rounds.flat().reduce(calculateRoundScores, {} as Record<string, Player>)
  return Object.values(scores).sort((a, b) => b.score - a.score)
}

export { calculatePlayerScores }
