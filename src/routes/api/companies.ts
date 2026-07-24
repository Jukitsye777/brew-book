import { asc } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db'
import { company } from '#/db/schema'

export const Route = createFileRoute('/api/companies')({
  server: {
    handlers: {
      GET: async () => db.select({ id: company.id, name: company.name, emailEnding1: company.emailEnding1, emailEnding2: company.emailEnding2 }).from(company).orderBy(asc(company.name)).then((rows) => Response.json(rows)),
    },
  },
})
