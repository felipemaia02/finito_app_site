import { Box, Card, CardContent, Typography, alpha } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface SummaryCardProps {
  title: string
  value: string
  subtitle?: string
  icon: SvgIconComponent
  color?: string
  trend?: { value: number; label: string }
}

export function SummaryCard({ title, value, subtitle, icon: Icon, color = '#6366f1', trend }: SummaryCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: alpha(color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Box>
          {trend && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 2,
                bgcolor: trend.value >= 0 ? alpha('#10b981', 0.1) : alpha('#ef4444', 0.1),
              }}
            >
              <Typography
                variant="caption"
                fontWeight={600}
                color={trend.value >= 0 ? 'success.main' : 'error.main'}
              >
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
