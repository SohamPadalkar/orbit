import { useMemo, useState } from 'react'
import { Target } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useOrbitStore } from '../store/useOrbitStore'
import { daysUntil, readableDate } from '../utils/date'
import { useToast } from '../components/ui/ToastProvider'

export function GoalsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const goals = useOrbitStore((state) => state.goals)
  const deleteGoal = useOrbitStore((state) => state.deleteGoal)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const filtered = useMemo(
    () => goals.filter((goal) => goal.title.toLowerCase().includes(searchQuery.toLowerCase().trim())),
    [goals, searchQuery],
  )

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteGoal(deleteId)
    setDeleteId(null)
    notify('Goal deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Goals</h2>

      {filtered.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((goal) => {
            const progress = Math.round((goal.currentValue / goal.targetValue) * 100)
            const left = daysUntil(goal.deadline)
            return (
              <Card key={goal.id}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="font-semibold">{goal.title}</p>
                  <Badge>{Math.max(0, progress)}%</Badge>
                </div>
                <ProgressBar value={progress} />
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {goal.currentValue}/{goal.targetValue} {goal.unit}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Deadline: {readableDate(goal.deadline)}</p>
                <p className="text-sm text-[var(--text-muted)]">{left >= 0 ? `${left} days left` : 'Overdue'}</p>
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" onClick={() => setDeleteId(goal.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No goals yet" subtitle="Set your first goal with +" icon={Target} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This goal will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
