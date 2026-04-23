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
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Orb 1 — top right */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: { xs: 320, md: 540 },
          height: { xs: 320, md: 540 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      {/* Orb 2 — bottom left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-8%',
          width: { xs: 280, md: 460 },
          height: { xs: 280, md: 460 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      {/* Orb 3 — center cyan accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          left: '10%',
          width: { xs: 200, md: 340 },
          height: { xs: 200, md: 340 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.28) 0%, transparent 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
