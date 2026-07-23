import { eq } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db'
import { drinkDefault, user } from '#/db/schema'
import { auth } from '#/lib/auth'
import { companies, drinks, periods, type Company, type Drink, type DrinkChoice } from '#/lib/drinks'

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

function isCompany(value: unknown): value is Company {
  return typeof value === 'string' && companies.includes(value as Company)
}

function isDrink(value: unknown): value is Drink {
  return typeof value === 'string' && drinks.includes(value as Drink)
}

function defaultsFromRows(rows: Array<{ period: 'morning' | 'evening'; drink: Drink }>): DrinkChoice {
  const defaults: DrinkChoice = { morning: 'No drink', evening: 'No drink' }
  for (const row of rows) defaults[row.period] = row.drink
  return defaults
}

function isMygateEmail(email: string) {
  const normalized = email.toLowerCase()
  return normalized.endsWith('@mygate.in') || normalized.endsWith('@mygate.com')
}

async function getCurrentUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user ?? null
}

async function readProfile(currentUser: { id: string; email: string }) {
  const [userRow, defaultRows] = await Promise.all([
    db.select({ company: user.company }).from(user).where(eq(user.id, currentUser.id)).limit(1),
    db.select({ period: drinkDefault.period, drink: drinkDefault.drink }).from(drinkDefault).where(eq(drinkDefault.userId, currentUser.id)),
  ])
  const autoCompany = isMygateEmail(currentUser.email) ? 'Mygate' : null
  const storedCompany = (userRow[0]?.company as Company | null) ?? null
  const company = autoCompany ?? (storedCompany === 'Mygate' ? null : storedCompany)
  if (autoCompany && userRow[0]?.company !== autoCompany) {
    await db.update(user).set({ company: autoCompany, updatedAt: new Date() }).where(eq(user.id, currentUser.id))
  }
  return { company, requiresCompany: !autoCompany && !company, needsOnboarding: !company || defaultRows.length < periods.length, defaults: defaultsFromRows(defaultRows) }
}

export const Route = createFileRoute('/api/profile')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const currentUser = await getCurrentUser(request)
        if (!currentUser) return json({ error: 'Unauthorized' }, { status: 401 })
        return json(await readProfile(currentUser))
      },
      PUT: async ({ request }) => {
        const currentUser = await getCurrentUser(request)
        if (!currentUser) return json({ error: 'Unauthorized' }, { status: 401 })
        const body = await request.json() as { company?: unknown; defaults?: Partial<Record<'morning' | 'evening', unknown>> }
        const profile = await readProfile(currentUser)
        const company = isMygateEmail(currentUser.email) ? 'Mygate' : body.company
        if (!isCompany(company) || (profile.requiresCompany && !body.company)) return json({ error: 'Choose a company' }, { status: 400 })
        if (company === 'Mygate' && !isMygateEmail(currentUser.email)) return json({ error: 'Use your Mygate work email to join Mygate.' }, { status: 403 })
        const defaults = body.defaults
        if (!defaults || !isDrink(defaults.morning) || !isDrink(defaults.evening)) return json({ error: 'Choose both default drinks' }, { status: 400 })
        const validatedDefaults: DrinkChoice = { morning: defaults.morning, evening: defaults.evening }

        await db.transaction(async (tx) => {
          await tx.update(user).set({ company, updatedAt: new Date() }).where(eq(user.id, currentUser.id))
          for (const period of periods) {
            await tx.insert(drinkDefault).values({ userId: currentUser.id, period, drink: validatedDefaults[period] }).onConflictDoUpdate({ target: [drinkDefault.userId, drinkDefault.period], set: { drink: validatedDefaults[period], updatedAt: new Date() } })
          }
        })
        return json(await readProfile(currentUser))
      },
    },
  },
})
