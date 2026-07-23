import { eq } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db'
import { drinkDefault, drinkResponse, user } from '#/db/schema'
import { auth } from '#/lib/auth'
import { drinks, periods, type Drink, type DrinkChoice, type Period, type PollSource } from '#/lib/drinks'

const indiaDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })
const todayKey = () => indiaDateFormatter.format(new Date())

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

function isPeriod(value: unknown): value is Period {
  return typeof value === 'string' && periods.includes(value as Period)
}

function isDrink(value: unknown): value is Drink {
  return typeof value === 'string' && drinks.includes(value as Drink)
}

function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

async function getSessionUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user ?? null
}

function defaultsFromRows(rows: Array<{ period: Period; drink: Drink }>): DrinkChoice {
  const defaults: DrinkChoice = { morning: 'No drink', evening: 'No drink' }
  for (const row of rows) defaults[row.period] = row.drink
  return defaults
}

async function readDay(userId: string, date: string) {
  const [defaultRows, responseRows] = await Promise.all([
    db.select({ period: drinkDefault.period, drink: drinkDefault.drink }).from(drinkDefault).where(eq(drinkDefault.userId, userId)),
    db.select({
      userId: drinkResponse.userId,
      name: user.name,
      email: user.email,
      image: user.image,
      period: drinkResponse.period,
      drink: drinkResponse.drink,
      source: drinkResponse.source,
    }).from(drinkResponse).innerJoin(user, eq(user.id, drinkResponse.userId)).where(eq(drinkResponse.date, date)),
  ])

  const grouped = new Map<string, { user: { id: string; name: string; email: string; image: string | null }; choices: Partial<DrinkChoice>; sources: Partial<Record<Period, PollSource>> }>()
  for (const row of responseRows) {
    const existing = grouped.get(row.userId) ?? { user: { id: row.userId, name: row.name, email: row.email, image: row.image }, choices: {}, sources: {} }
    existing.choices[row.period] = row.drink
    existing.sources[row.period] = row.source
    grouped.set(row.userId, existing)
  }

  return { defaults: defaultsFromRows(defaultRows), responses: [...grouped.values()].map((entry) => ({
    user: entry.user,
    choices: { morning: entry.choices.morning ?? 'No drink', evening: entry.choices.evening ?? 'No drink' },
    sources: { morning: entry.sources.morning ?? 'default', evening: entry.sources.evening ?? 'default' },
  })) }
}

async function ensureTodayResponse(userId: string, date: string, defaults: DrinkChoice) {
  if (date !== todayKey()) return
  await db.insert(drinkResponse).values(periods.map((period) => ({
    id: crypto.randomUUID(), userId, date, period, drink: defaults[period], source: 'default' as const,
  }))).onConflictDoNothing({ target: [drinkResponse.userId, drinkResponse.date, drinkResponse.period] })
}

export const Route = createFileRoute('/api/drinks')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const currentUser = await getSessionUser(request)
        if (!currentUser) return json({ error: 'Unauthorized' }, { status: 401 })
        const requestedDate = new URL(request.url).searchParams.get('date')
        if (!isDate(requestedDate)) return json({ error: 'A valid date is required' }, { status: 400 })
        const beforeEnsure = await readDay(currentUser.id, requestedDate)
        await ensureTodayResponse(currentUser.id, requestedDate, beforeEnsure.defaults)
        const day = requestedDate === todayKey() ? await readDay(currentUser.id, requestedDate) : beforeEnsure
        return json({ date: requestedDate, ...day })
      },
      PUT: async ({ request }) => {
        const currentUser = await getSessionUser(request)
        if (!currentUser) return json({ error: 'Unauthorized' }, { status: 401 })
        const body = await request.json() as { type?: unknown; date?: unknown; period?: unknown; drink?: unknown }
        if (body.type === 'default') {
          if (!isPeriod(body.period) || !isDrink(body.drink)) return json({ error: 'Invalid default' }, { status: 400 })
          await db.insert(drinkDefault).values({ userId: currentUser.id, period: body.period, drink: body.drink }).onConflictDoUpdate({ target: [drinkDefault.userId, drinkDefault.period], set: { drink: body.drink, updatedAt: new Date() } })
          const rows = await db.select({ period: drinkDefault.period, drink: drinkDefault.drink }).from(drinkDefault).where(eq(drinkDefault.userId, currentUser.id))
          return json(defaultsFromRows(rows))
        }
        if (body.type === 'response') {
          if (!isDate(body.date) || !isPeriod(body.period) || !isDrink(body.drink)) return json({ error: 'Invalid response' }, { status: 400 })
          const defaults = await readDay(currentUser.id, body.date)
          await db.insert(drinkResponse).values({ id: crypto.randomUUID(), userId: currentUser.id, date: body.date, period: body.period, drink: body.drink, source: 'manual' }).onConflictDoUpdate({ target: [drinkResponse.userId, drinkResponse.date, drinkResponse.period], set: { drink: body.drink, source: 'manual', updatedAt: new Date() } })
          const day = await readDay(currentUser.id, body.date)
          return json({ date: body.date, ...day, defaults: defaults.defaults })
        }
        return json({ error: 'Unknown update type' }, { status: 400 })
      },
    },
  },
})
