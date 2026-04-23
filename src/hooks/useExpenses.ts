import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '@/services/expenseService';
import type { ExpenseCreate, ExpenseUpdate } from '@/types/expenses';

export const EXPENSE_KEYS = {
  all: ['expenses'] as const,
  byGroup: (groupId: string) => ['expenses', 'group', groupId] as const,
  detail: (id: string) => ['expenses', 'detail', id] as const,
  analytics: (groupId: string) => ['expenses', 'analytics', groupId] as const,
};

export function useExpenses(groupId: string | null, skip = 0, limit = 100) {
  return useQuery({
    queryKey: groupId ? EXPENSE_KEYS.byGroup(groupId) : ['expenses', 'empty'],
    queryFn: () => expenseService.listByGroup(groupId!, skip, limit),
    enabled: !!groupId,
  });
}

export function useExpenseDetail(expenseId: string | null) {
  return useQuery({
    queryKey: expenseId
      ? EXPENSE_KEYS.detail(expenseId)
      : ['expenses', 'empty'],
    queryFn: () => expenseService.getDetails(expenseId!),
    enabled: !!expenseId,
  });
}

export function useExpenseAnalytics(groupId: string | null) {
  return useQuery({
    queryKey: groupId
      ? EXPENSE_KEYS.analytics(groupId)
      : ['expenses', 'analytics', 'empty'],
    queryFn: () => expenseService.getAnalytics(groupId!),
    enabled: !!groupId,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ExpenseCreate) => expenseService.create(data),
    onSuccess: (_, variables) => {
      void qc.invalidateQueries({
        queryKey: EXPENSE_KEYS.byGroup(variables.group_id),
      });
      void qc.invalidateQueries({
        queryKey: EXPENSE_KEYS.analytics(variables.group_id),
      });
    },
  });
}

export function useUpdateExpense(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseUpdate }) =>
      expenseService.update(id, data),
    onSuccess: (expense) => {
      void qc.invalidateQueries({ queryKey: EXPENSE_KEYS.byGroup(groupId) });
      void qc.invalidateQueries({ queryKey: EXPENSE_KEYS.analytics(groupId) });
      void qc.invalidateQueries({ queryKey: EXPENSE_KEYS.detail(expense.id) });
    },
  });
}

export function useDeleteExpense(groupId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: string) => expenseService.delete(expenseId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: EXPENSE_KEYS.byGroup(groupId) });
      void qc.invalidateQueries({ queryKey: EXPENSE_KEYS.analytics(groupId) });
    },
  });
}
