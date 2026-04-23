import { EXPENSE_CATEGORIES } from '@/constants/categories';
import { EXPENSE_TYPES } from '@/constants/expenseTypes';
import type { ExpenseCategory, ExpenseType } from '@/types/expenses';

export function getCategoryLabel(category: ExpenseCategory): string {
  return (
    EXPENSE_CATEGORIES.find((c) => c.value === category)?.label ?? category
  );
}

export function getCategoryEmoji(category: ExpenseCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.emoji ?? '📌';
}

export function getExpenseTypeLabel(type: ExpenseType): string {
  return EXPENSE_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getExpenseTypeIcon(type: ExpenseType): string {
  return EXPENSE_TYPES.find((t) => t.value === type)?.icon ?? '💳';
}
