import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { EXPENSE_CATEGORIES } from '@/constants/categories'
import { EXPENSE_TYPES } from '@/constants/expenseTypes'
import type { ExpenseCreate, ExpenseResponse } from '@/types/expenses'
import type { GroupMemberResponse } from '@/types/groups'
import { fromCents, toCents } from '@/utils/currency'
import { toISODate } from '@/utils/dates'

// ---------- CurrencyInput ----------
interface CurrencyInputProps {
  value: number | undefined
  onChange: (v: number) => void
  error?: boolean
  helperText?: string
}

function CurrencyInput({ value, onChange, error, helperText }: CurrencyInputProps) {
  const toExternalCents = (v: number | undefined) =>
    v !== undefined && !isNaN(v) ? Math.round(v * 100) : 0

  const [cents, setCents] = useState(() => toExternalCents(value))
  const isInternal = useRef(false)

  // Sync when value changes externally (e.g., reset on edit)
  useEffect(() => {
    if (isInternal.current) { isInternal.current = false; return }
    setCents(toExternalCents(value))
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const display = (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = Math.floor(cents / 10)
      setCents(next)
      isInternal.current = true
      onChange(next / 100)
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      const next = cents * 10 + parseInt(e.key, 10)
      if (next > 99_999_999) return // max R$ 999.999,99
      setCents(next)
      isInternal.current = true
      onChange(next / 100)
    }
  }

  return (
    <Box>
      <TextField
        label="Valor"
        fullWidth
        value={display}
        onChange={() => undefined} // fully controlled via keydown
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        InputProps={{
          startAdornment: <InputAdornment position="start">R$</InputAdornment>,
        }}
        error={error}
        sx={{
          '& input': { fontSize: '1.25rem', fontWeight: 600, letterSpacing: 0.5 },
        }}
      />
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'text.secondary'} sx={{ ml: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  )
}
// -----------------------------------

const schema = z.object({
  group_id: z.string().min(1, 'group_id obrigatório'),
  amount: z.number({ invalid_type_error: 'Valor obrigatório' }).positive('Valor deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  type_expense: z.string().min(1, 'Tipo de pagamento obrigatório'),
  spent_by: z.string().min(1, 'Quem pagou é obrigatório').max(100),
  date: z.string().min(1, 'Data obrigatória'),
  note: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

interface ExpenseFormProps {
  defaultGroupId?: string
  initialValues?: ExpenseResponse
  groupUsers?: GroupMemberResponse[]
  onSubmit: (data: ExpenseCreate) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

export function ExpenseForm({
  defaultGroupId = '',
  initialValues,
  groupUsers,
  onSubmit,
  isLoading = false,
  submitLabel = 'Salvar',
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      group_id: defaultGroupId,
      amount: undefined,
      category: '',
      type_expense: '',
      spent_by: '',
      date: toISODate(new Date()),
      note: '',
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        group_id: initialValues.group_id,
        amount: fromCents(initialValues.amount_cents),
        category: initialValues.category,
        type_expense: initialValues.type_expense,
        spent_by: initialValues.spent_by,
        date: initialValues.date.slice(0, 10),
        note: initialValues.note ?? '',
      })
    }
  }, [initialValues, reset])

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit({
      group_id: values.group_id,
      amount_cents: toCents(values.amount),
      category: values.category as ExpenseCreate['category'],
      type_expense: values.type_expense as ExpenseCreate['type_expense'],
      spent_by: values.spent_by,
      date: new Date(values.date).toISOString(),
      note: values.note || null,
    })
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* group_id hidden */}
      <input type="hidden" {...register('group_id')} />

      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <CurrencyInput
            value={field.value}
            onChange={field.onChange}
            error={!!errors.amount}
            helperText={errors.amount?.message}
          />
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.category} size="small">
            <InputLabel>Categoria</InputLabel>
            <Select {...field} label="Categoria">
              {EXPENSE_CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="type_expense"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.type_expense} size="small">
            <InputLabel>Forma de Pagamento</InputLabel>
            <Select {...field} label="Forma de Pagamento">
              {EXPENSE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </MenuItem>
              ))}
            </Select>
            {errors.type_expense && <FormHelperText>{errors.type_expense.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {groupUsers && groupUsers.length > 0 ? (
        <Controller
          name="spent_by"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.spent_by}>
              <InputLabel>Pago por</InputLabel>
              <Select {...field} label="Pago por">
                {groupUsers.map((u) => (
                  <MenuItem key={u.id} value={u.name}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.spent_by && <FormHelperText>{errors.spent_by.message}</FormHelperText>}
            </FormControl>
          )}
        />
      ) : (
        <TextField
          label="Pago por"
          fullWidth
          placeholder="Nome de quem realizou o gasto"
          {...register('spent_by')}
          error={!!errors.spent_by}
          helperText={errors.spent_by?.message}
        />
      )}

      <TextField
        label="Data"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...register('date')}
        error={!!errors.date}
        helperText={errors.date?.message}
      />

      <TextField
        label="Observação (opcional)"
        fullWidth
        multiline
        rows={2}
        {...register('note')}
        error={!!errors.note}
        helperText={errors.note?.message}
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
        sx={{ mt: 1 }}
      >
        {submitLabel}
      </Button>
    </Box>
  )
}
