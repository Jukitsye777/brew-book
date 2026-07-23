export const drinks = ['Tea', 'Coffee', 'Green tea', 'Milk', 'Black Coffee', 'Black Tea', 'No drink'] as const
export const periods = ['morning', 'evening'] as const
export const companies = ['Mygate'] as const

export type Drink = (typeof drinks)[number]
export type Period = (typeof periods)[number]
export type Company = (typeof companies)[number]
export type PollSource = 'default' | 'manual'
export type DrinkChoice = Record<Period, Drink>
export type User = { id?: string; name: string; email: string; image?: string | null }
export type PollRecord = {
  user: User
  choices: DrinkChoice
  sources: Record<Period, PollSource>
}
export type DrinkDay = {
  date: string
  defaults: DrinkChoice
  responses: PollRecord[]
}
export type Profile = {
  company: Company | null
  requiresCompany: boolean
  needsOnboarding: boolean
  defaults: DrinkChoice
}

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null
    throw new Error(body?.error || `Request failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getDrinkDay(date: string) {
  return request<DrinkDay>(`/api/drinks?date=${encodeURIComponent(date)}`)
}

export function saveResponse(input: { date: string; period: Period; drink: Drink }) {
  return request<DrinkDay>('/api/drinks', {
    method: 'PUT',
    body: JSON.stringify({ type: 'response', ...input }),
  })
}

export function saveDefault(input: { period: Period; drink: Drink }) {
  return request<DrinkChoice>('/api/drinks', {
    method: 'PUT',
    body: JSON.stringify({ type: 'default', ...input }),
  })
}

export function getProfile() {
  return request<Profile>('/api/profile')
}

export function completeOnboarding(input: { company: Company; defaults: DrinkChoice }) {
  return request<Profile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
