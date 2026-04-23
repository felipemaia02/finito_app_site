import { useNavigate, useParams } from 'react-router-dom'
import { Box, Card, CardContent, CircularProgress, Typography, Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useExpenseDetail, useUpdateExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ROUTES } from '@/constants/routes'
import type { ExpenseCreate } from '@/types/expenses'
import { useSnackbar } from 'notistack'

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId } = useGroup()
  const { data: expense, isLoading } = useExpenseDetail(id ?? null)
  const updateMutation = useUpdateExpense(activeGroupId ?? '')

  const handleSubmit = async (data: ExpenseCreate) => {
    if (!id) return
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          amount_cents: data.amount_cents,
          category: data.category,
          type_expense: data.type_expense,
          spent_by: data.spent_by,
          date: data.date ?? undefined,
          note: data.note,
        },
      })
      enqueueSnackbar('Despesa atualizada com sucesso!', { variant: 'success' })
      navigate(ROUTES.EXPENSES)
    } catch {
      enqueueSnackbar('Erro ao atualizar despesa.', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="text">
          Voltar
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>Editar Despesa</Typography>
          <Typography variant="body2" color="text.secondary">
            Altere os dados da despesa
          </Typography>
        </Box>
      </Box>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : expense ? (
            <ExpenseForm
              initialValues={expense}
              defaultGroupId={expense.group_id}
              onSubmit={handleSubmit}
              isLoading={updateMutation.isPending}
              submitLabel="Salvar Alterações"
            />
          ) : (
            <Typography color="error">Despesa não encontrada.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
