import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { MarkEmailRead } from '@mui/icons-material'
import { authService } from '@/services/authService'
import { saveTokens } from '@/services/api'
import { ROUTES } from '@/constants/routes'

interface LocationState {
  verificationToken?: string
}

export default function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const verificationToken = state?.verificationToken ?? null

  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resendDisabled, setResendDisabled] = useState(false)

  // Cooldown timer for resend button (60 s)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [])

  // If page was reached without a token (e.g. direct URL access), redirect to register
  if (!verificationToken) {
    return (
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Nenhum token de verificação encontrado. Por favor, faça o cadastro novamente.
          </Typography>
          <Button variant="contained" component={RouterLink} to={ROUTES.REGISTER}>
            Voltar ao cadastro
          </Button>
        </CardContent>
      </Card>
    )
  }

  const handleVerify = async () => {
    if (code.trim().length !== 6) {
      setError('Digite o código de 6 dígitos enviado para o seu e-mail.')
      return
    }
    setError(null)
    setSuccessMessage(null)
    setIsVerifying(true)
    try {
      const tokens = await authService.verifyEmail(code.trim(), verificationToken)
      saveTokens(tokens.access_token, tokens.refresh_token, tokens.expires_at)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: { detail?: string } } }
      const status = axErr.response?.status
      if (status === 401) {
        // Token expired — must register again
        setError(
          'O link de verificação expirou (30 min). Por favor, faça o cadastro novamente.',
        )
      } else {
        setError(
          axErr.response?.data?.detail ??
            'Código inválido ou expirado. Verifique o código e tente novamente.',
        )
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setSuccessMessage(null)
    setIsResending(true)
    try {
      const res = await authService.resendVerification(verificationToken)
      setSuccessMessage(res.message)
      // Disable resend for 60 s to avoid spam clicks
      setResendDisabled(true)
      cooldownRef.current = setTimeout(() => setResendDisabled(false), 60_000)
    } catch (err: unknown) {
      const axErr = err as { response?: { status?: number; data?: { detail?: string } } }
      const status = axErr.response?.status
      if (status === 422) {
        // Limit reached — hide resend permanently for this session
        setResendDisabled(true)
        setError(
          'Limite de reenvios atingido. Se precisar de ajuda, entre em contato com o suporte.',
        )
      } else if (status === 401) {
        setError('Token de verificação inválido ou expirado. Faça o cadastro novamente.')
      } else {
        setError(axErr.response?.data?.detail ?? 'Erro ao reenviar o código. Tente novamente.')
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 440 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <MarkEmailRead sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Verifique seu e-mail
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enviamos um código de 6 dígitos para o seu e-mail. Ele é válido por 15 minutos.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}{' '}
            {error.includes('expirou') && (
              <Link component={RouterLink} to={ROUTES.REGISTER} fontWeight={600}>
                Cadastrar novamente
              </Link>
            )}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Código de verificação"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            autoFocus
          />

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={isVerifying || code.length !== 6}
            onClick={handleVerify}
            sx={{ py: 1.5 }}
          >
            {isVerifying ? <CircularProgress size={22} color="inherit" /> : 'Verificar'}
          </Button>

          {!resendDisabled && (
            <Button
              variant="text"
              size="small"
              fullWidth
              disabled={isResending}
              onClick={handleResend}
            >
              {isResending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                'Reenviar código'
              )}
            </Button>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
          Conta errada?{' '}
          <Link component={RouterLink} to={ROUTES.REGISTER} fontWeight={600}>
            Voltar ao cadastro
          </Link>
        </Typography>
      </CardContent>
    </Card>
  )
}
