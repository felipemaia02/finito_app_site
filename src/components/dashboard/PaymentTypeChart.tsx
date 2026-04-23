import { Box, Card, CardContent, Typography, useTheme, LinearProgress, alpha } from '@mui/material'
import type { PaymentTypeSummary } from '@/types/expenses'
import { getExpenseTypeLabel, getExpenseTypeIcon } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'
import { EXPENSE_TYPE_COLORS } from '@/constants/expenseTypes'

interface PaymentTypeChartProps {
  data: PaymentTypeSummary[]
}

export function PaymentTypeChart({ data }: PaymentTypeChartProps) {
  const theme = useTheme()

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Formas de Pagamento
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Distribuição por método
        </Typography>

        {data.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <Typography color="text.disabled">Nenhum dado disponível</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.map((item) => {
              const color = EXPENSE_TYPE_COLORS[item.type_expense]
              return (
                <Box key={item.type_expense}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: alpha(color, 0.15),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                        }}
                      >
                        {getExpenseTypeIcon(item.type_expense)}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {getExpenseTypeLabel(item.type_expense)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.count} transação(ões)
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(item.total_cents)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(color, 0.12),
                      '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 },
                    }}
                  />
                </Box>
              )
            })}
          </Box>
        )}

        {/* Legend colors */}
        <Box sx={{ display: 'none' }}>
          {theme.palette.mode}
        </Box>
      </CardContent>
    </Card>
  )
}
