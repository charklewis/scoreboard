import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' })
    console.log('\x1b[32m%s\x1b[0m', 'Migration successful')
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Migration failed')
    console.error(error)
    process.exit(1)
  }
}

main()
