import { and, eq } from 'drizzle-orm'
import { db } from './db'
import { player } from './schema'
import { getColor, getEmoji } from './static'
import { getUserId } from './user'
import { encode } from '~/services/public-ids'

async function fetchPlayers(stytchId: string) {
  const userId = await getUserId(stytchId)
  if (!userId) return
  const response = await db.query.player.findMany({
    where: eq(player.createdBy, userId),
    columns: { id: true, playerName: true, backgroundColor: true, emoji: true },
  })
  return response.map((player) => ({
    id: encode(player.id),
    name: player.playerName,
    background: getColor(player.backgroundColor).bgColor,
    emoji: getEmoji(player.emoji),
  }))
}

async function fetchPlayer(stytchId: string, playerId: number) {
  const userId = await getUserId(stytchId)
  if (!userId) return
  const response = await db.query.player.findFirst({
    where: and(eq(player.createdBy, userId), eq(player.id, playerId)),
    columns: { id: true, playerName: true, backgroundColor: true, emoji: true },
  })
  if (!response) return
  return {
    name: response.playerName,
    background: getColor(response.backgroundColor).bgColor,
    emoji: getEmoji(response.emoji),
  }
}

async function insertPlayer(stytchId: string, { name, color, emoji }: { name: string; color: string; emoji: string }) {
  const userId = await getUserId(stytchId)
  if (!userId) return
  const response = await db
    .insert(player)
    .values({ playerName: name, backgroundColor: color, emoji, createdBy: userId })
    .returning({ insertedId: player.id })
  return response[0]?.insertedId
}

async function removePlayer(stytchId: string, playerId: number) {
  const userId = await getUserId(stytchId)
  if (!userId) return
  const response = await db.delete(player).where(and(eq(player.createdBy, userId), eq(player.id, playerId)))
  return response.rowCount === 1
}

export { insertPlayer, fetchPlayer, fetchPlayers, removePlayer }
