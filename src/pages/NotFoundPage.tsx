import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { Home } from '@mui/icons-material'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        gap: 3,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '6rem', md: '10rem' },
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        Página não encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={400}>
        A página que você está procurando não existe ou foi removida.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<Home />}
        onClick={() => navigate('/dashboard')}
      >
        Voltar para o início
      </Button>
    </Box>
  )
}
