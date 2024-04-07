import { eq } from 'drizzle-orm'

import { db } from '~/database/db'
import { game, player, round, roundPlayer, user } from '~/database/schema'
import { color, emoji } from '~/database/static'
import { decode, encode } from '~/services/public-ids.server'

type GameStatus = 'new' | 'in-progress' | 'finished' | 'error'

async function fetchScoreboardAndPlayers(stytchId: string, gameId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { id: true },
    })
    const userId = scoreKeeper?.id
    if (!userId) return { players: [], gameStatus: 'error' as GameStatus }

    const players = await db.query.player.findMany({
      columns: { id: true, playerName: true, backgroundColor: true, emoji: true },
      where: eq(player.createdBy, userId),
    })

    const gameDetails = await db.query.game.findFirst({
      where: eq(game.id, decode(gameId)),
      columns: { dateFinished: true },
      with: { rounds: { columns: { id: true }, limit: 1 } },
    })

    const gameStatus = gameDetails?.dateFinished ? 'finished' : gameDetails?.rounds.length ? 'in-progress' : 'new'

    return {
      players: players.map((player) => ({
        id: encode(player.id),
        name: player.playerName,
        background: color[player.backgroundColor as keyof typeof color].bgColor,
        emoji: emoji[player.emoji as keyof typeof emoji],
      })),
      gameStatus: gameStatus as GameStatus,
    }
  } catch {
    return { players: [], gameStatus: 'error' as GameStatus }
  }
}

async function insertPlayer(stytchId: string, { name, color, emoji }: { name: string; color: string; emoji: string }) {
  const scoreKeeper = await db.query.user.findFirst({
    where: eq(user.stytchId, stytchId),
    columns: { id: true },
  })
  const userId = scoreKeeper?.id
  if (!userId) return
  await db.insert(player).values({ playerName: name, backgroundColor: color, emoji, createdBy: userId })
}

async function startGame(stytchId: string, { gameId, players }: { gameId: string; players: string[] }) {
  const scoreKeeper = await db.query.user.findFirst({
    where: eq(user.stytchId, stytchId),
    columns: { id: true },
  })
  const userId = scoreKeeper?.id
  if (!userId) return
  //todo: convert this into transaction (note this requires pool or connection)
  //https://community.neon.tech/t/how-do-i-handle-transactions/1067/2
  //<transaction>
  const insert = await db
    .insert(round)
    .values({ gameId: decode(gameId), roundNumber: 1 })
    .returning()
  const roundId = insert?.[0]?.id
  if (!roundId) {
    //todo: rollback transaction
  } else {
    const roundPlayers = players.map((player) => ({ roundId, playerId: Number(decode(player)) }))
    await db.insert(roundPlayer).values(roundPlayers)
  }
  //</transaction>
}

type Player = {
  id: string
  name: string
  background: keyof typeof color
  emoji: keyof typeof emoji
}

export { fetchScoreboardAndPlayers, insertPlayer, startGame, type Player, type GameStatus }
