import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import type { ExpenseResponse } from '@/types/expenses'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/dates'
import { getCategoryEmoji, getExpenseTypeLabel } from '@/utils/labels'
import { CATEGORY_COLORS } from '@/constants/categories'
import { buildExpenseDetailPath } from '@/constants/routes'

interface RecentExpensesProps {
  expenses: ExpenseResponse[]
  maxItems?: number
}

export function RecentExpenses({ expenses, maxItems = 5 }: RecentExpensesProps) {
  const navigate = useNavigate()
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Despesas Recentes
          </Typography>
          <Tooltip title="Ver todas">
            <IconButton size="small" onClick={() => navigate('/expenses')}>
              <ArrowForward fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {recent.length === 0 ? (
          <Typography color="text.secondary" variant="body2" textAlign="center" py={4}>
            Nenhuma despesa encontrada
          </Typography>
        ) : (
          <List disablePadding>
            {recent.map((expense, idx) => (
              <ListItem
                key={expense.id}
                disablePadding
                divider={idx < recent.length - 1}
                sx={{
                  py: 1.25,
                  cursor: 'pointer',
                  borderRadius: 2,
                  px: 1,
                  '&:hover': { bgcolor: 'action.hover' },
                  transition: 'background 0.15s',
                }}
                onClick={() => navigate(buildExpenseDetailPath(expense.id))}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: CATEGORY_COLORS[expense.category] + '22',
                      color: CATEGORY_COLORS[expense.category],
                      fontWeight: 700,
                      fontSize: '1.2rem',
                    }}
                  >
                    {getCategoryEmoji(expense.category)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {expense.note || getExpenseTypeLabel(expense.type_expense)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {expense.spent_by} · {formatDate(expense.date)}
                    </Typography>
                  }
                />
                <Typography variant="body2" fontWeight={700} color="error.main" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                  -{formatCurrency(expense.amount_cents)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

interface CategoryRankingProps {
  items: Array<{ category: string; label: string; total_cents: number; percentage: number; color: string }>
}

export function CategoryRanking({ items }: CategoryRankingProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Ranking de Categorias
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.slice(0, 6).map((item, idx) => (
            <Box key={item.category}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" fontWeight={500}>
                  {idx + 1}. {item.label}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.percentage}%
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(item.total_cents)}
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: item.color + '22',
                  '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 3 },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
