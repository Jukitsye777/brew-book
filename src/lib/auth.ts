import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { drizzleAdapter } from '@better-auth/drizzle-adapter'

import { db } from '#/db'
import * as schema from '#/db/schema'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  socialProviders: googleClientId && googleClientSecret ? { google: { clientId: googleClientId, clientSecret: googleClientSecret, prompt: 'select_account' } } : undefined,
  plugins: [tanstackStartCookies()],
})
