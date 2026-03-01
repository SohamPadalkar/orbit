import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { HabitHeatmap } from '../components/charts/HabitHeatmap'
import { useOrbitStore } from '../store/useOrbitStore'
import { calculateStreak } from '../utils/date'
import { useToast } from '../components/ui/ToastProvider'

export function HabitsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const habits = useOrbitStore((state) => state.habits)
  const toggleHabitDay = useOrbitStore((state) => state.toggleHabitDay)
  const deleteHabit = useOrbitStore((state) => state.deleteHabit)
  const undoDelete = useOrbitStore((state) => state.undoDelete)
  const searchQuery = useOrbitStore((state) => state.searchQuery)

  const { notify } = useToast()

  const filtered = useMemo(
    () => habits.filter((habit) => habit.title.toLowerCase().includes(searchQuery.toLowerCase().trim())),
    [habits, searchQuery],
  )

  const handleDelete = () => {
    if (!deleteId) {
      return
    }
    deleteHabit(deleteId)
    setDeleteId(null)
    notify('Habit deleted', 'Undo', () => undoDelete())
  }

  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <h2 className="text-xl font-semibold">Habits</h2>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((habit) => {
            const streak = calculateStreak(habit.completedDates)
            const today = new Date().toISOString().slice(0, 10)
            const doneToday = habit.completedDates.includes(today)

            return (
              <Card key={habit.id}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{habit.title}</p>
                    <p className="text-sm text-[var(--text-muted)]">Weekly heatmap + streak</p>
                  </div>
                  <Badge>{streak}d streak</Badge>
                </div>

                <HabitHeatmap completedDates={habit.completedDates} />

                <div className="mt-3 flex justify-between">
                  <Button variant={doneToday ? 'secondary' : 'primary'} onClick={() => toggleHabitDay(habit.id)}>
                    {doneToday ? 'Marked today' : 'Mark complete'}
                  </Button>
                  <Button variant="ghost" onClick={() => setDeleteId(habit.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState title="No habits" subtitle="Create your first habit from +" icon={Sparkles} />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        description="This habit will be removed."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
