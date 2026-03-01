import { useMemo, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useOrbitStore } from '../store/useOrbitStore'
import { daysUntil, readableDate } from '../utils/date'
import { useToast } from '../components/ui/ToastProvider'

export function RenewalsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const renewals = useOrbitStore((state) => state.renewals)
  const subscriptions = useOrbitStore((state) => state.subscriptions)
  const deleteRenewal = useOrbitStore((state) => state.deleteRenewal)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const merged = useMemo(() => {
    const manual = renewals.map((item) => ({ ...item, source: 'manual' as const }))
    const fromSubscriptions = subscriptions
      .filter((item) => item.isActive)
      .map((item) => ({
        id: `sub-${item.id}`,
        title: `${item.name} Renewal`,
        type: item.category,
        dueDate: item.nextRenewalDate,
        notes: 'From subscription manager',
        source: 'subscription' as const,
      }))

    return [...manual, ...fromSubscriptions]
      .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }, [renewals, subscriptions, searchQuery])

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteRenewal(deleteId)
    setDeleteId(null)
    notify('Renewal removed', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Important Renewals</h2>

      {merged.length ? (
        <div className="space-y-3">
          {merged.map((item) => {
            const dueDays = daysUntil(item.dueDate)
            const urgent = dueDays <= 7
            return (
              <Card key={item.id} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-[var(--text-muted)]">{item.type} · {readableDate(item.dueDate)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={urgent ? 'bg-amber-100 text-amber-700' : ''}>{dueDays}d</Badge>
                  {item.source === 'manual' ? (
                    <Button variant="ghost" onClick={() => setDeleteId(item.id)}>
                      Delete
                    </Button>
                  ) : null}
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No renewals" subtitle="Use + to add an important reminder" icon={CalendarDays} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This renewal entry will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
