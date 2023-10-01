import { db } from './db'
import { users as schema } from './schema'

async function getOrCreateUser(stytchId: string) {
  const user = await db.query.users.findFirst({ with: { stytchId } })
  if (user) {
    return user.stytchId
  }
  return db.insert(schema).values({ stytchId })
}

export { getOrCreateUser }
