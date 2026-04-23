import { Chip } from '@mui/material'
import type { ExpenseType } from '@/types/expenses'
import { getExpenseTypeIcon, getExpenseTypeLabel } from '@/utils/labels'
import { EXPENSE_TYPE_COLORS } from '@/constants/expenseTypes'

interface PaymentChipProps {
  type: ExpenseType
  size?: 'small' | 'medium'
}

export function PaymentChip({ type, size = 'small' }: PaymentChipProps) {
  return (
    <Chip
      label={`${getExpenseTypeIcon(type)} ${getExpenseTypeLabel(type)}`}
      size={size}
      sx={{
        bgcolor: EXPENSE_TYPE_COLORS[type] + '22',
        color: EXPENSE_TYPE_COLORS[type],
        fontWeight: 600,
        border: `1px solid ${EXPENSE_TYPE_COLORS[type]}44`,
      }}
    />
  )
}
