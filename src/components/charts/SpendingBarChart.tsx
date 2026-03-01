import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface Datum {
  name: string
  amount: number
}

export function SpendingBarChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)' }} />
          <YAxis tick={{ fill: 'var(--text-muted)' }} />
          <Tooltip />
          <Bar dataKey="amount" fill="var(--accent)" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
