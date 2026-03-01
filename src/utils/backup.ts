import type { OrbitBackup } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isArrayField<T>(value: unknown): value is T[] {
  return Array.isArray(value)
}

export function parseOrbitBackup(raw: string): OrbitBackup | null {
  try {
    const parsed: unknown = JSON.parse(raw)

    if (!isRecord(parsed)) {
      return null
    }

    const personalCare = isArrayField(parsed.personalCare) ? parsed.personalCare : []
    const subscriptions = isArrayField(parsed.subscriptions) ? parsed.subscriptions : []
    const expenses = isArrayField(parsed.expenses) ? parsed.expenses : []
    const goals = isArrayField(parsed.goals) ? parsed.goals : []
    const habits = isArrayField(parsed.habits) ? parsed.habits : []
    const wishlist = isArrayField(parsed.wishlist) ? parsed.wishlist : []
    const renewals = isArrayField(parsed.renewals) ? parsed.renewals : []

    return {
      personalCare,
      subscriptions,
      expenses,
      goals,
      habits,
      wishlist,
      renewals,
    } as OrbitBackup
  } catch {
    return null
  }
}
