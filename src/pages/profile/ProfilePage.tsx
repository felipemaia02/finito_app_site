import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { Edit, Save } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useUpdateUser, useDeleteUser } from '@/hooks/useUsers'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatDate, formatDateTime } from '@/utils/dates'
import { useSnackbar } from 'notistack'

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(200),
  email: z.string().email('E-mail inválido'),
  date_birth: z.string().min(1, 'Data de nascimento obrigatória'),
})

type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      date_birth: user?.date_birth ?? '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (!user) return
    try {
      await updateMutation.mutateAsync({ userId: user.id, data: values })
      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' })
      setEditing(false)
    } catch {
      enqueueSnackbar('Erro ao atualizar perfil.', { variant: 'error' })
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return
    try {
      await deleteMutation.mutateAsync(user.id)
    } catch {
      enqueueSnackbar('Erro ao excluir conta.', { variant: 'error' })
    }
  }

  function getInitials(name: string) {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
  }

  if (!user) return null

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Perfil
      </Typography>

      <Grid container spacing={3}>
        {/* Profile card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <CardContent>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>NASCIMENTO</Typography>
                  <Typography variant="body2">{formatDate(user.date_birth)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>MEMBRO DESDE</Typography>
                  <Typography variant="body2">{formatDateTime(user.created_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>ID</Typography>
                  <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                    {user.id}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Informações pessoais</Typography>
                {!editing && (
                  <Button
                    startIcon={<Edit />}
                    variant="outlined"
                    onClick={() => {
                      reset({ name: user.name, email: user.email, date_birth: user.date_birth })
                      setEditing(true)
                    }}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              {editing ? (
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Nome completo"
                    fullWidth
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    label="E-mail"
                    type="email"
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
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Save />}
                      disabled={isSubmitting}
                    >
                      Salvar
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(false)}>
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    { label: 'Nome completo', value: user.name },
                    { label: 'E-mail', value: user.email },
                    { label: 'Data de nascimento', value: formatDate(user.date_birth) },
                  ].map((f) => (
                    <Box key={f.label}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                        {f.label}
                      </Typography>
                      <Typography variant="body1" fontWeight={500} mt={0.5}>{f.value}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ my: 4 }} />

              {/* Danger zone */}
              <Box>
                <Typography variant="h6" fontWeight={700} color="error" gutterBottom>
                  Zona de Perigo
                </Typography>
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                  Excluir sua conta é uma ação permanente e não pode ser desfeita.
                </Alert>
                <Button variant="outlined" color="error" onClick={() => setShowDelete(true)}>
                  Excluir minha conta
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={showDelete}
        title="Excluir conta"
        message="Tem certeza que deseja excluir sua conta? Esta ação é permanente e não pode ser desfeita."
        confirmLabel="Excluir conta"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDeleteAccount()}
        onCancel={() => setShowDelete(false)}
      />
    </Box>
  )
}
