import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  alpha,
} from '@mui/material'
import { ArrowBack, Delete, Edit } from '@mui/icons-material'
import { useExpenseDetail, useDeleteExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { getCategoryEmoji, getCategoryLabel, getExpenseTypeLabel, getExpenseTypeIcon } from '@/utils/labels'
import { formatCurrency } from '@/utils/currency'
import { formatDateTime } from '@/utils/dates'
import { CATEGORY_COLORS } from '@/constants/categories'
import { ROUTES, buildExpenseEditPath } from '@/constants/routes'
import { useSnackbar } from 'notistack'

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId } = useGroup()
  const { data: expense, isLoading, error } = useExpenseDetail(id ?? null)
  const deleteMutation = useDeleteExpense(activeGroupId ?? '')
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteMutation.mutateAsync(id)
      enqueueSnackbar('Despesa excluída com sucesso', { variant: 'success' })
      navigate(ROUTES.EXPENSES)
    } catch {
      enqueueSnackbar('Erro ao excluir despesa', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="text">
            Voltar
          </Button>
          <Typography variant="h4" fontWeight={700}>Detalhe da Despesa</Typography>
        </Box>
        {expense && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<Edit />} variant="outlined" onClick={() => navigate(buildExpenseEditPath(expense.id))}>
              Editar
            </Button>
            <Button startIcon={<Delete />} variant="outlined" color="error" onClick={() => setShowDelete(true)}>
              Excluir
            </Button>
          </Box>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>Despesa não encontrada.</Alert>}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      ) : expense ? (
        <Grid container spacing={3}>
          {/* Main info */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                {/* Category badge */}
                {(() => {
                  const color = CATEGORY_COLORS[expense.category]
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 4,
                          bgcolor: alpha(color, 0.15),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                        }}
                      >
                        {getCategoryEmoji(expense.category)}
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight={700}>
                          {getCategoryLabel(expense.category)}
                        </Typography>
                        <Chip
                          label={getExpenseTypeLabel(expense.type_expense)}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 600, mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  )
                })()}

                {/* Amount */}
                <Typography variant="h3" fontWeight={800} color="error.main" sx={{ mb: 3, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(expense.amount_cents)}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                      Pago por
                    </Typography>
                    <Typography variant="body1" fontWeight={600} mt={0.5}>
                      {expense.spent_by}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                      Data
                    </Typography>
                    <Typography variant="body1" fontWeight={600} mt={0.5}>
                      {formatDateTime(expense.date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                      Pagamento
                    </Typography>
                    <Typography variant="body1" fontWeight={600} mt={0.5}>
                      {getExpenseTypeIcon(expense.type_expense)} {getExpenseTypeLabel(expense.type_expense)}
                    </Typography>
                  </Grid>
                  {expense.note && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
                        Observação
                      </Typography>
                      <Typography variant="body1" mt={0.5}>
                        {expense.note}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Metadata */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Metadados
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      ID da despesa
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all', mt: 0.5 }}>
                      {expense.id}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      Criado em
                    </Typography>
                    <Typography variant="body2" mt={0.5}>{formatDateTime(expense.created_at)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      Atualizado em
                    </Typography>
                    <Typography variant="body2" mt={0.5}>{formatDateTime(expense.updated_at)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.75 }}>
                      <Chip
                        label={expense.is_deleted ? 'Excluído' : 'Ativo'}
                        size="small"
                        color={expense.is_deleted ? 'error' : 'success'}
                        sx={{ borderRadius: 2 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : null}

      <ConfirmDialog
        open={showDelete}
        title="Excluir despesa"
        message="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setShowDelete(false)}
      />
    </Box>
  )
}
