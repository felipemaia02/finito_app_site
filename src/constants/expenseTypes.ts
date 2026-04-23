import type { ExpenseType } from '@/types/expenses';

export const EXPENSE_TYPES: {
  value: ExpenseType;
  label: string;
  icon: string;
}[] = [
  { value: 'credit_card', label: 'Cartão de Crédito', icon: '💳' },
  { value: 'debit_card', label: 'Cartão de Débito', icon: '🏧' },
  { value: 'pix_transfer', label: 'Pix / Transferência', icon: '📲' },
  { value: 'cash', label: 'Dinheiro', icon: '💵' },
];

export const EXPENSE_TYPE_COLORS: Record<ExpenseType, string> = {
  credit_card: '#6366f1',
  debit_card: '#10b981',
  pix_transfer: '#06b6d4',
  cash: '#f59e0b',
};
