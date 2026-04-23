import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { userService } from '@/services/userService'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'

const schema = z
  .object({
    name: z.string().min(1, 'Nome obrigatório').max(200),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
    date_birth: z.string().min(1, 'Data de nascimento obrigatória'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await userService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        date_birth: values.date_birth,
      })
      await login({ email: values.email, password: values.password })
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { detail?: string } } }
      setError(axErr.response?.data?.detail ?? 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 440 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box component="img" src="/logo_finito.png" alt="Finito" sx={{ width: 64, height: 64, objectFit: 'contain', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Criar conta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comece a controlar suas finanças hoje
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome completo"
            autoComplete="name"
            autoFocus
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="E-mail"
            type="email"
            autoComplete="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Data de nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('date_birth')}
            error={!!errors.date_birth}
            helperText={errors.date_birth?.message}
          />

          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            fullWidth
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirmar senha"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 1, py: 1.5 }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Criar conta'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
          Já tem uma conta?{' '}
          <Link component={RouterLink} to={ROUTES.LOGIN} fontWeight={600}>
            Entrar
          </Link>
        </Typography>
      </CardContent>
    </Card>
  )
}
