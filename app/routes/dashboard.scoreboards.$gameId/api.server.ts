import { eq, sql } from 'drizzle-orm'
import { db } from '~/database/db'
import { color, emoji } from '~/database/static'
import { player, user, round, roundPlayer } from '~/database/schema'
import { decode, encode } from '~/services/public-ids.server'

async function fetchPlayers(stytchId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { userId: true },
    })
    const userId = scoreKeeper?.userId
    if (!userId) return []
    const players = await db.query.player.findMany({
      columns: { playerId: true, playerName: true, backgroundColor: true, emoji: true },
      where: eq(player.createdBy, userId),
    })

    return players.map((player) => ({
      id: encode(player.playerId),
      name: player.playerName,
      background: color[player.backgroundColor as keyof typeof color].bgColor,
      emoji: emoji[player.emoji as keyof typeof emoji],
    }))
  } catch {
    return []
  }
}

async function insertPlayer(stytchId: string, { name, color, emoji }: { name: string; color: string; emoji: string }) {
  const scoreKeeper = await db.query.user.findFirst({
    where: eq(user.stytchId, stytchId),
    columns: { userId: true },
  })
  const userId = scoreKeeper?.userId
  if (!userId) return
  await db.insert(player).values({ playerName: name, backgroundColor: color, emoji, createdBy: userId })
}

async function startGame(stytchId: string, { gameId, players }: { gameId: string; players: string[] }) {
  const scoreKeeper = await db.query.user.findFirst({
    where: eq(user.stytchId, stytchId),
    columns: { userId: true },
  })
  const userId = scoreKeeper?.userId
  if (!userId) return
  await db.transaction(async (tx) => {
    await tx.insert(round).values({ gameId: decode(gameId), roundNumber: 1 })
    const query = await db.execute(sql`SELECT LAST_INSERT_ID() AS roundId`)
    const roundId = (query.rows?.[0] as { roundId: number }).roundId
    if (!roundId) {
      await tx.rollback()
    } else {
      const roundPlayers = players.map((player) => ({ roundId, playerId: decode(player) }))
      await tx.insert(roundPlayer).values(roundPlayers)
    }
  })
}

type Player = {
  id: string
  name: string
  background: keyof typeof color
  emoji: keyof typeof emoji
}

export { fetchPlayers, insertPlayer, startGame, type Player }
