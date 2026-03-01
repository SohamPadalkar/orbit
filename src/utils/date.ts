export function toIsoDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate)
  date.setDate(date.getDate() + days)
  return toIsoDate(date)
}

export function daysUntil(isoDate: string) {
  const now = new Date()
  const target = new Date(isoDate)
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function isWithinNextDays(isoDate: string, days: number) {
  const diff = daysUntil(isoDate)
  return diff >= 0 && diff <= days
}

export function monthKey(isoDate: string) {
  const date = new Date(isoDate)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function readableDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculateStreak(completedDates: string[]) {
  const uniqueDates = [...new Set(completedDates)].sort()
  let streak = 0
  const cursor = new Date()

  while (true) {
    const value = toIsoDate(cursor)
    if (!uniqueDates.includes(value)) {
      break
    }
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}
