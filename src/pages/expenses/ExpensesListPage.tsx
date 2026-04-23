import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Pagination,
  Card,
  CardContent,
} from '@mui/material'
import { Add as AddIcon, SearchOutlined } from '@mui/icons-material'
import { useExpenses, useDeleteExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { ExpenseTable } from '@/components/expenses/ExpenseTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { TableSkeleton } from '@/components/common/LoadingSkeleton'
import { ReceiptLong, Group as GroupIcon } from '@mui/icons-material'
import { ROUTES } from '@/constants/routes'
import type { ExpenseResponse } from '@/types/expenses'
import { EXPENSE_CATEGORIES } from '@/constants/categories'
import { formatCurrency } from '@/utils/currency'
import { useSnackbar } from 'notistack'
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal'

const PAGE_SIZE = 20

export default function ExpensesListPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId } = useGroup()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<ExpenseResponse | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: expenses = [], isLoading, error } = useExpenses(activeGroupId)
  const deleteMutation = useDeleteExpense(activeGroupId ?? '')

  const filtered = expenses.filter((e) => {
    const matchesSearch =
      !search ||
      e.spent_by.toLowerCase().includes(search.toLowerCase()) ||
      (e.note ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || e.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalFiltered = filtered.reduce((s, e) => s + e.amount_cents, 0)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      enqueueSnackbar('Despesa excluída com sucesso', { variant: 'success' })
      setDeleteTarget(null)
    } catch {
      enqueueSnackbar('Erro ao excluir despesa', { variant: 'error' })
    }
  }

  if (!activeGroupId) {
    return (
      <EmptyState
        icon={GroupIcon}
        title="Nenhum grupo selecionado"
        description="Configure um grupo para visualizar as despesas"
        action={
          <Button variant="contained" onClick={() => navigate(ROUTES.GROUPS)}>
            Configurar Grupo
          </Button>
        }
      />
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Despesas</Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} despesa(s) — Total: {formatCurrency(totalFiltered)}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Nova Despesa
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por pessoa ou nota..."
              size="small"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              sx={{ flex: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoria"
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
              >
                <MenuItem value="">Todas</MenuItem>
                {EXPENSE_CATEGORIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>{c.emoji} {c.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>Erro ao carregar despesas.</Alert>}

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          {isLoading ? (
            <Box sx={{ p: 2 }}>
              <TableSkeleton rows={8} />
            </Box>
          ) : paginated.length === 0 ? (
            <EmptyState
              icon={ReceiptLong}
              title="Nenhuma despesa encontrada"
              description={search || categoryFilter ? 'Tente ajustar os filtros' : 'Comece adicionando uma despesa'}
              action={
                !search && !categoryFilter ? (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(ROUTES.EXPENSES_NEW)}>
                    Nova Despesa
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <ExpenseTable expenses={paginated} onDelete={(e) => setDeleteTarget(e)} />
              {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir despesa"
        message={`Tem certeza que deseja excluir esta despesa de ${deleteTarget ? formatCurrency(deleteTarget.amount_cents) : ''}?`}
        confirmLabel="Excluir"
        danger
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
      />

      <CreateExpenseModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}
