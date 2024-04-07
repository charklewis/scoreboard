import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { environment } from '~/services/environment.server'
import * as schema from './schema'

const sql = neon(environment.DATABASE_URL)
const db = drizzle(sql, { schema })

export { db }
