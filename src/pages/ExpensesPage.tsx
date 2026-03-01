import { useMemo, useState } from 'react'
import { ReceiptIndianRupee } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { SpendingBarChart } from '../components/charts/SpendingBarChart'
import { useOrbitStore } from '../store/useOrbitStore'
import { getMonthlySpending } from '../utils/analytics'
import { readableDate } from '../utils/date'
import { useToast } from '../components/ui/ToastProvider'

export function ExpensesPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const expenses = useOrbitStore((state) => state.expenses)
  const deleteExpense = useOrbitStore((state) => state.deleteExpense)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const filtered = useMemo(
    () =>
      expenses.filter(
        (item) =>
          item.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (item.note ?? '').toLowerCase().includes(searchQuery.toLowerCase().trim()),
      ),
    [expenses, searchQuery],
  )

  const monthlyTotal = useMemo(() => getMonthlySpending(filtered), [filtered])

  const chartData = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach((item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + item.amount)
    })
    return Array.from(map.entries()).map(([name, amount]) => ({ name, amount }))
  }, [filtered])

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteExpense(deleteId)
    setDeleteId(null)
    notify('Expense deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Expenses</h2>

      <Card>
        <p className="text-sm text-[var(--text-muted)]">Monthly total</p>
        <p className="mt-1 text-2xl font-semibold">₹{monthlyTotal.toLocaleString()}</p>
      </Card>

      <Card>
        <h3 className="mb-2 font-semibold">Spend by category</h3>
        {chartData.length ? <SpendingBarChart data={chartData} /> : <p className="text-sm text-[var(--text-muted)]">No data yet</p>}
      </Card>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{item.category}</p>
                <p className="text-sm text-[var(--text-muted)]">
                  {readableDate(item.date)} {item.note ? `· ${item.note}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">₹{item.amount}</p>
                <Button variant="ghost" onClick={() => setDeleteId(item.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No expenses" subtitle="Quick-add your first expense" icon={ReceiptIndianRupee} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This expense will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
