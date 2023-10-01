import { type InferSelectModel } from 'drizzle-orm'
import { serial, mysqlTable, text, timestamp } from 'drizzle-orm/mysql-core'

const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  stytchId: text('stytch_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

type User = InferSelectModel<typeof users>
// export type NewUser = InferInsertModel<typeof users>

export { users, type User }
