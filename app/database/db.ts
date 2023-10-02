import { connect } from '@planetscale/database'
//note this is needed for vercel, otherwise all queries error with
//First parameter has member 'readable' that is not a ReadableStream
import fetch from 'cross-fetch'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { environment } from '~/services/environment.server'
import * as schema from './schema'

const connection = connect({ url: environment.DATABASE_URL, fetch })

const db = drizzle(connection, { schema })

export { db }
