import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { CategorySummary } from '@/types/expenses'
import { getCategoryLabel } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'
import { CATEGORY_COLORS } from '@/constants/categories'

interface CategoryChartProps {
  data: CategorySummary[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const theme = useTheme()

  const chartData = data.slice(0, 8).map((item) => ({
    name: getCategoryLabel(item.category),
    value: item.total_cents,
    category: item.category,
    percentage: item.percentage,
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Despesas por Categoria
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Distribuição do total gasto
        </Typography>

        {chartData.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260 }}>
            <Typography color="text.disabled">Nenhum dado disponível</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Total']}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: theme.palette.text.secondary, fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
