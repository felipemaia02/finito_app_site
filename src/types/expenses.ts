// ============================================================
// Expense Types — based on OpenAPI schemas
// ============================================================

export type ExpenseCategory =
  | 'transportation'
  | 'entertainment'
  | 'utilities'
  | 'healthcare'
  | 'education'
  | 'shopping'
  | 'subscriptions'
  | 'personal_care'
  | 'home'
  | 'bills'
  | 'work'
  | 'gifts'
  | 'insurance'
  | 'savings'
  | 'investments'
  | 'pet'
  | 'groceries'
  | 'restaurants'
  | 'gas'
  | 'car'
  | 'other';

export type ExpenseType =
  | 'credit_card'
  | 'debit_card'
  | 'pix_transfer'
  | 'cash';

export interface ExpenseCreate {
  group_id: string;
  amount_cents: number;
  category: ExpenseCategory;
  type_expense: ExpenseType;
  spent_by: string;
  date?: string | null;
  note?: string | null;
}

export interface ExpenseUpdate {
  amount_cents?: number | null;
  category?: ExpenseCategory | null;
  type_expense?: ExpenseType | null;
  spent_by?: string | null;
  date?: string | null;
  note?: string | null;
}

export interface ExpenseResponse {
  id: string;
  group_id: string;
  amount_cents: number;
  category: ExpenseCategory;
  type_expense: ExpenseType;
  spent_by: string;
  date: string;
  note: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Analytics endpoint returns free-form objects
export interface AnalyticsItem {
  amount_cents: number;
  type_expense: ExpenseType;
  category?: ExpenseCategory;
  [key: string]: unknown;
}

// Derived types for dashboard calculations
export interface CategorySummary {
  category: ExpenseCategory;
  total_cents: number;
  count: number;
  percentage: number;
}

export interface PaymentTypeSummary {
  type_expense: ExpenseType;
  total_cents: number;
  count: number;
  percentage: number;
}

export interface DashboardSummary {
  total_cents: number;
  count: number;
  by_category: CategorySummary[];
  by_payment_type: PaymentTypeSummary[];
}
