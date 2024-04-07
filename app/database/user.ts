import { eq } from 'drizzle-orm'

import { db } from './db'
import { user as schema } from './schema'

async function createUser(stytchId: string) {
  const user = await db.query.user.findFirst({ where: eq(schema.stytchId, stytchId) })
  if (user) {
    return true
  }

  const newUser = await db.insert(schema).values({ stytchId }).returning()
  if (newUser.length === 1) {
    return true
  }
  return false
}

export { createUser }
