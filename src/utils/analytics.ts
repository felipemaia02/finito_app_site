import type {
  AnalyticsItem,
  CategorySummary,
  DashboardSummary,
  ExpenseResponse,
  PaymentTypeSummary,
} from '@/types/expenses';
import type { ExpenseCategory, ExpenseType } from '@/types/expenses';

export function computeDashboardSummary(
  items: AnalyticsItem[],
): DashboardSummary {
  if (!items.length) {
    return { total_cents: 0, count: 0, by_category: [], by_payment_type: [] };
  }

  const total_cents = items.reduce((sum, i) => sum + (i.amount_cents || 0), 0);
  const count = items.length;

  // Group by category
  const categoryMap = new Map<
    ExpenseCategory,
    { total: number; count: number }
  >();
  for (const item of items) {
    const cat =
      (item.category as ExpenseCategory) ?? ('other' as ExpenseCategory);
    const prev = categoryMap.get(cat) ?? { total: 0, count: 0 };
    categoryMap.set(cat, {
      total: prev.total + (item.amount_cents || 0),
      count: prev.count + 1,
    });
  }

  const by_category: CategorySummary[] = Array.from(categoryMap.entries())
    .map(([category, { total, count: c }]) => ({
      category,
      total_cents: total,
      count: c,
      percentage: total_cents > 0 ? Math.round((total / total_cents) * 100) : 0,
    }))
    .sort((a, b) => b.total_cents - a.total_cents);

  // Group by payment type
  const typeMap = new Map<ExpenseType, { total: number; count: number }>();
  for (const item of items) {
    const t = item.type_expense as ExpenseType;
    const prev = typeMap.get(t) ?? { total: 0, count: 0 };
    typeMap.set(t, {
      total: prev.total + (item.amount_cents || 0),
      count: prev.count + 1,
    });
  }

  const by_payment_type: PaymentTypeSummary[] = Array.from(typeMap.entries())
    .map(([type_expense, { total, count: c }]) => ({
      type_expense,
      total_cents: total,
      count: c,
      percentage: total_cents > 0 ? Math.round((total / total_cents) * 100) : 0,
    }))
    .sort((a, b) => b.total_cents - a.total_cents);

  return { total_cents, count, by_category, by_payment_type };
}

/**
 * Computes dashboard summary from full ExpenseResponse list.
 * Use this instead of computeDashboardSummary when you need category breakdown,
 * because the analytics endpoint does not return `category`.
 */
export function computeDashboardSummaryFromExpenses(
  expenses: ExpenseResponse[],
): DashboardSummary {
  const items: AnalyticsItem[] = expenses.map((e) => ({
    amount_cents: e.amount_cents,
    type_expense: e.type_expense,
    category: e.category,
    date: e.date,
  }));
  return computeDashboardSummary(items);
}
