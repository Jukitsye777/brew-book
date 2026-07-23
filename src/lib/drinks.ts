export const drinks = ['Tea', 'Coffee', 'Green tea', 'Milk', 'No drink'] as const
export const periods = ['morning', 'evening'] as const

export type Drink = (typeof drinks)[number]
export type Period = (typeof periods)[number]
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

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    throw new Error((await response.text()) || `Request failed with status ${response.status}`)
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
