import { Box, Skeleton, Grid } from '@mui/material'

export function CardSkeleton() {
  return (
    <Box sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
      <Skeleton variant="text" width="60%" height={20} />
      <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="30%" height={16} sx={{ mt: 1 }} />
    </Box>
  )
}

export function SummaryCardsSkeleton() {
  return (
    <Grid container spacing={2}>
      {[0, 1, 2, 3].map((i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <CardSkeleton />
        </Grid>
      ))}
    </Grid>
  )
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return <Skeleton variant="rounded" width="100%" height={height} sx={{ borderRadius: 4 }} />
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Box>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, py: 1.5, px: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton variant="text" width="40%" height={18} />
            <Skeleton variant="text" width="25%" height={14} />
          </Box>
          <Skeleton variant="text" width={80} height={18} />
        </Box>
      ))}
    </Box>
  )
}
