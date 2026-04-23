import { useNavigate } from 'react-router-dom'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useCreateExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ROUTES } from '@/constants/routes'
import type { ExpenseCreate } from '@/types/expenses'
import { useSnackbar } from 'notistack'

export default function CreateExpensePage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId } = useGroup()
  const createMutation = useCreateExpense()

  const handleSubmit = async (data: ExpenseCreate) => {
    try {
      await createMutation.mutateAsync(data)
      enqueueSnackbar('Despesa criada com sucesso!', { variant: 'success' })
      navigate(ROUTES.EXPENSES)
    } catch {
      enqueueSnackbar('Erro ao criar despesa. Tente novamente.', { variant: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} variant="text">
          Voltar
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={700}>Nova Despesa</Typography>
          <Typography variant="body2" color="text.secondary">
            Registre uma nova despesa no grupo
          </Typography>
        </Box>
      </Box>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <ExpenseForm
            defaultGroupId={activeGroupId ?? ''}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
            submitLabel="Criar Despesa"
          />
        </CardContent>
      </Card>
    </Box>
  )
}
