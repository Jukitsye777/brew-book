import path from 'node:path'

import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import { getPostgresConnectionConfig } from '../src/db/connection.ts'
import { loadDotenvx } from '../dotenvx'

loadDotenvx()

const pool = new Pool(getPostgresConnectionConfig())

async function runMigrations() {
  try {
    console.log('Connecting to Postgres and running migrations...')
    const db = drizzle(pool)
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') })
    console.log('Migrations completed successfully.')
  } finally {
    await pool.end()
  }
}

runMigrations().catch((error) => {
  console.error('Migration failed.')
  console.error(error)
  process.exitCode = 1
})
