import { Typography } from '@mui/material'
import { formatCurrency } from '@/utils/currency'

interface MoneyDisplayProps {
  cents: number
  variant?: 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2'
  color?: string
  fontWeight?: number | string
}

export function MoneyDisplay({ cents, variant = 'body1', color, fontWeight }: MoneyDisplayProps) {
  return (
    <Typography variant={variant} color={color} fontWeight={fontWeight} sx={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatCurrency(cents)}
    </Typography>
  )
}
