import { type InferSelectModel, relations } from 'drizzle-orm'
import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'

const user = pgTable('user', {
  id: serial('id').primaryKey(),
  stytchId: text('stytch_id').unique().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

const game = pgTable('game', {
  id: serial('id').primaryKey(),
  scoreKeeper: integer('score_keeper')
    .notNull()
    .references(() => user.id),
  dateCreated: timestamp('date_created').notNull().defaultNow(),
  dateFinished: timestamp('date_finished'),
  gameType: text('game_type').notNull(),
})

const player = pgTable('player', {
  id: serial('id').primaryKey(),
  playerName: text('player_name').notNull(),
  emoji: text('emoji'),
  backgroundColor: text('background_color'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => user.id),
})

const round = pgTable('round', {
  id: serial('id').primaryKey(),
  gameId: integer('game_id')
    .notNull()
    .references(() => game.id),
  roundNumber: integer('round_number').notNull(),
  roundCompleted: boolean('round_completed').default(false),
})

const roundPlayer = pgTable(
  'round_player',
  {
    roundId: integer('roundId').references(() => round.id),
    playerId: integer('player_id')
      .notNull()
      .references(() => player.id),
    score: integer('score').notNull().default(0),
  },
  (table) => {
    return { id: primaryKey({ columns: [table.roundId, table.playerId] }) }
  }
)

const userRelations = relations(user, ({ many }) => ({ players: many(player), games: many(game) }))

const gameRelations = relations(game, ({ one, many }) => ({
  rounds: many(round),
  scoreKeeper: one(user, { fields: [game.scoreKeeper], references: [user.id] }),
}))

const playerRelations = relations(player, ({ one }) => ({
  createdBy: one(user, { fields: [player.createdBy], references: [user.id] }),
}))

const roundRelations = relations(round, ({ one, many }) => ({
  game: one(game, { fields: [round.gameId], references: [game.id] }),
  players: many(roundPlayer),
}))

const roundPlayerRelations = relations(roundPlayer, ({ one }) => ({
  round: one(round, { fields: [roundPlayer.roundId], references: [round.id] }),
  player: one(player, { fields: [roundPlayer.playerId], references: [player.id] }),
}))

type User = InferSelectModel<typeof user>

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
