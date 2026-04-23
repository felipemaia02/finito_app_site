import type { ExpenseCategory } from '@/types/expenses';

export const EXPENSE_CATEGORIES: {
  value: ExpenseCategory;
  label: string;
  emoji: string;
}[] = [
  { value: 'transportation', label: 'Transporte', emoji: '🚗' },
  { value: 'entertainment', label: 'Entretenimento', emoji: '🎬' },
  { value: 'utilities', label: 'Utilidades', emoji: '💡' },
  { value: 'healthcare', label: 'Saúde', emoji: '🏥' },
  { value: 'education', label: 'Educação', emoji: '📚' },
  { value: 'shopping', label: 'Compras', emoji: '🛍️' },
  { value: 'subscriptions', label: 'Assinaturas', emoji: '📱' },
  { value: 'personal_care', label: 'Cuidados Pessoais', emoji: '💆' },
  { value: 'home', label: 'Casa', emoji: '🏠' },
  { value: 'bills', label: 'Contas', emoji: '📄' },
  { value: 'work', label: 'Trabalho', emoji: '💼' },
  { value: 'gifts', label: 'Presentes', emoji: '🎁' },
  { value: 'insurance', label: 'Seguros', emoji: '🛡️' },
  { value: 'savings', label: 'Poupança', emoji: '🏦' },
  { value: 'investments', label: 'Investimentos', emoji: '📈' },
  { value: 'pet', label: 'Pet', emoji: '🐾' },
  { value: 'groceries', label: 'Mercado', emoji: '🛒' },
  { value: 'restaurants', label: 'Restaurantes', emoji: '🍽️' },
  { value: 'gas', label: 'Combustível', emoji: '⛽' },
  { value: 'car', label: 'Carro', emoji: '🚘' },
  { value: 'other', label: 'Outros', emoji: '📌' },
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  transportation: '#6366f1',
  entertainment: '#ec4899',
  utilities: '#f59e0b',
  healthcare: '#10b981',
  education: '#3b82f6',
  shopping: '#8b5cf6',
  subscriptions: '#06b6d4',
  personal_care: '#f97316',
  home: '#84cc16',
  bills: '#ef4444',
  work: '#64748b',
  gifts: '#e879f9',
  insurance: '#0ea5e9',
  savings: '#22c55e',
  investments: '#16a34a',
  pet: '#d97706',
  groceries: '#dc2626',
  restaurants: '#db2777',
  gas: '#9333ea',
  car: '#475569',
  other: '#94a3b8',
};
