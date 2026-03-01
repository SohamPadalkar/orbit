import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface Datum {
  name: string
  value: number
}

const colors = ['#8B7D6B', '#A39482', '#C8B6A6', '#4A4453', '#6D6875']

export function CategoryPieChart({ data }: { data: Datum[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
