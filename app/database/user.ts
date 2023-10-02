import { eq } from 'drizzle-orm'
import { db } from './db'
import { users as schema } from './schema'

async function createUser(stytchId: string) {
  const user = await db.query.users.findFirst({ where: eq(schema.stytchId, stytchId) })
  if (user) {
    return true
  }

  const newUser = await db.insert(schema).values({ stytchId })
  if (newUser.rowsAffected === 1) {
    return true
  }
  return false
}

export { createUser }
