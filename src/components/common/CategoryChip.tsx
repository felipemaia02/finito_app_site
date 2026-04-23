import { Chip } from '@mui/material'
import type { ExpenseCategory } from '@/types/expenses'
import { getCategoryEmoji, getCategoryLabel } from '@/utils/labels'
import { CATEGORY_COLORS } from '@/constants/categories'

interface CategoryChipProps {
  category: ExpenseCategory
  size?: 'small' | 'medium'
}

export function CategoryChip({ category, size = 'small' }: CategoryChipProps) {
  return (
    <Chip
      label={`${getCategoryEmoji(category)} ${getCategoryLabel(category)}`}
      size={size}
      sx={{
        bgcolor: CATEGORY_COLORS[category] + '22',
        color: CATEGORY_COLORS[category],
        fontWeight: 600,
        border: `1px solid ${CATEGORY_COLORS[category]}44`,
      }}
    />
  )
}
