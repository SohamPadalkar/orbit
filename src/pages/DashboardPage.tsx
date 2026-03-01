import { useMemo } from 'react'
import { CalendarClock, Layers, Wallet } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useOrbitStore } from '../store/useOrbitStore'
import { getHabitSummary, getMonthlySpending, getSubscriptionTotals, getUpcomingRenewals } from '../utils/analytics'
import { daysUntil } from '../utils/date'

export function DashboardPage() {
  const personalCare = useOrbitStore((state) => state.personalCare)
  const subscriptions = useOrbitStore((state) => state.subscriptions)
  const expenses = useOrbitStore((state) => state.expenses)
  const habits = useOrbitStore((state) => state.habits)
  const renewals = useOrbitStore((state) => state.renewals)

  const { monthly, yearly } = useMemo(() => getSubscriptionTotals(subscriptions), [subscriptions])
  const monthlySpending = useMemo(() => getMonthlySpending(expenses), [expenses])
  const upcomingRenewals = useMemo(
    () => getUpcomingRenewals(renewals, subscriptions).slice(0, 5),
    [renewals, subscriptions],
  )
  const lowStock = useMemo(() => personalCare.filter((item) => item.stockLevel <= 30), [personalCare])
  const habitSummary = useMemo(() => getHabitSummary(habits), [habits])

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Subscription total</p>
          <p className="mt-2 text-2xl font-semibold">₹{monthly.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-muted)]">₹{yearly.toLocaleString()} yearly</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Monthly spending</p>
          <p className="mt-2 text-2xl font-semibold">₹{monthlySpending.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-muted)]">Simple overview for this month</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Low stock items</p>
          <p className="mt-2 text-2xl font-semibold">{lowStock.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Items at or below 30%</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Habit streak</p>
          <p className="mt-2 text-2xl font-semibold">{habitSummary.best} days</p>
          <p className="text-xs text-[var(--text-muted)]">Avg {habitSummary.average} days</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock size={16} />
            <h2 className="font-semibold">Upcoming renewals (7 days)</h2>
          </div>
          <div className="space-y-2">
            {upcomingRenewals.length ? (
              upcomingRenewals.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-2)] px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{item.type}</p>
                  </div>
                  <Badge>{daysUntil(item.dueDate)}d</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No upcoming renewals this week.</p>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Layers size={16} />
            <h2 className="font-semibold">Low stock personal care</h2>
          </div>
          <div className="space-y-2">
            {lowStock.length ? (
              lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-2)] px-3 py-2">
                  <p className="text-sm font-medium">{item.name}</p>
                  <Badge>{item.stockLevel}%</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-muted)]">All items are well stocked.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Wallet size={16} />
          <h2 className="font-semibold">Quick analytics</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)]">
          You are currently tracking {personalCare.length} care items, {subscriptions.length} subscriptions,{' '}
          {expenses.length} expenses, and {habits.length} habits.
        </p>
      </Card>
    </div>
  )
}
