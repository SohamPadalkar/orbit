import { useMemo, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useOrbitStore } from '../store/useOrbitStore'
import { readableDate } from '../utils/date'
import type { CareCategory } from '../types'
import { useToast } from '../components/ui/ToastProvider'

const categories: CareCategory[] = ['skincare', 'haircare', 'hygiene', 'health', 'other']

export function PersonalCarePage() {
  const [category, setCategory] = useState<string>('all')
  const [sortByRefill, setSortByRefill] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const searchQuery = useOrbitStore((state) => state.searchQuery)
  const items = useOrbitStore((state) => state.personalCare)
  const deletePersonalCare = useOrbitStore((state) => state.deletePersonalCare)
  const undoDelete = useOrbitStore((state) => state.undoDelete)

  const { notify } = useToast()

  const filtered = useMemo(() => {
    const byCategory = items.filter((item) => (category === 'all' ? true : item.category === category))
    const bySearch = byCategory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    )

    if (!sortByRefill) {
      return bySearch
    }

    return [...bySearch].sort(
      (a, b) => new Date(a.refillDate).getTime() - new Date(b.refillDate).getTime(),
    )
  }, [items, category, searchQuery, sortByRefill])

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deletePersonalCare(deleteId)
    setDeleteId(null)
    notify('Care item deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Personal Care</h2>
        <Button variant="secondary" onClick={() => setSortByRefill((value) => !value)}>
          Sort: {sortByRefill ? 'Refill date' : 'Created'}
        </Button>
      </div>

      <Tabs tabs={['all', ...categories]} value={category} onChange={setCategory} />

      {filtered.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{item.category}</p>
                </div>
                <Badge className={item.stockLevel <= 30 ? 'bg-rose-100 text-rose-700' : ''}>
                  {item.stockLevel}%
                </Badge>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Refill: {readableDate(item.refillDate)}</p>
              <p className="text-sm text-[var(--text-muted)]">Purchase: {readableDate(item.purchaseDate)}</p>
              {item.notes ? <p className="mt-2 text-sm">{item.notes}</p> : null}
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No care items yet"
          subtitle="Press + to add your first personal care item."
          icon={PackageOpen}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This personal care item will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
