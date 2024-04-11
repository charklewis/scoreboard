import { desc, eq } from 'drizzle-orm'

import { db } from '~/database/db'
import { game, user } from '~/database/schema'
import { getColor, getEmoji } from '~/database/static'
import { encode } from '~/services/public-ids.server'

async function fetchScoreboards(stytchId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { id: true },
    })
    const userId = scoreKeeper?.id
    if (!userId) return []
    const games = await db.query.game.findMany({
      columns: { id: true, gameType: true, dateCreated: true, dateFinished: true },
      orderBy: [desc(game.dateCreated)],
      with: {
        rounds: {
          columns: {},
          with: {
            players: {
              columns: {},
              with: { player: { columns: { id: true, playerName: true, backgroundColor: true, emoji: true } } },
            },
          },
        },
      },
      where: eq(game.scoreKeeper, userId),
    })

    return games.map((game) => {
      const gameStatus = game?.dateFinished ? 'finished' : game?.rounds.length ? 'in-progress' : 'new'
      const players = game.rounds
        .map((round) =>
          round.players.map(({ player }) => ({
            id: encode(player.id),
            name: player.playerName,
            background: getColor(player.backgroundColor).bgColor,
            emoji: getEmoji(player.emoji),
          }))
        )
        .flat()

      const uniquePlayers = players.filter((player, index, self) => index === self.findIndex((p) => p.id === player.id))

      return {
        id: encode(game.id),
        title: game.gameType,
        createdAt: game.dateCreated,
        players: uniquePlayers,
        gameStatus,
      }
    })
  } catch {
    return []
  }
}

async function insertGame(type: 'scrabble', stytchId: string) {
  try {
    const scoreKeeper = await db.query.user.findFirst({
      where: eq(user.stytchId, stytchId),
      columns: { id: true },
    })
    const userId = scoreKeeper?.id
    if (!userId) return
    const returning = await db
      .insert(game)
      .values({ scoreKeeper: userId, dateCreated: new Date(), gameType: type })
      .returning()
    const gameId = returning?.[0]?.id
    if (gameId) {
      return encode(Number(gameId))
    }
  } catch {}
}

export { fetchScoreboards, insertGame }
