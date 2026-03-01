import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  subtitle: string
  icon: LucideIcon
}

export function EmptyState({ title, subtitle, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <Icon className="mb-3 text-[var(--text-muted)]" size={28} />
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
    </div>
  )
}
