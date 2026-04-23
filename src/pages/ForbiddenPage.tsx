import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { ArrowBack, Lock } from '@mui/icons-material'

export default function ForbiddenPage() {
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
      <Box
        sx={{
          width: { xs: 80, md: 120 },
          height: { xs: 80, md: 120 },
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Lock sx={{ fontSize: { xs: 40, md: 60 }, color: 'white' }} />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: '5rem', md: '8rem' },
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        403
      </Typography>

      <Typography variant="h4" fontWeight={700}>
        Acesso negado
      </Typography>

      <Typography variant="body1" color="text.secondary" maxWidth={400}>
        Você não tem permissão para acessar este recurso. Se acredita que isso é
        um erro, entre em contato com o administrador.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
        >
          Ir para o Dashboard
        </Button>
      </Box>
    </Box>
  )
}
