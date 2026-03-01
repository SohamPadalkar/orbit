import { useMemo, useState } from 'react'
import { Tv } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Toggle } from '../components/ui/Toggle'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useOrbitStore } from '../store/useOrbitStore'
import { getSubscriptionTotals } from '../utils/analytics'
import { readableDate } from '../utils/date'
import { CategoryPieChart } from '../components/charts/CategoryPieChart'
import { useToast } from '../components/ui/ToastProvider'

export function SubscriptionsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const subscriptions = useOrbitStore((state) => state.subscriptions)
  const updateSubscription = useOrbitStore((state) => state.updateSubscription)
  const deleteSubscription = useOrbitStore((state) => state.deleteSubscription)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const filtered = useMemo(
    () => subscriptions.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())),
    [subscriptions, searchQuery],
  )

  const totals = useMemo(() => getSubscriptionTotals(filtered), [filtered])

  const pieData = useMemo(() => {
    const map = new Map<string, number>()
    filtered.filter((item) => item.isActive).forEach((item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.monthlyPrice)
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filtered])

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteSubscription(deleteId)
    setDeleteId(null)
    notify('Subscription deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Subscriptions</h2>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Total monthly</p>
          <p className="mt-1 text-2xl font-semibold">₹{totals.monthly.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Total yearly</p>
          <p className="mt-1 text-2xl font-semibold">₹{totals.yearly.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--text-muted)]">Active services</p>
          <p className="mt-1 text-2xl font-semibold">{filtered.filter((item) => item.isActive).length}</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-2 font-semibold">Category distribution</h3>
        {pieData.length ? <CategoryPieChart data={pieData} /> : <p className="text-sm text-[var(--text-muted)]">No active data</p>}
      </Card>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[var(--text-muted)]">
                  {item.category} · ₹{item.monthlyPrice} · renews {readableDate(item.nextRenewalDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Toggle
                  checked={item.isActive}
                  onChange={(checked) => updateSubscription(item.id, { isActive: checked })}
                />
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No subscriptions" subtitle="Tap + and add your first service" icon={Tv} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This subscription will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
