import { addDays, toIsoDate } from '../../utils/date'

interface HabitHeatmapProps {
  completedDates: string[]
}

export function HabitHeatmap({ completedDates }: HabitHeatmapProps) {
  const today = new Date()
  const days = Array.from({ length: 28 }).map((_, index) => {
    const day = addDays(toIsoDate(today), -(27 - index))
    const completed = completedDates.includes(day)
    return { day, completed }
  })

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((entry) => (
        <div
          key={entry.day}
          className={`h-6 rounded-md ${entry.completed ? 'bg-[var(--accent)]' : 'bg-[var(--surface-3)]'}`}
          title={entry.day}
        />
      ))}
    </div>
  )
}
