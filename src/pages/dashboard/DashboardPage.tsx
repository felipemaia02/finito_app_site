import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Grid,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  AccountBalanceWallet,
  ReceiptLong,
  TrendingDown,
  Group as GroupIcon,
  Refresh,
} from '@mui/icons-material'
import { useExpenses, useDeleteExpense } from '@/hooks/useExpenses'
import { useGroup } from '@/hooks/useGroup'
import { useMyGroups } from '@/hooks/useGroups'
import { computeDashboardSummaryFromExpenses } from '@/utils/analytics'
import { formatCurrency } from '@/utils/currency'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { PaymentTypeChart } from '@/components/dashboard/PaymentTypeChart'
import { CategoryRanking } from '@/components/dashboard/CategoryRanking'
import { RecentExpensesCard } from '@/components/expenses/ExpenseTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SummaryCardsSkeleton, ChartSkeleton, TableSkeleton } from '@/components/common/LoadingSkeleton'
import { ROUTES } from '@/constants/routes'
import type { ExpenseResponse } from '@/types/expenses'
import { useSnackbar } from 'notistack'
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal'

const CURRENT_MONTH = new Date().toISOString().slice(0, 7) // YYYY-MM

export default function DashboardPage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { activeGroupId, setActiveGroup } = useGroup()
  const { data: allGroups = [] } = useMyGroups()
  const [deleteTarget, setDeleteTarget] = useState<ExpenseResponse | null>(null)
  const [periodFilter, setPeriodFilter] = useState<string>(CURRENT_MONTH)
  const [createOpen, setCreateOpen] = useState(false)

  const {
    data: expenses = [],
    isLoading: expensesLoading,
    error: expensesError,
    refetch,
  } = useExpenses(activeGroupId)

  const deleteMutation = useDeleteExpense(activeGroupId ?? '')

  // Filter expenses by period
  const filteredExpenses = expenses.filter((e) => {
    if (!periodFilter) return true
    return e.date.startsWith(periodFilter)
  })

  const summary = computeDashboardSummaryFromExpenses(filteredExpenses)
  const isLoading = expensesLoading

  // Generate last 6 months for filter
  const months: { value: string; label: string }[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const val = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    months.push({ value: val, label: label.charAt(0).toUpperCase() + label.slice(1) })
  }

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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GroupIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          Selecione um grupo
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={400}>
          Para visualizar o dashboard, você precisa informar o Group ID do seu grupo de despesas.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<GroupIcon />}
          onClick={() => navigate(ROUTES.GROUPS)}
        >
          Configurar Grupo
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip
              icon={<GroupIcon />}
              label={`Grupo: ${allGroups.find((g) => g.id === activeGroupId)?.group_name ?? activeGroupId.slice(0, 12) + '...'}`}
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => navigate(ROUTES.GROUPS)}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Group selector */}
          {allGroups.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Grupo ativo</InputLabel>
              <Select
                value={activeGroupId ?? ''}
                label="Grupo ativo"
                onChange={(e) => setActiveGroup(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {allGroups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>{g.group_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Period filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={periodFilter}
              label="Período"
              onChange={(e) => setPeriodFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Todos os períodos</MenuItem>
              {months.map((m) => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Atualizar dados">
            <IconButton onClick={() => void refetch()} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            size="small"
          >
            Nova Despesa
          </Button>
        </Box>
      </Box>

      {expensesError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Erro ao carregar dados. Verifique o Group ID ou tente novamente.
        </Alert>
      )}

      {/* Summary cards */}
      {isLoading ? (
        <SummaryCardsSkeleton />
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Total Gasto"
              value={formatCurrency(summary.total_cents)}
              subtitle={`${summary.count} despesa(s)`}
              icon={AccountBalanceWallet}
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Qtd. de Despesas"
              value={String(summary.count)}
              subtitle="no período selecionado"
              icon={ReceiptLong}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Maior Gasto"
              value={summary.by_category[0] ? formatCurrency(summary.by_category[0].total_cents) : 'R$ 0,00'}
              subtitle={summary.by_category[0] ? `Categoria: ${summary.by_category[0].category}` : '—'}
              icon={TrendingDown}
              color="#ef4444"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard
              title="Ticket Médio"
              value={summary.count > 0 ? formatCurrency(Math.round(summary.total_cents / summary.count)) : 'R$ 0,00'}
              subtitle="por despesa"
              icon={ReceiptLong}
              color="#f59e0b"
            />
          </Grid>
        </Grid>
      )}

      {/* Charts row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          {isLoading ? <ChartSkeleton height={340} /> : <CategoryChart data={summary.by_category} />}
        </Grid>
        <Grid item xs={12} md={6}>
          {isLoading ? <ChartSkeleton height={340} /> : <PaymentTypeChart data={summary.by_payment_type} />}
        </Grid>
      </Grid>

      {/* Category ranking + recent expenses */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          {isLoading ? <ChartSkeleton height={340} /> : <CategoryRanking data={summary.by_category} />}
        </Grid>
        <Grid item xs={12} md={7}>
          {isLoading ? (
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
              <TableSkeleton rows={6} />
            </Box>
          ) : (
            <RecentExpensesCard
              expenses={filteredExpenses.slice(0, 8)}
              onDelete={(e) => setDeleteTarget(e)}
            />
          )}
        </Grid>
      </Grid>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir despesa"
        message={`Tem certeza que deseja excluir esta despesa de ${deleteTarget ? formatCurrency(deleteTarget.amount_cents) : ''}? Esta ação não pode ser desfeita.`}
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
