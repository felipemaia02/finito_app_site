import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, Typography, useTheme } from '@mui/material'
import type { CategorySummary, PaymentTypeSummary } from '@/types/expenses'
import { CATEGORY_COLORS } from '@/constants/categories'
import { EXPENSE_TYPE_COLORS } from '@/constants/expenseTypes'
import { getCategoryLabel, getExpenseTypeLabel } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'

interface CategoryPieChartProps {
  data: CategorySummary[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const theme = useTheme()
  const chartData = data.slice(0, 8).map((d) => ({
    name: getCategoryLabel(d.category),
    value: d.total_cents,
    color: CATEGORY_COLORS[d.category],
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Despesas por Categoria
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Total']}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: theme.palette.text.secondary, fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface PaymentTypeBarChartProps {
  data: PaymentTypeSummary[]
}

export function PaymentTypeBarChart({ data }: PaymentTypeBarChartProps) {
  const theme = useTheme()
  const chartData = data.map((d) => ({
    name: getExpenseTypeLabel(d.type_expense),
    total: d.total_cents / 100,
    color: EXPENSE_TYPE_COLORS[d.type_expense],
    count: d.count,
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Por Forma de Pagamento
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="name"
              tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `R$${v}`}
              tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Total']}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
