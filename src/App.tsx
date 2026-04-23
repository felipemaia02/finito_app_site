import { RouterProvider } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from '@/context/AuthContext'
import { GroupProvider } from '@/context/GroupContext'
import { ThemeProvider, useThemeContext } from '@/context/ThemeContext'
import { queryClient } from '@/app/queryClient'
import { lightTheme, darkTheme } from '@/theme'
import { router } from '@/routes'

function ThemedApp() {
  const { mode } = useThemeContext()
  return (
    <MuiThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3500}
      >
        <AuthProvider>
          <GroupProvider>
            <RouterProvider router={router} />
          </GroupProvider>
        </AuthProvider>
      </SnackbarProvider>
    </MuiThemeProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
