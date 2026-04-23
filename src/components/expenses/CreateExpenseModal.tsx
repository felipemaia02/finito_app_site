import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Chip } from '@mui/material'
import { Close, Group as GroupIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'
import { ExpenseForm } from './ExpenseForm'
import { useCreateExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { useGroupFromCache } from '@/hooks/useGroups'
import type { ExpenseCreate } from '@/types/expenses'

interface CreateExpenseModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CreateExpenseModal({ open, onClose, onSuccess }: CreateExpenseModalProps) {
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId } = useGroup()
  const { data: group } = useGroupFromCache(open ? activeGroupId : null)
  const createMutation = useCreateExpense()

  const handleSubmit = async (data: ExpenseCreate) => {
    try {
      await createMutation.mutateAsync(data)
      enqueueSnackbar('Despesa criada com sucesso!', { variant: 'success' })
      onClose()
      onSuccess?.()
    } catch {
      enqueueSnackbar('Erro ao criar despesa. Tente novamente.', { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>Nova Despesa</Typography>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {group && (
          <Chip
            icon={<GroupIcon fontSize="small" />}
            label={group.group_name}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 2, borderRadius: 2 }}
          />
        )}
        <ExpenseForm
          defaultGroupId={activeGroupId ?? ''}
          groupUsers={group?.users}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          submitLabel="Criar Despesa"
        />
      </DialogContent>
    </Dialog>
  )
}
