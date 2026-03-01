interface ProgressBarProps {
  value: number
}

export function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100))
  return (
    <div className="h-2 w-full rounded-full bg-[var(--surface-3)]">
      <div className="h-2 rounded-full bg-[var(--accent)] transition-all" style={{ width: `${clamped}%` }} />
    </div>
  )
}
