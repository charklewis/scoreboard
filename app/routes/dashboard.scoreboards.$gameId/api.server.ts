import { eq } from 'drizzle-orm'
import { db } from '~/database/db'
import { player, user } from '~/database/schema'
import { encode } from '~/services/public-ids.server'

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
      background: player.backgroundColor,
      emoji: player.emoji,
    }))
  } catch {
    return []
  }
}

type Player = Awaited<ReturnType<typeof fetchPlayers>>[0]
export { fetchPlayers, type Player }
