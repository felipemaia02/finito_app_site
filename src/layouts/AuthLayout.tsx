import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        p: 2,
      }}
    >
      <Outlet />
    </Box>
  )
}
