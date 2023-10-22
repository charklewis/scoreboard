import { eq, sql } from 'drizzle-orm'
import { db } from '~/database/db'
import { game, user } from '~/database/schema'
import { encode } from '~/services/public-ids.server'

async function fetchScoreboards(stytchId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { userId: true },
    })
    const userId = scoreKeeper?.userId
    if (!userId) return []
    const games = await db.query.game.findMany({
      columns: { gameId: true, gameType: true, dateCreated: true },
      with: {
        rounds: {
          columns: {},
          with: {
            roundPlayers: {
              columns: {},
              with: {
                player: {
                  columns: {
                    playerId: true,
                    playerName: true,
                    backgroundColor: true,
                    emoji: true,
                  },
                },
              },
            },
          },
        },
      },
      where: eq(game.scoreKeeper, userId),
    })

    return games.map((game) => ({
      id: encode(game.gameId),
      title: game.gameType,
      createdAt: game.dateCreated,
      players: game.rounds
        .map((round) =>
          round.roundPlayers.map((roundPlayer) => ({
            id: encode(roundPlayer.player.playerId),
            name: roundPlayer.player.playerName,
            background: roundPlayer.player.backgroundColor,
            emoji: roundPlayer.player.emoji,
          }))
        )
        .flat(),
    }))
  } catch {
    return []
  }
}

async function insertGame(type: 'scrabble', stytchId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { userId: true },
    })
    const userId = scoreKeeper?.userId
    if (!userId) return
    await db.insert(game).values({ scoreKeeper: userId, dateCreated: new Date(), gameType: type })
    const query = await db.execute(sql`SELECT LAST_INSERT_ID() AS gameId`)
    const gameId = (query.rows?.[0] as { gameId: string }).gameId
    if (gameId) {
      return encode(Number(gameId))
    }
  } catch {}
}

export { fetchScoreboards, insertGame }
