import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 p-5 shadow-[var(--shadow-soft)] backdrop-blur',
        className,
      )}
      {...props}
    />
  )
}
