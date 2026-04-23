import { Box, Card, CardContent, Chip, Typography, alpha } from '@mui/material'
import type { CategorySummary } from '@/types/expenses'
import { getCategoryEmoji, getCategoryLabel } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'
import { CATEGORY_COLORS } from '@/constants/categories'

interface CategoryRankingProps {
  data: CategorySummary[]
}

export function CategoryRanking({ data }: CategoryRankingProps) {
  const top = data.slice(0, 6)

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Ranking de Categorias
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Maiores gastos por categoria
        </Typography>

        {top.length === 0 ? (
          <Typography color="text.disabled" textAlign="center" py={4}>
            Nenhum dado disponível
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {top.map((item, idx) => {
              const color = CATEGORY_COLORS[item.category]
              return (
                <Box
                  key={item.category}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: alpha(color, 0.06),
                    border: `1px solid ${alpha(color, 0.15)}`,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: alpha(color, 0.1) },
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: alpha(color, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </Typography>
                  <Typography sx={{ fontSize: '1.2rem', flexShrink: 0 }}>
                    {getCategoryEmoji(item.category)}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {getCategoryLabel(item.category)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.count} despesa(s)
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formatCurrency(item.total_cents)}
                    </Typography>
                    <Chip
                      label={`${item.percentage}%`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: alpha(color, 0.15),
                        color,
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
