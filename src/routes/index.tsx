import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Box, CircularProgress } from '@mui/material'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const ExpensesListPage = lazy(() => import('@/pages/expenses/ExpensesListPage'))
const EditExpensePage = lazy(() => import('@/pages/expenses/EditExpensePage'))
const ExpenseDetailPage = lazy(() => import('@/pages/expenses/ExpenseDetailPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
const GroupSelectorPage = lazy(() => import('@/pages/groups/GroupsPage'))
const GroupDetailPage = lazy(() => import('@/pages/groups/GroupDetailPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const PageLoader = () => (
  <Box display="flex" alignItems="center" justifyContent="center" minHeight="60vh">
    <CircularProgress size={40} />
  </Box>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: (
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.REGISTER,
            element: (
              <Suspense fallback={<PageLoader />}>
                <RegisterPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.EXPENSES,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ExpensesListPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.EXPENSES_EDIT,
            element: (
              <Suspense fallback={<PageLoader />}>
                <EditExpensePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.EXPENSES_DETAIL,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ExpenseDetailPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <SettingsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.GROUPS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <GroupSelectorPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.GROUPS_DETAIL,
            element: (
              <Suspense fallback={<PageLoader />}>
                <GroupDetailPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
])
