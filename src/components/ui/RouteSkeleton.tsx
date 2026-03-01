export function RouteSkeleton() {
  return (
    <div className="space-y-4 pb-24 md:pb-4">
      <div className="h-8 w-48 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-[var(--surface-2)]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-3xl bg-[var(--surface-2)]" />
        <div className="h-56 animate-pulse rounded-3xl bg-[var(--surface-2)]" />
      </div>
    </div>
  )
}
