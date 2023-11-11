import { relations, type InferSelectModel } from 'drizzle-orm'
import {
  serial,
  mysqlTable,
  text,
  timestamp,
  datetime,
  int,
  boolean,
  primaryKey,
  varchar,
} from 'drizzle-orm/mysql-core'

const user = mysqlTable('users', {
  userId: serial('id').primaryKey(),
  stytchId: varchar('stytch_id', { length: 200 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

const game = mysqlTable('game', {
  gameId: serial('game_id').primaryKey(),
  scoreKeeper: int('score_keeper').notNull(),
  dateCreated: datetime('date_created').notNull(),
  dateFinished: datetime('date_finished'),
  gameType: varchar('game_type', { length: 250 }).notNull(),
})

const player = mysqlTable('player', {
  playerId: serial('player_id').primaryKey(),
  playerName: text('player_name').notNull(),
  emoji: varchar('emoji', { length: 120 }),
  backgroundColor: varchar('background_color', { length: 120 }),
  createdBy: int('created_by').notNull(),
})

const round = mysqlTable('round', {
  roundId: serial('round_id').primaryKey(),
  gameId: int('game_id').notNull(),
  roundNumber: int('round_number').notNull(),
  roundCompleted: boolean('round_completed').default(false),
})

const roundPlayer = mysqlTable(
  'round_player',
  {
    roundId: int('round_id').notNull(),
    playerId: int('player_id').notNull(),
    score: int('score').notNull().default(0),
  },
  (table) => ({ roundPlayerId: primaryKey(table.roundId, table.playerId) })
)

const userRelations = relations(user, ({ many }) => ({ createdPlayers: many(player) }))

const gameRelations = relations(game, ({ one, many }) => ({
  rounds: many(round),
  scoreKeeper: one(user, {
    fields: [game.scoreKeeper],
    references: [user.userId],
  }),
}))

const playerRelations = relations(player, ({ one }) => ({
  createdBy: one(user, {
    fields: [player.createdBy],
    references: [user.userId],
  }),
}))

const roundRelations = relations(round, ({ one, many }) => ({
  game: one(game, {
    fields: [round.gameId],
    references: [game.gameId],
  }),
  roundPlayers: many(roundPlayer),
}))

const roundPlayerRelations = relations(roundPlayer, ({ one }) => ({
  round: one(round, {
    fields: [roundPlayer.roundId],
    references: [round.roundId],
  }),
  player: one(player, {
    fields: [roundPlayer.playerId],
    references: [player.playerId],
  }),
}))

type User = InferSelectModel<typeof user>
// type InsertUser = InferInsertModel<typeof user>
// type Game = InferSelectModel<typeof game>
// type InsertGame = InferInsertModel<typeof user>
// type Player = InferSelectModel<typeof player>
// type RoundPlayer = InferSelectModel<typeof roundPlayer>

export {
  user,
  game,
  player,
  round,
  roundPlayer,
  userRelations,
  gameRelations,
  playerRelations,
  roundRelations,
  roundPlayerRelations,
  type User,
}
