import { Box, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'

interface EmptyStateProps {
  icon?: SvgIconComponent
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        gap: 2,
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 36, color: 'text.disabled' }} />
        </Box>
      )}
      <Typography variant="h6" fontWeight={600} color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" maxWidth={320}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  )
}
