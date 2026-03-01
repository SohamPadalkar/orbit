import type { HabitItem, OrbitBackup, RenewalItem, SubscriptionItem } from '../types'
import { calculateStreak, isWithinNextDays, monthKey } from './date'

export function getSubscriptionTotals(subscriptions: SubscriptionItem[]) {
  const active = subscriptions.filter((item) => item.isActive)
  const monthly = active.reduce((sum, item) => sum + item.monthlyPrice, 0)
  const yearly = active.reduce((sum, item) => sum + item.yearlyTotal, 0)
  return { monthly, yearly }
}

export function getMonthlySpending(expenses: OrbitBackup['expenses']) {
  const currentMonth = monthKey(new Date().toISOString())
  return expenses
    .filter((item) => monthKey(item.date) === currentMonth)
    .reduce((sum, item) => sum + item.amount, 0)
}

export function getUpcomingRenewals(renewals: RenewalItem[], subscriptions: SubscriptionItem[]) {
  const manualRenewals = renewals.filter((item) => isWithinNextDays(item.dueDate, 7))
  const subscriptionRenewals = subscriptions
    .filter((item) => item.isActive && isWithinNextDays(item.nextRenewalDate, 7))
    .map((item) => ({
      id: `sub-${item.id}`,
      title: `${item.name} Renewal`,
      type: item.category,
      dueDate: item.nextRenewalDate,
    }))

  return [...manualRenewals, ...subscriptionRenewals].sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )
}

export function getHabitSummary(habits: HabitItem[]) {
  const best = habits.reduce((max, item) => Math.max(max, calculateStreak(item.completedDates)), 0)
  const average = habits.length
    ? Math.round(habits.reduce((sum, item) => sum + calculateStreak(item.completedDates), 0) / habits.length)
    : 0

  return { best, average }
}
