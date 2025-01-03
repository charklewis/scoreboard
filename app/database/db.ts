import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'
import { environment } from '~/services/environment'

const sql = neon(environment.DATABASE_URL)
const db = drizzle(sql, { schema })

export { db }
