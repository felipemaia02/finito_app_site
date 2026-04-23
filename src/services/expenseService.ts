import api from './api';
import type {
  AnalyticsItem,
  ExpenseCreate,
  ExpenseResponse,
  ExpenseUpdate,
} from '@/types/expenses';

export const expenseService = {
  create(data: ExpenseCreate): Promise<ExpenseResponse> {
    return api.post<ExpenseResponse>('/expenses', data).then((r) => r.data);
  },

  listByGroup(
    groupId: string,
    skip = 0,
    limit = 100,
  ): Promise<ExpenseResponse[]> {
    return api
      .get<
        ExpenseResponse[]
      >(`/expenses/${groupId}`, { params: { skip, limit } })
      .then((r) => r.data);
  },

  getDetails(expenseId: string): Promise<ExpenseResponse> {
    return api
      .get<ExpenseResponse>(`/expenses/${expenseId}/details`)
      .then((r) => r.data);
  },

  update(expenseId: string, data: ExpenseUpdate): Promise<ExpenseResponse> {
    return api
      .patch<ExpenseResponse>(`/expenses/${expenseId}`, data)
      .then((r) => r.data);
  },

  delete(expenseId: string): Promise<void> {
    return api.delete(`/expenses/${expenseId}`).then(() => undefined);
  },

  getAnalytics(groupId: string): Promise<AnalyticsItem[]> {
    return api
      .get<AnalyticsItem[]>(`/expenses/${groupId}/analytics`)
      .then((r) => r.data);
  },
};
