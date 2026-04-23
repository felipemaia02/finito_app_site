import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material'
import { Delete, Edit, Visibility } from '@mui/icons-material'
import type { ExpenseResponse } from '@/types/expenses'
import { getCategoryEmoji, getCategoryLabel, getExpenseTypeLabel } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/dates'
import { CATEGORY_COLORS } from '@/constants/categories'
import { buildExpenseDetailPath, buildExpenseEditPath } from '@/constants/routes'

interface ExpenseTableProps {
  expenses: ExpenseResponse[]
  onDelete?: (expense: ExpenseResponse) => void
  compact?: boolean
}

export function ExpenseTable({ expenses, onDelete, compact = false }: ExpenseTableProps) {
  const navigate = useNavigate()

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size={compact ? 'small' : 'medium'}>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
            <TableCell>Categoria</TableCell>
            <TableCell>Descrição / Pessoa</TableCell>
            {!compact && <TableCell>Pagamento</TableCell>}
            <TableCell>Data</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => {
            const color = CATEGORY_COLORS[expense.category]
            return (
              <TableRow
                key={expense.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  '& td': { borderColor: 'divider' },
                }}
                onClick={() => navigate(buildExpenseDetailPath(expense.id))}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        bgcolor: alpha(color, 0.15),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {getCategoryEmoji(expense.category)}
                    </Box>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {getCategoryLabel(expense.category)}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {expense.spent_by}
                  </Typography>
                  {expense.note && (
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {expense.note}
                    </Typography>
                  )}
                </TableCell>

                {!compact && (
                  <TableCell>
                    <Chip
                      label={getExpenseTypeLabel(expense.type_expense)}
                      size="small"
                      sx={{ borderRadius: 1.5, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  </TableCell>
                )}

                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(expense.date)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="body2" fontWeight={700} sx={{ fontVariantNumeric: 'tabular-nums', color: 'error.main' }}>
                    {formatCurrency(expense.amount_cents)}
                  </Typography>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                    <Tooltip title="Ver detalhes">
                      <IconButton size="small" onClick={() => navigate(buildExpenseDetailPath(expense.id))}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => navigate(buildExpenseEditPath(expense.id))}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {onDelete && (
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={() => onDelete(expense)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}

interface RecentExpensesCardProps {
  expenses: ExpenseResponse[]
  onDelete?: (expense: ExpenseResponse) => void
}

export function RecentExpensesCard({ expenses, onDelete }: RecentExpensesCardProps) {
  const navigate = useNavigate()
  return (
    <Card>
      <CardContent sx={{ p: 3, pb: '12px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Despesas Recentes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Últimas transações do grupo
            </Typography>
          </Box>
          <Chip
            label="Ver todas"
            size="small"
            clickable
            color="primary"
            variant="outlined"
            onClick={() => navigate('/expenses')}
          />
        </Box>
        {expenses.length === 0 ? (
          <Typography color="text.disabled" textAlign="center" py={4}>
            Nenhuma despesa registrada
          </Typography>
        ) : (
          <ExpenseTable expenses={expenses.slice(0, 8)} onDelete={onDelete} compact />
        )}
      </CardContent>
    </Card>
  )
}
