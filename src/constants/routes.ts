export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EXPENSES: '/expenses',
  EXPENSES_NEW: '/expenses/new',
  EXPENSES_EDIT: '/expenses/:id/edit',
  EXPENSES_DETAIL: '/expenses/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  GROUPS: '/groups',
  GROUPS_DETAIL: '/groups/:id',
  VERIFY_EMAIL: '/verify-email',
  FORBIDDEN: '/403',
  NOT_FOUND: '*',
} as const;

export const buildExpenseEditPath = (id: string) => `/expenses/${id}/edit`;
export const buildExpenseDetailPath = (id: string) => `/expenses/${id}`;
export const buildGroupDetailPath = (id: string) => `/groups/${id}`;
