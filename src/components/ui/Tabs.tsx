import { cn } from '../../utils/cn'

interface TabsProps {
  tabs: string[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-2xl px-3 py-1.5 text-sm transition-colors',
            value === tab
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
              : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
