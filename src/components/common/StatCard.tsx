import { Box, Card, CardContent, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  icon: SvgIconComponent
  color?: string
  trend?: { value: string; positive: boolean }
}

export function StatCard({ title, value, subtitle, icon: Icon, color = '#6366f1', trend }: StatCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: color + '1a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color, fontSize: 26 }} />
          </Box>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: trend.positive ? 'success.main' : 'error.main',
                bgcolor: (trend.positive ? '#10b981' : '#ef4444') + '1a',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              {trend.positive ? '+' : ''}{trend.value}
            </Typography>
          )}
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.1, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
