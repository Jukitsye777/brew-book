import { eq, sql } from 'drizzle-orm'
import { createFileRoute } from '@tanstack/react-router'

import { db } from '#/db'
import { company, companyAdmin, drinkDefault, drinkResponse, user } from '#/db/schema'
import { auth } from '#/lib/auth'
import { drinks, periods, type Company, type Drink, type DrinkChoice, type SugarChoice } from '#/lib/drinks'

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

const indiaDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' })
const todayKey = () => indiaDateFormatter.format(new Date())

function isCompany(value: unknown): value is Company {
  return typeof value === 'string' && value.trim().length > 0
}

function isDrink(value: unknown): value is Drink {
  return typeof value === 'string' && drinks.includes(value as Drink)
}

function defaultsFromRows(rows: Array<{ period: 'morning' | 'evening'; drink: Drink; sugar: boolean }>): { defaults: DrinkChoice; sugarDefaults: SugarChoice } {
  const defaults: DrinkChoice = { morning: 'No drink', evening: 'No drink' }
  const sugarDefaults: SugarChoice = { morning: true, evening: true }
  for (const row of rows) { defaults[row.period] = row.drink; sugarDefaults[row.period] = row.sugar }
  return { defaults, sugarDefaults }
}

async function getCurrentUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  return session?.user ?? null
}

async function readProfile(currentUser: { id: string; email: string }) {
  const [userRow, defaultRows, companyRows, adminRows] = await Promise.all([
    db.select({ companyId: user.companyId, legacyCompany: user.company, role: user.role }).from(user).where(eq(user.id, currentUser.id)).limit(1),
    db.select({ period: drinkDefault.period, drink: drinkDefault.drink, sugar: drinkDefault.sugar }).from(drinkDefault).where(eq(drinkDefault.userId, currentUser.id)),
    db.select({ id: company.id, name: company.name, emailEnding1: company.emailEnding1, emailEnding2: company.emailEnding2 }).from(company),
    db.select({ email: companyAdmin.email }).from(companyAdmin).where(sql`lower(${companyAdmin.email}) = lower(${currentUser.email})`),
  ])
  const matchedCompany = companyRows.find((item) => [item.emailEnding1, item.emailEnding2].some((ending) => ending && currentUser.email.toLowerCase().endsWith(ending.toLowerCase())))
  const companyName = matchedCompany?.name ?? null
  const accessDenied = !matchedCompany
  const isAdmin = userRow[0]?.role === 'admin' || adminRows.length > 0
  if (matchedCompany && (userRow[0]?.companyId !== matchedCompany.id || userRow[0]?.legacyCompany !== matchedCompany.name)) {
    await db.update(user).set({ company: matchedCompany.name, companyId: matchedCompany.id, updatedAt: new Date() }).where(eq(user.id, currentUser.id))
  }
  return { company: companyName, requiresCompany: false, accessDenied, needsOnboarding: !accessDenied && defaultRows.length < periods.length, role: isAdmin ? 'admin' as const : 'user' as const, ...defaultsFromRows(defaultRows) }
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
        const body = await request.json() as { company?: unknown; defaults?: Partial<Record<'morning' | 'evening', unknown>>; sugarDefaults?: Partial<Record<'morning' | 'evening', unknown>> }
        const profile = await readProfile(currentUser)
        const companyName = profile.company
        if (!isCompany(companyName) || profile.accessDenied) return json({ error: 'Your work email is not registered with a BrewBook company.' }, { status: 403 })
        const defaults = body.defaults
        if (!defaults || !isDrink(defaults.morning) || !isDrink(defaults.evening)) return json({ error: 'Choose both default drinks' }, { status: 400 })
        const validatedDefaults: DrinkChoice = { morning: defaults.morning, evening: defaults.evening }
        const sugarDefaults = body.sugarDefaults
        if (!sugarDefaults || typeof sugarDefaults.morning !== 'boolean' || typeof sugarDefaults.evening !== 'boolean') return json({ error: 'Choose sugar preferences' }, { status: 400 })
        const validatedSugarDefaults: SugarChoice = { morning: validatedDefaults.morning === 'No drink' ? true : sugarDefaults.morning, evening: validatedDefaults.evening === 'No drink' ? true : sugarDefaults.evening }

        await db.transaction(async (tx) => {
          await tx.update(user).set({ company: companyName, updatedAt: new Date() }).where(eq(user.id, currentUser.id))
          for (const period of periods) {
            await tx.insert(drinkDefault).values({ userId: currentUser.id, period, drink: validatedDefaults[period], sugar: validatedSugarDefaults[period] }).onConflictDoUpdate({ target: [drinkDefault.userId, drinkDefault.period], set: { drink: validatedDefaults[period], sugar: validatedSugarDefaults[period], updatedAt: new Date() } })
            await tx.insert(drinkResponse).values({ id: crypto.randomUUID(), userId: currentUser.id, date: todayKey(), period, drink: validatedDefaults[period], sugar: validatedSugarDefaults[period], source: 'default' }).onConflictDoUpdate({ target: [drinkResponse.userId, drinkResponse.date, drinkResponse.period], set: { drink: validatedDefaults[period], sugar: validatedSugarDefaults[period], source: 'default', updatedAt: new Date() }, where: eq(drinkResponse.source, 'default') })
          }
        })
        return json(await readProfile(currentUser))
      },
    },
  },
})
