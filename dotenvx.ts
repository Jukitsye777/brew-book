import { config } from '@dotenvx/dotenvx'
import path from 'node:path'

const rootDir = process.cwd()

export function loadDotenvx() {
  const paths = process.env.NODE_ENV === 'production' ? ['.env.production'] : ['.env.local']
  config({
    path: paths.map((envPath) => path.join(rootDir, envPath)),
    ignore: ['MISSING_ENV_FILE'],
  })
}
