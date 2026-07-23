import { defineConfig } from 'drizzle-kit'
import { loadDotenvx } from './dotenvx'

loadDotenvx()

const databaseUrl = process.env.DATABASE_URL
const databaseCaCert = process.env.DATABASE_CA_CERT

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Drizzle Kit')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
    ssl: databaseCaCert ? { ca: databaseCaCert, rejectUnauthorized: true } : true,
  },
})
