import { and, eq } from 'drizzle-orm'

import { db } from '~/database/db'
import { game, player, round, roundPlayer, user } from '~/database/schema'
import { type color, type emoji, getColor, getEmoji } from '~/database/static'
import { decode, encode } from '~/services/public-ids.server'

type GameStatus = 'new' | 'in-progress' | 'finished' | 'error'
type GameType = 'scrabble'

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
      columns: { dateFinished: true, gameType: true },
      with: {
        rounds: {
          columns: { roundNumber: true, roundCompleted: true, id: true },
          with: {
            players: {
              columns: { score: true },
              with: { player: { columns: { id: true, emoji: true, backgroundColor: true, playerName: true } } },
            },
          },
        },
      },
    })

    const gameStatus = gameDetails?.dateFinished ? 'finished' : gameDetails?.rounds.length ? 'in-progress' : 'new'

    const totalScores = gameDetails?.rounds.reduce(
      (acc, round) => {
        round.players.forEach(({ player, score }) => {
          acc[player.id] = (acc[player.id] || 0) + score
        })
        return acc
      },
      {} as Record<string, number>
    )

    return {
      players: players.map((player) => ({
        id: encode(player.id),
        name: player.playerName,
        background: getColor(player.backgroundColor).bgColor,
        emoji: getEmoji(player.emoji),
      })),
      gameStatus: gameStatus as GameStatus,
      gameType: gameDetails?.gameType as GameType,
      rounds:
        gameDetails?.rounds.map((round) => ({
          id: encode(round.id),
          roundNumber: round.roundNumber,
          roundCompleted: round.roundCompleted || false,
          players: round.players.map(({ player, score }) => ({
            id: encode(player.id),
            name: player.playerName,
            background: getColor(player.backgroundColor).bgColor,
            emoji: getEmoji(player.emoji),
            score,
            totalScore: totalScores ? totalScores[player.id] : 0,
          })),
        })) || [],
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
  //https://orm.drizzle.team/docs/get-started-postgresql#neon
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

async function saveRound(
  players: {
    roundId: string
    playerId: string
    score: number
  }[]
) {
  for (const player of players) {
    const roundId = Number(decode(player.roundId))
    const playerId = Number(decode(player.playerId))
    await db
      .update(roundPlayer)
      .set({ score: player.score })
      .where(and(eq(roundPlayer.roundId, roundId), eq(roundPlayer.playerId, playerId)))
  }
}

async function addRound(roundId: string) {
  //https://orm.drizzle.team/docs/get-started-postgresql#neon
  //<transaction>
  const currentRound = await db.query.round.findFirst({
    where: eq(round.id, Number(decode(roundId))),
    columns: { id: true, roundNumber: true, gameId: true },
    with: { players: { columns: { playerId: true } } },
  })

  if (!currentRound) {
    throw new Error('Could not add round, please try again later')
  }

  await db.update(round).set({ roundCompleted: true }).where(eq(round.id, currentRound.id))

  const roundNumber = currentRound.roundNumber + 1

  const [nextRound] = await db
    .insert(round)
    .values({ gameId: currentRound.gameId, roundNumber, roundCompleted: false })
    .returning({ id: round.id })

  if (!nextRound) {
    throw new Error('Could not add round, please try again later')
  }

  const players = currentRound.players.map(({ playerId }) => ({ roundId: nextRound.id, playerId, score: 0 }))

  await db.insert(roundPlayer).values(players)
  //</transaction>
}

async function finishGame(roundId: string) {
  //https://orm.drizzle.team/docs/get-started-postgresql#neon
  //<transaction>
  const currentRound = await db.query.round.findFirst({
    where: eq(round.id, Number(decode(roundId))),
    columns: { id: true, gameId: true },
  })

  if (!currentRound) {
    throw new Error('Could not save game, please try again later')
  }

  await db.update(round).set({ roundCompleted: true }).where(eq(round.id, currentRound.id))
  await db.update(game).set({ dateFinished: new Date() }).where(eq(game.id, currentRound.gameId))
  //</transaction>
}

type Player = {
  id: string
  name: string
  background: keyof typeof color
  emoji: keyof typeof emoji
}

export {
  fetchScoreboardAndPlayers,
  insertPlayer,
  startGame,
  saveRound,
  addRound,
  finishGame,
  type Player,
  type GameStatus,
}
