import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { config } from '@dotenvx/dotenvx'
import * as Sentry from '@sentry/node'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local'

config({
  path: [path.join(rootDir, envFile)],
  ignore: ['MISSING_ENV_FILE'],
})

const dsn = process.env.SENTRY_DSN ?? process.env.VITE_SENTRY_DSN
const environment = process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV

if (dsn && !globalThis.__brewbookSentryServerInitialized) {
  globalThis.__brewbookSentryServerInitialized = true
  Sentry.init({
    dsn,
    environment,
    enabled: Boolean(dsn),
    sendDefaultPii: false,
  })
}
