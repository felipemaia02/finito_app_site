import { Box, Card, CardContent, Skeleton } from '@mui/material'

export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={20} />
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="25%" height={16} />
          </Box>
          <Skeleton variant="text" width={80} height={24} />
        </Box>
      ))}
    </Box>
  )
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 3 }} />
}
